import { useEffect } from "react";
import { subscribeStock } from "../api";

export default function useStockStream(onMessage, deps = []) {
  useEffect(() => {
    const sub = subscribeStock(onMessage);
    return () => sub.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
