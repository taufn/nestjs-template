import snakecaseKeys from "snakecase-keys";

export class MessageEntity<T = any> {
  name: string;
  from: string;
  timestamp: Date;
  payload: T;

  public toJSON?(): MessageEntity {
    return {
      name: this.name,
      from: this.from,
      timestamp: this.timestamp,
      payload: snakecaseKeys(this.payload),
    };
  }

  public toString?(): string {
    return JSON.stringify(this.toJSON());
  }
}
