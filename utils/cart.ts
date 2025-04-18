// カートデータの型（必要に応じて調整）
export interface GuestCartItem {
  itemId: number;
  sizeId: number;
  toppingIds: number[];
  quantity: number;
}

const CART_KEY = 'guest_cart';

// カートをローカルストレージに保存
export const saveCartToLocalStorage = (cartData: GuestCartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartData));
};

// ローカルストレージからカートを取得
export const getCartFromLocalStorage = (): GuestCartItem[] => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

// ローカルストレージのカートを削除（ログイン後や注文完了時など）
export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
};
