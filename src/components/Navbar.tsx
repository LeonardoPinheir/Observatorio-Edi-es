import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Publicações', href: '/publicacoes' },
    { name: 'Chamadas', href: isHome ? '#chamadas' : '/#chamadas' },
    { name: 'Submissões', href: '/submissoes' },
    { name: 'Equipe', href: isHome ? '#equipe' : '/#equipe' },
    { name: 'Contato', href: isHome ? '#contato' : '/#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else if (href.includes('#')) {
      // If it's a link to home with a hash, and we are already on home
      if (isHome) {
        e.preventDefault();
        const hash = href.split('#')[1];
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-obs-bg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo_observatorio.png" 
                alt="Observatório Edições" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-obs-dark/80 hover:text-obs-light transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium text-obs-teal hover:text-obs-dark transition-colors"
            >
              Área Restrita
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-obs-dark hover:text-obs-light transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-obs-bg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-obs-dark hover:text-obs-light hover:bg-obs-bg transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-obs-teal hover:text-obs-dark hover:bg-obs-bg transition-colors"
            >
              Área Restrita
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
