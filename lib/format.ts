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

type Hash = { [key: string]: any };

/**
 * Combine nested objest keys into compound keys so object has only one level of
 * key-values. Adapted from `hughsk/flat`.
 *
 * @example
 * flatten({
 *    key1: {
 *       keyA: 'valueI'
 *    },
 *    key2: {
 *       keyB: 'valueII'
 *    },
 *    key3: { a: { b: { c: 2 } } }
 * })
 * =>
 * {
 *   'key1.keyA': 'valueI',
 *   'key2.keyB': 'valueII',
 *   'key3.a.b.c': 2
 * }
 *
 * @see https://github.com/hughsk/flat
 */
export function flatten(target: Hash, delimiter = '.'): Hash {
   const output: Hash = {};
   const step = (
      input: Hash,
      parentKey: string = null,
      depth: number = 1
   ): void =>
      Object.keys(input).forEach(key => {
         const value = input[key];
         const newKey = parentKey !== null ? parentKey + delimiter + key : key;

         if (is.hash(value, false) || is.array(value)) {
            return step(value, newKey, depth + 1);
         }
         output[newKey] = value;
      });

   step(target);

   return output;
}
