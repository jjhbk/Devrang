
export interface Product {
  id: string;
  name: string;
  type: string;
  size: string;
  use: string;
  price: number;
  imageUrl: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  shippingAddress?: string;
  dob?: string;
  gotra?: string;
  rating?: number;
  comments?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

export enum BookingStatus {
  PendingPayment = 'Pending Payment',
  Paid = 'Paid',
  Delivered = 'Delivered'
}

export interface Booking {
  id: string;
  customer: Customer | 'self';
  items: CartItem[];
  total: number;
  status: BookingStatus;
  createdAt: Date;
  paymentLink?: string;
}

export interface Astrologer {
  id: string;
  name: string;
  email: string;
}
