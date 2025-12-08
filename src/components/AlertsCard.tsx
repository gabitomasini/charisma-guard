import { AlertTriangle, Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  }
];

const AlertsCard = () => {
  const getSeverityStyles = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return {
          badge: "crisis" as const,
          border: "border-l-destructive",
          icon: "text-destructive"
        };
      case "warning":
        return {
          badge: "warning" as const,
          border: "border-l-warning",
          icon: "text-warning"
        };
      default:
        return {
          badge: "secondary" as const,
          border: "border-l-primary",
          icon: "text-primary"
        };
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Alertas Ativos
          </CardTitle>
          <Badge variant="crisis" className="animate-pulse">
            {alerts.length} alertas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          return (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg bg-secondary/50 border-l-4 ${styles.border} hover:bg-secondary/70 transition-colors cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate">{alert.title}</h4>
                    <Badge variant={styles.badge} className="shrink-0">
                      {alert.severity === "critical" ? "Crítico" : "Atenção"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time} atrás
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-destructive" />
                      {alert.trend}
                    </span>
                    <span>{alert.mentions.toLocaleString()} menções</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
        
        <Button variant="outline" className="w-full mt-2">
          Ver todos os alertas
        </Button>
      </CardContent>
    </Card>
  );
};

export default AlertsCard;
