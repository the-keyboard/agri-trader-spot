export interface MarketChip {
  id: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FPOOffer {
  id: string;
  fpoName: string;
  location: string;
  commodity: string;
  price: number;
  quantity: number;
  unit: string;
  quality: string;
  availableFrom: string;
  verified: boolean;
}

export const marketChips: MarketChip[] = [
  { id: "1", name: "Tomato", price: 11.75, change: 0.5, changePercent: 4.44 },
  { id: "2", name: "Onion", price: 18.20, change: -0.8, changePercent: -4.21 },
  { id: "3", name: "Potato", price: 14.50, change: 1.2, changePercent: 9.02 },
  { id: "4", name: "Wheat", price: 22.30, change: 0.3, changePercent: 1.36 },
  { id: "5", name: "Rice", price: 28.40, change: -0.5, changePercent: -1.73 },
  { id: "6", name: "Cotton", price: 65.80, change: 2.1, changePercent: 3.29 },
];

export const fpoOffers: FPOOffer[] = [
  {
    id: "1",
    fpoName: "Sunrise Agro Collective",
    location: "West Bengal",
    commodity: "Tomato",
    price: 11.50,
    quantity: 500,
    unit: "kg",
    quality: "Grade A",
    availableFrom: "2025-11-10",
    verified: true,
  },
  {
    id: "2",
    fpoName: "Green Valley Farmers",
    location: "Maharashtra",
    commodity: "Onion",
    price: 18.00,
    quantity: 1000,
    unit: "kg",
    quality: "Premium",
    availableFrom: "2025-11-08",
    verified: true,
  },
  {
    id: "3",
    fpoName: "Golden Harvest FPO",
    location: "Punjab",
    commodity: "Wheat",
    price: 22.20,
    quantity: 2000,
    unit: "kg",
    quality: "Grade A",
    availableFrom: "2025-11-12",
    verified: true,
  },
  {
    id: "4",
    fpoName: "Delta Rice Producers",
    location: "Andhra Pradesh",
    commodity: "Rice",
    price: 28.20,
    quantity: 1500,
    unit: "kg",
    quality: "Basmati",
    availableFrom: "2025-11-09",
    verified: true,
  },
  {
    id: "5",
    fpoName: "Mountain Fresh Collective",
    location: "Himachal Pradesh",
    commodity: "Potato",
    price: 14.30,
    quantity: 800,
    unit: "kg",
    quality: "Grade B",
    availableFrom: "2025-11-11",
    verified: false,
  },
  {
    id: "6",
    fpoName: "Cotton Belt Farmers",
    location: "Gujarat",
    commodity: "Cotton",
    price: 65.50,
    quantity: 300,
    unit: "kg",
    quality: "Long Staple",
    availableFrom: "2025-11-15",
    verified: true,
  },
];
