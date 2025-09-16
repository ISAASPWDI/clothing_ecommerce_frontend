// app/shop/[category]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import client from '@/apolloClient'; // Ajusta según tu configuración
import { GET_ALL_CATEGORIES } from '@/app/queriesGraphQL';
import { Category, GetAllCategoriesResponse } from '@/types/product';
import CategoryContent from './components/CategoryContent';

// Función helper para obtener categorías
async function getCategories() {
  try {
    const { data } = await client.query<GetAllCategoriesResponse>({
      query: GET_ALL_CATEGORIES,
    });
    return data.getAllCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Función helper para encontrar categoría por slug
async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((cat: Category) => cat.slug === slug);
}

// Interfaz actualizada para las props con Promise
interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generar metadata dinámicamente usando la BD
export async function generateMetadata({ 
  params,
  searchParams 
}: CategoryPageProps): Promise<Metadata> {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categoryInfo = await getCategoryBySlug(resolvedParams.category);
  
  if (!categoryInfo) {
    return {
      title: 'Categoría no encontrada | Tu Tienda',
      description: 'La categoría que buscas no está disponible. Explora nuestras otras categorías de productos.',
    };
  }

  // Agregar información de búsqueda y página al metadata si existe
  let title = categoryInfo.metaTitle || `${categoryInfo.name} | Tu Tienda`;
  let description = categoryInfo.metaDescription || `Descubre nuestra colección de ${categoryInfo.name.toLowerCase()}`;
  
  if (resolvedSearchParams.searchTerm) {
    const searchTerm = Array.isArray(resolvedSearchParams.searchTerm) 
      ? resolvedSearchParams.searchTerm[0] 
      : resolvedSearchParams.searchTerm;
    title = `${searchTerm} en ${categoryInfo.name} | Tu Tienda`;
    description = `Resultados de búsqueda para "${searchTerm}" en ${categoryInfo.name}. ${description}`;
  }
  
  if (resolvedSearchParams.page && resolvedSearchParams.page !== '1') {
    const page = Array.isArray(resolvedSearchParams.page) 
      ? resolvedSearchParams.page[0] 
      : resolvedSearchParams.page;
    title = `${title} - Página ${page}`;
  }

  return {
    title,
    description,
    keywords: categoryInfo.metaKeywords || categoryInfo.name,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'es_ES',
      siteName: 'Tu Tienda',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/shop/${resolvedParams.category}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generar rutas estáticas dinámicamente desde la BD
export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category: Category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const categoryInfo = await getCategoryBySlug(resolvedParams.category);
  
  // Si la categoría no existe, mostrar 404
  if (!categoryInfo) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": categoryInfo.name,
            "description": categoryInfo.metaDescription || `Descubre nuestra colección de ${categoryInfo.name.toLowerCase()}`,
            "url": `https://tu-dominio.com/shop/${resolvedParams.category}`,
            "mainEntity": {
              "@type": "ItemList",
              "name": categoryInfo.name,
              "description": categoryInfo.metaDescription || `Descubre nuestra colección de ${categoryInfo.name.toLowerCase()}`,
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Inicio",
                  "item": "https://tu-dominio.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Shop",
                  "item": "https://tu-dominio.com/shop"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": categoryInfo.name,
                  "item": `https://tu-dominio.com/shop/${resolvedParams.category}`
                }
              ]
            }
          })
        }}
      />
      
      <CategoryContent 
        categoryInfo={categoryInfo}
      />
    </>
  );
}