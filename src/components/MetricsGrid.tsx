import { TrendingUp, TrendingDown, Users, MessageCircle, Share2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  positive: boolean; // Whether "up" trend is good or bad
}

const metrics: Metric[] = [
  {
    label: "Total de Menções",
    value: "24.5K",
    change: "+12%",
    trend: "up",
    icon: MessageCircle,
    positive: true
  },
  {
    label: "Alcance Estimado",
    value: "2.8M",
    change: "+8%",
    trend: "up",
    icon: Eye,
    positive: true
  },
  {
    label: "Menções Negativas",
    value: "3.2K",
    change: "+45%",
    trend: "up",
    icon: TrendingUp,
    positive: false
  },
  {
    label: "Share of Voice",
    value: "34%",
    change: "-2%",
    trend: "down",
    icon: Share2,
    positive: false
  },
  {
    label: "Influenciadores Ativos",
    value: "156",
    change: "+23",
    trend: "up",
    icon: Users,
    positive: true
  },
  {
    label: "Velocidade do Buzz",
    value: "842/h",
    change: "+156%",
    trend: "up",
    icon: TrendingUp,
    positive: false
  }
];

const MetricsGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => {
        const isPositive = (metric.trend === "up" && metric.positive) || (metric.trend === "down" && !metric.positive);
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card 
            key={index} 
            variant="elevated"
            className="hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 text-muted-foreground" />
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-display font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsGrid;
