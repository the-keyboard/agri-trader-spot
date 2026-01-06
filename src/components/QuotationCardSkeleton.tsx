import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface QuotationCardSkeletonProps {
  variant?: "tracking" | "history";
}

export const QuotationCardSkeleton = ({ variant = "tracking" }: QuotationCardSkeletonProps) => {
  if (variant === "history") {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-3 w-20 ml-auto" />
            <Skeleton className="h-7 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Seller info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Total */}
        <div className="pt-2 border-t border-border space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

export const QuotationListSkeleton = ({ 
  count = 3, 
  variant = "tracking" 
}: { 
  count?: number; 
  variant?: "tracking" | "history";
}) => {
  return (
    <div className={variant === "tracking" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
      {Array.from({ length: count }).map((_, i) => (
        <QuotationCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
};
