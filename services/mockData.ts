import { CourseCategory, Lesson, LiveSession, User, UserRole, Book, Job } from '../types';

export const CATEGORIES: CourseCategory[] = [
  { id: 'math', name: 'Mathematics', icon: '📐' },
  { id: 'eng', name: 'English', icon: '📚' },
  { id: 'chi', name: 'Chichewa', icon: '🇲🇼' },
  { id: 'chem', name: 'Chemistry', icon: '🧪' },
  { id: 'phy', name: 'Physics', icon: '⚛️' },
  { id: 'agri', name: 'Agriculture', icon: '🌱' },
  { id: 'bio', name: 'Biology', icon: '🧬' },
  { id: 'hist', name: 'History', icon: '📜' },
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '101',
    title: 'Algebraic Expressions',
    description: 'Introduction to algebra for Form 1 students.',
    videoUrl: 'https://www.youtube.com/embed/dpw9EHDh2bM', 
    thumbnail: 'https://picsum.photos/seed/math/400/225',
    category: 'Mathematics',
    gradeLevel: 'Form 1',
    duration: '15:30',
    instructorId: 't1',
    instructorName: 'Dr. Sarah Smith',
    notesUrl: '#'
  },
  {
    id: '102',
    title: 'Forces and Motion',
    description: 'Newton laws of motion explained clearly.',
    videoUrl: 'https://www.youtube.com/embed/7UK25Vze0p8',
    thumbnail: 'https://picsum.photos/seed/physics/400/225',
    category: 'Physics',
    gradeLevel: 'Form 3',
    duration: '45:00',
    instructorId: 't2',
    instructorName: 'Prof. Alan Grant',
    notesUrl: '#'
  },
  {
    id: '103',
    title: 'Photosynthesis Process',
    description: 'Understanding how plants make food.',
    videoUrl: 'https://www.youtube.com/embed/q4sP9h8t2y0',
    thumbnail: 'https://picsum.photos/seed/bio/400/225',
    category: 'Biology',
    gradeLevel: 'Form 4',
    duration: '32:15',
    instructorId: 't1',
    instructorName: 'Dr. Sarah Smith',
    notesUrl: '#'
  },
  {
    id: '104',
    title: 'Malawi History: Independence',
    description: 'The journey to 1964.',
    videoUrl: 'https://www.youtube.com/embed/S5n9aV_8DYE',
    thumbnail: 'https://picsum.photos/seed/hist/400/225',
    category: 'History',
    gradeLevel: 'Form 2',
    duration: '28:50',
    instructorId: 't3',
    instructorName: 'Mr. Banda',
    notesUrl: '#'
  },
  {
    id: '105',
    title: 'Sustainable Farming',
    description: 'Modern agricultural practices in Malawi.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    thumbnail: 'https://picsum.photos/seed/agri/400/225',
    category: 'Agriculture',
    gradeLevel: 'Form 3',
    duration: '40:00',
    instructorId: 't3',
    instructorName: 'Mr. Banda',
    notesUrl: '#'
  }
];

export const UPCOMING_LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'live1',
    title: 'Form 4 Math Exam Prep',
    instructorName: 'Dr. Sarah Smith',
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    platform: 'INTERNAL',
    thumbnail: 'https://picsum.photos/seed/live1/400/225',
    isLive: true,
    price: 500
  },
  {
    id: 'live2',
    title: 'Chichewa Literature Review',
    instructorName: 'Mr. Phiri',
    startTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    platform: 'INTERNAL',
    thumbnail: 'https://picsum.photos/seed/live2/400/225',
    isLive: false,
    price: 500
  },
  {
    id: 'rec1',
    title: 'Biology: Digestive System (Recorded)',
    instructorName: 'Dr. Sarah Smith',
    startTime: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    platform: 'INTERNAL',
    thumbnail: 'https://picsum.photos/seed/rec1/400/225',
    isLive: false,
    price: 200,
    recordingUrl: 'https://www.youtube.com/embed/q4sP9h8t2y0' // Mock recording
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Advanced Mathematics for Form 4',
    author: 'S. J. Chilimampunga',
    price: 5000,
    coverUrl: 'https://picsum.photos/seed/book1/200/300',
    category: 'Mathematics',
    description: 'Comprehensive guide covering algebra, geometry, and calculus basics.'
  },
  {
    id: 'b2',
    title: 'Malawi Agriculture Handbook',
    author: 'Ministry of Education',
    price: 3500,
    coverUrl: 'https://picsum.photos/seed/book2/200/300',
    category: 'Agriculture',
    description: 'Essential reading for agriculture students in secondary school.'
  },
  {
    id: 'b3',
    title: 'Physics Principles',
    author: 'A. Einstein (Adapted)',
    price: 4500,
    coverUrl: 'https://picsum.photos/seed/book3/200/300',
    category: 'Physics',
    description: 'Fundamental principles of physics with local examples.'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Mathematics Teacher',
    department: 'Education',
    location: 'Lilongwe / Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Mathematics teacher to conduct live sessions and create video content.',
    requirements: ['Bachelor degree in Education or Mathematics', '3+ years teaching experience', 'Comfortable with camera and technology']
  },
  {
    id: 'j2',
    title: 'Content Reviewer - Science',
    department: 'Quality Assurance',
    location: 'Blantyre',
    type: 'Part-time',
    description: 'Review uploaded Physics and Chemistry lessons for accuracy and curriculum alignment.',
    requirements: ['Background in Physical Sciences', 'Attention to detail', 'Previous marking experience preferred']
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 's1',
    name: 'John Student',
    email: 'student@smartlearn.mw',
    role: UserRole.STUDENT,
    avatar: 'https://ui-avatars.com/api/?name=John+Student&background=0D8ABC&color=fff',
    subscriptionStatus: 'ACTIVE',
    subscriptionExpiry: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days left
    currentPlan: 'WEEKLY',
    unlockedLiveSessions: [],
    purchasedBooks: []
  },
  {
    id: 't1',
    name: 'Dr. Sarah Smith',
    email: 'teacher@smartlearn.mw',
    role: UserRole.TEACHER,
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random',
    subscriptionStatus: 'ACTIVE',
    unlockedLiveSessions: [],
    purchasedBooks: []
  },
  // ADMIN USER - Hardcoded for system access
  {
    id: 'admin_main',
    name: 'Smartlearn Admin',
    email: 'support@smartlearn.com',
    role: UserRole.ADMIN as any, // Type casting if enum wasn't updated yet, though I updated types below
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
    subscriptionStatus: 'ACTIVE',
    unlockedLiveSessions: [],
    purchasedBooks: []
  }
];