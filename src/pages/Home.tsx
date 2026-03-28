import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { CallCard } from '../components/CallCard';
import { BookLoader } from '../components/BookLoader';
import { CallLoader } from '../components/CallLoader';
import { getBooks, Book, addMessage, getCalls, getTeam, Call, TeamMember, getSubmissionTemplate } from '../lib/store';
import { ArrowRight, BookOpen, FileText, Send, Users, Mail, MapPin, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

export function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [template, setTemplate] = useState<{ fileUrl: string, fileName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      const [booksData, callsData, teamData, templateData] = await Promise.all([
        getBooks(),
        getCalls(),
        getTeam(),
        getSubmissionTemplate()
      ]);
      setBooks(booksData);
      setCalls(callsData);
      setTeam(teamData);
      setTemplate(templateData);
      setIsLoading(false);
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
        <section className="relative pt-20 pb-24 overflow-hidden bg-obs-bg">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-obs-light blur-3xl mix-blend-multiply"></div>
            <div className="absolute top-48 -left-24 w-72 h-72 rounded-full bg-obs-teal blur-3xl mix-blend-multiply"></div>
            <div className="absolute -bottom-24 right-1/3 w-80 h-80 rounded-full bg-obs-gold blur-3xl mix-blend-multiply"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-obs-dark leading-tight mb-6 tracking-tight">
                  Publicações acadêmicas em acesso aberto para ampliar a circulação do <span className="text-obs-light">conhecimento</span>
                </h1>
                
                <p className="text-lg md:text-xl text-obs-dark/70 leading-relaxed mb-10 max-w-2xl font-serif">
                  O <span className="font-bold text-obs-dark">Observatório Edições</span> é um portal editorial voltado à divulgação científica, organização de coletâneas e fortalecimento da produção acadêmica em diálogo com a sociedade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/publicacoes" className="bg-obs-dark hover:bg-obs-light text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-obs-dark/10 hover:shadow-obs-light/20">
                    <BookOpen size={18} />
                    Ver publicações
                  </Link>
                  <Link to="/submissoes" className="bg-white hover:bg-obs-bg text-obs-dark border border-obs-dark/10 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm">
                    <Send size={18} className="text-obs-teal" />
                    Submeter trabalho
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border border-obs-bg">
                  <img 
                    src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800" 
                    alt="Livros e conhecimento" 
                    className="rounded-2xl w-full h-auto object-cover aspect-[4/5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-obs-gold text-obs-dark p-4 rounded-2xl shadow-xl font-bold text-sm">
                    Acesso Aberto
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-obs-light/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-obs-teal/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Section */}
        <section id="sobre" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-obs-dark mb-4">Sobre o Observatório</h2>
                <div className="w-16 h-1 bg-obs-gold mb-6 rounded-full"></div>
                
                <div className="space-y-4 text-obs-dark/80 font-serif leading-relaxed text-base">
                  <p>
                    O Observatório Edições nasce do compromisso com a democratização do saber. Somos uma iniciativa editorial acadêmica dedicada a publicar e dar visibilidade a pesquisas de excelência nas áreas de Educação, Comunicação, Inovação e suas intersecções com os desafios da sociedade contemporânea.
                  </p>
                  <p>
                    Nossa missão é atuar como uma ponte entre a universidade e a sociedade, garantindo que o conhecimento científico circule livremente. Adotamos integralmente a política de <strong className="text-obs-dark">Acesso Aberto (Open Access)</strong> em todas as nossas publicações.
                  </p>
                  <p>
                    Com um conselho editorial rigoroso, buscamos não apenas publicar livros e coletâneas, mas fomentar debates qualificados sobre desinformação, novas tecnologias educacionais e políticas públicas.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000" 
                    alt="Biblioteca acadêmica" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-obs-dark text-white p-6 rounded-xl shadow-xl max-w-[240px]">
                  <p className="font-cursive text-xl mb-1 italic">"O conhecimento só cumpre seu papel quando compartilhado."</p>
                  <div className="w-10 h-0.5 bg-obs-gold mt-3"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        {books.filter(b => b.isFeatured).length > 0 && (
          <section className="py-20 bg-obs-dark text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-obs-light/5 -skew-x-12 translate-x-1/2"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Destaques</h2>
                <div className="w-20 h-1.5 bg-obs-light rounded-full mb-6"></div>
              </div>
              <Link 
                to="/publicacoes" 
                className="group flex items-center gap-2 text-obs-light font-medium hover:text-white transition-colors"
              >
                Ver todo o catálogo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {isLoading ? (
              <BookLoader light />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {books
                  .filter(book => book.isFeatured)
                  .slice(0, 4)
                  .map((book) => (
                    <div key={book.id} className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <BookCard book={book} variant="featured" />
                    </div>
                  ))}
              </div>
            )}
            </div>
          </section>
        )}

        {/* Publicações Section */}
        <section id="publicacoes" className="py-24 bg-obs-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-obs-dark mb-4">Últimas Publicações</h2>
                <div className="w-20 h-1 bg-obs-light rounded-full"></div>
              </div>
            </div>

            {isLoading ? (
              <BookLoader />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {books
                    .filter(book => book.status === 'Publicado')
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .slice(0, 8)
                    .map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                <div className="mt-16 flex justify-center">
                  <Link 
                    to="/publicacoes" 
                    className="bg-obs-gold hover:bg-obs-dark hover:text-white text-obs-dark px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-obs-gold/20 hover:shadow-obs-dark/20 group"
                  >
                    <BookOpen size={22} className="group-hover:scale-110 transition-transform" />
                    Ver catálogo completo
                  </Link>
                </div>
                
                {books.filter(book => book.status === 'Publicado').length === 0 && (
                  <div className="text-center py-12 text-obs-dark/50 font-serif">
                    Nenhuma publicação disponível no momento.
                  </div>
                )}
              </>
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
              {isLoading ? (
                <div className="col-span-full">
                  <CallLoader message="Carregando chamadas abertas..." />
                </div>
              ) : calls.length > 0 ? (
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
                  <Link to="/submissoes" className="bg-obs-gold hover:bg-white text-obs-dark px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Send size={20} />
                    Acessar Formulário
                  </Link>
                  {template ? (
                    <a 
                      href={template.fileUrl} 
                      download={template.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Baixar Template
                    </a>
                  ) : (
                    <button 
                      disabled
                      className="bg-transparent border border-white/10 text-white/30 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Download size={20} />
                      Template Indisponível
                    </button>
                  )}
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
                      <a href="mailto:opajeuft@gmail.com" className="text-obs-light hover:underline">
                        opajeuft@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-obs-bg p-4 rounded-full text-obs-dark">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-obs-dark mb-1">Endereço</h4>
                      <div className="text-obs-dark/70 text-sm leading-relaxed font-serif">
                        <p className="mb-1">
                          Universidade Federal do Tocantins / Núcleo de Pesquisa e Extensão Observatório de Pesquisas Aplicadas ao Jornalismo e ao Ensino (OPAJE-UFT)
                        </p>
                        <p>
                          Bloco 1, 1º Andar, Salas 18-20, UFT - Campus Palmas - Avenida NS 15, 109 Norte - Plano Diretor Norte - Palmas - TO, 77001-090 Brasil
                        </p>
                      </div>
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
