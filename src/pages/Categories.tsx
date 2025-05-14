import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface CategoriesProps {
  navigate: (page: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ navigate }) => {
  const { categories, addCategory, updateCategory, deleteCategory, articles } = useAppContext();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#718096' });
  
  // Calculate article counts for each category
  const categoryArticleCounts = categories.map(category => {
    const count = articles.filter(article => article.categoryId === category.id).length;
    return { ...category, articleCount: count };
  });
  
  const handleAddCategory = () => {
    if (!newCategory.name) return;
    
    addCategory({
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      order: categories.length + 1,
      articleCount: 0
    });
    
    setNewCategory({ name: '', description: '', color: '#718096' });
    setIsAddingCategory(false);
  };
  
  const handleStartEdit = (category: any) => {
    setEditingCategoryId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || '',
      color: category.color || '#718096'
    });
  };
  
  const handleSaveEdit = (categoryId: string) => {
    if (!newCategory.name) return;
    
    updateCategory(categoryId, {
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color
    });
    
    setEditingCategoryId(null);
    setNewCategory({ name: '', description: '', color: '#718096' });
  };
  
  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setNewCategory({ name: '', description: '', color: '#718096' });
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4E6E] transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Category Form */}
        {isAddingCategory && (
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-[#319795]">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Category</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                placeholder="Category name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center">
                <input
                  id="color"
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="h-10 w-10 border-0 p-0 mr-2"
                />
                <input
                  type="text"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingCategory(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#319795] text-white rounded-md hover:bg-[#2C7A7B]"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        {/* Categories */}
        {categoryArticleCounts.map((category) => (
          <div 
            key={category.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              editingCategoryId === category.id ? 'border-2 border-dashed border-[#319795]' : ''
            }`}
          >
            {editingCategoryId === category.id ? (
              <>
                <div className="mb-4">
                  <label htmlFor={`edit-name-${category.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id={`edit-name-${category.id}`}
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor={`edit-desc-${category.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id={`edit-desc-${category.id}`}
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                    rows={3}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor={`edit-color-${category.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      id={`edit-color-${category.id}`}
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="h-10 w-10 border-0 p-0 mr-2"
                    />
                    <input
                      type="text"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleSaveEdit(category.id)}
                    className="p-2 text-[#319795] hover:text-[#2C7A7B]"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h2 className="text-lg font-bold text-gray-800">{category.name}</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {category.id !== 'uncategorized' && (
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                  <span>Articles</span>
                  <span>{category.articleCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(category.articleCount || 0) / Math.max(1, articles.length) * 100}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;