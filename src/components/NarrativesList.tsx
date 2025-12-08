import { Hash, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EventMetric } from "@/services/dataService";

interface Narrative {
  id: string;
  topic: string;
  mentions: number;
  percentage: number;
  sentiment: "positive" | "negative" | "neutral";
  trend: string;
}

interface NarrativesListProps {
  events?: EventMetric[];
  onViewAll?: () => void;
}

const NarrativesList = ({ events = [], onViewAll }: NarrativesListProps) => {
  const getSentimentColor = (sentiment: Narrative["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "bg-success";
      case "negative":
        return "bg-destructive";
      case "neutral":
        return "bg-[#FFE087]";
      default:
        return "bg-muted-foreground";
    }
  };

  const totalMentions = events.reduce((acc, curr) => acc + curr.total, 0);

  // Transform events to narratives
  // Sort by total mentions descending, filter out invalid events
  const sortedEvents = [...events]
    .filter(e => e.event && e.event.trim() !== "" && e.total > 0)
    .sort((a, b) => b.total - a.total);
  // Take top 5 or all? User just said "use the events". Let's show all or top 10. The UI might get long. Let's take top 5.
  // Actually, let's show top 5 to keep UI clean, or maybe 10. The original mocked list had 4.
  const displayedEvents = sortedEvents.slice(0, 5);

  const narratives: Narrative[] = displayedEvents.map((event, index) => {
    let sentiment: Narrative["sentiment"] = "neutral";
    if (event.negative > event.positive && event.negative > event.neutral) {
      sentiment = "negative";
    } else if (event.positive > event.negative && event.positive > event.neutral) {
      sentiment = "positive";
    }

    // Mock trend for visual consistency as we don't have historical data
    // We can maybe use criticality to influence it or just random
    const trend = "+0%";

    return {
      id: index.toString(),
      topic: event.event,
      mentions: event.total,
      percentage: totalMentions > 0 ? Math.round((event.total / totalMentions) * 100) : 0,
      sentiment,
      trend
    };
  });

  if (narratives.length === 0) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            Narrativas Dominantes
          </h2>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 text-sm text-muted-foreground text-center">
          Nenhuma narrativa encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          Narrativas Dominantes
        </h2>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/50 space-y-8">
        {narratives.map((narrative) => (
          <div key={narrative.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${getSentimentColor(narrative.sentiment)}`} />
                <span className="font-medium text-foreground text-sm truncate" title={narrative.topic}>{narrative.topic}</span>
              </div>
              <Badge
                variant={narrative.sentiment === "negative" ? "crisis" : narrative.sentiment === "positive" ? "stable" : "secondary"}
                className="text-[10px] h-5 shrink-0"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {narrative.trend}
              </Badge>
            </div>
            <Progress
              value={narrative.percentage}
              className="h-1.5"
              indicatorClassName={getSentimentColor(narrative.sentiment)}
            />
            <div className="text-[10px] text-muted-foreground">
              {narrative.mentions.toLocaleString()} menções
            </div>
          </div>
        ))}

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors border-t border-border mt-2"
          >
            Ver mais narrativas
          </button>
        )}
      </div>
    </div>
  );
};

export default NarrativesList;
