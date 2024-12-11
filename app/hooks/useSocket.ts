import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "~/store/authStore";

const useSocket = (): Socket | null => {
	const token = useAuthStore((state) => state.token);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!token) {
			console.log("useSocket: No token available");
			return;
		}

		console.log("useSocket: Initializing socket with token:", token);

		const newSocket = io(import.meta.env.VITE_API_URL, {
			auth: {
				token,
			},
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
	}, [token]);

	return socket;
};

export default useSocket;
