import { MessageSquare, Heart, Repeat2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Mention {
  id: string;
  author: string;
  handle: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  platform: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  time: string;
}

const mentions: Mention[] = [
  {
    id: "1",
    author: "Carlos Silva",
    handle: "@carlossilva",
    content: "Péssimo atendimento da @marca! Estou esperando há 3 dias por uma resposta sobre meu pedido. Nunca mais compro!",
    sentiment: "negative",
    platform: "Twitter",
    engagement: { likes: 892, shares: 234, comments: 156 },
    time: "12 min"
  },
  {
    id: "2",
    author: "Ana Paula",
    handle: "@anapaula_tech",
    content: "Alguém mais tendo problemas com a @marca? Parece que não sou só eu reclamando do atendimento hoje...",
    sentiment: "negative",
    platform: "Twitter",
    engagement: { likes: 456, shares: 89, comments: 67 },
    time: "28 min"
  },
  {
    id: "3",
    author: "João Marketing",
    handle: "@joaomarketing",
    content: "A nova campanha da @marca está incrível! Finalmente uma marca que entende seu público. 👏",
    sentiment: "positive",
    platform: "Twitter",
    engagement: { likes: 1234, shares: 312, comments: 89 },
    time: "45 min"
  }
];

const TopMentionsCard = () => {
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
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Top Menções
          </CardTitle>
          <Badge variant="outline">Últimas 24h</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentions.map((mention) => {
          const sentimentStyle = getSentimentStyle(mention.sentiment);
          return (
            <div 
              key={mention.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {mention.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{mention.author}</span>
                    <span className="text-sm text-muted-foreground">{mention.handle}</span>
                    <Badge variant={sentimentStyle.variant} className="ml-auto">
                      {sentimentStyle.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {mention.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {mention.engagement.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="w-3 h-3" />
                      {mention.engagement.shares.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {mention.engagement.comments}
                    </span>
                    <span className="ml-auto">{mention.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TopMentionsCard;
