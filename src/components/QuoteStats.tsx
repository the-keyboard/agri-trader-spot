import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuotationResponse } from "@/lib/api";
import { TrendingUp, TrendingDown, Package, CheckCircle, XCircle, Clock, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface QuoteStatsProps {
  quotations: QuotationResponse[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(45, 93%, 47%)",
  negotiating: "hsl(217, 91%, 60%)",
  accepted: "hsl(142, 71%, 45%)",
  rejected: "hsl(0, 84%, 60%)",
  expired: "hsl(220, 9%, 46%)",
  converted_to_order: "hsl(271, 81%, 56%)",
};

export const QuoteStats = ({ quotations }: QuoteStatsProps) => {
  const stats = useMemo(() => {
    const totalValue = quotations.reduce(
      (sum, q) => sum + q.offer_price * q.quantity,
      0
    );

    const acceptedCount = quotations.filter(
      (q) => q.status === "accepted" || q.status === "converted_to_order"
    ).length;
    
    const rejectedCount = quotations.filter((q) => q.status === "rejected").length;
    const pendingCount = quotations.filter((q) => q.status === "pending" || q.status === "negotiating").length;
    
    const decidedCount = acceptedCount + rejectedCount;
    const acceptanceRate = decidedCount > 0 ? (acceptedCount / decidedCount) * 100 : 0;

    // Status breakdown
    const statusBreakdown = quotations.reduce((acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Commodity breakdown
    const commodityBreakdown = quotations.reduce((acc, q) => {
      const key = q.commodity_name;
      if (!acc[key]) {
        acc[key] = { name: key, count: 0, value: 0 };
      }
      acc[key].count += 1;
      acc[key].value += q.offer_price * q.quantity;
      return acc;
    }, {} as Record<string, { name: string; count: number; value: number }>);

    const commodityData = Object.values(commodityBreakdown)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const statusData = Object.entries(statusBreakdown).map(([status, count]) => ({
      name: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
      color: STATUS_COLORS[status] || "hsl(220, 9%, 46%)",
    }));

    return {
      totalValue,
      totalQuotes: quotations.length,
      acceptedCount,
      rejectedCount,
      pendingCount,
      acceptanceRate,
      statusData,
      commodityData,
    };
  }, [quotations]);

  if (quotations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Value</span>
            </div>
            <p className="text-xl font-bold text-primary">
              ₹{stats.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Acceptance Rate</span>
            </div>
            <p className="text-xl font-bold text-green-600">
              {stats.acceptanceRate.toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Accepted</span>
            </div>
            <p className="text-xl font-bold text-blue-600">
              {stats.acceptedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">
              {stats.pendingCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Pie Chart */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              Status Breakdown
            </h3>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "0.75rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {stats.statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commodity Bar Chart */}
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              Top Commodities by Value
            </h3>
            {stats.commodityData.length > 0 ? (
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.commodityData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `₹${value.toLocaleString("en-IN")}`,
                        "Value",
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No commodity data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
