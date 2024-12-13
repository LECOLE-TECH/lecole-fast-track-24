import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react"
import { io, Socket } from "socket.io-client"
import { useStore } from "~/store"

interface SocketContextProps {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextProps | null>(null)

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [token, setToken] = useState<string | null>(useStore.getState().token)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const unsubscribe = useStore.subscribe(() => {
      const newToken = useStore.getState().token
      setToken(newToken)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!token || token === "null") {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const newSocket = io("http://localhost:3000", {
      auth: {
        token
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider")
  }

  return context
}
