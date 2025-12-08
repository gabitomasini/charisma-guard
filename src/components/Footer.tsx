import { Activity } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-stable flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">Previsão Charisma</h3>
              <p className="text-xs text-muted-foreground">Sistema de Alerta de Crise</p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Sobre</a>
            <a href="#" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#" className="hover:text-foreground transition-colors">Contato</a>
            <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 Charisma. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
