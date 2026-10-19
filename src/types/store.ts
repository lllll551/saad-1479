export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // in PKR
  originalPrice?: number; // for discount display
  unit: string; // e.g. "Pack of 6", "1 Piece", "240 ml"
  inStock: boolean;
  stockQuantity: number;
  image: string;
  description: string;
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  discountBadge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  orderNotes?: string;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcement: string;
  ownerName?: string;
  ownerPhoto?: string;
  logoUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
}
