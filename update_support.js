import fs from 'fs';

const filePath = '/src/pages/SupportPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update SUPPORT_COUNTRIES
content = content.replace(
  /const SUPPORT_COUNTRIES = \[[\s\S]*?\];/,
  `const SUPPORT_COUNTRIES = [
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
];`
);

// 2. Add refs and isStepValid
content = content.replace(
  /const inputRef = useRef<HTMLInputElement \| HTMLTextAreaElement \| HTMLSelectElement>\(null\);/,
  `const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const countryListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryListRef.current && !countryListRef.current.contains(event.target as Node)) {
        setExpandedCountry(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStepValid = () => {
    switch(step) {
      case 1: return !!formData.fullName.trim();
      case 2: return !!formData.username.trim();
      case 3: return !!formData.accountId.trim();
      case 4: return !!formData.email.trim() && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email);
      case 5: return true;
      case 6: return !!formData.category && !!formData.subject.trim();
      case 7: return !!formData.message.trim();
      case 8: return true;
      default: return true;
    }
  };`
);

// 3. Add ref to country list
content = content.replace(
  /<div className="px-4 py-6 max-w-3xl mx-auto">/,
  `<div className="px-4 py-6 max-w-3xl mx-auto" ref={countryListRef}>`
);

// 4. Update form padding
content = content.replace(
  /className="bg-bg-primary border border-border-light rounded-2xl p-4 md:p-6 shadow-sm"/,
  `className="bg-bg-primary border border-border-light rounded-2xl p-3 md:p-4 shadow-sm"`
);

// 5. Update Progress Indicator margin
content = content.replace(
  /className="flex items-center justify-between mb-6"/,
  `className="flex items-center justify-between mb-4"`
);

// 6. Update error message styling
content = content.replace(
  /className="mb-5 p-3 bg-red-500\/10 border border-red-500\/20 rounded-xl flex items-start gap-2"/,
  `className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-1.5"`
);
content = content.replace(
  /<AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" \/>\n\s*<p className="text-xs text-red-500">\{error\}<\/p>/,
  `<AlertCircle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />\n                  <p className="text-[10px] text-red-500">{error}</p>`
);

// 7. Update form fields
content = content.replace(
  /className="min-h-\[160px\]"/,
  `className="min-h-[60px]"`
);

content = content.replace(
  /className="space-y-4"/,
  `className="space-y-2"`
);

// Step 1
content = content.replace(
  /\{step === 1 && \([\s\S]*?\}\)/,
  `{step === 1 && (
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
                      )}`
);

// Step 2
content = content.replace(
  /\{step === 2 && \([\s\S]*?\}\)/,
  `{step === 2 && (
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
                      )}`
);

// Step 3
content = content.replace(
  /\{step === 3 && \([\s\S]*?\}\)/,
  `{step === 3 && (
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
                      )}`
);

// Step 4
content = content.replace(
  /\{step === 4 && \([\s\S]*?\}\)/,
  `{step === 4 && (
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
                      )}`
);

// Step 5
content = content.replace(
  /\{step === 5 && \([\s\S]*?\}\)/,
  `{step === 5 && (
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
                      )}`
);

// Step 6
content = content.replace(
  /\{step === 6 && \([\s\S]*?\}\)/,
  `{step === 6 && (
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
                      )}`
);

// Step 7
content = content.replace(
  /\{step === 7 && \([\s\S]*?\}\)/,
  `{step === 7 && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-text-secondary">Message *</label>
                          <div className="flex items-end gap-2 w-full">
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
                              className="shrink-0 w-[22%] px-2 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-bold hover:bg-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[32px]"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}`
);

// Step 8
content = content.replace(
  /\{step === 8 && \([\s\S]*?\}\)/,
  `{step === 8 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-text-secondary">Attachments <span className="text-text-muted font-normal">(Optional)</span></label>
                            <div 
                              className="border border-dashed border-border-light rounded-lg p-4 text-center bg-bg-secondary cursor-pointer hover:border-accent-primary/50 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.mp4" />
                              <UploadCloud className="w-5 h-5 text-text-muted mx-auto mb-1" />
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
                                        <span className="text-[9px] text-text-muted">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                      </div>
                                    </div>
                                    <button type="button" onClick={() => removeFile(index)} className="p-1 hover:bg-bg-primary rounded-md text-text-muted hover:text-red-500 shrink-0">
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
                      )}`
);

// 8. Remove the old "Next" button from the bottom actions, keep "Back" and "Submit"
content = content.replace(
  /<div className="mt-8 flex items-center justify-between gap-3">[\s\S]*?<\/div>\n              <\/form>/,
  `<div className="mt-4 flex items-center justify-between gap-3">
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
                      disabled={isSubmitting} 
                      className="px-4 py-2 rounded-lg bg-accent-primary text-slate-900 text-xs font-bold hover:bg-accent-hover flex items-center gap-1.5 ml-auto disabled:opacity-70 transition-colors"
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
              </form>`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done');
