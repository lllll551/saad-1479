import React from 'react';
import { ShoppingBag, MessageSquare, Truck, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const HeroBanner: React.FC = () => {
  const { t, setActiveTab, setSelectedCategory, settings } = useStore();
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const quickCategories = [
    { name: 'Born Baby', cat: 'Born baby products' },
    { name: 'Fancy Laces', cat: 'Laces' },
    { name: 'Cosmetics', cat: 'Cosmetics' },
    { name: 'School Bags', cat: 'School bags' },
    { name: 'Woman Bags', cat: 'Woman bags' },
    { name: 'Baby Garments', cat: 'Baby garments' },
    { name: 'Toys', cat: 'Toys' },
    { name: 'Electronics', cat: 'Electronic items' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white py-12 sm:py-16 lg:py-20">
      {/* Decorative background subtle glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Pail, Khushab's Premier Variety Store</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
                <span>Traditional Quality & Modern Convenience</span>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
                Welcome to Saad General Store
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-amber-200 font-sans">
                {settings.tagline}
              </p>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore our handpicked collection of newborn baby sets, bridal and designer dress laces, authentic cosmetics, durable school bags, women’s designer handbags, baby garments, toys, and electronics in Pail (Khushab) with reliable Cash on Delivery.
            </p>

            {/* Market Price Notice */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-amber-400/30 text-[11px] text-amber-200 max-w-lg">
              <span className="font-bold text-amber-300">📢 Market Note:</span>
              <span>Prices may vary slightly due to daily wholesale market level fluctuations.</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveTab('shop');
                  setSelectedCategory('All');
                }}
                className="px-6 py-3.5 bg-white text-emerald-950 hover:bg-emerald-50 font-bold rounded-xl shadow-lg shadow-emerald-950/20 text-sm sm:text-base transition-all flex items-center gap-2 hover:gap-3"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>{t.shopNow}</span>
                <ArrowRight className="w-4 h-4 text-emerald-800" />
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Saad General Store, I want to order products or ask a question.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold rounded-xl border border-emerald-400/30 text-sm sm:text-base transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-5 h-5 text-emerald-300" />
                <span>{t.orderOnWhatsApp}</span>
              </a>
            </div>

            {/* Fast Category Shortcuts */}
            <div className="pt-2 text-xs text-emerald-200/80">
              <span className="font-semibold text-white mr-2">
                Popular Categories:
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-1">
                {quickCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedCategory(cat.cat);
                      setActiveTab('shop');
                    }}
                    className="hover:text-white underline underline-offset-4 decoration-emerald-500 hover:decoration-white transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual Card / Feature Highlights */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl text-white space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Why Shop at Saad General Store?
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Guaranteed quality stock, honest pricing & doorstep COD
                  </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/20">
                  PKR Rates
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Doorstep Delivery
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                      Free delivery on orders above Rs. 2,000 across Pail & Khushab region.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Cash on Delivery (COD)
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                      Inspect your parcel upon arrival and pay cash with zero worries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Open 7 Days a Week
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                      Always ready to dispatch your baby essentials, laces, and bags.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Direct WhatsApp Ordering
                    </h4>
                    <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                      Send your list or product screenshots directly to 00923143084561.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
