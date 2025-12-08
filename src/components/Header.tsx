import { Activity, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-stable flex items-center justify-center shadow-glow-primary">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">
              Previsão Charisma
            </h1>
            <p className="text-xs text-muted-foreground">
              Sistema de Alerta de Crise
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#alertas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Alertas
          </a>
          <a href="#mencoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Menções
          </a>
          <a href="#relatorios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Relatórios
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge variant="pulse" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-medium">CH</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
