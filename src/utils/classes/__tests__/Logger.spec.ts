import { Logger } from "../Logger";

describe("utils/classes/Logger", () => {
  const logContext = "LoggerTest";
  const message = "This is the message";
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger(logContext);
  });

  it("should be defined", () => {
    expect(typeof Logger).toBe("function");
  });

  it("should implement LoggerService", () => {
    expect(typeof logger.log).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.verbose).toBe("function");
  });

  it("should print message string in colors based on type", () => {
    logger.log(message);
    logger.error(message, new Error("something").stack);
    logger.warn(message);
    logger.debug(message);
    logger.verbose(message);
  });

  it("should print the params passed", () => {
    logger.log(message, { logType: "this is log" });
    logger.error(message, new Error("something").stack, {
      err: new Error(),
      message: "something",
    });
    logger.warn(message, { event: "Something", toWarn: 12345 });
    logger.debug(message, { msg: "Falsy value" });
    logger.verbose(message, { test: "another", verbosity: [1, 2, 3, 4] });
  });
});
