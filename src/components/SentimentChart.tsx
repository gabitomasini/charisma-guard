import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

interface SentimentChartProps {
  positive?: number;
  negative?: number;
  neutral?: number;
}

const SentimentChart = ({ positive = 35, negative = 25, neutral = 40 }: SentimentChartProps) => {
  const data = [
    { name: "Positivo", value: positive, color: "hsl(142, 76%, 45%)" },
    { name: "Neutro", value: neutral, color: "hsl(215, 20%, 65%)" },
    { name: "Negativo", value: negative, color: "hsl(0, 72%, 51%)" },
  ];

  return (
    <Card variant="elevated">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display font-semibold">Análise de Sentimento</CardTitle>
        <CardDescription>Distribuição de sentimento nas últimas 24h</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentChart;
