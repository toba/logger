import '@toba/test';
import { is } from '@toba/tools';
import { serialize, flatten } from './format';

// Tests adapted from
// https://github.com/csquared/node-logfmt/blob/master/test/stringify_test.js
// https://github.com/hughsk/flat/blob/master/test/test.js

test('serializes objects with symbols in key names', () => {
   expect(
      serialize({
         foo: 'bar',
         a: 14,
         baz: 'hello kitty',
         'cool%story': 'bro',
         f: true,
         '%^asdf': true
      })
   ).toBe('foo=bar a=14 baz="hello kitty" cool%story=bro f=true %^asdf=true');
});

test('serializes simple key value pairs', () => {
   const data = { foo: 'bar', a: 14 };
   expect(serialize(data)).toBe('foo=bar a=14');
});

test('serializes true and false', () => {
   const data = { foo: true, bar: false };
   expect(serialize(data)).toBe('foo=true bar=false');
});

test('quotes strings with spaces in them', () => {
   const data = { foo: 'hello kitty' };
   expect(serialize(data)).toBe('foo="hello kitty"');
});

test('quotes strings with equals in them', () => {
   const data = { foo: 'hello=kitty' };
   expect(serialize(data)).toBe('foo="hello=kitty"');
});

test('escapes quotes within strings with spaces in them', () => {
   let data = { foo: 'hello my "friend"' };
   expect(serialize(data)).toBe('foo="hello my \\"friend\\""');
   data = { foo: 'hello my "friend" whom I "love"' };
   expect(serialize(data)).toBe(
      'foo="hello my \\"friend\\" whom I \\"love\\""'
   );
});

test('escapes backslahes within strings', () => {
   const data = { foo: 'why would you use \\LaTeX?' };
   expect(serialize(data)).toBe('foo="why would you use \\\\LaTeX?"');
});

test('serializes undefined as nothing', () => {
   const data = { foo: undefined };
   expect(serialize(data)).toBe('foo=');
});

test('serializes null as nothing', () => {
   const data = { foo: null };
   expect(serialize(data)).toBe('foo=');
});

test('serializes object with inherited properties', () => {
   const defaults = { foo: 42, bar: 'abc' };
   const data = Object.create(defaults);
   data.foo = 13;
   expect(serialize(data)).toBe('foo=13 bar=abc');
});

test('flattens nested object', () => {
   const data = {
      hello: {
         lorem: {
            ipsum: 'again',
            dolor: 'sit'
         }
      },
      world: {
         lorem: {
            ipsum: 'again',
            dolor: 'sit'
         }
      }
   };
   expect(flatten(data)).toEqual({
      'hello.lorem.ipsum': 'again',
      'hello.lorem.dolor': 'sit',
      'world.lorem.ipsum': 'again',
      'world.lorem.dolor': 'sit'
   });
});

test('flattens empty objects', () => {
   const data = {
      hello: {
         empty: {
            nested: {}
         }
      }
   };

   expect(flatten(data)).toEqual({
      'hello.empty.nested': {}
   });
});

test('flattens objects with array values', () => {
   const data = {
      items: [{ index: 1 }, { index: 2 }]
   };
   expect(flatten(data)).toEqual({
      'items.0.index': 1,
      'items.1.index': 2
   });
});

if (is.value(Buffer)) {
   test('flattens objects with Buffer values', () => {
      const data = {
         hello: {
            empty: {
               nested: Buffer.from('test')
            }
         }
      };
      expect(flatten(data)).toEqual({
         'hello.empty.nested': Buffer.from('test')
      });
   });
}

if (is.value(Uint8Array)) {
   test('flattens objects with Uint8Arrays', () => {
      const data = {
         hello: {
            empty: {
               nested: new Uint8Array([1, 2, 3, 4])
            }
         }
      };
      expect(flatten(data)).toEqual({
         'hello.empty.nested': new Uint8Array([1, 2, 3, 4])
      });
   });
}
