export type SectionType = 
  | 'MCQ' 
  | 'Coding' 
  | 'SQL' 
  | 'Textual' 
  | 'Web Coding' 
  | 'Fill in the Blank' 
  | 'Audio' 
  | 'Communication';

export interface QuestionBreakdownItem {
  id: string;
  topic: string;
  subTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string;
  count: number;
}

export interface AssessmentSection {
  id: string;
  name: string;
  type: SectionType;
  timeLimit: number; // in minutes
  questionsCount: number;
  score: number;
  questionBreakdown: QuestionBreakdownItem[];
  selectedQuestionIds?: string[];
}

export interface AdminAssessment {
  id: string;
  title: string;
  roleName?: string;
  publishedOn: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  totalTime: number; // in minutes
  status: 'In Progress' | 'Draft' | 'Completed' | 'Upcoming';
  sections: AssessmentSection[];
  createdBy?: string;
}

export interface RoleTemplate {
  id: string;
  title: string;
  sectionsCount: number;
  experience: string;
  description?: string;
  sections: AssessmentSection[];
}

export interface QuestionItem {
  id: string;
  prompt: string;
  topic: string;
  subTopic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  library?: 'Learniverse Question Bank' | 'My Questions';
  createdAt?: string;
}
