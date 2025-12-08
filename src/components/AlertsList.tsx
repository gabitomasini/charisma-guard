import { AlertTriangle, Clock, TrendingUp, ChevronRight, ChevronDown, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EventMetric, Mention } from "@/services/dataService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AlertsListProps {
  alerts?: EventMetric[];
  mentions?: Mention[];
}

const AlertsList = ({ alerts = [], mentions = [] }: AlertsListProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const toggleAlert = (eventName: string) => {
    if (expandedAlert === eventName) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(eventName);
    }
  };

  const getSeverityStyles = (criticality: string) => {
    switch (criticality?.toLowerCase()) {
      case "crítico":
      case "critico":
      case "alto":
        return {
          badge: "crisis" as const,
          border: "border-l-destructive",
          bg: "bg-destructive/5",
          label: "Crítico"
        };
      case "moderado":
        return {
          badge: "warning" as const,
          border: "border-l-warning",
          bg: "bg-warning/5",
          label: "Atenção"
        };
      default:
        return {
          badge: "secondary" as const,
          border: "border-l-primary",
          bg: "bg-primary/5",
          label: "Info"
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
        {alerts.map((alert, index) => {
          const styles = getSeverityStyles(alert.criticality);
          const isExpanded = expandedAlert === alert.event;
          const relatedMentions = mentions.filter(m => m.eventName === alert.event);

          return (
            <div
              key={index}
              className={`rounded-xl border border-border/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-card shadow-lg' : styles.bg}`}
            >
              <div
                className={`p-3 border-l-4 ${styles.border} cursor-pointer active:scale-[0.99] transition-transform flex items-start gap-3`}
                onClick={() => toggleAlert(alert.event)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={styles.badge} className="text-[10px]">
                      {styles.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Hoje
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-1">
                    {alert.event}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-destructive" />
                      +{Math.round(alert.risk * 10)}% Risco
                    </span>
                    <span>{alert.total.toLocaleString()} menções</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-3" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-3" />
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-border/50 bg-background/50 p-3 space-y-3 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                    <MessageSquare className="w-3 h-3" />
                    Menções Relacionadas ({relatedMentions.length})
                  </div>

                  {relatedMentions.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {relatedMentions.slice(0, 10).map((mention, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-card border border-border/50 text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                                {(mention.author || "?").substring(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground truncate">{mention.author}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto">{mention.time}</span>
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{mention.text}</p>
                        </div>
                      ))}
                      {relatedMentions.length > 10 && (
                        <div className="text-center text-[10px] text-muted-foreground pt-1">
                          + {relatedMentions.length - 10} outras menções
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      Nenhuma menção encontrada para este evento.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsList;
