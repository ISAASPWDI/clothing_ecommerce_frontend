// app/hooks/useCart.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  increaseQuantity,
  decreaseQuantity,
  type CartItem 
} from '@/app/store/slices/cart/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart);

  const addItemToCart = (item: CartItem) => {
    dispatch(addToCart(item));
  };

  const removeItemFromCart = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(removeFromCart({ id, selectedColor, selectedSize }));
  };

  const updateItemQuantity = (id: number, quantity: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(updateQuantity({ id, quantity, selectedColor, selectedSize }));
  };

  const increaseItemQuantity = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(increaseQuantity({ id, selectedColor, selectedSize }));
  };

  const decreaseItemQuantity = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(decreaseQuantity({ id, selectedColor, selectedSize }));
  };

  const clearAllItems = () => {
    dispatch(clearCart());
  };

  const getItemQuantity = (id: number, selectedColor?: number, selectedSize?: number) => {
    const item = cartState.items.find(
      item => item.id === id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );
    return item?.quantity || 0;
  };

  const isItemInCart = (id: number, selectedColor?: number, selectedSize?: number) => {
    return cartState.items.some(
      item => item.id === id && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
    );
  };

  return {
    // Estado del carrito
    items: cartState.items,
    totalItems: cartState.totalItems,
    totalPrice: cartState.totalPrice,
    
    // Acciones
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearAllItems,
    
    // Utilidades
    getItemQuantity,
    isItemInCart,
  };
};