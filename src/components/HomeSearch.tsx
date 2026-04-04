import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Loader2, Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export const MARKET_DATA = {
// ... (rest of MARKET_DATA remains same)
  Indices: [
    { name: 'S&P 500', path: '/market/indices/sp500' },
    { name: 'NASDAQ 100', path: '/market/indices/nasdaq100' },
    { name: 'Dow Jones', path: '/market/indices/dowjones' },
    { name: 'FTSE 100', path: '/market/indices/ftse100' },
    { name: 'DAX', path: '/market/indices/dax' },
    { name: 'Nikkei 225', path: '/market/indices/nikkei225' },
  ],
  Stocks: [
    { name: 'Apple', path: '/market/stocks/aapl' },
    { name: 'Tesla', path: '/market/stocks/tsla' },
    { name: 'Google', path: '/market/stocks/googl' },
    { name: 'Meta', path: '/market/stocks/meta' },
    { name: 'Amazon', path: '/market/stocks/amzn' },
  ],
  Crypto: [
    { name: 'Bitcoin', path: '/market/crypto/btc' },
    { name: 'Ethereum', path: '/market/crypto/eth' },
    { name: 'Solana', path: '/market/crypto/sol' },
    { name: 'BNB', path: '/market/crypto/bnb' },
  ],
  Futures: [
    { name: 'Gold', path: '/market/futures/gold' },
    { name: 'Oil', path: '/market/futures/oil' },
    { name: 'Silver', path: '/market/futures/silver' },
  ],
  Forex: [
    { name: 'EURUSD', path: '/market/forex/eurusd' },
    { name: 'GBPUSD', path: '/market/forex/gbpusd' },
    { name: 'USDJPY', path: '/market/forex/usdjpy' },
    { name: 'AUDUSD', path: '/market/forex/audusd' },
    { name: 'USDCAD', path: '/market/forex/usdcad' },
  ],
};

export const BROKERS = [
  { name: 'Capital.com', url: 'https://capital.com' },
  { name: 'EasyMarkets', url: 'https://www.easymarkets.com' },
  { name: 'Trade Nation', url: 'https://tradenation.com' },
  { name: 'IC Markets', url: 'https://www.icmarkets.com' },
  { name: 'Exness', url: 'https://tinyurl.com/5bpsydys' },
  { name: 'Headway', url: 'https://tinyurl.com/2238avph' },
];

export const PRODUCTS = [
  { name: 'Global News', path: '/products/global-news' },
  { name: 'Fundamental Graphs', path: '/products/fundamental-graphs' },
];

export default function HomeSearch({ variant = 'default' }: { variant?: 'default' | 'header' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'products' | 'brokers' | 'ai'>('market');
  const [activeMarketCategory, setActiveMarketCategory] = useState<string | null>(null);
  
  // AI Search States
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showAiModal && modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  }, [aiResponse, isLoading, chatHistory, showAiModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
        setActiveMarketCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAiSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowAiModal(true);
    setIsPanelOpen(false);
    setLastQuery(query);

    try {
      // 1. Fetch system instruction/context from backend
      const contextRes = await axios.get('/api/ai/context');
      const { systemInstruction } = contextRes.data;

      // 2. Check for API key
      let apiKey: string | undefined;
      try {
        apiKey = (process.env as any).GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      } catch (e) {
        apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
      
      // If no key in env, check if user needs to select one
      if (!apiKey && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
          // After opening, we assume they selected it and it will be in process.env on next try
          // or we can try to get it again if the platform injects it immediately
          apiKey = (process.env as any).GEMINI_API_KEY;
        }
      }

      if (!apiKey) {
        throw new Error('Gemini API key is not available. Please ensure you have selected an API key in the settings.');
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction
        },
        history: chatHistory
      });

      // 3. Send message
      const response = await chat.sendMessage({ message: query });
      const text = response.text;
      
      setAiResponse(text);
      setChatHistory(await chat.getHistory());
    } catch (err: any) {
      console.error('AI Search Error:', err);
      let message = 'Failed to get AI response. Please try again.';
      
      // Handle specific Gemini API errors
      const errorText = err.message || '';
      if (errorText.includes('API key not valid') || errorText.includes('INVALID_ARGUMENT')) {
        message = 'Invalid or missing API key. Please ensure you have selected a valid Gemini API key in the settings.';
      } else if (errorText.includes('quota')) {
        message = 'API quota exceeded. Please try again later or use a different API key.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (errorText) {
        message = errorText;
      }
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleAiSearch(searchQuery);
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setAiResponse(null);
    setError(null);
  };

  const handleCopyResponse = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse);
    }
  };

  const isHeader = variant === 'header';

  return (
    <div className={`${isHeader ? 'w-full max-w-[120px] sm:max-w-[180px]' : 'w-full max-w-3xl mx-auto my-12'} relative z-50 flex flex-col items-center`} ref={dropdownRef}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="w-full relative">
        <div className="relative flex items-center w-full">
          <Search className={`absolute left-2.5 w-3.5 h-3.5 text-text-muted`} />
          <input
            type="text"
            placeholder={isHeader ? "Search" : "Ask AI anything or search markets..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-12 ${isHeader ? 'py-1.5 text-xs' : 'py-4'} bg-bg-secondary border border-border-light text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all shadow-sm`}
            style={{ borderRadius: '8px' }}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery.trim() && !isHeader && (
              <button
                type="submit"
                className="p-1.5 text-accent-primary hover:bg-accent-primary/10 rounded-full transition-colors"
                title="Ask AI"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
            {!isHeader && (
              <button
                type="button"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="p-1 text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* AI Search Modal/Panel */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 sm:inset-auto sm:absolute sm:top-full sm:left-0 sm:mt-4 w-full sm:max-w-3xl bg-bg-secondary border border-border-light shadow-2xl z-[100] flex flex-col overflow-hidden"
            style={{ borderRadius: '12px', height: 'min(600px, 80vh)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light bg-bg-hover/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-accent-primary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">CGA AI Assistant</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Powered by Gemini 3</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {chatHistory.length > 0 && (
                  <button 
                    onClick={handleClearChat}
                    className="p-2 hover:bg-bg-hover rounded-full transition-colors text-text-muted hover:text-red-500"
                    title="Clear Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => setShowAiModal(false)}
                  className="p-2 hover:bg-bg-hover rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div ref={modalContentRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
              {/* User Query */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-accent-primary text-black px-4 py-2 rounded-2xl rounded-tr-none shadow-sm">
                  <p className="text-sm font-medium">{lastQuery}</p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-bg-hover/30 border border-border-light p-5 rounded-2xl rounded-tl-none shadow-sm relative group">
                  {isLoading ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-text-muted">
                        <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                        <span className="text-sm font-medium animate-pulse">Analyzing your request...</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-bg-hover rounded animate-pulse" />
                        <div className="h-2 w-3/4 bg-bg-hover rounded animate-pulse" />
                        <div className="h-2 w-1/2 bg-bg-hover rounded animate-pulse" />
                      </div>
                    </div>
                  ) : error ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                        {error}
                      </div>
                      {(error.includes('API key') || error.includes('Invalid API key')) && (window as any).aistudio && (
                        <button
                          onClick={async () => {
                            await (window as any).aistudio.openSelectKey();
                            handleAiSearch(lastQuery);
                          }}
                          className="w-full py-2 bg-accent-primary text-black font-bold rounded-lg hover:bg-accent-primary/90 transition-colors text-sm"
                        >
                          Select API Key
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="prose prose-invert prose-sm max-w-none text-text-primary">
                        <Markdown>{aiResponse || ''}</Markdown>
                      </div>
                      {aiResponse && (
                        <button 
                          onClick={handleCopyResponse}
                          className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-secondary border border-border-light rounded-md text-text-muted hover:text-accent-primary"
                          title="Copy to clipboard"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Suggested Questions (only if no response yet or after clear) */}
              {!aiResponse && !isLoading && !error && (
                <div className="space-y-3">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Suggested Questions</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What are the available investment plans?",
                      "How do I start trading crypto?",
                      "What is the S&P 500 current status?",
                      "How can I contact support?"
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAiSearch(q)}
                        className="text-xs px-3 py-2 bg-bg-secondary border border-border-light hover:border-accent-primary hover:text-accent-primary rounded-lg transition-all text-text-primary"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up History (Simplified) */}
              {chatHistory.length > 2 && (
                <div className="pt-4 border-t border-border-light">
                  <p className="text-[10px] text-text-muted uppercase mb-3 font-bold">Recent Conversation</p>
                  <div className="space-y-3">
                    {chatHistory.slice(-4, -2).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] text-xs px-3 py-1.5 rounded-xl ${msg.role === 'user' ? 'bg-accent-primary/20 text-text-primary' : 'bg-bg-hover/50 text-text-muted'}`}>
                          {msg.parts[0].text.substring(0, 100)}{msg.parts[0].text.length > 100 ? '...' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Input for Follow-up */}
            <div className="p-4 border-t border-border-light bg-bg-hover/20">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('followup') as HTMLInputElement;
                  if (input.value.trim()) {
                    handleAiSearch(input.value);
                    input.value = '';
                  }
                }}
                className="relative"
              >
                <input
                  name="followup"
                  type="text"
                  placeholder="Ask a follow-up question..."
                  className="w-full pl-4 pr-12 py-3 bg-bg-secondary border border-border-light rounded-xl text-sm focus:outline-none focus:border-accent-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Panel - Only show in default variant or if explicitly allowed */}
      {!isHeader && isPanelOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-bg-secondary border border-border-light shadow-lg overflow-hidden z-50 flex flex-col" style={{ borderRadius: '10px' }}>
          {/* Tabs */}
          <div className="flex border-b border-border-light">
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'market' ? 'bg-bg-hover text-accent-primary border-b-2 border-accent-primary' : 'text-text-primary hover:bg-bg-hover'}`}
              onClick={() => { setActiveTab('market'); setActiveMarketCategory(null); }}
            >
              Market
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'products' ? 'bg-bg-hover text-accent-primary border-b-2 border-accent-primary' : 'text-text-primary hover:bg-bg-hover'}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'brokers' ? 'bg-bg-hover text-accent-primary border-b-2 border-accent-primary' : 'text-text-primary hover:bg-bg-hover'}`}
              onClick={() => setActiveTab('brokers')}
            >
              Brokers
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {activeTab === 'market' && (
              <div>
                {!activeMarketCategory ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(MARKET_DATA).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveMarketCategory(category)}
                        className="w-full text-left px-4 py-3 hover:bg-bg-hover text-text-primary font-medium flex justify-between items-center rounded-md"
                      >
                        {category}
                        <ChevronDown className="w-4 h-4 -rotate-90 text-text-muted" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setActiveMarketCategory(null)}
                      className="w-full text-left px-4 py-3 hover:bg-bg-hover text-text-muted font-medium flex items-center gap-2 border-b border-border-light mb-2 rounded-md"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" /> Back to Categories
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      {MARKET_DATA[activeMarketCategory as keyof typeof MARKET_DATA].map((instrument) => (
                        <button
                          key={instrument.name}
                          onClick={() => {
                            navigate(instrument.path);
                            setIsPanelOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-bg-hover text-text-primary rounded-md"
                        >
                          {instrument.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid grid-cols-1 gap-2">
                {PRODUCTS.map((product) => (
                  <button
                    key={product.name}
                    onClick={() => {
                      navigate(product.path);
                      setIsPanelOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-bg-hover text-text-primary font-medium rounded-md"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'brokers' && (
              <div className="grid grid-cols-2 gap-2">
                {BROKERS.map((broker) => (
                  <a
                    key={broker.name}
                    href={broker.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left px-4 py-3 hover:bg-bg-hover text-text-primary font-medium rounded-md"
                    onClick={() => setIsPanelOpen(false)}
                  >
                    {broker.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
