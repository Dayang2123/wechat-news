import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, ArrowLeft, Check, Undo, Wand2, RefreshCcw } from 'lucide-react';

interface EditorProps {
  navigate: (page: string) => void;
}

const Editor: React.FC<EditorProps> = ({ navigate }) => {
  const { articles, categories, updateArticle, analyzeWithAI } = useAppContext();
  const [article, setArticle] = useState(articles[0] || null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [spellCheckActive, setSpellCheckActive] = useState(false);
  const [spellCheckResults, setSpellCheckResults] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setCategoryId(article.categoryId || '');
    }
  }, [article]);
  
  if (!article) {
    return (
      <div className="p-8 text-center">
        <p>No article selected. Please select an article from the articles page.</p>
        <button
          onClick={() => navigate('articles')}
          className="mt-4 px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4E6E] transition-colors"
        >
          Go to Articles
        </button>
      </div>
    );
  }

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    await analyzeWithAI(article.id);
    setIsAnalyzing(false);
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      updateArticle(article.id, {
        title,
        content,
        categoryId: categoryId || undefined,
        isEdited: true,
        lastEdited: new Date().toISOString().split('T')[0]
      });
      
      setIsSaving(false);
      alert('Article saved successfully!');
    }, 1000);
  };
  
  const handleSpellCheck = () => {
    setSpellCheckActive(true);
    
    const mockSpellCheck = () => {
      const text = content;
      const results = [
        { word: '成熟', suggestions: ['成熟', '成书'], position: { start: 120, end: 122 } },
        { word: '帮助', suggestions: ['帮助', '帮忙'], position: { start: 140, end: 142 } },
        { word: '改进', suggestions: ['改进', '改善', '提高'], position: { start: 180, end: 182 } }
      ];
      
      setSpellCheckResults(results);
    };
    
    setTimeout(mockSpellCheck, 1500);
  };
  
  const handleCancelSpellCheck = () => {
    setSpellCheckActive(false);
    setSpellCheckResults([]);
  };
  
  const applySpellCheck = () => {
    updateArticle(article.id, {
      spellChecked: true
    });
    
    setSpellCheckActive(false);
    setSpellCheckResults([]);
    alert('Spell check completed and applied!');
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('articles')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-gray-800 border-none focus:outline-none focus:ring-0 w-full max-w-lg"
            placeholder="Article Title"
          />
        </div>
        <div className="flex items-center space-x-4">
          {spellCheckActive ? (
            <>
              <button
                onClick={handleCancelSpellCheck}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={applySpellCheck}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Fixes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className={`flex items-center px-4 py-2 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-50 transition-colors ${
                  isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
              </button>
              <button
                onClick={handleSpellCheck}
                className="flex items-center px-4 py-2 border border-[#319795] text-[#319795] rounded-md hover:bg-[#319795] hover:text-white transition-colors"
              >
                <Check className="h-4 w-4 mr-2" />
                Spell Check
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-md hover:bg-[#2D4E6E] transition-colors ${
                  isSaving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {article.aiAnalysis && (
            <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">AI Analysis Results</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-purple-700">Suggested Title:</p>
                  <p className="text-sm text-purple-900">{article.aiAnalysis.suggestedTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Content Quality:</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 h-2 bg-purple-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${article.aiAnalysis.readabilityScore}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-purple-900">
                      {article.aiAnalysis.readabilityScore}/100
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Suggested Categories:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {article.aiAnalysis.suggestedCategories.map((cat, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Improvement Suggestions:</p>
                  <ul className="mt-1 space-y-1">
                    {article.aiAnalysis.contentSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-purple-900 flex items-start">
                        <span className="mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            {spellCheckActive && spellCheckResults.length > 0 ? (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-medium text-yellow-800 mb-2">Spell Check Results</h3>
                <ul className="space-y-2">
                  {spellCheckResults.map((result, index) => (
                    <li key={index} className="text-yellow-700">
                      <span className="font-medium">{result.word}</span>: Suggestions - 
                      {result.suggestions.map((suggestion, i) => (
                        <button 
                          key={i}
                          className="ml-2 px-2 py-0.5 bg-white border border-yellow-300 rounded hover:bg-yellow-100 text-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex space-x-2">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <RefreshCcw className="h-4 w-4" />
                </button>
                <div className="h-6 border-r border-gray-300 mx-1"></div>
                <button className="p-1 hover:bg-gray-200 rounded">B</button>
                <button className="p-1 hover:bg-gray-200 rounded">I</button>
                <button className="p-1 hover:bg-gray-200 rounded">U</button>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 min-h-[400px] focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                placeholder="Write your content here..."
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This editor supports basic formatting. In a full application, a rich text editor would be implemented.
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">
                Last edited: {article.lastEdited || 'Never'}
              </p>
              <p className="text-sm text-gray-500">
                {article.spellChecked ? 'Spell-checked' : 'Not spell-checked'}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('articles')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 bg-[#1A365D] text-white rounded-md hover:bg-[#2D4E6E] transition-colors ${
                  isSaving ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;