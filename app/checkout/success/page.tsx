'use client'
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Home } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/app/store/slices/cart/cartSlice';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

    // Obtener parámetros de MercadoPago
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    console.log('Payment Info:', { paymentId, status, externalReference });
  }, [dispatch, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-[#1a1a1b] dark:via-[#1e1e1f] dark:to-[#202023] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-[#302f31] rounded-2xl shadow-xl p-8 text-center">
          {/* Ícono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ¡Pago exitoso!
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
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
                  <span className="text-gray-600 dark:text-gray-400">Artículos:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {orderInfo.items.length}
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