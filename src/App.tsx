import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryList } from './components/CategoryList.tsx';
import { SpecialOffers } from './components/SpecialOffers.tsx';
import { ProductCatalog } from './components/ProductCatalog.tsx';
import { ProductQuickView } from './components/ProductQuickView.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { AboutUs } from './components/AboutUs.tsx';
import { ContactUs } from './components/ContactUs.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingButterfly } from './components/FloatingButterfly.tsx';
import { OwnerWelcome } from './components/OwnerWelcome.tsx';
import { ShoppingBasket, Home, Grid, Phone, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, cartCount, setCartOpen, loading, error, refreshProducts } = useStore();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-700">
        <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center animate-bounce shadow-lg">
          <ShoppingBasket className="w-8 h-8" />
        </div>
        <p className="mt-4 font-bold text-stone-800 text-base">Loading Saad General Store...</p>
        <p className="text-xs text-stone-500">Connecting to inventory & catalog</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-stone-800 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Connection Error</h2>
          <p className="text-xs text-stone-600">{error}</p>
          <button
            onClick={() => refreshProducts()}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
          >
            Retry Loading Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-700 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Floating Mascot Butterfly flying across the website */}
      <FloatingButterfly />

      {/* Main Pages Based on Active Tab */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'home' && (
          <>
            <HeroBanner />
            <OwnerWelcome />
            <CategoryList />
            <SpecialOffers />
            <ProductCatalog />
            <AboutUs />
          </>
        )}

        {activeTab === 'shop' && (
          <>
            <ProductCatalog />
          </>
        )}

        {activeTab === 'about' && (
          <>
            <AboutUs />
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <ContactUs />
          </>
        )}

        {activeTab === 'admin' && (
          <>
            <AdminPanel />
          </>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ProductQuickView />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Action Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-emerald-800' : 'text-stone-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'shop' ? 'text-emerald-800' : 'text-stone-500'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold text-stone-700"
        >
          <div className="relative">
            <ShoppingBasket className="w-5 h-5 text-emerald-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-emerald-900 font-bold">Basket</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'contact' ? 'text-emerald-800' : 'text-stone-500'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'admin' ? 'text-emerald-800' : 'text-stone-500'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
