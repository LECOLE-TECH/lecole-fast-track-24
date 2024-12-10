import { useEffect, useRef } from "react";
import type { User } from "@/types/index";

export const useWebSocket = (onUserUpdate: (users: User[]) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("your-websocket-url");

    ws.current.onmessage = (event) => {
      const users = JSON.parse(event.data);
      onUserUpdate(users);
    };

    return () => {
      ws.current?.close();
    };
  }, [onUserUpdate]);

  return ws.current;
};
