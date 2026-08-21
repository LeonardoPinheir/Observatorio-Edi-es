import { db, storage, auth } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  abstract?: string;
  authors: string;
  organizers?: string;
  publicationDate?: string;
  year: number;
  collection?: string;
  volume?: string;
  isbn?: string;
  coverUrl?: string;
  pdfUrl?: string;
  downloadLink?: string;
  isFeatured: boolean;
  status: string;
  category?: string;
  statisticsUrl?: string;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  title: string;
  abstract: string;
  file?: File;
  fileUrl?: string;
  fileName?: string;
  date: string;
  status: "Pendente" | "Aprovado" | "Rejeitado" | string;
}

export interface SubmissionTemplate {
  id: string;
  fileUrl: string;
  fileName: string;
  updatedAt: string;
  file?: File;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  status: "Lida" | "Não lida" | string;
}

export interface Call {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "Aberta" | "Fechada" | string;
  link?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  institution?: string;
  order: number;
}

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_");
};

const uploadFile = async (file: File, path: string): Promise<string> => {
  const sanitizedPath = path
    .split("/")
    .map((part) => sanitizeFileName(part))
    .join("/");
  const storageRef = ref(storage, sanitizedPath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

const handleFirebaseError = (context: string, error: any) => {
  console.warn(`[Firebase] ${context}:`, error.message || error);
};

// Books
export const getBooks = async (): Promise<Book[]> => {
  try {
    const q = query(collection(db, "books"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return { id: d.id, ...data } as Book;
    });
  } catch (err) {
    handleFirebaseError("fetching books", err);
  }
  return [];
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  try {
    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Book;
    }
  } catch (err) {
    handleFirebaseError("fetching book by id", err);
  }
  return undefined;
};

export const addBook = async (book: Omit<Book, "id">) => {
  try {
    const data = { ...book, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "books"), data);
    window.dispatchEvent(new Event("booksUpdated"));
    return { id: docRef.id, ...data } as Book;
  } catch (err) {
    handleFirebaseError("adding book", err);
    throw err;
  }
};

export const updateBook = async (id: string, updates: Partial<Book>) => {
  try {
    const docRef = doc(db, "books", id);
    await updateDoc(docRef, updates);
    window.dispatchEvent(new Event("booksUpdated"));
  } catch (err) {
    handleFirebaseError("updating book", err);
    throw err;
  }
};

export const updateBookStatusesBulk = async (ids: string[], status: string) => {
  try {
    const batch = writeBatch(db);
    for (const id of ids) {
      const docRef = doc(db, "books", id);
      batch.update(docRef, { status });
    }
    await batch.commit();
    window.dispatchEvent(new Event("booksUpdated"));
  } catch (err) {
    handleFirebaseError("bulk updating book statuses", err);
    throw err;
  }
};

export const deleteBook = async (id: string) => {
  try {
    await deleteDoc(doc(db, "books", id));
    window.dispatchEvent(new Event("booksUpdated"));
  } catch (err) {
    handleFirebaseError("deleting book", err);
    throw err;
  }
};

// Messages
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const q = query(
      collection(db, "messages"),
      where("status", "==", "Não lida")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.length;
  } catch (err) {
    handleFirebaseError("fetching unread messages count", err);
  }
  return 0;
};

export const getMessages = async (): Promise<Message[]> => {
  try {
    const q = query(collection(db, "messages"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
  } catch (err) {
    handleFirebaseError("fetching messages", err);
  }
  return [];
};

export const addMessage = async (message: Omit<Message, "id" | "date" | "status">) => {
  try {
    const newMessageData = {
      ...message,
      date: new Date().toISOString(),
      status: "Não lida",
    };
    const docRef = await addDoc(collection(db, "messages"), newMessageData);
    window.dispatchEvent(new Event("messagesUpdated"));
    return { id: docRef.id, ...newMessageData } as Message;
  } catch (err) {
    handleFirebaseError("adding message", err);
    throw err;
  }
};

export const updateMessageStatus = async (id: string, status: Message["status"]) => {
  try {
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, { status });
    window.dispatchEvent(new Event("messagesUpdated"));
  } catch (err) {
    handleFirebaseError("updating message status", err);
    throw err;
  }
};

export const deleteMessage = async (id: string) => {
  try {
    await deleteDoc(doc(db, "messages", id));
    window.dispatchEvent(new Event("messagesUpdated"));
  } catch (err) {
    handleFirebaseError("deleting message", err);
    throw err;
  }
};

// Submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  try {
    const q = query(collection(db, "submissions"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
  } catch (err) {
    handleFirebaseError("fetching submissions", err);
  }
  return [];
};

export const addSubmission = async (submission: Omit<Submission, "id" | "date" | "status">) => {
  let fileUrl = submission.fileUrl || "";

  try {
    if (submission.file) {
      const fileName = `${Date.now()}-${submission.file.name}`;
      fileUrl = await uploadFile(submission.file, `submissions/${fileName}`);
    }
  } catch (err) {
    handleFirebaseError("uploading submission file", err);
    throw err;
  }

  try {
    const newSubmissionData = {
      name: submission.name,
      email: submission.email,
      title: submission.title,
      abstract: submission.abstract,
      fileUrl,
      fileName: submission.fileName || "",
      date: new Date().toISOString(),
      status: "Pendente",
    };

    const docRef = await addDoc(collection(db, "submissions"), newSubmissionData);
    window.dispatchEvent(new Event("submissionsUpdated"));
    return { id: docRef.id, ...newSubmissionData } as Submission;
  } catch (err) {
    handleFirebaseError("adding submission", err);
    throw err;
  }
};

export const updateSubmissionStatus = async (id: string, status: Submission["status"]) => {
  try {
    const docRef = doc(db, "submissions", id);
    await updateDoc(docRef, { status });
    window.dispatchEvent(new Event("submissionsUpdated"));
  } catch (err) {
    handleFirebaseError("updating submission status", err);
    throw err;
  }
};

export const deleteSubmission = async (id: string) => {
  try {
    await deleteDoc(doc(db, "submissions", id));
    window.dispatchEvent(new Event("submissionsUpdated"));
  } catch (err) {
    handleFirebaseError("deleting submission", err);
    throw err;
  }
};

// Template
export const getSubmissionTemplate = async (): Promise<SubmissionTemplate | null> => {
  try {
    const q = query(collection(db, "submission_templates"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as SubmissionTemplate;
    }
  } catch (err) {
    handleFirebaseError("fetching template", err);
  }
  return null;
};

export const updateSubmissionTemplate = async (template: Partial<SubmissionTemplate>) => {
  let fileUrl = template.fileUrl || "";

  try {
    if (template.file) {
      fileUrl = await uploadFile(template.file, `templates/${template.file.name}`);
    }
  } catch (err) {
    handleFirebaseError("uploading template file", err);
    throw err;
  }

  try {
    const newTemplateData = {
      fileUrl,
      fileName: template.fileName || "",
      updatedAt: new Date().toISOString(),
    };

    const snapshot = await getDocs(collection(db, "submission_templates"));
    if (!snapshot.empty) {
      const docRef = doc(db, "submission_templates", snapshot.docs[0].id);
      await updateDoc(docRef, newTemplateData);
    } else {
      await addDoc(collection(db, "submission_templates"), newTemplateData);
    }
    window.dispatchEvent(new Event("templateUpdated"));
  } catch (err) {
    handleFirebaseError("updating template", err);
    throw err;
  }
};

// Calls
export const getCalls = async (): Promise<Call[]> => {
  try {
    const q = query(collection(db, "open_calls"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Call));
  } catch (err) {
    handleFirebaseError("fetching calls", err);
  }
  return [];
};

export const addCall = async (call: Omit<Call, "id">) => {
  try {
    const data = { ...call, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "open_calls"), data);
    window.dispatchEvent(new Event("callsUpdated"));
    return { id: docRef.id, ...data } as Call;
  } catch (err) {
    handleFirebaseError("adding call", err);
    throw err;
  }
};

export const updateCall = async (id: string, updates: Partial<Call>) => {
  try {
    const docRef = doc(db, "open_calls", id);
    await updateDoc(docRef, updates);
    window.dispatchEvent(new Event("callsUpdated"));
  } catch (err) {
    handleFirebaseError("updating call", err);
    throw err;
  }
};

export const deleteCall = async (id: string) => {
  try {
    await deleteDoc(doc(db, "open_calls", id));
    window.dispatchEvent(new Event("callsUpdated"));
  } catch (err) {
    handleFirebaseError("deleting call", err);
    throw err;
  }
};

// Team
export const getTeam = async (): Promise<TeamMember[]> => {
  try {
    const q = query(collection(db, "team_members"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
  } catch (err) {
    handleFirebaseError("fetching team", err);
  }
  return [];
};

export const addTeamMember = async (member: Omit<TeamMember, "id">) => {
  try {
    const data = { ...member, created_at: new Date().toISOString() };
    const docRef = await addDoc(collection(db, "team_members"), data);
    window.dispatchEvent(new Event("teamUpdated"));
    return { id: docRef.id, ...data } as TeamMember;
  } catch (err) {
    handleFirebaseError("adding team member", err);
    throw err;
  }
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
  try {
    const docRef = doc(db, "team_members", id);
    await updateDoc(docRef, updates);
    window.dispatchEvent(new Event("teamUpdated"));
  } catch (err) {
    handleFirebaseError("updating team member", err);
    throw err;
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    await deleteDoc(doc(db, "team_members", id));
    window.dispatchEvent(new Event("teamUpdated"));
  } catch (err) {
    handleFirebaseError("deleting team member", err);
    throw err;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) resolve(true);
        else resolve(localStorage.getItem("obs_auth") === "true");
      });
    });
  } catch (err) {
    handleFirebaseError("checking auth session", err);
  }
  return localStorage.getItem("obs_auth") === "true";
};

export const login = async (
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string }> => {
  // Simulated fallback for the specific requested user
  if (email === "leonardo.pinheirolk@gmail.com" && pass === "123456") {
    localStorage.setItem("obs_auth", "true");
    return { success: true };
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    return { success: true };
  } catch (err: any) {
    handleFirebaseError("login attempt", err);
    return { success: false, error: err.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    handleFirebaseError("logout attempt", err);
  }
  localStorage.removeItem("obs_auth");
};
