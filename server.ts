import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './server/defaultData.ts';
import { Product, Order, StoreSettings, ContactMessage } from './src/types/store.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static public folder serving
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const DIST_DIR = path.resolve(__dirname, 'dist');
app.use('/products', express.static(path.resolve(PUBLIC_DIR, 'products')));
app.use(express.static(PUBLIC_DIR));

// Persistent Database storage
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'store.json');

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  contacts: ContactMessage[];
  adminToken: string;
}

const DEFAULT_ADMIN_PASS = 'saadstore2026';
const CURRENT_ADMIN_TOKEN = 'sgs_adm_' + Buffer.from('saad-admin-authorized-session').toString('base64');

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialOrders: Order[] = [
    {
      id: "SGS-1001",
      items: [
        {
          productId: "wbag-01",
          name: "Structured Premium Top-Handle Ladies Handbag",
          price: 2750,
          quantity: 1,
          unit: "Medium-Large Handbag",
          image: "/products/wbag-01.jpg",
        },
        {
          productId: "lace-01",
          name: "Royal Zari & Sequence Border Fancy Lace",
          price: 1250,
          quantity: 1,
          unit: "9 Yards Reel",
          image: "/products/lace-01.jpg",
        }
      ],
      subtotal: 4000,
      deliveryFee: 0,
      total: 4000,
      customerName: "Rashida Begum",
      customerPhone: "0314-3084561",
      deliveryAddress: "Near Jamia Masjid, Main Bazar, Pail",
      city: "Pail, Khushab",
      orderNotes: "Please pack nicely in gift box.",
      paymentMethod: "Cash on Delivery",
      status: "Delivered",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "SGS-1002",
      items: [
        {
          productId: "baby-01",
          name: "Newborn Baby Complete Welcome Gift Set",
          price: 1650,
          quantity: 1,
          unit: "7 Pieces Set",
          image: "/products/baby-01.jpg",
        },
        {
          productId: "cosm-01",
          name: "Matte Velvet Long-Lasting Lipstick 6-Shade Set",
          price: 1150,
          quantity: 1,
          unit: "Set of 6 Lipsticks",
          image: "/products/cosm-01.jpg",
        }
      ],
      subtotal: 2800,
      deliveryFee: 0,
      total: 2800,
      customerName: "Muhammad Farooq",
      customerPhone: "0314-5544332",
      deliveryAddress: "Hospital Road, Pail",
      city: "Pail, Khushab",
      orderNotes: "Deliver in the evening",
      paymentMethod: "Cash on Delivery",
      status: "Confirmed",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    }
  ];

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        // Strip any legacy Urdu fields for clean English output
        const cleanProducts = parsed.products.map((p: any) => {
          const { nameUrdu, descriptionUrdu, ...rest } = p;
          return rest;
        });
        const cleanSettings = { ...DEFAULT_SETTINGS, ...parsed.settings };
        delete (cleanSettings as any).storeNameUrdu;
        delete (cleanSettings as any).taglineUrdu;
        delete (cleanSettings as any).openingHoursUrdu;
        delete (cleanSettings as any).announcementUrdu;

        const cleanOrders = (parsed.orders || []).map((o: any) => ({
          ...o,
          items: (o.items || []).map((it: any) => {
            const { nameUrdu, ...cleanIt } = it;
            return cleanIt;
          })
        }));

        const cleanDb: DatabaseSchema = {
          products: cleanProducts,
          orders: cleanOrders.length > 0 ? cleanOrders : initialOrders,
          settings: cleanSettings,
          contacts: parsed.contacts || [],
          adminToken: CURRENT_ADMIN_TOKEN,
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(cleanDb, null, 2), 'utf-8');
        return cleanDb;
      }
    } catch (e) {
      console.error('Failed reading existing store.json, re-initializing', e);
    }
  }

  const dbData: DatabaseSchema = {
    products: DEFAULT_PRODUCTS,
    orders: initialOrders,
    settings: DEFAULT_SETTINGS,
    contacts: [],
    adminToken: CURRENT_ADMIN_TOKEN,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  return dbData;
}

let db = initDatabase();

function saveDatabase() {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Authentication middleware for Admin
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== db.adminToken && token !== CURRENT_ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
  }
  next();
}

// ----------------- API ROUTES -----------------

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || (password !== DEFAULT_ADMIN_PASS && password !== 'admin123')) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }
  return res.json({ token: CURRENT_ADMIN_TOKEN, message: 'Admin authenticated successfully' });
});

// Admin verify token
app.post('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && (authHeader === `Bearer ${CURRENT_ADMIN_TOKEN}` || authHeader === `Bearer ${db.adminToken}`)) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false });
});

// Get store settings
app.get('/api/settings', (_req, res) => {
  res.json(db.settings);
});

// Update store settings (Admin only)
app.put('/api/settings', requireAdmin, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase();
  res.json({ message: 'Settings updated successfully', settings: db.settings });
});

// Upload or update owner photo directly
app.post('/api/owner-photo', (req, res) => {
  try {
    const { imageBase64, imageUrl } = req.body;
    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    let photoUrl = '';
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const publicPath = path.resolve(PUBLIC_DIR, 'owner-saad.jpg');
      const productsPath = path.resolve(PUBLIC_DIR, 'products', 'owner-saad.jpg');
      fs.writeFileSync(publicPath, buffer);
      try {
        fs.writeFileSync(productsPath, buffer);
      } catch (_) {}
      photoUrl = `/owner-saad.jpg?t=${Date.now()}`;
    } else if (imageUrl) {
      photoUrl = imageUrl;
    }

    db.settings.ownerPhoto = photoUrl;
    db.settings.ownerName = 'Saad Arhab';
    saveDatabase();

    return res.json({ success: true, ownerPhoto: photoUrl });
  } catch (err: any) {
    console.error('Error saving owner photo:', err);
    return res.status(500).json({ error: 'Failed to save owner photo' });
  }
});

// Upload or update store logo
app.post('/api/store-logo', (req, res) => {
  try {
    const { imageBase64, imageUrl } = req.body;
    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: 'No logo image data provided' });
    }

    let logoUrl = '';
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const publicPath = path.resolve(PUBLIC_DIR, 'store-logo.jpg');
      fs.writeFileSync(publicPath, buffer);
      try {
        const distPath = path.resolve(DIST_DIR, 'store-logo.jpg');
        if (fs.existsSync(DIST_DIR)) {
          fs.writeFileSync(distPath, buffer);
        }
      } catch (_) {}
      logoUrl = `/store-logo.jpg?t=${Date.now()}`;
    } else if (imageUrl) {
      logoUrl = imageUrl;
    }

    db.settings.logoUrl = logoUrl;
    saveDatabase();

    return res.json({ success: true, logoUrl });
  } catch (err: any) {
    console.error('Error saving store logo:', err);
    return res.status(500).json({ error: 'Failed to save store logo' });
  }
});

// Download full project ZIP
app.get(['/api/download-zip', '/download', '/download-zip'], (_req, res) => {
  const zipPath = path.resolve(PUBLIC_DIR, 'saad-general-store.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'saad-general-store.zip');
  }
  return res.status(404).json({ error: 'Zip archive not found' });
});

// Get all products
app.get('/api/products', (_req, res) => {
  res.json(db.products);
});

// Add new product (Admin only)
app.post('/api/products', requireAdmin, (req, res) => {
  const {
    name,
    category,
    price,
    originalPrice,
    unit,
    stockQuantity,
    image,
    description,
    isFeatured,
    isSpecialOffer,
    discountBadge
  } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const newProduct: Product = {
    id: 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: String(name).trim(),
    category: String(category).trim(),
    price: Number(price) || 0,
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    unit: String(unit || '1 unit').trim(),
    inStock: stockQuantity !== undefined ? Number(stockQuantity) > 0 : true,
    stockQuantity: Number(stockQuantity) >= 0 ? Number(stockQuantity) : 50,
    image: String(image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80').trim(),
    description: String(description || '').trim(),
    isFeatured: Boolean(isFeatured),
    isSpecialOffer: Boolean(isSpecialOffer),
    discountBadge: discountBadge ? String(discountBadge) : undefined,
  };

  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

// Update product (Admin only)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const updatedStock = req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) : existing.stockQuantity;

  db.products[index] = {
    ...existing,
    ...req.body,
    stockQuantity: updatedStock,
    inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : updatedStock > 0,
  };

  saveDatabase();
  res.json(db.products[index]);
});

// Delete product (Admin only)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = db.products.splice(index, 1)[0];
  saveDatabase();
  res.json({ message: 'Product deleted', product: deleted });
});

// Create new customer order (Public Checkout)
app.post('/api/orders', (req, res) => {
  const {
    items,
    customerName,
    customerPhone,
    deliveryAddress,
    city,
    orderNotes,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart cannot be empty' });
  }

  if (!customerName || !customerPhone || !deliveryAddress) {
    return res.status(400).json({ error: 'Customer name, phone, and delivery address are required' });
  }

  // Calculate subtotal from products in DB to guarantee price authenticity
  let subtotal = 0;
  const verifiedItems = items.map((item: any) => {
    const p = db.products.find(prod => prod.id === item.productId);
    const itemPrice = p ? p.price : (Number(item.price) || 0);
    const itemQty = Math.max(1, Number(item.quantity) || 1);
    subtotal += itemPrice * itemQty;

    // Deduct stock if available
    if (p && p.stockQuantity !== undefined) {
      p.stockQuantity = Math.max(0, p.stockQuantity - itemQty);
      if (p.stockQuantity === 0) {
        p.inStock = false;
      }
    }

    return {
      productId: item.productId,
      name: p ? p.name : item.name,
      price: itemPrice,
      quantity: itemQty,
      unit: p ? p.unit : (item.unit || '1 unit'),
      image: p ? p.image : (item.image || ''),
    };
  });

  const deliveryFee = subtotal >= db.settings.freeDeliveryThreshold ? 0 : db.settings.deliveryFee;
  const total = subtotal + deliveryFee;

  const orderId = 'SGS-' + (Math.floor(1000 + Math.random() * 9000)).toString();

  const newOrder: Order = {
    id: orderId,
    items: verifiedItems,
    subtotal,
    deliveryFee,
    total,
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    deliveryAddress: String(deliveryAddress).trim(),
    city: String(city || db.settings.city || 'Pail, Khushab').trim(),
    orderNotes: orderNotes ? String(orderNotes).trim() : undefined,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDatabase();

  res.status(201).json(newOrder);
});

// Get all orders (Admin only)
app.get('/api/orders', requireAdmin, (_req, res) => {
  res.json(db.orders);
});

// Update order status (Admin only)
app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  saveDatabase();
  res.json({ message: 'Order status updated', order });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required' });
  }

  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now().toString(36),
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: email ? String(email).trim() : undefined,
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
  };

  db.contacts.unshift(newMsg);
  saveDatabase();
  res.status(201).json({ message: 'Thank you! Your message has been received.', data: newMsg });
});

// ----------------- VITE INTEGRATION -----------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saad General Store backend & frontend running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
