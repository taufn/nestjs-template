export interface RabbitConfig {
  connectionString: string;
  exchangeName: string;
  exchangeType: string;
  queue: string;
  durable: boolean;
}

export function rabbitConfig(): RabbitConfig {
  const {
    RABBITMQ_PROTOCOL: protocol,
    RABBITMQ_USERNAME: user,
    RABBITMQ_PASSWORD: pass,
    RABBITMQ_HOSTNAME: host,
    RABBITMQ_PORT: port,
    RABBITMQ_VHOST: vhost,
    RABBITMQ_QUEUE: queue,
    RABBITMQ_EXCHANGE: exchange,
    RABBITMQ_TYPE: type,
    RABBITMQ_DURABLE: durable,
  } = process.env;

  return {
    queue,
    connectionString: `${protocol}://${user}:${pass}@${host}:${port}/${vhost}`,
    exchangeName: exchange,
    exchangeType: type,
    durable: durable.toLowerCase() === "true",
  };
}
