import { useState, useEffect } from "react";
import { Quote } from "@/lib/mockData";
import { ChevronDown, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock history data
const mockQuoteHistory: Quote[] = [
  {
    quoteNo: "QT12345678",
    date: "2025-10-15",
    time: "10:30 AM",
    cropName: "Tomato",
    fpoName: "Sunrise Agro Collective",
    quantity: 100,
    unit: "kg",
    price: 11.50,
    offerPrice: 11.50,
    location: "Mumbai",
    status: "Ordered",
  },
  {
    quoteNo: "QT87654321",
    date: "2025-10-20",
    time: "2:45 PM",
    cropName: "Onion",
    fpoName: "Green Valley Farmers",
    quantity: 150,
    unit: "kg",
    price: 18.00,
    offerPrice: 18.00,
    location: "Pune",
    status: "Closed",
  },
  {
    quoteNo: "QT11223344",
    date: "2025-10-25",
    time: "11:15 AM",
    cropName: "Wheat",
    fpoName: "Golden Harvest FPO",
    quantity: 300,
    unit: "kg",
    price: 22.20,
    offerPrice: 22.20,
    location: "Delhi",
    status: "Cancelled",
  },
  {
    quoteNo: "QT55667788",
    date: "2025-11-01",
    time: "4:00 PM",
    cropName: "Rice",
    fpoName: "Delta Rice Producers",
    quantity: 200,
    unit: "kg",
    price: 28.20,
    offerPrice: 28.20,
    location: "Bangalore",
    status: "Rejected",
  },
];

const getStatusColor = (status: Quote["status"]) => {
  switch (status) {
    case "Open":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "Ordered":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "Closed":
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    case "Cancelled":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "Rejected":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
  }
};

export const QuoteHistory = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Combine mock history with localStorage quotes
    const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    setQuotes([...mockQuoteHistory, ...storedQuotes]);
  }, []);

  // Calculate gross total
  const grossTotal = quotes.reduce((total, quote) => {
    return total + quote.price * quote.quantity;
  }, 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="w-4 h-4 mr-2" />
          Quote History
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[500px]" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Quote History</h3>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Gross Total</p>
              <p className="text-lg font-bold text-primary">
                ₹{grossTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No quote history available
                </p>
              ) : (
                quotes.map((quote) => (
                  <div
                    key={quote.quoteNo}
                    className="border border-border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {quote.quoteNo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {quote.date} • {quote.time}
                        </p>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Crop</p>
                        <p className="font-medium text-foreground">
                          {quote.cropName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">FPO</p>
                        <p className="font-medium text-foreground">
                          {quote.fpoName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium text-foreground">
                          {quote.quantity} {quote.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium text-foreground">
                          ₹{quote.price}/{quote.unit}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-primary">
                        ₹{(quote.price * quote.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
