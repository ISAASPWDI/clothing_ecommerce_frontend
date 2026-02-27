"use client";

import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import Layout from '@/app/home/Layout';
import { GET_MY_ORDER_DETAIL } from '@/app/queriesGraphQL';
import { useEffect } from 'react';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    selectedColor?: string;
    selectedSize?: string;
}

interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    province: string;
    zipCode: string;
}

interface OrderDetail {
    id: number;
    externalReference: string;
    status: string;
    total: number;
    subtotal: number;
    itemsCount: number;
    createdAt: string;
    paidAt?: string;
    orderItems: OrderItem[];
    customerInfo: CustomerInfo;
    paymentMethodId?: string;
    mercadoPagoPaymentId?: string;
}

interface GetMyOrderDetailResponse {
    myOrderDetail: OrderDetail;
}

interface GetMyOrderDetailVariables {
    externalReference: string;
}

interface OrderDetailClientProps {
    externalReference: string;
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

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(price);
};

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

const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
        'PENDING': 'Pendiente',
        'PAID': 'Aprobado',
        'in_process': 'En Proceso',
        'delivered': 'Entregado',
        'shipped': 'Enviado',
        'CANCELLED': 'Cancelado'
    };
    return translations[status] || status;
};

const OrderProgress = ({ status, createdAt }: { status: string; createdAt: string }) => {
    const steps = [
        { key: 'pending', label: 'Pedido Realizado', icon: CheckCircle },
        { key: 'in_process', label: 'Procesando', icon: Package },
        { key: 'shipped', label: 'Enviado', icon: Truck },
        { key: 'delivered', label: 'Entregado', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === status);

    return (
        <div className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Progreso del Pedido</h3>
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.key} className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                <Icon className={`w-5 h-5 ${isCompleted
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-gray-400 dark:text-gray-500'
                                    }`} />
                            </div>
                            <div className="flex-1">
                                <p className={`font-medium ${isCurrent
                                        ? 'text-gray-900 dark:text-white'
                                        : isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {step.label}
                                </p>
                                {isCompleted && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {formatDate(createdAt)}
                                    </p>
                                )}
                            </div>
                            {isCompleted && (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Número de Seguimiento</p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">TRK928374651</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                        Rastrear Paquete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function OrderDetailClient({ externalReference }: OrderDetailClientProps) {
    const router = useRouter();

    const orderId = externalReference.replace('ORDER-', '');

    const { loading, data, error } = useQuery<GetMyOrderDetailResponse, GetMyOrderDetailVariables>(
        GET_MY_ORDER_DETAIL,
        {
            variables: { externalReference },
            skip: !externalReference
        }
    );

    // useEffect(() => { console.log("La data : ", data); console.error("Error :", error); }, [data, error])
    if (loading) {
        return (
            <Layout>
                <div className="py-10 px-4 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando orden...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !data) {
        return (
            <Layout>
                <div className="py-10 px-4 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
                    <div className="text-center py-16">
                        <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Error al cargar la orden
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            No se pudo encontrar la orden o no tienes acceso a ella
                        </p>
                        <button
                            onClick={() => router.push('/account')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Volver a mi cuenta
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const order = data.myOrderDetail;

    return (
        <Layout>
            <div className="py-10 px-4 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Volver a Mi Cuenta</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Pedido {order.externalReference}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Realizado el {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase ${getStatusColor(order.status)}`}>
                        {translateStatus(order.status)}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <OrderProgress status={order.status} createdAt={order.createdAt} />

                        <div className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Artículos del Pedido</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
                                            {item.selectedColor && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Color: {item.selectedColor}</p>
                                            )}
                                            {item.selectedSize && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Talla: {item.selectedSize}</p>
                                            )}
                                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                                                {formatPrice(item.price)} c/u
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dirección de Envío</h3>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                                </p>

                                <p>{order.customerInfo?.address}</p>

                                {order.customerInfo?.apartment && (
                                    <p>{order.customerInfo.apartment}</p>
                                )}

                                <p>
                                    Argentina, {order.customerInfo?.province} {order.customerInfo?.zipCode}
                                </p>

                                <p className="pt-2">{order.customerInfo?.phone}</p>
                                <p>{order.customerInfo?.email}</p>
                            </div>

                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-24">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resumen del Pedido</h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Envío</span>
                                    <span className="font-medium">{formatPrice(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Impuestos</span>
                                    <span className="font-medium">{formatPrice(order.total - order.subtotal)}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatPrice(order.total)}
                                    </span>
                                </div>
                            </div>

                            {order.paymentMethodId && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Método de Pago</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {order.paymentMethodId}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 space-y-3">
                                <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                                    Rastrear Paquete
                                </button>
                                <button className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
                                    Contactar Soporte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}