import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KYCModal({ isOpen, onClose, onSuccess }: KYCModalProps) {
  const { t } = useTranslation();
  const token = 'mock-token';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(t('kyc.error_upload', 'Please upload a document image'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!token) throw new Error('Not authenticated');

      // In a real app, we would upload the file to storage and save the URL
      // For this demo, we'll just simulate a successful KYC submission
      const res = await fetch('/api/user/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStep(3);
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || t('kyc.error_failed', 'KYC submission failed'));
      }
    } catch (err) {
      setError(t('kyc.error_occurred', 'An error occurred during KYC submission'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-bg-secondary border border-border-light rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h2 className="text-xl font-bold text-text-primary">{t('kyc.title', 'Identity Verification (KYC)')}</h2>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <p className="text-text-secondary text-sm">
                    {t('kyc.step1_desc', 'To ensure the security of your account and comply with regulations, we need to verify your identity.')}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('kyc.doc_type', 'Document Type')}</label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary"
                      >
                        <option value="passport">{t('kyc.passport', 'Passport')}</option>
                        <option value="id_card">{t('kyc.id_card', 'National ID Card')}</option>
                        <option value="drivers_license">{t('kyc.drivers_license', "Driver's License")}</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">{t('kyc.doc_number', 'Document Number')}</label>
                      <input
                        type="text"
                        value={formData.documentNumber}
                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                        className="w-full bg-bg-primary border border-border-light rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary placeholder:text-text-muted"
                        placeholder={t('kyc.doc_number_placeholder', 'Enter document number')}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.documentNumber}
                    className="w-full py-3 px-4 rounded-xl font-medium text-slate-900 bg-accent-primary hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('kyc.continue', 'Continue')}
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <p className="text-text-secondary text-sm">
                    {t('kyc.step2_desc', 'Please upload a clear photo of your selected document.')}
                  </p>
                  
                  <div className="border-2 border-dashed border-border-light rounded-xl p-8 text-center hover:bg-bg-hover transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-accent-primary mx-auto mb-3" />
                    <p className="text-text-primary font-medium mb-1">
                      {file ? file.name : t('kyc.upload_prompt', 'Click to upload or drag and drop')}
                    </p>
                    <p className="text-text-muted text-xs">{t('kyc.upload_hint', 'PNG, JPG up to 5MB')}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 px-4 rounded-xl font-medium text-text-secondary bg-bg-hover hover:bg-border-light transition-colors"
                    >
                      {t('kyc.back', 'Back')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !file}
                      className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-900 bg-accent-primary hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        t('kyc.submit', 'Submit KYC')
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{t('kyc.success_title', 'Submission Successful')}</h3>
                  <p className="text-text-secondary text-sm mb-6">
                    {t('kyc.success_desc', 'Your KYC documents have been submitted successfully. We will review them shortly.')}
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl font-medium text-slate-900 bg-accent-primary hover:bg-accent-hover transition-colors"
                  >
                    {t('kyc.done', 'Done')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
