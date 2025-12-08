import { Home, AlertTriangle, MessageSquare, BarChart3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Tab = "home" | "alerts" | "mentions" | "analytics" | "settings";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  alertCount?: number;
}

const BottomNav = ({ activeTab, onTabChange, alertCount = 3 }: BottomNavProps) => {
  const tabs = [
    { id: "home" as Tab, icon: Home, label: "Início" },
    { id: "alerts" as Tab, icon: AlertTriangle, label: "Alertas", badge: alertCount },
    { id: "mentions" as Tab, icon: MessageSquare, label: "Menções" },
    { id: "analytics" as Tab, icon: BarChart3, label: "Análise" },
    { id: "settings" as Tab, icon: Settings, label: "Config" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <tab.icon className={`w-5 h-5 mb-1 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`} />
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant="crisis" 
                    className="absolute -top-2 -right-3 h-4 min-w-4 px-1 text-[9px] animate-pulse"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-[10px] font-medium ${
                isActive ? 'text-primary' : ''
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
