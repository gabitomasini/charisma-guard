import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { time: "00:00", positive: 65, negative: 15, neutral: 20 },
  { time: "04:00", positive: 60, negative: 18, neutral: 22 },
  { time: "08:00", positive: 55, negative: 25, neutral: 20 },
  { time: "10:00", positive: 40, negative: 45, neutral: 15 },
  { time: "12:00", positive: 35, negative: 52, neutral: 13 },
  { time: "14:00", positive: 42, negative: 40, neutral: 18 },
  { time: "16:00", positive: 50, negative: 30, neutral: 20 },
  { time: "18:00", positive: 58, negative: 22, neutral: 20 },
  { time: "20:00", positive: 62, negative: 18, neutral: 20 },
  { time: "22:00", positive: 68, negative: 14, neutral: 18 },
];

const SentimentChart = () => {
  return (
    <Card variant="elevated">
<CardHeader className="pb-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-base">Evolução do Sentimento</CardTitle>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[10px] text-muted-foreground">Positivo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-[10px] text-muted-foreground">Negativo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Neutro</span>
            </div>
          </div>
        </div>
        <Badge variant="crisis" className="w-fit text-[10px]">Pico às 12:00</Badge>
      </CardHeader>
<CardContent>
        <div className="h-48 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" vertical={false} />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 8%)', 
                  border: '1px solid hsl(222, 30%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="positive" 
                stroke="hsl(142, 76%, 45%)" 
                strokeWidth={2}
                fill="url(#positiveGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="negative" 
                stroke="hsl(0, 72%, 51%)" 
                strokeWidth={2}
                fill="url(#negativeGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
