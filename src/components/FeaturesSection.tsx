import { 
  Activity, 
  Bell, 
  LineChart, 
  Shield, 
  Zap, 
  MessageSquareWarning,
  Clock,
  Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Activity,
    title: "Monitoramento 24/7",
    description: "Acompanhamento contínuo de menções em redes sociais, imprensa e fóruns em tempo real."
  },
  {
    icon: Zap,
    title: "Detecção de Anomalias",
    description: "Identificação automática de picos de volume, mudanças bruscas de sentimento e tópicos emergentes."
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificações instantâneas via email, dashboard ou integração com suas ferramentas."
  },
  {
    icon: LineChart,
    title: "Análise de Sentimento",
    description: "IA avançada que classifica menções e identifica narrativas críticas em formação."
  },
  {
    icon: Target,
    title: "Rastreio de Influenciadores",
    description: "Identificação de vozes influentes e potenciais amplificadores de crises."
  },
  {
    icon: MessageSquareWarning,
    title: "Clusters de Narrativa",
    description: "Agrupamento automático de menções por tema para entender o que está sendo discutido."
  },
  {
    icon: Clock,
    title: "Resposta Rápida",
    description: "Contexto acionável com principais menções, risco estimado e recomendações."
  },
  {
    icon: Shield,
    title: "Proteção de Marca",
    description: "Antecipe crises antes que escalem e proteja a reputação da sua marca."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(173,80%,50%,0.03)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Como <span className="text-gradient-primary">funciona</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de monitoramento e alerta para proteger sua marca de crises reputacionais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              variant="elevated"
              className="group hover:border-primary/30 transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
