-- Create tables for Observatório Edições

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  type TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT,
  authors TEXT NOT NULL,
  organizers TEXT,
  editors TEXT,
  publication_date DATE,
  year INTEGER NOT NULL,
  collection TEXT,
  volume TEXT,
  edition TEXT,
  isbn TEXT,
  doi TEXT,
  language TEXT,
  pages INTEGER,
  category TEXT,
  theme TEXT,
  knowledge_area TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  download_link TEXT,
  public_page_link TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  institution TEXT,
  editorial_project TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Não lida',
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Open Calls table
CREATE TABLE IF NOT EXISTS open_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Editorial Team table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  institution TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  fileUrl TEXT NOT NULL,
  fileName TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submission Templates table
CREATE TABLE IF NOT EXISTS submission_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fileUrl TEXT NOT NULL,
  fileName TEXT NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE open_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for now, assuming admin access is handled via API key or similar in this context)
-- In a real app, you'd use auth.uid() checks.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for books" ON books;
DROP POLICY IF EXISTS "Public read access for open_calls" ON open_calls;
DROP POLICY IF EXISTS "Public read access for team_members" ON team_members;
DROP POLICY IF EXISTS "Public insert access for messages" ON messages;
DROP POLICY IF EXISTS "Public insert access for submissions" ON submissions;
DROP POLICY IF EXISTS "Public read access for submission_templates" ON submission_templates;
DROP POLICY IF EXISTS "Admin full access for books" ON books;
DROP POLICY IF EXISTS "Admin full access for messages" ON messages;
DROP POLICY IF EXISTS "Admin full access for open_calls" ON open_calls;
DROP POLICY IF EXISTS "Admin full access for team_members" ON team_members;
DROP POLICY IF EXISTS "Admin full access for submissions" ON submissions;
DROP POLICY IF EXISTS "Admin full access for submission_templates" ON submission_templates;

-- Create policies
CREATE POLICY "Public read access for books" ON books FOR SELECT USING (status = 'Publicado' OR status = 'Arquivado');
CREATE POLICY "Public read access for open_calls" ON open_calls FOR SELECT USING (TRUE);
CREATE POLICY "Public read access for team_members" ON team_members FOR SELECT USING (TRUE);
CREATE POLICY "Public insert access for messages" ON messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert access for submissions" ON submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read access for submission_templates" ON submission_templates FOR SELECT USING (TRUE);

-- Admin policies (assuming authenticated users are admins for this simple setup)
CREATE POLICY "Admin full access for books" ON books FOR ALL USING (TRUE);
CREATE POLICY "Admin full access for messages" ON messages FOR ALL USING (TRUE);
CREATE POLICY "Admin full access for open_calls" ON open_calls FOR ALL USING (TRUE);
CREATE POLICY "Admin full access for team_members" ON team_members FOR ALL USING (TRUE);
CREATE POLICY "Admin full access for submissions" ON submissions FOR ALL USING (TRUE);
CREATE POLICY "Admin full access for submission_templates" ON submission_templates FOR ALL USING (TRUE);
