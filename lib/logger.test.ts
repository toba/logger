import '@toba/test';
import { log, LogLevel } from './index';
import { Logger } from './logger';

const logMock = jest.fn();
console.log = logMock;

beforeAll(() => {
   log.update({ color: false });
});

test('formats log message', () => {
   expect(log.format(LogLevel.Error, 'error message')).toMatchSnapshot();
   expect(
      log.format(LogLevel.Warn, 'warn message', { key: 'value' })
   ).toMatchSnapshot();
   log.update({ readable: false });
   expect(log.format(LogLevel.Info, 'info message')).toMatchSnapshot();
});

test('call', () => {
   log.update({ readable: true }).debug('message', {
      data: [{ index: 1 }, { index: 2 }]
   });

   expect(logMock).toHaveBeenCalledWith(
      '[Debug] message data#0#index=1 data#1#index=2 level=1 message=message'
   );
});

test('export log singleton', () => {
   expect(log).toBeDefined();
   expect(log).toBeInstanceOf(Logger);
});

test('be instantiable', () => {
   const l = new Logger();
   expect(l).toBeInstanceOf(Logger);
});
