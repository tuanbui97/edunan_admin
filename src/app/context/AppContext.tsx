// Mock data và context quản lý state toàn cục
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Suggestion, UserRole, SuggestionStatus } from '../types';
import { mockUsers, mockSuggestions, mockSchools, mockDepartments, mockCategories } from '../mockData';

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => void;
  getSuggestionsByRole: (role: UserRole, userId: string) => Suggestion[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Export mock data
export { mockSchools as schools, mockDepartments as departments, mockCategories as categories };

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);

  const addSuggestion = (suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: `sug${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
    };
    setSuggestions([newSuggestion, ...suggestions]);
  };

  const updateSuggestion = (id: string, updates: Partial<Suggestion>) => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
  };

  const getSuggestionsByRole = (role: UserRole, userId: string): Suggestion[] => {
    const user = mockUsers.find(u => u.id === userId);

    switch (role) {
      case 'school':
        return suggestions.filter(s => s.schoolId === user?.schoolId);
      case 'principal':
        // Principal sees non-sensitive from their school
        return suggestions.filter(s => s.schoolId === user?.schoolId && s.type === 'non-sensitive');
      case 'department-leader':
      case 'specialist':
        // See sensitive suggestions for their department
        return suggestions.filter(s => s.departmentId === user?.departmentId && s.type === 'sensitive');
      case 'office':
      case 'director':
        return suggestions;
      default:
        return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        suggestions,
        addSuggestion,
        updateSuggestion,
        getSuggestionsByRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function getStatusLabel(status: SuggestionStatus): string {
  const labels: Record<SuggestionStatus, string> = {
    pending: 'Chờ tiếp nhận',
    assigned: 'Đã phân công',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    rejected: 'Kết thúc',
  };
  return labels[status];
}

export function getStatusColor(status: SuggestionStatus): string {
  const colors: Record<SuggestionStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
}