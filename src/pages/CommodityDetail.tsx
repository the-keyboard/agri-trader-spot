import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fpoOffers, marketChips } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

const CommodityDetail = () => {
  const { commodity } = useParams();
  const navigate = useNavigate();

  const commodityData = marketChips.find(
    (chip) => chip.name.toLowerCase() === commodity?.toLowerCase()
  );

  const filteredFPOs = fpoOffers.filter(
    (offer) => offer.commodity.toLowerCase() === commodity?.toLowerCase()
  );

  if (!commodityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Commodity Not Found
          </h1>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{commodityData.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {commodityData.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredFPOs.length} FPO{filteredFPOs.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {filteredFPOs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No FPOs currently offering {commodityData.name}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFPOs.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  {/* FPO Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{offer.fpoLogo}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {offer.fpoName}
                        </h3>
                        {offer.verified && (
                          <Badge variant="secondary" className="mt-1">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-muted-foreground">
                      <div>{offer.pincode} - {offer.block}</div>
                      <div>{offer.district}, {offer.state}</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Variety</p>
                      <p className="font-medium text-foreground">{offer.variety}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality</p>
                      <p className="font-medium text-foreground">{offer.quality}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avl Qty</p>
                      <p className="font-medium text-foreground">
                        {offer.quantity} {offer.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Order</p>
                      <p className="font-medium text-foreground">
                        {offer.minOrderQty} {offer.unit}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Offer Price
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{offer.price.toFixed(2)}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{offer.unit}
                      </span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" size="lg">
                    <Package className="w-4 h-4 mr-2" />
                    Generate Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommodityDetail;
