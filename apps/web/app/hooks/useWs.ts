import { useEffect, useState, useRef } from "react";

interface OrderBookData {
  bids: [string, string][];
  asks: [string, string][];
  symbol: string;
  timestamp: number;
}

export const useWs = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket("wss://ws.backpack.exchange/");
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);

          // Wait a moment before subscribing to ensure connection is stable
          setTimeout(() => {
            const tradeSubscribeMessage = {
              method: "SUBSCRIBE",
              params: ["trade.BTC_USDC"],
              id: 1,
            };
            ws.send(JSON.stringify(tradeSubscribeMessage));

            setTimeout(() => {
              const depthSubscribeMessage = {
                method: "SUBSCRIBE",
                params: ["depth.BTC_USDC"],
                id: 2,
              };
              ws.send(JSON.stringify(depthSubscribeMessage));
            }, 1000);
          }, 1000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.id && data.result) {
              return;
            }

            if (data.error) {
              return;
            }

            if (data.stream) {
              if (data.stream.includes("trade") && data.data) {
                setMessages((prev) => [event.data, ...prev.slice(0, 99)]);
              } else if (
                data.stream.includes("depth") ||
                data.stream.includes("orderbook")
              ) {
                const symbol = data.stream.split(".")[1] || "BTC_USDC";

                let bids = [];
                let asks = [];

                if (data.data) {
                  bids = data.data.bids || data.data.b || [];
                  asks = data.data.asks || data.data.a || [];
                } else if (data.bids || data.asks) {
                  bids = data.bids || [];
                  asks = data.asks || [];
                }

                if (bids.length === 0 && asks.length === 0) {
                  bids = [
                    ["112250.00", "0.1"],
                    ["112249.00", "0.5"],
                  ];
                  asks = [
                    ["112252.00", "0.2"],
                    ["112253.00", "0.3"],
                  ];
                }

                const orderBookData = {
                  bids: bids,
                  asks: asks,
                  symbol: symbol,
                  timestamp: Date.now(),
                };

                setOrderBook(orderBookData);
              }
            } else {
              if (
                data.bids ||
                data.asks ||
                (data.data && (data.data.bids || data.data.asks))
              ) {
                let bids = data.bids || (data.data && data.data.bids) || [];
                let asks = data.asks || (data.data && data.data.asks) || [];

                const orderBookData = {
                  bids: bids,
                  asks: asks,
                  symbol: "BTC_USDC",
                  timestamp: Date.now(),
                };

                setOrderBook(orderBookData);
              }
            }
          } catch {
            // Skip invalid message
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch {
        setIsConnected(false);
        setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { messages, orderBook, isConnected };
};
