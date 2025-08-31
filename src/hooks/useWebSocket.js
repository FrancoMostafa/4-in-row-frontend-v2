import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket';

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const listenersRef = useRef(new Map());

  // Conectar al WebSocket
  const connect = useCallback(async (gameId) => {
    try {
      setConnectionError(null);
      await websocketService.connect(gameId);
      setIsConnected(true);
    } catch (error) {
      setConnectionError(error.message);
      setIsConnected(false);
    }
  }, []);

  // Desconectar del WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionError(null);
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback((type, payload) => {
    if (isConnected) {
      websocketService.send(type, payload);
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }, [isConnected]);

  // Suscribirse a un evento
  const subscribe = useCallback((event, callback) => {
    websocketService.on(event, callback);
    
    // Guardar referencia para limpieza
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event).push(callback);
    
    // Retornar función de limpieza
    return () => {
      websocketService.off(event, callback);
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }, []);

  // Limpiar todas las suscripciones al desmontar
  useEffect(() => {
    return () => {
      listenersRef.current.forEach((listeners, event) => {
        listeners.forEach(callback => {
          websocketService.off(event, callback);
        });
      });
      listenersRef.current.clear();
      disconnect();
    };
  }, [disconnect]);

  // Monitorear estado de conexión
  useEffect(() => {
    const checkConnection = () => {
      const state = websocketService.getConnectionState();
      setIsConnected(state === WebSocket.OPEN);
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    connectionError,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribe
  };
};

export default useWebSocket;