import { useState, useEffect, useCallback } from "react";
import { FPOOfferAPI } from "@/lib/api";

const FAVORITES_KEY = "fpo_favorites";

export interface FavoriteOffer {
  id: string;
  fpoName: string;
  commodity: string;
  variety: string;
  price: number;
  unit: string;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteOffer[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  // Save to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: FavoriteOffer[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch {}
  }, []);

  const addFavorite = useCallback((offer: FPOOfferAPI) => {
    const newFavorite: FavoriteOffer = {
      id: offer.id,
      fpoName: offer.fpoName,
      commodity: offer.commodity,
      variety: offer.variety,
      price: offer.price,
      unit: offer.unit,
      addedAt: new Date().toISOString(),
    };

    setFavorites((prev) => {
      // Don't add duplicates
      if (prev.some((f) => f.id === offer.id)) {
        return prev;
      }
      const updated = [...prev, newFavorite];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((offerId: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== offerId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((offer: FPOOfferAPI) => {
    const isFav = favorites.some((f) => f.id === offer.id);
    if (isFav) {
      removeFavorite(offer.id);
    } else {
      addFavorite(offer);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((offerId: string) => {
    return favorites.some((f) => f.id === offerId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
