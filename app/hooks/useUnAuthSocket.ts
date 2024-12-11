import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useUnAuthSocket = (): Socket | null => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(`${import.meta.env.VITE_API_URL}/auth`, {
			reconnectionAttempts: 5,
			reconnectionDelay: 3000,
		});

		setSocket(newSocket);

		newSocket.on("connect", () => {
			console.log("Connected to Socket.io server");
		});

		newSocket.on("disconnect", (reason) => {
			console.log("Disconnected from Socket.io server:", reason);
		});

		newSocket.on("connect_error", (err) => {
			console.error("Socket connection error:", err.message);
		});

		return () => {
			newSocket.disconnect();
			console.log("Socket disconnected");
		};
	}, []);

	return socket;
};

export default useUnAuthSocket;
