import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export const useWebSocket = (url: string) => {
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

  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(eventName, callback);
    }
    return () => {
      if (socket) {
        socket.off(eventName, callback);
      }
    };
  }, [socket]);

  return { socket, emit, on };
};

