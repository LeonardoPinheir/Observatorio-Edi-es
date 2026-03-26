import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { CallCard } from '../components/CallCard';
import { getBooks, Book, addMessage, getCalls, getTeam, Call, TeamMember } from '../lib/store';
import { ArrowRight, BookOpen, FileText, Send, Users, Mail, MapPin, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Dúvida sobre submissão',
    message: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: formData.message
      });
      
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: 'Dúvida sobre submissão', message: '' });
      
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setFormStatus('error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const [booksData, callsData, teamData] = await Promise.all([
        getBooks(),
        getCalls(),
        getTeam()
      ]);
      setBooks(booksData);
      setCalls(callsData);
      setTeam(teamData);
    };

    fetchData();
    
    document.title = "Observatório Edições | Início";

    // Handle scroll to hash on mount
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }

    const handleUpdate = async () => {
      const [booksData, callsData, teamData] = await Promise.all([
        getBooks(),
        getCalls(),
        getTeam()
      ]);
      setBooks(booksData);
      setCalls(callsData);
      setTeam(teamData);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('booksUpdated', handleUpdate);
    window.addEventListener('callsUpdated', handleUpdate);
    window.addEventListener('teamUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('booksUpdated', handleUpdate);
      window.removeEventListener('callsUpdated', handleUpdate);
      window.removeEventListener('teamUpdated', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-28 overflow-hidden bg-obs-bg">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            {/* Subtle geometric patterns inspired by the logo */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-obs-light blur-3xl mix-blend-multiply"></div>
            <div className="absolute top-48 -left-24 w-72 h-72 rounded-full bg-obs-teal blur-3xl mix-blend-multiply"></div>
            <div className="absolute -bottom-24 right-1/3 w-80 h-80 rounded-full bg-obs-gold blur-3xl mix-blend-multiply"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-obs-dark leading-tight mb-8 tracking-tight">
                Publicações acadêmicas em acesso aberto para ampliar a circulação do <span className="text-obs-light">conhecimento</span>
              </h1>
              
              <p className="text-xl text-obs-dark/70 leading-relaxed mb-12 max-w-2xl font-serif">
                O <span className="font-bold">Observatório Edições</span> é um portal editorial voltado à divulgação científica, organização de coletâneas, publicação de chamadas abertas e fortalecimento da produção acadêmica em diálogo com educação, comunicação, inovação e sociedade.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/publicacoes" className="bg-obs-dark hover:bg-obs-light text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-obs-dark/20 hover:shadow-obs-light/30">
                  <BookOpen size={20} />
                  Ver publicações
                </Link>
                <a href="#submissoes" className="bg-white hover:bg-obs-bg text-obs-dark border border-obs-dark/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                  <Send size={20} className="text-obs-teal" />
                  Submeter trabalho
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section id="sobre" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-6">Sobre o Observatório</h2>
                <div className="w-20 h-1 bg-obs-gold mb-8 rounded-full"></div>
                
                <div className="space-y-6 text-obs-dark/80 font-serif leading-relaxed text-lg">
                  <p>
                    O Observatório Edições nasce do compromisso inegociável com a democratização do saber. Somos uma iniciativa editorial acadêmica dedicada a publicar e dar visibilidade a pesquisas de excelência nas áreas de Educação, Comunicação, Inovação e suas intersecções com os desafios da sociedade contemporânea.
                  </p>
                  <p>
                    Nossa missão é atuar como uma ponte entre a universidade e a sociedade, garantindo que o conhecimento científico circule livremente, sem barreiras financeiras. Por isso, adotamos integralmente a política de <strong className="text-obs-dark">Acesso Aberto (Open Access)</strong> em todas as nossas publicações.
                  </p>
                  <p>
                    Com um conselho editorial rigoroso e um processo de avaliação por pares, buscamos não apenas publicar livros e coletâneas, mas fomentar debates qualificados sobre desinformação, novas tecnologias educacionais e políticas públicas.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000" 
                    alt="Biblioteca acadêmica" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-obs-dark text-white p-8 rounded-2xl shadow-xl max-w-xs">
                  <p className="font-cursive text-2xl mb-2 italic">"O conhecimento só cumpre seu papel quando compartilhado."</p>
                  <div className="w-12 h-0.5 bg-obs-gold mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Publicações Section */}
        <section id="publicacoes" className="py-24 bg-obs-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-4">Últimas Publicações</h2>
                <div className="w-20 h-1 bg-obs-light rounded-full"></div>
              </div>
              <Link to="/publicacoes" className="inline-flex items-center gap-2 text-obs-teal font-semibold hover:text-obs-dark transition-colors">
                Ver catálogo completo
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books
                .filter(book => book.status === 'Publicado')
                .sort((a, b) => (b.year || 0) - (a.year || 0))
                .slice(0, 6)
                .map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {books.filter(book => book.status === 'Publicado').length === 0 && (
              <div className="text-center py-12 text-obs-dark/50 font-serif">
                Nenhuma publicação disponível no momento.
              </div>
            )}
          </div>
        </section>

        {/* Chamadas Abertas Section */}
        <section id="chamadas" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-6">Chamadas Abertas</h2>
              <div className="w-20 h-1 bg-obs-gold mx-auto mb-8 rounded-full"></div>
              <p className="text-lg text-obs-dark/70 font-serif">
                Participe de nossas próximas publicações. Recebemos artigos, ensaios e capítulos de livros para compor nossas coletâneas temáticas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {calls.length > 0 ? (
                calls.map((call) => (
                  <CallCard key={call.id} call={call} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-obs-dark/50 font-serif">
                  Nenhuma chamada aberta no momento.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Submissões Section */}
        <section id="submissoes" className="py-24 bg-obs-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Diretrizes para Submissão</h2>
                <div className="w-20 h-1 bg-obs-teal mb-8 rounded-full"></div>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-white/10 p-3 rounded-xl h-fit">
                      <FileText className="text-obs-gold" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Normas Gerais</h3>
                      <p className="text-white/70 leading-relaxed text-sm">
                        Os textos devem ser inéditos e formatados segundo as normas da ABNT vigentes. O arquivo deve estar em formato .doc ou .docx, sem identificação de autoria no corpo do texto para garantir a avaliação cega por pares.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-white/10 p-3 rounded-xl h-fit">
                      <Users className="text-obs-light" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Avaliação Editorial</h3>
                      <p className="text-white/70 leading-relaxed text-sm">
                        Todos os trabalhos submetidos passam por uma triagem inicial (desk review) e, se aprovados, são encaminhados para avaliação duplo-cega por pareceristas ad hoc especialistas na área.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                  <button className="bg-obs-gold hover:bg-white text-obs-dark px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Send size={20} />
                    Acessar Formulário
                  </button>
                  <button className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <Download size={20} />
                    Baixar Template
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-obs-light">Áreas de Interesse</h3>
                <ul className="space-y-4 text-white/80 font-serif">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obs-gold"></div>
                    Comunicação, Mídia e Sociedade
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obs-teal"></div>
                    Políticas Educacionais e Práticas Pedagógicas
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obs-light"></div>
                    Desinformação e Letramento Midiático
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obs-gold"></div>
                    Ecossistemas de Inovação e Tecnologia
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-obs-teal"></div>
                    Divulgação Científica e Acesso Aberto
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Equipe Editorial Section */}
        <section id="equipe" className="py-24 bg-obs-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-6">Equipe Editorial</h2>
              <div className="w-20 h-1 bg-obs-light mx-auto mb-8 rounded-full"></div>
              <p className="text-lg text-obs-dark/70 font-serif">
                Conheça os profissionais e pesquisadores responsáveis por manter a excelência e o rigor acadêmico de nossas publicações.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-obs-dark/5 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-20 h-20 mx-auto bg-obs-bg rounded-full flex items-center justify-center mb-4 text-obs-dark/30">
                    <Users size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-obs-dark mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-obs-teal mb-3">{member.role}</p>
                  <p className="text-xs text-obs-dark/60">{member.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contato Section */}
        <section id="contato" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-6">Fale Conosco</h2>
                <div className="w-20 h-1 bg-obs-gold mb-8 rounded-full"></div>
                <p className="text-lg text-obs-dark/70 font-serif mb-12">
                  Dúvidas sobre submissões, propostas de parcerias ou informações sobre nossas publicações? Entre em contato com nossa equipe.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-obs-bg p-4 rounded-full text-obs-dark">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-obs-dark mb-1">E-mail Institucional</h4>
                      <a href="mailto:contato@observatorioedicoes.com.br" className="text-obs-light hover:underline">
                        contato@observatorioedicoes.com.br
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-obs-bg p-4 rounded-full text-obs-dark">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-obs-dark mb-1">Endereço</h4>
                      <p className="text-obs-dark/70 text-sm leading-relaxed">
                        Universidade Federal<br />
                        Departamento de Comunicação Social<br />
                        Prédio Central, Sala 204<br />
                        Campus Universitário
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-obs-bg p-8 md:p-10 rounded-3xl border border-obs-dark/5">
                {formStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="bg-obs-teal/10 p-6 rounded-full text-obs-teal mb-6">
                      <CheckCircle2 size={64} />
                    </div>
                    <h3 className="text-2xl font-bold text-obs-dark mb-2">Mensagem Enviada!</h3>
                    <p className="text-obs-dark/70 font-serif">
                      Agradecemos seu contato. Nossa equipe retornará em breve para o e-mail informado.
                    </p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-8 text-obs-teal font-semibold hover:underline"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-obs-dark mb-2">Nome Completo</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-obs-dark mb-2">E-mail</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-obs-dark mb-2">Assunto</label>
                      <select 
                        id="subject" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white text-obs-dark"
                      >
                        <option value="Dúvida sobre submissão">Dúvida sobre submissão</option>
                        <option value="Proposta de publicação">Proposta de publicação</option>
                        <option value="Informações gerais">Informações gerais</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-obs-dark mb-2">Mensagem</label>
                      <textarea 
                        id="message" 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white resize-none"
                        placeholder="Como podemos ajudar?"
                      ></textarea>
                    </div>
                    
                    {formStatus === 'error' && (
                      <p className="text-red-500 text-sm font-medium">
                        Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.
                      </p>
                    )}

                    <button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-obs-dark hover:bg-obs-light text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
                      <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
