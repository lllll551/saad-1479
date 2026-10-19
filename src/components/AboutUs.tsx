import React from 'react';
import { ShoppingBasket, ShieldCheck, HeartHandshake, Award, Clock, MapPin, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const AboutUs: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShoppingBasket className="w-4 h-4 text-emerald-700" />
            <span>About Saad General Store</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Your Trusted Destination for Everyday & Festive Essentials
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Located in Main Bazar, Pail (District Khushab), Saad General Store is your dedicated local destination for premium newborn baby care, designer laces, authentic cosmetics, durable school bags, women’s handbags, baby garments, toys, and daily home electronics.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Curated Fashion & Baby Care
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every item—from hypoallergenic newborn swaddles and feeder kits to bridal Zari laces and high-density school bags—is handpicked for durability and style.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Honest & Affordable PKR Rates
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Priced fairly in Pakistani Rupees without inflated middleman markups. Enjoy regular bundle discounts on cosmetics, toys, and baby essentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Swift WhatsApp Support
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Need photos of specific lace reels, bag colors, or toy models? Chat with us directly on WhatsApp (+92 314 3084561) for rapid assistance.
            </p>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Serving Pail Khushab & Nearby Areas
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
                Experience Convenient Local Shopping Right from Your Mobile
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Browse from the comfort of your home, place your order on our web app or WhatsApp, and inspect your parcel at delivery before paying cash.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-5 py-2.5 bg-white text-emerald-950 font-bold rounded-xl text-xs sm:text-sm hover:bg-emerald-100 transition-colors"
                >
                  Start Shopping Now
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-emerald-600"
                >
                  View Store Location
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">500+</span>
                <p className="text-xs text-emerald-100 mt-1">Varieties & Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">Fast</span>
                <p className="text-xs text-emerald-100 mt-1">Same-Day Local Delivery</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">100%</span>
                <p className="text-xs text-emerald-100 mt-1">Cash on Delivery</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">7 Days</span>
                <p className="text-xs text-emerald-100 mt-1">Open 8 AM – 10 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
