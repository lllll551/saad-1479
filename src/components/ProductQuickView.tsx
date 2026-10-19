import React, { useState } from 'react';
import { X, ShoppingBasket, MessageSquare, Check, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ProductQuickView: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    language,
    t,
    addToCart,
    settings,
    setCartOpen,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
      setCartOpen(true);
    }, 800);
  };

  const handleWhatsAppProduct = () => {
    const text = `Assalam-o-Alaikum Saad General Store, I am interested in ${product.name} (Rs. ${product.price}, ${product.unit}). Is this currently available?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-100 rounded-xl overflow-hidden relative border border-stone-200/60">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
                }}
              />
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-xs px-2.5 py-1 rounded shadow-xs">
                  {product.discountBadge || `Save Rs. ${product.originalPrice! - product.price}`}
                </div>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Original Brand</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep Delivery</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Unit */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                <span className="font-semibold text-emerald-800">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.unit}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through">
                    Rs. {product.originalPrice!.toLocaleString()}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Save Rs. {(product.originalPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Market price variation disclaimer */}
              <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Prices may vary due to daily wholesale market level fluctuations.</span>
              </div>

              {/* Stock status */}
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                {product.inStock ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock ({product.stockQuantity} available)</span>
                  </span>
                ) : (
                  <span className="text-rose-600">Currently Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4 text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || !product.inStock}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock || quantity >= product.stockQuantity}
                    className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-medium ml-auto">
                  Total: <strong className="text-stone-900">Rs. {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                    !product.inStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-900 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Item Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBasket className="w-4 h-4" />
                      <span>{t.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppProduct}
                  className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Ask on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
