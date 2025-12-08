import { MessageSquare, Heart, Repeat2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Mention {
  id: string;
  author: string;
  handle: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  likes: number;
  shares: number;
  time: string;
}

const mentions: Mention[] = [
  {
    id: "1",
    author: "Carlos Silva",
    handle: "@carlossilva",
    content: "Péssimo atendimento da @marca! Estou esperando há 3 dias por uma resposta sobre meu pedido. Nunca mais compro!",
    sentiment: "negative",
    likes: 892,
    shares: 234,
    time: "12 min"
  },
  {
    id: "2",
    author: "Ana Paula",
    handle: "@anapaula_tech",
    content: "Alguém mais tendo problemas com a @marca? Parece que não sou só eu reclamando do atendimento hoje...",
    sentiment: "negative",
    likes: 456,
    shares: 89,
    time: "28 min"
  },
  {
    id: "3",
    author: "João Marketing",
    handle: "@joaomarketing",
    content: "A nova campanha da @marca está incrível! Finalmente uma marca que entende seu público. 👏",
    sentiment: "positive",
    likes: 1234,
    shares: 312,
    time: "45 min"
  }
];

const RecentMentions = () => {
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
        {mentions.map((mention) => {
          const style = getSentimentStyle(mention.sentiment);
          return (
            <div 
              key={mention.id}
              className="p-3 rounded-xl bg-card border border-border/50 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {mention.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm text-foreground">{mention.author}</span>
                    <span className="text-xs text-muted-foreground">{mention.handle}</span>
                    <Badge variant={style.variant} className="text-[10px] ml-auto">
                      {style.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {mention.content}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {mention.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="w-3 h-3" />
                      {mention.shares.toLocaleString()}
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
