
import { Activity, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  alertCount?: number;
  onAlertClick?: () => void;
}

const Header = ({ alertCount = 3, onAlertClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-6 h-16 md:h-24 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <img
            src="/logo_cloud_new.png"
            alt="Charisma Logo"
            className="h-10 w-auto object-contain transition-all duration-300"
          />
          <div>
            <h1 className="font-display font-bold text-lg text-foreground hidden md:block">
              Previsão Charisma
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Sistema de Alerta de Crise
            </p>
          </div>
          <div className="h-12 w-[1px] bg-border" />
          <img
            src="/Coritiba_Logo.png"
            alt="Coritiba Logo"
            className="h-12 w-auto object-contain transition-all duration-300"
          />
        </div>

        {/* Nav links removed */}

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" onClick={onAlertClick}>
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <Badge variant="pulse" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                {alertCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-border">
            <img
              src="/profile-image.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
