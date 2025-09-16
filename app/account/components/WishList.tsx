"use client";

import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishList, WishListItem } from '@/app/store/slices/wishlist/wishList';
import { addToCart, CartItem } from '@/app/store/slices/cart/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface RootState {
  wishlist: {
    items: WishListItem[];
  };
}

export function WishlistContent() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleRemoveFromWishlist = (itemId: number, color: number | undefined, size: number | undefined) => {
    dispatch(removeFromWishList({
      id: itemId,
      selectedColor: color,
      selectedSize: size
    }));
  };

  const handleAddToCart = (item: CartItem) => {
    dispatch(addToCart(item));
    console.log('Agregando al carrito:', item);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
        <h2 className="font-bold text-xl pb-3 dark:text-white">Mi Lista de Deseos</h2>
        <div className="text-center py-16">
          <div className="bg-purple-100 dark:bg-purple-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Tu lista de deseos está vacía</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Guarda los productos que te gusten para verlos más tarde</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-purple-600 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-xl dark:text-white">Mi Lista de Deseos</h2>
        <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {wishlistItems.map((item, index) => (
          <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="bg-white dark:bg-[#3a393b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen del producto */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
              )}

              {/* Botón de eliminar */}
              <button
                onClick={() => handleRemoveFromWishlist(item.id, item.selectedColor, item.selectedSize)}
                className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400">
                  <path d="M18 6 6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Información del producto */}
            <div className="p-4">
              <Link href={`/products/${item.slug}`} className="block">
                <h3 className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                  {item.name}
                </h3>
              </Link>

              {/* Precio */}
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-3">
                S/ {(item.price * item.quantity).toFixed(2)}
              </p>

              {/* Detalles de selección */}
              <div className="space-y-2 mb-4">
                {item.selectedColorName && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Color:</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.selectedColorName}</span>
                  </div>
                )}
                {item.selectedSizeName && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Talla:</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.selectedSizeName}</span>
                  </div>
                )}
                {item.quantity && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad:</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.quantity}</span>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 justify-between">
                <button
                  onClick={() => {
                    handleAddToCart(item),
                    handleRemoveFromWishlist(item.id, item.selectedColor, item.selectedSize);
                  }}
                  className="bg-purple-600 dark:bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <div className="flex items-center cursor-pointer group hover:scale-105 duration-300">
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover:transition-all" />
                    <span className='xxl:hidden'>
                      Agregar al carrito
                    </span>
                  </div>
                </button>
                <Link
                  href={`/products/${item.slug}`}
                  className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors text-sm font-medium text-center"
                >
                  Ver producto
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para limpiar toda la lista */}
      {wishlistItems.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres eliminar todos los productos de tu lista de deseos?')) {
                wishlistItems.forEach(item => {
                  handleRemoveFromWishlist(item.id, item.selectedColor, item.selectedSize);
                });
              }
            }}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            Limpiar lista de deseos
          </button>
        </div>
      )}
    </div>
  );
}