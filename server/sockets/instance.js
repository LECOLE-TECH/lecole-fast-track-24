let io = null;

export const setIO = (ioInstance) => {
	io = ioInstance;
};

export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};
