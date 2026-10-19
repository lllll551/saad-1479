import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  MessageSquare,
  Search,
  Save,
  LogOut,
  AlertCircle,
  Camera,
  Upload,
  Download,
  FileArchive
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Product, Order, OrderStatus } from '../types/store.ts';
import { CATEGORIES } from './CategoryList.tsx';

export const AdminPanel: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    products,
    orders,
    loadOrders,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    settings,
    updateSettings,
    language,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [adminTab, setAdminTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: CATEGORIES[0].id,
    price: 100,
    originalPrice: undefined,
    unit: '1 Piece',
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    description: '',
    isFeatured: false,
    isSpecialOffer: false,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search in inventory
  const [searchAdminProd, setSearchAdminProd] = useState('');
  const [categoryAdminFilter, setCategoryAdminFilter] = useState('All');

  // Load orders on open
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadOrders();
    }
  }, [isAdminLoggedIn]);

  // Sync settings form
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const result = await loginAdmin(passwordInput);
    setLoggingIn(false);
    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials');
    } else {
      setPasswordInput('');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: CATEGORIES[0].id,
      price: 100,
      originalPrice: undefined,
      unit: '1 Piece',
      stockQuantity: 50,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      description: '',
      isFeatured: false,
      isSpecialOffer: false,
    });
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsProductModalOpen(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const success = await saveProduct(productForm, !!editingProduct);
    if (success) {
      setIsProductModalOpen(false);
    } else {
      alert('Failed to save product in database.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store database?`)) {
      await deleteProduct(id);
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateSettings(settingsForm);
    if (success) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }
  };

  // If not logged in, show secure login card
  if (!isAdminLoggedIn) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Store Owner & Admin Portal</h2>
            <p className="text-xs text-stone-500">
              Manage Saad General Store inventory, customer orders, and shop settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-700" />
                <span>Admin Password / Security PIN</span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <span className="font-semibold text-stone-700">Security Credentials Hint:</span>
            <p>
              Default demo password: <code className="bg-stone-200 text-emerald-900 px-1 py-0.5 rounded font-mono">saadstore2026</code> or <code className="bg-stone-200 text-emerald-900 px-1 py-0.5 rounded font-mono">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter products for admin table
  const adminFilteredProducts = products.filter(p => {
    if (categoryAdminFilter !== 'All' && p.category !== categoryAdminFilter) return false;
    if (searchAdminProd.trim()) {
      const q = searchAdminProd.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-8 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                  Saad General Store Manager
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  LIVE DB
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Connected to real backend & database (products, stock counts & orders saved)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
              adminTab === 'inventory'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setAdminTab('orders');
              loadOrders();
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
              adminTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
              adminTab === 'settings'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT INVENTORY */}
        {adminTab === 'inventory' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    value={searchAdminProd}
                    onChange={(e) => setSearchAdminProd(e.target.value)}
                    placeholder="Search inventory..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={categoryAdminFilter}
                  onChange={(e) => setCategoryAdminFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={openAddModal}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Unit</th>
                      <th className="p-3.5">Stock Qty</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {adminFilteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{p.name}</p>
                            <p className="text-[11px] text-stone-500">{p.unit}</p>
                          </div>
                        </td>

                        <td className="p-3.5 text-stone-600 font-medium truncate max-w-[140px]">
                          {p.category}
                        </td>

                        <td className="p-3.5 font-bold text-stone-900">
                          Rs. {p.price.toLocaleString()}
                        </td>

                        <td className="p-3.5 text-stone-600">{p.unit}</td>

                        <td className="p-3.5">
                          <span className={`font-semibold ${p.stockQuantity <= 5 ? 'text-rose-600' : 'text-stone-800'}`}>
                            {p.stockQuantity} units
                          </span>
                        </td>

                        <td className="p-3.5">
                          {p.inStock ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              IN STOCK
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Customer Orders Register</h3>
                <p className="text-xs text-stone-500">Live orders recorded via Checkout & WhatsApp</p>
              </div>
              <button
                onClick={loadOrders}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs"
              >
                Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
                No orders received yet. Place an order on the checkout to view it here!
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const customerCleanPhone = order.customerPhone.replace(/[^0-9]/g, '');

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-stone-900 text-sm">
                            Order #{order.id}
                          </span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs text-stone-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-600">Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-300 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                            Customer Info
                          </span>
                          <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
                          <p className="text-emerald-800 font-semibold">{order.customerPhone}</p>
                          <a
                            href={`https://wa.me/${customerCleanPhone}?text=${encodeURIComponent(`Assalam-o-Alaikum ${order.customerName}, regarding your order #${order.id} with Saad General Store.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-semibold mt-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                            Delivery Destination
                          </span>
                          <p className="text-stone-800 font-medium">{order.deliveryAddress}</p>
                          <p className="text-stone-500">{order.city}, Pakistan</p>
                          {order.orderNotes && (
                            <p className="text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
                              Note: {order.orderNotes}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 text-right sm:text-right">
                          <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                            Payment Summary
                          </span>
                          <p className="text-stone-600">Subtotal: Rs. {order.subtotal.toLocaleString()}</p>
                          <p className="text-stone-600">Delivery: Rs. {order.deliveryFee.toLocaleString()}</p>
                          <p className="text-base font-extrabold text-emerald-950">
                            Total: Rs. {order.total.toLocaleString()}
                          </p>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Itemized breakdown */}
                      <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1 border border-stone-100">
                        <span className="font-bold text-stone-700 block mb-1">
                          Items in Order ({order.items.length}):
                        </span>
                        <div className="divide-y divide-stone-200">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-1 flex justify-between items-center">
                              <span>
                                {item.name} ({item.unit}) <strong className="text-stone-800">x {item.quantity}</strong>
                              </span>
                              <span className="font-semibold text-stone-900">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STORE CONFIGURATION SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-3xl">
            <h3 className="text-lg font-bold text-stone-900">Store Settings & Business Profile</h3>
            <p className="text-xs text-stone-500 mb-6">
              Customize contact numbers, address, delivery rates, and announcements shown across the website.
            </p>

            {settingsSaved && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Store configurations updated successfully!</span>
              </div>
            )}

            {/* Download Full Project ZIP Card */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 text-white shadow-md border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-5 h-5 text-amber-300 shrink-0" />
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    پروجیکٹ زپ فائل ڈاؤنلوڈ (Complete Project ZIP Archive)
                  </h4>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                  اس زپ فائل میں سعد جنرل سٹور ویب سائٹ کا مکمل سورس کوڈ، تمام پروڈکٹ امیجز، برانڈ لوگو، ایکسپریس سرور اور لوکل چلانے کا مکمل طریقہ (README.md) شامل ہے۔
                </p>
              </div>
              <a
                href="/saad-general-store.zip"
                download="saad-general-store.zip"
                className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>ڈاؤنلوڈ زپ فائل (47 MB)</span>
              </a>
            </div>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Store Brand Logo */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Store Brand Logo</h4>
                    <p className="text-xs text-stone-600">Official circular logo for Saad General Store (Pail Khushab)</p>
                  </div>
                  <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-amber-400 bg-stone-900 shrink-0 shadow-sm p-0.5">
                    <img
                      src={settingsForm.logoUrl || '/store-logo.jpg'}
                      alt="Saad General Store Logo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Logo Image URL / Path</label>
                    <input
                      type="text"
                      value={settingsForm.logoUrl || '/store-logo.jpg'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      placeholder="/store-logo.jpg"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="font-semibold text-stone-700">Upload New Logo File</label>
                    <label className="cursor-pointer px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Choose Logo File...</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setSettingsForm({ ...settingsForm, logoUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Owner Profile / Saad Arhab */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Store Owner & Host: Saad Arhab</h4>
                    <p className="text-xs text-stone-600">Store owner profile photo displayed in Meet Your Host section</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-600 bg-stone-100 shrink-0">
                    <img
                      src={settingsForm.ownerPhoto || '/owner-saad.jpg'}
                      alt="Saad Arhab"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Owner Name</label>
                    <input
                      type="text"
                      value={settingsForm.ownerName || 'Saad Arhab'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Owner Photo Path / URL</label>
                    <input
                      type="text"
                      value={settingsForm.ownerPhoto || '/owner-saad.jpg'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ownerPhoto: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                      placeholder="/owner-saad.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Official Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">WhatsApp Order Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Store Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Standard Delivery Fee (PKR)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Free Delivery Threshold (PKR)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Store Hours</label>
                <input
                  type="text"
                  value={settingsForm.openingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Configurations</span>
              </button>
            </form>
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full my-8 p-6 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-bold text-base text-stone-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product to Inventory'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProductSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Newborn Swaddle Blanket Wrap"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Packaging / Unit</label>
                    <input
                      type="text"
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      placeholder="e.g. 1 kg Pack, 500ml"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price (PKR)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Original Price (PKR)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Optional"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Stock Qty</label>
                    <input
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Product Image URL</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded accent-emerald-700"
                    />
                    <span>Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={productForm.isSpecialOffer}
                      onChange={(e) => setProductForm({ ...productForm, isSpecialOffer: e.target.checked })}
                      className="rounded accent-emerald-700"
                    />
                    <span>Special Offer / Deal</span>
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
