import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

class MockWorker {
  url: string;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  constructor(stringUrl: string) {
    this.url = stringUrl;
  }
  postMessage(msg: any) {
    // mock behavior
    if (msg.type === 'INIT' && this.onmessage) {
      this.onmessage({ data: { type: 'RDKIT_READY' } });
    }
  }
  terminate() {}
}

global.Worker = MockWorker as any;
