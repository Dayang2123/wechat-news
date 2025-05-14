import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, BookOpen, RefreshCw, CheckCircle } from 'lucide-react';

interface ExportProps {
  navigate: (page: string) => void;
}

const Export: React.FC<ExportProps> = ({ navigate }) => {
  const { articles, categories } = useAppContext();
  const [exportFormat, setExportFormat] = useState('doc');
  const [includeRaw, setIncludeRaw] = useState(false);
  const [includeToc, setIncludeToc] = useState(true);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    setIsExported(false);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            setIsExported(true);
          }, 500);
        }
        return newProgress;
      });
    }, 300);
  };
  
  // Group articles by category
  const articlesByCategory = categories.map(category => {
    const categoryArticles = articles.filter(article => article.categoryId === category.id);
    return {
      ...category,
      articles: categoryArticles
    };
  }).filter(category => category.articles.length > 0 || category.id === 'uncategorized');
  
  // Get uncategorized articles
  const uncategorizedArticles = articles.filter(article => !article.categoryId);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Export</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Manuscript Preview</h2>
            
            {includeToc && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Table of Contents</h3>
                <div className="border-l-2 border-gray-200 pl-4">
                  {articlesByCategory.map((category) => (
                    <div key={category.id} className="mb-3">
                      <h4 className="font-medium text-gray-800">{category.name}</h4>
                      <ul className="ml-4 mt-1 space-y-1">
                        {category.articles.map((article) => (
                          <li key={article.id} className="text-gray-600">
                            {article.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {uncategorizedArticles.length > 0 && includeRaw && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800">未分类</h4>
                      <ul className="ml-4 mt-1 space-y-1">
                        {uncategorizedArticles.map((article) => (
                          <li key={article.id} className="text-gray-600">
                            {article.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              {articlesByCategory.map((category) => (
                <div key={category.id}>
                  <h3 
                    className="text-xl font-bold mb-4 pb-2 border-b-2" 
                    style={{ borderColor: category.color || '#CBD5E0' }}
                  >
                    {category.name}
                  </h3>
                  <div className="space-y-6">
                    {category.articles.map((article) => (
                      <div key={article.id} className="border border-gray-200 rounded-md p-4">
                        <h4 className="text-lg font-bold mb-3">{article.title}</h4>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {uncategorizedArticles.length > 0 && includeRaw && (
                <div>
                  <h3 className="text-xl font-bold mb-4 pb-2 border-b-2 border-gray-300">
                    未分类
                  </h3>
                  <div className="space-y-6">
                    {uncategorizedArticles.map((article) => (
                      <div key={article.id} className="border border-gray-200 rounded-md p-4">
                        <h4 className="text-lg font-bold mb-3">{article.title}</h4>
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Export Options</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`py-2 px-3 border ${
                      exportFormat === 'doc' 
                        ? 'bg-[#1A365D] text-white border-[#1A365D]' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    } rounded-md flex items-center justify-center`}
                    onClick={() => setExportFormat('doc')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Word (.doc)</span>
                  </button>
                  <button
                    className={`py-2 px-3 border ${
                      exportFormat === 'pdf' 
                        ? 'bg-[#1A365D] text-white border-[#1A365D]' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    } rounded-md flex items-center justify-center`}
                    onClick={() => setExportFormat('pdf')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <span>PDF (.pdf)</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeToc}
                    onChange={(e) => setIncludeToc(e.target.checked)}
                    className="h-4 w-4 text-[#1A365D] focus:ring-[#1A365D] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Table of Contents</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeRaw}
                    onChange={(e) => setIncludeRaw(e.target.checked)}
                    className="h-4 w-4 text-[#1A365D] focus:ring-[#1A365D] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Uncategorized Articles</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Manuscript Stats</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Chapters</span>
                <span className="text-sm font-bold">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Articles</span>
                <span className="text-sm font-bold">{articles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Edited Articles</span>
                <span className="text-sm font-bold">{articles.filter(a => a.isEdited).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Spell-checked</span>
                <span className="text-sm font-bold">{articles.filter(a => a.spellChecked).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uncategorized</span>
                <span className="text-sm font-bold">{uncategorizedArticles.length}</span>
              </div>
            </div>
            
            <div className="mt-6">
              {isExporting ? (
                <div className="space-y-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#319795] rounded-full transition-all duration-300" 
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Exporting... {exportProgress}%
                  </p>
                </div>
              ) : isExported ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-sm font-medium text-green-600 mb-4">
                    Export complete!
                  </p>
                  <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A365D] hover:bg-[#2D4E6E] focus:outline-none"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Download {exportFormat.toUpperCase()}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleExport}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A365D] hover:bg-[#2D4E6E] focus:outline-none flex items-center justify-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Export Manuscript
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;