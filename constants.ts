import { Product, Customer } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod_1', name: 'Amethyst Cluster', type: 'Crystal', size: 'Medium', use: 'Calming, Intuition', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1620535942100-35529f7966d4?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_2', name: 'Rose Quartz Bracelet', type: 'Bracelet', size: 'Standard', use: 'Love, Harmony', price: 25.50, imageUrl: 'https://images.unsplash.com/photo-1631049339735-2a2105112f17?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_3', name: 'Clear Quartz Necklace', type: 'Necklace', size: '18 inch', use: 'Energy Amplification', price: 60.00, imageUrl: 'https://images.unsplash.com/photo-1616012678631-1e4a5c375788?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_4', name: 'Tiger\'s Eye Ring', type: 'Ring', size: '7', use: 'Confidence, Protection', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1620837533812-a9b3a3d54f3b?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_5', name: 'Citrine Geode', type: 'Crystal', size: 'Large', use: 'Abundance, Success', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1617454041133-c1f06b5a3b0a?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_6', name: 'Black Tourmaline Pendant', type: 'Necklace', size: '20 inch', use: 'Grounding, Protection', price: 55.75, imageUrl: 'https://images.unsplash.com/photo-1616421189452-038c034a74a4?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_7', name: 'Lapis Lazuli Sphere', type: 'Crystal', size: 'Small', use: 'Wisdom, Truth', price: 75.00, imageUrl: 'https://images.unsplash.com/photo-1617131801128-011599a036dc?q=80&w=800&auto=format&fit=crop' },
  { id: 'prod_8', name: 'Jade Beaded Bracelet', type: 'Bracelet', size: 'Standard', use: 'Luck, Prosperity', price: 30.00, imageUrl: 'https://images.unsplash.com/photo-1631049339794-6330b6282855?q=80&w=800&auto=format&fit=crop' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust_1', name: 'Aarav Sharma', phone: '9876543210', email: 'aarav.sharma@example.com', shippingAddress: '123 Galaxy St, Mumbai', dob: '1985-05-20', gotra: 'Bharadwaja', rating: 5, comments: 'Regular client, prefers silver settings.' },
  { id: 'cust_2', name: 'Priya Patel', phone: '8765432109', email: 'priya.patel@example.com', shippingAddress: '456 Cosmos Ave, Delhi', dob: '1992-11-15', gotra: 'Kashyapa', rating: 4, comments: 'Interested in healing crystals.' },
  { id: 'cust_3', name: 'Rohan Mehta', phone: '7654321098', email: 'rohan.mehta@example.com', shippingAddress: '789 Starlight Rd, Bangalore', dob: '1978-02-10', rating: 5 },
];