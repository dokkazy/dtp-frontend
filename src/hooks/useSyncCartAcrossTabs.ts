import { useEffect, useRef } from "react";
import { useCartStore } from "@/providers/CartProvider";

export function useSyncCartAcrossTabs() {
  const { setCartState, clearCart } = useCartStore((state) => state);
  const lastKnownCartJson = useRef<string | null>(null);

  useEffect(() => {
    // Storage event handler
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart-store" && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          if (newState?.state) {
            setCartState(newState.state);
            lastKnownCartJson.current = e.newValue;
          }
        } catch (error) {
          console.error("Error syncing cart across tabs:", error);
        }
      }
    };

    // Polling function to check localStorage
    const checkLocalStorage = () => {
      const currentCartJson = localStorage.getItem("cart-store");

      // If localStorage has changed but storage event wasn't fired (happens in some cases)
      if (currentCartJson && currentCartJson !== lastKnownCartJson.current) {
        try {
          const newState = JSON.parse(currentCartJson);
          if (newState?.state) {
            setCartState(newState.state);
            lastKnownCartJson.current = currentCartJson;
          }
        } catch (error) {
          console.error("Error checking localStorage:", error);
        }
      } // Nếu cart-store đã tồn tại trước đó nhưng giờ đã bị xóa
      else if (!currentCartJson && lastKnownCartJson.current) {
        clearCart();
        lastKnownCartJson.current = null;
        console.log(
          "Cart store was manually deleted from localStorage (detected via polling)",
        );
      }
    };

    // Initialize lastKnownCartJson
    lastKnownCartJson.current = localStorage.getItem("cart-store");

    // Set up event listener
    window.addEventListener("storage", handleStorageChange);

    // Set up polling (check every 2 seconds)
    const intervalId = setInterval(checkLocalStorage, 2000);

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [setCartState, clearCart]);
}
