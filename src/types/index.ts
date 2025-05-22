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
  sentiment: 'positive' | 'negative' | 'neutral' | string; // Allow string for more flexibility
  readabilityScore: number; // 0-100, might be hard to get accurately without specific model/prompt
  suggestedTitle: string;
  // suggestedCategories?: string[]; // Comment out or remove as it's harder
  contentSuggestions: string[]; // For bullet points or raw response
  // grammarCorrections?: Array<{ original: string; suggestion: string; context?: string; reason?: string }>; // Comment out or remove
  rawResponse?: string; // Good for debugging and initial display
}

export interface AIProvider {
  name: string;
  apiKey: string;
  enabled: boolean;
}

// Navigation Event Types
export interface NavigationEventDetail {
  page: string;
  params?: Record<string, string | boolean>;
}

export type NavigateEvent = CustomEvent<NavigationEventDetail>;