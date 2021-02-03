import { NotFoundException } from "@nestjs/common";
import {
  DeepPartial,
  EntityManager,
  FindManyOptions as OrmFindManyOptions,
  In,
  Like,
  ObjectType,
} from "typeorm";

import { BaseEntity } from "../entities/BaseEntity";
import {
  FindInWhere,
  FindManyOptions,
  FindOneOptions,
  ListAndCount,
  OperationResult,
  Repository,
  WhereOptions,
} from "~/domain/common/contracts";
import {
  DuplicateRowException,
  RepositoryFailureException,
} from "~/domain/common/exceptions";
import { Env, Logger } from "~/utils/classes";

export abstract class BaseRepository<T> implements Repository<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly em: EntityManager,
    private readonly Entity: ObjectType<T>,
  ) {}

  /**
   * Create a new entity or a set of new entities. The returned entity is
   * obtained by re-selecting the row to take account of subscribers modifying
   * the entity after insertion.
   *
   * @param params - Create params
   */
  create(params: T): Promise<T>;
  create(params: T[]): Promise<T[]>;
  public async create(params: T | T[]): Promise<T | T[]> {
    try {
      if (Array.isArray(params)) {
        const list = params.map(p => this.em.create<T>(this.Entity, p));
        const createds = await this.em.save<T>(list);
        return await this.findByIds(
          createds.map(c => (c as T & BaseEntity).id),
        );
      }

      const item = this.em.create<T>(this.Entity, params);
      const created = await this.em.save<T>(item);
      return await this.findById((created as T & BaseEntity).id);
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "create" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Find matching entities.
   * @param where - Where condition
   * @param options - Additional options (sorting, limit, offset, relations)
   */
  public async find(
    where?: Partial<T>,
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    try {
      const opts: OrmFindManyOptions<T> = where ? { where } : {};
      // !README
      // for `optsMap`:
      // - key is from `FindManyOptions` key name
      // - value is of `OrmFindManyOptions` key name
      const optsMap = {
        relations: "relations",
        sortBy: "order",
        limit: "take",
        offset: "skip",
      };

      for (const k in options) {
        const key = optsMap[k];
        opts[key] = options[k];
      }

      return await this.em.find<T>(this.Entity, opts);
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "find" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Find matching entity.
   * @param where - Where condition
   * @param options - Additional options (sorting, relations)
   */
  public async findOne(
    where?: Partial<T>,
    options?: FindOneOptions<T>,
  ): Promise<T> {
    const [one] = await this.find(where, options);
    return one;
  }

  /**
   * Find an entity by matching database `id`.
   * @param where - Where condition
   * @param options - Additional options (sorting, relations)
   */
  public async findById(id: number, options?: FindOneOptions<T>): Promise<T> {
    return await this.findOne(({ id } as unknown) as Partial<T>, options);
  }

  /**
   * Find entities by matching list of `id`s.
   * @param where - Where condition
   * @param options - Additional options (sorting, relations)
   */
  public async findByIds(
    ids: number[],
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    return Array.isArray(ids) && ids.length > 0
      ? await this.find(({ id: In(ids) } as unknown) as Partial<T>, options)
      : null;
  }

  /**
   * Find entities matching values in given fields.
   * @param where - Where condition
   * @param options - Additional options (sorting, limit, offset, relations)
   */
  public async findIn(
    where: FindInWhere<T>,
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    const whereIn = Object.keys(where).reduce<Partial<T>>((mapped, key) => {
      try {
        const values = where[key].map(v => v.id || v);
        mapped[key] = In(values);
        return mapped;
      } catch (error) {
        this.logger.error(error.message, error.stack, { repoMethod: "findIn" });
        throw new RepositoryFailureException();
      }
    }, {});

    return await this.find(whereIn, options);
  }

  /**
   * Find entities partially matching value in given fields.
   * @param where - Where condition
   * @param options - Additional options (sorting, limit, offset, relations)
   */
  public async findLike(
    where: Partial<T>,
    options?: FindManyOptions<T>,
  ): Promise<T[]> {
    const whereLike = Object.keys(where).reduce<Partial<T>>((mapped, key) => {
      try {
        mapped[key] = Like(`%${where[key]}%`);
        return mapped;
      } catch (error) {
        this.logger.error(error.message, error.stack, {
          repoMethod: "findLike",
        });
        throw new RepositoryFailureException();
      }
    }, {});

    return await this.find(whereLike, options);
  }

  /**
   * Find one entity, if not found then throw NotFoundException.
   * @param condition - Where condition and additional options
   * @param params - Create params for when not found
   */
  public async findOneOrThrow(
    where: Partial<T>,
    options?: FindOneOptions<T>,
  ): Promise<T> {
    const result = await this.findOne(where, options);
    if (!result) {
      this.logger.warn("Failed to find an entity", {
        where,
        repoMethod: "findOneOrThrow",
      });
      throw new NotFoundException();
    }
    return result;
  }

  /**
   * Find one entity, if not found then create.
   * @param condition - Where condition and additional options
   * @param params - Create params for when not found
   */
  public async findOneOrCreate(
    condition: WhereOptions<T>,
    params: T,
  ): Promise<OperationResult<T>> {
    const { where, options } = condition;
    let find: Partial<T>;

    if (typeof where === "number") {
      find = ({ id: where } as unknown) as Partial<T>;
    } else {
      find = where;
    }

    const found = await this.findOne(find, options);
    if (found) {
      return {
        operation: "find",
        entity: found,
      };
    }

    const created = await this.create(params);
    return {
      operation: "create",
      entity: created,
    };
  }

  /**
   * Count total rows matching given condition. If no `where` provided, then
   * count all rows.
   * @param where - Matching condition
   */
  public async count(where?: Partial<T>): Promise<number> {
    try {
      return await this.em.count(this.Entity, where ? { where } : {});
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "count" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Find matching rows and count total matching rows.
   * @param where - Matching conditions
   * @param options - Additional options
   */
  public async findAndCount(
    where?: Partial<T>,
    options?: FindManyOptions<T>,
  ): Promise<ListAndCount<T>> {
    const [list, count] = await Promise.all([
      this.find(where || null, options),
      this.count(where),
    ]);
    return { list, count };
  }

  /**
   * Check if a given where condition does not match any row.
   * @param where - Matching conditions
   * @param options - Additional options
   */
  public async isUnique(
    where: Partial<T>,
    options?: FindOneOptions<T>,
  ): Promise<boolean> {
    const exist = await this.findOne(where, options);
    return !exist;
  }

  /**
   * Check for unique row, if not then throw.
   * @param where - Matching conditions
   * @param options - Additional options
   */
  public async isUniqueOrThrow(
    where: Partial<T>,
    options?: FindOneOptions<T>,
  ): Promise<boolean> {
    const exist = await this.findOne(where, options);
    if (exist) {
      throw new DuplicateRowException();
    }
    return true;
  }

  /**
   * Update matching entity.
   * @param id - Identifier to match
   * @param params - Update params
   */
  update(id: number, params: Partial<T>): Promise<T>;
  public async update(id: number, params: Partial<T>): Promise<T> {
    const entity = await this.findById(id);
    try {
      const updated = this.em.merge<T>(
        this.Entity,
        entity,
        (params as unknown) as DeepPartial<T>,
      );

      return await this.em.save<T>(updated);
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "update" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Update an entity if found, otherwise create a new one.
   * @param condition - Where condition and additional options
   * @param params - Update or insert params
   */
  public async upsert(
    condition: WhereOptions<T>,
    params: T,
  ): Promise<OperationResult<T>> {
    const fooc = await this.findOneOrCreate(condition, params);
    if (fooc.operation === "create") {
      return { ...fooc };
    }

    const updated = await this.update(
      (fooc.entity as T & BaseEntity).id,
      params,
    );
    return {
      operation: "update",
      entity: updated,
    };
  }

  /**
   * Soft delete entities.
   * @param condition - Matching condition
   */
  public async remove(
    condition: number | number[] | Partial<T>,
  ): Promise<void> {
    try {
      await this.em.softDelete<T>(this.Entity, condition);
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "remove" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Hard delete entities.
   * @param condition - Matching condition
   */
  public async dropRow(
    condition: number | number[] | Partial<T>,
  ): Promise<void> {
    try {
      await this.em.delete<T>(this.Entity, condition);
    } catch (error) {
      this.logger.error(error.message, error.stack, { repoMethod: "dropRow" });
      throw new RepositoryFailureException();
    }
  }

  /**
   * Truncate the entire table. Intentionally made to only work on test and
   * development to avoid accidents.
   */
  public async flush(): Promise<void> {
    const env = Env.getEnv();
    if (env === "test" || env === "development") {
      try {
        await this.em.clear<T>(this.Entity);
      } catch (error) {
        this.logger.error(error.message, error.stack, { repoMethod: "flush" });
        throw new RepositoryFailureException();
      }
    }
  }
}
