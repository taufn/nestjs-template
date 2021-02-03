import { Inject, Injectable } from "@nestjs/common";
import * as amqp from "amqp-connection-manager";
import * as amqplib from "amqplib";
import camelcaseKeys = require("camelcase-keys");

import { providerNames } from "../configs";
import { Consumer } from "~/domain/common/contracts";
import { MessageEntity } from "~/domain/common/entities";
import { Logger } from "~/utils/classes";
import { RabbitConfig } from "~/utils/functions";

@Injectable()
export class RabbitSubscriberService {
  private readonly logger = new Logger(RabbitSubscriberService.name);

  constructor(
    @Inject(providerNames.RABBIT_CONFIG) private readonly config: RabbitConfig,
  ) {}

  public async subscribe(consumer: Consumer, routingKeys = "#"): Promise<void> {
    try {
      const {
        connectionString,
        exchangeName,
        exchangeType,
        durable,
        queue,
      } = this.config;
      const proxyLogger = this.logger;
      const proxyRouteMessageToConsumer = this.routeMessageToConsumer;

      const connection = amqp.connect([connectionString]);
      connection.createChannel({
        json: true,
        // https://www.npmjs.com/package/amqp-connection-manager
        // the docs note that the setup function will have the `this` scope to
        // be the `ChannelWrapper` instance, hence it would not be able to make
        // use of the `RabbitSubscriberService` scoped methods and variables
        // that is why we are proxying and extracting values from this class
        // to be used inside the setup function
        setup: async function(channel: amqplib.ConfirmChannel) {
          await channel.assertExchange(exchangeName, exchangeType, { durable });
          await channel.assertQueue(queue, { durable });
          const patterns = routingKeys.split(",");
          for (const pattern of patterns) {
            await channel.bindQueue(queue, exchangeName, pattern);
            proxyLogger.log("Bound queue to routing key", {
              queue,
              exchangeName,
              pattern,
            });
          }
          await channel.prefetch(1, false);
          await channel.consume(
            queue,
            async (message: amqplib.ConsumeMessage) => {
              if (message) {
                proxyRouteMessageToConsumer(message, consumer, proxyLogger);
              }
            },
            // TODO: perform manual acknowledgment with retry logic
            { noAck: true },
          );
        },
      });
    } catch (error) {
      this.logger.warn("Failed to subscribe consumer", { routingKeys });
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private async routeMessageToConsumer(
    message: amqplib.ConsumeMessage,
    consumer: Consumer,
    logger: Logger,
  ): Promise<void> {
    let payload: MessageEntity;
    try {
      payload = JSON.parse(message.content.toString());
    } catch (error) {
      logger.warn("Failed to parse the message");
      logger.error(error.message, error.stack);
      return;
    }

    try {
      logger.log("Message received, consuming...", {
        properties: message.properties,
        message: payload,
      });
      const formatted = camelcaseKeys(payload.payload);
      await consumer.consume(formatted);
    } catch (error) {
      logger.warn("Failed to consume the message", {
        properties: message.properties,
        message: payload,
      });
      logger.error(error.message, error.stack);
    }
  }
}
