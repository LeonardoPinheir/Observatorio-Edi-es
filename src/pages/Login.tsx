import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/store';
import { BookOpen, Lock, User, ArrowLeft } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Usuário ou senha inválidos.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocorreu um erro ao tentar entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Editorial Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-obs-dark items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1200" 
          alt="Biblioteca" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obs-dark/50 to-obs-dark/90"></div>
        
        <div className="relative z-10 p-12 flex flex-col items-center text-center max-w-lg">
          <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md mb-8 border border-white/10">
            <BookOpen size={56} className="text-obs-gold" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">Observatório Edições</h1>
          <p className="text-xl text-white/80 font-serif italic leading-relaxed">
            "Acesso aberto ao conhecimento científico e fortalecimento da produção acadêmica."
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative">
        <Link to="/" className="absolute top-8 left-8 sm:left-16 xl:left-32 flex items-center gap-2 text-sm font-medium text-obs-dark/50 hover:text-obs-dark transition-colors">
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 lg:hidden flex items-center gap-3">
            <div className="bg-obs-dark text-obs-gold p-2.5 rounded-xl">
              <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-obs-dark tracking-tight leading-none">
                Observatório
              </span>
              <span className="text-sm font-cursive text-obs-light italic leading-tight">
                Edições
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-obs-dark tracking-tight mb-2">
            Área Restrita
          </h2>
          <p className="text-obs-dark/60 font-serif mb-8">
            Insira suas credenciais para acessar o painel editorial.
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-obs-dark mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-obs-dark/40" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 focus:border-obs-light/50 sm:text-sm bg-obs-bg/50 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-obs-dark">
                  Senha
                </label>
                <a href="#" className="text-sm font-medium text-obs-light hover:text-obs-dark transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-obs-dark/40" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 focus:border-obs-light/50 sm:text-sm bg-obs-bg/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-obs-dark hover:bg-obs-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-obs-light transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
