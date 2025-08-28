import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getProductBySlug } from '@/lib/product-utils';
import ProductDetailsContent from './components/ProductDetailsContent';



interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Función para generar metadata SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: 'Producto no encontrado',
        description: 'El producto que buscas no existe o no está disponible.',
      };
    }

    const title = product.metaTitle || `${product.name} | Tu Tienda`;
    const description =
      product.metaDescription || product.description || `Descubre ${product.name} al mejor precio.`;
    const keywords = product.metaKeywords || '';

    // Usamos productImages, no images
    const mainImages =
      product.images?.filter((img: any) => img.isMain).map((img: any) => ({
        url: img.imagePath,
        alt: img.alt || product.name,
      })) || [];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        images: mainImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: mainImages,
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': 'USD',
        'product:availability':
          product.quantity && product.quantity > 0 ? 'in stock' : 'out of stock',
      },
    };
  } catch (error) {
    return {
      title: 'Error - Producto no encontrado',
      description: 'Hubo un problema al cargar la información del producto.',
    };
  }
}


// En tu page.tsx
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    // ✅ PASO 1: Decodificar la URL
    const decodedSlug = decodeURIComponent(slug);
    console.log("🔍 Slug original:", slug);
    console.log("🔍 Slug decodificado:", decodedSlug);
    
    // ✅ PASO 2: Normalizar el slug (quitar tildes y caracteres especiales)
    const normalizedSlug = decodedSlug
      .toLowerCase()
      .normalize("NFD") // Separar caracteres de acentos
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/ñ/g, 'n') // ñ → n
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-') // Múltiples guiones a uno
      .replace(/^-|-$/g, ''); // Quitar guiones extremos
    
    console.log("🔍 Slug normalizado:", normalizedSlug);
    
    const product = await getProductBySlug(normalizedSlug);
    
    if (!product) {
      console.log("❌ Producto no encontrado con slug:", normalizedSlug);
      notFound();
    }
    return <ProductDetailsContent product={product} />;
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}