import { createSlice } from "@reduxjs/toolkit";

// definiendo tipos
export interface WishListItem {
    id: number;
    name: string;
    slug: string;
    price: number;
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
}


// const wishListSlice = createSlice({
//     name: 'wishlist',
// })