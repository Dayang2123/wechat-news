import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Article, Category, AIProvider } from '../types';
import { mockArticles, mockCategories } from '../data/mockData';

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
    if (!article) return;

    // Simulate AI analysis
    const mockAnalysis = {
      sentiment: 'positive' as const,
      readabilityScore: 85,
      suggestedTitle: `改进: ${article.title}`,
      suggestedCategories: ['tech', 'tutorial'],
      grammarCorrections: [
        {
          original: '成熟',
          suggestion: '成书',
          context: '...帮助读者更好地理解和掌握...',
          reason: '在此上下文中，"成书"更符合文章主题'
        }
      ],
      contentSuggestions: [
        '考虑添加更多实际案例',
        '建议增加图表说明',
        '可以补充相关参考资料'
      ]
    };

    // Update article with AI analysis
    updateArticle(articleId, { aiAnalysis: mockAnalysis });
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