'use client'
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-[#1a1a1b] dark:via-[#1e1e1f] dark:to-[#202023] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-[#302f31] rounded-2xl shadow-xl p-8 text-center">
          {/* Ícono de error */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pago fallido
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Hubo un problema al procesar tu pago. Por favor, verifica tu información e intenta nuevamente.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Intentar nuevamente
            </button>
            <Link
              href="/cart"
              className="flex-1 bg-gray-200 dark:bg-[#3a393b] hover:bg-gray-300 dark:hover:bg-[#4a494b] text-gray-900 dark:text-gray-100 font-medium py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}