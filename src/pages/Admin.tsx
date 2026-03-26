import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getBooks, addBook, updateBook, deleteBook, logout, isAuthenticated, Book, 
  getMessages, updateMessageStatus, deleteMessage, Message, getUnreadMessagesCount,
  getCalls, addCall, updateCall, deleteCall, Call,
  getTeam, addTeamMember, updateTeamMember, deleteTeamMember, TeamMember,
  getSubmissions, updateSubmissionStatus, deleteSubmission, getSubmissionTemplate, updateSubmissionTemplate, Submission, SubmissionTemplate
} from '../lib/store';
import { 
  BookOpen, LogOut, Plus, Edit2, Trash2, Search, X, Check, Eye, Filter, 
  AlertTriangle, Upload, Mail, MessageSquare, Calendar, User, ChevronRight, 
  CheckCircle2, Reply, Users, Clock, Link as LinkIcon, Download, FileText
} from 'lucide-react';

export function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'books' | 'messages' | 'calls' | 'team' | 'submissions'>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [template, setTemplate] = useState<SubmissionTemplate | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCall, setIsEditingCall] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
  const [currentCall, setCurrentCall] = useState<Partial<Call>>({});
  const [currentTeamMember, setCurrentTeamMember] = useState<Partial<TeamMember>>({});
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  const [callSearchTerm, setCallSearchTerm] = useState('');
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('');
  const [callStatusFilter, setCallStatusFilter] = useState('');
  
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'title_asc' | 'title_desc'>('date_desc');
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [callToDelete, setCallToDelete] = useState<string | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>('Publicado');

  useEffect(() => {
    const fetchData = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        navigate('/login');
      } else {
        const [booksData, messagesData, submissionsData, templateData, callsData, teamData, unread] = await Promise.all([
          getBooks(),
          getMessages(),
          getSubmissions(),
          getSubmissionTemplate(),
          getCalls(),
          getTeam(),
          getUnreadMessagesCount()
        ]);
        setBooks(booksData);
        setMessages(messagesData);
        setSubmissions(submissionsData);
        setTemplate(templateData);
        setPendingSubmissionsCount(submissionsData.filter(s => s.status === 'Pendente').length);
        setCalls(callsData);
        setTeam(teamData);
        setUnreadCount(unread);
      }
    };

    fetchData();
    
    document.title = "Painel Administrativo | Observatório Edições";

    const handleUpdate = async () => {
      const booksData = await getBooks();
      setBooks(booksData);
    };

    const handleMessagesUpdate = async () => {
      const [messagesData, unread] = await Promise.all([
        getMessages(),
        getUnreadMessagesCount()
      ]);
      setMessages(messagesData);
      setUnreadCount(unread);
    };

    const handleSubmissionsUpdate = async () => {
      const submissionsData = await getSubmissions();
      setSubmissions(submissionsData);
      setPendingSubmissionsCount(submissionsData.filter(s => s.status === 'Pendente').length);
    };

    const handleTemplateUpdate = async () => {
      const templateData = await getSubmissionTemplate();
      setTemplate(templateData);
    };

    const handleCallsUpdate = async () => {
      const callsData = await getCalls();
      setCalls(callsData);
    };

    const handleTeamUpdate = async () => {
      const teamData = await getTeam();
      setTeam(teamData);
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('booksUpdated', handleUpdate);
    window.addEventListener('messagesUpdated', handleMessagesUpdate);
    window.addEventListener('submissionsUpdated', handleSubmissionsUpdate);
    window.addEventListener('templateUpdated', handleTemplateUpdate);
    window.addEventListener('callsUpdated', handleCallsUpdate);
    window.addEventListener('teamUpdated', handleTeamUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('booksUpdated', handleUpdate);
      window.removeEventListener('messagesUpdated', handleMessagesUpdate);
      window.removeEventListener('submissionsUpdated', handleSubmissionsUpdate);
      window.removeEventListener('templateUpdated', handleTemplateUpdate);
      window.removeEventListener('callsUpdated', handleCallsUpdate);
      window.removeEventListener('teamUpdated', handleTeamUpdate);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openNewBookForm = () => {
    setCurrentBook({
      type: 'Livro de autoria única',
      status: 'Rascunho',
      isFeatured: false,
      year: new Date().getFullYear(),
      title: '',
      subtitle: '',
      authors: '',
      organizers: '',
      publicationDate: '',
      collection: '',
      volume: '',
      category: '',
      abstract: '',
      isbn: '',
      coverUrl: '',
      pdfUrl: '',
      downloadLink: '',
    });
    setSubmitStatus('Publicado');
    setIsEditing(true);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = error => reject(error);
    });

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setCurrentBook({
      ...currentBook,
      coverUrl: base64,
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setCurrentBook({
      ...currentBook,
      pdfUrl: base64,
      downloadLink: '',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const finalStatus = currentBook.id ? (currentBook.status || 'Publicado') : submitStatus;

      const bookToSave = {
        ...currentBook,
        status: finalStatus,
      };

      if (!bookToSave.title || !bookToSave.authors || !bookToSave.type || !bookToSave.year) {
        alert('Preencha os campos obrigatórios: título, autor(es), tipo da obra e ano.');
        setIsLoading(false);
        return;
      }

      if (bookToSave.id) {
        await updateBook(bookToSave.id, bookToSave);
        setSuccessMessage('Edição salva com sucesso!');
      } else {
        await addBook(bookToSave as Omit<Book, 'id'>);
        setSuccessMessage(
          finalStatus === 'Publicado'
            ? 'Publicação cadastrada e publicada com sucesso!'
            : 'Publicação salva como rascunho!'
        );
      }

      const booksData = await getBooks();
      setBooks(booksData);
      setIsEditing(false);
      setCurrentBook({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving book:', error);
      setErrorMessage(error.message || 'Ocorreu um erro ao salvar a publicação. Verifique se a tabela "books" existe no Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setSubmitStatus(book.status || 'Publicado');
    setIsEditing(true);
  };

  const confirmDelete = (id: string) => {
    setBookToDelete(id);
  };

  const executeDelete = async () => {
    if (bookToDelete) {
      await deleteBook(bookToDelete);
      const booksData = await getBooks();
      setBooks(booksData);
      setBookToDelete(null);
      setSuccessMessage('Publicação excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && 
        file.type !== 'application/msword') {
      alert('Por favor, envie apenas arquivos em formato Word (.doc ou .docx)');
      return;
    }

    setIsLoading(true);
    try {
      await updateSubmissionTemplate({
        file: file,
        fileName: file.name
      });
      setSuccessMessage('Novo template definido!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating template:', error);
      alert(`Erro ao atualizar template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmissionStatus = async (id: string, status: Submission['status']) => {
    await updateSubmissionStatus(id, status);
    const submissionsData = await getSubmissions();
    setSubmissions(submissionsData);
    setPendingSubmissionsCount(submissionsData.filter(s => s.status === 'Pendente').length);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
    setSuccessMessage(`Status da submissão atualizado para ${status}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const executeDeleteSubmission = async () => {
    if (submissionToDelete) {
      await deleteSubmission(submissionToDelete);
      const submissionsData = await getSubmissions();
      setSubmissions(submissionsData);
      setPendingSubmissionsCount(submissionsData.filter(s => s.status === 'Pendente').length);
      setSubmissionToDelete(null);
      setSelectedSubmission(null);
      setSuccessMessage('Submissão excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredSubmissions = submissions
    .filter(s => {
      const searchLower = submissionSearchTerm.toLowerCase();
      const matchesSearch =
        (s.name?.toLowerCase() || '').includes(searchLower) ||
        (s.email?.toLowerCase() || '').includes(searchLower) ||
        (s.title?.toLowerCase() || '').includes(searchLower);

      const matchesStatus = submissionStatusFilter === '' || s.status === submissionStatusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = Array.from(new Set(books.map(b => b.category))).filter(Boolean).sort();
  const types = Array.from(new Set(books.map(b => b.type))).filter(Boolean).sort();
  const statuses = Array.from(new Set(books.map(b => b.status))).filter(Boolean).sort();

  const filteredBooks = books
    .filter(b => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (b.title?.toLowerCase() || '').includes(searchLower) ||
        (b.authors?.toLowerCase() || '').includes(searchLower) ||
        (b.collection?.toLowerCase() || '').includes(searchLower);

      const matchesCategory = categoryFilter === '' || b.category === categoryFilter;
      const matchesType = typeFilter === '' || b.type === typeFilter;
      const matchesStatus = statusFilter === '' || b.status === statusFilter;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
      if (sortBy === 'date_asc') return (a.year || 0) - (b.year || 0);
      if (sortBy === 'date_desc') return (b.year || 0) - (a.year || 0);
      return 0;
    });

  const filteredMessages = messages
    .filter(m => {
      const searchLower = messageSearchTerm.toLowerCase();
      const matchesSearch =
        (m.name?.toLowerCase() || '').includes(searchLower) ||
        (m.email?.toLowerCase() || '').includes(searchLower) ||
        (m.subject?.toLowerCase() || '').includes(searchLower);

      const matchesStatus = messageStatusFilter === '' || m.status === messageStatusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'Não lida') {
      await updateMessageStatus(message.id, 'Lida');
      const [messagesData, unread] = await Promise.all([
        getMessages(),
        getUnreadMessagesCount()
      ]);
      setMessages(messagesData);
      setUnreadCount(unread);
    }
  };

  const handleMarkAsReplied = async (id: string) => {
    await updateMessageStatus(id, 'Respondida');
    const [messagesData, unread] = await Promise.all([
      getMessages(),
      getUnreadMessagesCount()
    ]);
    setMessages(messagesData);
    setUnreadCount(unread);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: 'Respondida' });
    }
    setSuccessMessage('Mensagem marcada como respondida!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteMessage = (id: string) => {
    setMessageToDelete(id);
  };

  const executeDeleteMessage = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete);
      const [messagesData, unread] = await Promise.all([
        getMessages(),
        getUnreadMessagesCount()
      ]);
      setMessages(messagesData);
      setUnreadCount(unread);
      setMessageToDelete(null);
      setSelectedMessage(null);
      setSuccessMessage('Mensagem excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Call Handlers
  const openNewCallForm = () => {
    setCurrentCall({
      title: '',
      description: '',
      deadline: '',
      status: 'open',
      link: ''
    });
    setIsEditingCall(true);
  };

  const handleEditCall = (call: Call) => {
    setCurrentCall(call);
    setIsEditingCall(true);
  };

  const handleSaveCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCall.title || !currentCall.deadline) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    if (currentCall.id) {
      await updateCall(currentCall.id, currentCall);
      setSuccessMessage('Chamada atualizada com sucesso!');
    } else {
      await addCall(currentCall as Omit<Call, 'id'>);
      setSuccessMessage('Chamada cadastrada com sucesso!');
    }

    const callsData = await getCalls();
    setCalls(callsData);
    setIsEditingCall(false);
    setCurrentCall({});
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const executeDeleteCall = async () => {
    if (callToDelete) {
      await deleteCall(callToDelete);
      const callsData = await getCalls();
      setCalls(callsData);
      setCallToDelete(null);
      setSuccessMessage('Chamada excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Team Handlers
  const openNewTeamForm = () => {
    setCurrentTeamMember({
      name: '',
      role: '',
      institution: '',
      order: team.length + 1
    });
    setIsEditingTeam(true);
  };

  const handleEditTeam = (member: TeamMember) => {
    setCurrentTeamMember(member);
    setIsEditingTeam(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeamMember.name || !currentTeamMember.role) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    if (currentTeamMember.id) {
      await updateTeamMember(currentTeamMember.id, currentTeamMember);
      setSuccessMessage('Membro da equipe atualizado!');
    } else {
      await addTeamMember(currentTeamMember as Omit<TeamMember, 'id'>);
      setSuccessMessage('Membro da equipe cadastrado!');
    }

    const teamData = await getTeam();
    setTeam(teamData);
    setIsEditingTeam(false);
    setCurrentTeamMember({});
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const executeDeleteTeamMember = async () => {
    if (teamToDelete) {
      await deleteTeamMember(teamToDelete);
      const teamData = await getTeam();
      setTeam(teamData);
      setTeamToDelete(null);
      setSuccessMessage('Membro da equipe removido!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredCalls = calls.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(callSearchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(callSearchTerm.toLowerCase());
    const matchesStatus = callStatusFilter === '' || c.status === callStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(teamSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-obs-bg flex flex-col font-sans">
      <header className="bg-white border-b border-obs-dark/5 shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-obs-dark text-obs-gold p-2 rounded-lg">
                <BookOpen size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-obs-dark tracking-tight leading-none">
                  Painel Administrativo
                </span>
                <span className="text-xs font-cursive text-obs-light italic leading-tight">
                  Observatório Edições
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-obs-dark/60 hover:text-obs-dark transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                <span className="hidden sm:inline">Ver Site</span>
              </Link>

              <div className="w-px h-6 bg-obs-dark/10"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 overflow-x-auto pt-3 pb-2 px-2">
          <button 
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'books' 
                ? 'bg-obs-dark text-white shadow-lg shadow-obs-dark/20' 
                : 'bg-white text-obs-dark/60 hover:bg-gray-50 border border-obs-dark/5'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-bold">Publicações</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'calls' 
                ? 'bg-obs-dark text-white shadow-lg shadow-obs-dark/20' 
                : 'bg-white text-obs-dark/60 hover:bg-gray-50 border border-obs-dark/5'
            }`}
          >
            <Clock size={20} />
            <span className="font-bold">Chamadas</span>
          </button>

          <button 
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'team' 
                ? 'bg-obs-dark text-white shadow-lg shadow-obs-dark/20' 
                : 'bg-white text-obs-dark/60 hover:bg-gray-50 border border-obs-dark/5'
            }`}
          >
            <Users size={20} />
            <span className="font-bold">Equipe</span>
          </button>

          <button 
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all relative whitespace-nowrap ${
              activeTab === 'submissions' 
                ? 'bg-obs-dark text-white shadow-lg shadow-obs-dark/20' 
                : 'bg-white text-obs-dark/60 hover:bg-gray-50 border border-obs-dark/5'
            }`}
          >
            <FileText size={20} />
            <span className="font-bold">Submissões</span>
            {pendingSubmissionsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-obs-gold text-obs-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all relative whitespace-nowrap ${
              activeTab === 'messages' 
                ? 'bg-obs-dark text-white shadow-lg shadow-obs-dark/20' 
                : 'bg-white text-obs-dark/60 hover:bg-gray-50 border border-obs-dark/5'
            }`}
          >
            <Mail size={20} />
            <span className="font-bold">Mensagens</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-obs-gold text-obs-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'books' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-obs-dark mb-1">Acervo de Publicações</h1>
                <p className="text-sm text-obs-dark/60 font-serif">
                  Gerencie os livros, coletâneas e revistas do portal.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                  <div className="bg-obs-light/10 p-2 rounded-lg text-obs-light">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                      Total
                    </p>
                    <p className="text-xl font-bold text-obs-dark leading-none">{books.length}</p>
                  </div>
                </div>

                <button
                  onClick={openNewBookForm}
                  className="bg-obs-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-obs-dark/90 transition-all shadow-lg shadow-obs-dark/20"
                >
                  <Plus size={20} />
                  <span>Nova Publicação</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
              <div className="p-5 border-b border-obs-bg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row flex-wrap w-full lg:w-auto gap-4">
                  <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por título, autor ou coleção..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm transition-all"
                    />
                  </div>

                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="block w-full pl-10 pr-8 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm appearance-none transition-all text-obs-dark"
                    >
                      <option value="">Todas Categorias</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="block w-full pl-10 pr-8 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm appearance-none transition-all text-obs-dark"
                    >
                      <option value="">Todos Status</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-obs-bg">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Publicação
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Tipo / Categoria
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ano
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-obs-bg">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-obs-dark/40">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-obs-dark/60">Nenhuma publicação encontrada.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map(book => (
                        <tr key={book.id} className="hover:bg-obs-bg/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-obs-dark/5">
                                {book.coverUrl ? (
                                  <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-obs-dark/20">
                                    <BookOpen size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-obs-dark line-clamp-1">{book.title}</span>
                                <span className="text-xs text-obs-dark/60 line-clamp-1">{book.authors}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-obs-dark/80">{book.type}</span>
                              <span className="text-[10px] text-obs-dark/50 uppercase tracking-wider">
                                {book.category}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-obs-dark/60">{book.year}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                book.status === 'Publicado'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                              }`}
                            >
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(book)}
                                className="text-obs-light hover:text-obs-dark transition-colors p-2 hover:bg-obs-bg rounded-lg"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => confirmDelete(book.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'calls' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-obs-dark mb-1">Chamadas Abertas</h1>
                <p className="text-sm text-obs-dark/60 font-serif">
                  Gerencie as chamadas para submissão de artigos e coletâneas.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                  <div className="bg-obs-gold/10 p-2 rounded-lg text-obs-gold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                      Ativas
                    </p>
                    <p className="text-xl font-bold text-obs-dark leading-none">{calls.filter(c => c.status !== 'closed').length}</p>
                  </div>
                </div>

                <button
                  onClick={openNewCallForm}
                  className="bg-obs-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-obs-dark/90 transition-all shadow-lg shadow-obs-dark/20"
                >
                  <Plus size={20} />
                  <span>Nova Chamada</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
              <div className="p-5 border-b border-obs-bg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-obs-dark/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar chamadas..."
                    value={callSearchTerm}
                    onChange={e => setCallSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-obs-bg">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Prazo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-obs-bg">
                    {filteredCalls.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-obs-dark/40">
                            <Clock size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-obs-dark/60">Nenhuma chamada encontrada.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCalls.map(call => (
                        <tr key={call.id} className="hover:bg-obs-bg/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-obs-dark line-clamp-1">{call.title}</span>
                              <span className="text-xs text-obs-dark/60 line-clamp-1">{call.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-obs-dark/60">{call.deadline}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                call.status === 'open'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : call.status === 'closing'
                                  ? 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {call.status === 'open' ? 'Aberta' : call.status === 'closing' ? 'Encerrando' : 'Encerrada'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditCall(call)}
                                className="text-obs-light hover:text-obs-dark transition-colors p-2 hover:bg-obs-bg rounded-lg"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => setCallToDelete(call.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'team' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-obs-dark mb-1">Equipe Editorial</h1>
                <p className="text-sm text-obs-dark/60 font-serif">
                  Gerencie os membros do conselho e coordenação editorial.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                  <div className="bg-obs-teal/10 p-2 rounded-lg text-obs-teal">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                      Membros
                    </p>
                    <p className="text-xl font-bold text-obs-dark leading-none">{team.length}</p>
                  </div>
                </div>

                <button
                  onClick={openNewTeamForm}
                  className="bg-obs-dark text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-obs-dark/90 transition-all shadow-lg shadow-obs-dark/20"
                >
                  <Plus size={20} />
                  <span>Novo Membro</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
              <div className="p-5 border-b border-obs-bg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-obs-dark/40" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar membros..."
                    value={teamSearchTerm}
                    onChange={e => setTeamSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-obs-bg">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ordem
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Cargo / Instituição
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-obs-bg">
                    {filteredTeam.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-obs-dark/40">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-obs-dark/60">Nenhum membro encontrado.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTeam.map(member => (
                        <tr key={member.id} className="hover:bg-obs-bg/40 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-obs-dark/40">{member.order}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-obs-dark">{member.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-obs-dark/80">{member.role}</span>
                              <span className="text-[10px] text-obs-dark/50 uppercase tracking-wider">
                                {member.institution}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditTeam(member)}
                                className="text-obs-light hover:text-obs-dark transition-colors p-2 hover:bg-obs-bg rounded-lg"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => setTeamToDelete(member.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'submissions' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-obs-dark mb-1">Submissões Recebidas</h1>
                <p className="text-sm text-obs-dark/60 font-serif">
                  Gerencie os textos enviados para avaliação e o template oficial.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                  <div className="bg-obs-gold/10 p-2 rounded-lg text-obs-gold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                      Pendentes
                    </p>
                    <p className="text-xl font-bold text-obs-dark leading-none">{pendingSubmissionsCount}</p>
                  </div>
                </div>

                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                  <div className="bg-obs-teal/10 p-2 rounded-lg text-obs-teal">
                    <Download size={20} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                      Template
                    </p>
                    <div className="flex items-center gap-2">
                      {template ? (
                        <span className="text-xs font-bold text-obs-dark truncate max-w-[100px]">{template.fileName}</span>
                      ) : (
                        <span className="text-xs text-obs-dark/40 italic">Não definido</span>
                      )}
                      <label className="cursor-pointer text-obs-light hover:text-obs-dark transition-colors">
                        <Upload size={14} />
                        <input type="file" accept=".doc,.docx" className="hidden" onChange={handleTemplateUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
              <div className="p-5 border-b border-obs-bg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row flex-wrap w-full lg:w-auto gap-4">
                  <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por nome, e-mail ou título..."
                      value={submissionSearchTerm}
                      onChange={e => setSubmissionSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm transition-all"
                    />
                  </div>

                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <select
                      value={submissionStatusFilter}
                      onChange={e => setSubmissionStatusFilter(e.target.value)}
                      className="block w-full pl-10 pr-8 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm appearance-none transition-all text-obs-dark"
                    >
                      <option value="">Todos os status</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Em Avaliação">Em Avaliação</option>
                      <option value="Aceito">Aceito</option>
                      <option value="Rejeitado">Rejeitado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-obs-bg">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Autor / Título
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-obs-bg">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-obs-dark/40">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-obs-dark/60">Nenhuma submissão encontrada.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map(sub => (
                        <tr 
                          key={sub.id} 
                          className={`hover:bg-obs-bg/40 transition-colors group cursor-pointer ${sub.status === 'Pendente' ? 'bg-obs-light/5' : ''}`}
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className={`text-sm ${sub.status === 'Pendente' ? 'font-bold' : 'font-medium'} text-obs-dark line-clamp-1`}>
                                {sub.title}
                              </span>
                              <span className="text-xs text-obs-dark/60">{sub.name} ({sub.email})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-obs-dark/60">
                              {new Date(sub.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                sub.status === 'Pendente'
                                  ? 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                                  : sub.status === 'Aceito'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : sub.status === 'Rejeitado'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubmissionToDelete(sub.id);
                                }}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                              <ChevronRight size={18} className="text-obs-dark/20" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-obs-dark mb-1">Mensagens Recebidas</h1>
                <p className="text-sm text-obs-dark/60 font-serif">
                  Acompanhe as dúvidas e propostas enviadas pelo formulário de contato.
                </p>
              </div>

              <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-obs-dark/5 flex items-center gap-4">
                <div className="bg-obs-teal/10 p-2 rounded-lg text-obs-teal">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-obs-dark/50 uppercase tracking-wider">
                    Não Lidas
                  </p>
                  <p className="text-xl font-bold text-obs-dark leading-none">{unreadCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-obs-dark/5 overflow-hidden">
              <div className="p-5 border-b border-obs-bg flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row flex-wrap w-full lg:w-auto gap-4">
                  <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar por nome, e-mail ou assunto..."
                      value={messageSearchTerm}
                      onChange={e => setMessageSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm transition-all"
                    />
                  </div>

                  <div className="relative w-full sm:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-4 w-4 text-obs-dark/40" />
                    </div>
                    <select
                      value={messageStatusFilter}
                      onChange={e => setMessageStatusFilter(e.target.value)}
                      className="block w-full pl-10 pr-8 py-2 border border-obs-dark/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-white sm:text-sm appearance-none transition-all text-obs-dark"
                    >
                      <option value="">Todos os status</option>
                      <option value="Não lida">Não lida</option>
                      <option value="Lida">Lida</option>
                      <option value="Respondida">Respondida</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-obs-bg">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Remetente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Assunto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-obs-dark/50 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-obs-bg">
                    {filteredMessages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-obs-dark/40">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium text-obs-dark/60">Nenhuma mensagem encontrada.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map(msg => (
                        <tr 
                          key={msg.id} 
                          className={`hover:bg-obs-bg/40 transition-colors group cursor-pointer ${msg.status === 'Não lida' ? 'bg-obs-light/5' : ''}`}
                          onClick={() => handleViewMessage(msg)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className={`text-sm ${msg.status === 'Não lida' ? 'font-bold' : 'font-medium'} text-obs-dark`}>
                                {msg.name}
                              </span>
                              <span className="text-xs text-obs-dark/60">{msg.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${msg.status === 'Não lida' ? 'font-bold' : 'text-obs-dark/80'} line-clamp-1`}>
                              {msg.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-obs-dark/60">
                              {new Date(msg.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                msg.status === 'Não lida'
                                  ? 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                                  : msg.status === 'Respondida'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(msg.id);
                                }}
                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                              <ChevronRight size={18} className="text-obs-dark/20" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {(bookToDelete || messageToDelete || callToDelete || teamToDelete) && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => {
                setBookToDelete(null);
                setMessageToDelete(null);
                setCallToDelete(null);
                setTeamToDelete(null);
              }}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full border border-obs-dark/10 p-6 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-obs-dark">
                  Excluir {bookToDelete ? 'Publicação' : messageToDelete ? 'Mensagem' : callToDelete ? 'Chamada' : 'Membro'}
                </h3>
              </div>

              <p className="text-sm text-obs-dark/70 mb-6">
                Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setBookToDelete(null);
                    setMessageToDelete(null);
                    setCallToDelete(null);
                    setTeamToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-obs-dark hover:bg-obs-bg transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    if (bookToDelete) executeDelete();
                    else if (messageToDelete) executeDeleteMessage();
                    else if (callToDelete) executeDeleteCall();
                    else if (teamToDelete) executeDeleteTeamMember();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedMessage(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-obs-dark/10 relative z-10">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedMessage.status === 'Não lida'
                          ? 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                          : selectedMessage.status === 'Respondida'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {selectedMessage.status}
                      </span>
                      <span className="text-xs text-obs-dark/40 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(selectedMessage.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-obs-dark leading-tight">
                      {selectedMessage.subject}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-obs-dark/40 hover:text-obs-dark p-2 rounded-full hover:bg-obs-bg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-obs-bg/30 rounded-2xl p-6 mb-8 border border-obs-dark/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg text-obs-dark/40 border border-obs-dark/5">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-0.5">Remetente</p>
                        <p className="text-sm font-bold text-obs-dark">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg text-obs-dark/40 border border-obs-dark/5">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-0.5">E-mail</p>
                        <a href={`mailto:${selectedMessage.email}`} className="text-sm font-bold text-obs-light hover:underline">{selectedMessage.email}</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-4">Conteúdo da Mensagem</p>
                  <div className="text-obs-dark/80 font-serif leading-relaxed whitespace-pre-wrap bg-white border border-obs-dark/5 p-6 rounded-2xl">
                    {selectedMessage.content}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-6 border-t border-obs-bg">
                  {selectedMessage.status !== 'Respondida' && (
                    <button
                      onClick={() => handleMarkAsReplied(selectedMessage.id)}
                      className="flex-1 bg-obs-dark hover:bg-obs-light text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Reply size={18} />
                      Marcar como Respondida
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-100"
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedSubmission(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-obs-dark/10 relative z-10">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        selectedSubmission.status === 'Pendente'
                          ? 'bg-obs-gold/10 text-obs-dark border-obs-gold/20'
                          : selectedSubmission.status === 'Aceito'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : selectedSubmission.status === 'Rejeitado'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {selectedSubmission.status}
                      </span>
                      <span className="text-xs text-obs-dark/40 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(selectedSubmission.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-obs-dark leading-tight">
                      {selectedSubmission.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-obs-dark/40 hover:text-obs-dark p-2 rounded-full hover:bg-obs-bg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-obs-bg/30 rounded-2xl p-6 mb-8 border border-obs-dark/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg text-obs-dark/40 border border-obs-dark/5">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-0.5">Autor</p>
                        <p className="text-sm font-bold text-obs-dark">{selectedSubmission.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-lg text-obs-dark/40 border border-obs-dark/5">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-0.5">E-mail</p>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-sm font-bold text-obs-light hover:underline">{selectedSubmission.email}</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-4">Resumo / Abstract</p>
                  <div className="text-obs-dark/80 font-serif leading-relaxed whitespace-pre-wrap bg-white border border-obs-dark/5 p-6 rounded-2xl max-h-48 overflow-y-auto">
                    {selectedSubmission.abstract}
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-4">Arquivo Enviado</p>
                  <a 
                    href={selectedSubmission.fileUrl} 
                    download={selectedSubmission.fileName}
                    className="flex items-center justify-between p-4 bg-obs-dark/5 border border-obs-dark/10 rounded-2xl hover:bg-obs-dark/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg text-obs-teal shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-obs-dark line-clamp-1">{selectedSubmission.fileName}</span>
                        <span className="text-[10px] text-obs-dark/40 uppercase tracking-widest font-bold">Documento Word</span>
                      </div>
                    </div>
                    <Download size={20} className="text-obs-dark/20 group-hover:text-obs-dark transition-colors" />
                  </a>
                </div>

                <div className="flex flex-col gap-6 pt-6 border-t border-obs-bg">
                  <div>
                    <p className="text-[10px] font-bold text-obs-dark/40 uppercase tracking-wider mb-4">Alterar Status</p>
                    <div className="flex flex-wrap gap-2">
                      {['Pendente', 'Em Avaliação', 'Aceito', 'Rejeitado'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, status as Submission['status'])}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            selectedSubmission.status === status
                              ? 'bg-obs-dark text-white border-obs-dark'
                              : 'bg-white text-obs-dark/60 border-obs-dark/10 hover:border-obs-dark/30'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSubmissionToDelete(selectedSubmission.id);
                      }}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-100"
                    >
                      <Trash2 size={18} />
                      Excluir Submissão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsEditing(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl w-full border border-obs-dark/10 relative z-10">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-obs-bg">
                  <div>
                    <h3 className="text-2xl font-bold text-obs-dark">
                      {currentBook.id ? 'Editar Publicação' : 'Nova Publicação'}
                    </h3>
                    <p className="text-sm text-obs-dark/50 mt-1">
                      Preencha os dados da obra para exibição no portal.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-obs-dark/40 hover:text-obs-dark p-2 rounded-full hover:bg-obs-bg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">
                      {errorMessage}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-obs-light uppercase tracking-wider mb-4">
                      1. Informações principais
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Título da obra *
                        </label>
                        <input
                          type="text"
                          required
                          value={currentBook.title || ''}
                          onChange={e => setCurrentBook({ ...currentBook, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Subtítulo
                        </label>
                        <input
                          type="text"
                          value={currentBook.subtitle || ''}
                          onChange={e => setCurrentBook({ ...currentBook, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Tipo da obra *
                        </label>
                        <select
                          required
                          value={currentBook.type || ''}
                          onChange={e => setCurrentBook({ ...currentBook, type: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        >
                          <option value="Coletânea">Coletânea</option>
                          <option value="Livro de autoria única">Livro de autoria única</option>
                          <option value="Revista">Revista</option>
                          <option value="Caderno temático">Caderno temático</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Ano da publicação *
                        </label>
                        <input
                          type="number"
                          required
                          value={currentBook.year || new Date().getFullYear()}
                          onChange={e =>
                            setCurrentBook({ ...currentBook, year: parseInt(e.target.value) || new Date().getFullYear() })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Resumo / descrição
                        </label>
                        <textarea
                          rows={4}
                          value={currentBook.abstract || ''}
                          onChange={e => setCurrentBook({ ...currentBook, abstract: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-obs-light uppercase tracking-wider mb-4">
                      2. Autoria e dados editoriais
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Autor(es) *
                        </label>
                        <input
                          type="text"
                          required
                          value={currentBook.authors || ''}
                          onChange={e => setCurrentBook({ ...currentBook, authors: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Organizador(es)
                        </label>
                        <input
                          type="text"
                          value={currentBook.organizers || ''}
                          onChange={e => setCurrentBook({ ...currentBook, organizers: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Data de publicação
                        </label>
                        <input
                          type="date"
                          value={currentBook.publicationDate || ''}
                          onChange={e => setCurrentBook({ ...currentBook, publicationDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Coleção
                        </label>
                        <input
                          type="text"
                          value={currentBook.collection || ''}
                          onChange={e => setCurrentBook({ ...currentBook, collection: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Volume
                        </label>
                        <input
                          type="text"
                          value={currentBook.volume || ''}
                          onChange={e => setCurrentBook({ ...currentBook, volume: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={currentBook.category || ''}
                          onChange={e => setCurrentBook({ ...currentBook, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          ISBN
                        </label>
                        <input
                          type="text"
                          value={currentBook.isbn || ''}
                          onChange={e => setCurrentBook({ ...currentBook, isbn: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-obs-light uppercase tracking-wider mb-4">
                      3. Arquivos e publicação
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Capa do livro
                        </label>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-obs-dark/10 bg-white hover:bg-obs-bg cursor-pointer text-sm font-medium text-obs-dark">
                            <Upload size={16} />
                            Carregar capa
                            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                          </label>

                          <input
                            type="url"
                            value={currentBook.coverUrl || ''}
                            onChange={e => setCurrentBook({ ...currentBook, coverUrl: e.target.value })}
                            placeholder="ou informe a URL da capa"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                          />

                          {currentBook.coverUrl && (
                            <div className="w-16 h-20 rounded border border-obs-dark/10 overflow-hidden shrink-0">
                              <img
                                src={currentBook.coverUrl}
                                alt="Preview da capa"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          PDF da obra
                        </label>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-obs-dark/10 bg-white hover:bg-obs-bg cursor-pointer text-sm font-medium text-obs-dark">
                            <Upload size={16} />
                            Carregar PDF
                            <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                          </label>

                          <input
                            type="url"
                            value={currentBook.downloadLink || ''}
                            onChange={e => setCurrentBook({ ...currentBook, downloadLink: e.target.value, pdfUrl: '' })}
                            placeholder="ou informe o link externo de download"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-obs-dark mb-1.5">
                          Status
                        </label>
                        <select
                          value={currentBook.status || 'Rascunho'}
                          onChange={e => setCurrentBook({ ...currentBook, status: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                        >
                          <option value="Rascunho">Rascunho</option>
                          <option value="Publicado">Publicado</option>
                          <option value="Arquivado">Arquivado</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentBook.isFeatured || false}
                            onChange={e => setCurrentBook({ ...currentBook, isFeatured: e.target.checked })}
                            className="w-5 h-5 rounded border-obs-dark/20"
                          />
                          <span className="text-sm font-semibold text-obs-dark">Destacar na página inicial</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:px-8 flex flex-col sm:flex-row-reverse border-t border-obs-dark/5 -mx-4 sm:-mx-8 -mb-4 sm:-mb-8 mt-8 gap-3">
                    {currentBook.id ? (
                      <>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-8 py-3 bg-obs-dark text-base font-bold text-white hover:bg-obs-light sm:w-auto sm:text-sm transition-all items-center gap-2 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Clock className="animate-spin" size={18} />
                          ) : (
                            <Check size={18} />
                          )}
                          {isLoading ? 'Salvando...' : 'Salvar Edição'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-xl border border-obs-dark/10 shadow-sm px-8 py-3 bg-white text-base font-bold text-red-600 hover:bg-red-50 sm:w-auto sm:text-sm transition-all sm:mr-auto disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="submit"
                          onClick={() => setSubmitStatus('Publicado')}
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-8 py-3 bg-obs-dark text-base font-bold text-white hover:bg-obs-light sm:w-auto sm:text-sm transition-all items-center gap-2 disabled:opacity-50"
                        >
                          {isLoading && submitStatus === 'Publicado' ? (
                            <Clock className="animate-spin" size={18} />
                          ) : (
                            <Check size={18} />
                          )}
                          {isLoading && submitStatus === 'Publicado' ? 'Publicando...' : 'Publicar'}
                        </button>
                        <button
                          type="submit"
                          onClick={() => setSubmitStatus('Rascunho')}
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-xl border border-obs-dark/10 shadow-sm px-8 py-3 bg-white text-base font-bold text-obs-dark hover:bg-obs-bg sm:w-auto sm:text-sm transition-all disabled:opacity-50"
                        >
                          {isLoading && submitStatus === 'Rascunho' ? 'Salvando...' : 'Salvar como rascunho'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-xl border border-obs-dark/10 shadow-sm px-8 py-3 bg-white text-base font-bold text-red-600 hover:bg-red-50 sm:w-auto sm:text-sm transition-all sm:mr-auto disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditingCall && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsEditingCall(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-obs-dark/10 relative z-10">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-obs-bg">
                  <h3 className="text-2xl font-bold text-obs-dark">
                    {currentCall.id ? 'Editar Chamada' : 'Nova Chamada'}
                  </h3>
                  <button
                    onClick={() => setIsEditingCall(false)}
                    className="text-obs-dark/40 hover:text-obs-dark p-2 rounded-full hover:bg-obs-bg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveCall} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Título da Chamada *</label>
                    <input
                      type="text"
                      required
                      value={currentCall.title || ''}
                      onChange={e => setCurrentCall({ ...currentCall, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Descrição Curta</label>
                    <textarea
                      rows={3}
                      value={currentCall.description || ''}
                      onChange={e => setCurrentCall({ ...currentCall, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-obs-dark mb-1.5">Prazo de Encerramento *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 30 de Nov de 2026"
                        value={currentCall.deadline || ''}
                        onChange={e => setCurrentCall({ ...currentCall, deadline: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-obs-dark mb-1.5">Status</label>
                      <select
                        value={currentCall.status || 'open'}
                        onChange={e => setCurrentCall({ ...currentCall, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                      >
                        <option value="open">Aberta</option>
                        <option value="closing">Encerrando em breve</option>
                        <option value="closed">Encerrada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Link Externo (Opcional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={currentCall.link || ''}
                      onChange={e => setCurrentCall({ ...currentCall, link: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingCall(false)}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-obs-dark hover:bg-obs-bg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-obs-dark hover:bg-obs-light text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-obs-dark/20"
                    >
                      Salvar Chamada
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditingTeam && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obs-dark/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsEditingTeam(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-obs-dark/10 relative z-10">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-obs-bg">
                  <h3 className="text-2xl font-bold text-obs-dark">
                    {currentTeamMember.id ? 'Editar Membro' : 'Novo Membro'}
                  </h3>
                  <button
                    onClick={() => setIsEditingTeam(false)}
                    className="text-obs-dark/40 hover:text-obs-dark p-2 rounded-full hover:bg-obs-bg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveTeam} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={currentTeamMember.name || ''}
                      onChange={e => setCurrentTeamMember({ ...currentTeamMember, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Cargo / Função *</label>
                    <input
                      type="text"
                      required
                      value={currentTeamMember.role || ''}
                      onChange={e => setCurrentTeamMember({ ...currentTeamMember, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Instituição</label>
                    <input
                      type="text"
                      value={currentTeamMember.institution || ''}
                      onChange={e => setCurrentTeamMember({ ...currentTeamMember, institution: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-obs-dark mb-1.5">Ordem de Exibição</label>
                    <input
                      type="number"
                      value={currentTeamMember.order || 0}
                      onChange={e => setCurrentTeamMember({ ...currentTeamMember, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-obs-dark/10 focus:outline-none focus:ring-2 focus:ring-obs-light/50 bg-obs-bg/30"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingTeam(false)}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-obs-dark hover:bg-obs-bg transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-obs-dark hover:bg-obs-light text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-obs-dark/20"
                    >
                      Salvar Membro
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {submissionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obs-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-obs-dark/10 animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-obs-dark text-center mb-2">Excluir Submissão?</h3>
            <p className="text-obs-dark/60 text-center mb-8 font-serif">
              Esta ação não pode ser desfeita. O arquivo e os dados da submissão serão removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSubmissionToDelete(null)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-obs-dark hover:bg-obs-bg transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={executeDeleteSubmission}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed bottom-8 right-8 z-[100] bg-obs-dark text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="text-obs-gold" size={24} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}
    </div>
  );
}