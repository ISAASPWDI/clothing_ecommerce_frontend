import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import required modules
import { Navigation } from 'swiper/modules';
import { StatusStateOptions, useSwiper } from '../../hooks/useSwiper';
import { StatusState } from '../../components/StatusState';
import { Category, Genre, Product } from '@/types/product';
import SkeletonProductCard from './SkeletonProductCard';
import { useProductContext } from '@/contexts/ProductContext';

interface SwiperConfigOptions {
  title: string;
  dataTitle?: {
    getAllGenres?: Genre[],
    getAllCategories?: Category[]
  } | undefined
  dataBody?: {
    findAllProducts?: {
      id: number
      name: string
      price: number
      genres?: {
        id: string | number
        genre: string
      }[]
    }[]
  } | any
}

export default function SwiperStyle({ title, dataTitle, dataBody }: SwiperConfigOptions) {
  const { navigateToProduct } = useProductContext();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (
      swiperInstance &&
      typeof swiperInstance.params.navigation === 'object' &&
      prevRef.current &&
      nextRef.current
    ) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  const swiperData = dataBody?.states ? dataBody : null;
  const fallbackSwiperData = useSwiper();
  const actualSwiperData = swiperData || fallbackSwiperData;

  const isGenreData = Boolean(dataTitle?.getAllGenres);
  const isCategoryData = Boolean(dataTitle?.getAllCategories);

  const itemsList = isGenreData
    ? dataTitle?.getAllGenres
    : isCategoryData
      ? dataTitle?.getAllCategories
      : [];

  const handleItemClick = (itemId: string | number) => {
    if (isGenreData) {
      actualSwiperData.setActiveGenreId(Number(itemId));
      actualSwiperData.handleGenreClick(Number(itemId));
    } else if (isCategoryData) {
      actualSwiperData.setActiveCategoryId(Number(itemId));
      actualSwiperData.handleCategoryClick(Number(itemId));
    }
  };

  const currentProducts: Product[] = isGenreData
    ? actualSwiperData.dataProductsByGenre?.findAllProducts
    : actualSwiperData.dataProductsByCategory?.findAllProducts;

  const queryWasCalled = isGenreData
    ? actualSwiperData.productQueryCalled
    : actualSwiperData.categoryQueryCalled;

  const getActiveItemId = (item: Genre | Category) => {
    if (isGenreData) {
      return Number(actualSwiperData.activeGenreId) === Number((item as Genre).id);
    } else if (isCategoryData) {
      return Number(actualSwiperData.activeCategoryId) === Number((item as Category).id);
    }
    return false;
  };

  const getItemText = (item: Genre | Category) => {
    if (isGenreData) {
      return (item as Genre).genre;
    } else if (isCategoryData) {
      return (item as Category).name;
    }
    return '';
  };

  return (
    <div className="max-w-[1920px] mx-auto px-8 py-8">
      {/* Título y navegación */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-700">{title}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#3a393b] dark:hover:bg-[#4a494b] rounded-full w-10 h-10 flex items-center justify-center focus:outline-none text-[#516559] dark:text-gray-200"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#3a393b] dark:hover:bg-[#4a494b] rounded-full w-10 h-10 flex items-center justify-center focus:outline-none text-[#516559] dark:text-gray-200"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-[#3a393b] mb-6">
        <nav className="flex space-x-8">
          {itemsList?.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`pb-2 px-1 ${getActiveItemId(item)
                ? "border-b-2 border-purple-700 font-medium text-purple-700 dark:text-purple-600"
                : "text-gray-500 dark:text-gray-300"
                }`}
            >
              <span>{getItemText(item)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenedor de productos */}
      <div className="min-h-[600px] relative">
        {(() => {
          const currentState = actualSwiperData.states.find((s: StatusStateOptions) => s.loading || s.error);
          if (currentState) return <StatusState {...currentState} />;
          return null;
        })()}

        <div className="min-h-[600px] w-full">
          {!queryWasCalled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          )}

          {queryWasCalled && currentProducts && currentProducts.length > 0 && (
            <Swiper
              key={actualSwiperData.activeGenreId || actualSwiperData.activeCategoryId}
              spaceBetween={20}
              slidesPerView={1}
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-5"
              onSwiper={setSwiperInstance}
            >
              {currentProducts?.map((product: Product, index: number) => (
                <SwiperSlide
                  key={product.id}
                  className="mb-16 animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="bg-white dark:bg-[#302f31] shadow-md dark:shadow-lg rounded-lg flex flex-col h-[543px] transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <div className="h-80 bg-gray-200 dark:bg-[#3a393b] mb-4 rounded flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].imagePath}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Sin imagen</span>
                      )}
                    </div>
                    <div className="px-3 flex-grow flex flex-col justify-around">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 overflow-hidden">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-[#516559] dark:text-purple-400">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigateToProduct(product)}
                        className="mt-4 w-full bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white py-2 px-4 rounded transition-colors duration-300"
                      >
                        Ver Producto
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {queryWasCalled &&
            currentProducts &&
            currentProducts.length === 0 && (
              <div className="flex justify-center items-center h-[600px]">
                <p className="text-gray-500 dark:text-gray-300 text-lg">
                  No hay productos disponibles.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
