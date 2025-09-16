import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// definiendo tipos
export interface WishListItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  quantity: number;
  selectedColor?: number;
  selectedSize?: number;
  maxQuantity: number;
  image?: string;
  selectedColorName?: string;
  selectedSizeName?: string;
}

interface WishListState {
  items: WishListItem[];
  totalItems: number;
  totalPrice: number;
}

// initialstate 
const initialState: WishListState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// calcular totales
const calculateTotals = (wishItems: WishListItem[]) => {
  const totalItems = wishItems.reduce((acc, wishItem) => acc + wishItem.quantity, 0);
  const totalPrice = wishItems.reduce((acc, wishItem) => acc + (wishItem.price * wishItem.quantity), 0);
  return { totalItems, totalPrice };
};

const wishListSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishList: (state, action: PayloadAction<WishListItem>) => {
      const newItem = action.payload;

      const existingItemIndex = state.items.findIndex(
        item => 
          item.id === newItem.id &&
          item.selectedColor === newItem.selectedColor &&
          item.selectedSize === newItem.selectedSize
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.maxQuantity
        );
        state.items[existingItemIndex].quantity = newQuantity;
      } else {
        state.items.push(newItem);
      }

      // recalculamos
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    removeFromWishList: (state, action: PayloadAction<{ 
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

      // recalculamos
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    clearWishList: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToWishList, removeFromWishList, clearWishList } = wishListSlice.actions;
export default wishListSlice.reducer;
