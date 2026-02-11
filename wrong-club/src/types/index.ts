export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
};