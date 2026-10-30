import { getAuthHeaders } from '../utils/apiAuth';
import { AdminAssessment, QuestionItem } from '../types/adminAssessment';

const BASE = '/api/admin/question-bank';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: getAuthHeaders({ 'Content-Type': 'application/json', ...(init.headers as Record<string, string> | undefined) }),
  });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      detail = body.detail || detail;
    } catch {
      // Keep the status-based message when the backend does not return JSON.
    }
    if (response.status === 401) {
      localStorage.removeItem('learniverse_token');
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export interface QuestionBankFilters {
  search?: string;
  category?: string;
  topic?: string;
  difficulty?: string;
  questionType?: string;
  company?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface QuestionBankPage {
  items: QuestionItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface QuestionBankFacets {
  categories: Array<{ value: string }>;
  topics: Array<{ value: string }>;
  question_types: Array<{ value: string }>;
  companies: Array<{ value: string; name: string }>;
  roles: Array<{ value: string; name: string }>;
}

export async function getAdminQuestionPage(filters: QuestionBankFilters): Promise<QuestionBankPage> {
  const params = new URLSearchParams();
  const values: Record<string, string | number | undefined> = {
    search: filters.search,
    category: filters.category,
    topic: filters.topic,
    difficulty: filters.difficulty,
    question_type: filters.questionType,
    company: filters.company,
    role: filters.role,
    status: filters.status,
    page: filters.page,
    page_size: filters.pageSize,
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const result = await request<Omit<QuestionBankPage, 'items'> & { items: Array<Record<string, unknown>> }>(`/questions?${params.toString()}`);
  return {
    ...result,
    items: result.items.map((row) => ({
      id: String(row.id),
      prompt: String(row.question || ''),
      topic: String(row.topic || 'General'),
      subTopic: String(row.subtopic || row.topic || 'General'),
      difficulty: (String(row.difficulty || 'Medium').replace(/^./, c => c.toUpperCase()) as QuestionItem['difficulty']),
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : String(row.tags || ''),
      options: Array.isArray(row.options) ? row.options.map(String) : [],
      correctAnswer: row.correct_option ? String(row.correct_option) : undefined,
      explanation: row.explanation ? String(row.explanation) : undefined,
      optionExplanations: Array.isArray(row.option_explanations) ? row.option_explanations.map(String) : undefined,
      questionType: String(row.question_type || 'mcq'),
      company: Array.isArray(row.companies) ? row.companies.join(', ') : undefined,
      role: Array.isArray(row.roles) ? row.roles.join(', ') : undefined,
      provenance: row.provenance ? String(row.provenance) : undefined,
      source: row.source ? String(row.source) : undefined,
      verificationStatus: row.verification_status ? String(row.verification_status) : undefined,
      structuralStatus: row.structural_status ? String(row.structural_status) : undefined,
      answerStatus: row.answer_status ? String(row.answer_status) : undefined,
      sourceStatus: row.source_status ? String(row.source_status) : undefined,
      expertReviewStatus: row.expert_review_status ? String(row.expert_review_status) : undefined,
      verificationEvidence: row.verification_evidence ? String(row.verification_evidence) : undefined,
      reviewStatus: String(row.review_status || 'Pending Review') as QuestionItem['reviewStatus'],
      library: 'Learniverse Question Bank',
      inputFormat: row.input_format ? String(row.input_format) : undefined,
      outputFormat: row.output_format ? String(row.output_format) : undefined,
      constraints: row.constraints_text ? String(row.constraints_text) : undefined,
      sampleExplanation: row.sample_explanation ? String(row.sample_explanation) : undefined,
      examples: Array.isArray(row.examples) ? row.examples : undefined,
      testCases: Array.isArray(row.test_cases) ? row.test_cases : undefined,
      referenceSolution: row.reference_solution ? String(row.reference_solution) : undefined,
      timeComplexity: row.time_complexity ? String(row.time_complexity) : undefined,
      spaceComplexity: row.space_complexity ? String(row.space_complexity) : undefined,
      supportedLanguages: Array.isArray(row.supported_languages) ? row.supported_languages.map(String) : undefined,
    })) as QuestionBankPage['items'],
  };
}

export const getQuestionBankFacets = () => request<QuestionBankFacets>('/facets');

export const reviewQuestion = (questionId: string, status: string, note: string, evidence?: string) =>
  request<{ question_id: string; review_status: string }>(`/questions/${encodeURIComponent(questionId)}/review`, {
    method: 'PATCH',
    body: JSON.stringify(status === 'Approved'
      ? { status, note, structural_status: 'Structurally Validated', answer_status: 'Answer Verified', expert_review_status: 'Expert Reviewed', evidence }
      : { status, note }),
  });

export const listTrainerTests = () => request<{ items: AdminAssessment[] }>('/tests');

export const saveTrainerTest = (assessment: AdminAssessment) =>
  request<{ id: string; question_count: number }>(`/tests/${encodeURIComponent(assessment.id)}`, {
    method: 'PUT',
    body: JSON.stringify(assessment),
  });

export const deleteTrainerTest = (testId: string) =>
  request<{ deleted: boolean }>(`/tests/${encodeURIComponent(testId)}`, { method: 'DELETE' });

export const saveQuestionCollection = (name: string, questionIds: string[], description = '') =>
  request<{ collection_id: string; question_count: number }>('/collections', {
    method: 'POST',
    body: JSON.stringify({ name, description, question_ids: questionIds }),
  });

export const listQuestionCollections = () =>
  request<{ items: Array<{ collection_id: string; name: string; description: string; question_count: number }> }>('/collections');
