'use client'
import { Clock, Home, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/app/store/slices/cart/cartSlice';

export default function CheckoutPendingPage() {
  const dispatch = useDispatch();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // Obtener información del pedido guardada
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      setOrderInfo(JSON.parse(savedOrder));
      localStorage.removeItem('pendingOrder');
    }

    // Limpiar el carrito
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-[#1a1a1b] dark:via-[#1e1e1f] dark:to-[#202023] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-[#302f31] rounded-2xl shadow-xl p-8 text-center">
          {/* Ícono pendiente */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pago pendiente
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
          </p>

          {/* Información del pedido */}
          {orderInfo && (
            <div className="bg-gray-50 dark:bg-[#3a393b] rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Detalles del pedido
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ARS ${orderInfo.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {orderInfo.customerInfo.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Link>
            <Link
              href="/orders"
              className="flex-1 bg-gray-200 dark:bg-[#3a393b] hover:bg-gray-300 dark:hover:bg-[#4a494b] text-gray-900 dark:text-gray-100 font-medium py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}