"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { GET_PRODUCTS_BY_RELATION, GET_ALL_CATEGORIES } from '../queriesGraphQL';
import { GetProductsByRelation, GetAllCategoriesResponse } from '@/types/product';

interface FilterData {
  key: string;
  ids: number[];
}

interface ProductFiltersContextType {
  selectedColors: (string | number)[];
  selectedGenres: (string | number)[];
  selectedSizes: (string | number)[];
  selectedAges: (string | number)[];
  activeCategory: string | null;
  priceRange: number;
  searchTerm: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc';
  currentPage: number;
  hasMore: boolean;
  allProducts: any[];

  toggleColor: (colorId: string | number) => void;
  toggleGenre: (genreId: string | number) => void;
  toggleSize: (sizeId: string | number) => void;
  toggleAge: (ageId: string | number) => void;
  setActiveFilter: (categoryName: string, categoryId: number) => void;
  clearAllFilters: () => void;
  setPriceRange: (price: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'newest' | 'price_asc' | 'price_desc') => void;

  loadingProducts: boolean;
  errorProducts: any;

  refetchProducts: () => void;
  handleLoadMoreProducts: () => void;
}

const ProductFiltersContext = createContext<ProductFiltersContextType | undefined>(undefined);

export const ProductFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedColors, setSelectedColors] = useState<(string | number)[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<(string | number)[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<(string | number)[]>([]);
  const [selectedAges, setSelectedAges] = useState<(string | number)[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // CAMBIO: Usar useState en lugar de useRef para mejor control
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Obtener todas las categorías para crear los mappings dinámicamente
  const { data: categoriesData } = useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);

  const [fetchProducts, { loading: loadingProducts, error: errorProducts }] =
    useLazyQuery<GetProductsByRelation>(GET_PRODUCTS_BY_RELATION, {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    });

  // Crear mappings dinámicos basados en la data de la BD
  const createCategoryMappings = () => {
    if (!categoriesData?.getAllCategories) return { slugToCategory: {}, categoryToSlugMap: {} };

    const slugToCategory: { [key: string]: { name: string; id: number } } = {};
    const categoryToSlugMap: { [key: string]: string } = {};

    categoriesData.getAllCategories.forEach(category => {
      slugToCategory[category.slug] = {
        name: category.name,
        id: category.id
      };
      categoryToSlugMap[category.name] = category.slug;
    });

    return { slugToCategory, categoryToSlugMap };
  };


  const updateURL = (skipPageUpdate = false) => {
    if (!isInitialized || !pathname.startsWith('/shop')) return;

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('searchTerm', searchTerm);
    }
    
    // Solo actualizar page si no estamos en proceso de "load more"
    if (!skipPageUpdate && currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    // Construir URL final manteniendo la ruta actual
    const queryString = params.toString();
    const finalURL = queryString ? `${pathname}?${queryString}` : pathname;

    // Solo actualizar si la URL es diferente
    const currentURL = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    if (finalURL !== currentURL) {
      router.push(finalURL, { scroll: false });
    }
  };


  useEffect(() => {
    if (!pathname || !pathname.startsWith('/shop') || !categoriesData?.getAllCategories) {
      if (!pathname || !pathname.startsWith('/shop')) {
        setIsInitialized(true);
      }
      return;
    }

    const { slugToCategory } = createCategoryMappings();
    const page = searchParams.get('page');
    const search = searchParams.get('searchTerm');
    

    const pathSegments = pathname.split('/');
    if (pathSegments.length >= 3 && pathSegments[1] === 'shop' && pathSegments[2]) {
      const categorySlug = pathSegments[2];
      const categoryInfo = slugToCategory[categorySlug];
      
      if (categoryInfo) {
        setActiveCategory(categoryInfo.name);
        setActiveCategoryId(categoryInfo.id);
      }
    } else if (pathname === '/shop') {
      setActiveCategory(null);
      setActiveCategoryId(null);
    }

    if (page && !isNaN(parseInt(page))) {
      setCurrentPage(parseInt(page));
    } else {
      setCurrentPage(1);
    }

    if (search) {
      setSearchTerm(decodeURIComponent(search));
    }

    setIsInitialized(true);
  }, [pathname, searchParams, categoriesData]);


  useEffect(() => {
    if (isInitialized && pathname.startsWith('/shop') && !isLoadingMore) {
      updateURL();
    }
  }, [searchTerm, isInitialized, pathname]);


  useEffect(() => {
    if (isInitialized && pathname.startsWith('/shop') && currentPage > 1) {
      updateURL();
    }
  }, [currentPage, isInitialized, pathname]);

  const toggleColor = (colorId: string | number): void => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
    setCurrentPage(1); // Reset página al cambiar filtros
  };

  const toggleGenre = (genreId: string | number): void => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const toggleSize = (sizeId: string | number): void => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
    setCurrentPage(1);
  };

  const toggleAge = (ageId: string | number): void => {
    setSelectedAges(prev =>
      prev.includes(ageId)
        ? prev.filter(id => id !== ageId)
        : [...prev, ageId]
    );
    setCurrentPage(1);
  };

  const setActiveFilter = (categoryName: string, categoryId: number): void => {
    const { categoryToSlugMap } = createCategoryMappings();
    const currentCategorySlug = categoryToSlugMap[categoryName];
    
    if (pathname === '/shop' && currentCategorySlug) {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set('searchTerm', searchTerm);
      }
      
      const queryString = params.toString();
      const newURL = queryString ? `/shop/${currentCategorySlug}?${queryString}` : `/shop/${currentCategorySlug}`;
      
      router.push(newURL);
      return;
    }
    
    if (pathname.startsWith('/shop/') && currentCategorySlug) {
      const currentCategoryFromURL = pathname.split('/')[2];
      
      if (currentCategoryFromURL !== currentCategorySlug) {
        const params = new URLSearchParams();
        if (searchTerm.trim()) {
          params.set('searchTerm', searchTerm);
        }
        
        const queryString = params.toString();
        const newURL = queryString ? `/shop/${currentCategorySlug}?${queryString}` : `/shop/${currentCategorySlug}`;
        
        router.push(newURL);
        return;
      }
    }

    setActiveCategory(categoryName);
    setActiveCategoryId(categoryId);
    setCurrentPage(1);
  };

  const clearAllFilters = (): void => {
    setSelectedColors([]);
    setSelectedGenres([]);
    setSelectedSizes([]);
    setSelectedAges([]);
    setPriceRange(0);
    setSearchTerm('');
    setSortBy('newest');
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
  };

  const setSearchTermWithNavigation = (term: string): void => {
    setSearchTerm(term);
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);

  };

  const buildFilterData = useCallback((): FilterData[] => {
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

    if (activeCategoryId && !isNaN(activeCategoryId)) {
      filterData.push({ key: "categoryId", ids: [Number(activeCategoryId)] });
    }

    return filterData;
  }, [selectedColors, selectedGenres, selectedSizes, selectedAges, activeCategoryId]);

  const refetchProducts = (): void => {
    const filterData = buildFilterData();
    if (filterData.length > 0) {
      setAllProducts([]);
      setCurrentPage(1);
      setHasMore(true);
      
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


  const handleLoadMoreProducts = async () => {

    if (!hasMore || loadingProducts || isLoadingMore) {
      console.log('Bloqueando load more:', { hasMore, loadingProducts, isLoadingMore });
      return;
    }

    console.log('Iniciando load more, página actual:', currentPage);
    
    try {

      setIsLoadingMore(true);
      
      const nextPage = currentPage + 1;
      const filterData = buildFilterData();

      console.log('Cargando página:', nextPage);

      const result = await fetchProducts({
        variables: {
          filterData,
          page: nextPage,
          ...(priceRange > 0 && { maxPrice: priceRange }),
          ...(searchTerm && { searchTerm }),
          sortBy
        }
      });

      if (result.data?.findProductsByRelation) {
        const { products: newProducts, isProducts } = result.data.findProductsByRelation;
        
        console.log('Nuevos productos recibidos:', newProducts.length);

        if (newProducts.length > 0) {
          setAllProducts(prev => {
            console.log('Productos actuales antes de agregar:', prev.length);
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
            console.log('Productos únicos nuevos:', uniqueNewProducts.length);
            const result = [...prev, ...uniqueNewProducts];
            console.log('Total productos después de agregar:', result.length);
            return result;
          });

          
          setCurrentPage(nextPage);
        }

        setHasMore(isProducts);
      }

    } catch (error) {
      console.error('Error loading more products:', error);

    } finally {

      setIsLoadingMore(false);
    }
  };


  useEffect(() => {
    if (!isInitialized) return;

    const filterData = buildFilterData();
    const shouldFetchProducts = filterData.length > 0 || searchTerm.trim() || activeCategory;

    if (shouldFetchProducts && currentPage === 1 && !isLoadingMore) {
      console.log('Cargando productos iniciales...');
      
      setAllProducts([]);
      setHasMore(true);
      
      fetchProducts({
        variables: {
          filterData,
          page: 1,
          ...(priceRange > 0 && { maxPrice: priceRange }),
          ...(searchTerm && { searchTerm }),
          sortBy
        }
      }).then(result => {
        if (result.data?.findProductsByRelation) {
          const { products: newProducts, isProducts } = result.data.findProductsByRelation;
          console.log('Products fetched for category:', newProducts);
          setAllProducts(newProducts);
          setHasMore(isProducts);
        }
      }).catch(error => {
        console.error('Error fetching products:', error);
      });
    } else if (!shouldFetchProducts) {
      setAllProducts([]);
      setHasMore(false);
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
    fetchProducts,
    isInitialized,
    activeCategory,
    buildFilterData,
  ]);

  const value: ProductFiltersContextType = {
    selectedColors,
    selectedGenres,
    selectedSizes,
    selectedAges,
    activeCategory,
    priceRange,
    searchTerm,
    sortBy,
    currentPage,
    hasMore,
    allProducts,
    toggleColor,
    toggleGenre,
    toggleSize,
    toggleAge,
    setActiveFilter,
    clearAllFilters,
    setPriceRange,
    setSearchTerm: setSearchTermWithNavigation,
    setSortBy,
    loadingProducts,
    errorProducts,
    refetchProducts,
    handleLoadMoreProducts
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