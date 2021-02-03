import { MessageEntity } from "../entities";

export interface PublishOptions {
  routingKey?: string;
  xDelay?: number;
}

export interface Publisher {
  publish(message: MessageEntity, options?: PublishOptions): Promise<void>;
}

export interface Consumer<T = MessageEntity> {
  consume(message: T): Promise<void>;
}
