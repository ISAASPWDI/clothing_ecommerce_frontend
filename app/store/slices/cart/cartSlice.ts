import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  quantity: number;
  selectedColor?: number;
  selectedSize?: number;
  maxQuantity: number; // cantidad disponible en BD
  image?: string;
  selectedColorName?: string;
selectedSizeName?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => 
          item.id === newItem.id && 
          item.selectedColor === newItem.selectedColor && 
          item.selectedSize === newItem.selectedSize
      );

      if (existingItemIndex >= 0) {
        // Si el item ya existe, aumenta la cantidad sin exceder el stock
        const existingItem = state.items[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.maxQuantity
        );
        state.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Si es un item nuevo, lo agrega al carrito
        state.items.push(newItem);
      }

      // Recalcula totales
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    removeFromCart: (state, action: PayloadAction<{ 
      id: number; 
      selectedColor?: number; 
      selectedSize?: number; 
    }>) => {
      const { id, selectedColor, selectedSize } = action.payload;
      state.items = state.items.filter(
        item => !(
          item.id === id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
        )
      );

      // Recalcula totales
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    updateQuantity: (state, action: PayloadAction<{ 
      id: number; 
      selectedColor?: number; 
      selectedSize?: number; 
      quantity: number; 
    }>) => {
      const { id, selectedColor, selectedSize, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        item => 
          item.id === id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      if (itemIndex >= 0) {
        // Asegura que la cantidad esté entre 1 y el stock máximo
        const clampedQuantity = Math.max(1, Math.min(quantity, state.items[itemIndex].maxQuantity));
        state.items[itemIndex].quantity = clampedQuantity;

        // Recalcula totales
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    increaseQuantity: (state, action: PayloadAction<{ 
      id: number; 
      selectedColor?: number; 
      selectedSize?: number; 
    }>) => {
      const { id, selectedColor, selectedSize } = action.payload;
      const itemIndex = state.items.findIndex(
        item => 
          item.id === id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        if (item.quantity < item.maxQuantity) {
          item.quantity += 1;

          // Recalcula totales
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
        }
      }
    },

    decreaseQuantity: (state, action: PayloadAction<{ 
      id: number; 
      selectedColor?: number; 
      selectedSize?: number; 
    }>) => {
      const { id, selectedColor, selectedSize } = action.payload;
      const itemIndex = state.items.findIndex(
        item => 
          item.id === id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
      );

      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;

          // Recalcula totales
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;