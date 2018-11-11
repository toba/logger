import { merge, is } from '@toba/tools';
import { serialize, flatten } from './format';

let isProduction = false;

export enum LogLevel {
   None = 0,
   Debug,
   Info,
   Warn,
   Error
}

let defaultLevel = LogLevel.Info;

export interface LogConfig {
   color?: boolean;
   level?: LogLevel;
   prefix: string;
   readable?: boolean;
   threshold: LogLevel;
}

export type LogData = { [key: string]: any };

/**
 * Colorize logs in development but do nothing in production.
 */
let colorize = (_level: LogLevel, message: string, _ctx: string): string =>
   message;

const defaultConfig: LogConfig = {
   color: !isProduction,
   level: defaultLevel,
   readable: !isProduction,
   prefix: '',
   threshold: LogLevel.Info
};

/**
 * Simple console logger based on
 * @see https://github.com/ianstormtaylor/heroku-logger
 */
export class Logger {
   config: LogConfig;

   constructor(config: Partial<LogConfig> = {}) {
      this.config = merge(defaultConfig, config);
   }

   debug(message: string | Error, data: LogData = {}) {
      return this.log(LogLevel.Debug, message, data);
   }

   info(message: string | Error, data: LogData = {}) {
      return this.log(LogLevel.Info, message, data);
   }

   warn(message: string | Error, data: LogData = {}) {
      return this.log(LogLevel.Warn, message, data);
   }

   error(message: string | Error, data: LogData = {}) {
      return this.log(LogLevel.Error, message, data);
   }

   log(
      level: LogLevel = LogLevel.Info,
      message: string | Error | null = null,
      data: LogData = {}
   ) {
      if (message instanceof Error) {
         data.error = message;
         data.stack = message.stack;
         message = message.message;
      }

      if (typeof message != is.Type.String) {
         message = String(message);
      }

      const { threshold, prefix } = this.config;

      if (level < threshold) {
         return;
      }

      const output = this.format(level, prefix + message, data);
      console.log(output);
   }

   format(
      level: LogLevel,
      message: string | Error,
      data: LogData | null = null
   ): string {
      const { color, readable } = this.config;
      const flat = data != null ? flatten(data, '#') : '';
      const ctx = { ...flat, level, message };
      const string = serialize(ctx);
      const levelName = LogLevel[level];
      const text: string =
         message instanceof Error ? message.toString() : message;

      if (readable && color) {
         return colorize(level, text, string);
      } else if (readable) {
         return `[${levelName}] ${text} ${string}`;
      } else {
         return string;
      }
   }

   /**
    * Update logger configuration.
    */
   update(config: LogConfig) {
      this.config = merge(this.config, config);
      return this;
   }
}

async function configure() {
   if (typeof process != is.Type.Undefined) {
      const env = process.env['LOG_LEVEL'];
      if (env !== undefined) {
         const level = parseInt(env);
         if (
            !isNaN(level) &&
            level >= LogLevel.Debug &&
            level <= LogLevel.Error
         ) {
            defaultLevel = level;
         }
      }
      isProduction = process.env['NODE_ENV'] == 'production';

      if (isProduction) {
         enableColor();
      }
   }
}

async function enableColor() {
   const chalk = await import('chalk');
   const color = chalk.default;
   const levelColor: { [key: number]: any } = {
      [LogLevel.Debug]: color.gray,
      [LogLevel.Info]: color.blue,
      [LogLevel.Warn]: color.yellow,
      [LogLevel.Error]: color.red
   };

   // update colorize method to use Chalk
   colorize = (level: LogLevel, message: string, ctx: string) => {
      const levelName = LogLevel[level];
      const tag = `${levelColor[level](`[${levelName}]`)}`;
      const msg = level > LogLevel.Warn ? color.red(message) : message;
      const obj = `${color.gray(ctx)}`;
      return `${tag} ${msg} ${obj}`;
   };
}

configure();

/**
 * Logger singleton.
 */
export const log = new Logger();
