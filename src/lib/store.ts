import { supabase } from './supabase';

export interface Book {
  id: string;
  // 1. Informações principais
  title: string;
  subtitle?: string;
  type: 'Coletânea' | 'Livro de autoria única' | 'Revista' | 'Caderno temático' | string;
  abstract?: string;
  
  // 2. Autoria e organização
  authors: string;
  organizers?: string;

  // 3. Dados editoriais
  publicationDate?: string;
  year: number;
  collection?: string;
  volume?: string;
  isbn?: string;

  // 4. Arquivos e mídia
  coverUrl?: string;
  pdfUrl?: string;
  downloadLink?: string;

  // 5. Configurações de exibição
  isFeatured: boolean;
  status: 'Rascunho' | 'Publicado' | 'Arquivado' | string;
  category?: string;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "Ensino, Comunicação e Desinformação",
    subtitle: "Desafios contemporâneos na sala de aula",
    type: "Coletânea",
    authors: "João Pereira",
    organizers: "Maria Silva",
    abstract: "Esta obra reúne pesquisas e reflexões sobre o impacto da desinformação no ambiente escolar e as estratégias de comunicação e ensino para mitigar seus efeitos. Uma leitura essencial para educadores que buscam compreender as dinâmicas da informação na era digital.",
    year: 2024,
    isbn: "978-85-12345-67-8",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    category: "Educação e Mídia",
    isFeatured: true,
    status: "Publicado"
  },
  {
    id: "2",
    title: "Experiências Europeias de Combate à Desinformação",
    subtitle: "Políticas públicas e iniciativas da sociedade civil",
    type: "Livro de autoria única",
    authors: "Ana Costa, Carlos Mendes",
    abstract: "Uma análise aprofundada das abordagens adotadas por países europeus para enfrentar a disseminação de notícias falsas. O livro explora desde regulamentações governamentais até projetos de fact-checking independentes, oferecendo um panorama rico de soluções.",
    year: 2023,
    isbn: "978-85-98765-43-2",
    coverUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=600",
    category: "Políticas Públicas",
    isFeatured: true,
    status: "Publicado"
  },
  {
    id: "3",
    title: "Ecossistemas de Inovação e Educação",
    subtitle: "Conectando universidade, mercado e sociedade",
    type: "Coletânea",
    authors: "Vários Autores",
    organizers: "Pedro Almeida",
    abstract: "Coletânea que discute como as instituições de ensino superior podem se integrar de forma mais efetiva aos ecossistemas de inovação locais e globais. Apresenta estudos de caso de parcerias bem-sucedidas e propõe novos modelos de extensão universitária.",
    year: 2025,
    isbn: "978-85-55555-55-5",
    coverUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600",
    category: "Inovação",
    isFeatured: false,
    status: "Publicado"
  }
];

// Helper functions to map between frontend and database
const mapBookToDB = (book: Partial<Book>) => {
  const db: any = {};
  if (book.title !== undefined) db.title = book.title;
  if (book.subtitle !== undefined) db.subtitle = book.subtitle;
  if (book.type !== undefined) db.type = book.type;
  if (book.abstract !== undefined) db.abstract = book.abstract;
  if (book.authors !== undefined) db.authors = book.authors;
  if (book.organizers !== undefined) db.organizers = book.organizers;
  if (book.publicationDate !== undefined) db.publication_date = book.publicationDate || null;
  if (book.year !== undefined) db.year = book.year;
  if (book.collection !== undefined) db.collection = book.collection;
  if (book.volume !== undefined) db.volume = book.volume;
  if (book.isbn !== undefined) db.isbn = book.isbn;
  if (book.category !== undefined) db.category = book.category;
  if (book.coverUrl !== undefined) db.cover_url = book.coverUrl;
  if (book.pdfUrl !== undefined) db.pdf_url = book.pdfUrl;
  if (book.downloadLink !== undefined) db.download_link = book.downloadLink;
  if (book.isFeatured !== undefined) db.is_featured = book.isFeatured;
  if (book.status !== undefined) db.status = book.status;
  return db;
};

const mapDBToBook = (dbBook: any): Book => {
  return {
    id: dbBook.id,
    title: dbBook.title,
    subtitle: dbBook.subtitle,
    type: dbBook.type,
    abstract: dbBook.abstract,
    authors: dbBook.authors,
    organizers: dbBook.organizers,
    publicationDate: dbBook.publication_date,
    year: dbBook.year,
    collection: dbBook.collection,
    volume: dbBook.volume,
    isbn: dbBook.isbn,
    category: dbBook.category,
    coverUrl: dbBook.cover_url,
    pdfUrl: dbBook.pdf_url,
    downloadLink: dbBook.download_link,
    isFeatured: dbBook.is_featured,
    status: dbBook.status
  };
};

const mapSubmissionToDB = (submission: Partial<Submission>) => {
  const db: any = {};
  if (submission.name !== undefined) db.name = submission.name;
  if (submission.email !== undefined) db.email = submission.email;
  if (submission.title !== undefined) db.title = submission.title;
  if (submission.abstract !== undefined) db.abstract = submission.abstract;
  if (submission.fileUrl !== undefined) db.file_url = submission.fileUrl;
  if (submission.fileName !== undefined) db.file_name = submission.fileName;
  if (submission.date !== undefined) db.date = submission.date;
  if (submission.status !== undefined) db.status = submission.status;
  return db;
};

const mapDBToSubmission = (db: any): Submission => {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    title: db.title,
    abstract: db.abstract,
    fileUrl: db.file_url,
    fileName: db.file_name,
    date: db.date,
    status: db.status
  };
};

const mapTemplateToDB = (template: Partial<SubmissionTemplate>) => {
  const db: any = {};
  if (template.fileUrl !== undefined) db.file_url = template.fileUrl;
  if (template.fileName !== undefined) db.file_name = template.fileName;
  if (template.updatedAt !== undefined) db.updated_at = template.updatedAt;
  return db;
};

const mapDBToTemplate = (db: any): SubmissionTemplate => {
  return {
    id: db.id,
    fileUrl: db.file_url,
    fileName: db.file_name,
    updatedAt: db.updated_at
  };
};

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters and spaces with underscores
    .replace(/_{2,}/g, '_'); // Replace multiple underscores with a single one
};

const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!supabase) throw new Error('Supabase not configured');

  // Sanitize the path but keep directory structure if present
  const sanitizedPath = path.split('/').map(part => sanitizeFileName(part)).join('/');

  const { data, error } = await supabase.storage
    .from('submissions')
    .upload(sanitizedPath, file, {
      upsert: true
    });

  if (error) {
    console.error('Error uploading file to Supabase Storage:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('submissions')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const getBooks = async (): Promise<Book[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching books from Supabase:', error);
    } else if (data) {
      return data.map(mapDBToBook);
    }
  }

  // Fallback to localStorage
  const stored = localStorage.getItem('obs_books');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse books from localStorage", e);
    }
  }
  // Initialize with default books if empty
  localStorage.setItem('obs_books', JSON.stringify(INITIAL_BOOKS));
  return INITIAL_BOOKS;
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching book from Supabase:', error);
    } else if (data) {
      return mapDBToBook(data);
    }
  }

  const books = await getBooks();
  return books.find(b => b.id === id);
};

export const addBook = async (book: Omit<Book, 'id'>) => {
  if (supabase) {
    const dbBook = mapBookToDB(book);
    const { data, error } = await supabase
      .from('books')
      .insert([dbBook])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding book to Supabase:', error);
      throw error;
    } else if (data) {
      window.dispatchEvent(new Event('booksUpdated'));
      return mapDBToBook(data);
    }
  }

  const books = await getBooks();
  const newBook = { ...book, id: Date.now().toString() };
  const updatedBooks = [newBook, ...books];
  localStorage.setItem('obs_books', JSON.stringify(updatedBooks));
  window.dispatchEvent(new Event('booksUpdated'));
  return newBook;
};

export const updateBook = async (id: string, updates: Partial<Book>) => {
  if (supabase) {
    const dbUpdates = mapBookToDB(updates);
    const { error } = await supabase
      .from('books')
      .update(dbUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating book in Supabase:', error);
      throw error;
    } else {
      window.dispatchEvent(new Event('booksUpdated'));
      return;
    }
  }

  const books = await getBooks();
  const updated = books.map(b => b.id === id ? { ...b, ...updates } : b);
  localStorage.setItem('obs_books', JSON.stringify(updated));
  window.dispatchEvent(new Event('booksUpdated'));
};

export const deleteBook = async (id: string) => {
  if (supabase) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting book from Supabase:', error);
    } else {
      window.dispatchEvent(new Event('booksUpdated'));
      return;
    }
  }

  const books = await getBooks();
  const updated = books.filter(b => b.id !== id);
  localStorage.setItem('obs_books', JSON.stringify(updated));
  window.dispatchEvent(new Event('booksUpdated'));
};

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  status: 'Não lida' | 'Lida' | 'Respondida';
}

export interface Call {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'open' | 'closing' | 'closed';
  link?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institution: string;
  order: number;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  title: string;
  abstract: string;
  fileUrl: string;
  fileName: string;
  date: string;
  status: 'Pendente' | 'Em Avaliação' | 'Aceito' | 'Rejeitado';
}

export interface SubmissionTemplate {
  id: string;
  fileUrl: string;
  fileName: string;
  updatedAt: string;
}

export const getMessages = async (): Promise<Message[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages from Supabase:', error);
    } else if (data) {
      return data as Message[];
    }
  }

  const stored = localStorage.getItem('obs_messages');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse messages from localStorage", e);
    }
  }
  return [];
};

export const addMessage = async (message: Omit<Message, 'id' | 'date' | 'status'>) => {
  const newMessageData = {
    ...message,
    date: new Date().toISOString(),
    status: 'Não lida'
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('messages')
      .insert([newMessageData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding message to Supabase:', error);
      throw error;
    } else if (data) {
      window.dispatchEvent(new Event('messagesUpdated'));
      return data as Message;
    }
  }

  const messages = await getMessages();
  const newMessage: Message = {
    ...newMessageData,
    id: Date.now().toString(),
    status: 'Não lida'
  };
  const updatedMessages = [newMessage, ...messages];
  localStorage.setItem('obs_messages', JSON.stringify(updatedMessages));
  window.dispatchEvent(new Event('messagesUpdated'));
  return newMessage;
};

export const updateMessageStatus = async (id: string, status: Message['status']) => {
  if (supabase) {
    const { error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating message status in Supabase:', error);
    } else {
      window.dispatchEvent(new Event('messagesUpdated'));
      return;
    }
  }

  const messages = await getMessages();
  const updated = messages.map(m => m.id === id ? { ...m, status } : m);
  localStorage.setItem('obs_messages', JSON.stringify(updated));
  window.dispatchEvent(new Event('messagesUpdated'));
};

export const deleteMessage = async (id: string) => {
  if (supabase) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting message from Supabase:', error);
    } else {
      window.dispatchEvent(new Event('messagesUpdated'));
      return;
    }
  }

  const messages = await getMessages();
  const updated = messages.filter(m => m.id !== id);
  localStorage.setItem('obs_messages', JSON.stringify(updated));
  window.dispatchEvent(new Event('messagesUpdated'));
};

export const getUnreadMessagesCount = async (): Promise<number> => {
  const messages = await getMessages();
  return messages.filter(m => m.status === 'Não lida').length;
};

// Submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching submissions from Supabase:', error);
    } else if (data) {
      return data.map(mapDBToSubmission);
    }
  }

  const stored = localStorage.getItem('obs_submissions');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse submissions from localStorage", e);
    }
  }
  return [];
};

export const addSubmission = async (submission: Omit<Submission, 'id' | 'date' | 'status' | 'fileUrl'> & { file?: File, fileUrl?: string }) => {
  let fileUrl = submission.fileUrl || '';
  
  if (supabase && submission.file) {
    const fileName = `${Date.now()}-${submission.file.name}`;
    fileUrl = await uploadFile(submission.file, `submissions/${fileName}`);
  }

  const newSubmissionData: Omit<Submission, 'id'> = {
    name: submission.name,
    email: submission.email,
    title: submission.title,
    abstract: submission.abstract,
    fileName: submission.fileName,
    fileUrl: fileUrl,
    date: new Date().toISOString(),
    status: 'Pendente'
  };

  if (supabase) {
    const dbSubmission = mapSubmissionToDB(newSubmissionData);
    const { data, error } = await supabase
      .from('submissions')
      .insert([dbSubmission])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding submission to Supabase:', error);
      throw error;
    } else if (data) {
      window.dispatchEvent(new Event('submissionsUpdated'));
      return mapDBToSubmission(data);
    }
  }

  const submissions = await getSubmissions();
  const newSubmission: Submission = {
    ...newSubmissionData,
    id: Date.now().toString(),
    status: 'Pendente'
  };
  const updatedSubmissions = [newSubmission, ...submissions];
  localStorage.setItem('obs_submissions', JSON.stringify(updatedSubmissions));
  window.dispatchEvent(new Event('submissionsUpdated'));
  return newSubmission;
};

export const updateSubmissionStatus = async (id: string, status: Submission['status']) => {
  if (supabase) {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating submission status in Supabase:', error);
    } else {
      window.dispatchEvent(new Event('submissionsUpdated'));
      return;
    }
  }

  const submissions = await getSubmissions();
  const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
  localStorage.setItem('obs_submissions', JSON.stringify(updated));
  window.dispatchEvent(new Event('submissionsUpdated'));
};

export const deleteSubmission = async (id: string) => {
  if (supabase) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting submission from Supabase:', error);
    } else {
      window.dispatchEvent(new Event('submissionsUpdated'));
      return;
    }
  }

  const submissions = await getSubmissions();
  const updated = submissions.filter(s => s.id !== id);
  localStorage.setItem('obs_submissions', JSON.stringify(updated));
  window.dispatchEvent(new Event('submissionsUpdated'));
};

// Template
export const getSubmissionTemplate = async (): Promise<SubmissionTemplate | null> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('submission_templates')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching template from Supabase:', error);
    } else if (data) {
      return mapDBToTemplate(data);
    }
  }

  const stored = localStorage.getItem('obs_submission_template');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse template from localStorage", e);
    }
  }

  // Fallback to default template if nothing else is found
  return {
    id: 'default',
    fileName: 'template-modelo.txt',
    fileUrl: '/template-modelo.txt',
    updatedAt: new Date().toISOString()
  };
};

export const updateSubmissionTemplate = async (template: Omit<SubmissionTemplate, 'id' | 'updatedAt' | 'fileUrl'> & { file?: File, fileUrl?: string }) => {
  let fileUrl = template.fileUrl || '';

  if (supabase && template.file) {
    fileUrl = await uploadFile(template.file, `templates/${template.file.name}`);
  }

  const newTemplateData = {
    fileName: template.fileName,
    fileUrl: fileUrl,
    updatedAt: new Date().toISOString()
  };

  if (supabase) {
    const existing = await getSubmissionTemplate();
    const dbTemplate = mapTemplateToDB(newTemplateData);
    
    if (existing) {
      const { error } = await supabase
        .from('submission_templates')
        .update(dbTemplate)
        .eq('id', existing.id);
      
      if (error) {
        console.error('Error updating template in Supabase:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('submission_templates')
        .insert([dbTemplate]);
      
      if (error) {
        console.error('Error inserting template in Supabase:', error);
        throw error;
      }
    }
    window.dispatchEvent(new Event('templateUpdated'));
    return;
  }

  const newTemplate: SubmissionTemplate = {
    ...newTemplateData,
    id: '1'
  };
  localStorage.setItem('obs_submission_template', JSON.stringify(newTemplate));
  window.dispatchEvent(new Event('templateUpdated'));
};

// Calls
export const getCalls = async (): Promise<Call[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('open_calls')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching calls from Supabase:', error);
    } else if (data && data.length > 0) {
      return data as Call[];
    }
  }

  const stored = localStorage.getItem('obs_calls');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse calls from localStorage", e);
    }
  }
  return [];
};

export const addCall = async (call: Omit<Call, 'id'>) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('open_calls')
      .insert([call])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding call to Supabase:', error);
    } else if (data) {
      window.dispatchEvent(new Event('callsUpdated'));
      return data as Call;
    }
  }

  const calls = await getCalls();
  const newCall = { ...call, id: Date.now().toString() };
  const updatedCalls = [newCall, ...calls];
  localStorage.setItem('obs_calls', JSON.stringify(updatedCalls));
  window.dispatchEvent(new Event('callsUpdated'));
  return newCall;
};

export const updateCall = async (id: string, updates: Partial<Call>) => {
  if (supabase) {
    const { error } = await supabase
      .from('open_calls')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating call in Supabase:', error);
    } else {
      window.dispatchEvent(new Event('callsUpdated'));
      return;
    }
  }

  const calls = await getCalls();
  const updated = calls.map(c => c.id === id ? { ...c, ...updates } : c);
  localStorage.setItem('obs_calls', JSON.stringify(updated));
  window.dispatchEvent(new Event('callsUpdated'));
};

export const deleteCall = async (id: string) => {
  if (supabase) {
    const { error } = await supabase
      .from('open_calls')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting call from Supabase:', error);
    } else {
      window.dispatchEvent(new Event('callsUpdated'));
      return;
    }
  }

  const calls = await getCalls();
  const updated = calls.filter(c => c.id !== id);
  localStorage.setItem('obs_calls', JSON.stringify(updated));
  window.dispatchEvent(new Event('callsUpdated'));
};

// Team
export const getTeam = async (): Promise<TeamMember[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching team from Supabase:', error);
    } else if (data && data.length > 0) {
      return data as TeamMember[];
    }
  }

  const stored = localStorage.getItem('obs_team');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse team from localStorage", e);
    }
  }
  return [
    { id: '1', name: 'Dra. Ana Luiza Silva', role: 'Coordenação Editorial', institution: 'Universidade Federal', order: 1 },
    { id: '2', name: 'Dr. Carlos Mendes', role: 'Conselho Editorial', institution: 'Universidade Estadual', order: 2 },
    { id: '3', name: 'Me. João Pereira', role: 'Apoio Técnico e Revisão', institution: 'Instituto de Pesquisa', order: 3 },
    { id: '4', name: 'Dra. Maria Costa', role: 'Conselho Editorial', institution: 'Universidade Internacional', order: 4 },
  ];
};

export const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
  if (supabase) {
    const { data, error } = await supabase
      .from('team_members')
      .insert([member])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding team member to Supabase:', error);
    } else if (data) {
      window.dispatchEvent(new Event('teamUpdated'));
      return data as TeamMember;
    }
  }

  const team = await getTeam();
  const newMember = { ...member, id: Date.now().toString() };
  const updatedTeam = [...team, newMember].sort((a, b) => a.order - b.order);
  localStorage.setItem('obs_team', JSON.stringify(updatedTeam));
  window.dispatchEvent(new Event('teamUpdated'));
  return newMember;
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
  if (supabase) {
    const { error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating team member in Supabase:', error);
    } else {
      window.dispatchEvent(new Event('teamUpdated'));
      return;
    }
  }

  const team = await getTeam();
  const updated = team.map(m => m.id === id ? { ...m, ...updates } : m).sort((a, b) => a.order - b.order);
  localStorage.setItem('obs_team', JSON.stringify(updated));
  window.dispatchEvent(new Event('teamUpdated'));
};

export const deleteTeamMember = async (id: string) => {
  if (supabase) {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting team member from Supabase:', error);
    } else {
      window.dispatchEvent(new Event('teamUpdated'));
      return;
    }
  }

  const team = await getTeam();
  const updated = team.filter(m => m.id !== id);
  localStorage.setItem('obs_team', JSON.stringify(updated));
  window.dispatchEvent(new Event('teamUpdated'));
};

export const isAuthenticated = async (): Promise<boolean> => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
  return localStorage.getItem('obs_auth') === 'true';
};

export const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Fallback simulated auth
  if ((email === 'leonardo.pinheiro@gmail.com' || email === 'leonardo.pinheirolk@gmail.com') && pass === '123456') {
    localStorage.setItem('obs_auth', 'true');
    return { success: true };
  }
  return { success: false, error: 'Usuário ou senha inválidos.' };
};

export const logout = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('obs_auth');
};

