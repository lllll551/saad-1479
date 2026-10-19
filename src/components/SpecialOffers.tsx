import React from 'react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';

export const SpecialOffers: React.FC = () => {
  const { products, setSelectedCategory, setActiveTab } = useStore();

  const dealProducts = products.filter(p => p.isSpecialOffer || (p.originalPrice && p.originalPrice > p.price)).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-12 bg-amber-50/50 border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest">
              <Tag className="w-3.5 h-3.5" />
              <span>Special Value Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Featured Discounts & Promotional Offers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Save on newborn baby welcome sets, fancy laces, branded cosmetics, and backpacks in Pail Khushab.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors self-start sm:self-end"
          >
            <span>Explore All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
