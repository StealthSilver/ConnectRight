import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine socket URL based on environment
    let socketUrl = import.meta.env.VITE_SOCKET_URL;

    if (!socketUrl) {
      // Fallback for development
      if (typeof window !== "undefined") {
        const host = window.location.host;
        // Check if we're in development
        if (host.includes("localhost") || host.includes("127.0.0.1")) {
          socketUrl = "http://localhost:4000";
        } else {
          // For production, use the backend URL from environment or fallback
          socketUrl = "https://connectright.onrender.com";
        }
      } else {
        socketUrl = "http://localhost:4000";
      }
    }

    const newSocket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      // Prioritize polling on Render's free tier (more reliable than websocket)
      transports: ["polling", "websocket"],
      upgrade: true,
      rememberUpgrade: true,
      withCredentials: true,
      path: "/socket.io/",
      forceNew: false,
      rejectUnauthorized: false,
      // Additional timeout settings for better reliability
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      const transport = newSocket.io?.engine?.transport?.name || "unknown";
      console.log("Socket connected:", newSocket.id, "via", transport);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error: any) => {
      const transport = newSocket.io?.engine?.transport?.name || "unknown";
      console.error(
        "Socket connection error via",
        transport + ":",
        error.message || error
      );
      console.log("Will attempt to reconnect...");
    });

    newSocket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
