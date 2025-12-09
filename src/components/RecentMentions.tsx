import { MessageSquare, Heart, Repeat2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mention } from "@/services/dataService";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RecentMentionsProps {
  mentions?: Mention[];
  onViewAll?: () => void;
  maxItems?: number;
}

const RecentMentions = ({ mentions = [], onViewAll, maxItems = 5 }: RecentMentionsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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

  const isPaginated = !onViewAll;
  const totalItems = mentions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayMentions = isPaginated
    ? mentions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : mentions.slice(0, maxItems);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  }

  return (
    <div className="px-4 pb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Menções Recentes
        </h2>
        <Badge variant="outline" className="text-[10px]">
          {isPaginated ? `Página ${currentPage} de ${totalPages}` : "Últimas 24h"}
        </Badge>
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
                    {String(mention.author || mention.source || "?").substring(0, 2).toUpperCase()}
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

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="w-full py-3 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-card border border-border/50 rounded-xl"
          >
            Ver mais
          </button>
        )}

        {isPaginated && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMentions;
