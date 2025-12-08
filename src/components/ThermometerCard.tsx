import { Thermometer, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ThermometerCardProps {
  temperature: number; // 0-100
  trend: "up" | "down" | "stable";
  brandName: string;
}

const ThermometerCard = ({ temperature, trend, brandName }: ThermometerCardProps) => {
  const getTemperatureColor = (temp: number) => {
    if (temp <= 30) return { color: "hsl(142, 76%, 45%)", label: "Estável", variant: "stable" as const };
    if (temp <= 60) return { color: "hsl(38, 92%, 50%)", label: "Atenção", variant: "warning" as const };
    return { color: "hsl(0, 72%, 51%)", label: "Crítico", variant: "crisis" as const };
  };

  const tempInfo = getTemperatureColor(temperature);
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground";

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            Termômetro da Marca
          </CardTitle>
          <Badge variant={tempInfo.variant}>{tempInfo.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{brandName}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-6">
          {/* Temperature display */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-4">
              <span 
                className="text-6xl font-display font-bold"
                style={{ color: tempInfo.color }}
              >
                {temperature}
              </span>
              <span className="text-2xl text-muted-foreground">°</span>
              <div className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {trend === "up" ? "+5" : trend === "down" ? "-3" : "0"}%
                </span>
              </div>
            </div>

            {/* Temperature bar */}
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${temperature}%`,
                  background: `linear-gradient(90deg, hsl(142, 76%, 45%) 0%, hsl(38, 92%, 50%) 50%, hsl(0, 72%, 51%) 100%)`
                }}
              />
            </div>

            {/* Scale labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Estável</span>
              <span>Atenção</span>
              <span>Crítico</span>
            </div>
          </div>

          {/* Visual thermometer */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="w-8 h-32 bg-secondary rounded-t-full relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{ 
                  height: `${temperature}%`,
                  background: tempInfo.color,
                  boxShadow: `0 0 20px ${tempInfo.color}`
                }}
              />
            </div>
            <div 
              className="w-12 h-12 rounded-full -mt-2"
              style={{ 
                background: tempInfo.color,
                boxShadow: `0 0 30px ${tempInfo.color}`
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThermometerCard;
