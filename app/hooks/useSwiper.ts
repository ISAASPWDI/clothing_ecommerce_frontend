import { GetGenresData, GetProductsWithGenresData, GetAllCategoriesResponse, GetProductsWithCategoriesData } from "@/types/product";
import { ApolloError, useLazyQuery, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { FIND_PRODUCTS_WITH_CATEGORIES, FIND_PRODUCTS_WITH_GENRES, GET_ALL_CATEGORIES, GET_ALL_GENRES } from "../queriesGraphQL";
export interface StatusStateOptions {
  loading: boolean;
  error: ApolloError | undefined;
  loadingMsg: string;
  errorMsg: string;
}
interface UseSwiperOptions {
  type?: 'genre' | 'category';
}

export const useSwiper = (options?: UseSwiperOptions) => {
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState<boolean>(false);

  // Generos
  const { loading: loadingGenres, error: errorGenres, data: dataGenres } = useQuery<GetGenresData>(GET_ALL_GENRES);
  const [
    getProductsByGenre,
    { loading: loadingProductsByGenre, error: errorProductsByGenre, data: dataProductsByGenre, called: productQueryCalled },
  ] = useLazyQuery<GetProductsWithGenresData>(FIND_PRODUCTS_WITH_GENRES, {
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    onError: (error) => {
      console.error("Error en query de productos:", error);
    },
  });
  // Categorías
  const { loading: loadingCategories, error: errorCategories, data: dataCategories } =
    useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);

  const [getProductsByCategory, { loading: loadingProductsByCategory, error: errorProductsByCategory, data: dataProductsByCategory, called: categoryQueryCalled }] = useLazyQuery<GetProductsWithCategoriesData>(FIND_PRODUCTS_WITH_CATEGORIES);
  
  // Productos por género


  // // Logs
  // useEffect(() => {
  //   if (dataProductsByGenre) console.log(dataProductsByGenre);
  //   console.log(dataGenres);
  //   console.log(dataCategories);
    
  // }, [dataProductsByGenre, dataCategories, dataGenres]);

  // Cargar inicial dinámico
  useEffect(() => {
    if (initialLoadCompleted) return;
    const { type }  = options || {}

    if (type === 'genre' && dataGenres?.getAllGenres && activeGenreId === null) {
      const targetGenre = dataGenres.getAllGenres[0]

      if (targetGenre && targetGenre.id) {
        console.log("Cargando género inicial:", targetGenre);
        setActiveGenreId(targetGenre.id);
        setInitialLoadCompleted(true);
        getProductsByGenre({
          variables: { id: Number(targetGenre.id) },
          errorPolicy: "all",
        });
      }
    } else if (type === 'category' && dataCategories?.getAllCategories && activeCategoryId === null) {
      const targetCategory = dataCategories.getAllCategories[0]

      if (targetCategory && targetCategory.id) {
        console.log("Cargando categoría inicial:", targetCategory);
        setActiveCategoryId(targetCategory.id);
        setInitialLoadCompleted(true);
        getProductsByCategory({
          variables: { id: Number(targetCategory.id) },
          errorPolicy: "all",
        });
      }
    }
  }, [dataGenres, dataCategories, activeGenreId, activeCategoryId, initialLoadCompleted, getProductsByGenre, getProductsByCategory, options]);

  // Cambio de género
  const handleGenreClick = useCallback(
    async (genreId: number) => {
      if (genreId === activeGenreId) return;

      try {
        setActiveGenreId(genreId);
        // Reset category when switching to genre
        setActiveCategoryId(null);
        await getProductsByGenre({ variables: { id: Number(genreId) } });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [activeGenreId, getProductsByGenre]
  );

  const handleCategoryClick = useCallback(async (categoryId: number) => {
    if (categoryId === activeCategoryId) return;

    try {
      setActiveCategoryId(categoryId);
      // Reset genre when switching to category
      setActiveGenreId(null);
      await getProductsByCategory({ variables: { id: Number(categoryId) } });
    } catch (error) {
      console.error("Error:", error);
    }
  }, [activeCategoryId, getProductsByCategory]);

  // 📌 Lista de estados unificados
  const states: StatusStateOptions[] = [
    {
      loading: loadingGenres,
      error: errorGenres,
      loadingMsg: "Cargando géneros...",
      errorMsg: `Error cargando géneros: ${errorGenres?.message}`,
    },
    {
      loading: loadingCategories,
      error: errorCategories,
      loadingMsg: "Cargando categorías...",
      errorMsg: `Error cargando categorías: ${errorCategories?.message}`,
    },
    {
      loading: loadingProductsByGenre,
      error: errorProductsByGenre,
      loadingMsg: "Cargando productos por género...",
      errorMsg: `Error cargando productos por género: ${errorProductsByGenre?.message}`,
    },
    {
      loading: loadingProductsByCategory,
      error: errorProductsByCategory,
      loadingMsg: "Cargando productos por categoría...",
      errorMsg: `Error cargando productos por categoría: ${errorProductsByCategory?.message}`,
    },
  ];

  return {
    // Datos
    productQueryCalled,
    categoryQueryCalled,
    dataProductsByGenre,
    dataProductsByCategory,
    dataGenres,
    dataCategories,
    activeGenreId,
    activeCategoryId,
    setActiveCategoryId,
    handleCategoryClick,
    // Funciones
    setActiveGenreId,
    handleGenreClick,
    // Estados combinados
    states,
  };
};