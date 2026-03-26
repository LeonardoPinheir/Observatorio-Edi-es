import { BookOpen, Mail, MapPin, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-obs-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="text-obs-gold">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-tight leading-none">
                  Observatório
                </span>
                <span className="text-base font-cursive text-obs-light italic leading-tight">
                  Edições
                </span>
              </div>
            </Link>
            <p className="text-white/70 max-w-md text-sm leading-relaxed">
              Portal editorial acadêmico voltado à divulgação científica,
              organização de coletâneas e fortalecimento da produção acadêmica
              em diálogo com a sociedade.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-obs-gold">Links Rápidos</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/#sobre" className="hover:text-obs-light transition-colors">Sobre o Projeto</Link></li>
              <li><Link to="/publicacoes" className="hover:text-obs-light transition-colors">Catálogo de Publicações</Link></li>
              <li><Link to="/#chamadas" className="hover:text-obs-light transition-colors">Chamadas Abertas</Link></li>
              <li><Link to="/#submissoes" className="hover:text-obs-light transition-colors">Submissões</Link></li>
              <li><Link to="/login" className="hover:text-obs-teal transition-colors">Área Administrativa</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-obs-gold">Contato</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-obs-light shrink-0 mt-0.5" />
                <a href="mailto:contato@observatorioedicoes.com.br" className="hover:text-white transition-colors">
                  contato@observatorioedicoes.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-obs-light shrink-0 mt-0.5" />
                <span>
                  Universidade Federal<br />
                  Departamento de Comunicação<br />
                  Campus Universitário
                </span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white/70 hover:text-obs-light transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-obs-light transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Observatório Edições. Todos os direitos reservados.</p>
          <p>Acesso Aberto ao Conhecimento Científico</p>
        </div>
      </div>
    </footer>
  );
}
