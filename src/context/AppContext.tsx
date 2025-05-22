import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Article, Category, AIProvider, AIAnalysis } from '../types';
import { mockArticles, mockCategories } from '../data/mockData';
import OpenAI from 'openai';

interface AppContextType {
  isConnected: boolean;
  appId: string;
  appSecret: string;
  articles: Article[];
  categories: Category[];
  aiProviders: AIProvider[];
  connect: (appId: string, appSecret: string) => void;
  disconnect: () => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updatedArticle: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updatedCategory: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  fetchArticles: () => Promise<void>;
  categorizeArticles: () => void;
  analyzeWithAI: (articleId: string) => Promise<void>;
  updateAIProvider: (provider: AIProvider) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [aiProviders, setAIProviders] = useState<AIProvider[]>([
    { name: 'OpenAI', apiKey: '', enabled: false },
    { name: 'Anthropic', apiKey: '', enabled: false },
    { name: 'Baidu', apiKey: '', enabled: false },
  ]);

  const connect = (id: string, secret: string) => {
    setAppId(id);
    setAppSecret(secret);
    setIsConnected(true);
    setArticles(mockArticles);
    setCategories(mockCategories);
  };

  const disconnect = () => {
    setAppId('');
    setAppSecret('');
    setIsConnected(false);
    setArticles([]);
    setCategories([]);
  };

  const addArticle = (article: Article) => {
    setArticles((prev) => [...prev, article]);
  };

  const updateArticle = (id: string, updatedArticle: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, ...updatedArticle } : article
      )
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...updatedCategory } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const fetchArticles = async () => {
    setArticles((prev) => [...prev, ...mockArticles]);
    return Promise.resolve();
  };

  const categorizeArticles = () => {
    const updatedArticles = articles.map(article => {
      if (article.title.includes('技术') || article.title.includes('编程')) {
        return { ...article, categoryId: 'tech' };
      } else if (article.title.includes('市场') || article.title.includes('营销')) {
        return { ...article, categoryId: 'marketing' };
      } else if (article.title.includes('设计') || article.title.includes('UI')) {
        return { ...article, categoryId: 'design' };
      }
      return article;
    });
    
    setArticles(updatedArticles);
  };

  const analyzeWithAI = async (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) {
      console.error("Article not found for AI analysis");
      return;
    }

    const openAIProvider = aiProviders.find(p => p.name === 'OpenAI');

    if (!openAIProvider || !openAIProvider.enabled || !openAIProvider.apiKey) {
      console.log('OpenAI provider not enabled or API key not set. Falling back to mock analysis.');
      // Fallback to mock analysis (or do nothing)
      const mockAnalysis: AIAnalysis = {
        sentiment: 'neutral',
        readabilityScore: 0,
        suggestedTitle: `Mock: ${article.title}`,
        contentSuggestions: ['OpenAI not configured. This is mock data.'],
        rawResponse: 'OpenAI provider not configured. Displaying mock data.',
      };
      updateArticle(articleId, { aiAnalysis: mockAnalysis });
      return;
    }

    const openai = new OpenAI({ apiKey: openAIProvider.apiKey, dangerouslyAllowBrowser: true });

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Analyze the following article content:

"${article.content}"

Please provide the following:
1.  Suggested Title: (a concise, engaging title for this article)
2.  Readability Score: (a score from 0 to 100, where 100 is very readable)
3.  Sentiment: (positive, negative, or neutral)
4.  Content Improvement Suggestions: (3-5 bullet points for how to improve the content)

Format your response clearly with each item on a new line, like this:
Suggested Title: Your New Title Here
Readability Score: 85
Sentiment: positive
Content Improvement Suggestions:
- Suggestion 1
- Suggestion 2
- Suggestion 3`
        }],
      });

      const analysisResult = completion.choices[0]?.message?.content || "";
      
      // Basic parsing - this is fragile and depends on the AI's output format
      let suggestedTitle = article.title;
      let readabilityScore = 0;
      let sentiment: AIAnalysis['sentiment'] = 'neutral';
      let contentSuggestions: string[] = [];

      const lines = analysisResult.split('\n');
      
      const titleLine = lines.find(l => l.toLowerCase().startsWith("suggested title:"));
      if (titleLine) {
        suggestedTitle = titleLine.substring("suggested title:".length).trim();
      }

      const scoreLine = lines.find(l => l.toLowerCase().startsWith("readability score:"));
      if (scoreLine) {
        readabilityScore = parseInt(scoreLine.substring("readability score:".length).trim()) || 0;
      }
      
      const sentimentLine = lines.find(l => l.toLowerCase().startsWith("sentiment:"));
      if (sentimentLine) {
        sentiment = sentimentLine.substring("sentiment:".length).trim().toLowerCase() as AIAnalysis['sentiment'];
      }

      const suggestionsStartIndex = lines.findIndex(l => l.toLowerCase().startsWith("content improvement suggestions:"));
      if (suggestionsStartIndex !== -1) {
        contentSuggestions = lines.slice(suggestionsStartIndex + 1)
                                .filter(l => l.trim().startsWith('-'))
                                .map(l => l.trim().substring(1).trim());
      }
      
      if (contentSuggestions.length === 0 && analysisResult) {
        // If specific parsing fails, put the whole raw response as a suggestion
        contentSuggestions.push("Could not parse specific suggestions. Raw AI response below:");
        contentSuggestions.push(analysisResult);
      }


      const parsedAnalysis: AIAnalysis = {
        suggestedTitle,
        readabilityScore,
        sentiment,
        contentSuggestions,
        rawResponse: analysisResult,
      };
      updateArticle(articleId, { aiAnalysis: parsedAnalysis });

    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      const errorAnalysis: AIAnalysis = {
        sentiment: 'neutral',
        readabilityScore: 0,
        suggestedTitle: article.title,
        contentSuggestions: ['Error during AI analysis. Please check console.'],
        rawResponse: error instanceof Error ? error.message : String(error),
      };
      updateArticle(articleId, { aiAnalysis: errorAnalysis });
    }
  };

  const updateAIProvider = (provider: AIProvider) => {
    setAIProviders(prev => 
      prev.map(p => p.name === provider.name ? provider : p)
    );
  };

  const value = {
    isConnected,
    appId,
    appSecret,
    articles,
    categories,
    aiProviders,
    connect,
    disconnect,
    addArticle,
    updateArticle,
    deleteArticle,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchArticles,
    categorizeArticles,
    analyzeWithAI,
    updateAIProvider,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};