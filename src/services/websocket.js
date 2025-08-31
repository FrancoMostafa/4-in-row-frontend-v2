import { WS_EVENTS } from '../constants';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
  }

  connect(gameId) {
    const wsUrl = process.env.REACT_APP_4_IN_ROW_WS_URL;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${wsUrl}?gameId=${gameId}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.handleReconnection();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(data) {
    const { type, payload } = data;
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(callback => callback(payload));
  }

  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        // Aquí deberías tener el gameId disponible para reconectar
        // Por simplicidad, emitimos un evento para que el componente maneje la reconexión
        this.emit('reconnection_needed', { attempt: this.reconnectAttempts });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection_failed', { reason: 'Max attempts reached' });
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      this.ws.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  joinGame(gameId, playerName) {
    this.send(WS_EVENTS.JOIN_GAME, { gameId, playerName });
  }

  makeMove(column) {
    this.send(WS_EVENTS.MAKE_MOVE, { column });
  }

  getConnectionState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }
}

export default new WebSocketService();