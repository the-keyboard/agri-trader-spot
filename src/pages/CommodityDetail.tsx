import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Package, Navigation, Filter, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fpoOffers, marketChips } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { QuoteFormDialog } from "@/components/QuoteFormDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTicker } from "@/hooks/useTicker";

const CommodityDetail = () => {
  const { commodity } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<typeof fpoOffers[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quoteNumbers, setQuoteNumbers] = useState<Record<string, string>>({});
  const { data: tickerData } = useTicker(50);


  const commodityData = tickerData.find(
    (chip) => chip.commodity.toLowerCase() === commodity?.toLowerCase()
  );

  console.log("Commodity Data:", commodityData);

  const allFilteredFPOs = fpoOffers.filter(
    (offer) => offer.commodity.toLowerCase() === commodity?.toLowerCase()
  );

  const filteredFPOs = allFilteredFPOs.filter((offer) => {
    const matchesSearch =
      searchQuery === "" ||
      offer.fpoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = location === "all" || offer.location === location;
    const matchesPrice = offer.price >= priceRange[0] && offer.price <= priceRange[1];

    return matchesSearch && matchesLocation && matchesPrice;
  });

  const locations = ["all", ...new Set(allFilteredFPOs.map((o) => o.location))];

  const handleQuoteGenerated = (quoteNo: string, offerId: string) => {
    setQuoteNumbers(prev => ({ ...prev, [offerId]: quoteNo }));
  };

  const handleLocationClick = (lat: number, lng: number) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

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
                  {commodityData.commodity}
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search FPO or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          className="mb-4 w-full md:w-auto"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-foreground">Filters</h3>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l === "all" ? "All Locations" : l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label>
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}/kg
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setLocation("all");
                    setPriceRange([0, 100]);
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </aside>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {filteredFPOs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No FPOs found matching your criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Found {filteredFPOs.length} offer{filteredFPOs.length !== 1 ? "s" : ""}
                </p>
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
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-muted-foreground">
                              <div>{offer.pincode} - {offer.block}</div>
                              <div>{offer.district}, {offer.state}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              📍 {offer.distance}
                            </span>
                            <button
                              onClick={() => handleLocationClick(offer.lat || 0, offer.lng || 0)}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <Navigation className="w-3 h-3" />
                              View on Map
                            </button>
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
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => {
                            if (quoteNumbers[offer.id]) {
                              navigate("/quote-tracking");
                            } else {
                              setSelectedOffer(offer);
                              setDialogOpen(true);
                            }
                          }}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          {quoteNumbers[offer.id] 
                            ? `Track Quote: ${quoteNumbers[offer.id]}` 
                            : "Generate Quote"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedOffer && (
        <QuoteFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          offer={selectedOffer}
          onQuoteGenerated={(quoteNo) => handleQuoteGenerated(quoteNo, selectedOffer.id)}
        />
      )}
    </div>
  );
};

export default CommodityDetail;
