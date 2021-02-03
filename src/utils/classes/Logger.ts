/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger as NestLogger, LoggerService } from "@nestjs/common";
import * as chalk from "chalk";

import "../functions/loadEnv";
import { caseToWords } from "../functions";

type LogLevelConfig = { [K: string]: boolean };

export class Logger extends NestLogger implements LoggerService {
  private logLevels: LogLevelConfig = {};

  constructor(private readonly logContext: string) {
    super();
    this.logLevels = process.env.LOG_LEVELS.split(",").reduce<LogLevelConfig>(
      (aggr, k) => ({ ...aggr, [k]: true }),
      {},
    );
  }

  public error(message: string, trace: string, params?: any): void {
    if (this.isLevelEnabled("error")) {
      const formatted = this.formatMessage(message, params);
      super.error(chalk.red(formatted), chalk.red(trace));
    }
  }

  public warn(message: string, params?: any): void {
    if (this.isLevelEnabled("warn")) {
      const formatted = this.formatMessage(message, params);
      super.warn(chalk.yellow(formatted));
    }
  }

  public log(message: string, params?: any): void {
    if (this.isLevelEnabled("log")) {
      const formatted = this.formatMessage(message, params);
      super.log(chalk.green(formatted));
    }
  }

  public debug(message: string, params?: any): void {
    if (this.isLevelEnabled("debug")) {
      const formatted = this.formatMessage(message, params);
      super.debug(chalk.white(formatted));
    }
  }

  public verbose(message: string, params?: any): void {
    if (this.isLevelEnabled("verbose")) {
      const formatted = this.formatMessage(message, params);
      super.verbose(chalk.gray(formatted));
    }
  }

  private formatMessage(message: string, params?: any): string {
    const context = chalk.yellow(`[${this.logContext}]`);
    const strParams: string = params
      ? Object.keys(params)
          .map(
            k =>
              `${caseToWords(k, "word")}: ${chalk.cyan(
                JSON.stringify(params[k]),
              )}`,
          )
          .join(" - ")
      : "";

    return [`${context} ${message}`, strParams].filter(s => s).join(" | ");
  }

  private isLevelEnabled(level: string): boolean {
    return (
      this.logLevels.all || (!this.logLevels.false && this.logLevels[level])
    );
  }
}
