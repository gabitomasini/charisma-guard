import { Hash, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const NarrativesCard = () => {
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
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-primary" />
            Narrativas Dominantes
          </CardTitle>
          <Badge variant="outline">Top 4</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {narratives.map((narrative) => (
          <div key={narrative.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getSentimentColor(narrative.sentiment)}`} />
                <span className="font-medium text-foreground text-sm">{narrative.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {narrative.mentions.toLocaleString()} menções
                </span>
                <Badge 
                  variant={narrative.sentiment === "negative" ? "crisis" : narrative.sentiment === "positive" ? "stable" : "secondary"}
                  className="text-[10px] h-5"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {narrative.trend}
                </Badge>
              </div>
            </div>
            <Progress 
              value={narrative.percentage} 
              className="h-2"
              indicatorClassName={getSentimentColor(narrative.sentiment)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NarrativesCard;
