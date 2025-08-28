import client from '@/apolloClient';
import { GET_PRODUCT_BY_SLUG, GET_RELATED_PRODUCTS } from '@/app/queriesGraphQL';
import { Product, ProductImage } from '@/types/product';

// En tu product-utils.ts - función mejorada
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    console.log("🔎 Slug original recibido:", slug);
    
    // ✅ Generar todas las variaciones posibles
    const slugVariations = [
      slug, // Original tal como viene
      decodeURIComponent(slug), // URL decoded
      normalizeSlug(slug), // Normalizado
      normalizeSlug(decodeURIComponent(slug)), // Decodificado y normalizado
    ];

    // Eliminar duplicados y vacíos
    const uniqueSlugs = [...new Set(slugVariations)].filter(s => s.length > 0);
    console.log("🔍 Variaciones de slug a probar:", uniqueSlugs);

    // Intentar cada variación
    for (const trySlug of uniqueSlugs) {
      try {
        console.log("🔄 Probando con slug:", trySlug);
        
        const { data } = await client.query({
          query: GET_PRODUCT_BY_SLUG,
          variables: { identifier: trySlug },
          errorPolicy: 'all',
          fetchPolicy: 'no-cache',
        });

        if (data?.getProduct) {
          console.log("✅ ¡Producto encontrado con slug:", trySlug + "!");
          const rawProduct = data.getProduct;

          const normalizedProduct: Product = {
            ...rawProduct,
            productImages: rawProduct.images?.map((img: any) => ({
              id: img.id,
              imagePath: img.imagePath,
              alt: img.alt,
              sortOrder: img.sortOrder,
              isMain: !!img.isMain,
            })) as ProductImage[] || [],
          };

          return normalizedProduct;
        } else {
          console.log("❌ No encontrado con:", trySlug);
        }
      } catch (error) {
        console.log("❌ Error con slug:", trySlug, error);
        continue;
      }
    }

    console.log("❌ Producto no encontrado con ninguna variación");
    return null;

  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getRelatedProducts(productId: number, limit: number = 4): Promise<Product[]> {
  try {
    const { data } = await client.query({
      query: GET_RELATED_PRODUCTS,
      variables: { productId, limit },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    });

    return data?.getRelatedProducts || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Función para generar slug desde nombre si no existe
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // Separar letras de acentos
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos (á → a, é → e, etc.)
    .replace(/ñ/g, 'n') // ñ → n específicamente
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras sin acentos, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Quitar guiones al inicio/final
}
function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    // ✅ Primero intentar decodificar por si viene URL-encoded
    .replace(/%C3%A1/g, 'á') // %C3%A1 = á
    .replace(/%C3%A9/g, 'é') // %C3%A9 = é
    .replace(/%C3%AD/g, 'í') // %C3%AD = í
    .replace(/%C3%B3/g, 'ó') // %C3%B3 = ó
    .replace(/%C3%BA/g, 'ú') // %C3%BA = ú
    .replace(/%C3%B1/g, 'ñ') // %C3%B1 = ñ
    // ✅ Luego normalizar caracteres especiales
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/ñ/g, 'n') // ñ → n
    .replace(/[^a-z0-9\s-]/g, '') // Solo alfanuméricos, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-|-$/g, ''); // Quitar guiones extremos
}