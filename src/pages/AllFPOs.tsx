import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, MapPin, ArrowLeft, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFPOOffers, FPOOfferAPI } from "@/lib/api";
import { QuoteFormDialog } from "@/components/QuoteFormDialog";
import { FPOOffer } from "@/lib/mockData";

const AllFPOs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const itemsPerPage = 12;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<FPOOffer | null>(null);
  
  const { data: fpoOffers = [], isLoading } = useQuery({
    queryKey: ['all-fpo-offers'],
    queryFn: fetchAllFPOOffers,
  });

  const totalPages = Math.ceil(fpoOffers.length / itemsPerPage);
  const visibleOffers = fpoOffers.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const handleGenerateQuote = (offer: FPOOfferAPI, e: React.MouseEvent) => {
    e.stopPropagation();
    const legacyOffer: FPOOffer = {
      id: offer.id,
      fpoName: offer.fpoName,
      fpoLogo: "🏢",
      commodity: offer.commodity,
      variety: offer.variety,
      price: offer.price,
      unit: offer.unit,
      quantity: offer.maxOrderQty,
      minOrderQty: offer.minOrderQty,
      location: offer.address,
      pincode: "",
      block: "",
      district: "",
      state: "",
      distance: "N/A",
      lat: 0,
      lng: 0,
      quality: offer.grade,
      availableFrom: new Date().toISOString(),
      verified: true
    };
    setSelectedOffer(legacyOffer);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="absolute left-4">
              <NavigationMenu />
            </div>
            <h1 className="text-2xl font-bold text-primary">VBOX Trading</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* FPO Offers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              All FPO Offers
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {fpoOffers.length} offers • Page {page + 1}/{totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))
            ) : (
              visibleOffers.map((offer) => {
                const addressParts = offer.address.split(", ");
                const state = addressParts[addressParts.length - 1] || "";
                const district = addressParts[addressParts.length - 2] || "";
                const slug = `${offer.commodity.toLowerCase().replace(/\s+/g, '')}-${offer.variety.toLowerCase().replace(/\s+/g, '')}`;

                return (
                  <Card 
                    key={offer.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/${slug}`)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Header with Badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">🏢</span>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">
                              {offer.fpoName}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span>{district}, {state}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 text-xs">
                          {offer.fpoType}
                        </Badge>
                      </div>

                      {/* Commodity Info */}
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Commodity</span>
                          <span className="font-medium">{offer.commodity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Variety</span>
                          <span className="font-medium">{offer.variety}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Grade</span>
                          <Badge variant="destructive" className="bg-red-500 text-xs">
                            {offer.grade}
                          </Badge>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{offer.price}/{offer.unit}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={(e) => handleGenerateQuote(offer, e)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Generate Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </section>
      </main>

      {selectedOffer && (
        <QuoteFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          offer={selectedOffer}
          onQuoteGenerated={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default AllFPOs;
