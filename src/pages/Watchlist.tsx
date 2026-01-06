import { useState } from "react";
import { ArrowLeft, Heart, Trash2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AuthWidget } from "@/components/AuthWidget";
import { MobileDock } from "@/components/MobileDock";
import { useFavorites, FavoriteOffer } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFPOOffers, FPOOfferAPI, getAuthToken } from "@/lib/api";
import { FPOCard } from "@/components/FPOCard";
import { toast } from "sonner";

const Watchlist = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  
  const { data: allOffers = [] } = useQuery({
    queryKey: ["all-fpo-offers"],
    queryFn: fetchAllFPOOffers,
  });

  // Match favorites with full offer data
  const favoriteOffers = favorites
    .map((fav) => allOffers.find((offer) => offer.id === fav.id))
    .filter((offer): offer is FPOOfferAPI => offer !== undefined);

  const handleClearAll = () => {
    if (window.confirm("Remove all items from your watchlist?")) {
      clearFavorites();
      toast.success("Watchlist cleared");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavigationMenu />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h1 className="text-lg font-semibold">Watchlist</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="rounded-xl text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <AuthWidget />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {favorites.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Your watchlist is empty</p>
              <p className="text-muted-foreground mb-4">
                Add FPO offers to your watchlist for quick access
              </p>
              <Button onClick={() => navigate("/")} className="rounded-xl">
                Browse FPO Offers
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {favorites.length} item{favorites.length !== 1 ? "s" : ""} in watchlist
            </p>

            {/* Show offers that still exist in the API */}
            {favoriteOffers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteOffers.map((offer) => (
                  <FPOCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}

            {/* Show unavailable favorites */}
            {favorites.length > favoriteOffers.length && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Unavailable offers ({favorites.length - favoriteOffers.length})
                </p>
                <div className="space-y-2">
                  {favorites
                    .filter((fav) => !allOffers.some((o) => o.id === fav.id))
                    .map((fav) => (
                      <Card key={fav.id} className="rounded-xl opacity-60">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{fav.fpoName}</p>
                            <p className="text-sm text-muted-foreground">
                              {fav.commodity} - {fav.variety} • ₹{fav.price}/{fav.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              This offer is no longer available
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              removeFavorite(fav.id);
                              toast.success("Removed from watchlist");
                            }}
                            className="rounded-xl text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <MobileDock />
    </div>
  );
};

export default Watchlist;
