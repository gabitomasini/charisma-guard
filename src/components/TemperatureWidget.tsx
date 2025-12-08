import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemperatureWidgetProps {
  temperature: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
}

const TemperatureWidget = ({ temperature, trend, trendValue }: TemperatureWidgetProps) => {
  const getTemperatureInfo = (temp: number) => {
    if (temp <= 30) return { 
      color: "hsl(142, 76%, 45%)", 
      label: "Estável", 
      variant: "stable" as const,
      message: "Sua marca está com boa saúde reputacional"
    };
    if (temp <= 60) return { 
      color: "hsl(38, 92%, 50%)", 
      label: "Atenção", 
      variant: "warning" as const,
      message: "Monitore as conversas, há sinais de alerta"
    };
    return { 
      color: "hsl(0, 72%, 51%)", 
      label: "Crítico", 
      variant: "crisis" as const,
      message: "Ação recomendada: verifique os alertas ativos"
    };
  };

  const info = getTemperatureInfo(temperature);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground";

  return (
    <div className="mx-4 p-5 rounded-2xl bg-card border border-border/50 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-1">
            Temperatura da Marca
          </h2>
          <Badge variant={info.variant}>{info.label}</Badge>
        </div>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{trendValue}</span>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div 
          className="text-7xl font-display font-bold leading-none"
          style={{ color: info.color }}
        >
          {temperature}
        </div>
        <span className="text-3xl text-muted-foreground mb-2">°</span>
      </div>

      {/* Temperature bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${temperature}%`,
            background: `linear-gradient(90deg, hsl(142, 76%, 45%) 0%, hsl(38, 92%, 50%) 50%, hsl(0, 72%, 51%) 100%)`
          }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {info.message}
      </p>
    </div>
  );
};

export default TemperatureWidget;
