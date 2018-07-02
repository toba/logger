import '@toba/test';
import { serialize } from './format';

// Tests copied from Heroku
// https://github.com/csquared/node-logfmt/blob/master/test/stringify_test.js

// test('serializes nested objects', () => {
//    expect(serialize({ data: [{ index: 1 }, { index: 2 }] })).toBe(
//       'data#0#index=1 data#1#index=2'
//    );
// });

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

test('quotes strings with spaces in them', function() {
   const data = { foo: 'hello kitty' };
   expect(serialize(data)).toBe('foo="hello kitty"');
});

test('quotes strings with equals in them', function() {
   const data = { foo: 'hello=kitty' };
   expect(serialize(data)).toBe('foo="hello=kitty"');
});

test('escapes quotes within strings with spaces in them', function() {
   let data = { foo: 'hello my "friend"' };
   expect(serialize(data)).toBe('foo="hello my \\"friend\\""');
   data = { foo: 'hello my "friend" whom I "love"' };
   expect(serialize(data)).toBe(
      'foo="hello my \\"friend\\" whom I \\"love\\""'
   );
});

test('escapes backslahes within strings', function() {
   const data = { foo: 'why would you use \\LaTeX?' };
   expect(serialize(data)).toBe('foo="why would you use \\\\LaTeX?"');
});

test('serializes undefined as nothing', function() {
   const data = { foo: undefined };
   expect(serialize(data)).toBe('foo=');
});

test('serializes null as nothing', function() {
   const data = { foo: null };
   expect(serialize(data)).toBe('foo=');
});

test('serializes object with inherited properties', function() {
   const defaults = { foo: 42, bar: 'abc' };
   const data = Object.create(defaults);
   data.foo = 13;
   expect(serialize(data)).toBe('foo=13 bar=abc');
});
