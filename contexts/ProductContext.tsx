'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';


interface ProductContextType {
  navigateToProduct: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const router = useRouter();

  const navigateToProduct = (product: Product) => {
    if (product.slug) {
      router.push(`/products/${product.slug}`);
    } else {
      // Fallback 
      const slug = product.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
        .replace(/ñ/g, 'n') // ñ → n
        .replace(/[^a-z0-9\s-]/g, '') // Solo alfanuméricos, espacios y guiones
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno
        .replace(/^-|-$/g, ''); // Quitar guiones extremos
      
      console.log("🔗 Navegando con slug generado:", slug);
      router.push(`/products/${slug}`);
    }
  };

  return (
    <ProductContext.Provider value={{ navigateToProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};