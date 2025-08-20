"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_PRODUCTS_BY_RELATION } from '../queriesGraphQL';
import { GetProductsByRelation } from '@/types/product';

// Types para el contexto (exactamente iguales a tu hook)
interface FilterData {
  key: string;
  ids: number[];
}

interface ProductFiltersContextType {
  // Estados
  selectedColors: (string | number)[];
  selectedGenres: (string | number)[];
  selectedSizes: (string | number)[];
  selectedAges: (string | number)[];
  activeCategory: string | null;
  priceRange: number;
  searchTerm: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc';

  // Funciones para toggle
  toggleColor: (colorId: string | number) => void;
  toggleGenre: (genreId: string | number) => void;
  toggleSize: (sizeId: string | number) => void;
  toggleAge: (ageId: string | number) => void;
  setActiveFilter: (categoryName: string, categoryId: number) => void;
  clearAllFilters: () => void;
  setPriceRange: (price: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'newest' | 'price_asc' | 'price_desc') => void;

  // Datos de productos
  loadingProducts: boolean;
  products: GetProductsByRelation | undefined;
  errorProducts: any;

  // Función manual para refetch
  refetchProducts: () => void;
}

const ProductFiltersContext = createContext<ProductFiltersContextType | undefined>(undefined);

export const ProductFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados para cada tipo de filtro (exactamente iguales a tu hook)
  const [selectedColors, setSelectedColors] = useState<(string | number)[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<(string | number)[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<(string | number)[]>([]);
  const [selectedAges, setSelectedAges] = useState<(string | number)[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Lazy query para productos
  const [fetchProducts, { loading: loadingProducts, data: products, error: errorProducts }] =
    useLazyQuery<GetProductsByRelation>(GET_PRODUCTS_BY_RELATION);

  // Función para toggle de colores (exactamente igual)
  const toggleColor = (colorId: string | number): void => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  // Función para toggle de géneros (exactamente igual)
  const toggleGenre = (genreId: string | number): void => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Función para toggle de tallas (exactamente igual)
  const toggleSize = (sizeId: string | number): void => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  // Función para toggle de edades (exactamente igual)
  const toggleAge = (ageId: string | number): void => {
    setSelectedAges(prev =>
      prev.includes(ageId)
        ? prev.filter(id => id !== ageId)
        : [...prev, ageId]
    );
  };

  // Función para cambiar categoría activa (exactamente igual)
  const setActiveFilter = (categoryName: string, categoryId: number): void => {
    setActiveCategory(categoryName);
    setActiveCategoryId(categoryId);
  };

  // Función para limpiar todos los filtros (exactamente igual)
  const clearAllFilters = (): void => {
    setSelectedColors([]);
    setSelectedGenres([]);
    setSelectedSizes([]);
    setSelectedAges([]);
    setPriceRange(0);
    setSearchTerm('');
    setSortBy('newest');
  };

  // Función que transforma los filtros al formato GraphQL (exactamente igual)
  const buildFilterData = (): FilterData[] => {
    const filterData: FilterData[] = [];

    if (selectedColors.length > 0) {
      const colorIds = selectedColors
        .map(id => typeof id === 'string' ? parseInt(id, 10) : Number(id))
        .filter(id => !isNaN(id));

      if (colorIds.length > 0) {
        filterData.push({ key: "colorId", ids: colorIds });
      }
    }

    if (selectedGenres.length > 0) {
      const genreIds = selectedGenres
        .map(id => typeof id === 'string' ? parseInt(id, 10) : Number(id))
        .filter(id => !isNaN(id));

      if (genreIds.length > 0) {
        filterData.push({ key: "genreId", ids: genreIds });
      }
    }

    if (selectedSizes.length > 0) {
      const sizeIds = selectedSizes
        .map(id => typeof id === 'string' ? parseInt(id, 10) : Number(id))
        .filter(id => !isNaN(id));

      if (sizeIds.length > 0) {
        filterData.push({ key: "sizeId", ids: sizeIds });
      }
    }

    if (selectedAges.length > 0) {
      const ageIds = selectedAges
        .map(id => typeof id === 'string' ? parseInt(id, 10) : Number(id))
        .filter(id => !isNaN(id));

      if (ageIds.length > 0) {
        filterData.push({ key: "ageId", ids: ageIds });
      }
    }

    // Solo incluir categoría si hay otros filtros activos
    if (activeCategoryId && !isNaN(activeCategoryId)) {
      const hasOtherFilters = selectedColors.length > 0 ||
        selectedGenres.length > 0 ||
        selectedSizes.length > 0 ||
        selectedAges.length > 0;

      // Solo agregar categoría si:
      // 1. No hay searchTerm (navegación normal por categoría)
      // 2. Hay searchTerm pero también hay otros filtros activos
      if (!searchTerm.trim() || hasOtherFilters) {
        filterData.push({ key: "categoryId", ids: [Number(activeCategoryId)] });
      }
    }

    console.log('🏗️ buildFilterData result:', filterData);
    console.log('🔍 searchTerm presente:', !!searchTerm.trim());
    return filterData;
  };

  // Función manual para refetch (exactamente igual)
  const refetchProducts = (): void => {
    const filterData = buildFilterData();
    if (filterData.length > 0) {
      fetchProducts({
        variables: {
          filterData,
          page: 1,
          ...(priceRange > 0 && { maxPrice: priceRange }),
          ...(searchTerm && { searchTerm }),
          sortBy
        }
      });
    }
  };

  // Effect que ejecuta la query cuando cambian los filtros (exactamente igual)
  useEffect(() => {
    const filterData = buildFilterData();

    // Ejecutar si hay filtros O si hay término de búsqueda
    if (filterData.length > 0 || searchTerm.trim()) {
      console.log('🔍 Enviando filterData:', filterData);
      console.log('📄 Variables completas:', {
        filterData,
        page: 1,
        ...(priceRange > 0 && { maxPrice: priceRange }),
        sortBy,
        searchTerm
      });

      fetchProducts({
        variables: {
          filterData, // Usar filterData tal como viene
          page: 1,
          ...(priceRange > 0 && { maxPrice: priceRange }),
          ...(searchTerm && { searchTerm }),
          sortBy
        }
      }).catch(error => {
        console.error('❌ Error en fetchProducts:', error);
      });
    }
  }, [
    selectedColors,
    selectedGenres,
    selectedSizes,
    selectedAges,
    activeCategoryId,
    priceRange,
    sortBy,
    searchTerm,
    fetchProducts
  ]);

  const value: ProductFiltersContextType = {
    // Estados
    selectedColors,
    selectedGenres,
    selectedSizes,
    selectedAges,
    activeCategory,
    priceRange,
    searchTerm,
    sortBy,

    // Funciones para toggle
    toggleColor,
    toggleGenre,
    toggleSize,
    toggleAge,
    setActiveFilter,
    clearAllFilters,
    setPriceRange,
    setSearchTerm,
    setSortBy,

    // Datos de productos
    loadingProducts,
    products,
    errorProducts,

    // Función manual para refetch
    refetchProducts
  };

  return (
    <ProductFiltersContext.Provider value={value}>
      {children}
    </ProductFiltersContext.Provider>
  );
};


export const useProductFilters = () => {
  const context = useContext(ProductFiltersContext);
  if (context === undefined) {
    throw new Error('useProductFilters must be used within a ProductFiltersProvider');
  }
  return context;
};
