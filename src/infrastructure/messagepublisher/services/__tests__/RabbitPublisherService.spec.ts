import * as amqp from "amqp-connection-manager";
import { ConfirmChannel } from "amqplib";
import { mock } from "jest-mock-extended";

import { RabbitPublisherService } from "../RabbitPublisherService";
import { MessageEntity } from "~/domain/common/entities";
import { RabbitConfig } from "~/utils/functions";

describe("infrastructure/services/RabbitPublisherService", () => {
  it("should be defined", () => {
    expect(typeof RabbitPublisherService).toBe("function");
  });

  describe("publish()", () => {
    const config: RabbitConfig = {
      connectionString: "connectionString",
      exchangeName: "exchangeName",
      exchangeType: "exchangeType",
      queue: "queue",
      durable: true,
    };

    it("should be defined", () => {
      const service = new RabbitPublisherService(config);
      expect(typeof service.publish).toBe("function");
    });

    it("should abort operation if rabbit connection fails", async () => {
      const service = new RabbitPublisherService(config);
      const mockMessage = mock<MessageEntity>();
      jest.spyOn(amqp, "connect").mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(mockMessage, "toJSON");
      await expect(service.publish(mockMessage)).resolves.not.toThrow();
      expect(mockMessage.toJSON).not.toBeCalled();
      jest.restoreAllMocks();
    });

    it("should handle channel creation error gracefully", async () => {
      const service = new RabbitPublisherService(config);
      const mockMessage = mock<MessageEntity>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(mockConnection, "close");
      jest.spyOn(mockMessage, "toJSON").mockReturnValue({
        timestamp: new Date(),
        name: "name",
        from: "sender",
        payload: { foo: "bar" },
      });
      await expect(service.publish(mockMessage)).resolves.not.toThrow();
      expect(mockConnection.createChannel).toBeCalledTimes(1);
      expect(mockConnection.close).toBeCalledTimes(1);
      jest.restoreAllMocks();
    });

    it("should assert publisher to exchange", async () => {
      const service = new RabbitPublisherService(config);
      const mockMessage = mock<MessageEntity>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      let setupFn: amqp.SetupFunc;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        throw new Error();
      });
      await service.publish(mockMessage);
      const mockChannel = mock<ConfirmChannel>();
      jest.spyOn(mockChannel, "assertExchange");
      setupFn(mockChannel, () => {
        const assertedExchange = mockChannel.assertExchange.mock.calls[0][0];
        expect(assertedExchange).toBe(config.exchangeName);
      });
      jest.restoreAllMocks();
    });

    it("should not fail others if one of published messages somehow failed", async () => {
      const service = new RabbitPublisherService(config);
      const mockMessage = mock<MessageEntity>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<amqp.ChannelWrapper>();
      const spyPublish = jest.spyOn(mockChannel, "publish").mockResolvedValue();
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockReturnValue(mockChannel);
      jest.spyOn(mockConnection, "close");
      jest.spyOn(mockMessage, "toJSON").mockReturnValue({
        timestamp: new Date(),
        name: "name",
        from: "sender",
        payload: { foo: "bar" },
      });
      spyPublish.mockImplementationOnce(() => {
        throw new Error();
      });
      await service.publish(mockMessage, { routingKey: "foo,bar,baz" });
      expect(mockChannel.publish).toBeCalledTimes(3);
      expect(mockConnection.close).toBeCalledTimes(1);
      jest.restoreAllMocks();
    });

    it("should set `x-delay` header when specified so", async () => {
      const service = new RabbitPublisherService(config);
      const mockMessage = mock<MessageEntity>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<amqp.ChannelWrapper>();
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockReturnValue(mockChannel);
      jest.spyOn(mockConnection, "close");
      jest.spyOn(mockChannel, "publish").mockResolvedValue();
      jest.spyOn(mockMessage, "toJSON").mockReturnValue({
        timestamp: new Date(),
        name: "name",
        from: "sender",
        payload: { foo: "bar" },
      });
      await service.publish(mockMessage, { xDelay: 60e3 });
      const options = mockChannel.publish.mock.calls[0][3];
      expect(mockChannel.publish).toBeCalledTimes(1);
      expect(options.headers["x-delay"]).toBe(60e3);
      jest.restoreAllMocks();
    });
  });
});
