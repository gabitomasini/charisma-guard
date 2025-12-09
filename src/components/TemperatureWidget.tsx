import { Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemperatureWidgetProps {
  temperature?: number;
  positive?: number;
  negative?: number;
  neutral?: number;

  narrativeCount?: number;
}

const TemperatureWidget = ({
  temperature = 0,
  positive = 0,
  negative = 0,
  neutral = 0,

  narrativeCount = 0
}: TemperatureWidgetProps) => {
  const getTemperatureInfo = (temp: number) => {
    if (temp <= 30) return {
      color: "hsl(var(--success))", // Green
      label: "Estável",
      variant: "stable" as const,
      bg: "bg-success"
    };
    if (temp <= 60) return {
      color: "hsl(var(--warning))", // Yellow/Orange
      label: "Atenção",
      variant: "warning" as const,
      bg: "bg-warning"
    };
    return {
      color: "hsl(var(--destructive))", // Red
      label: "Crítico",
      variant: "crisis" as const,
      bg: "bg-destructive"
    };
  };

  const info = getTemperatureInfo(temperature);

  // Circular Progress Calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (temperature / 100) * circumference;

  // Max value for bars calculation
  const maxVal = Math.max(positive, negative, neutral, 1);

  return (
    <div className="mx-4 p-6 rounded-3xl bg-card border border-border/50 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Thermometer className="w-6 h-6 text-foreground" />
        <h2 className="text-xl font-display font-bold text-foreground">
          Termômetro da Marca - Coritiba F.C.
        </h2>
      </div>

      {/* Main Circle & Status */}
      <div className="flex flex-col items-center justify-center mb-8 relative">
        <div className="relative flex items-center justify-center">
          {/* SVG Circle */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              stroke="hsl(var(--secondary))"
              strokeWidth={stroke}
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress Circle */}
            <circle
              stroke={info.color}
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-display font-bold" style={{ color: info.color }}>
              {temperature}°
            </span>
          </div>
        </div>

        {/* Status Badge - positioned absolutely or relatively next to it? 
            In layout it looks like it floats to the right or below. 
            Let's put it overlapping slightly or just below for mobile/responsive safety.
            The image has it to the right of the text inside the circle? No, outside.
        */}
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-1/2 md:translate-x-full md:left-[80%] md:right-auto">
          {/* Adjusted for simplicity: just separate div below or overlay */}
        </div>
        <div className="mt-4 md:absolute md:top-1/2 md:right-10 md:mt-0 md:transform md:-translate-y-1/2">
          <Badge variant={info.variant} className="px-3 py-1 text-sm font-medium border-0">
            {/* Dash icon or similar if needed */}
            <span className="mr-2">•</span>
            {info.label}
          </Badge>
        </div>
      </div>

      {/* Single Stacked Bar for Sentiments */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2 font-medium text-muted-foreground">
          <span>Sentimento Geral</span>
          <span>{positive + neutral + negative} total</span>
        </div>

        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex">
          {/* Positive Segment */}
          <div
            className="h-full bg-success transition-all duration-500"
            style={{ width: `${(positive / (positive + neutral + negative || 1)) * 100}%` }}
          />
          {/* Neutral Segment */}
          <div
            className="h-full bg-warning transition-all duration-500"
            style={{ width: `${(neutral / (positive + neutral + negative || 1)) * 100}%` }}
          />
          {/* Negative Segment */}
          <div
            className="h-full bg-destructive transition-all duration-500"
            style={{ width: `${(negative / (positive + neutral + negative || 1)) * 100}%` }}
          />
        </div>

        {/* Legend / Values */}
        <div className="flex justify-between mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Positivo:</span>
            <span className="font-bold text-foreground">{positive}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Neutro:</span>
            <span className="font-bold text-foreground">{neutral}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Negativo:</span>
            <span className="font-bold text-foreground">{negative}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50 w-full mb-6" />

      {/* Footer Metrics */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Narrativas Ameaçadoras</span>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            {narrativeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureWidget;
