import { useState } from "react";
import { ArrowLeft, Heart, Trash2, Package, LayoutGrid, X, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AuthWidget } from "@/components/AuthWidget";
import { MobileDock } from "@/components/MobileDock";
import { useFavorites, FavoriteOffer } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFPOOffers, FPOOfferAPI, getAuthToken } from "@/lib/api";
import { FPOCard } from "@/components/FPOCard";
import { toast } from "sonner";
 import { Footer } from "@/components/Footer";

const Watchlist = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  
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

  const toggleCompareSelection = (offerId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(offerId)) {
        return prev.filter((id) => id !== offerId);
      }
      if (prev.length >= 4) {
        toast.error("Maximum 4 items can be compared");
        return prev;
      }
      return [...prev, offerId];
    });
  };

  const selectedOffers = favoriteOffers.filter((o) => selectedForCompare.includes(o.id));

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedForCompare([]);
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
            {favoriteOffers.length >= 2 && !compareMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareMode(true)}
                className="rounded-xl gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </Button>
            )}
            {compareMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={exitCompareMode}
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
            {favorites.length > 0 && !compareMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="rounded-xl text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
            <AuthWidget />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Compare Mode Banner */}
        {compareMode && (
          <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compare Mode</p>
                <p className="text-sm text-muted-foreground">
                  Select 2-4 offers to compare side by side
                </p>
              </div>
              <Badge variant="secondary">
                {selectedForCompare.length}/4 selected
              </Badge>
            </div>
            {selectedForCompare.length >= 2 && (
              <Button
                className="w-full mt-3 rounded-xl"
                onClick={() => {
                  // Scroll to comparison view
                  document.getElementById("comparison-view")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                View Comparison
              </Button>
            )}
          </div>
        )}

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

            {/* Show offers with comparison checkboxes */}
            {favoriteOffers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteOffers.map((offer) => (
                  <div key={offer.id} className="relative">
                    {compareMode && (
                      <div
                        className="absolute top-3 left-3 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedForCompare.includes(offer.id)}
                          onCheckedChange={() => toggleCompareSelection(offer.id)}
                          className="h-5 w-5 bg-background border-2"
                        />
                      </div>
                    )}
                    <div className={compareMode && selectedForCompare.includes(offer.id) ? "ring-2 ring-primary rounded-2xl" : ""}>
                      <FPOCard offer={offer} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comparison Table */}
            {compareMode && selectedOffers.length >= 2 && (
              <div id="comparison-view" className="mt-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-32">
                          Attribute
                        </th>
                        {selectedOffers.map((offer) => (
                          <th key={offer.id} className="text-left py-3 px-4 min-w-[150px]">
                            <p className="font-semibold text-sm">{offer.fpoName}</p>
                            <p className="text-xs text-muted-foreground">{offer.commodity}</p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ComparisonRow
                        label="Price"
                        values={selectedOffers.map((o) => `₹${o.price.toFixed(2)}/${o.unit}`)}
                        highlight="lowest"
                        rawValues={selectedOffers.map((o) => o.price)}
                      />
                      <ComparisonRow
                        label="Variety"
                        values={selectedOffers.map((o) => o.variety)}
                      />
                      <ComparisonRow
                        label="Quantity"
                        values={selectedOffers.map((o) => `${o.quantity} ${o.unit}`)}
                        highlight="highest"
                        rawValues={selectedOffers.map((o) => o.quantity)}
                      />
                      <ComparisonRow
                        label="Min Order"
                        values={selectedOffers.map((o) => `${o.minOrderQty} ${o.unit}`)}
                        highlight="lowest"
                        rawValues={selectedOffers.map((o) => o.minOrderQty)}
                      />
                      <ComparisonRow
                        label="Grade"
                        values={selectedOffers.map((o) => o.grade)}
                      />
                      <ComparisonRow
                        label="Location"
                        values={selectedOffers.map((o) => o.address)}
                      />
                      <ComparisonRow
                        label="Available From"
                        values={selectedOffers.map((o) => new Date(o.availableFrom).toLocaleDateString())}
                      />
                      <ComparisonRow
                        label="Verified"
                        values={selectedOffers.map((o) => o.verified ? "✓ Yes" : "✗ No")}
                      />
                    </tbody>
                  </table>
                </div>
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
       
       <Footer />
    </div>
  );
};

interface ComparisonRowProps {
  label: string;
  values: string[];
  highlight?: "lowest" | "highest";
  rawValues?: number[];
}

const ComparisonRow = ({ label, values, highlight, rawValues }: ComparisonRowProps) => {
  let highlightIndex = -1;

  if (highlight && rawValues) {
    if (highlight === "lowest") {
      const min = Math.min(...rawValues);
      highlightIndex = rawValues.indexOf(min);
    } else {
      const max = Math.max(...rawValues);
      highlightIndex = rawValues.indexOf(max);
    }
  }

  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm text-muted-foreground">{label}</td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`py-3 px-4 text-sm ${
            i === highlightIndex
              ? "font-semibold text-primary bg-primary/5"
              : "text-foreground"
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
};

export default Watchlist;
