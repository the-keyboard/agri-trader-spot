import { useState } from "react";
import { MapPin, Package, Calendar, BadgeCheck, Navigation } from "lucide-react";
import { FPOOffer } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuoteFormDialog } from "./QuoteFormDialog";

interface FPOCardProps {
  offer: FPOOffer;
}

export const FPOCard = ({ offer }: FPOCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quoteNo, setQuoteNo] = useState<string | null>(null);

  const handleQuoteGenerated = (newQuoteNo: string) => {
    setQuoteNo(newQuoteNo);
  };

  const handleLocationClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${offer.lat},${offer.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{offer.fpoName}</h3>
              {offer.verified && (
                <BadgeCheck className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin className="w-3 h-3" />
              <span>{offer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                📍 {offer.distance}
              </span>
              <button
                onClick={handleLocationClick}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                View on Map
              </button>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {offer.quality}
          </Badge>
        </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Commodity</span>
          <span className="font-medium text-foreground">{offer.commodity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-bold text-lg text-primary">
            ₹{offer.price.toFixed(2)}/{offer.unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="w-3 h-3" />
            <span>Quantity</span>
          </div>
          <span className="font-medium text-foreground">
            {offer.quantity} {offer.unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Available</span>
          </div>
          <span className="font-medium text-foreground">
            {new Date(offer.availableFrom).toLocaleDateString()}
          </span>
        </div>
      </div>

        <Button 
          className="w-full" 
          size="sm"
          onClick={() => quoteNo ? null : setDialogOpen(true)}
        >
          {quoteNo ? `Track Quote: ${quoteNo}` : "Request Quotation"}
        </Button>
      </div>

      <QuoteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        offer={offer}
        onQuoteGenerated={handleQuoteGenerated}
      />
    </>
  );
};
