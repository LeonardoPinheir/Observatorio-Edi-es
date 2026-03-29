import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { BookLoader } from '../components/BookLoader';
import { getBooks, Book } from '../lib/store';
import { Search, Filter, BookOpen } from 'lucide-react';

export function Publications() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const booksData = await getBooks();
      setBooks(booksData.filter(b => b.status === 'Publicado'));
      setIsLoading(false);
    };
    fetchData();

    window.addEventListener('booksUpdated', fetchData);
    window.addEventListener('storage', fetchData);
    
    document.title = "Publicações | Observatório Edições";

    return () => {
      window.removeEventListener('booksUpdated', fetchData);
      window.removeEventListener('storage', fetchData);
    };
  }, []);

  // Extract unique values for filters
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(books.map(b => b.year).filter(Boolean)));
    return uniqueYears.sort((a, b) => (b as number) - (a as number));
  }, [books]);

  const collections = useMemo(() => {
    const uniqueCollections = Array.from(new Set(books.map(b => b.collection).filter(Boolean)));
    return uniqueCollections.sort();
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
      const matchesCollection = selectedCollection === '' || book.collection === selectedCollection;
      const matchesAuthor = selectedAuthor === '' || (book.authors && book.authors.includes(selectedAuthor));

      return matchesSearch && matchesYear && matchesCollection && matchesAuthor;
    }).sort((a, b) => (b.year || 0) - (a.year || 0));
  }, [books, searchTerm, selectedYear, selectedCollection, selectedAuthor]);

  return (
    <div className="min-h-screen flex flex-col bg-obs-bg">
      <Navbar />

      <main className="flex-grow pt-6 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

              {/* Collection Filter */}
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/50 text-sm text-obs-dark"
              >
                <option value="">Todas as Coleções</option>
                {collections.map(collection => (
                  <option key={collection} value={collection}>{collection}</option>
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
          <div className="mb-6">
          </div>

          {isLoading ? (
            <BookLoader />
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                  setSelectedCollection('');
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
