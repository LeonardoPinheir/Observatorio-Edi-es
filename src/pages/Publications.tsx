import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { getBooks, Book } from '../lib/store';
import { Search, Filter, BookOpen } from 'lucide-react';

export function Publications() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const booksData = await getBooks();
      setBooks(booksData.filter(b => b.status === 'Publicado'));
    };
    fetchData();
  }, []);

  // Extract unique values for filters
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(books.map(b => b.year).filter(Boolean)));
    return uniqueYears.sort((a, b) => (b as number) - (a as number));
  }, [books]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(books.map(b => b.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [books]);

  const authors = useMemo(() => {
    const allAuthors = books.flatMap(b => {
      if (!b.authors) return [];
      return b.authors.split(',').map(a => a.trim());
    }).filter(Boolean);
    return Array.from(new Set(allAuthors)).sort();
  }, [books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.subtitle && book.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (book.abstract && book.abstract.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesYear = selectedYear === '' || book.year?.toString() === selectedYear;
      const matchesCategory = selectedCategory === '' || book.category === selectedCategory;
      const matchesAuthor = selectedAuthor === '' || (book.authors && book.authors.includes(selectedAuthor));

      return matchesSearch && matchesYear && matchesCategory && matchesAuthor;
    }).sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [books, searchTerm, selectedYear, selectedCategory, selectedAuthor]);

  return (
    <div className="min-h-screen flex flex-col bg-obs-bg">
      <Navbar />

      <main className="flex-grow pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-obs-dark mb-4">Publicações</h1>
            <div className="w-20 h-1 bg-obs-light rounded-full mb-6"></div>
            <p className="text-lg text-obs-dark/70 font-serif max-w-3xl">
              Explore nosso catálogo completo de livros, coletâneas e cadernos temáticos. Utilize os filtros abaixo para encontrar publicações específicas.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-obs-dark/5 mb-12">
            <div className="flex items-center gap-2 mb-6 text-obs-dark font-semibold">
              <Filter size={20} className="text-obs-teal" />
              <h2>Filtros de Busca</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-obs-dark/40" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por título ou resumo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/50 text-sm"
                />
              </div>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/50 text-sm text-obs-dark"
              >
                <option value="">Todos os Anos</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/50 text-sm text-obs-dark"
              >
                <option value="">Todos os Temas</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Author Filter */}
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/50 text-sm text-obs-dark"
              >
                <option value="">Todos os Autores</option>
                {authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm font-medium text-obs-dark/60">
              Mostrando <span className="text-obs-dark font-bold">{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'publicação' : 'publicações'}
            </p>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-obs-dark/5">
              <div className="w-16 h-16 bg-obs-bg rounded-full flex items-center justify-center mx-auto mb-4 text-obs-dark/30">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-obs-dark mb-2">Nenhuma publicação encontrada</h3>
              <p className="text-obs-dark/60">
                Tente ajustar seus filtros de busca para encontrar o que procura.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('');
                  setSelectedCategory('');
                  setSelectedAuthor('');
                }}
                className="mt-6 text-obs-teal font-medium hover:text-obs-dark transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
