const API_BASE_URL = "https://v-box-backend.vercel.app";

export interface MarketChipAPI {
  id: string;
  commodity: string;
  variety: string;
  emoji: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FPOOfferAPI {
  seller_details: {
    fpo_name: string;
    registration_type: string;
    registration_no: string;
    district: string;
    state: string;
    address: string;
    pincode: string;
  };
  commodity: {
    commodity_name: string;
  };
  commodity_varieties: {
    variety_name: string;
    grade: string;
  };
  seller_prices: {
    base_price: number;
    max_order_quantity: number;
    avl_from: string;
  };
}

export async function fetchTicker(limit: number = 50): Promise<MarketChipAPI[]> {
  const response = await fetch(`${API_BASE_URL}/vboxtrade/ticker?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ticker data");
  }
  return response.json();
}

export async function fetchFPOOffers(commodity: string, variety: string): Promise<FPOOfferAPI[]> {
  const response = await fetch(`${API_BASE_URL}/vboxtrade/fpo-offers?commodity=${encodeURIComponent(commodity)}&variety=${encodeURIComponent(variety)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch FPO offers");
  }
  return response.json();
}
