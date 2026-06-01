type SSECallback = (data: any) => void;

class SSEService {
  private eventSource: EventSource | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onMessageCallback: SSECallback | null = null;
  private onErrorCallback: SSECallback | null = null;
  private onCompleteCallback: SSECallback | null = null;
  private isIntentionalClose = false;

  constructor(url: string) {
    this.url = url;
  }

  onMessage(callback: SSECallback) {
    this.onMessageCallback = callback;
    return this;
  }

  onError(callback: SSECallback) {
    this.onErrorCallback = callback;
    return this;
  }

  onComplete(callback: SSECallback) {
    this.onCompleteCallback = callback;
    return this;
  }

  connect() {
    this.isIntentionalClose = false;
    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
        
        // Handle completion signal
        if (data.status === 'completed') {
          if (this.onCompleteCallback) this.onCompleteCallback(data);
          this.disconnect();
        }
      } catch (e) {
        console.error('SSE Message Parse Error', e);
      }
    };

    this.eventSource.onerror = (error) => {
      if (this.isIntentionalClose) return;
      
      console.error('SSE Error:', error);
      if (this.onErrorCallback) this.onErrorCallback(error);
      
      this.eventSource?.close();
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max SSE reconnect attempts reached.');
      return;
    }

    const timeout = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectAttempts++;
    
    console.log(`Reconnecting SSE in ${timeout}ms...`);
    setTimeout(() => {
      if (!this.isIntentionalClose) {
        this.connect();
      }
    }, timeout);
  }

  disconnect() {
    this.isIntentionalClose = true;
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const createSSEConnection = (url: string) => {
  return new SSEService(url);
};
