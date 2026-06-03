import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSSEConnection } from './sseService';

// Mock EventSource
class MockEventSource {
  url: string;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  
  constructor(url: string) {
    this.url = url;
  }
  
  close() {}
}

global.EventSource = MockEventSource as any;

describe('SSEService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should call onMessage when event is received', () => {
    const sse = createSSEConnection('test-url');
    const messageMock = vi.fn();
    
    sse.onMessage(messageMock);
    sse.connect();
    
    // @ts-ignore
    const eventSourceInstance = sse.eventSource as MockEventSource;
    
    expect(eventSourceInstance).toBeDefined();
    expect(eventSourceInstance.url).toBe('test-url');
    
    // Simulate incoming message
    if (eventSourceInstance.onmessage) {
      eventSourceInstance.onmessage({ data: JSON.stringify({ progress: 45 }) });
    }
    
    expect(messageMock).toHaveBeenCalledWith({ progress: 45 });
  });

  it('should auto-disconnect on completed status', () => {
    const sse = createSSEConnection('test-url');
    const completeMock = vi.fn();
    
    sse.onComplete(completeMock);
    sse.connect();
    
    // @ts-ignore
    const eventSourceInstance = sse.eventSource as MockEventSource;
    const closeSpy = vi.spyOn(eventSourceInstance, 'close');
    
    if (eventSourceInstance.onmessage) {
      eventSourceInstance.onmessage({ data: JSON.stringify({ status: 'completed' }) });
    }
    
    expect(completeMock).toHaveBeenCalledWith({ status: 'completed' });
    expect(closeSpy).toHaveBeenCalled();
  });
});
