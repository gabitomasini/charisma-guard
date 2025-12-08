import { MessageCircle, TrendingUp, Users, Eye } from "lucide-react";

interface Metric {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

const metrics: Metric[] = [
  {
    icon: MessageCircle,
    label: "Menções",
    value: "24.5K",
    change: "+12%",
    isNegative: false
  },
  {
    icon: TrendingUp,
    label: "Negativas",
    value: "3.2K",
    change: "+45%",
    isNegative: true
  },
  {
    icon: Users,
    label: "Influencers",
    value: "156",
    change: "+23",
    isNegative: false
  },
  {
    icon: Eye,
    label: "Alcance",
    value: "2.8M",
    change: "+8%",
    isNegative: false
  }
];

const QuickMetrics = () => {
  return (
    <div className="px-4">
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="p-3 rounded-xl bg-card border border-border/50 text-center"
          >
            <metric.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
            <div className="text-lg font-display font-bold text-foreground leading-tight">
              {metric.value}
            </div>
            <div className="text-[10px] text-muted-foreground mb-0.5">
              {metric.label}
            </div>
            <div className={`text-[10px] font-medium ${
              metric.isNegative ? 'text-destructive' : 'text-success'
            }`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickMetrics;
