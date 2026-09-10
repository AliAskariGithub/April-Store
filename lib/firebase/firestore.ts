// lib/firebase/firestore.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { Product, Category } from '@/types/product';
import { Order, OrderStatus } from '@/types/order';
import { UserProfile } from '@/types/user';
import { Review } from '@/types/review';
import { INITIAL_PRODUCTS } from '@/lib/data/products';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';
import { getSanityProducts } from '@/lib/sanity/queries';

const LOCAL_PRODUCTS_KEY = 'novatrend_products_cache_v5';
const LOCAL_ORDERS_KEY = 'novatrend_orders_cache_v5';
const LOCAL_REVIEWS_KEY = 'novatrend_reviews_cache_v5';
const LOCAL_CATEGORIES_KEY = 'novatrend_categories_cache_v5';
const LOCAL_USERS_KEY = 'novatrend_users_cache_v5';

// Seed demo orders: NONE. Only real placed orders from checkout are displayed.
const INITIAL_DEMO_ORDERS: Order[] = [];


const INITIAL_DEMO_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    productId: 'prod-101',
    userId: 'user-001',
    userDisplayName: 'Ayesha Siddiqui',
    rating: 5,
    title: 'Breathtaking drape and pure raw silk quality',
    body: 'The emerald tone is deep and regal. The wrap cut hugs the waist gracefully without clinging. Received endless compliments at my sister’s reception.',
    size: 'M',
    verified: true,
    helpful: 12,
    createdAt: '2024-10-10T12:00:00.000Z',
  },
  {
    id: 'rev-002',
    productId: 'prod-101',
    userId: 'user-002',
    userDisplayName: 'Maham Tariq',
    rating: 5,
    title: 'Quiet luxury at its best',
    body: 'Tailoring is flawless. Delivery to Lahore took 3 days in a sturdy luxury box with garment bag. Highly recommended!',
    size: 'S',
    verified: true,
    helpful: 8,
    createdAt: '2024-10-14T15:30:00.000Z',
  },
  {
    id: 'rev-003',
    productId: 'prod-102',
    userId: 'user-003',
    userDisplayName: 'Sana Mir',
    rating: 5,
    title: 'Extremely soft cashmere blend',
    body: 'Warm, featherlight, and dramatically cut. It transforms any basic outfit into high fashion.',
    size: 'Free Size',
    verified: true,
    helpful: 19,
    createdAt: '2024-10-18T09:40:00.000Z',
  },
];

function parseDateMs(val: any): number {
  if (!val) return 0;
  if (typeof val === 'string' || typeof val === 'number') return new Date(val).getTime();
  if (typeof val === 'object' && 'seconds' in val) return Number(val.seconds) * 1000;
  return 0;
}

// Helper to initialize local storage cache if empty
function initializeLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LOCAL_PRODUCTS_KEY)) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LOCAL_CATEGORIES_KEY)) {
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
  }
  const FAKE_ORDER_IDS = new Set(['ord-88910', 'ord-88911', 'ord-101', 'ord-102', 'cust-demo-123']);
  const cachedOrders = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (cachedOrders) {
    try {
      const parsed = JSON.parse(cachedOrders) as Order[];
      const realOnly = parsed.filter((o) => !FAKE_ORDER_IDS.has(o.id) && !FAKE_ORDER_IDS.has(o.userId));
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(realOnly));
    } catch {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([]));
    }
  } else {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_REVIEWS_KEY)) {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(INITIAL_DEMO_REVIEWS));
  }
}

// ---------------- PRODUCTS ----------------

export async function getProducts(): Promise<Product[]> {
  let firestoreProducts: Product[] = [];
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        firestoreProducts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      }
    }
  } catch (error) {
    console.warn('Firestore products fetch fallback:', error);
  }

  let localProducts: Product[] = [];
  if (typeof window !== 'undefined') {
    initializeLocalStorage();
    const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (cached) {
      try {
        localProducts = JSON.parse(cached) as Product[];
      } catch {
        localProducts = [];
      }
    }
  }

  // Deduplicate and merge: custom products take priority, followed by INITIAL_PRODUCTS
  const mergedMap = new Map<string, Product>();
  
  // 1. Initial catalog
  for (const p of INITIAL_PRODUCTS) {
    mergedMap.set(p.id, p);
  }
  // 2. Client cached products
  for (const p of localProducts) {
    mergedMap.set(p.id, p);
  }
  // 3. Firestore cloud products
  for (const p of firestoreProducts) {
    mergedMap.set(p.id, p);
  }
  // 4. Sanity Studio CMS products (highest priority CMS source)
  try {
    const sanityProducts = await getSanityProducts();
    for (const p of sanityProducts) {
      mergedMap.set(p.id, p);
    }
  } catch (e) {
    console.warn('Sanity catalog load skipped:', e);
  }

  const result = Array.from(mergedMap.values());
  return result.sort((a, b) => parseDateMs(b.createdAt) - parseDateMs(a.createdAt));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  const id = product.id || `prod-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const fullProduct: Product = {
    id,
    slug: product.slug || product.name?.toLowerCase().replace(/\s+/g, '-') || `prod-${id}`,
    name: product.name || 'Untitled Luxury Garment',
    description: product.description || '',
    price: product.price || 0,
    salePrice: product.salePrice,
    category: product.category || 'dresses',
    subcategory: product.subcategory,
    images: product.images && product.images.length > 0 ? product.images : [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop'
    ],
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L'],
    colors: product.colors || ['Black', 'Emerald'],
    stock: product.stock || { S: 5, M: 5, L: 5 },
    rating: product.rating || 5.0,
    reviewCount: product.reviewCount || 0,
    tags: product.tags || ['luxury'],
    featured: product.featured || false,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      // Clean undefined fields so Firestore setDoc does not throw
      const cleanDoc = Object.fromEntries(
        Object.entries(fullProduct).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'products', id), cleanDoc);
    }
  } catch (error) {
    console.warn('Firestore save product fallback to local:', error);
  }

  if (typeof window !== 'undefined') {
    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index >= 0) {
      products[index] = fullProduct;
    } else {
      products.unshift(fullProduct);
    }
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));

    // Sync to Sanity CMS via API route
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullProduct),
    }).catch((err) => console.warn('Sanity CMS sync warning:', err));
  }

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      await deleteDoc(doc(db, 'products', id));
    }
  } catch (error) {
    console.warn('Firestore delete fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const products = await getProducts();
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));

    // Delete from Sanity CMS via API route
    fetch(`/api/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Sanity CMS delete warning:', err));
  }
}

export const createProduct = saveProduct;
export const updateProduct = saveProduct;

// ---------------- ORDERS ----------------

export async function getOrders(userId?: string): Promise<Order[]> {
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      let q = query(collection(db, 'orders'));
      if (userId) {
        q = query(collection(db, 'orders'), where('userId', '==', userId));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
        return list.sort((a, b) => parseDateMs(b.createdAt) - parseDateMs(a.createdAt));
      }
    }
  } catch (error) {
    console.warn('Firestore orders fetch fallback:', error);
  }

  if (typeof window !== 'undefined') {
    initializeLocalStorage();
    const cached = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (cached) {
      const orders = JSON.parse(cached) as Order[];
      const realOnly = orders.filter((o) => !['ord-88910', 'ord-88911', 'ord-101', 'ord-102'].includes(o.id));
      if (userId) return realOnly.filter((o) => o.userId === userId);
      return realOnly;
    }
  }
  return [];
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      await deleteDoc(doc(db, 'orders', orderId));
    }
  } catch (error) {
    console.warn('Firestore delete order fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const orders = await getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
  }
}


export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'timeline'> & { timeline?: Order['timeline'] }): Promise<Order> {
  const orderId = `ord-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    trackingNumber: `APR-${new Date().toLocaleDateString('en-GB').replace(/\//g, '').toUpperCase()}-${orderId}`,
    timeline: orderData.timeline || [
      {
        status: orderData.status,
        message: orderData.paymentMethod === 'online' 
          ? 'Order placed. Payment receipt submitted for verification.'
          : 'Order placed with Cash on Delivery.',
        timestamp: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    }
  } catch (error) {
    console.warn('Firestore create order fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const orders = await getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<void> {
  const now = new Date().toISOString();
  const event = {
    status,
    message: note || `Order status updated to ${status.toUpperCase()}`,
    timestamp: now,
  };

  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.warn('Firestore update order fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const orders = await getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = now;
      order.timeline.push(event);
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    }
  }
}

export async function updateOrderReceiptVerification(orderId: string, verified: boolean, note: string): Promise<void> {
  const now = new Date().toISOString();
  if (typeof window !== 'undefined') {
    const orders = await getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.receiptVerified = verified;
      order.receiptNote = note;
      order.paymentStatus = verified ? 'confirmed' : 'failed';
      if (verified && order.status === 'pending') {
        order.status = 'confirmed';
        order.timeline.push({
          status: 'confirmed',
          message: `Payment confirmed by Admin: ${note}`,
          timestamp: now,
        });
      }
      order.updatedAt = now;
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    }
  }
}

export const verifyPaymentReceipt = updateOrderReceiptVerification;

// ---------------- REVIEWS ----------------

export async function getReviews(productId: string): Promise<Review[]> {
  let firestoreReviews: Review[] = [];
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        firestoreReviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
      }
    }
  } catch (error) {
    console.warn('Firestore reviews fetch fallback:', error);
  }

  let localReviews: Review[] = [];
  if (typeof window !== 'undefined') {
    initializeLocalStorage();
    const cached = localStorage.getItem(LOCAL_REVIEWS_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Review[];
        localReviews = parsed.filter((r) => r.productId === productId);
      } catch {
        localReviews = [];
      }
    }
  }

  const demoReviews = INITIAL_DEMO_REVIEWS.filter((r) => r.productId === productId);

  // Merge and deduplicate by ID: Firestore reviews take highest priority, then local, then demo
  const map = new Map<string, Review>();
  for (const r of demoReviews) {
    map.set(r.id, r);
  }
  for (const r of localReviews) {
    map.set(r.id, r);
  }
  for (const r of firestoreReviews) {
    map.set(r.id, r);
  }

  const merged = Array.from(map.values());
  return merged.sort((a, b) => parseDateMs(b.createdAt) - parseDateMs(a.createdAt));
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Promise<Review> {
  const id = `rev-${Date.now().toString(36)}`;
  const fullReview: Review = {
    ...review,
    id,
    helpful: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const cleanDoc = Object.fromEntries(
        Object.entries(fullReview).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'reviews', id), cleanDoc);
    }
  } catch (error) {
    console.warn('Firestore add review fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_REVIEWS_KEY);
    const reviews: Review[] = cached ? JSON.parse(cached) : [...INITIAL_DEMO_REVIEWS];
    reviews.unshift(fullReview);
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  }

  return fullReview;
}

// ---------------- CATEGORIES ----------------

export async function getCategories(): Promise<Category[]> {
  if (typeof window !== 'undefined') {
    initializeLocalStorage();
    const cached = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (cached) return JSON.parse(cached) as Category[];
  }
  return INITIAL_CATEGORIES;
}

// ---------------- USERS ----------------

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(LOCAL_USERS_KEY);
          const users: Record<string, UserProfile> = cached ? JSON.parse(cached) : {};
          users[uid] = data;
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        }
        return data;
      }
    }
  } catch (error) {
    console.warn('Firestore get user profile fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_USERS_KEY);
    if (cached) {
      try {
        const users = JSON.parse(cached) as Record<string, UserProfile>;
        if (users[uid]) return users[uid];
      } catch {
        // ignore
      }
    }
  }
  return null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    if (db && db.app.options.apiKey && db.app.options.apiKey !== 'demo-api-key') {
      const cleanDoc = Object.fromEntries(
        Object.entries(profile).filter(([_, v]) => v !== undefined)
      );
      await setDoc(doc(db, 'users', profile.uid), cleanDoc, { merge: true });
    }
  } catch (error) {
    console.warn('Firestore save user profile fallback:', error);
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_USERS_KEY);
    const users: Record<string, UserProfile> = cached ? JSON.parse(cached) : {};
    users[profile.uid] = profile;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }
}

