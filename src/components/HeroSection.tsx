import { Shield, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(173,80%,50%,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(0,72%,51%,0.05)_0%,transparent_50%)]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Sistema ativo • Monitorando em tempo real</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Antecipe <span className="text-gradient-primary">crises</span>,{" "}
            <br className="hidden md:block" />
            proteja sua <span className="text-gradient-crisis">marca</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Sistema inteligente de monitoramento que detecta sinais precoces de crise reputacional 
            e notifica seu time com contexto acionável antes que seja tarde.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl">
              <Zap className="w-5 h-5" />
              Acessar Dashboard
            </Button>
            <Button variant="outline" size="xl">
              Ver Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Shield, label: "Proteção Proativa", value: "24/7" },
              { icon: Zap, label: "Tempo de Alerta", value: "<2min" },
              { icon: TrendingUp, label: "Menções Analisadas", value: "1M+" },
              { icon: AlertTriangle, label: "Crises Prevenidas", value: "847" },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
