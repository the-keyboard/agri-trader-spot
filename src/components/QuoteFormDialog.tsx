import { useState } from "react";
import { FPOOffer } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: FPOOffer;
  onQuoteGenerated: (quoteNo: string) => void;
}

export const QuoteFormDialog = ({
  open,
  onOpenChange,
  offer,
  onQuoteGenerated,
}: QuoteFormDialogProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(offer.minOrderQty.toString());
  const [location, setLocation] = useState("");
  const [offerPrice, setOfferPrice] = useState(offer.price.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseFloat(quantity);
    if (qty < offer.minOrderQty) {
      toast({
        title: "Invalid Quantity",
        description: `Minimum order quantity is ${offer.minOrderQty} ${offer.unit}`,
        variant: "destructive",
      });
      return;
    }

    // Generate quote number
    const quoteNo = `QT${Date.now().toString().slice(-8)}`;
    
    // Create quote object
    const newQuote = {
      quoteNo,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      cropName: offer.commodity,
      fpoName: offer.fpoName,
      quantity: qty,
      unit: offer.unit,
      price: parseFloat(offerPrice),
      offerPrice: offer.price,
      location,
      status: "Open" as const,
    };

    // Save to localStorage
    const existingQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    existingQuotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(existingQuotes));

    toast({
      title: "Quote Generated",
      description: `Quote No: ${quoteNo}`,
    });

    onQuoteGenerated(quoteNo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Quote</DialogTitle>
          <DialogDescription>
            Fill in the details to generate a quote for {offer.commodity}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantity ({offer.unit}) *
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={offer.minOrderQty}
              required
            />
            <p className="text-xs text-muted-foreground">
              Min order: {offer.minOrderQty} {offer.unit}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Your Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerPrice">
              Your Offer Price (₹/{offer.unit}) *
            </Label>
            <Input
              id="offerPrice"
              type="number"
              step="0.01"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              FPO offer price: ₹{offer.price}/{offer.unit}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Generate Quote
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
