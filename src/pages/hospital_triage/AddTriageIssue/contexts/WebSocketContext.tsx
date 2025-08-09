import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../store/user/user.selector";

interface WebSocketContextType {
  socket: WebSocket | null;
  sendMessage: (data: any) => void;
  isMessageConsumed: boolean;
  setIsMessageConsumed: React.Dispatch<React.SetStateAction<boolean>>;
  receivedMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // message triggers re-render or incomplete form check
  // zone > 1 navigate
  // zone = 1 finalize
  // zone = null, keep
  const [receivedMessage, setReceivedMessage] = useState<any>(null);
  const [isMessageConsumed, setIsMessageConsumed] = useState(false);

  const user = useSelector(selectCurrentUser);
  const delay = 10000;

  const sendMessage = useCallback(
    (data: any) => {
      if (socket) socket.send(JSON.stringify(data));
    },
    [socket]
  );

  useEffect(() => {
    if (user.token) {
      let intervalId: NodeJS.Timer;
      const ws = new WebSocket(
        "ws://hospitaldashboard-env.eba-mqytecux.ap-south-1.elasticbeanstalk.com/api/v1/triage",
        user.token
      );

      const ping = () => {
        ws.send(JSON.stringify({ type: "ping" }));
      };

      const wsOpenHandler = () => {
        console.log("WebSocket connection established.");
        intervalId = setInterval(ping, delay);
        setSocket(ws);
      };

      const wsMessageHandler = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setReceivedMessage(data);
        console.log("Received message:", data);
      };

      const wsCloseHandler = (event: CloseEvent) => {
        if (intervalId) clearInterval(intervalId);
        setSocket(null);
        console.log("WebSocket connection closed", event);
      };

      const wsErrorHandler = (error: Event) => {
        console.error("WebSocket error: ", error);
      };

      ws.addEventListener("open", wsOpenHandler);
      ws.addEventListener("message", wsMessageHandler);
      ws.addEventListener("close", wsCloseHandler);
      ws.addEventListener("error", wsErrorHandler);

      return () => {
        if (intervalId) clearInterval(intervalId);
        ws.removeEventListener("open", wsOpenHandler);
        ws.removeEventListener("message", wsMessageHandler);
        ws.removeEventListener("close", wsCloseHandler);
        ws.removeEventListener("error", wsErrorHandler);
        console.log("Closing socket connection.");
        ws.close();
      };
    }
  }, [user.token]);

  useEffect(() => {
    if (isMessageConsumed) {
      setIsMessageConsumed(false);
      setReceivedMessage(null);
    }
  }, [isMessageConsumed]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        sendMessage,
        receivedMessage,
        isMessageConsumed,
        setIsMessageConsumed,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
