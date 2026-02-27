"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_MY_ORDERS_PAGINATED } from '@/app/queriesGraphQL';

// Tipos para las órdenes
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    externalReference?: string;
    status: string;
    total: number;
    createdAt: string;
    orderItems?: OrderItem[];
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface GetMyOrdersPaginatedResponse {
    myOrdersPaginated: {
        orders: Order[];
        pagination: Pagination;
    };
}

interface GetMyOrdersPaginatedVariables {
    page?: number;
    limit?: number;
}

const formatDate = (timestampString: string) => {
    const timestampNumber = parseInt(timestampString, 10);
    const date = new Date(timestampNumber); 
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    });
};

// Función para formatear el precio
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(price);
};

// Función para obtener el color del estado
const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
        'PENDING': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        'PAID': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'in_process': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        'delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        'shipped': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'CANCELLED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
};

// Función para traducir el estado
const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
        'PENDING': 'Pendiente',
        'PAID': 'Aprobado',
        'in_process': 'Processing',
        'delivered': 'Delivered',
        'shipped': 'Shipped',
        'CANCELLED': 'Cancelado'
    };
    return translations[status] || status;
};

// Asegúrate de importar este componente en tu archivo de Account
// import { OrdersContent } from "./components/OrdersContent";

export function OrdersContent() {
    const { status: sessionStatus } = useSession();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { loading, data, error } = useQuery<GetMyOrdersPaginatedResponse, GetMyOrdersPaginatedVariables>(
        GET_MY_ORDERS_PAGINATED,
        {
            variables: {
                page: currentPage,
                limit: itemsPerPage
            },
            skip: sessionStatus !== "authenticated"
        }
    );

    const orders = data?.myOrdersPaginated.orders || [];
    console.log(orders);
    
    const pagination = data?.myOrdersPaginated.pagination;

    const handlePageChange = (newPage: number) => {
        if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleViewOrder = (order: Order) => {
        // Usar externalReference para la URL pero pasar el ID como query param
        const orderRef = order.externalReference || `ORDER-${order.id}`;
        // Pasamos el ID real como query parameter
        router.push(`/orders/${orderRef}?id=${order.id}`);
    };

    // Mostrar loading si no hay sesión aún
    if (sessionStatus === "loading") {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Mis Órdenes</h2>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si no está autenticado
    if (sessionStatus !== "authenticated") {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Mis Órdenes</h2>
                <div className="text-center py-16">
                    <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sesión requerida</h3>
                    <p className="text-gray-500 dark:text-gray-400">Debes iniciar sesión para ver tus órdenes</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Mis Órdenes</h2>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Mis Órdenes</h2>
                <div className="text-center py-16">
                    <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Error al cargar órdenes</h3>
                    <p className="text-gray-500 dark:text-gray-400">Por favor, intenta recargar la página</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl dark:text-white">Mis Órdenes</h2>
                {pagination && pagination.totalOrders > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {pagination.totalOrders} {pagination.totalOrders === 1 ? 'orden' : 'órdenes'} en total
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-purple-100 dark:bg-purple-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No tienes órdenes aún</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Cuando realices una compra, tus órdenes aparecerán aquí</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    {/* Left section - Order info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                Orden #{order.id}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-md text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Fecha: {formatDate(order.createdAt)}
                                        </p>
                                        
                                        {/* TODO: View Order Button */}
                                        <button 
                                            onClick={() => handleViewOrder(order)}
                                            className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                                        >
                                            Ver Orden
                                        </button>
                                    </div>
                                    
                                    {/* Right section - Price and Track */}
                                    <div className="text-left lg:text-right space-y-3">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginación */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Página {pagination.currentPage} de {pagination.totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}