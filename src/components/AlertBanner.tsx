import { AlertTriangle, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Alert {
  severity: "critical" | "warning";
  title: string;
  time: string;
}

interface AlertBannerProps {
  alert: Alert;
}

const AlertBanner = ({ alert }: AlertBannerProps) => {
  const isCritical = alert.severity === "critical";
  
  return (
    <div 
      className={`mx-4 rounded-xl p-4 ${
        isCritical 
          ? 'bg-destructive/15 border border-destructive/30' 
          : 'bg-warning/15 border border-warning/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isCritical ? 'bg-destructive/20' : 'bg-warning/20'
        }`}>
          <AlertTriangle className={`w-5 h-5 ${
            isCritical ? 'text-destructive' : 'text-warning'
          } ${isCritical ? 'animate-pulse' : ''}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant={isCritical ? "crisis" : "warning"}
              className="text-[10px] uppercase tracking-wide"
            >
              {isCritical ? "Alerta Crítico" : "Atenção"}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.time}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground line-clamp-2">
            {alert.title}
          </p>
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-2" />
      </div>
    </div>
  );
};

export default AlertBanner;
