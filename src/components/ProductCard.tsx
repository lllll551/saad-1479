import React, { useState } from 'react';
import { ShoppingBasket, Check, Eye, Plus, Minus } from 'lucide-react';
import { Product } from '../types/store.ts';
import { useStore } from '../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, addToCart, setQuickViewProduct, cart } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const [qty, setQty] = useState(1);

  // Check if item is already in cart
  const cartItem = cart.find(c => c.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group bg-white rounded-xl border border-stone-200/80 hover:border-emerald-600 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // graceful fallback to placeholder image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Discount tag */}
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-xs">
            {product.discountBadge || `Save Rs. ${product.originalPrice! - product.price}`}
          </div>
        )}

        {/* Stock status indicator if low or out of stock */}
        {!product.inStock ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-stone-900 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              {t.outOfStock}
            </span>
          </div>
        ) : product.stockQuantity <= 5 ? (
          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Only {product.stockQuantity} left
          </div>
        ) : null}

        {/* Quick View hover icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-stone-700 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category and unit (No pills per frontend-design rules) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="truncate max-w-[140px] font-medium text-emerald-800">
              {product.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="shrink-0">{product.unit}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-stone-900">
                Rs. {product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  Rs. {product.originalPrice!.toLocaleString()}
                </span>
              )}
            </div>

            {cartItem && (
              <span className="text-[11px] font-semibold text-emerald-700">
                In Cart: {cartItem.quantity}
              </span>
            )}
          </div>

          <p className="text-[10px] text-amber-700/90 font-medium">
            * Price may vary due to market level
          </p>

          {/* Add to Cart button or Quantity row */}
          <div className="flex items-center gap-2">
            {/* Quick quantity stepper */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-stone-200 rounded-lg bg-stone-50 px-1 py-0.5"
            >
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-30"
                disabled={qty <= 1 || !product.inStock}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-800">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-30"
                disabled={!product.inStock || qty >= product.stockQuantity}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                !product.inStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBasket className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
