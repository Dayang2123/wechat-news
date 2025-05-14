import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Edit2, Trash2, RefreshCw, Check, X } from 'lucide-react';

interface ArticlesProps {
  navigate: (page: string) => void;
}

const Articles: React.FC<ArticlesProps> = ({ navigate }) => {
  const { articles, categories, deleteArticle, updateArticle } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter and search articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.categoryId === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'edited' && article.isEdited) ||
                          (filterStatus === 'raw' && !article.isEdited) ||
                          (filterStatus === 'spellchecked' && article.spellChecked);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleEditArticle = (articleId: string) => {
    // In a real app, we would set the current article in state and navigate to editor
    navigate('editor');
  };
  
  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(articleId);
    }
  };
  
  const handleToggleSpellCheck = (articleId: string, currentStatus: boolean) => {
    updateArticle(articleId, { spellChecked: !currentStatus });
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
        <button
          onClick={() => navigate('editor')}
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4E6E] transition-colors"
        >
          Create New
        </button>
      </div>
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
            />
          </div>
          
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
            >
              <option value="all">All Status</option>
              <option value="edited">Edited</option>
              <option value="raw">Raw</option>
              <option value="spellchecked">Spell-checked</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 mr-2">
              {filteredArticles.length} of {articles.length} articles
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArticles.map((article) => {
              const category = categories.find(c => c.id === article.categoryId);
              return (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{article.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category ? (
                      <span 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        style={{backgroundColor: `${category.color}20`, color: category.color}}
                      >
                        {category.name}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.publishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.isEdited ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Edited
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Raw
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleSpellCheck(article.id, article.spellChecked)}
                        className={`text-gray-500 hover:text-gray-900 ${article.spellChecked ? 'bg-green-100' : 'bg-gray-100'} p-1 rounded-full`}
                        title={article.spellChecked ? 'Spell-checked' : 'Not spell-checked'}
                      >
                        {article.spellChecked ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditArticle(article.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No articles found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Articles;