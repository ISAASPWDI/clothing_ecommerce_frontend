'use client';
import React, { useState } from 'react';
import { Search} from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import Image from 'next/image'
import { useQuery } from '@apollo/client';
import { GET_ALL_AGES, GET_ALL_CATEGORIES, GET_ALL_COLORS, GET_ALL_GENRES, GET_ALL_SIZES } from '../../../queriesGraphQL';
import { Age, Color, Genre, GetAllCategoriesResponse, Size } from '@/types/product';

import { useProductFilters } from '@/app/hooks/ProductFiltersContext';
import { Button } from '@/components/ui/button';
import FilterAccordion from '../../components/FilterAccordion';
import SkeletonCategoryPills from '../../components/SkeletonCategoryPills';
import Layout from '../../LayoutContent';
import { useProductContext } from '@/contexts/ProductContext';

interface CategoryInfo {
  id: number;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug: string;
}

interface CategoryContentProps {
  categoryInfo: CategoryInfo;
}

export default function CategoryContent({ categoryInfo }: CategoryContentProps) {
  // query para categories
  const { loading: loadingCategories, data: categories, error: errorCategories } = useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);
  const { navigateToProduct } = useProductContext();
  // usar el custom hook
  const {
    selectedColors,
    selectedGenres,
    selectedSizes,
    selectedAges,
    priceRange,
    searchTerm,
    sortBy,
    toggleColor,
    toggleGenre,
    toggleSize,
    toggleAge,
    clearAllFilters,
    setPriceRange,
    setSearchTerm,
    setSortBy,
    loadingProducts,
    errorProducts,
    allProducts,
    hasMore,
    currentPage,
    handleLoadMoreProducts
  } = useProductFilters();

  const [isNavigating, setIsNavigating] = useState(false);




  const isInitialLoading = loadingProducts && (allProducts.length === 0 || isNavigating);
  const isLoadingMore = loadingProducts && allProducts.length > 0 && !isNavigating;
  const shouldShowNoProducts = !loadingProducts && allProducts.length === 0 && !isNavigating;
  const shouldShowProducts = allProducts.length > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mb-20">
        {/* Header específico para categoría */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">{categoryInfo.name}</h1>
            <p className="text-zinc-600 mb-3">
              {categoryInfo.metaDescription || `Descubre nuestra colección de ${categoryInfo.name.toLowerCase()}`}
            </p>
            {searchTerm && (
              <p className="text-purple-600 font-medium">
                Búsqueda en {categoryInfo.name}: "{searchTerm}"
              </p>
            )}
            {currentPage > 1 && (
              <p className="text-sm text-gray-500 mt-1">
                Página {currentPage}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-purple-600 text-sm cursor-pointer hover:outline-0 outline-0 border-2 border-white hover:border-b-purple-700 transition-all transition-duration duration-500"
                >
                  Clear All
                </button>
              </div>

              {/* Categoría actual */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categoría actual</h3>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryInfo.name}
                </span>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Rango de precios</h3>
                <Slider
                  value={[priceRange]}
                  max={150}
                  step={1}
                  onValueChange={(val: number[]) => setPriceRange(val[0])}
                  className="[&_[data-orientation=horizontal]_span]:bg-purple-600"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-zinc-600">$0</span>
                  <span className="text-sm text-zinc-600">Desde ${priceRange}</span>
                </div>
              </div>

              {/* Filters accordions */}
              <div className="mb-6">
                <FilterAccordion
                  title="Colores"
                  query={GET_ALL_COLORS}
                  mapItems={(data: any) => data?.getAllColors.map((c: Color) => ({ id: c.id, label: c.color })) ?? []}
                  selectedItems={selectedColors}
                  onToggle={toggleColor}
                />
                <FilterAccordion
                  title="Géneros"
                  query={GET_ALL_GENRES}
                  mapItems={(data: any) => data?.getAllGenres.map((g: Genre) => ({ id: g.id, label: g.genre })) ?? []}
                  selectedItems={selectedGenres}
                  onToggle={toggleGenre}
                />
                <FilterAccordion
                  title="Tallas"
                  query={GET_ALL_SIZES}
                  mapItems={(data: any) => data?.getAllSizes.map((s: Size) => ({ id: s.id, label: s.size })) ?? []}
                  selectedItems={selectedSizes}
                  onToggle={toggleSize}
                />
                <FilterAccordion
                  title="Edades"
                  query={GET_ALL_AGES}
                  mapItems={(data: any) => data?.getAllAges.map((a: Age) => ({ id: a.id, label: a.range })) ?? []}
                  selectedItems={selectedAges}
                  onToggle={toggleAge}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={`Buscar en ${categoryInfo.name}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-zinc-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-600">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
                  className="border border-zinc-200 rounded-lg px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="newest">Lo más nuevo</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            {loadingCategories && <SkeletonCategoryPills count={8} />}

            {/* Category Pills - Mostrar todas las categorías dinámicamente */}
            {!loadingCategories && categories?.getAllCategories && (
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.getAllCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${category.name === categoryInfo.name
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-md"
                      }`}
                    onClick={() => {
                      // Navegar usando el slug dinámico de la BD
                      if (category.name !== categoryInfo.name) {
                        setIsNavigating(true);
                        window.location.href = `/shop/${category.slug}`;
                      }
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {/* Products Counter - Solo mostrar si hay productos */}
            {shouldShowProducts && (
              <div className="mb-4 text-zinc-600">
                {allProducts.length} producto{allProducts.length !== 1 ? 's' : ''} encontrado{allProducts.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Loading Skeleton - Carga inicial */}
            {isInitialLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-w-3 aspect-h-2 bg-gray-200 h-48"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {errorProducts && (
              <div className="text-center bg-red-100 p-8 rounded-lg">
                <p className="text-red-600">Error al cargar productos: {errorProducts.message}</p>
              </div>
            )}

            {/* Products Grid - Mostrar productos existentes */}
            {shouldShowProducts && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up cursor-pointer"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => navigateToProduct(product)}
                  >
                    <div className="aspect-w-3 aspect-h-2 bg-gradient-to-br from-purple-50 to-purple-100">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center">
                          <span className="text-gray-400">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-semibold text-purple-600 mb-1">{product.id}</div>
                      <h3 className="text-lg font-medium mb-1 line-clamp-2">{product.name}</h3>
                      <div className="text-zinc-700 font-bold mb-2">${product.price.toFixed(2)}</div>
                      <p className="text-sm text-zinc-600 mb-4 line-clamp-3">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Loading Skeleton para "Cargar más" */}
            {isLoadingMore && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {[...Array(3)].map((_, i) => (
                  <div key={`loading-more-${i}`} className="bg-white rounded-lg overflow-hidden animate-pulse">
                    <div className="aspect-w-3 aspect-h-2 bg-gray-200 h-48"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button - Solo mostrar si hay productos y hasMore es true */}
            {shouldShowProducts && hasMore && (
              <div className="flex justify-center items-center">
                <Button
                  onClick={handleLoadMoreProducts}
                  disabled={loadingProducts}
                  className="w-40 p-6  bg-purple-600 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-12 hover:shadow-lg transition hover:scale-95"
                >
                  <p className="text-lg">
                    {loadingProducts ? 'Cargando...' : 'Cargar más'}
                  </p>
                </Button>
              </div>
            )}

            {/* No products message - Solo mostrar cuando no hay productos y no está cargando */}
            {shouldShowNoProducts && (
              <div className="text-center bg-gray-100 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No hay productos en ${categoryInfo.name} que coincidan con "${searchTerm}". Por favor pruebe con otra categoría.`
                    : `Próximamente tendremos productos en ${categoryInfo.name}`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}