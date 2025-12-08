
import { MessageCircle, TrendingUp, Users, Eye } from "lucide-react";

interface QuickMetricsProps {
  totalMentions?: number;
  negativeMentions?: number;
  totalReach?: number;
}

const QuickMetrics = ({
  totalMentions = 0,
  negativeMentions = 0,
  totalReach = 0
}: QuickMetricsProps) => {
  const metrics = [
    {
      icon: MessageCircle,
      label: "Menções",
      value: totalMentions.toLocaleString(),
      change: "+12%", // Placeholder for now
      isNegative: false
    },
    {
      icon: TrendingUp,
      label: "Negativas",
      value: negativeMentions.toLocaleString(),
      change: `${totalMentions > 0 ? Math.round((negativeMentions / totalMentions) * 100) : 0}% `,
      isNegative: true
    },
    {
      icon: Users,
      label: "Influencers",
      value: "12", // Placeholder
      change: "+2",
      isNegative: false
    },
    {
      icon: Eye,
      label: "Alcance",
      value: (totalReach / 1000).toFixed(1) + "K",
      change: "+8%",
      isNegative: false
    }
  ];

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
            <div className={`text - [10px] font - medium ${metric.isNegative ? 'text-destructive' : 'text-success'
              } `}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickMetrics;

