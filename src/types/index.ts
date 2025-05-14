export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  url: string;
  categoryId?: string;
  isEdited: boolean;
  lastEdited?: string;
  spellChecked: boolean;
  aiAnalysis?: AIAnalysis;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  articleCount?: number;
  color?: string;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  readabilityScore: number;
  suggestedTitle?: string;
  suggestedCategories: string[];
  grammarCorrections: GrammarCorrection[];
  contentSuggestions: string[];
}

export interface GrammarCorrection {
  original: string;
  suggestion: string;
  context: string;
  reason: string;
}

export interface AIProvider {
  name: string;
  apiKey: string;
  enabled: boolean;
}