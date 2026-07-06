import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

type HealthPayload = {
  status?: string;
  time?: string;
};

type RegisteredHandler = ((req: unknown, res: { json: (payload: HealthPayload) => void }) => void) | null;

const mockedGet = vi.fn();
const mockedListen = vi.fn();
const originalPort = process.env.PORT;

vi.mock('express', () => {
  const expressFactory = vi.fn(() => ({
    get: mockedGet,
    listen: mockedListen,
  }));

  return {
    default: expressFactory,
  };
});

describe('backend health route wiring', () => {
  beforeEach(() => {
    mockedGet.mockClear();
    mockedListen.mockClear();
    vi.resetModules();
    delete process.env.PORT;
  });

  afterAll(() => {
    if (typeof originalPort === 'undefined') {
      delete process.env.PORT;
      return;
    }

    process.env.PORT = originalPort;
  });

  it('registers GET /health and returns status UP with parseable time', async () => {
    await import('../../src/index.ts');

    expect(mockedListen).toHaveBeenCalledTimes(1);
    expect(mockedGet).toHaveBeenCalledWith('/health', expect.any(Function));

    const registeredHandler = mockedGet.mock.calls[0]?.[1] as RegisteredHandler;
    expect(registeredHandler).toBeTypeOf('function');

    let payload: HealthPayload | undefined;
    const response = {
      json: (body: HealthPayload) => {
        payload = body;
      },
    };

    registeredHandler?.({}, response);

    expect(payload?.status).toBe('UP');
    expect(payload?.time).toBeTypeOf('string');
    expect(Number.isNaN(Date.parse(payload?.time ?? ''))).toBe(false);
  });

  it('uses default port 3000 when PORT env var is not set', async () => {
    await import('../../src/index.ts');

    expect(mockedListen).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it('uses PORT env var when provided', async () => {
    process.env.PORT = '4001';

    await import('../../src/index.ts');

    expect(mockedListen).toHaveBeenCalledWith(4001, expect.any(Function));
  });

  it('logs startup message when listen callback executes', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    mockedListen.mockImplementationOnce((port: number, callback?: () => void) => {
      callback?.();
      return { port };
    });

    await import('../../src/index.ts');

    expect(logSpy).toHaveBeenCalledWith('API listening on port 3000');
    logSpy.mockRestore();
  });
});
