
export interface Topic {
  id: string;
  icon: string;  // Changed from React.ReactNode to string
  title: string;
  description: string;
  slug: string;
  category: 'DSA' | 'Mathematics';
  questions: Question[];
}

export interface Question {
  id: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution: string;
  hints: string[];
}
