import React, { useState, useRef } from 'react';
import { ShoppingBasket, Search, Phone, MessageSquare, Shield, Menu, X, ArrowRight, Camera, Upload, Check, RefreshCw, Image as ImageIcon, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import saadStoreLogo from '../assets/images/saad_store_logo_1791890968558.jpg';

export const Header: React.FC = () => {
  const {
    t,
    activeTab,
    setActiveTab,
    cartCount,
    cartTotal,
    setCartOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    settings,
    uploadStoreLogo,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Logo upload modal state
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedLogoPreview, setSelectedLogoPreview] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoSuccessMsg, setLogoSuccessMsg] = useState('');
  const [logoErrorMsg, setLogoErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('shop');
    setMobileSearchOpen(false);
  };

  const navLinks: { id: 'home' | 'shop' | 'about' | 'contact' | 'admin'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'All Products' },
    { id: 'about', label: 'About Store' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const activeLogoSrc = settings.logoUrl || saadStoreLogo;

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setLogoErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogo = async () => {
    const targetImage = selectedLogoPreview || logoUrlInput.trim();
    if (!targetImage) {
      setLogoErrorMsg('Please select a photo file or provide an image URL first.');
      return;
    }

    setUploadingLogo(true);
    setLogoErrorMsg('');
    try {
      const res = await uploadStoreLogo(targetImage);
      if (res.success) {
        setLogoSuccessMsg('Store logo replaced successfully!');
        setTimeout(() => {
          setLogoModalOpen(false);
          setLogoSuccessMsg('');
          setSelectedLogoPreview(null);
          setLogoUrlInput('');
        }, 1200);
      } else {
        setLogoErrorMsg(res.error || 'Failed to replace store logo. Please try again.');
      }
    } catch (err: any) {
      setLogoErrorMsg(err.message || 'Error occurred while saving logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetToDefaultLogo = async () => {
    setUploadingLogo(true);
    setLogoErrorMsg('');
    try {
      const res = await uploadStoreLogo(saadStoreLogo);
      if (res.success) {
        setLogoSuccessMsg('Reset to official Saad General Store logo!');
        setTimeout(() => {
          setLogoModalOpen(false);
          setLogoSuccessMsg('');
          setSelectedLogoPreview(null);
        }, 1200);
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-900/10 shadow-xs">
      {/* Top utility banner with continuous running Pail marquee */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-3 sm:px-6 border-b border-emerald-800/40 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold text-[11px] shadow-xs z-10">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-0.5" />
            <span className="tracking-wide">PAIL · KHUSHAB</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-fade">
            <div className="animate-marquee flex items-center gap-8 text-xs font-medium text-emerald-100">
              <span className="flex items-center gap-3">
                <span>🚚 {settings.announcement}</span>
                <span className="text-amber-400 font-semibold">• Main Bazar, Pail (District Khushab)</span>
                <span className="text-emerald-300">• Born Baby Essentials, Fancy Laces, Branded Cosmetics, School & Hand Bags, Garments, Toys & Electronics</span>
                <span className="text-amber-300">• (Note: Prices may vary slightly due to market wholesale level)</span>
                <span className="text-emerald-200">• Fast Local Delivery & Direct WhatsApp: {settings.whatsapp}</span>
              </span>
              <span className="text-emerald-500 font-bold">✦ ✦ ✦</span>
              <span className="flex items-center gap-3">
                <span>🚚 {settings.announcement}</span>
                <span className="text-amber-400 font-semibold">• Main Bazar, Pail (District Khushab)</span>
                <span className="text-emerald-300">• Born Baby Essentials, Fancy Laces, Branded Cosmetics, School & Hand Bags, Garments, Toys & Electronics</span>
                <span className="text-amber-300">• (Note: Prices may vary slightly due to market wholesale level)</span>
                <span className="text-emerald-200">• Fast Local Delivery & Direct WhatsApp: {settings.whatsapp}</span>
              </span>
              <span className="text-emerald-500 font-bold">✦ ✦ ✦</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 z-10 pl-2">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition-colors bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-800 text-[11px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo & Title with Logo Change Badge */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('All');
              }}
              title="Saad General Store"
              className="block rounded-full focus-visible:outline-emerald-600"
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-emerald-600 to-emerald-900 shadow-md group-hover:scale-105 transition-transform duration-200">
                <img
                  src={activeLogoSrc}
                  alt="Saad General Store Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full bg-emerald-950"
                  onError={(e) => {
                    // Fallback to imported logo if network path fails
                    (e.target as HTMLImageElement).src = saadStoreLogo;
                  }}
                />
              </div>
            </button>

            {/* Quick logo change camera button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLogoModalOpen(true);
              }}
              title="Replace or Change Store Logo (WhatsApp/File/URL)"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white border-2 border-white flex items-center justify-center shadow-md text-[10px] transition-transform hover:scale-110"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory('All');
            }}
            className="text-left group focus-visible:outline-emerald-600 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 font-sans group-hover:text-emerald-800 transition-colors">
                Saad General Store
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              Pail, Khushab · Born Baby, Laces, Cosmetics & Bags
            </p>
          </button>
        </div>

        {/* Desktop Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-lg relative mx-2"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-20 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden transition-all placeholder:text-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Desktop Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Nav links on desktop */}
          <nav className="hidden lg:flex items-center gap-1 mr-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === link.id
                    ? 'text-emerald-800 bg-emerald-50'
                    : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs hover:shadow-sm"
            aria-label="Shopping Cart"
          >
            <ShoppingBasket className="w-5 h-5" />
            <span className="hidden sm:inline font-bold text-sm">
              Rs. {cartTotal.toLocaleString()}
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-900 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Download Full Project ZIP */}
          <a
            href="/saad-general-store.zip"
            download="saad-general-store.zip"
            title="Download Full Project ZIP (سارا پروجیکٹ زپ فائل ڈاؤنلوڈ کریں)"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-xs hover:shadow transition-all hover:scale-105 border border-amber-500/30"
          >
            <Download className="w-3.5 h-3.5 text-emerald-950 animate-bounce" />
            <span>Download ZIP</span>
          </a>

          {/* Change Logo quick button on larger screens */}
          <button
            type="button"
            onClick={() => setLogoModalOpen(true)}
            title="Update Store Logo"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>Logo</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-lg"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search input expand */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 py-2 bg-stone-50 border-t border-stone-200 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="w-full pl-10 pr-20 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:border-emerald-600 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-700 text-white rounded text-xs font-medium"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-3 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  activeTab === link.id
                    ? 'text-emerald-800 bg-emerald-50 font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}

            <button
              onClick={() => {
                setLogoModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Change / Replace Store Logo</span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>

            <a
              href="/saad-general-store.zip"
              download="saad-general-store.zip"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-emerald-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 hover:from-amber-300 hover:to-amber-400 flex items-center justify-between shadow-xs border border-amber-400/50"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-900" />
                <span>ڈاؤنلوڈ مکمل پروجیکٹ زپ (Download ZIP)</span>
              </span>
              <span className="text-[10px] bg-emerald-900 text-amber-300 font-bold px-2 py-0.5 rounded font-mono">ZIP 47MB</span>
            </a>

            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Admin Portal</span>
              </span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <div>
              <p className="font-semibold text-emerald-800">{settings.phone}</p>
              <p>{settings.city}, Pakistan</p>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Store Logo Replacement Modal */}
      {logoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Replace Store Logo</h3>
                  <p className="text-xs text-emerald-200">Saad General Store · Pail, Khushab</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLogoModalOpen(false);
                  setSelectedLogoPreview(null);
                  setLogoErrorMsg('');
                  setLogoSuccessMsg('');
                }}
                className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Logo Preview */}
              <div className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <div className="relative mb-3">
                  <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-emerald-600 to-emerald-950 shadow-lg">
                    <img
                      src={selectedLogoPreview || activeLogoSrc}
                      alt="Store Logo Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full bg-emerald-950"
                    />
                  </div>
                  {selectedLogoPreview && (
                    <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-stone-700">
                  {selectedLogoPreview ? 'Selected Logo Preview' : 'Current Active Store Logo'}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Appears in header, footer, bills, and WhatsApp shares
                </p>
              </div>

              {/* Status messages */}
              {logoSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{logoSuccessMsg}</span>
                </div>
              )}
              {logoErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {logoErrorMsg}
                </div>
              )}

              {/* Option 1: File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Upload WhatsApp Image / Logo File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Choose Logo from Device / WhatsApp</span>
                </button>
              </div>

              {/* Option 2: Image URL input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-stone-700">
                  Or Paste Logo Image URL / Base64
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoUrlInput}
                    onChange={(e) => {
                      setLogoUrlInput(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedLogoPreview(e.target.value.trim());
                      }
                    }}
                    placeholder="https://... or /store-logo.jpg"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                  />
                  {logoUrlInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrlInput('');
                        setSelectedLogoPreview(null);
                      }}
                      className="px-2.5 py-2 text-xs text-stone-500 hover:text-stone-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleApplyLogo}
                  disabled={uploadingLogo || (!selectedLogoPreview && !logoUrlInput)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {uploadingLogo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Logo...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply & Replace Store Logo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultLogo}
                  disabled={uploadingLogo}
                  className="w-full py-2 px-3 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-stone-500" />
                  <span>Restore Official Saad Store Emblem Logo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
