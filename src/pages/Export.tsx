import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, BookOpen, CheckCircle } from 'lucide-react';
import htmlToDocx from 'html-to-docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0); // Reset progress
    setIsExported(false);

    if (exportFormat === 'pdf') {
      const elementToCapture = document.getElementById('pdf-content-to-export');
      if (!elementToCapture) {
        alert("Error: PDF content element not found.");
        setIsExporting(false);
        return;
      }

      // Simulate progress for UI feedback
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        setExportProgress(Math.min(currentProgress, 90)); // Simulate up to 90% for canvas capture
        if (currentProgress >= 90) clearInterval(progressInterval);
      }, 100);

      try {
        const canvas = await html2canvas(elementToCapture, {
          scale: 2, // Higher scale for better quality
          useCORS: true, // If images from other domains are present
          logging: true, // Enable logging for debugging
          width: elementToCapture.scrollWidth, // Use scrollWidth for full content width
          height: elementToCapture.scrollHeight, // Use scrollHeight for full content height
          windowWidth: elementToCapture.scrollWidth,
          windowHeight: elementToCapture.scrollHeight,
        });
        
        clearInterval(progressInterval); // Stop simulation
        setExportProgress(95); // Mark canvas capture complete

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'l' : 'p', // landscape or portrait
          unit: 'px',
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('wechat-publisher-export.pdf');
        
        setExportProgress(100);
        setIsExported(true);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. See console for details. Ensure no tainted canvases (e.g. cross-origin images without CORS).");
        setExportProgress(0);
      } finally {
        setIsExporting(false);
      }
      return; // End PDF export path
    }

    // DOCX Export Logic (existing)
    let htmlString = '<html><head><meta charset="UTF-8"><title>WeChat Publisher Export</title></head><body>';
    htmlString += '<h1>WeChat Publisher Export</h1>';

    // Helper to sanitize IDs for HTML attributes
    const sanitizeId = (str: string) => str.replace(/[^a-zA-Z0-9-_]/g, '');

    if (includeToc) {
      htmlString += '<h2>Table of Contents</h2><ul>';
      articlesByCategory.forEach(category => {
        if (category.articles.length > 0) {
          htmlString += `<li><a href="#category-${sanitizeId(category.id)}">${category.name}</a><ul>`;
          category.articles.forEach(article => {
            htmlString += `<li><a href="#article-${sanitizeId(article.id)}">${article.title}</a></li>`;
          });
          htmlString += '</ul></li>';
        }
      });
      if (includeRaw && uncategorizedArticles.length > 0) {
        htmlString += `<li><a href="#category-uncategorized">Uncategorized</a><ul>`;
        uncategorizedArticles.forEach(article => {
          htmlString += `<li><a href="#article-${sanitizeId(article.id)}">${article.title}</a></li>`;
        });
        htmlString += '</ul></li>';
      }
      htmlString += '</ul><br style="page-break-after: always;"/>'; // Page break after TOC
    }

    articlesByCategory.forEach(category => {
      if (category.articles.length > 0) {
        htmlString += `<h2 id="category-${sanitizeId(category.id)}">${category.name}</h2>`;
        category.articles.forEach(article => {
          htmlString += `<h3 id="article-${sanitizeId(article.id)}">${article.title}</h3>`;
          htmlString += article.content; // article.content is already HTML
          htmlString += '<br style="page-break-after: always;"/>'; // Page break after each article
        });
      }
    });

    if (includeRaw && uncategorizedArticles.length > 0) {
      htmlString += `<h2 id="category-uncategorized">Uncategorized</h2>`;
      uncategorizedArticles.forEach(article => {
        htmlString += `<h3 id="article-${sanitizeId(article.id)}">${article.title}</h3>`;
        htmlString += article.content;
        htmlString += '<br style="page-break-after: always;"/>'; // Page break after each article
      });
    }
    htmlString += '</body></html>';

    // Simulate progress for UI feedback, actual generation might be quick or slow
    const progressInterval = setInterval(() => {
      setExportProgress(prev => Math.min(prev + 20, 80)); // Simulate up to 80%
    }, 200);

    try {
      const fileBuffer = await htmlToDocx(htmlString, null, {
        table: { row: { cantSplit: true } }, // Example option
        footer: true,
        pageNumber: true,
      });
      clearInterval(progressInterval);
      setExportProgress(100);
      saveAs(fileBuffer as Blob, 'wechat-publisher-export.docx'); // Cast to Blob
      setIsExported(true);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error generating DOCX:", error);
      alert("Error generating DOCX. Please check console for details.");
      setExportProgress(0); // Reset progress
    } finally {
      setIsExporting(false);
    }
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
      {/* Hidden content for PDF export */}
      <div 
        id="pdf-content-to-export" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px', 
          width: '800px', // A4-like width, adjust as needed
          padding: '20px', 
          background: 'white',
          fontFamily: 'Arial, sans-serif', // Ensure consistent font
        }}
      >
        <h1 style={{fontSize: '24pt', textAlign: 'center', marginBottom: '20px'}}>WeChat Publisher Export</h1>
        {includeToc && (
          <div className="mb-6">
            <h2 style={{fontSize: '18pt', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '15px'}}>Table of Contents</h2>
            <ul style={{listStyle: 'none', paddingLeft: '0'}}>
              {articlesByCategory.map((category) => (
                category.articles.length > 0 && (
                  <li key={`toc-cat-${category.id}`} style={{marginBottom: '10px'}}>
                    <h3 style={{fontSize: '14pt', fontWeight: 'bold'}}>{category.name}</h3>
                    <ul style={{listStyle: 'disc', paddingLeft: '20px', marginTop: '5px'}}>
                      {category.articles.map((article) => (
                        <li key={`toc-art-${article.id}`} style={{fontSize: '12pt', marginBottom: '5px'}}>
                          {article.title}
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              ))}
              {uncategorizedArticles.length > 0 && includeRaw && (
                <li style={{marginBottom: '10px'}}>
                  <h3 style={{fontSize: '14pt', fontWeight: 'bold'}}>Uncategorized</h3>
                  <ul style={{listStyle: 'disc', paddingLeft: '20px', marginTop: '5px'}}>
                    {uncategorizedArticles.map((article) => (
                      <li key={`toc-art-uncat-${article.id}`} style={{fontSize: '12pt', marginBottom: '5px'}}>
                        {article.title}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        )}
        {articlesByCategory.map((category) => (
          category.articles.length > 0 && (
            <div key={`pdf-cat-${category.id}`} style={{marginBottom: '20px', pageBreakBefore: includeToc ? 'always' : undefined }}>
              <h2 style={{fontSize: '18pt', color: category.color || '#000000', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '15px'}}>{category.name}</h2>
              {category.articles.map((article) => (
                <div key={`pdf-art-${article.id}`} style={{marginBottom: '15px', pageBreakInside: 'avoid'}}>
                  <h3 style={{fontSize: '14pt', fontWeight: 'bold', marginBottom: '10px'}}>{article.title}</h3>
                  {/* For PDF, ensure content is rendered directly, not relying on prose-* classes if they affect html2canvas */}
                  <div dangerouslySetInnerHTML={{ __html: article.content.replace(/class="[^"]*"/g, '') }} />
                </div>
              ))}
            </div>
          )
        ))}
        {uncategorizedArticles.length > 0 && includeRaw && (
          <div style={{marginBottom: '20px', pageBreakBefore: 'always'}}>
            <h2 style={{fontSize: '18pt', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '15px'}}>Uncategorized</h2>
            {uncategorizedArticles.map((article) => (
              <div key={`pdf-art-uncat-${article.id}`} style={{marginBottom: '15px', pageBreakInside: 'avoid'}}>
                <h3 style={{fontSize: '14pt', fontWeight: 'bold', marginBottom: '10px'}}>{article.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/class="[^"]*"/g, '') }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visible UI */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Export</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6"> {/* This is the visible preview */}
            <h2 className="text-lg font-bold text-gray-800 mb-4">Manuscript Preview</h2>
            {includeToc && (
              <div className="mb-6"> {/* Visible TOC Preview */}
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
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-green-600 mb-4">
                    Export Successful!
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Your {exportFormat.toUpperCase()} file has been generated and download should have started.
                  </p>
                  <button
                    onClick={() => { setIsExported(false); setExportProgress(0); }}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Export Another
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A365D] hover:bg-[#2D4E6E] focus:outline-none flex items-center justify-center disabled:opacity-50"
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