import React from 'react';
import { CheckCircle2, MessageSquare, ShoppingBag, X, Phone, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, language, settings, setActiveTab } = useStore();

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleWhatsAppConfirm = () => {
    const text = `Assalam-o-Alaikum Saad General Store, I just placed Order #${order.id} for Rs. ${order.total.toLocaleString()} under name "${order.customerName}". Please confirm delivery dispatch.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Saved in Store Database
        </span>

        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">
          Order Placed Successfully!
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Thank you for shopping with Saad General Store, Pail (Khushab). Your order has been recorded in our system and will be prepared promptly for Cash on Delivery.
        </p>

        {/* Order Details Card */}
        <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <span className="text-stone-500">Order Number:</span>
            <span className="font-extrabold text-stone-900 text-sm">#{order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Customer:</span>
            <span className="font-semibold text-stone-800">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Phone:</span>
            <span className="font-semibold text-stone-800">{order.customerPhone}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Delivery Address:</span>
            <span className="font-semibold text-stone-800 text-right truncate max-w-[200px]">
              {order.deliveryAddress}, {order.city}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stone-500">Payment:</span>
            <span className="font-bold text-emerald-800">Cash on Delivery (COD)</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
            <span>Total Payable:</span>
            <span className="text-emerald-900">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleWhatsAppConfirm}
            className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>Confirm on WhatsApp</span>
          </button>

          <button
            onClick={() => {
              setLastPlacedOrder(null);
              setActiveTab('shop');
            }}
            className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
