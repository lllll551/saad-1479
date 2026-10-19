import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Truck, ShieldCheck, MapPin, Phone, User, FileText, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    placeOrder,
    settings,
    language,
    t,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState(settings.city || 'Pail, Khushab');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!checkoutOpen) return null;

  const validateForm = () => {
    if (!customerName.trim()) {
      setValidationError('Please enter your full name.');
      return false;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setValidationError('Please enter a valid Pakistani mobile number (e.g., 0300-1234567).');
      return false;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setValidationError('Please enter your complete delivery street and house address.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleCodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const order = await placeOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      city,
      orderNotes,
    });
    setSubmitting(false);

    if (order) {
      setCheckoutOpen(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    // Also record order in the database for backend inventory synchronization
    const order = await placeOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      city,
      orderNotes: orderNotes ? `${orderNotes} (Ordered via WhatsApp)` : 'Ordered via WhatsApp',
    });
    setSubmitting(false);

    const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.product.unit}) x ${item.quantity} = Rs. ${(item.product.price * item.quantity).toLocaleString()}`
      )
      .join('\n');

    const msg = `*🛒 NEW ORDER - SAAD GENERAL STORE*
${order ? `*Order ID:* ${order.id}` : ''}

*Customer Details:*
• Name: ${customerName}
• Phone: ${customerPhone}
• Address: ${deliveryAddress}, ${city}
${orderNotes ? `• Notes: ${orderNotes}\n` : ''}
*Order Items:*
${itemsList}

--------------------------
*Subtotal:* Rs. ${cartSubtotal.toLocaleString()}
*Delivery Fee:* ${cartDeliveryFee === 0 ? 'FREE' : `Rs. ${cartDeliveryFee.toLocaleString()}`}
*TOTAL AMOUNT:* Rs. ${cartTotal.toLocaleString()}
*Payment:* Cash on Delivery (COD)

Please confirm my order delivery!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');

    if (order) {
      setCheckoutOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-xl w-full my-8 shadow-2xl border border-stone-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">{t.checkout}</h3>
              <p className="text-xs text-emerald-200">
                Cash on Delivery & WhatsApp Checkout · Pail, Khushab
              </p>
            </div>
          </div>

          <button
            onClick={() => setCheckoutOpen(false)}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleCodSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Customer Name */}
          <div className="space-y-1">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.fullName} *</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Muhammad Usman"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Customer Phone */}
          <div className="space-y-1">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.phoneNumber} *</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="0300-1234567 or +92 300 1234567"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Delivery Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-stone-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.deliveryAddress} *</span>
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House #, Street name, Block / Area"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">
                {t.city} *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden font-semibold"
              >
                <option value="Pail, Khushab">Pail, Khushab (Local)</option>
                <option value="Khushab City">Khushab City</option>
                <option value="Quaidabad">Quaidabad</option>
                <option value="Noorpur Thal">Noorpur Thal</option>
                <option value="Joharabad">Joharabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Sargodha">Sargodha</option>
                <option value="Other">Other City</option>
              </select>
            </div>
          </div>

          {/* Order Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.orderNotes}</span>
            </label>
            <textarea
              rows={2}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Ring the bell at gate, deliver before evening"
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden resize-none"
            />
          </div>

          {/* Payment Method Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                  {t.paymentMethod}: Cash on Delivery (COD)
                </h4>
                <p className="text-[11px] text-stone-600">{t.codDesc}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold">
              VERIFIED
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal ({cart.length} items):</span>
              <span className="font-semibold text-stone-900">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee:</span>
              <span>
                {cartDeliveryFee === 0 ? (
                  <strong className="text-emerald-700 font-bold">FREE (Above Rs. 2,000)</strong>
                ) : (
                  <strong className="text-stone-900">Rs. {cartDeliveryFee.toLocaleString()}</strong>
                )}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-stone-900 pt-1.5 border-t border-stone-200 text-sm sm:text-base">
              <span>Total Payable:</span>
              <span className="text-emerald-900">Rs. {cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Market Price Notice */}
          <div className="flex items-center gap-2 text-[11px] text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Note: Final prices may vary slightly according to daily wholesale market levels.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{submitting ? 'Processing Order...' : t.confirmOrder}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{t.orderViaWhatsAppDirect}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
