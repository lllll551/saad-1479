import React from 'react';
import { Baby, Sparkles, Heart, Backpack, ShoppingBag, Shirt, Gamepad2, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export interface CategoryMeta {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  image: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "Born baby products",
    name: "Born Baby Products",
    icon: Baby,
    description: "Welcome sets, Feeders, Swaddle wraps, Towels & Care",
    image: "/products/baby-01.jpg",
    color: "from-sky-500/10 to-sky-600/10 text-sky-700",
  },
  {
    id: "Laces",
    name: "Fancy Laces & Borders",
    icon: Sparkles,
    description: "Zari, Gotta Patti, Crochet & Pearl hanging laces",
    image: "/products/lace-01.jpg",
    color: "from-amber-500/10 to-amber-600/10 text-amber-700",
  },
  {
    id: "Cosmetics",
    name: "Cosmetics & Makeup",
    icon: Heart,
    description: "Lipsticks, Foundations, Eyeshadows, Mascara & Skincare",
    image: "/products/cosm-01.jpg",
    color: "from-rose-500/10 to-rose-600/10 text-rose-700",
  },
  {
    id: "School bags",
    name: "School Bags",
    icon: Backpack,
    description: "Waterproof backpacks, cartoon bags & college bags",
    image: "/products/sbag-01.jpg",
    color: "from-blue-500/10 to-blue-600/10 text-blue-700",
  },
  {
    id: "Woman bags",
    name: "Woman Bags & Clutches",
    icon: ShoppingBag,
    description: "Bridal clutches, Crossbody, Totes & Luxury handbags",
    image: "/products/wbag-01.jpg",
    color: "from-purple-500/10 to-purple-600/10 text-purple-700",
  },
  {
    id: "Baby garments",
    name: "Baby Garments",
    icon: Shirt,
    description: "Cotton rompers, Party frocks, Baba sets & Winter fleece",
    image: "/products/garm-01.jpg",
    color: "from-emerald-500/10 to-emerald-600/10 text-emerald-700",
  },
  {
    id: "Toys",
    name: "Kids Toys & Games",
    icon: Gamepad2,
    description: "RC Cars, Talking dolls, Building blocks & Learning pads",
    image: "/products/toy-01.jpg",
    color: "from-orange-500/10 to-orange-600/10 text-orange-700",
  },
  {
    id: "Electronic items",
    name: "Electronic Items",
    icon: Zap,
    description: "Emergency torches, Hair dryers, Trimmers & Extensions",
    image: "/products/elec-01.jpg",
    color: "from-teal-500/10 to-teal-600/10 text-teal-700",
  },
];

export const CategoryList: React.FC = () => {
  const { products, setSelectedCategory, setActiveTab } = useStore();

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('shop');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Our Specialized Collections
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTab('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>View Full Catalog</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = getProductCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white hover:border-emerald-600 hover:shadow-lg transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                {/* Visual Category Photo Preview */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-black/10" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/95 backdrop-blur-xs text-emerald-700 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                  </div>

                  {/* Item count tag */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                    {count} items
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 w-full">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-500 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                    <span className="text-emerald-700 font-bold group-hover:underline">Explore Category</span>
                    <span className="text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
