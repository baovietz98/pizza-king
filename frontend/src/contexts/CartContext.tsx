// CartContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart as apiGetCart,
  addProduct as apiAddProduct,
  updateItem as apiUpdateItem,
  removeItem as apiRemoveItem,
  clearCart as apiClearCart,
} from "@/lib/cartApi";

// Define API response types
interface CartApiResponse {
  cart: {
    items: CartItemApi[];
    [key: string]: any;
  };
  sessionId?: string;
  [key: string]: any; // For any additional properties
}

interface CartItemApi {
  _id: string;
  product: string; // ID của product
  name: string;
  size?: string;
  crust?: string;
  price: number;
  quantity: number;
  image?: string;
  note?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size?: string;
  crust?: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  update: (id: string, payload: Partial<CartItem>) => Promise<void>;
  increase: (id: string) => Promise<void>;
  decrease: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra xem có session ID hoặc user đã đăng nhập không
      const sessionId = localStorage.getItem('cart_session_id');
      const token = localStorage.getItem('auth_token');
      
      // Chỉ gọi API nếu có session ID hoặc user đã đăng nhập
      if (!sessionId && !token) {
        setItems([]);
        setError(null);
        return;
      }
      
      const response = await apiGetCart() as CartApiResponse;
      
      if (!response || !response.cart || !Array.isArray(response.cart.items)) {
        console.error('Invalid cart response format:', response);
        setError('Định dạng dữ liệu giỏ hàng không hợp lệ');
        setItems([]);
        return;
      }
      
      // Map the backend response to our CartItem interface
      const mappedItems = response.cart.items.map((item: any) => ({
        id: item._id,
        productId: typeof item.product === 'string' ? item.product : item.product._id,
        name: item.name,
        size: item.size,
        crust: item.crust,
        price: item.price,
        quantity: item.quantity,
        image: (typeof item.product === 'object' && item.product?.image) || item.image || "/placeholder.jpg",
        note: item.note,
      }));
      
      setItems(mappedItems);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    try {
      await apiAddProduct({
        productId: item.productId,
        size: item.size,
        crust: item.crust,
        quantity: item.quantity,
      });
      await refreshCart();
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await apiUpdateItem(id, { quantity });
      await refreshCart();
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      throw new Error('Không thể cập nhật số lượng sản phẩm');
    }
  };

  const increase = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    await updateQuantity(id, item.quantity + 1);
  };

  const decrease = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.quantity <= 1) {
      await remove(id);
    } else {
      await updateQuantity(id, item.quantity - 1);
    }
  };

  const update = async (id: string, payload: Partial<CartItem>) => {
    try {
      await apiUpdateItem(id, payload);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update cart item:', err);
      throw new Error('Không thể cập nhật sản phẩm');
    }
  };

  const remove = async (id: string) => {
    try {
      await apiRemoveItem(id);
      await refreshCart();
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const clear = async () => {
    try {
      await apiClearCart();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      throw new Error('Không thể xóa giỏ hàng');
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        update,
        increase,
        decrease,
        remove,
        clear,
        loading,
        error,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}