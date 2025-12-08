import { useState } from "react";
import MobileHeader from "@/components/MobileHeader";
import AlertBanner from "@/components/AlertBanner";
import TemperatureWidget from "@/components/TemperatureWidget";
import QuickMetrics from "@/components/QuickMetrics";
import AlertsList from "@/components/AlertsList";
import RecentMentions from "@/components/RecentMentions";
import NarrativesList from "@/components/NarrativesList";
import BottomNav from "@/components/BottomNav";
import SentimentChart from "@/components/SentimentChart";

type Tab = "home" | "alerts" | "mentions" | "analytics" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const criticalAlert = {
    severity: "critical" as const,
    title: "Pico de negatividade detectado: +340% em menções sobre atendimento",
    time: "2 min atrás"
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader alertCount={4} />
      
      <main className="pt-16">
        {activeTab === "home" && (
          <div className="space-y-4 py-4">
            {/* Critical Alert Banner */}
            <AlertBanner alert={criticalAlert} />
            
            {/* Temperature Widget */}
            <TemperatureWidget 
              temperature={68} 
              trend="up" 
              trendValue="+5%" 
            />
            
            {/* Quick Metrics */}
            <QuickMetrics />
            
            {/* Narratives */}
            <NarrativesList />
            
            {/* Recent Mentions Preview */}
            <RecentMentions />
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4 py-4">
            <AlertsList />
          </div>
        )}

        {activeTab === "mentions" && (
          <div className="space-y-4 py-4">
            <RecentMentions />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4 py-4 px-4">
            <SentimentChart />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 py-4 px-4">
            <div className="p-6 rounded-xl bg-card border border-border/50 text-center">
              <h2 className="font-display font-semibold text-foreground mb-2">
                Configurações
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie suas preferências de notificação e alertas
              </p>
            </div>
          </div>
        )}
      </main>
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        alertCount={4}
      />
    </div>
  );
};

export default Index;
