import { MessageSquare, Heart, Repeat2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mention } from "@/services/dataService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RecentMentionsProps {
  mentions?: Mention[];
  onViewAll?: () => void;
  maxItems?: number;
  filterSentiment?: "all" | "positive" | "negative" | "neutral";
  sortOption?: "newest" | "oldest";
  onFilterChange?: (value: "all" | "positive" | "negative" | "neutral") => void;
  onSortChange?: (value: "newest" | "oldest") => void;
}

const RecentMentions = ({
  mentions = [],
  onViewAll,
  maxItems = 5,
  filterSentiment = "all",
  sortOption = "newest",
  onFilterChange,
  onSortChange
}: RecentMentionsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const getSentimentStyle = (sentiment: Mention["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return { variant: "stable" as const, label: "Positivo", weight: 1 };
      case "negative":
        return { variant: "crisis" as const, label: "Negativo", weight: 3 };
      default:
        return { variant: "secondary" as const, label: "Neutro", weight: 2 };
    }
  };

  const isPaginated = !onViewAll;

  // Pagination Logic on Client (since we receive filtered/sorted list from server)
  const totalItems = mentions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayMentions = isPaginated
    ? mentions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : mentions.slice(0, maxItems);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  }

  // Reset page when props change (new data loaded from server)
  useEffect(() => {
    setCurrentPage(1);
  }, [mentions.length, filterSentiment, sortOption]);

  return (
    <div className="px-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Menções Recentes
          </h2>
          <Badge variant="outline" className="text-[10px]">
            {isPaginated ? `Total: ${totalItems}` : "Últimas 24h"}
          </Badge>
        </div>

        {isPaginated && (
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Filtrar:</span>
              <div className="relative">
                <select
                  value={filterSentiment}
                  onChange={(e) => onFilterChange?.(e.target.value as any)}
                  className="bg-card border border-border/50 text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pl-2 pr-8 cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="positive">Positivo</option>
                  <option value="neutral">Neutro</option>
                  <option value="negative">Negativo</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Ordenar:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => onSortChange?.(e.target.value as any)}
                  className="bg-card border border-border/50 text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pl-2 pr-8 cursor-pointer"
                >
                  <option value="newest">Mais Recentes</option>
                  <option value="oldest">Mais Antigas</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Exibir:</span>
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-card border border-border/50 text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pl-2 pr-8 cursor-pointer"
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {displayMentions.map((mention, index) => {
          const style = getSentimentStyle(mention.sentiment);
          return (
            <div
              key={index}
              className="p-3 rounded-xl bg-card border border-border/50 active:scale-[0.98] transition-transform cursor-pointer hover:border-border/80"
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
                    <span className="ml-auto">{mention.date} {mention.time}</span>
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
          <div className="flex flex-col items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Página <span className="text-foreground">{currentPage}</span> de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Exibindo {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMentions;
