import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, FolderOpen, RefreshCw, BookOpen } from 'lucide-react';

interface DashboardProps {
  navigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { articles, categories, fetchArticles, categorizeArticles } = useAppContext();
  
  const articleCount = articles.length;
  const categorizedCount = articles.filter(a => a.categoryId).length;
  const editedCount = articles.filter(a => a.isEdited).length;
  const spellCheckedCount = articles.filter(a => a.spellChecked).length;
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => fetchArticles()}
            className="flex items-center px-4 py-2 bg-[#319795] text-white rounded-lg hover:bg-[#2C7A7B] transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Fetch Articles
          </button>
          <button
            onClick={() => categorizeArticles()}
            className="flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4E6E] transition-colors"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Auto-Categorize
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Articles"
          value={articleCount}
          icon={<FileText className="h-6 w-6 text-white" />}
          color="bg-[#1A365D]"
          onClick={() => navigate('articles')}
        />
        <DashboardCard
          title="Categories"
          value={categories.length}
          icon={<FolderOpen className="h-6 w-6 text-white" />}
          color="bg-[#319795]"
          onClick={() => navigate('categories')}
        />
        <DashboardCard
          title="Categorized"
          value={`${categorizedCount}/${articleCount}`}
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-[#2D4E6E]"
          onClick={() => navigate('articles')}
        />
        <DashboardCard
          title="Spell Checked"
          value={`${spellCheckedCount}/${articleCount}`}
          icon={<RefreshCw className="h-6 w-6 text-white" />}
          color="bg-[#444444]"
          onClick={() => navigate('articles')}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Articles</h2>
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.slice(0, 5).map((article) => {
                const category = categories.find(c => c.id === article.categoryId);
                return (
                  <tr key={article.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('editor')}>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {categories.map((category) => (
              <div key={category.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span 
                    className="font-medium" 
                    style={{color: category.color}}
                  >
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500">{category.articleCount} articles</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full" 
                    style={{
                      width: `${(category.articleCount || 0) / articleCount * 100}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Publishing Status</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#1A365D]">Edited</span>
                <span className="text-sm text-gray-500">{editedCount}/{articleCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#1A365D]" 
                  style={{width: `${editedCount / articleCount * 100}%`}}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#319795]">Spell Checked</span>
                <span className="text-sm text-gray-500">{spellCheckedCount}/{articleCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#319795]" 
                  style={{width: `${spellCheckedCount / articleCount * 100}%`}}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#2D4E6E]">Categorized</span>
                <span className="text-sm text-gray-500">{categorizedCount}/{articleCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#2D4E6E]" 
                  style={{width: `${categorizedCount / articleCount * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, onClick }) => {
  return (
    <div 
      className={`${color} rounded-lg shadow-lg p-6 text-white cursor-pointer transform transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="flex items-center justify-center rounded-full bg-white bg-opacity-20 h-12 w-12">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;