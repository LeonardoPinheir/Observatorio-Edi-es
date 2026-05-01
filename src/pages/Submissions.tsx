import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FileText, Download, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getSubmissionTemplate, addSubmission, SubmissionTemplate } from '../lib/store';

export function Submissions() {
  const [template, setTemplate] = useState<SubmissionTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    abstract: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      const t = await getSubmissionTemplate();
      setTemplate(t);
    };
    fetchTemplate();
    document.title = "Submissões | Observatório Edições";
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          selectedFile.type === 'application/msword') {
        setFile(selectedFile);
        setErrorMessage('');
      } else {
        setErrorMessage('Por favor, envie apenas arquivos em formato Word (.doc ou .docx)');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Por favor, selecione o arquivo do seu texto.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addSubmission({
        ...formData,
        file: file,
        fileName: file.name,
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', title: '', abstract: '' });
      setFile(null);
    } catch (error: any) {
      console.error('Error submitting:', error);
      setSubmitStatus('error');
      const msg = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setErrorMessage(`Ocorreu um erro ao enviar sua submissão: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-obs-bg flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-6 pb-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-obs-light/5 to-transparent -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-obs-gold/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
            <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-obs-dark/5">
              <h2 className="text-2xl font-bold text-obs-dark mb-6 flex items-center gap-3">
                <FileText className="text-obs-light" />
                Formulário de Envio
              </h2>

              {submitStatus === 'success' ? (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                  <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Submissão Enviada!</h3>
                  <p className="text-green-700 mb-6">
                    Seu texto foi recebido com sucesso. Você receberá um e-mail de confirmação em breve.
                  </p>
                  <button 
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    Enviar outro texto
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-obs-dark mb-2">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 transition-all"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-obs-dark mb-2">E-mail</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-obs-dark mb-2">Título do Trabalho</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 transition-all"
                      placeholder="Título original"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-obs-dark mb-2">Resumo / Abstract</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.abstract}
                      onChange={e => setFormData({ ...formData, abstract: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 transition-all resize-none"
                      placeholder="Breve resumo do seu trabalho..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-obs-dark mb-2">Arquivo do Texto (Word)</label>
                    <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-obs-light bg-obs-light/5' : 'border-obs-dark/10 hover:border-obs-light/50'}`}>
                      <input
                        type="file"
                        accept=".doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center">
                        <Upload className={`mb-3 ${file ? 'text-obs-light' : 'text-obs-dark/30'}`} size={32} />
                        {file ? (
                          <div className="text-obs-dark font-medium">
                            {file.name}
                            <p className="text-xs text-obs-dark/50 mt-1">Clique ou arraste para trocar o arquivo</p>
                          </div>
                        ) : (
                          <div className="text-obs-dark/50">
                            <span className="font-bold text-obs-dark">Clique para selecionar</span> ou arraste o arquivo Word aqui
                            <p className="text-xs mt-1">Apenas arquivos .doc ou .docx</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                      <AlertCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-obs-dark text-white py-4 rounded-xl font-bold hover:bg-obs-dark/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Submissão'
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-obs-dark/5">
                <h3 className="text-lg font-bold text-obs-dark mb-4">Diretrizes</h3>
                <ul className="space-y-3 text-sm text-obs-dark/70 font-serif">
                  <li className="flex gap-2">
                    <span className="text-obs-light font-bold">•</span>
                    O texto deve ser original e inédito.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-obs-light font-bold">•</span>
                    Seguir rigorosamente o template disponibilizado.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-obs-light font-bold">•</span>
                    Formato obrigatório: Microsoft Word (.doc ou .docx).
                  </li>
                  <li className="flex gap-2">
                    <span className="text-obs-light font-bold">•</span>
                    O resumo deve ter entre 150 e 250 palavras.
                  </li>
                </ul>
              </div>

              <div className="bg-obs-dark rounded-3xl p-6 text-white shadow-lg shadow-obs-dark/20">
                <h3 className="text-lg font-bold mb-2">Template Oficial</h3>
                <p className="text-sm text-white/70 mb-6 font-serif">
                  Baixe o modelo oficial de formatação para garantir que seu trabalho seja aceito.
                </p>
                {template ? (
                  <a
                    href={template.fileUrl}
                    download={template.fileName}
                    className="w-full bg-obs-gold text-obs-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-obs-gold/90 transition-all"
                  >
                    <Download size={18} />
                    Baixar Template
                  </a>
                ) : (
                  <div className="text-center py-3 text-white/40 text-sm italic border border-white/10 rounded-xl">
                    Template indisponível no momento
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
