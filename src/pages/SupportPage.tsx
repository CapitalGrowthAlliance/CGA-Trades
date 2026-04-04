import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe2, Mail, Phone, User, Hash, MessageSquare, 
  Paperclip, X, ShieldCheck, ChevronDown, CheckCircle2,
  AlertCircle, UploadCloud, Clock, Image as ImageIcon,
  ArrowRight, ArrowLeft, Send
} from 'lucide-react';
import { db, storage, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Account Issue',
  'Deposit Issue',
  'Withdrawal Issue',
  'Referral Issue',
  'Security Concern',
  'Other'
];

const SUPPORT_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', email: 'us-support@cga.com', phone: '+1 (555) 123-4567', whatsapp: '+15551234567', telegram: '@cga_us' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', email: 'uk-support@cga.com', phone: '+44 20 7123 4567', whatsapp: '+442071234567', telegram: '@cga_uk' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', email: 'ca-support@cga.com', phone: '+1 (555) 987-6543', whatsapp: '+15559876543', telegram: '@cga_ca' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', email: 'au-support@cga.com', phone: '+61 2 1234 5678', whatsapp: '+61212345678', telegram: '@cga_au' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', email: 'de-support@cga.com', phone: '+49 30 1234567', whatsapp: '+49301234567', telegram: '@cga_de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', email: 'fr-support@cga.com', phone: '+33 1 23456789', whatsapp: '+33123456789', telegram: '@cga_fr' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', email: 'sg-support@cga.com', phone: '+65 6123 4567', whatsapp: '+6561234567', telegram: '@cga_sg' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', email: 'tz-support@cga.com', phone: '+255 22 123 4567', whatsapp: '+255221234567', telegram: '@cga_tz' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', email: 'ug-support@cga.com', phone: '+256 414 123 456', whatsapp: '+256414123456', telegram: '@cga_ug' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', email: 'cm-support@cga.com', phone: '+237 2 22 22 22 22', whatsapp: '+237222222222', telegram: '@cga_cm' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', email: 'za-support@cga.com', phone: '+27 11 123 4567', whatsapp: '+27111234567', telegram: '@cga_za' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', email: 'ke-support@cga.com', phone: '+254 20 123 4567', whatsapp: '+254201234567', telegram: '@cga_ke' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', email: 'gh-support@cga.com', phone: '+233 30 123 4567', whatsapp: '+233301234567', telegram: '@cga_gh' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', email: 'ng-support@cga.com', phone: '+234 1 123 4567', whatsapp: '+23411234567', telegram: '@cga_ng' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'image/png',
  'image/jpeg',
  'image/jpg',
  'video/mp4'
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    accountId: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });

  interface FileData {
    file: File;
    preview?: string;
  }
  const [files, setFiles] = useState<FileData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const totalSteps = 8;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  const isStepValid = () => {
    switch(step) {
      case 1: return !!formData.fullName.trim();
      case 2: return !!formData.username.trim();
      case 3: return !!formData.accountId.trim();
      case 4: return !!formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 5: return true;
      case 6: return !!formData.category && !!formData.subject.trim();
      case 7: return !!formData.message.trim();
      case 8: return true;
      default: return true;
    }
  };

  useEffect(() => {
    // Auto-fill if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: user.displayName || '',
          email: user.email || '',
          username: user.displayName?.split(' ')[0] || '',
          accountId: user.uid.substring(0, 8).toUpperCase()
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-focus when step changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const processFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File ${file.name} exceeds 5MB limit.`);
        return false;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`File type ${file.type} is not allowed.`);
        return false;
      }
      return true;
    });

    const processedFiles = await Promise.all(validFiles.map(async (file) => {
      if (file.type.startsWith('image/')) {
        return new Promise<FileData>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({ file, preview: e.target?.result as string });
          };
          reader.readAsDataURL(file);
        });
      }
      return { file };
    }));

    setFiles(prev => [...prev, ...processedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    setError('');
    switch(step) {
      case 1:
        if (!formData.fullName.trim()) { setError('Full Name is required'); return false; }
        return true;
      case 2:
        if (!formData.username.trim()) { setError('Username is required'); return false; }
        return true;
      case 3:
        if (!formData.accountId.trim()) { setError('Account ID is required'); return false; }
        return true;
      case 4:
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { 
          setError('Valid email is required'); 
          return false; 
        }
        return true;
      case 5:
        return true; // Phone is optional
      case 6:
        if (!formData.category || !formData.subject.trim()) { 
          setError('Category and Subject are required'); 
          return false; 
        }
        return true;
      case 7:
        if (!formData.message.trim()) { setError('Message is required'); return false; }
        return true;
      case 8:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const generatedTicketId = `CGA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Upload files
      const attachmentUrls = [];
      for (const fileData of files) {
        const fileRef = ref(storage, `support_attachments/${generatedTicketId}/${fileData.file.name}`);
        await uploadBytes(fileRef, fileData.file);
        const url = await getDownloadURL(fileRef);
        attachmentUrls.push(url);
      }

      const priority = formData.category === 'Withdrawal Issue' ? 'high' : 'normal';

      // Save to Firestore
      await addDoc(collection(db, 'support_requests'), {
        userId: auth.currentUser?.uid || null,
        name: formData.fullName,
        username: formData.username,
        accountId: formData.accountId,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        attachments: attachmentUrls,
        status: 'pending',
        priority,
        createdAt: serverTimestamp(),
        ticketId: generatedTicketId
      });

      setTicketId(generatedTicketId);
      setSubmitSuccess(true);
      
    } catch (err: any) {
      console.error('Error submitting support request:', err);
      setError(err.message || 'An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-bg-secondary border-b border-border-light py-6 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px 20px'
             }} 
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold truncate"><span className="text-accent-primary">Global Support,</span> <span className="text-white">Local Assistance</span></h1>
          <p className="text-xs md:text-base text-text-secondary mt-1 line-clamp-2 max-w-md mx-auto">
            Reach our support teams worldwide. Fast, secure, and reliable help for all your investment needs.
          </p>
        </div>
      </div>

      {/* Country Support Section */}
      {!submitSuccess && (
        <div className="px-4 py-6 max-w-5xl mx-auto">
          <h2 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Direct Contact</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {SUPPORT_COUNTRIES.map(country => (
              <div key={country.code} className="border border-border-light rounded-xl overflow-hidden bg-bg-primary hover:border-accent-primary/50 transition-colors">
                <button 
                  onClick={() => setExpandedCountry(country.code)}
                  className="w-full px-3 py-3 md:py-5 md:px-4 flex items-center justify-center md:justify-start gap-2 text-sm font-medium hover:bg-bg-hover transition-colors"
                >
                  <span className="text-lg md:text-xl">{country.flag}</span>
                  <span className="truncate text-xs md:text-sm md:font-bold">{country.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Country Modal */}
      <AnimatePresence>
        {expandedCountry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedCountry(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-bg-primary border border-border-light rounded-2xl shadow-xl z-[101] overflow-hidden"
            >
              {(() => {
                const country = SUPPORT_COUNTRIES.find(c => c.code === expandedCountry);
                if (!country) return null;
                return (
                  <div className="flex flex-col max-h-[85vh]">
                    <div className="flex items-center p-4 border-b border-border-light bg-bg-secondary shrink-0">
                      <button 
                        onClick={() => setExpandedCountry(null)}
                        className="p-2 -ml-2 hover:bg-bg-hover rounded-lg transition-colors mr-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <span className="text-2xl mr-3">{country.flag}</span>
                      <h3 className="text-lg font-bold">{country.name} Support</h3>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto">
                      <a href={`mailto:${country.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border-light transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                          <Mail className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs text-text-secondary mb-0.5">Email</p>
                          <p className="text-sm font-medium truncate">{country.email}</p>
                        </div>
                      </a>
                      <a href={`tel:${country.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border-light transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                          <Phone className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs text-text-secondary mb-0.5">Phone</p>
                          <p className="text-sm font-medium truncate">{country.phone}</p>
                        </div>
                      </a>
                      <a href={`https://wa.me/${country.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border-light transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                          <MessageSquare className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs text-text-secondary mb-0.5">WhatsApp</p>
                          <p className="text-sm font-medium truncate">{country.whatsapp}</p>
                        </div>
                      </a>
                      <a href={`https://t.me/${country.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary hover:bg-bg-hover border border-border-light transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                          <Send className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs text-text-secondary mb-0.5">Telegram</p>
                          <p className="text-sm font-medium truncate">{country.telegram}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Form Area */}
      <div className="px-4 pb-12 max-w-3xl mx-auto">
        {submitSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-primary border border-border-light rounded-2xl p-6 md:p-8 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-lg md:text-xl font-bold mb-2">Support Contact Form Submitted Successfully</h2>
            <p className="text-xs md:text-sm text-text-secondary mb-6 max-w-sm mx-auto">
              Thank you for contacting CGA Support. Our team has received your request and will review it shortly.
            </p>
            
            <div className="bg-bg-secondary rounded-xl p-4 inline-block mb-6 border border-border-light">
              <p className="text-xs text-text-secondary mb-1">Your Ticket ID</p>
              <p className="text-lg font-mono font-bold text-accent-primary">#{ticketId}</p>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-bg-secondary border border-border-light text-text-primary rounded-xl text-sm font-medium hover:bg-border-light transition-colors"
            >
              Return to Homepage
            </button>
          </motion.div>
        ) : (
          <>
            <h2 className="text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Submit a Support Request</h2>
            <div className="bg-bg-primary border border-border-light rounded-2xl p-3 md:p-4 shadow-sm">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-text-muted">Step {step} of {totalSteps}</span>
                <div className="flex gap-1">
                  {Array.from({length: totalSteps}).map((_, i) => (
                    <div key={i} className={`h-1 w-3 sm:w-4 rounded-full transition-colors ${i + 1 <= step ? 'bg-accent-primary' : 'bg-border-light'}`} />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-red-500">{error}</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); if (step === totalSteps) handleSubmit(); else nextStep(); }}>
                <div className="min-h-[60px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {step === 1 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Full Name *</label>
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              ref={inputRef as any}
                              type="text" 
                              name="fullName"
                              value={formData.fullName} 
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                              placeholder="John Doe"
                              onKeyDown={e => e.key === 'Enter' && nextStep()}
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Username *</label>
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              ref={inputRef as any}
                              type="text" 
                              name="username"
                              value={formData.username} 
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                              placeholder="johndoe123"
                              onKeyDown={e => e.key === 'Enter' && nextStep()}
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Account ID *</label>
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              ref={inputRef as any}
                              type="text" 
                              name="accountId"
                              value={formData.accountId} 
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                              placeholder="CGA-123456"
                              onKeyDown={e => e.key === 'Enter' && nextStep()}
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 4 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Email Address *</label>
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              ref={inputRef as any}
                              type="email" 
                              name="email"
                              value={formData.email} 
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                              placeholder="john@example.com"
                              onKeyDown={e => e.key === 'Enter' && nextStep()}
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 5 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Phone Number <span className="text-text-muted font-normal">(Optional)</span></label>
                          <div className="flex items-center gap-2 w-full">
                            <input 
                              ref={inputRef as any}
                              type="tel" 
                              name="phone"
                              value={formData.phone} 
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                              placeholder="+1 (555) 000-0000"
                              onKeyDown={e => e.key === 'Enter' && nextStep()}
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 6 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-text-secondary">Issue Category *</label>
                            <select 
                              ref={inputRef as any}
                              name="category"
                              value={formData.category} 
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none appearance-none"
                            >
                              <option value="" disabled>Select a category</option>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-text-secondary">Subject / Title *</label>
                            <div className="flex items-center gap-2 w-full">
                              <input 
                                type="text" 
                                name="subject"
                                value={formData.subject} 
                                onChange={handleInputChange}
                                className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none transition-all"
                                placeholder="Brief description of the issue"
                                onKeyDown={e => e.key === 'Enter' && nextStep()}
                              />
                              <button 
                                type="button" 
                                onClick={nextStep}
                                disabled={!isStepValid()}
                                className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 7 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Message *</label>
                          <div className="flex items-start gap-2 w-full">
                            <textarea 
                              ref={inputRef as any}
                              name="message"
                              value={formData.message} 
                              onChange={handleInputChange}
                              rows={3}
                              className="flex-1 min-w-0 px-3 py-2 bg-bg-secondary border border-border-light rounded-lg text-xs focus:border-accent-primary focus:ring-1 focus:ring-accent-primary outline-none resize-none transition-all"
                              placeholder="Describe your issue in detail..."
                            />
                            <button 
                              type="button" 
                              onClick={nextStep}
                              disabled={!isStepValid()}
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[60px] flex items-center justify-center"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {step === 8 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-medium text-text-secondary">Attachments <span className="text-text-muted font-normal">(Optional)</span></label>
                            <div 
                              className="border border-dashed border-border-light rounded-xl p-4 text-center bg-bg-secondary cursor-pointer hover:border-accent-primary/50 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.mp4" />
                              <UploadCloud className="w-5 h-5 text-text-muted mx-auto mb-1.5" />
                              <p className="text-[11px] font-medium mb-0.5">Tap to upload</p>
                              <p className="text-[9px] text-text-muted">PDF, DOCX, XLSX, PNG, JPG, MP4 (max 5MB)</p>
                            </div>

                            {files.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {files.map((fileData, index) => (
                                  <div key={index} className="flex items-center justify-between p-1.5 bg-bg-secondary border border-border-light rounded-lg">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      {fileData.preview ? (
                                        <div className="w-6 h-6 rounded shrink-0 overflow-hidden border border-border-light">
                                          <img src={fileData.preview} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded bg-bg-primary flex items-center justify-center shrink-0 border border-border-light">
                                          <Paperclip className="w-3 h-3 text-text-muted" />
                                        </div>
                                      )}
                                      <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-medium truncate">{fileData.file.name}</span>
                                        <span className="text-[8px] text-text-muted">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                      </div>
                                    </div>
                                    <button type="button" onClick={() => removeFile(index)} className="p-1 hover:bg-bg-primary rounded text-text-muted hover:text-red-500 shrink-0">
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Security Layer */}
                          <div className="bg-bg-secondary border border-border-light rounded-lg p-2.5 flex items-start gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
                            <p className="text-[9px] text-text-secondary leading-tight">
                              Your data is securely encrypted. Do not share passwords or sensitive login details. Protected by reCAPTCHA.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  {step > 1 ? (
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="px-3 py-2 rounded-lg border border-border-light bg-bg-secondary text-xs font-medium hover:bg-border-light flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  ) : <div />}

                  {step === totalSteps && (
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !isStepValid()} 
                      className="px-4 py-2 rounded-lg bg-accent-primary text-slate-900 text-xs font-bold hover:bg-accent-hover flex items-center gap-2 ml-auto disabled:opacity-70 transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
