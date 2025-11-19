export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  GUEST = 'GUEST',
}

export type SubscriptionPlan = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE';
export type GradeLevel = 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4' | 'Form 5' | 'Form 6';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'NONE';
  subscriptionExpiry?: string; // ISO Date
  currentPlan?: SubscriptionPlan;
  unlockedLiveSessions?: string[]; // IDs of live sessions paid for
  purchasedBooks?: string[]; // IDs of books bought
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  gradeLevel: GradeLevel;
  duration: string;
  instructorId: string;
  instructorName: string;
  notesUrl?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  instructorName: string;
  startTime: string;
  platform: 'INTERNAL';
  thumbnail: string;
  isLive: boolean;
  price: number;
  recordingUrl?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  category: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
}