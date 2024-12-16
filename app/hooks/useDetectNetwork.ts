import { useEffect, useState } from "react";

export default function useDetectNetwork() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  }, []);

  return { isOnline };
}
