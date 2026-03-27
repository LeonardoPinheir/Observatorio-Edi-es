import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../lib/store';
import { Download, ExternalLink, BookOpen, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'featured';
}

export const BookCard: React.FC<BookCardProps> = ({ book, variant = 'default' }) => {
  const isFeatured = variant === 'featured';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-obs-bg overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      <Link to={`/book/${book.id}`} className="relative aspect-[210/297] overflow-hidden bg-obs-bg block">
        {book.type && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-obs-dark/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {book.type}
            </span>
          </div>
        )}
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Capa do livro ${book.title}`}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-obs-light/30">
            <BookOpen size={64} />
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/book/${book.id}`} className="block">
          <h3 className={`font-bold text-obs-dark mb-1 leading-tight group-hover:text-obs-light transition-colors ${isFeatured ? 'text-lg' : 'text-xl'}`}>
            {book.title}
          </h3>
        </Link>

        {book.subtitle && (
          <h4 className={`font-medium text-obs-dark/70 mb-3 leading-snug ${isFeatured ? 'text-xs' : 'text-sm'}`}>
            {book.subtitle}
          </h4>
        )}
        
        {!isFeatured && (
          <>
            <div className="mb-4 space-y-1">
              <p className="text-sm text-obs-teal font-medium">
                <span className="text-obs-dark/50 text-xs uppercase tracking-wider mr-1">Autor(es):</span>
                {book.authors}
              </p>
              {book.organizers && (
                <p className="text-sm text-obs-teal font-medium">
                  <span className="text-obs-dark/50 text-xs uppercase tracking-wider mr-1">Org(s):</span>
                  {book.organizers}
                </p>
              )}
            </div>

            <p className="text-sm text-obs-dark/60 line-clamp-3 mb-6 flex-grow leading-relaxed">
              {book.abstract}
            </p>
          </>
        )}

        <div className="space-y-4 mt-auto">
          {!isFeatured && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-obs-dark/50">
              {book.collection && <span>Coleção: {book.collection}</span>}
              {book.volume && <span>Vol: {book.volume}</span>}
              {book.year && <span>Ano: {book.year}</span>}
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>
          )}

          <div className={`flex items-center gap-3 ${!isFeatured ? 'pt-4 border-t border-obs-bg' : ''}`}>
            <Link 
              to={`/book/${book.id}`} 
              className="flex-1 bg-obs-dark hover:bg-obs-light text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight size={16} />
              Ver Detalhes
            </Link>
            {!isFeatured && (book.downloadLink || book.pdfUrl) && (
              <a
                href={book.pdfUrl || book.downloadLink}
                download={`${book.title}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-obs-bg hover:bg-obs-light/10 text-obs-dark px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-obs-dark/10"
              >
                <Download size={16} />
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
