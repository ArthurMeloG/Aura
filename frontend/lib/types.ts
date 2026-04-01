export type Role = 'STUDENT' | 'COLLABORATOR' | 'ADMIN';
export type PostCategory = 'GERAL' | 'EDITAL' | 'EVENTO' | 'AVISO' | 'ACADEMICO';
export type ConversationStatus = 'BOT' | 'QUEUED' | 'ACTIVE' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  enrollment?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  imageUrl?: string;
  likesCount: number;
  authorId: string;
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId?: string;
  sender?: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  isBot: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  studentId: string;
  student: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  collaboratorId?: string;
  collaborator?: Pick<User, 'id' | 'name'>;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
