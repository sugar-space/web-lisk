import { isValidJSON } from "~/utils/helpers";

type WebSocketType = "ALERT" | "MEDIASHARE" | "MILESTONE";

interface useWebSocket<T> {
  address: string;
  type: WebSocketType;
  onNewData: (data: T) => void;
}

export function useWebSocket<T>({ address, type, onNewData }: useWebSocket<T>) {
  const url = `${import.meta.env.VITE_BE_URL}/${type.toLowerCase()}?address=${address}`;
  const ws = new WebSocket(url);

  ws.addEventListener("open", () => {
    console.log("onopen");
    ws.send("ping");
  });

  ws.addEventListener("message", (event) => {
    if (isValidJSON(event.data)) {
      const message = JSON.parse(event.data);
      console.log(message);

      onNewData(message.payload);

      // setTimeout(() => {
      //   setMessages(null);
      // }, mediashareEnd);
    }
  });

  ws.addEventListener("close", () => {
    console.warn("WebSocket closed, attempting to reconnect...");
    setInterval(() => window.location.reload(), 1000 * 5);
  });

  ws.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}
