export interface MarketChip {
  id: string;
  name: string;
  emoji: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FPOOffer {
  id: string;
  fpoName: string;
  fpoLogo: string;
  location: string;
  pincode: string;
  block: string;
  district: string;
  state: string;
  commodity: string;
  price: number;
  quantity: number;
  unit: string;
  quality: string;
  variety: string;
  minOrderQty: number;
  availableFrom: string;
  verified: boolean;
}

export const marketChips: MarketChip[] = [
  { id: "1", name: "Tomato", emoji: "🍅", price: 11.75, change: 0.5, changePercent: 4.44 },
  { id: "2", name: "Onion", emoji: "🧅", price: 18.20, change: -0.8, changePercent: -4.21 },
  { id: "3", name: "Potato", emoji: "🥔", price: 14.50, change: 1.2, changePercent: 9.02 },
  { id: "4", name: "Wheat", emoji: "🌾", price: 22.30, change: 0.3, changePercent: 1.36 },
  { id: "5", name: "Rice", emoji: "🍚", price: 28.40, change: -0.5, changePercent: -1.73 },
  { id: "6", name: "Cotton", emoji: "🌱", price: 65.80, change: 2.1, changePercent: 3.29 },
];

export const fpoOffers: FPOOffer[] = [
  {
    id: "1",
    fpoName: "Sunrise Agro Collective",
    fpoLogo: "🌅",
    location: "West Bengal",
    pincode: "700001",
    block: "Barasat",
    district: "North 24 Parganas",
    state: "West Bengal",
    commodity: "Tomato",
    price: 11.50,
    quantity: 500,
    unit: "kg",
    quality: "Grade A",
    variety: "Hybrid",
    minOrderQty: 50,
    availableFrom: "2025-11-10",
    verified: true,
  },
  {
    id: "2",
    fpoName: "Green Valley Farmers",
    fpoLogo: "🌿",
    location: "Maharashtra",
    pincode: "411001",
    block: "Haveli",
    district: "Pune",
    state: "Maharashtra",
    commodity: "Onion",
    price: 18.00,
    quantity: 1000,
    unit: "kg",
    quality: "Premium",
    variety: "Red Onion",
    minOrderQty: 100,
    availableFrom: "2025-11-08",
    verified: true,
  },
  {
    id: "3",
    fpoName: "Golden Harvest FPO",
    fpoLogo: "🌾",
    location: "Punjab",
    pincode: "141001",
    block: "Ludhiana West",
    district: "Ludhiana",
    state: "Punjab",
    commodity: "Wheat",
    price: 22.20,
    quantity: 2000,
    unit: "kg",
    quality: "Grade A",
    variety: "Durum Wheat",
    minOrderQty: 200,
    availableFrom: "2025-11-12",
    verified: true,
  },
  {
    id: "4",
    fpoName: "Delta Rice Producers",
    fpoLogo: "🌊",
    location: "Andhra Pradesh",
    pincode: "520001",
    block: "Vijayawada Rural",
    district: "Krishna",
    state: "Andhra Pradesh",
    commodity: "Rice",
    price: 28.20,
    quantity: 1500,
    unit: "kg",
    quality: "Basmati",
    variety: "Basmati 1121",
    minOrderQty: 150,
    availableFrom: "2025-11-09",
    verified: true,
  },
  {
    id: "5",
    fpoName: "Mountain Fresh Collective",
    fpoLogo: "⛰️",
    location: "Himachal Pradesh",
    pincode: "171001",
    block: "Shimla Rural",
    district: "Shimla",
    state: "Himachal Pradesh",
    commodity: "Potato",
    price: 14.30,
    quantity: 800,
    unit: "kg",
    quality: "Grade B",
    variety: "Kufri Jyoti",
    minOrderQty: 80,
    availableFrom: "2025-11-11",
    verified: false,
  },
  {
    id: "6",
    fpoName: "Cotton Belt Farmers",
    fpoLogo: "🌱",
    location: "Gujarat",
    pincode: "380001",
    block: "Daskroi",
    district: "Ahmedabad",
    state: "Gujarat",
    commodity: "Cotton",
    price: 65.50,
    quantity: 300,
    unit: "kg",
    quality: "Long Staple",
    variety: "BT Cotton",
    minOrderQty: 30,
    availableFrom: "2025-11-15",
    verified: true,
  },
];
