import { useState, useEffect, useCallback, useRef } from "react";
import { useTicker } from "./useTicker";
import { toast } from "sonner";

const ALERTS_KEY = "price_alerts";

export interface PriceAlert {
  id: string;
  commodityId: string;
  commodity: string;
  variety: string;
  targetPrice: number;
  direction: "below" | "above";
  enabled: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const { data: tickerData } = useTicker(50);
  const lastCheckRef = useRef<Record<string, number>>({});
  const notificationPermissionRef = useRef<NotificationPermission>("default");

  // Load alerts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch {
      setAlerts([]);
    }

    // Request notification permission
    if ("Notification" in window) {
      notificationPermissionRef.current = Notification.permission;
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          notificationPermissionRef.current = permission;
        });
      }
    }
  }, []);

  // Check alerts against current prices
  useEffect(() => {
    if (!tickerData || alerts.length === 0) return;

    const enabledAlerts = alerts.filter((a) => a.enabled && !a.triggeredAt);
    
    enabledAlerts.forEach((alert) => {
      const ticker = tickerData.find((t) => t.id === alert.commodityId);
      if (!ticker) return;

      const lastPrice = lastCheckRef.current[alert.commodityId];
      const currentPrice = ticker.price;

      // Only trigger if we have a previous price to compare
      if (lastPrice === undefined) {
        lastCheckRef.current[alert.commodityId] = currentPrice;
        return;
      }

      let shouldTrigger = false;

      if (alert.direction === "below" && currentPrice <= alert.targetPrice && lastPrice > alert.targetPrice) {
        shouldTrigger = true;
      } else if (alert.direction === "above" && currentPrice >= alert.targetPrice && lastPrice < alert.targetPrice) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        triggerAlert(alert, currentPrice);
      }

      lastCheckRef.current[alert.commodityId] = currentPrice;
    });
  }, [tickerData, alerts]);

  const triggerAlert = (alert: PriceAlert, currentPrice: number) => {
    const message = `${alert.commodity} (${alert.variety}) is now ₹${currentPrice.toFixed(2)} - ${alert.direction === "below" ? "dropped below" : "rose above"} ₹${alert.targetPrice}`;

    // Show toast notification
    toast.info(`🔔 Price Alert`, {
      description: message,
      duration: 10000,
    });

    // Show browser notification if permitted
    if ("Notification" in window && notificationPermissionRef.current === "granted") {
      new Notification("VBOX Price Alert", {
        body: message,
        icon: "/favicon.ico",
        tag: `price-alert-${alert.id}`,
      });
    }

    // Mark alert as triggered
    setAlerts((prev) => {
      const updated = prev.map((a) =>
        a.id === alert.id ? { ...a, triggeredAt: new Date().toISOString() } : a
      );
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const saveAlerts = useCallback((newAlerts: PriceAlert[]) => {
    try {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
      setAlerts(newAlerts);
    } catch {}
  }, []);

  const addAlert = useCallback(
    (commodityId: string, commodity: string, variety: string, targetPrice: number, direction: "below" | "above" = "below") => {
      const newAlert: PriceAlert = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        commodityId,
        commodity,
        variety,
        targetPrice,
        direction,
        enabled: true,
        createdAt: new Date().toISOString(),
      };

      setAlerts((prev) => {
        const updated = [...prev, newAlert];
        localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
        return updated;
      });

      // Request permission if not granted
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      return newAlert;
    },
    []
  );

  const removeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== alertId);
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) =>
        a.id === alertId ? { ...a, enabled: !a.enabled, triggeredAt: undefined } : a
      );
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetAlert = useCallback((alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) =>
        a.id === alertId ? { ...a, triggeredAt: undefined, enabled: true } : a
      );
      localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllAlerts = useCallback(() => {
    saveAlerts([]);
  }, [saveAlerts]);

  const getAlertsForCommodity = useCallback(
    (commodityId: string) => {
      return alerts.filter((a) => a.commodityId === commodityId);
    },
    [alerts]
  );

  return {
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    resetAlert,
    clearAllAlerts,
    getAlertsForCommodity,
  };
}
