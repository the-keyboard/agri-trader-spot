import { MapPin, Package, Calendar, BadgeCheck } from "lucide-react";
import { FPOOffer } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FPOCardProps {
  offer: FPOOffer;
}

export const FPOCard = ({ offer }: FPOCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{offer.fpoName}</h3>
            {offer.verified && (
              <BadgeCheck className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{offer.location}</span>
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

      <Button className="w-full" size="sm">
        Request Quotation
      </Button>
    </div>
  );
};
