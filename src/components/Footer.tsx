import { BookOpen, Mail, MapPin, Instagram, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-obs-dark text-white py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-10 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-bold text-obs-gold uppercase tracking-widest">Siga-nos:</p>
            <div className="flex justify-center items-center gap-3 text-sm text-white/80">
              <a href="#" className="hover:text-obs-gold transition-colors">Facebook</a>
              <span className="text-white/20">|</span>
              <a href="#" className="hover:text-obs-gold transition-colors">Instagram</a>
              <span className="text-white/20">|</span>
              <a href="#" className="hover:text-obs-gold transition-colors">YouTube</a>
              <span className="text-white/20">|</span>
              <a href="#" className="hover:text-obs-gold transition-colors">Site</a>
            </div>
          </div>

          <div className="text-sm text-white/90">
            <p className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <span className="font-bold text-obs-gold">Contato:</span> 
              <a href="mailto:opajeuft@gmail.com" className="hover:text-obs-gold transition-colors underline underline-offset-4 decoration-obs-gold/30 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> opajeuft@gmail.com
              </a> 
              <span className="mx-1 text-white/20">|</span> 
              <span className="font-bold text-obs-gold">Telefone:</span>
              <a href="tel:+556384028033" className="hover:text-obs-gold transition-colors flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> +55 (63) 8402-8033
              </a>
            </p>
          </div>

          <div className="text-xs text-white/60 max-w-5xl mx-auto leading-relaxed font-serif">
            <p className="mb-1">
              Universidade Federal do Tocantins / Núcleo de Pesquisa e Extensão Observatório de Pesquisas Aplicadas ao Jornalismo e ao Ensino (OPAJE-UFT)
            </p>
            <p>
              Endereço: Bloco 1, 1º Andar, Salas 18-20, UFT - Campus Palmas - Avenida NS 15, 109 Norte - Plano Diretor Norte - Palmas - TO, 77001-090 Brasil
            </p>
            <p className="mt-1 text-white/40">
              Latitude: -10,1797486 / Longitude: -48,3601553
            </p>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 space-y-3 flex flex-col items-center">
          <img 
            src="/logo_observatorio.png" 
            alt="Observatório Edições" 
            className="h-16 w-auto object-contain brightness-0 invert opacity-90"
            referrerPolicy="no-referrer"
          />
          <p className="text-sm text-obs-light italic font-serif opacity-80">Inovação, Cultura e Conhecimento</p>
          <div className="text-[10px] sm:text-xs text-white/40 pt-6 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 uppercase tracking-widest">
            <span>© Todos os direitos reservados</span>
            <span className="hidden sm:inline text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <span className="hidden sm:inline text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
