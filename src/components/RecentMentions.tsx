import { MessageSquare, Heart, Repeat2, ChevronLeft, ChevronRight, Hash, Loader2, Twitter, Facebook, Youtube, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mention, EventMetric } from "@/services/dataService";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Custom Icons for platforms not in Lucide with specific branding
const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 150.8C491.3 253.3 438 290 382.2 290c-35 0-66.7-18.4-102.7-49.8c-23.7-20.7-56-11.5-63.5 13.5c-11.2 37.3 11 123.5 119.5 163.7c-94.8 17.5-177.3-36.8-205-115.8c-27.7 79-110.2 133.3-205 115.8c108.5-40.2 130.7-126.4 119.5-163.7c-7.5-25-39.8-34.2-63.5-13.5C82 271.6 50.3 290 15.3 290C-40.5 290-93.8 253.3-88.9 234.8c-5.2-20.3-14.1-135.3-14.1-150.8c0-77.9 68.2-53.4 110.3-21.8" />
  </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.561-1.25-1.249-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const TumblrIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.606-.373 5.199-1.866 5.56-4.666h3.328v4.61h4.229v3.155h-4.229v6.861c0 2.486.377 2.768 1.862 2.768h2.327V24h-3.63z" />
  </svg>
);

interface RecentMentionsProps {
  mentions?: Mention[];
  onViewAll?: () => void;
  maxItems?: number;
  filterSentiment?: "all" | "positive" | "negative" | "neutral";
  sortOption?: "newest" | "oldest";
  filterEvent?: string;
  filterSource?: string;
  availableEvents?: EventMetric[];
  availableSources?: string[];
  onFilterChange?: (value: "all" | "positive" | "negative" | "neutral") => void;
  onSortChange?: (value: "newest" | "oldest") => void;
  onFilterEventChange?: (value: string) => void;
  onFilterSourceChange?: (value: string) => void;
  isLoading?: boolean;
}

const RecentMentions = ({
  mentions = [],
  onViewAll,
  maxItems = 5,
  filterSentiment = "all",
  sortOption = "newest",
  filterEvent = "",
  filterSource = "all",
  availableEvents = [],
  availableSources = [],
  onFilterChange,
  onSortChange,
  onFilterEventChange,
  onFilterSourceChange,
  isLoading = false
}: RecentMentionsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Dynamic sources from backend + "Todas" option
  // Capitalize first letter for display
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const sources = [
    { label: "Todas", value: "all" },
    ...availableSources.map(source => ({
      label: capitalize(source),
      value: source
    }))
  ];

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

  const getSocialIcon = (source: string) => {
    const s = source.toLowerCase();
    const sizeClass = "w-4 h-4"; // Slightly larger for better visibility

    if (s.includes("twitter") || s.includes("x.com")) return <Twitter className={`${sizeClass} text-sky-500`} />; // Twitter Blue
    if (s.includes("facebook")) return <Facebook className={`${sizeClass} text-blue-600`} />; // Facebook Blue
    if (s.includes("youtube")) return <Youtube className={`${sizeClass} text-red-600`} />; // YouTube Red
    if (s.includes("instagram")) return <Instagram className={`${sizeClass} text-pink-600`} />; // Instagram Pink
    if (s.includes("bluesky")) return <BlueskyIcon className={`${sizeClass} text-blue-500`} />; // Bluesky Blue
    if (s.includes("reddit")) return <RedditIcon className={`${sizeClass} text-orange-600`} />; // Reddit Orange
    if (s.includes("tumblr")) return <TumblrIcon className={`${sizeClass} text-blue-800`} />; // Tumblr Dark Blue

    // Fallback if no match
    return <span className="text-[10px] font-medium text-muted-foreground uppercase">{source}</span>;
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
  }, [mentions.length, filterSentiment, sortOption, filterEvent, filterSource]);

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
            {/* Filter by Narrative (Event) */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Narrativa:</span>
              <div className="relative max-w-[200px]">
                <select
                  value={filterEvent}
                  onChange={(e) => onFilterEventChange?.(e.target.value)}
                  className="bg-card border border-border/50 text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pl-2 pr-8 cursor-pointer w-full truncate"
                >
                  <option value="all">Todas</option>
                  {availableEvents?.map((event) => (
                    <option key={event.date + event.event} value={event.event}>
                      {event.event}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>

            {/* Filter by Source */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Rede:</span>
              <div className="relative">
                <select
                  value={filterSource}
                  onChange={(e) => onFilterSourceChange?.(e.target.value)}
                  className="bg-card border border-border/50 text-foreground text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pl-2 pr-8 cursor-pointer"
                >
                  {sources.map((src) => (
                    <option key={src.value} value={src.value}>
                      {src.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Status:</span>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground text-sm">Atualizando...</span>
          </div>
        ) : (
          <>
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

                        {/* Social Icon */}
                        <div className="text-muted-foreground">
                          {getSocialIcon(mention.source)}
                        </div>

                        {/* Display Event Name (Narrativa) */}
                        {mention.eventName && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary/50 border border-secondary text-[10px] text-muted-foreground max-w-[150px] truncate">
                            <Hash className="w-2.5 h-2.5" />
                            <span className="truncate">{mention.eventName}</span>
                          </div>
                        )}

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
          </>
        )}
      </div>
    </div>
  );
};

export default RecentMentions;
