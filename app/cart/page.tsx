'use client'

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} from '@/app/store/slices/cart/cartSlice';
import Layout from '@/app/shop/LayoutContent';
import { RootState } from '../store/store';
import { useProductContext } from '@/contexts/ProductContext';

// 1. Importamos los componentes de Shadcn UI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CartPage() {
  const { navigateToProduct } = useProductContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

  const handleRemoveItem = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(removeFromCart({ id, selectedColor, selectedSize }));
  };

  const handleIncreaseQuantity = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(increaseQuantity({ id, selectedColor, selectedSize }));
  };

  const handleDecreaseQuantity = (id: number, selectedColor?: number, selectedSize?: number) => {
    dispatch(decreaseQuantity({ id, selectedColor, selectedSize }));
  };

  // Eliminamos handleClearCart antiguo ya que la lógica va dentro del modal

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      // Nota: Aquí también podrías usar un toast o un modal simple en lugar de alert()
      alert('Tu carrito está vacío');
      return;
    }

    const cartData = { items, totalItems, totalPrice };
    document.cookie = `cart=${JSON.stringify(cartData)}; path=/; max-age=${60 * 60 * 24 * 7}`;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">Agrega algunos productos para comenzar</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continuar comprando
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/shop"
            className="flex items-center text-purple-600 dark:text-purple-600 hover:text-purple-700 dark:hover:text-purple-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continuar comprando
          </Link>

          {items.length > 0 && (
            /* 2. Implementación del AlertDialog */
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">
                  Vaciar carrito
                </button>
              </AlertDialogTrigger>

              {/* Lógica Dual: Blanco por defecto | #302f31 en modo oscuro */}
              <AlertDialogContent className="bg-white dark:bg-[#302f31] dark:border-[#302f31]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">
                    ¿Estás absolutamente seguro?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 dark:text-gray-300">
                    Esta acción no se puede deshacer. Esto eliminará todos los productos de tu carrito de compras permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  {/* Botón Cancelar adaptable */}
                  <AlertDialogCancel className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-gray-500 dark:hover:bg-white/10 dark:hover:text-white">
                    Cancelar
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => dispatch(clearCart())}
                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    Sí, vaciar carrito
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Tu Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Lista de productos */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                  className="flex items-center space-x-4 bg-white dark:bg-[#302f31] p-6 rounded-lg shadow-sm dark:shadow-lg border border-gray-200 dark:border-[#3a393b]"
                >
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0">
                    <button onClick={() => navigateToProduct(item)} className="cursor-pointer">
                      <div className="w-24 h-24 bg-gray-200 dark:bg-[#3a393b] rounded-lg overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />

                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigateToProduct(item)} className="cursor-pointer">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                      </h3>
                    </button>

                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Opciones seleccionadas */}
                    <div className="flex items-center space-x-4 mt-2">
                      {item.selectedColor && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Color: {item.selectedColorName}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Talla: {item.selectedSizeName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id, item.selectedColor, item.selectedSize)}
                      disabled={item.quantity <= 1}
                      className="p-1 rounded-md border border-gray-300 dark:border-[#3a393b] hover:bg-gray-50 dark:hover:bg-[#3a393b] bg-white dark:bg-[#302f31] text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-12 text-center font-medium text-gray-900 dark:text-gray-100">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleIncreaseQuantity(item.id, item.selectedColor, item.selectedSize)}
                      disabled={item.quantity >= item.maxQuantity}
                      className="p-1 rounded-md border border-gray-300 dark:border-[#3a393b] hover:bg-gray-50 dark:hover:bg-[#3a393b] bg-white dark:bg-[#302f31] text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.selectedColor, item.selectedSize)}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-gray-50 dark:bg-[#302f31] rounded-lg p-6 sticky top-8 border border-gray-200 dark:border-[#3a393b] shadow-xl">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
                  </span>
                  <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-[#3a393b] pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-gray-900 dark:text-gray-100">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:ring-offset-[#302f31] transition duration-150"
              >
                Proceder al Checkout
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Los gastos de envío se calcularán en el checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}