import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Column,
  Entity,
  EntityManager,
  EntityRepository,
  getRepository,
} from "typeorm";

import { stubConfig } from "./__helpers__";
import { Repository } from "~/domain/common/contracts";
import { BaseEntity } from "~/infrastructure/database/entities/BaseEntity";
import { BaseRepository } from "~/infrastructure/database/repositories/BaseRepository";
import { Env } from "~/utils/classes";

@Entity()
class User extends BaseEntity {
  @Column({ unique: true })
  email: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  picture?: string;
}

@EntityRepository(User)
class UserRepo extends BaseRepository<User> implements Repository<User> {
  constructor(manager: EntityManager) {
    super(manager, User);
  }
}

describe("infrastructure/repositories/BaseRepository", () => {
  const user = {
    email: "test@email.com",
    name: "jon",
  };
  const user1 = {
    email: "test1@email.com",
    name: "test1",
  };
  const user2 = {
    email: "test2@email.com",
    name: "test1",
  };
  let app: INestApplication;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      exports: [UserRepo],
      imports: [
        ConfigModule.forRoot({
          envFilePath: Env.getEnvFilePath(),
          isGlobal: true,
          load: [stubConfig],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            ...configService.get("db"),
            entities: [User],
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [UserRepo],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepo = moduleFixture.get<Repository<User>>(UserRepo);

    await app.init();
  });

  afterEach(async () => {
    await userRepo.flush();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("create()", () => {
    it("should insert one row successfully", async () => {
      const created = await userRepo.create(user);

      expect(typeof created.id).toBe("number");
      expect(created.email).toBe(user.email);
    });

    it("should insert multiple rows successfully", async () => {
      const [created1, created2] = await userRepo.create([user1, user2]);

      expect(created1.email).toBe(user1.email);
      expect(created2.email).toBe(user2.email);
    });
  });

  describe("find()", () => {
    beforeEach(async () => {
      await userRepo.create([user1, user2]);
    });

    it("should find all rows", async () => {
      const users = await userRepo.find();
      expect(users[0].email).toBe(user1.email);
      expect(users[1].email).toBe(user2.email);
    });

    it("should find with where", async () => {
      const [user] = await userRepo.find({ email: user1.email });
      expect(user.email).toBe(user1.email);
    });

    // eslint-disable-next-line sonarjs/no-duplicate-string
    it("should allow sorting", async () => {
      const users = await userRepo.find(null, { sortBy: { email: "DESC" } });
      expect(users[0].email).toBe(user2.email);
      expect(users[1].email).toBe(user1.email);
    });

    it("should allow limiting", async () => {
      const [user] = await userRepo.find(null, { limit: 1 });
      expect(user.email).toBe(user1.email);
    });

    it("should allow offsetting", async () => {
      const [user] = await userRepo.find(null, { offset: 1 });
      expect(user.email).toBe(user2.email);
    });
  });

  describe("findOne()", () => {
    beforeEach(async () => {
      await userRepo.create([user1, user2]);
    });

    it("should allow finding one data", async () => {
      const user = await userRepo.findOne({ email: user2.email });
      expect(user.email).toBe(user2.email);
    });

    it("should allow sorting", async () => {
      const user = await userRepo.findOne(null, { sortBy: { email: "DESC" } });
      expect(user.email).toBe(user2.email);
    });
  });

  describe("findById()", () => {
    let ids: number[];

    beforeEach(async () => {
      const users = await userRepo.create([user1, user2]);
      ids = users.map(u => u.id);
    });

    it("should allow finding by id", async () => {
      const user = await userRepo.findById(ids[0]);
      expect(user.email).toBe(user1.email);
    });
  });

  describe("findByIds()", () => {
    let ids: number[];

    beforeEach(async () => {
      const users = await userRepo.create([user1, user2]);
      ids = users.map(u => u.id);
    });

    it("should allow finding by multiple ids", async () => {
      const users = await userRepo.findByIds(ids);
      expect(users[0].email).toBe(user1.email);
      expect(users[1].email).toBe(user2.email);
    });
  });

  describe("findIn()", () => {
    beforeEach(async () => {
      await userRepo.create([user1, user2]);
    });

    it("should allow finding by multiple values", async () => {
      const emails = [user1.email, user2.email];
      const users = await userRepo.findIn({ email: emails });
      expect(users[0].email).toBe(user1.email);
      expect(users[1].email).toBe(user2.email);
    });

    it("should allow sorting", async () => {
      const emails = [user1.email, user2.email];
      const users = await userRepo.findIn(
        { email: emails },
        { sortBy: { email: "DESC" } },
      );
      expect(users[0].email).toBe(user2.email);
      expect(users[1].email).toBe(user1.email);
    });
  });

  describe("findLike()", () => {
    beforeEach(async () => {
      await userRepo.create([user1, user2]);
    });

    it("should allow finding by similar value", async () => {
      const users = await userRepo.findLike({ email: "test" });
      expect(users[0].email).toBe(user1.email);
      expect(users[1].email).toBe(user2.email);
    });
  });

  describe("findOneOrThrow()", () => {
    beforeEach(async () => {
      await userRepo.create([user1, user2]);
    });

    it("should throw when entity is not found", async () => {
      await expect(userRepo.findOneOrThrow({ email: "toast" })).rejects.toThrow(
        /not found/i,
      );
      await expect(
        userRepo.findOneOrThrow({ email: user1.email }),
      ).resolves.not.toThrow();
    });
  });

  describe("findOneOrCreate()", () => {
    beforeEach(async () => {
      await userRepo.create(user1);
    });

    it("should return existing if found", async () => {
      const user = await userRepo.findOneOrCreate(
        { where: { email: user1.email } },
        user1,
      );
      expect(user.operation).toBe("find");
      expect(user.entity.email).toBe(user1.email);
    });

    it("should create a new one if not found", async () => {
      const user = await userRepo.findOneOrCreate(
        { where: { email: user2.email } },
        user2,
      );
      expect(user.operation).toBe("create");
      expect(user.entity.email).toBe(user2.email);
    });
  });

  describe("count()", () => {
    beforeEach(async () => {
      await Promise.all([
        userRepo.create({ email: "email1", name: "foo" }),
        userRepo.create({ email: "email2", name: "bar" }),
        userRepo.create({ email: "email3", name: "baz" }),
        userRepo.create({ email: "email4", name: "name" }),
      ]);
    });

    it("should return data count", async () => {
      const count = await userRepo.count();
      expect(count).toBe(4);
    });

    it("should return filtered result", async () => {
      const count = await userRepo.count({ name: "baz" });
      expect(count).toBe(1);
    });
  });

  describe("findAndCount()", () => {
    beforeEach(async () => {
      await userRepo.create({ email: "email1", name: "foo" });
      await userRepo.create({ email: "email2", name: "bar" });
      await userRepo.create({ email: "email3", name: "baz" });
      await userRepo.create({ email: "email4", name: "name" });
    });

    it("should return matching items and count", async () => {
      const { count, list } = await userRepo.findAndCount();
      expect(count).toBe(4);
      expect(list.length).toBe(4);
    });

    it("should return filtered result", async () => {
      const { count, list } = await userRepo.findAndCount(null, {
        limit: 2,
        offset: 2,
      });
      expect(count).toBe(4);
      expect(list[0].email).toEqual("email3");
      expect(list[1].email).toEqual("email4");
    });
  });

  describe("isUnique()", () => {
    beforeEach(async () => {
      await userRepo.create({ email: "email1", name: "foo" });
    });

    it("should return false when not unique", async () => {
      const flag = await userRepo.isUnique({ email: "email1" });
      expect(flag).toBe(false);
    });

    it("should return true when not unique", async () => {
      const flag = await userRepo.isUnique({ email: "email2" });
      expect(flag).toBe(true);
    });
  });

  describe("isUniqueOrThrow()", () => {
    beforeEach(async () => {
      await userRepo.create({ email: "email1", name: "foo" });
    });

    it("should throw when not unique", async () => {
      await expect(
        userRepo.isUniqueOrThrow({ email: "email1" }),
      ).rejects.toThrow(/exist/gi);
    });

    it("should return true when not unique", async () => {
      const flag = await userRepo.isUniqueOrThrow({ email: "email2" });
      expect(flag).toBe(true);
    });
  });

  describe("update()", () => {
    let id: number;

    beforeEach(async () => {
      const entity = await userRepo.create(user);
      id = entity.id;
    });

    it("should allow updating by id", async () => {
      const updated = await userRepo.update(id, { name: "jon" });
      expect(updated.name).toBe("jon");
    });
  });

  describe("upsert()", () => {
    beforeEach(async () => {
      await userRepo.create(user1);
    });

    it("should update if found", async () => {
      const user = await userRepo.upsert(
        { where: { email: user1.email } },
        { ...user1, name: "jon" },
      );
      expect(user.operation).toBe("update");
      expect(user.entity.email).toBe(user1.email);
    });

    it("should insert if not found", async () => {
      const user = await userRepo.upsert(
        { where: { email: user2.email } },
        { ...user2, name: "jon" },
      );
      expect(user.operation).toBe("create");
      expect(user.entity.email).toBe(user2.email);
    });
  });

  describe("remove()", () => {
    let ids: number[];

    beforeEach(async () => {
      const users = await userRepo.create([user1, user2]);
      ids = users.map(u => u.id);
    });

    it("should mark an item as removed", async () => {
      const [id] = ids;
      await userRepo.remove(id);

      const user = await userRepo.findById(id);
      expect(user).not.toBeDefined();

      const ormRepo = getRepository(User);
      const all = await ormRepo.findByIds([id], { withDeleted: true });
      expect(all[0].email).toBe(user1.email);
    });

    it("should allow removing by criteria", async () => {
      await userRepo.remove({ email: user1.email });

      const user = await userRepo.findOne({ email: user1.email });
      expect(user).not.toBeDefined();
    });
  });

  describe("dropRow()", () => {
    beforeEach(async () => {
      await userRepo.create(user);
    });

    it("should actually remove the row from database", async () => {
      await userRepo.dropRow({ email: user.email });

      const found = await userRepo.findOne({ email: user.email });
      expect(found).not.toBeDefined();

      const ormRepo = getRepository(User);
      const all = await ormRepo.find({ withDeleted: true });
      expect(all).toEqual([]);
    });
  });
});
