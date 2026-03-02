export type UserRole = 
  | 'school' 
  | 'department-leader' 
  | 'specialist' 
  | 'office' 
  | 'director'
  | 'principal';

export type SuggestionType = 'sensitive' | 'non-sensitive';

export type SuggestionStatus = 
  | 'pending' 
  | 'assigned' 
  | 'processing' 
  | 'completed' 
  | 'rejected';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  schoolId?: string;
  schoolName?: string;
  departmentId?: string;
  departmentName?: string;
}

export interface School {
  id: string;
  name: string;
  district: string;
  level: string; // mầm non, tiểu học, trung học
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Suggestion {
  id: string;
  title: string;
  content: string;
  type: SuggestionType;
  status: SuggestionStatus;
  category: string; // Lĩnh vực
  schoolId: string;
  schoolName: string;
  departmentId: string;
  departmentName: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  response?: string;
  isAnonymous: boolean;
  rating?: number;
  ratingComment?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  attachments?: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  departmentId: string;
  departmentName: string;
  isPublic: boolean;
  createdAt: string;
  views: number;
}

export interface StatisticsData {
  totalSuggestions: number;
  pendingSuggestions: number;
  completedSuggestions: number;
  averageResponseTime: number;
  byDepartment: { name: string; count: number }[];
  byCategory: { name: string; count: number }[];
  byStatus: { name: string; count: number }[];
  byMonth: { month: string; count: number }[];
  satisfactionRating: number;
}