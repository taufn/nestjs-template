import * as amqp from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { mock } from "jest-mock-extended";

import { RabbitSubscriberService } from "../RabbitSubscriberService";
import { Consumer } from "~/domain/common/contracts";
import { RabbitConfig } from "~/utils/functions";

describe("application/common/services/RabbitSubscriberService", () => {
  it("should be defined", () => {
    expect(typeof RabbitSubscriberService).toBe("function");
  });

  describe("subscribe()", () => {
    const config: RabbitConfig = {
      connectionString: "connectionString",
      exchangeName: "exchangeName",
      exchangeType: "exchangeType",
      queue: "queue",
      durable: true,
    };

    it("should be defined", () => {
      const service = new RabbitSubscriberService(config);
      expect(typeof service.subscribe).toBe("function");
    });

    it("should stop the app if rabbit setup fails", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(() => {
        throw new Error();
      });
      await expect(service.subscribe(mockConsumer)).rejects.toThrow();
      jest.restoreAllMocks();
    });

    it("should assert the channel's exchange and queue", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      let setupFn: amqp.SetupFunc;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      expect(mockChannel.assertExchange).toBeCalledWith(
        config.exchangeName,
        config.exchangeType,
        { durable: config.durable },
      );
      expect(mockChannel.assertQueue).toBeCalledWith(config.queue, {
        durable: config.durable,
      });
      jest.restoreAllMocks();
    });

    it("should bind the routing keys when provided", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      let setupFn: amqp.SetupFunc;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      expect(mockChannel.bindQueue).toBeCalledWith(
        config.queue,
        config.exchangeName,
        "#",
      );
      const routingKeys = "foo,bar,baz";
      await service.subscribe(mockConsumer, routingKeys);
      await setupFn(mockChannel, jest.fn());
      expect(mockChannel.bindQueue).nthCalledWith(
        2,
        config.queue,
        config.exchangeName,
        "foo",
      );
      expect(mockChannel.bindQueue).nthCalledWith(
        3,
        config.queue,
        config.exchangeName,
        "bar",
      );
      expect(mockChannel.bindQueue).nthCalledWith(
        4,
        config.queue,
        config.exchangeName,
        "baz",
      );
      jest.restoreAllMocks();
    });

    it("should ensure busy consumer to not receive message, spreading workload evenly", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      let setupFn: amqp.SetupFunc;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      expect(mockChannel.prefetch).toBeCalledWith(1, false);
      jest.restoreAllMocks();
    });

    it("should auto acknowledge when message is null", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      let setupFn: amqp.SetupFunc;
      let onMessageFn: (msg: ConsumeMessage | null) => void;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      jest.spyOn(mockChannel, "ack");
      jest.spyOn(mockChannel, "nack");
      jest.spyOn(mockChannel, "consume").mockImplementation((q, om) => {
        onMessageFn = om;
        return mock<any>();
      });
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      await onMessageFn(null);
      expect(mockChannel.ack).not.toBeCalled();
      expect(mockChannel.nack).not.toBeCalled();
      jest.restoreAllMocks();
    });

    it("should auto nack when consumer throws error", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      const mockMessage = mock<ConsumeMessage>();
      let setupFn: amqp.SetupFunc;
      let onMessageFn: (msg: ConsumeMessage | null) => void;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      jest.spyOn(mockChannel, "ack");
      jest.spyOn(mockChannel, "nack");
      jest.spyOn(mockChannel, "consume").mockImplementation((q, om) => {
        onMessageFn = om;
        return mock<any>();
      });
      jest
        .spyOn(mockMessage.content, "toString")
        .mockReturnValue('{ "payload": { "foo": "bar" } }');
      jest.spyOn(mockConsumer, "consume").mockRejectedValue(new Error());
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      await expect(onMessageFn(mockMessage)).resolves.not.toThrow();
      expect(mockChannel.ack).not.toBeCalled();
      expect(mockChannel.nack).not.toBeCalled();
      jest.restoreAllMocks();
    });

    it("should auto acknowledge when all is good", async () => {
      const service = new RabbitSubscriberService(config);
      const mockConsumer = mock<Consumer>();
      const mockConnection = mock<amqp.AmqpConnectionManager>();
      const mockChannel = mock<ConfirmChannel>();
      const mockMessage = mock<ConsumeMessage>();
      let setupFn: amqp.SetupFunc;
      let onMessageFn: (msg: ConsumeMessage | null) => void;
      jest.spyOn(amqp, "connect").mockReturnValue(mockConnection);
      jest.spyOn(mockConnection, "createChannel").mockImplementation(opts => {
        setupFn = opts.setup;
        return mock<amqp.ChannelWrapper>();
      });
      jest.spyOn(mockChannel, "ack");
      jest.spyOn(mockChannel, "nack");
      jest.spyOn(mockChannel, "consume").mockImplementation((q, om) => {
        onMessageFn = om;
        return mock<any>();
      });
      jest
        .spyOn(mockMessage.content, "toString")
        .mockReturnValue('{ "payload": { "foo_bar": "bar" } }');
      jest.spyOn(mockConsumer, "consume");
      await service.subscribe(mockConsumer);
      await setupFn(mockChannel, jest.fn());
      await onMessageFn(mockMessage);
      expect(mockConsumer.consume).toBeCalledWith({ fooBar: "bar" });
      expect(mockChannel.ack).not.toBeCalled();
      expect(mockChannel.nack).not.toBeCalled();
      jest.restoreAllMocks();
    });
  });
});
