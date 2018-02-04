declare class LogFormat {}

declare interface LogFormat {
   stringify: (obj: any) => string;
}

/**
 * https://github.com/csquared/node-logfmt
 */
declare module 'logfmt' {
   export = LogFormat;
}
