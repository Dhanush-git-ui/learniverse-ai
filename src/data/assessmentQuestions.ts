/**
 * Assessment questions and answer keys are served by the authenticated backend.
 * Keep this module free of question content so secrets cannot enter public assets.
 */
export interface LocalRoleQuestion {
  id: string;
  category: string;
  role?: string;
  topic: string;
  difficulty: string;
  question: string;
  options?: string[];
  correct_option?: string | null;
  explanation?: string;
  tags?: string | string[];
  marks: number;
  negative_marks?: number;
  question_type?: string;
  rubrics?: { dimension: string; marks: number; criteria: string }[];
}
