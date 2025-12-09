import Header from "@/components/Header";
import { useState, useEffect } from "react";
import MobileHeader from "@/components/MobileHeader";
import AlertBanner from "@/components/AlertBanner";
import TemperatureWidget from "@/components/TemperatureWidget";
import QuickMetrics from "@/components/QuickMetrics";
import AlertsList from "@/components/AlertsList";
import RecentMentions from "@/components/RecentMentions";
import NarrativesList from "@/components/NarrativesList";
import BottomNav from "@/components/BottomNav";
import NarrativesDetailedList from "@/components/NarrativesDetailedList";
import { loadExcelData, DashboardData, EventMetric } from "@/services/dataService";

type Tab = "home" | "alerts" | "mentions" | "analytics" | "narratives" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [filterSentiment, setFilterSentiment] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [filterEvent, setFilterEvent] = useState<string>("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass filter and sort params to loadExcelData
        // If filterEvent is "all", pass empty string
        const eventNameParam = filterEvent === "all" ? "" : filterEvent;
        // If filterSource is "all", pass empty string (or "all" if backend handles it, but safer to assume optional)
        // Backend check: options.source && options.source !== 'all' -> so passing 'all' is fine or undefined.
        const result = await loadExcelData(filterSentiment, sortOption, eventNameParam, filterSource);
        setData(result);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterSentiment, sortOption, filterEvent, filterSource]); // Refetch when filter or sort changes

  // Derived Metrics
  const lastEvent = data?.events[data.events.length - 1];

  // Find latest critical event for banner
  const criticalEvent = data?.events
    .slice()
    .reverse()
    .find(e => e.criticality === "Crítico" || e.criticality === "Alto");

  // Filter for Alerts List (Moderate or higher)
  const activeAlerts = data?.events.filter(e =>
    ["Crítico", "Alto", "Moderado"].includes(e.criticality)
  ).reverse() || [];

  // Aggregate totals
  const totalMentions = data?.events.reduce((acc, curr) => acc + curr.total, 0) || 0;
  const negativeMentions = data?.events.reduce((acc, curr) => acc + curr.negative, 0) || 0;
  const totalReach = data?.events.reduce((acc, curr) => acc + curr.reach_total, 0) || 0;

  // Sentiment Aggregation
  const sentimentPositive = data?.events.reduce((acc, curr) => acc + curr.positive, 0) || 0;
  const sentimentNeutral = data?.events.reduce((acc, curr) => acc + curr.neutral, 0) || 0;
  const sentimentNegative = data?.events.reduce((acc, curr) => acc + curr.negative, 0) || 0;

  if (loading && !data) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Carregando dados...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="md:hidden">
        <MobileHeader
          alertCount={activeAlerts.length}
          onAlertClick={() => setActiveTab("alerts")}
        />
      </div>
      <div className="hidden md:block">
        <Header
          alertCount={activeAlerts.length}
          onAlertClick={() => setActiveTab("alerts")}
        />
      </div>

      <main className="pt-16 md:pt-24">
        {activeTab === "home" && (
          <div className="space-y-4 py-4">
            {/* Critical Alert Banner */}
            {criticalEvent && <AlertBanner event={criticalEvent} />}

            {/* Temperature Widget - Calculated from Negative Sentiment % */}
            {(() => {
              const totalSentiment = sentimentPositive + sentimentNeutral + sentimentNegative;
              const calculatedRisk = totalSentiment > 0
                ? Math.round((sentimentNegative / totalSentiment) * 100)
                : 0;

              return (
                <TemperatureWidget
                  temperature={calculatedRisk}
                  positive={sentimentPositive}
                  negative={sentimentNegative}
                  neutral={sentimentNeutral}

                  narrativeCount={activeAlerts.length}
                />
              );
            })()}

            {/* Quick Metrics */}
            <QuickMetrics
              totalMentions={totalMentions}
              negativeMentions={negativeMentions}
              totalReach={totalReach}
            />

            {/* Narratives from Excel Formula Sheet */}
            <NarrativesList events={data?.events || []} onViewAll={() => setActiveTab("narratives")} />

            {/* Recent Mentions Preview */}
            <RecentMentions
              mentions={data?.mentions}
              onViewAll={() => setActiveTab("mentions")}
              filterSentiment={filterSentiment}
              sortOption={sortOption}
              filterEvent={filterEvent}
              filterSource={filterSource}
              availableEvents={data?.events}
              availableSources={data?.sources}
              onFilterChange={setFilterSentiment}
              onSortChange={setSortOption}
              onFilterEventChange={setFilterEvent}
              onFilterSourceChange={setFilterSource}
              isLoading={loading}
            />
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-4 py-4">
            <AlertsList alerts={activeAlerts} mentions={data?.mentions} />
          </div>
        )}

        {activeTab === "mentions" && (
          <div className="space-y-4 py-4">
            <RecentMentions
              mentions={data?.mentions}
              maxItems={data?.mentions?.length || 50}
              filterSentiment={filterSentiment}
              sortOption={sortOption}
              filterEvent={filterEvent}
              filterSource={filterSource}
              availableEvents={data?.events}
              availableSources={data?.sources}
              onFilterChange={setFilterSentiment}
              onSortChange={setSortOption}
              onFilterEventChange={setFilterEvent}
              onFilterSourceChange={setFilterSource}
              isLoading={loading}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4 py-4 px-4">
            {(() => {
              const totalSentiment = sentimentPositive + sentimentNeutral + sentimentNegative;
              const calculatedRisk = totalSentiment > 0
                ? Math.round((sentimentNegative / totalSentiment) * 100)
                : 0;

              return (
                <TemperatureWidget
                  temperature={calculatedRisk}
                  positive={sentimentPositive}
                  negative={sentimentNegative}
                  neutral={sentimentNeutral}

                  narrativeCount={activeAlerts.length}
                />
              );
            })()}
          </div>
        )}

        {activeTab === "narratives" && (
          <NarrativesDetailedList events={data?.events || []} />
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
        alertCount={activeAlerts.length}
      />
    </div>
  );
};

export default Index;
