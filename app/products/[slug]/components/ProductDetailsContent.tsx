'use client'

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Image from 'next/image'
import { ShoppingCart, Heart, Share2, Star, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GET_RELATED_PRODUCTS } from '@/app/queriesGraphQL';
import { Product } from '@/types/product';
import { useProductContext } from '@/contexts/ProductContext';
import Layout from '@/app/shop/LayoutContent';
import { useSession } from 'next-auth/react';
import LoginModal from '@/app/login/components/LoginModal';
import { useDispatch } from 'react-redux';
import { addToCart, CartItem } from '@/app/store/slices/cart/cartSlice';

interface ProductDetailsContentProps {
  product: Product;
}
interface RelatedVariables {
  productId: number
  limit: number
  getRelatedProducts: RelatedProductOptions[]
}
interface RelatedProductOptions {
  id: number
  name: string
  slug: string
  price: number
  description: string
}
export default function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { navigateToProduct } = useProductContext();
  const { data: session } = useSession()
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const { data: relatedData, loading: relatedLoading } = useQuery<RelatedVariables>(GET_RELATED_PRODUCTS, {
    variables: { productId: product.id, limit: 4 },
    skip: !product.id,
  });
  const dispatch = useDispatch();
  const relatedProducts = relatedData?.getRelatedProducts || [];


  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].id);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].id);
    }
  }, [product]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + change, product.quantity || 1)));
  };

  const handleAddFavourites = () => {
    if (!session) {
      setShowLoginModal(true);
    } else {
      // Aquí va tu lógica para agregar a favoritos cuando el usuario está logueado
      console.log("Agregando a favoritos...");
    }
  }
  const handleAddToCart = () => {
    // Validaciones antes de agregar al carrito
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }

    // Obtener la imagen principal para mostrar en el carrito
    const mainImages = product.images?.filter(img => img.isMain) || [];
    const allImages = product.images || [];
    const displayImages = mainImages.length > 0 ? mainImages : allImages;
    const productImage = displayImages[0]?.imagePath || '';

    // Crear el item para el carrito
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      description: product.description!,
      quantity: quantity,
      selectedColor: selectedColor!,
      selectedSize: selectedSize!,
      maxQuantity: product.quantity || 1,
      image: productImage,
      selectedColorName: selectedColor ? product.colors?.find(c => c.id === selectedColor)?.color : undefined,
      selectedSizeName: selectedSize ? product.sizes?.find(s => s.id === selectedSize)?.size : undefined,
    };

    // Dispatch la acción para agregar al carrito
    dispatch(addToCart(cartItem));

    // Opcional: mostrar mensaje de confirmación
    console.log('Producto agregado al carrito:', cartItem);

    // Opcional: puedes agregar una notificación toast aquí
    // toast.success('Producto agregado al carrito');
  };
  type Colors = Record<string, string>;

  const colorMap: Colors = {
    Negro: "#000000",
    Blanco: "#FFFFFF",
    "Azul marino": "#000080",
    "Azul claro": "#ADD8E6",
    Rojo: "#FF0000",
    Rosa: "#FFC0CB",
    Verde: "#008000",
    Amarillo: "#FFFF00",
    Gris: "#808080",
    Beige: "#F5F5DC",
    Marrón: "#8d4925",
    Violeta: "#8A2BE2",
    Naranja: "#FFA500",
    Turquesa: "#40E0D0",
    Coral: "#FF7F50",
  };

  const mainImages = product.images?.filter(img => img.isMain) || [];
  const allImages = product.images || [];
  const displayImages = mainImages.length > 0 ? mainImages : allImages;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-purple-600">
                Inicio
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/shop" className="text-gray-700 hover:text-purple-600">
                  Productos
                </Link>
              </div>
            </li>
            {product.categories && product.categories.length > 0 && (
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href={`/shop/${product.categories[0].slug}`} className="text-gray-700">
                    <span className="text-gray-700 hover:text-purple-600">{product.categories[0].name}</span>
                  </Link>

                </div>
              </li>
            )}
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Contenido principal */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Galería de imágenes */}
          <div className="flex flex-col-reverse">
            {/* Imagen principal */}
            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
              {displayImages.length > 0 ? (
                <Image
                  src={displayImages[activeImageIndex]?.imagePath}
                  alt={displayImages[activeImageIndex]?.alt || product.name}
                  className="w-full h-full object-center object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-200">
                  <span className="text-gray-500">Sin imagen disponible</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {displayImages.length > 1 && (
              <div className="flex space-x-2">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? 'border-purple-500' : 'border-gray-200'
                      }`}
                  >
                    <Image
                      src={image.imagePath}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Información del producto</h2>
              <p className="text-3xl text-gray-900 font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${rating < 4 ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-700">
                {product.reviewCount || 0} reseñas
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Descripción</h3>
              <p className="text-base text-gray-700">
                {product.description}
              </p>
            </div>

            {/* Colores */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-8 h-8 border border-gray-300 rounded-full focus:outline-none ${selectedColor === color.id ? 'ring-2 ring-purple-500' : ''
                        }`}
                      style={{ backgroundColor: colorMap[color.color] || color.color }}
                      title={color.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tallas */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-900 font-medium">Talla</h3>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`py-2 px-3 border text-sm font-medium rounded-md focus:outline-none ${selectedSize === size.id
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-900 font-medium">Cantidad</h3>
                <span className="text-sm text-gray-500">
                  {product.quantity ? `${product.quantity} disponibles` : 'Disponible'}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-4 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                  disabled={quantity >= (product.quantity || 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al carrito
              </button>

              <button
                className="bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={handleAddFavourites}>
                <Heart className="mr-2 h-5 w-5" />
                Favoritos
              </button>
              <Dialog open={showLoginModal} onOpenChange={setShowLoginModal} >
                <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0" aria-describedby={undefined}>
                  <DialogHeader className="sr-only">
                    <DialogTitle>Iniciar Sesión</DialogTitle>
                  </DialogHeader>


                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <LoginModal onLoginSuccess={() => setShowLoginModal(false)} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <button className="bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Detalles adicionales */}
            {product.details && product.details.length > 0 && (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h3 className="text-sm font-medium text-gray-900">Detalles del producto</h3>
                <dl className="mt-4 space-y-2">
                  {product.details.map((detail) => (
                    <div key={detail.id} className="flex">
                      <dt className="text-sm text-gray-600 w-1/3">{detail.key}:</dt>
                      <dd className="text-sm text-gray-900 w-2/3">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: RelatedProductOptions) => (
                <div
                  key={relatedProduct.id}
                  className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                  onClick={() => navigateToProduct(relatedProduct)}
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 group-hover:opacity-75">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Imagen</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-gray-700 font-medium">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}