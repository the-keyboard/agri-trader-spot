import { TrendingUp, TrendingDown } from "lucide-react";
import { MarketChip as MarketChipType } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface MarketChipProps {
  data: MarketChipType;
}

export const MarketChip = ({ data }: MarketChipProps) => {
  const isPositive = data.change >= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
        isPositive 
          ? "bg-gain-light border-gain/20 hover:border-gain/40" 
          : "bg-loss-light border-loss/20 hover:border-loss/40"
      )}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground truncate">
          {data.name}
        </span>
        <span className="text-xs font-semibold text-foreground">
          ₹{data.price.toFixed(2)}/kg
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-gain" />
        ) : (
          <TrendingDown className="w-4 h-4 text-loss" />
        )}
        <span
          className={cn(
            "text-xs font-bold",
            isPositive ? "text-gain" : "text-loss"
          )}
        >
          {isPositive ? "+" : ""}
          {data.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};
