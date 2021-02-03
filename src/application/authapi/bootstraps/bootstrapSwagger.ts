import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { routingV1 } from "../configs";

export function bootstrapSwagger(app: INestApplication): void {
  const url = `${routingV1.PREFIX}${routingV1.DOCS}`;
  const config = new DocumentBuilder()
    .setTitle("Auth API")
    .setDescription("API documentation for authentication")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(url, app, document);
}
