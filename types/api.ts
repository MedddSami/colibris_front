
export type UserRole = 'particulier' | 'entreprise' | 'admin';
export type UserStatus = 'accepted' | 'pending';
export type BadgeType = 'Colibri Bee' | 'Colibri Saphir' | 'Colibri Malachite';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'reported';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';
export type DeliveryOption = 'custom' | 'collection';
export type PaymentMethod = 'money' | 'points' | 'hybrid';
export type OrderType = 'shop' | 'refill';
export type PackStatus = 'pending' | 'granted';
export type ActionStatus = 'active' | 'completed' | 'expired';
export type CollectionType =
  | "Plastique"
  | "Papier"
  | "Verre"
  | "Canettes"
  | "Mixte"
  | "Autre";

export type EstimatedVolume =
  | "Un sac (20-30L)"
  | "Carton (30-50L)"
  | "Plusieurs sacs"
  | "Autre";

export interface Category {
    _id: string;
    name: string;
    description?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    number: string[];
    location: string;
    role: UserRole;
    isVerified: boolean;
    status: UserStatus;
    profileImage: string;
    points: number;
    freeCollectes?: number;
    CO2Saved: number;
    badge: BadgeType;
    latitude: string;
    longitude: string;
    purchasedPacks: PurchasedPack[];
}

export interface PurchasedPack {
    packId: string | Pack;
    status: PackStatus;
    purchaseDate: string;
    location: string;
    deliveryOption?: DeliveryOption;
    deliveryDate?: string;
    accessUntil?: string;
}

export interface Pack {
    _id: string;
    name: string;
    description: string;
    price: number;
    points: number;
    photo: string;
    isDisplayed: boolean;
    period: number;
    collecteNumber: number;
}

export interface Article {
    _id: string;
    nom: string;
    quantite: number;
    description: string;
    prix: number;
    points: number;
    photo: string;
    stock: number;
    CO2: number;
    category: Category;
}

export interface RefillArticle extends Omit<Article, 'CO2'> {
    CO2_refill: number;
}

export interface Collection {
    _id: string;
    title: string;
    date: string;
    time: [string, string];
    maxCollection: number;
    prix: number;
    booked: number;
}

export interface Reservation {
    _id: string;
    user: string | User;
    collection: string | Collection;
    reservationDate: string;
    status: ReservationStatus;
    suggestedCollection?: string | Collection | null;
    isPaid: boolean;
    tempLocation?: string;
    usedFreeCollecte: boolean;
    lat?: string;
    lng?: string;
    tempPhone?: string;
    collectionType: CollectionType;
    estimatedVolume?: string;
    selectedTime?: string;
}

export interface OrderItem {
    article: string | Article | RefillArticle;
    modelType: 'Article' | 'RefillArticle';
    quantity: number;
    price: number;
    points: number;
    volume?: string;
    CO2?: number;
}

export interface Order {
    _id: string;
    user: string | User;
    items: OrderItem[];
    totalPrice: number;
    totalPoints: number;
    deliveryOption: string;
    deliveryDate: string;
    deliveryFee: number;
    paidWithPoints: boolean;
    pointsUsed: number;
    paymentMethod: PaymentMethod;
    type: OrderType;
    userInfo: {
        name: string;
        email: string;
        number: string;
        location: string;
        location2?: string;
    };
    status: OrderStatus;
}

export interface Blog {
    _id: string;
    title: string;
    cont: string;
    image: string;
    createdAt: string;
}

export interface Chiffre {
    _id: string;
    id: number;
    valeur: string;
    label: string;
    numericValue: number;
    suffix: string;
    iconName: string;
}

export interface Action {
    _id: string;
    title: string;
    description: string;
    targetPoints: number;
    currentPoints: number;
    image: string;
    deadline: string;
    status: ActionStatus;
}

export interface Metrics {
    totalUsers: number;
    totalReservations: number;
    totalCollections: number;
    shopRevenue: number;
    donatedPoints: number;
    totalActions: number;
}

export interface Notification {
    _id: string;
    user: string;
    message: string;
    type: string;
    isRead: boolean;
    timestamp: string;
}

export interface Transaction {
    _id: string;
    user: string | User;
    items: any[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

export interface BadgeCriteria {
  _id: string;
  colibriBeeMax: number;
  colibriSaphirMin: number;
  colibriSaphirMax: number;
  colibriMalachiteMin: number;
}

export interface CartItem {
  article: Article;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  totalPoints: number;
}

export interface RefillCartItem {
  article: RefillArticle;
  quantity: number;
  volume: 1 | 2 | 5;
}

export interface RefillCart {
  _id: string;
  user: string;
  items: RefillCartItem[];
  totalPrice: number;
  totalPoints: number;
}