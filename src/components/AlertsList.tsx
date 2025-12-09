import { AlertTriangle, Clock, TrendingUp, Sparkles, Bell, Loader2, MessageCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EventMetric, Mention, fetchAiSummaries, sendTelegramAlert } from "@/services/dataService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AlertsListProps {
  alerts?: EventMetric[];
  mentions?: Mention[];
  aiSummaries?: any;
}

const AlertsList = ({ alerts = [], mentions = [], aiSummaries }: AlertsListProps) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingEvents, setLoadingEvents] = useState<Set<string>>(new Set());
  const [sendingAlerts, setSendingAlerts] = useState<Set<string>>(new Set());

  const toggleAlert = async (eventName: string) => {
    if (expandedAlert === eventName) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(eventName);

      // Check if we need to fetch summary
      if (!summaries[eventName] && !loadingEvents.has(eventName)) {
        setLoadingEvents(prev => new Set(prev).add(eventName));

        try {
          const result = await fetchAiSummaries(eventName);

          let summaryText = null;
          if (result) {
            // Updated logic to handle { summaries: [...] } response format
            if (result.summaries && Array.isArray(result.summaries)) {
              const match = result.summaries.find((s: any) => s.evento === eventName || s.event === eventName);
              if (match) {
                summaryText = match.summary;
              } else if (result.summaries.length > 0) {
                // Fallback to first summary if event name doesn't match perfectly
                summaryText = result.summaries[0].summary;
              }
            }

            // Fallback for previous formats
            if (!summaryText && typeof result === 'string') summaryText = result;
            if (!summaryText && result.summary) summaryText = result.summary;

            if (summaryText) {
              setSummaries(prev => ({ ...prev, [eventName]: summaryText }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch summary for", eventName, error);
        } finally {
          setLoadingEvents(prev => {
            const next = new Set(prev);
            next.delete(eventName);
            return next;
          });
        }
      }
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

  const getAiSummaryForEvent = (eventName: string) => {
    return summaries[eventName];
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

      <div className="space-y-4">
        {[...alerts].sort((a, b) => {
          const priorities = { 'crítico': 3, 'alto': 2, 'critico': 3, 'moderado': 1, 'baixo': 0 };
          const pA = priorities[a.criticality?.toLowerCase()] ?? 0;
          const pB = priorities[b.criticality?.toLowerCase()] ?? 0;
          return pB - pA;
        }).map((alert, index) => {
          const styles = getSeverityStyles(alert.criticality);
          const isExpanded = expandedAlert === alert.event;
          const aiSummary = getAiSummaryForEvent(alert.event);

          return (
            <div
              key={index}
              className={`rounded-xl border border-border/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-card shadow-lg' : styles.bg}`}
            >
              <div
                className={`p-4 border-l-4 ${styles.border} flex items-start gap-4`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={styles.badge} className="text-[10px]">
                      {styles.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Hoje
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-foreground mb-2 line-clamp-1">
                    {alert.event}
                  </h3>
                  <div className="flex items-center gap-5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-destructive" />
                      +{Math.round(alert.risk * 10)}% Risco
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-muted-foreground" />
                      {alert.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} menções
                    </span>
                    {alert.interactions !== undefined && (
                      <span className="flex items-center gap-1 ml-2 border-l border-border/50 pl-2">
                        <MessageCircle className="w-3 h-3 text-primary" />
                        {alert.interactions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} interações
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAlert(alert.event);
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Resumir com IA
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2 text-xs h-8"
                    disabled={sendingAlerts.has(alert.event)}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (sendingAlerts.has(alert.event)) return;

                      setSendingAlerts(prev => new Set(prev).add(alert.event));
                      console.log("Disparando alerta para:", alert.event);

                      try {
                        const success = await sendTelegramAlert(`🚨 ALERTA: ${alert.event} - Risco: ${Math.round(alert.risk * 10)}% - Menções: ${alert.total}\n\nAcesse a plataforma Previsão Charisma para ver mais informações.`);
                        if (success) {
                          console.log("Alerta enviado com sucesso!");
                        } else {
                          console.error("Falha ao enviar alerta.");
                        }
                      } finally {
                        setSendingAlerts(prev => {
                          const next = new Set(prev);
                          next.delete(alert.event);
                          return next;
                        });
                      }
                    }}
                  >
                    {sendingAlerts.has(alert.event) ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Bell className="w-3 h-3" />
                    )}
                    Enviar Alerta
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border/50 bg-background/50 p-3 space-y-3 animate-in slide-in-from-top-2">
                  {(loadingEvents.has(alert.event) || aiSummary) ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        Análise de IA
                      </div>
                      {loadingEvents.has(alert.event) ? (
                        <p className="text-xs text-muted-foreground animate-pulse">
                          Gerando análise com IA...
                        </p>
                      ) : (
                        <p className="text-xs text-foreground leading-relaxed">
                          {aiSummary}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground italic pl-2">
                      Clique para carregar a análise da IA.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default AlertsList;
