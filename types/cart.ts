// types/cart.ts
import { type } from 'os';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  quantity: number;
  size: string;
  size_price: number;
  toppingList: {
    id?: number;
    name: string;
    price: number;
    checked?: boolean;
  }[];
  TotalPrice: number;
};
