import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ContactUs: React.FC = () => {
  const { settings, t } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, subject, message }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending message. Please try WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Customer Support & Location
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            Contact Saad General Store
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Have a question about an item, pricing, or parcel delivery? Chat directly with us or send an inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contacts & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Action Buttons */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-base">
                Direct Contact Channels
              </h3>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalam-o-Alaikum Saad General Store, I have an inquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-200" />
                  <span>Chat on WhatsApp ({settings.whatsapp})</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-colors"
                >
                  <Phone className="w-5 h-5 text-emerald-700" />
                  <span>Call Store Directly: {settings.phone}</span>
                </a>
              </div>
            </div>

            {/* Store Information Cards */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{t.storeAddress}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {settings.address}
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1">
                    City: {settings.city}, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{t.hours}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {settings.openingHours}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Open All 7 Days
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps Location Placeholder with Interactive Direction Link */}
            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-stone-800">Google Maps Location</span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.storeName + ' ' + settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Canvas */}
              <div className="relative aspect-video w-full bg-stone-200 overflow-hidden flex items-center justify-center">
                <iframe
                  title="Saad General Store Map Location"
                  className="w-full h-full border-0"
                  loading="lazy"
                  src="https://maps.google.com/maps?q=Pail%20Khushab%20Punjab%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                />
              </div>
              <div className="p-3 text-center bg-stone-50 border-t border-stone-100 text-[11px] text-stone-500">
                📍 {settings.address}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900">
              Send an Inquiry or Message
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Fill in your details below and our team will get in touch shortly.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you for contacting Saad General Store. We will respond to your provided phone number shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">{t.name} *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">{t.phoneNumber} *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0314-3084561"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">{t.email}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">{t.subject}</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Order Inquiry / Product Availability"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">{t.message} *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message, order question, or specific required item..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : t.sendMessage}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
