import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface WebSocketContextProps {
  socket: Socket | null;
  emit: (eventName: string, data: any) => void;
  on: (eventName: string, callback: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  const emit = useCallback((eventName: string, data: any) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  }, [socket]);

  const on = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(eventName, callback);
      }
      return () => {
        if (socket) {
          socket.off(eventName, callback);
        }
      };
    },
    [socket]
  );

  return (
    <WebSocketContext.Provider value={{ socket, emit, on }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};