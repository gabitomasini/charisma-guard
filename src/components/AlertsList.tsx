import { AlertTriangle, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  time: string;
  mentions: number;
  trend: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    title: "Pico de negatividade detectado",
    description: "Aumento de 340% em menções negativas sobre atendimento ao cliente",
    severity: "critical",
    time: "2 min",
    mentions: 1247,
    trend: "+340%"
  },
  {
    id: "2",
    title: "Novo tópico emergente",
    description: "Discussão sobre qualidade do produto ganhando tração no Twitter",
    severity: "warning",
    time: "15 min",
    mentions: 523,
    trend: "+89%"
  },
  {
    id: "3",
    title: "Influenciador crítico",
    description: "@usuario_influente (500K seguidores) mencionou a marca negativamente",
    severity: "warning",
    time: "32 min",
    mentions: 156,
    trend: "+45%"
  },
  {
    id: "4",
    title: "Viralização em curso",
    description: "Post sobre problemas de entrega sendo compartilhado rapidamente",
    severity: "critical",
    time: "8 min",
    mentions: 892,
    trend: "+567%"
  }
];

const AlertsList = () => {
  const getSeverityStyles = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          badge: "crisis" as const,
          border: "border-l-destructive",
          bg: "bg-destructive/5"
        };
      case "warning":
        return {
          badge: "warning" as const,
          border: "border-l-warning",
          bg: "bg-warning/5"
        };
      default:
        return {
          badge: "secondary" as const,
          border: "border-l-primary",
          bg: "bg-primary/5"
        };
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          Alertas Ativos
        </h2>
        <Badge variant="crisis" className="animate-pulse">
          {alerts.length}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          return (
            <div 
              key={alert.id}
              className={`p-3 rounded-xl ${styles.bg} border-l-4 ${styles.border} border border-border/50 active:scale-[0.98] transition-transform cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={styles.badge} className="text-[10px]">
                      {alert.severity === "critical" ? "Crítico" : "Atenção"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-destructive" />
                      {alert.trend}
                    </span>
                    <span>{alert.mentions.toLocaleString()} menções</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsList;
