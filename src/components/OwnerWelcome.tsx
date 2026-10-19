import React, { useState, useRef } from 'react';
import { MessageSquare, Phone, CheckCircle, Sparkles, AlertCircle, Camera, Upload, Check, X, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import fallbackOwnerPhoto from '../assets/images/saad_arhab_photo_1791888533530.jpg';

export const OwnerWelcome: React.FC = () => {
  const { settings, uploadOwnerPhoto } = useStore();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayPhoto = settings.ownerPhoto || '/owner-saad.jpg' || fallbackOwnerPhoto;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatus({ type: 'error', message: 'Sirf tasveer (image file) select karein (JPG/PNG/WebP)' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setUploadStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    const photoToSave = previewUrl || (urlInput.trim() ? urlInput.trim() : null);
    if (!photoToSave) {
      setUploadStatus({ type: 'error', message: 'Barah-e-karam pehle tasveer select karein' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const res = await uploadOwnerPhoto(photoToSave);
    setIsUploading(false);

    if (res.success) {
      setUploadStatus({ type: 'success', message: 'Shukriya! Saad Arhab ki asal photo bina kisi tabdeeli ke lag chuki hai.' });
      setTimeout(() => {
        setIsModalOpen(false);
        setPreviewUrl(null);
        setUrlInput('');
        setUploadStatus(null);
      }, 1800);
    } else {
      setUploadStatus({ type: 'error', message: res.error || 'Photo save karne mein masla aya, dobara koshish karein.' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-stone-50 via-emerald-50/40 to-stone-50 border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Ornamental Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Welcome to Saad General Store</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Meet Your Store Host — Saad Arhab
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Serving Pail, Khushab with authentic goods, honest prices, and personalized hospitality
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-emerald-800/15 p-6 sm:p-8 lg:p-10 shadow-xl shadow-emerald-950/5 relative overflow-hidden">
          {/* Subtle traditional motif background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Saad Arhab's Image with Gold Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute -inset-2 bg-gradient-to-tr from-amber-400 via-emerald-600 to-amber-500 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white shadow-2xl bg-stone-100">
                  <img
                    src={displayPhoto}
                    alt="Saad Arhab - Owner of Saad General Store, Pail Khushab"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Name Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent p-4 text-white text-center">
                    <h3 className="font-bold text-lg leading-tight">Saad Arhab</h3>
                    <p className="text-xs text-amber-300 font-medium">Proprietor · Saad General Store, Pail (Khushab)</p>
                  </div>

                  {/* Quick Change Photo Button Badge */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                    title="Asal photo upload ya change karein"
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>

              {/* Action button below photo */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Asal WhatsApp Photo Upload Karein</span>
                </button>
                <div className="flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Main Bazar, Pail</span>
                </div>
              </div>
            </div>

            {/* Right: Personal Welcome Message */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                  Assalam-o-Alaikum & Warm Welcome!
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
                  "My personal promise: Authentic variety, honest prices, and respect for every customer."
                </h3>
              </div>

              <div className="text-stone-700 text-xs sm:text-sm space-y-3 leading-relaxed">
                <p>
                  I warmly welcome you to Saad General Store in Main Bazar, Pail (District Khushab). Whether you need tender newborn baby swaddles, feeding bottles, intricate bridal Zari laces, authentic cosmetics, a sturdy backpack for your child’s school, ladies party clutches, toys, or emergency rechargeable lights, you can shop with full confidence.
                </p>
                <p>
                  If you need additional photos or specific details about any lace reel, bag color, baby garment, or electronics model, feel free to reach out to me directly on WhatsApp at <strong>{settings.whatsapp}</strong>.
                </p>
              </div>

              {/* Market Price Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs space-y-1.5 text-left">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Notice Regarding Prices:</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  <strong>Prices may vary slightly due to daily wholesale market level fluctuations.</strong> We always strive to charge you the fairest prevailing market rate upon order packaging.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalam-o-Alaikum Saad Arhab Bhai! I am visiting your store website and would like to ask about an item.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Chat Directly with Saad Arhab ({settings.whatsapp})</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>Call: {settings.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Uploading Exact Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setPreviewUrl(null);
                setUploadStatus(null);
              }}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-800 mb-1">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                  Saad Arhab Ki Asal Photo Lagayein
                </h3>
                <p className="text-xs text-stone-600">
                  Apne mobile ya computer se wahi original WhatsApp photo select karein. Ye bina kisi AI change ke bilkul waisi he lag jaye gi.
                </p>
              </div>

              {/* Preview Box */}
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-emerald-500 overflow-hidden bg-stone-50 flex items-center justify-center relative shadow-inner">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="New preview"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <img
                      src={displayPhoto}
                      alt="Current photo"
                      className="w-full h-full object-cover object-top opacity-70"
                    />
                  )}
                  {previewUrl && (
                    <span className="absolute bottom-1 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      New Photo Preview
                    </span>
                  )}
                </div>
              </div>

              {/* File input button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Device Se Asal Photo Select Karein (Gallery / WhatsApp)</span>
                </button>
              </div>

              {/* Status Message */}
              {uploadStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    uploadStatus.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {uploadStatus.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  )}
                  <span>{uploadStatus.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={!previewUrl || isUploading}
                  onClick={handleSavePhoto}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Photo Lagayi Ja Rahi Hai...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Yehi Photo Lagao (Save Photo)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPreviewUrl(null);
                    setUploadStatus(null);
                  }}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs sm:text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
