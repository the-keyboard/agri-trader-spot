import { useState } from "react";
import { Bell, BellOff, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePriceAlerts, PriceAlert } from "@/hooks/usePriceAlerts";
import { useTicker } from "@/hooks/useTicker";
import { toast } from "sonner";

export const PriceAlertManager = () => {
  const { alerts, addAlert, removeAlert, toggleAlert, resetAlert, clearAllAlerts } = usePriceAlerts();
  const { data: tickerData } = useTicker(50);
  const [open, setOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState<"below" | "above">("below");

  const handleAddAlert = () => {
    if (!selectedCommodity || !targetPrice) {
      toast.error("Please select a commodity and enter a target price");
      return;
    }

    const ticker = tickerData?.find((t) => t.id === selectedCommodity);
    if (!ticker) return;

    addAlert(
      ticker.id,
      ticker.commodity,
      ticker.variety,
      parseFloat(targetPrice),
      direction
    );

    toast.success(`Alert set for ${ticker.commodity} - ${ticker.variety}`);
    setSelectedCommodity("");
    setTargetPrice("");
  };

  const activeAlerts = alerts.filter((a) => a.enabled && !a.triggeredAt);
  const triggeredAlerts = alerts.filter((a) => a.triggeredAt);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Alerts</span>
          {activeAlerts.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {activeAlerts.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Price Alerts
          </DialogTitle>
          <DialogDescription>
            Get notified when commodity prices reach your target
          </DialogDescription>
        </DialogHeader>

        {/* Add New Alert */}
        <Card className="rounded-xl border-dashed">
          <CardContent className="p-4 space-y-4">
            <Label className="text-sm font-medium">Create New Alert</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-muted-foreground">Commodity</Label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {tickerData?.map((ticker) => (
                      <SelectItem key={ticker.id} value={ticker.id}>
                        {ticker.emoji} {ticker.commodity} - {ticker.variety} (₹{ticker.price})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Direction</Label>
                <Select value={direction} onValueChange={(v) => setDirection(v as "below" | "above")}>
                  <SelectTrigger className="rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below">Drops below</SelectItem>
                    <SelectItem value="above">Rises above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Target Price (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter price"
                  className="rounded-xl mt-1"
                />
              </div>
            </div>
            <Button onClick={handleAddAlert} className="w-full rounded-xl" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Alert
            </Button>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Active Alerts ({activeAlerts.length})</Label>
            </div>
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={() => toggleAlert(alert.id)}
                  onRemove={() => removeAlert(alert.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Triggered ({triggeredAlerts.length})
            </Label>
            <div className="space-y-2">
              {triggeredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={() => resetAlert(alert.id)}
                  onRemove={() => removeAlert(alert.id)}
                  triggered
                />
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <BellOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No price alerts set</p>
            <p className="text-xs mt-1">Create an alert above to get notified</p>
          </div>
        )}

        {alerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAllAlerts();
              toast.success("All alerts cleared");
            }}
            className="w-full text-destructive hover:text-destructive rounded-xl"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Alerts
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface AlertCardProps {
  alert: PriceAlert;
  onToggle: () => void;
  onRemove: () => void;
  triggered?: boolean;
}

const AlertCard = ({ alert, onToggle, onRemove, triggered }: AlertCardProps) => {
  return (
    <Card className={`rounded-xl ${triggered ? "opacity-60" : ""}`}>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm">
            {alert.commodity} - {alert.variety}
          </p>
          <p className="text-xs text-muted-foreground">
            {alert.direction === "below" ? "↓ Below" : "↑ Above"} ₹{alert.targetPrice}
            {triggered && (
              <span className="ml-2 text-green-600">
                ✓ Triggered {new Date(alert.triggeredAt!).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={alert.enabled && !triggered}
            onCheckedChange={onToggle}
            className="scale-75"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
