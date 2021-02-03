import { NestFactory } from "@nestjs/core";

import "~/global";
import { AuthApiModule } from "./AuthApiModule";
import { bootstrapSwagger } from "./bootstraps";
import { Logger } from "~/utils/classes";

(async function bootstrap() {
  const logger = new Logger("AuthApi");
  const app = await NestFactory.create(AuthApiModule);
  const port = process.env.AUTH_API_PORT || 3000;
  bootstrapSwagger(app);
  await app.listen(port);
  logger.log("Auth API is running", { port, pid: process.pid });
})();
