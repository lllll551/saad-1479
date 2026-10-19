import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings } from '../types/store.ts';
import { translations } from '../utils/translations.ts';

interface StoreContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  settings: StoreSettings;
  language: 'en';
  t: typeof translations['en'];
  setLanguage: (lang: 'en') => void;
  toggleLanguage: () => void;
  activeTab: 'home' | 'shop' | 'about' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'shop' | 'about' | 'contact' | 'admin') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priceFilter: number;
  setPriceFilter: (p: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  placeOrder: (orderDetails: any) => Promise<Order | null>;
  // Admin state & methods
  adminToken: string | null;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  orders: Order[];
  loadOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  saveProduct: (productData: Partial<Product>, isEdit?: boolean) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  uploadOwnerPhoto: (photoBase64OrUrl: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  uploadStoreLogo: (photoBase64OrUrl: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  refreshProducts: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  storeName: "Saad General Store",
  tagline: "Born Baby, Laces, Cosmetics, Bags, Garments, Toys & Electronics",
  phone: "0314-3084561",
  whatsapp: "00923143084561",
  address: "Main Bazar, Pail, District Khushab, Punjab, Pakistan",
  city: "Pail, Khushab",
  openingHours: "Mon - Sun: 8:00 AM – 10:00 PM",
  deliveryFee: 150,
  freeDeliveryThreshold: 2000,
  announcement: "🚚 Welcome to Saad General Store, Pail Khushab! Free Delivery on orders over Rs. 2,000.",
  ownerName: "Saad Arhab",
  ownerPhoto: "/owner-saad.jpg",
  logoUrl: "/store-logo.jpg",
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [language, setLanguage] = useState<'en'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'about' | 'contact' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sgs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('sgs_admin_token');
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Translations dictionary
  const t = translations.en;

  const toggleLanguage = () => {
    // English-only mode enforced
    setLanguage('en');
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sgs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error storing cart in localStorage:', e);
    }
  }, [cart]);

  // Fetch initial products and store settings from backend
  const fetchStoreData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, settRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings'),
      ]);

      if (!prodRes.ok) throw new Error('Could not fetch products catalog');
      const prodData = await prodRes.json();
      setProducts(prodData);

      if (settRes.ok) {
        const settData = await settRes.json();
        setSettings({ ...defaultSettings, ...settData });
      }
    } catch (err: any) {
      console.error('Error fetching store data:', err);
      setError(err.message || 'Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const refreshProducts = async () => {
    try {
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Failed to refresh products:', err);
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.inStock) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stockQuantity, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(product.stockQuantity, Math.max(1, quantity));
        return [...prev, { product, quantity: initialQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  // Checkout API
  const placeOrder = async (orderDetails: any): Promise<Order | null> => {
    try {
      const payload = {
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
          image: item.product.image,
        })),
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
        deliveryAddress: orderDetails.deliveryAddress,
        city: orderDetails.city || settings.city,
        orderNotes: orderDetails.orderNotes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to place order');
      }

      const order: Order = await res.json();
      setLastPlacedOrder(order);
      clearCart();
      refreshProducts();
      return order;
    } catch (err: any) {
      console.error('Order submission error:', err);
      alert(err.message || 'Error creating order. Please try placing your order via WhatsApp.');
      return null;
    }
  };

  // Admin functions
  const loginAdmin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setAdminToken(data.token);
      localStorage.setItem('sgs_admin_token', data.token);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('sgs_admin_token');
    setOrders([]);
  };

  const loadOrders = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: status as any } : o))
        );
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to update status:', e);
      return false;
    }
  };

  const saveProduct = async (productData: Partial<Product>, isEdit: boolean = false): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        await refreshProducts();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error saving product:', e);
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        await refreshProducts();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error deleting product:', e);
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error updating settings:', e);
      return false;
    }
  };

  const uploadOwnerPhoto = async (photoBase64OrUrl: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const isBase64 = photoBase64OrUrl.startsWith('data:') || photoBase64OrUrl.length > 300;
      const body = isBase64 ? { imageBase64: photoBase64OrUrl } : { imageUrl: photoBase64OrUrl };
      const res = await fetch('/api/owner-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(prev => ({ ...prev, ownerPhoto: data.ownerPhoto, ownerName: 'Saad Arhab' }));
        return { success: true, url: data.ownerPhoto };
      }
      return { success: false, error: data.error || 'Upload failed' };
    } catch (err: any) {
      console.error('Error uploading owner photo:', err);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const uploadStoreLogo = async (photoBase64OrUrl: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const isBase64 = photoBase64OrUrl.startsWith('data:') || photoBase64OrUrl.length > 300;
      const body = isBase64 ? { imageBase64: photoBase64OrUrl } : { imageUrl: photoBase64OrUrl };
      const res = await fetch('/api/store-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(prev => ({ ...prev, logoUrl: data.logoUrl }));
        return { success: true, url: data.logoUrl };
      }
      return { success: false, error: data.error || 'Upload failed' };
    } catch (err: any) {
      console.error('Error uploading store logo:', err);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        error,
        settings,
        language: 'en',
        t,
        setLanguage: () => {},
        toggleLanguage,
        activeTab,
        setActiveTab,
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
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        placeOrder,
        adminToken,
        isAdminLoggedIn: !!adminToken,
        loginAdmin,
        logoutAdmin,
        orders,
        loadOrders,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        updateSettings,
        uploadOwnerPhoto,
        uploadStoreLogo,
        refreshProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
