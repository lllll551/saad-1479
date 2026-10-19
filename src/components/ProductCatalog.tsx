import React, { useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { CATEGORIES } from './CategoryList.tsx';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    language,
    t,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceFilter,
    setPriceFilter,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
  } = useStore();

  const categoryNames = useMemo(() => {
    return ['All', ...CATEGORIES.map(c => c.id)];
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      // Price filter
      if (priceFilter > 0 && p.price > priceFilter) {
        return false;
      }

      // In stock only filter
      if (inStockOnly && (!p.inStock || p.stockQuantity <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceFilter, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceFilter(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    priceFilter > 0 ||
    inStockOnly;

  return (
    <section id="products-section" className="py-10 sm:py-14 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-stone-200/80 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Store Catalog & Variety
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {selectedCategory === 'All'
                ? 'All Products & Collections'
                : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {filteredProducts.length} products available in store
            </p>
          </div>

          {/* Quick Search & Sort on right */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-emerald-600 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-hidden text-stone-800 font-medium cursor-pointer"
              >
                <option value="featured">{t.featured}</option>
                <option value="price-low">{t.priceLowHigh}</option>
                <option value="price-high">{t.priceHighLow}</option>
                <option value="name">{t.nameAZ}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Market Rate Disclaimer Banner */}
        <div className="mb-6 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded text-[11px]">
              Market Notice
            </span>
            <span className="font-medium">
              Prices may vary slightly according to daily wholesale market level fluctuations.
            </span>
          </div>
        </div>

        {/* Category Filters (Interactive buttons per frontend-design) */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryNames.map((cat) => {
            const isSelected = selectedCategory === cat;
            const categoryObj = CATEGORIES.find(c => c.id === cat);
            const label = cat === 'All' ? 'All Items' : (categoryObj ? categoryObj.name : cat);

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-emerald-600 hover:text-emerald-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Bar: Price Presets & Stock toggle */}
        <div className="mb-8 p-3.5 bg-white border border-stone-200 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Max Price:</span>
            </span>

            {[
              { label: 'All Prices', val: 0 },
              { label: 'Under Rs. 300', val: 300 },
              { label: 'Under Rs. 700', val: 700 },
              { label: 'Under Rs. 1,500', val: 1500 },
              { label: 'Under Rs. 3,000', val: 3000 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => setPriceFilter(p.val)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  priceFilter === p.val
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 accent-emerald-700"
              />
              <span>{t.inStockOnly}</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-stone-500 hover:text-rose-600 font-medium underline transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">
                No Products Found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Try modifying your search keywords or clearing your price filters.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
