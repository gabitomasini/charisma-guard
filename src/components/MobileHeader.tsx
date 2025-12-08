import { Activity, Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  alertCount?: number;
}

const MobileHeader = ({ alertCount = 3 }: MobileHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg gradient-stable flex items-center justify-center shadow-glow-primary">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-foreground leading-tight">
              Previsão Charisma
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Monitorando em tempo real
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
            {alertCount > 0 && (
              <Badge 
                variant="pulse" 
                className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px]"
              >
                {alertCount}
              </Badge>
            )}
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
