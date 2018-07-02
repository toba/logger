import { is } from '@toba/tools';
import { LogData } from './logger';

/**
 * Generate Heroku `logfmt` compliant content from arbitrary data.
 * @see https://github.com/csquared/node-logfmt
 */
export function serialize(data: LogData): string {
   let line: string = '';

   for (const key in data) {
      let value = data[key];
      let isNull = false;

      if (is.value(value)) {
         value = value.toString();
      } else {
         isNull = true;
         value = '';
      }

      const needsQuotes = value.includes(' ') || value.includes('=');
      const needsEscaped = value.includes('"') || value.includes('\\');

      if (needsEscaped) {
         value = value.replace(/["\\]/g, '\\$&');
      }
      if (needsQuotes) {
         value = '"' + value + '"';
      }
      if (value === '' && !isNull) {
         value = '""';
      }

      line += key + '=' + value + ' ';
   }

   // trim traling space
   return line.substring(0, line.length - 1);
}

export function flatten() {}
