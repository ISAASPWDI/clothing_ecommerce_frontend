export type Genre = {
  id: number | number;
  genre: string;
};

export type Category = {
    id: number;
    name: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    slug: string;
}

export type Size = {
  id: number;
  size: string;
};

export type Color = {
  id: number;
  color: string;
};

export type Age = {
  id: number;
  range: string;
};

type Detail = {
  id: number;
  key: string;
  value: string;
};

type Image = {
  id: number; 
  imagePath: string;
  alt?: string | null;
  sortOrder: number; 
  isMain: boolean;  
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  quantity?: number;
  reviewCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Relaciones opcionales
  categories?: Category[];
  sizes?: Size[];
  colors?: Color[];
  ages?: Age[];
  genres?: Genre[];
  details?: Detail[];
  images?: Image[];
};

//Generos
export type GetGenresData = {
  getAllGenres: Genre[];
};
export type GetProductsWithGenresData = {
  findAllProducts: Product[];
};
//Categorias
export interface GetAllCategoriesResponse {
    getAllCategories: Category[];
}
export interface GetAllColorsResponse {
    getAllColors: Color[];
}
export interface GetProductsWithCategoriesData {
  findAllProducts: Product[];
}
export interface GetProductsByRelation {
  findProductsByRelation: {
    products: Product[];
    isProducts: boolean;
  };
}
// Nuevos tipos para la página de detalles
export interface GetProductBySlugResponse {
  getProduct: Product;
}

export interface GetRelatedProductsResponse {
  getRelatedProducts: Product[];
}