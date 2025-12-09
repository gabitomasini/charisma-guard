import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SocialMetric } from '@/services/dataService';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ChannelAnalysisProps {
    data?: SocialMetric[];
}

const ChannelAnalysis = ({ data = [] }: ChannelAnalysisProps) => {
    // Sort by total volume descending
    const sortedData = [...data].sort((a, b) => b.total - a.total);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">
                                {entry.name === 'total' ? 'Total' : 'Negativas'}:
                            </span>
                            <span className="font-medium">
                                {entry.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-1 h-[400px]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Share por Canal
                        </CardTitle>
                        <CardDescription>
                            Comparativo de menções totais vs. negativas
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={sortedData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="channel"
                                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(value) => value.toLocaleString()}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted-foreground))', opacity: 0.1 }} />
                            <Legend
                                wrapperStyle={{ paddingTop: '10px' }}
                                formatter={(value) => (
                                    <span className="text-sm text-muted-foreground capitalize">
                                        {value === 'total' ? 'Total de Menções' : 'Menções Negativas'}
                                    </span>
                                )}
                            />
                            <Bar
                                dataKey="total"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                name="total"
                            />
                            <Bar
                                dataKey="negative"
                                fill="hsl(var(--destructive))"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                name="negative"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ChannelAnalysis;
