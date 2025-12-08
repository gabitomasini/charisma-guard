import { MessageSquare, Heart, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mention } from "@/services/dataService";

interface RecentMentionsProps {
  mentions?: Mention[];
}

const RecentMentions = ({ mentions = [] }: RecentMentionsProps) => {
  const getSentimentStyle = (sentiment: Mention["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return { variant: "stable" as const, label: "Positivo" };
      case "negative":
        return { variant: "crisis" as const, label: "Negativo" };
      default:
        return { variant: "secondary" as const, label: "Neutro" };
    }
  };

  const displayMentions = mentions.length > 0 ? mentions.slice(0, 5) : [];

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Menções Recentes
        </h2>
        <Badge variant="outline" className="text-[10px]">Últimas 24h</Badge>
      </div>

      <div className="space-y-2">
        {displayMentions.map((mention, index) => {
          const style = getSentimentStyle(mention.sentiment);
          return (
            <div
              key={index}
              className="p-3 rounded-xl bg-card border border-border/50 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {(mention.author || mention.source || "?").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{mention.author || mention.source}</span>
                    <span className="text-xs text-muted-foreground">{mention.source}</span>
                    <Badge variant={style.variant} className="text-[10px] ml-auto">
                      {style.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {mention.text}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      0
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="w-3 h-3" />
                      0
                    </span>
                    <span className="ml-auto">{mention.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMentions;
