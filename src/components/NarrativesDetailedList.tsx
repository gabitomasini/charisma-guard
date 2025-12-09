import { Hash, TrendingUp, AlertTriangle, Users, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EventMetric } from "@/services/dataService";

interface NarrativesDetailedListProps {
    events?: EventMetric[];
}

const NarrativesDetailedList = ({ events = [] }: NarrativesDetailedListProps) => {
    const getSentimentColor = (event: EventMetric) => {
        if (event.positive > event.negative && event.positive > event.neutral) return "bg-success";
        if (event.negative > event.positive && event.negative > event.neutral) return "bg-destructive";
        return "bg-warning";
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    const getSentimentLabel = (event: EventMetric) => {
        if (event.positive > event.negative && event.positive > event.neutral) return "Positivo";
        if (event.negative > event.positive && event.negative > event.neutral) return "Negativo";
        return "Neutro";
    };

    const getCriticalityBadge = (criticality: string) => {
        switch (criticality) {
            case "Crítico": return "crisis";
            case "Alto": return "destructive";
            case "Moderado": return "warning";
            case "Baixo": return "secondary";
            default: return "secondary";
        }
    };

    // Sort by risk descending, then volume, filtering out invalid events
    const sortedEvents = [...events]
        .filter(e => e.event && e.event.trim() !== "" && e.total > 0)
        .sort((a, b) => b.risk - a.risk || b.total - a.total);

    return (
        <div className="space-y-8 px-4 pb-24">
            <div className="flex items-center gap-2 mb-6">
                <Hash className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-foreground">
                    Detalhamento de Narrativas
                </h2>
            </div>

            {sortedEvents.map((event, index) => {
                const sentimentColor = getSentimentColor(event);
                const sentimentLabel = getSentimentLabel(event);
                const totalSentiments = event.positive + event.negative + event.neutral;
                const posPerc = totalSentiments ? Math.round((event.positive / totalSentiments) * 100) : 0;
                const negPerc = totalSentiments ? Math.round((event.negative / totalSentiments) * 100) : 0;
                const neuPerc = totalSentiments ? Math.round((event.neutral / totalSentiments) * 100) : 0;

                return (
                    <Card key={index} className="border-2 border-border/60 bg-card/60 backdrop-blur-sm shadow-md">
                        <CardHeader className="pb-3 pt-5 px-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-lg font-semibold leading-tight">
                                        {event.event} {event.date ? `- ${formatDate(event.date)}` : ''}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Badge variant="outline" className="text-[10px] h-5 px-2 font-medium">
                                            {sentimentLabel}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant={getCriticalityBadge(event.criticality)} className="shrink-0 text-xs px-2 py-0.5">
                                    {event.criticality}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5 px-5 pb-5">
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/40">
                                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-background/50">
                                    <Activity className="w-4 h-4 text-muted-foreground mb-1.5" />
                                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Risco</span>
                                    <span className="font-bold text-base">{event.risk.toFixed(1)}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-background/50">
                                    <Users className="w-4 h-4 text-muted-foreground mb-1.5" />
                                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Alcance</span>
                                    <span className="font-bold text-base">{(event.reach_total / 1000).toFixed(1)}k</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-background/50">
                                    <TrendingUp className="w-4 h-4 text-muted-foreground mb-1.5" />
                                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Menções</span>
                                    <span className="font-bold text-base">{event.total}</span>
                                </div>
                            </div>

                            {/* Sentiment Bar */}
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                    <span>Sentimento</span>
                                    <div className="flex gap-3">
                                        <span className="text-success">{posPerc}%</span>
                                        <span className="text-muted-foreground">{neuPerc}%</span>
                                        <span className="text-destructive">{negPerc}%</span>
                                    </div>
                                </div>
                                <div className="h-2.5 flex w-full rounded-full overflow-hidden bg-secondary">
                                    <div style={{ width: `${posPerc}%` }} className="h-full bg-success/80" />
                                    <div style={{ width: `${neuPerc}%` }} className="h-full bg-warning" />
                                    <div style={{ width: `${negPerc}%` }} className="h-full bg-destructive/80" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default NarrativesDetailedList;
