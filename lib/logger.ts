/* tslint:disable-next-line:no-require-imports */
import Logfmt = require('logfmt');
import chalk, { Chalk } from 'chalk';
/* tslint:disable-next-line:no-require-imports */
import flatten = require('flat');
import { merge } from '@toba/utility';

let isProduction = false;

const logfmt = new Logfmt();

export enum LogLevel {
   None = 0,
   Debug,
   Info,
   Warn,
   Error
}

let defaultLevel = LogLevel.Info;

const Color: { [key: number]: Chalk } = {
   [LogLevel.Debug]: chalk.gray,
   [LogLevel.Info]: chalk.blue,
   [LogLevel.Warn]: chalk.yellow,
   [LogLevel.Error]: chalk.red
};

export interface LogConfig {
   color?: boolean;
   level?: LogLevel;
   prefix?: string;
   readable?: boolean;
   threshold?: LogLevel;
}

if (typeof process != 'undefined') {
   const level = parseInt(process.env['LOG_LEVEL']);
   if (!isNaN(level) && level >= LogLevel.Debug && level <= LogLevel.Error) {
      defaultLevel = level;
   }
   isProduction = process.env['NODE_ENV'] == 'production';
}

const defaultConfig: LogConfig = {
   color: !isProduction,
   level: defaultLevel,
   readable: !isProduction,
   prefix: ''
};

/**
 * Simple console logger based on
 * https://github.com/ianstormtaylor/heroku-logger
 */
export class Logger {
   config: LogConfig;

   constructor(config: LogConfig = {}) {
      this.config = merge(defaultConfig, config);
   }

   debug(message: string | Error, data: any = {}) {
      return this.log(LogLevel.Debug, message, data);
   }

   info(message: string | Error, data: any = {}) {
      return this.log(LogLevel.Info, message, data);
   }

   warn(message: string | Error, data: any = {}) {
      return this.log(LogLevel.Warn, message, data);
   }

   error(message: string | Error, data: any = {}) {
      return this.log(LogLevel.Error, message, data);
   }

   log(
      level: LogLevel = LogLevel.Info,
      message: string | Error = null,
      data: any = {}
   ) {
      if (message instanceof Error) {
         data.error = message;
         data.stack = message.stack;
         message = message.message;
      }

      if (typeof message != 'string') {
         message = String(message);
      }

      const { threshold, prefix } = this.config;

      if (level < threshold) {
         return;
      }

      const output = this.format(level, prefix + message, data);
      console.log(output);
   }

   format(level: LogLevel, message: string | Error, data: any = null): string {
      const { color, readable } = this.config;
      const flat = data != null ? flatten(data, { delimiter: '#' }) : '';
      const ctx = { ...flat, level, message };
      const string = logfmt.stringify(ctx);
      const levelName = LogLevel[level];
      const text: string =
         message instanceof Error ? message.toString() : message;

      if (readable && color) {
         const tag = `${Color[level](`[${levelName}]`)}`;
         const msg = level > LogLevel.Warn ? chalk.red(text) : message;
         const obj = `${chalk.gray(string)}`;
         return `${tag} ${msg} ${obj}`;
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

/**
 * Create a logger singleton with sane defaults.
 */
export const log = new Logger();
