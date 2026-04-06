import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

// Initialize Gemini API outside component to avoid re-initialization on every render
const getApiKey = () => {
  try {
    return (process.env as any).GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  } catch (e) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export default function Chatbot() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: t('chatbot.welcome', 'Hi 👋 How can I help you today?'), sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Ticket collection state
  const [mode, setMode] = useState<'chat' | 'collect_info'>('chat');
  const [ticketStep, setTicketStep] = useState<'name' | 'email' | 'message' | 'done'>('name');
  const [ticketData, setTicketData] = useState({ name: '', email: '', message: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatSession, setChatSession] = useState<any>(null);

  const fetchFaqs = async () => {
    try {
      const faqsSnapshot = await getDocs(collection(db, 'faqs'));
      let data = faqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FAQ[];
      
      if (data.length === 0) {
        // Fallback to default FAQs if collection is empty
        data = [
          {
            id: "faq_1",
            question: "What is Capital Growth Alliance?",
            answer: "Capital Growth Alliance is a premium fintech investment platform designed to help you grow your wealth securely."
          },
          {
            id: "faq_2",
            question: "How do I deposit funds?",
            answer: 'You can deposit funds by navigating to the Profile and clicking on the "Deposit" action card. Follow the instructions to complete your transfer.'
          },
          {
            id: "faq_3",
            question: "What is the minimum investment?",
            answer: "Our Starter plan requires a minimum investment of $100."
          },
          {
            id: "faq_4",
            question: "How long does withdrawal take?",
            answer: "Withdrawals are typically processed within 24-48 business hours."
          },
          {
            id: "faq_5",
            question: "Is my money safe?",
            answer: "Yes, your funds are protected by industry-leading security protocols and cold storage solutions."
          }
        ];
      }

      setFaqs(data);
      
      // Initialize chat session once FAQs are loaded
      const faqContext = data.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
      const createSupportTicketDeclaration: FunctionDeclaration = {
        name: "createSupportTicket",
        description: "Call this function to initiate the process of creating a support ticket when the user's question cannot be answered by the FAQ, or when they explicitly ask to contact support.",
      };
      
      const systemInstruction = `You are a helpful customer support chatbot for Capital Growth Alliance. 
You can exchange basic greetings. 
For any questions, you must answer based ONLY on the following FAQ context:

${faqContext}

If the answer to a question is not in the FAQ, you MUST call the \`createSupportTicket\` function. Do not attempt to answer questions outside the FAQ. Keep your answers concise and friendly.`;

      const session = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [createSupportTicketDeclaration] }],
          temperature: 0.2,
        },
      });
      setChatSession(session);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const [hasFetchedFaqs, setHasFetchedFaqs] = useState(false);

  useEffect(() => {
    // Fetch FAQs only when the chatbot is opened for the first time
    if (isOpen && !hasFetchedFaqs) {
      fetchFaqs();
      setHasFetchedFaqs(true);
    }
  }, [isOpen, hasFetchedFaqs]);

  useEffect(() => {
    const isHomepage = location.pathname === '/';
    
    if (!isHomepage) {
      setIsBubbleVisible(false);
      setIsOpen(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 0 && !hasShown) {
        setIsBubbleVisible(true);
        setHasShown(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, hasShown]);

  // Reset hasShown when navigating back to home
  useEffect(() => {
    const isHomepage = location.pathname === '/';
    if (!isHomepage) {
      setHasShown(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add user message
    const newUserMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);

    if (mode === 'collect_info') {
      handleTicketCollection(userText);
      return;
    }

    // Chat mode
    setIsTyping(true);

    try {
      if (!chatSession) {
        throw new Error("Chat session not initialized");
      }

      const response = await chatSession.sendMessage({ message: userText });

      setIsTyping(false);

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0 && functionCalls[0].name === 'createSupportTicket') {
        // Switch to collect info mode
        setMode('collect_info');
        setTicketStep('name');
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: t('chatbot.collect_name', "I'm sorry, but that's outside my knowledge base. Let me collect some information to create a support ticket for you. What is your name?"), 
          sender: 'bot' 
        }]);
      } else {
        // Normal text response
        const botText = response.text || t('chatbot.error_response', "I'm not sure how to respond to that.");
        setMessages(prev => [...prev, { id: Date.now().toString(), text: botText, sender: 'bot' }]);
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: t('chatbot.error_connection', "I'm having trouble connecting to my knowledge base right now. Please try again later."), 
        sender: 'bot' 
      }]);
    }
  };

  const handleTicketCollection = async (text: string) => {
    setIsTyping(true);
    
    // Simulate a small delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsTyping(false);

    if (ticketStep === 'name') {
      setTicketData(prev => ({ ...prev, name: text }));
      setTicketStep('email');
      setMessages(prev => [...prev, { id: Date.now().toString(), text: t('chatbot.collect_email', `Thanks, {{name}}. What is your email address?`, { name: text }), sender: 'bot' }]);
    } else if (ticketStep === 'email') {
      // Basic email validation
      if (!text.includes('@') || !text.includes('.')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: t('chatbot.invalid_email', "That doesn't look like a valid email. Please enter a valid email address."), sender: 'bot' }]);
        return;
      }
      setTicketData(prev => ({ ...prev, email: text }));
      setTicketStep('message');
      setMessages(prev => [...prev, { id: Date.now().toString(), text: t('chatbot.collect_issue', "Got it. Finally, please describe your issue or question in detail."), sender: 'bot' }]);
    } else if (ticketStep === 'message') {
      const finalData = { ...ticketData, message: text };
      setTicketData(finalData);
      
      // Submit ticket directly to Firestore
      try {
        setIsTyping(true);
        
        await addDoc(collection(db, 'support_tickets'), {
          ...finalData,
          status: 'open',
          createdAt: serverTimestamp()
        });
        
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), text: t('chatbot.ticket_success', "Thank you! Your support ticket has been submitted. Our team will get back to you at {{email}} soon.", { email: finalData.email }), sender: 'bot' }]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), text: t('chatbot.ticket_error', "Sorry, there was an error submitting your ticket. Please try again later."), sender: 'bot' }]);
      }

      // Reset mode
      setMode('chat');
      setTicketStep('name');
      setTicketData({ name: '', email: '', message: '' });
      
      // Re-initialize chat session to clear the pending function call
      const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
      const createSupportTicketDeclaration: FunctionDeclaration = {
        name: "createSupportTicket",
        description: "Call this function to initiate the process of creating a support ticket when the user's question cannot be answered by the FAQ, or when they explicitly ask to contact support.",
      };
      const systemInstruction = `You are a helpful customer support chatbot for Capital Growth Alliance. 
You can exchange basic greetings. 
For any questions, you must answer based ONLY on the following FAQ context:

${faqContext}

If the answer to a question is not in the FAQ, you MUST call the \`createSupportTicket\` function. Do not attempt to answer questions outside the FAQ. Keep your answers concise and friendly.`;

      const session = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [createSupportTicketDeclaration] }],
          temperature: 0.2,
        },
      });
      setChatSession(session);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {(isBubbleVisible || isOpen) && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              setIsBubbleVisible(false);
            }}
            className={`fixed bottom-[calc(env(safe-area-inset-bottom)+110px)] lg:bottom-6 right-6 w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center shadow-lg shadow-accent-primary/30 text-slate-900 z-[60] transition-transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+110px)] lg:bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-env(safe-area-inset-bottom)-140px)] lg:max-h-[calc(100vh-6rem)] bg-bg-secondary border border-border-light rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-accent-primary p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-medium text-sm"><span className="notranslate">CGA</span> Support</h3>
                  <p className="text-slate-800 text-xs">{t('chatbot.status', 'Online')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchFaqs}
                  title={t('chatbot.refresh', 'Refresh FAQ Knowledge Base')}
                  className="text-slate-800 hover:text-slate-900 transition-colors p-1 rounded-md hover:bg-black/5"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-800 hover:text-slate-900 transition-colors p-1 rounded-md hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-primary">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-accent-primary text-slate-900 rounded-br-sm' 
                      : 'bg-bg-card text-text-primary border border-border-light rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-bg-card border border-border-light rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-text-muted rounded-full" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-bg-secondary border-t border-border-light shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={mode === 'collect_info' ? t('chatbot.type_answer', "Type your answer...") : t('chatbot.type_message', "Type your message...")}
                  className="w-full bg-bg-primary border border-border-light rounded-full pl-4 pr-12 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors placeholder:text-text-muted"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-slate-900 hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
