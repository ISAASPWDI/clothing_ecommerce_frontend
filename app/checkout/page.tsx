'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// NUEVOS IMPORTS DE SHADCN/UI PARA EL MODAL DE ALERTA
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';// Ajusta la ruta según tu estructura
import {
  ArrowLeft,
  Info,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  Package,
  Mail,
  Phone,
  Home,
  Building
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { RootState } from '../store/store';
import { useForm } from '../hooks/useForm';
import FormStyle from '../components/FormStyle';
import { useRouter } from 'next/navigation'
import { CREATE_PAYMENT_PREFERENCE } from "../queriesGraphQL";

// Provincias de Argentina
const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
  'Ciudad Autónoma de Buenos Aires'
];

// Definición del tipo para el estado del modal de error
interface ErrorModalState {
  isOpen: boolean;
  title: string;
  description: string;
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalItems, totalPrice } = useSelector((state: RootState) => state.cart);

  // Mutation de Apollo
  const [crearPreferenciaPago, { loading: mercadoPagoLoading, error: mercadoPagoError }] = useMutation(CREATE_PAYMENT_PREFERENCE);

  // ESTADO PARA EL MODAL DE ERROR
  const [errorModal, setErrorModal] = useState<ErrorModalState>({
    isOpen: false,
    title: '',
    description: '',
  });

  // Función para mostrar el modal de error
  const showErrorMessage = (title: string, description: string) => {
    setErrorModal({ isOpen: true, title, description });
  };

  useEffect(() => {
    if (totalItems === 0) {
      router.push('/cart');
    }
  }, [totalItems, router]);

  // Usando el custom hook useForm
  const {
    firstName,
    lastName,
    email,
    address,
    apartment,
    city,
    province,
    zipCode,
    phone,
    saveInfo,
    formState,
    onInputChange,
    setFormState,
    onResetForm
  } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    province: '',
    zipCode: '',
    phone: '',
    saveInfo: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState<string | null>(null);

  // Manejador especial para select y checkbox
  const handleSpecialInputChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState({
        ...formState,
        [name]: checked
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
  };

  // Validación del formulario MODIFICADA PARA USAR EL MODAL
  const validateForm = useCallback(() => {
    if (!email || !firstName || !lastName || !address || !province || !zipCode || !phone) {
      showErrorMessage(
        'Campos incompletos',
        'Por favor, completa todos los campos obligatorios para continuar con la compra.'
      );
      return false;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorMessage(
        'Email inválido',
        'Por favor, ingresa un formato de correo electrónico válido (ej. tu@email.com).'
      );
      return false;
    }

    return true;
  }, [email, firstName, lastName, address, province, zipCode, phone]);

  const handleMercadoPagoCheckout = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setProcessingMethod('mercadopago');

    try {
      const mercadoPagoItems = items.map(item => ({
        id: item.id.toString(),
        title: item.name,
        description: `${item.selectedColorName ? `Color: ${item.selectedColorName}` : ''} ${item.selectedSizeName ? `Talle: ${item.selectedSizeName}` : ''}`.trim(),
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
        category_id: "retail"
      }));

      const payerInfo = {
        email: email,
        name: firstName,
        surname: lastName,
        phone: {
          area_code: phone.substring(0, 3).replace(/\D/g, ''),
          number: phone.replace(/\D/g, '').substring(3)
        },
        address: {
          street_name: address,
          street_number: apartment ? parseInt(apartment) : undefined,
          zip_code: zipCode
        }
      };

      // Usar ngrok URL o variable de entorno
      const baseUrl = process.env.FRONTEND_URL;

      const backUrls = {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`
      };

      console.log('URLs de retorno:', backUrls);

      const { data } = await crearPreferenciaPago({
        variables: {
          input: {
            items: mercadoPagoItems,
            payer: payerInfo,
            back_urls: backUrls,
            auto_return: "approved", // ← Asegúrate que esto se envíe
            external_reference: `ORDER-${Date.now()}`,
            statement_descriptor: "TU_TIENDA",
            binary_mode: false,
            payment_methods: {
              installments: 12
            },
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        }
      });

      console.log('Preferencia creada:', data);

      if (data?.crearPreferenciaPago?.initPoint) {
        // Guardar información del pedido
        if (saveInfo) {
          localStorage.setItem('customerInfo', JSON.stringify({
            firstName, lastName, email, address, apartment,
            city, province, zipCode, phone
          }));
        }

        const externalRef = `ORDER-${Date.now()}`;
        localStorage.setItem('pendingOrder', JSON.stringify({
          items: items,
          total: totalPrice,
          customerInfo: { firstName, lastName, email, phone, address },
          externalReference: externalRef,
          timestamp: Date.now()
        }));

        console.log('External reference guardada:', externalRef);

        // Redirigir a MercadoPago
        // const checkoutUrl = data.crearPreferenciaPago.sandboxInitPoint ||
        //   data.crearPreferenciaPago.initPoint;
        const checkoutUrl = data.crearPreferenciaPago.initPoint;

        console.log('Redirigiendo a:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No se pudo obtener el link de pago');
      }

    } catch (error) {
      console.error('Error al crear preferencia de MercadoPago:', error);
      showErrorMessage(
        'Error de Pago',
        'Hubo un error al procesar el pago con Mercado Pago. Por favor, intenta nuevamente más tarde.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingMethod(null);
    }
  };

  const handleGooglePayCheckout = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setProcessingMethod('googlepay');

    try {
      console.log('Procesando pago con Google Pay...', {
        items,
        totalPrice,
        customerInfo: formState
      });

      // Aquí implementarías la integración con Google Pay
      // Por ahora es una simulación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // dispatch(clearCart());
      showErrorMessage(
        'Función no disponible',
        'El método de pago con Google Pay aún no está implementado. Por favor, utiliza otra opción.'
      );

    } catch (error) {
      console.error('Error en el checkout:', error);
    } finally {
      setIsProcessing(false);
      setProcessingMethod(null);
    }
  };

  // Mostrar error de MercadoPago si existe (usando el modal)
  useEffect(() => {
    if (mercadoPagoError) {
      console.error('Error de MercadoPago:', mercadoPagoError);
      showErrorMessage(
        'Error de Conexión',
        'Error al conectar con MercadoPago. Por favor, revisa tu conexión o intenta de nuevo.'
      );
    }
  }, [mercadoPagoError]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-50 dark:from-[#1a1a1b] dark:via-[#1e1e1f] dark:to-[#202023]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header animado */}
          <div className="mb-8 animate-fade-in-down">
            <Link
              href="/cart"
              className="group inline-flex items-center text-purple-600 dark:text-purple-600 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-all duration-300 hover:translate-x-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Volver al carrito</span>
            </Link>

            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Finalizar compra</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Completa tu información para procesar el pedido</p>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Formulario de checkout - Columna izquierda */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-[#302f31] rounded-2xl shadow-lg dark:shadow-xl p-8 space-y-8 animate-fade-in-left border border-gray-200 dark:border-[#3a393b]">

                {/* Información de contacto */}
                <div className="animate-fade-in-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Mail className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Información de contacto</h2>
                  </div>

                  <FormStyle
                    label="Correo electrónico"
                    type="email"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </div>

                {/* Información de envío */}
                <div className="animate-fade-in-up animation-delay-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Información de envío</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormStyle
                        label="Nombre"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={onInputChange}
                        placeholder="Juan"
                        autoComplete="given-name"
                      />
                      <FormStyle
                        label="Apellido"
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={onInputChange}
                        placeholder="Pérez"
                        autoComplete="family-name"
                      />
                    </div>

                    <div className="relative mb-4">
                      <label htmlFor="address" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Dirección
                      </label>
                      <div className="flex items-center rounded-md bg-white dark:bg-[#1a1a1b] pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-[#3a393b] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-purple-600 dark:has-[input:focus-within]:outline-purple-400">
                        <Home className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <input
                          type="text"
                          name="address"
                          id="address"
                          placeholder="Av. Corrientes 1234"
                          value={address}
                          onChange={onInputChange}
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-100 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-md bg-transparent"
                          autoComplete="street-address"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <label htmlFor="apartment" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Apartamento, suite, etc. (opcional)
                      </label>
                      <div className="flex items-center rounded-md bg-white dark:bg-[#1a1a1b] pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-[#3a393b] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-purple-600 dark:has-[input:focus-within]:outline-purple-400">
                        <Building className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <input
                          type="text"
                          name="apartment"
                          id="apartment"
                          placeholder="Piso 2, Depto B"
                          value={apartment}
                          onChange={onInputChange}
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-100 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-md bg-transparent"
                          autoComplete="address-line2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="animate__animated animate__pulse animate__delay-2s mb-6">
                        <div className="relative mb-4">
                          <label
                            htmlFor="province"
                            className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2"
                          >
                            Provincia
                          </label>
                          <Select
                            value={province}
                            onValueChange={(value) =>
                              setFormState({
                                ...formState,
                                province: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full h-12 px-3 py-0 border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-gray-100">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROVINCIAS_ARGENTINA.map((provincia) => (
                                <SelectItem key={provincia} value={provincia}>
                                  {provincia}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="zipCode" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100 mb-2">
                          Código postal
                        </label>
                        <div className="mt-2">
                          <div className="flex items-center rounded-md bg-white dark:bg-[#1a1a1b] pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-[#3a393b] has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-purple-600 dark:has-[input:focus-within]:outline-purple-400 relative">
                            <Package className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                            <input
                              type="text"
                              name="zipCode"
                              id="zipCode"
                              placeholder="1234"
                              value={zipCode}
                              onChange={onInputChange}
                              className="block min-w-0 grow py-1.5 pr-8 pl-1 text-base text-gray-900 dark:text-gray-100 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-md bg-transparent"
                              autoComplete="postal-code"
                              required
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                                >
                                  <Info className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  Puedes consultar tu código postal en el sitio oficial del
                                  Correo Argentino: correoargentino.com.ar
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FormStyle
                      label="Teléfono"
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={onInputChange}
                      placeholder="+54 11 1234-5678"
                      autoComplete="tel"
                    />

                  </div>
                </div>

                {/* Método de envío */}
                <div className="animate-fade-in-up animation-delay-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Truck className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Método de envío</h2>
                  </div>

                  <div className="border border-purple-200 dark:border-purple-800/50 rounded-xl p-6 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <Info className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ingresa tu dirección completa para ver las opciones de envío disponibles.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Método de pago */}
                <div className="animate-fade-in-up animation-delay-400">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Método de pago</h2>
                  </div>

                  {/* Express Checkout */}
                  <div className="mb-8">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                      Express checkout
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* MercadoPago */}
                      <div className="bg-[url('../public/MERCADO-PAGO.jpg')] bg-cover bg-center rounded-xl h-16 w-full">
                        <button
                          onClick={handleMercadoPagoCheckout}
                          disabled={isProcessing || mercadoPagoLoading}
                          className="w-full h-full flex items-center justify-center text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 cursor-pointer"
                        >
                          {isProcessing && processingMethod === 'mercadopago' || mercadoPagoLoading ? (
                            <div className="flex items-center space-x-2 bg-[#fee600] rounded-xl p-2 h-full">
                              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                              <span className="h-full text-black">Procesando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="opacity-0">Pagar con Mercado Pago</span>
                            </div>
                          )}
                        </button>
                      </div>


                      {/* Google Pay */}
                      <button
                        onClick={handleGooglePayCheckout}
                        disabled={isProcessing}
                        className="group relative w-full bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-900 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        {isProcessing && processingMethod === 'googlepay' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Procesando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5" />
                            <span>Google Pay</span>
                          </div>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center my-6">
                      <div className="flex-1 border-t border-gray-200 dark:border-[#3a393b]"></div>
                      <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#302f31]">O</span>
                      <div className="flex-1 border-t border-gray-200 dark:border-[#3a393b]"></div>
                    </div>
                  </div>

                  {/* Guardar información */}
                  <div className="mb-6 animate-fade-in-up animation-delay-500">
                    <label className="group flex items-center p-4 rounded-xl border border-gray-200 dark:border-[#3a393b] hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-all duration-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={saveInfo}
                        // Usamos handleSpecialInputChange que ya maneja checkbox
                        onChange={handleSpecialInputChange}
                        className="h-5 w-5 text-purple-600 dark:text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400 border-gray-300 dark:border-[#3a393b] rounded transition-colors duration-200 bg-white dark:bg-[#1a1a1b]"
                      />
                      <div className="ml-3 flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                          Guardar mi información para un checkout más rápido
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido - Columna derecha */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white dark:bg-[#302f31] rounded-2xl shadow-lg dark:shadow-xl p-6 sticky top-8 animate-fade-in-right border border-gray-200 dark:border-[#3a393b]">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumen del pedido</h3>
                </div>

                {/* Productos en el carrito */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div
                      key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a393b] transition-colors duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative group">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-[#3a393b] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-purple-600 dark:bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg animate-bounce-small">
                            {item.quantity}
                          </span>

                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.selectedColorName && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-[#3a393b] text-gray-600 dark:text-gray-300">
                              {item.selectedColorName}
                            </span>
                          )}
                          {item.selectedSizeName && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-[#3a393b] text-gray-600 dark:text-gray-300">
                              {item.selectedSizeName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen de precios */}
                <div className="border-t border-gray-200 dark:border-[#3a393b] pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 dark:text-gray-300 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Subtotal ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
                    </span>
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600 dark:text-gray-300 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Envío
                    </span>
                    <span className="text-base text-gray-600 dark:text-gray-300">
                      Calculado en el siguiente paso
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-[#3a393b] pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-purple-600 dark:text-purple-600">ARS ${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      Transacciones seguras y encriptadas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ALERTA DE ERROR */}
      <AlertDialog open={errorModal.isOpen} onOpenChange={(isOpen) => setErrorModal({ ...errorModal, isOpen })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 dark:text-red-400">
              <Info className="inline-block h-6 w-6 mr-2 mb-1" />
              {errorModal.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorModal.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorModal({ ...errorModal, isOpen: false })} className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </TooltipProvider>
  );
}