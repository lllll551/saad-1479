import React from 'react';
import { X, Trash2, ShoppingBasket, ArrowRight, Plus, Minus, MessageSquare, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    settings,
    setCheckoutOpen,
    language,
    t,
  } = useStore();

  if (!cartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={() => setCartOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              <ShoppingBasket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">{t.cart}</h2>
              <p className="text-xs text-emerald-300">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your basket
              </p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              {freeDeliveryRemaining === 0 ? (
                <span className="text-emerald-700 font-bold">
                  🎉 You've unlocked FREE Home Delivery!
                </span>
              ) : (
                <span>
                  Add Rs. {freeDeliveryRemaining.toLocaleString()} more for FREE Delivery
                </span>
              )}
            </span>
            <span className="text-emerald-800">{freeDeliveryPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-emerald-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
                <ShoppingBasket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base">{t.emptyCart}</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Add newborn baby items, laces, cosmetics, bags, garments, and toys to your basket.
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    Rs. {item.product.price.toLocaleString()} · {item.product.unit}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-stone-900">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-stone-900">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t.deliveryFee}</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <strong className="text-emerald-700 font-bold">{t.free}</strong>
                  ) : (
                    <strong className="text-stone-900 font-semibold">
                      Rs. {cartDeliveryFee.toLocaleString()}
                    </strong>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>{t.total}</span>
                <span className="text-emerald-900">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-amber-800 text-center pt-1 font-medium">
                * Final rates may vary slightly based on current market level
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t.proceedCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="text-center text-[11px] text-stone-500 hover:text-rose-600 transition-colors py-1 font-medium"
              >
                Clear Basket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
