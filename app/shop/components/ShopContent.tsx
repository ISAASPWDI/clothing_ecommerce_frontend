'use client';
import React, { useEffect } from 'react';
import Image from 'next/image'
import { Search } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useQuery } from '@apollo/client';
import { GET_ALL_AGES, GET_ALL_CATEGORIES, GET_ALL_COLORS, GET_ALL_GENRES, GET_ALL_SIZES } from '../../queriesGraphQL';
import { Age, Color, Genre, GetAllCategoriesResponse, Size } from '@/types/product';
import FilterAccordion from './FilterAccordion';
import SkeletonCategoryPills from './SkeletonCategoryPills';
import { useProductFilters } from '@/app/hooks/ProductFiltersContext';
import { Button } from '@/components/ui/button';
import { useProductContext } from '@/contexts/ProductContext';

export default function ShopContent() {
  // Hook de categorías
  const { loading: loadingCategories, data: categories, error: errorCategories } = useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);

  // Usar el custom hook para filtros
  const {
    selectedColors,
    selectedGenres,
    selectedSizes,
    selectedAges,
    activeCategory,
    priceRange,
    searchTerm,
    sortBy,
    toggleColor,
    toggleGenre,
    toggleSize,
    toggleAge,
    setActiveFilter,
    clearAllFilters,
    setPriceRange,
    setSearchTerm,
    setSortBy,
    loadingProducts,
    errorProducts,
    allProducts,
    hasMore,
    handleLoadMoreProducts
  } = useProductFilters();


  const { navigateToProduct } = useProductContext();


  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-5">Todos los productos</h1>
          <p className="text-zinc-600">Navega en nuestra colección de productos minimalistas elegidos para ti 😊</p>
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
                <span className="text-sm text-zinc-600">Hasta ${priceRange}</span>
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
                placeholder="Buscar productos..."
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

          {/* Category Pills */}
          {!loadingCategories && categories?.getAllCategories && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.getAllCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    activeCategory === category.name
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:shadow-md"
                  }`}
                  onClick={() => setActiveFilter(category.name, Number(category.id))}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {loadingProducts && (
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

          {errorProducts && (
            <div className="text-center bg-red-100 p-8 rounded-lg">
              <p className="text-red-600">Error al cargar productos: {errorProducts.message}</p>
            </div>
          )}

          {!loadingProducts && allProducts && (
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

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center items-center">
              <Button
                onClick={handleLoadMoreProducts}
                disabled={loadingProducts}
                className="w-40 p-6 bg-purple-600 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-12 hover:shadow-lg transition hover:scale-95"
              >
                <p className="text-lg">
                  {loadingProducts ? 'Cargando...' : 'Cargar más'}
                </p>
              </Button>
            </div>
          )}

          {/* No products message */}
          {!loadingProducts && allProducts.length === 0 && (
            <div className="text-center bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-600">No se encontraron productos con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}