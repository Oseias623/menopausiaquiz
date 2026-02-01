
import React, { useState } from 'react';
import { generateLandingPageContent } from '../services/geminiService';
import { LandingPageContent, Niche } from '../types';
import Icon from './Icon';

interface AIGeneratorSidebarProps {
  onContentGenerated: (content: LandingPageContent) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
}

const AIGeneratorSidebar: React.FC<AIGeneratorSidebarProps> = ({ onContentGenerated, isGenerating, setIsGenerating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [businessIdea, setBusinessIdea] = useState('');
  const [niche, setNiche] = useState<Niche>(Niche.SaaS);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!businessIdea.trim()) {
      setError("Please describe your business idea first!");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    try {
      const content = await generateLandingPageContent(businessIdea, niche);
      onContentGenerated(content);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] bg-indigo-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
      >
        <Icon name="Sparkles" size={20} />
        <span className="font-bold">Magic Generator</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3 text-indigo-600">
              <Icon name="Cpu" size={32} />
              <h2 className="text-2xl font-bold text-slate-900">AI Copywriter</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Niche</label>
              <select 
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                {Object.values(Niche).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Describe your business</label>
              <textarea 
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="Ex: A sustainable subscription box for organic coffee lovers..."
                className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none"
              />
              <p className="mt-2 text-xs text-slate-500">The more detail you provide, the better the generated landing page.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-2" />
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 shadow-lg shadow-indigo-100"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Crafting your page...</span>
                </>
              ) : (
                <>
                  <Icon name="Rocket" size={20} />
                  <span>Generate My Page</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIGeneratorSidebar;
