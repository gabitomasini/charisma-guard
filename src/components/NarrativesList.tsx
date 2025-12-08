import { Hash, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Narrative {
  id: string;
  topic: string;
  mentions: number;
  percentage: number;
  sentiment: "positive" | "negative" | "neutral";
  trend: string;
}

const narratives: Narrative[] = [
  {
    id: "1",
    topic: "Atendimento ao Cliente",
    mentions: 4523,
    percentage: 45,
    sentiment: "negative",
    trend: "+89%"
  },
  {
    id: "2",
    topic: "Qualidade do Produto",
    mentions: 2341,
    percentage: 28,
    sentiment: "negative",
    trend: "+34%"
  },
  {
    id: "3",
    topic: "Nova Campanha Marketing",
    mentions: 1876,
    percentage: 18,
    sentiment: "positive",
    trend: "+156%"
  },
  {
    id: "4",
    topic: "Preço e Promoções",
    mentions: 987,
    percentage: 9,
    sentiment: "neutral",
    trend: "+12%"
  }
];

const NarrativesList = () => {
  const getSentimentColor = (sentiment: Narrative["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "bg-success";
      case "negative":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          Narrativas Dominantes
        </h2>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/50 space-y-4">
        {narratives.map((narrative) => (
          <div key={narrative.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${getSentimentColor(narrative.sentiment)}`} />
                <span className="font-medium text-foreground text-sm truncate">{narrative.topic}</span>
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
      </div>
    </div>
  );
};

export default NarrativesList;
