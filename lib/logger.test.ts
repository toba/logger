import { log, Logger, LogLevel } from './logger';

const example = new Logger({
   readable: true,
   color: true,
   level: LogLevel.Debug
});

example.debug('message', { data: [{ index: 1 }, { index: 2 }] });
example.info('message', { data: [{ index: 1 }, { index: 2 }] });
example.warn('message', { data: [{ index: 1 }, { index: 2 }] });
example.error('message', { data: [{ index: 1 }, { index: 2 }] });

example.error(new Error('An error occured!'));

test('export `log`', () => {
   expect(log).toBeDefined();
   expect(log).toBeInstanceOf(Logger);
});

test('export `Logger`', () => {
   expect(Logger).toBeDefined();
});

test('be instantiable', () => {
   const l = new Logger();
   expect(l).toBeInstanceOf(Logger);
});

test('should define `logger.debug`', () => {
   expect(typeof log.debug).toBe('function');
});

test('should define `logger.info`', () => {
   expect(typeof log.info).toBe('function');
});

test('should define `logger.warn`', () => {
   expect(typeof log.warn).toBe('function');
});

test('should define `logger.error`', () => {
   expect(typeof log.error).toBe('function');
});
