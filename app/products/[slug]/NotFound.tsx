import Link from 'next/link';
import { ShoppingBag, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-purple-100 mb-8">
          <ShoppingBag className="h-12 w-12 text-purple-600" />
        </div>
        
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Producto no encontrado
        </h1>
        
        {/* Descripción */}
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, el producto que buscas no existe o ha sido movido.
        </p>
        
        {/* Botones de acción */}
        <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <Home className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
          
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <Search className="mr-2 h-5 w-5" />
            Explorar productos
          </Link>
        </div>
        
        {/* Mensaje adicional */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si crees que esto es un error, 
            <Link href="/contact" className="text-purple-600 hover:text-purple-500 ml-1">
              contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}