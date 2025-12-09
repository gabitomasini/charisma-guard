import { Activity, Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileHeaderProps {
  alertCount?: number;
  onAlertClick?: () => void;
}

const MobileHeader = ({ alertCount = 3, onAlertClick }: MobileHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo_cloud_new.png"
            alt="Charisma Logo"
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="font-display font-bold text-sm text-foreground leading-tight">
              Previsão Charisma
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Monitorando em tempo real
            </p>
          </div>
          <div className="h-12 w-[1px] bg-border" />
          <img
            src="/Coritiba_Logo.png"
            alt="Coritiba Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
            onClick={onAlertClick}
          >
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
          <button className="w-10 h-10 rounded-full overflow-hidden border border-border transition-colors">
            <img
              src="/profile-image.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
