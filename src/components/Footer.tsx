import React from 'react';
import { ShoppingBasket, Phone, MessageSquare, MapPin, Clock, ShieldCheck, Truck, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { CATEGORIES } from './CategoryList.tsx';
import saadStoreLogo from '../assets/images/saad_store_logo_1791890968558.jpg';

export const Footer: React.FC = () => {
  const { settings, setActiveTab, setSelectedCategory } = useStore();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const activeLogoSrc = settings.logoUrl || saadStoreLogo;

  return (
    <footer className="bg-emerald-950 text-emerald-100/90 pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-emerald-900/60 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Free Doorstep Delivery</p>
              <p className="text-emerald-300/80 text-xs">On orders over Rs. 2,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Cash on Delivery (COD)</p>
              <p className="text-emerald-300/80 text-xs">Inspect items before paying</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Instant WhatsApp Order</p>
              <p className="text-emerald-300/80 text-xs">Send your shopping list directly</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white">Open 7 Days a Week</p>
              <p className="text-emerald-300/80 text-xs">8:00 AM to 10:00 PM</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-emerald-900/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-emerald-600 to-emerald-800 shadow-md shrink-0">
                <img
                  src={activeLogoSrc}
                  alt="Saad General Store"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full bg-emerald-950"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = saadStoreLogo;
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white">Saad General Store</span>
                <p className="text-xs text-emerald-300 font-medium">Main Bazar, Pail (Khushab)</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed max-w-sm">
              Your dependable store for newborn baby essentials, bridal & fancy laces, cosmetics, school bags, women's handbags, baby garments, toys, and electronics in Pail (District Khushab), Pakistan.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp: {settings.whatsapp}</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                <span>{settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setActiveTab('shop');
                    }}
                    className="text-emerald-200/70 hover:text-white transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Pages */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-emerald-200/70 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('shop');
                    setSelectedCategory('All');
                  }}
                  className="text-emerald-200/70 hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="text-emerald-200/70 hover:text-white transition-colors"
                >
                  About Saad Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="text-emerald-200/70 hover:text-white transition-colors"
                >
                  Contact & Location
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="text-emerald-200/70 hover:text-white transition-colors font-semibold"
                >
                  Admin Portal
                </button>
              </li>
              <li>
                <a
                  href="/saad-general-store.zip"
                  download="saad-general-store.zip"
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold pt-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP (47MB)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Store Address & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Store Information
            </h4>
            <div className="space-y-2 text-xs text-emerald-200/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-emerald-300 block">Accepted Payment:</span>
                <span className="text-xs text-white">Cash on Delivery (PKR)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© {new Date().getFullYear()} Saad General Store. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Currency: Pakistani Rupees (PKR)</span>
            <span>·</span>
            <span>Serving Pail, Khushab with Pride</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
