import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book, getBookById } from '../lib/store';
import { BookLoader } from '../components/BookLoader';
import { ArrowLeft, Download, BookOpen, Calendar, Hash } from 'lucide-react';

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const foundBook = await getBookById(id);
        if (foundBook) {
          setBook(foundBook);
          document.title = `${foundBook.title} | Observatório Edições`;
        } else {
          // Handle book not found, maybe redirect or show error
          navigate('/');
        }
      }
    };
    fetchData();
  }, [id, navigate]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obs-bg">
        <BookLoader message="Carregando detalhes do livro..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obs-bg pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-obs-dark/60 hover:text-obs-dark transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Voltar para o início
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column - Cover & Actions */}
            <div className="lg:col-span-4 bg-obs-dark/5 p-8 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-obs-dark/5">
              <div className="w-full max-w-xs aspect-[210/297] bg-white rounded-xl shadow-md overflow-hidden mb-8 relative">
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
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-obs-dark/20">
                    <BookOpen size={80} strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="w-full space-y-3">
                {(book.downloadLink || book.pdfUrl) && (
                  <a
                    href={book.pdfUrl || book.downloadLink}
                    download={`${book.title}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-obs-bg text-obs-dark px-6 py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-obs-dark/10 shadow-sm"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-8 p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-obs-dark mb-3 leading-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <h2 className="text-xl sm:text-2xl font-medium text-obs-dark/70 leading-snug">
                    {book.subtitle}
                  </h2>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-obs-dark uppercase tracking-wider border-b border-obs-dark/10 pb-2">
                    Autoria
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs text-obs-dark/50 uppercase tracking-wider mb-0.5">Autor(es)</span>
                      <span className="text-obs-dark font-medium">{book.authors || 'Não informado'}</span>
                    </div>
                    {book.organizers && (
                      <div>
                        <span className="block text-xs text-obs-dark/50 uppercase tracking-wider mb-0.5">Organizador(es)</span>
                        <span className="text-obs-dark font-medium">{book.organizers}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-obs-dark uppercase tracking-wider border-b border-obs-dark/10 pb-2">
                    Dados Editoriais
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {book.year && (
                      <div className="flex items-start gap-2">
                        <Calendar size={16} className="text-obs-teal mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-[10px] text-obs-dark/50 uppercase tracking-wider">Ano</span>
                          <span className="text-sm text-obs-dark font-medium">{book.year}</span>
                        </div>
                      </div>
                    )}
                    {book.isbn && (
                      <div className="flex items-start gap-2 col-span-2">
                        <Hash size={16} className="text-obs-teal mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-[10px] text-obs-dark/50 uppercase tracking-wider">ISBN</span>
                          <span className="text-sm text-obs-dark font-medium">{book.isbn}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-obs-dark uppercase tracking-wider border-b border-obs-dark/10 pb-2">
                  Resumo
                </h3>
                <div className="prose prose-obs max-w-none text-obs-dark/80 leading-relaxed">
                  {book.abstract ? (
                    book.abstract.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                    ))
                  ) : (
                    <p className="italic text-obs-dark/50">Nenhum resumo disponível para esta publicação.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
