
import React, { useState } from 'react';
import { Product } from '../types';
import { getProductAdvice } from '../services/geminiService';

interface AIAssistantProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await getProductAdvice(prompt, products);
      setResponse(res || "لم أستطع معالجة طلبك حالياً، حاول مرة أخرى.");
    } catch (error) {
      setResponse("حدث خطأ أثناء التواصل مع المساعد الذكي.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="font-bold">المساعد الذكي - عالم بلاستك</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-grow p-4 max-h-96 overflow-y-auto bg-slate-50 space-y-4 no-scrollbar">
            {response ? (
              <div className="bg-white p-4 rounded-xl border border-blue-100 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {response}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">أنا هنا لمساعدتك في اختيار أنسب المنتجات البلاستيكية لك أو لمشروعك.</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                   {['أريد طقم عشاء', 'أسعار الجملة', 'أكياس تسوق'].map(q => (
                     <button key={q} onClick={() => setPrompt(q)} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100">
                       {q}
                     </button>
                   ))}
                </div>
              </div>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
                 <div className="w-4 h-4 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
                 جاري التفكير...
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="اسأل المساعد..."
                className="flex-grow bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              />
              <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition active:scale-95 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-transparent group-hover:opacity-0 transition"></div>
        <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </button>
    </div>
  );
};

export default AIAssistant;
