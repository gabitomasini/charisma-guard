import ThermometerCard from "./ThermometerCard";
import SentimentChart from "./SentimentChart";
import AlertsCard from "./AlertsCard";
import TopMentionsCard from "./TopMentionsCard";
import MetricsGrid from "./MetricsGrid";
import NarrativesCard from "./NarrativesCard";

const DashboardSection = () => {
  return (
    <section id="dashboard" className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Painel <span className="text-gradient-primary">Termômetro</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize a temperatura da sua marca em tempo real
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="mb-8">
          <MetricsGrid />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ThermometerCard 
              temperature={68} 
              trend="up" 
              brandName="Sua Marca" 
            />
            <NarrativesCard />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-1 space-y-6">
            <SentimentChart />
            <TopMentionsCard />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AlertsCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
