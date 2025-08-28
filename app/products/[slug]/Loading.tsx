export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex mb-8 space-x-2">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Contenido principal */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Galería de imágenes skeleton */}
        <div className="flex flex-col-reverse">
          <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Miniaturas skeleton */}
          <div className="flex space-x-2 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Información del producto skeleton */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          {/* Título */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          
          {/* Precio */}
          <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          
          {/* Reviews */}
          <div className="flex items-center mb-6">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="ml-3 h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          
          {/* Descripción */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
          </div>
          
          {/* Colores */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            <div className="flex space-x-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Tallas */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Cantidad */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="mx-4 h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full sm:w-24 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full sm:w-16 h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Productos relacionados skeleton */}
      <div className="mt-16 border-t border-gray-200 pt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
              </div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}