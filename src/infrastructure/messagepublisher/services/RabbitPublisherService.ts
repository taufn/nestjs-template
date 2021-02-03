import { Inject, Injectable } from "@nestjs/common";
import * as amqp from "amqp-connection-manager";
import * as amqplib from "amqplib";

import { providerNames } from "../configs";
import { Publisher, PublishOptions } from "~/domain/common/contracts";
import { MessageEntity } from "~/domain/common/entities";
import { Logger } from "~/utils/classes";
import { RabbitConfig } from "~/utils/functions";

@Injectable()
export class RabbitPublisherService implements Publisher {
  private readonly logger = new Logger(RabbitPublisherService.name);

  constructor(
    @Inject(providerNames.RABBIT_CONFIG) private readonly config: RabbitConfig,
  ) {}

  public async publish(
    message: MessageEntity,
    options?: PublishOptions,
  ): Promise<void> {
    let connection: amqp.AmqpConnectionManager;
    try {
      connection = amqp.connect([this.config.connectionString]);
    } catch (error) {
      this.logger.warn("Failed to setup RabbitMQ connection");
      this.logger.error(error.message, error.stack);
      return;
    }

    const payload = message.toJSON();
    try {
      const { exchangeName, exchangeType, durable } = this.config;
      const channelWrapper = connection.createChannel({
        json: true,
        setup: async function(channel: amqplib.ConfirmChannel) {
          await channel.assertExchange(exchangeName, exchangeType, { durable });
        },
      });
      const routingKeys = (options?.routingKey || "#").split(",");
      const publishOptions: amqplib.Options.Publish = this.buildPublishOptions(
        options,
      );
      for (const routingKey of routingKeys) {
        await this.safelyPublishMessage(payload, () =>
          channelWrapper.publish(
            exchangeName,
            routingKey,
            payload,
            publishOptions,
          ),
        );
      }
    } catch (error) {
      this.logger.warn("Failed to setup message publisher", payload);
      this.logger.error(error.message, error.stack);
    }

    await connection.close();
    this.logger.log("Publisher connection is closed");
  }

  private buildPublishOptions(
    options: PublishOptions = {},
  ): amqplib.Options.Publish {
    return {
      contentType: "application/json",
      persistent: true,
      ...(options?.xDelay ? { headers: { "x-delay": options.xDelay } } : {}),
    };
  }

  private async safelyPublishMessage(
    payload: any,
    publishFn: () => Promise<void>,
  ): Promise<void> {
    try {
      await publishFn();
      this.logger.log("Published message", payload);
    } catch (error) {
      this.logger.warn("Failed to publish message", payload);
      this.logger.error(error.message, error.stack);
    }
  }
}
