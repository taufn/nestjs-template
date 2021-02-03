/* eslint-disable sonarjs/no-duplicate-string */
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

import { AuthApiModule } from "~/application/authapi/AuthApiModule";
import { routingV1 } from "~/application/authapi/configs";
import { TokenPayload } from "~/application/httpcommon/models";
import { providerNames as iamProviderNames } from "~/domain/iam/configs";
import { UserRepository } from "~/domain/iam/repositories";

const url = `${routingV1.PREFIX}${routingV1.ACCOUNT.REGISTER.WITH_PASSWORD}`;

describe(`POST ${url}`, () => {
  let app: INestApplication;
  let userRepo: UserRepository;
  let jwtService: JwtService;

  async function postRequest(params: any): Promise<request.Request> {
    return request(app.getHttpServer())
      .post(url)
      .send(params);
  }

  function decodeTokenFromResponse(response: any): TokenPayload {
    return jwtService.decode(response.body.data.token) as TokenPayload;
  }

  beforeAll(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AuthApiModule],
    }).compile();
    app = testingModule.createNestApplication();
    userRepo = testingModule.get(iamProviderNames.REPO_USER);
    jwtService = testingModule.get(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should throw 400 when request params are invalid", async () => {
    const invalidEmail = await postRequest({
      email: "invalid",
      password: "strongpasswordisthis",
    });
    const invalidPassword = await postRequest({
      email: "email@foo.com",
      password: "password",
    });
    expect(invalidEmail.status).toBe(400);
    expect(invalidPassword.status).toBe(400);
  });

  it("should enforce password rule", async () => {
    const minLength = await postRequest({
      email: "email@foo.com",
      password: "passwd",
    });
    const noNumber = await postRequest({
      email: "email@foo.com",
      password: "yowlines",
    });
    const noLetter = await postRequest({
      email: "email@foo.com",
      password: "87654321",
    });
    const noSpecialChar = await postRequest({
      email: "email@foo.com",
      password: "pass1234",
    });
    const isLongEnough = await postRequest({
      email: "email@foo.com",
      password: "thispasswordislongenough",
    });
    expect(minLength.status).toBe(400);
    expect(minLength.body.message).toMatch(/password/gi);
    expect(noNumber.status).toBe(400);
    expect(noNumber.body.message).toMatch(/password/gi);
    expect(noLetter.status).toBe(400);
    expect(noLetter.body.message).toMatch(/password/gi);
    expect(noSpecialChar.status).toBe(400);
    expect(noSpecialChar.body.message).toMatch(/password/gi);
    expect(isLongEnough.status).toBe(201);
    const tokenPayload: TokenPayload = decodeTokenFromResponse(isLongEnough);
    await userRepo.dropRow(tokenPayload.user.id);
  });

  it("should create user with hashed password", async () => {
    const payload = {
      email: "email@foo.com",
      password: "thispasswordislongenough",
    };
    const user = await postRequest(payload);
    const tokenPayload: TokenPayload = decodeTokenFromResponse(user);
    const entity = await userRepo.findById(tokenPayload.user.id);
    expect(tokenPayload.user.id).toBe(entity.id);
    expect(tokenPayload.user.email).toBe(entity.email);
    expect(payload.password).not.toBe(entity.password);
    await userRepo.dropRow(entity.id);
  });

  it("should throw 400 when existing user has been created", async () => {
    const user = await postRequest({
      email: "email@foo.com",
      password: "thispasswordislongenough",
    });
    const duplicate = await postRequest({
      email: "email@foo.com",
      password: "withdifferentpassword",
    });
    expect(user.status).toBe(201);
    expect(duplicate.status).toBe(400);
    expect(duplicate.body.message).toMatch(/exists/gi);
    const tokenPayload: TokenPayload = decodeTokenFromResponse(user);
    await userRepo.dropRow(tokenPayload.user.id);
  });
});
