"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Plus, Edit, Trash2, Home } from 'lucide-react';
import { Address } from '@/types/user';
import { ADD_ADDRESS, GET_ADDRESSES, UPDATE_ADDRESS, DELETE_ADDRESS } from '@/app/queriesGraphQL';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from '@/app/hooks/useForm';

// Importar los tipos desde el archivo de GraphQL
import {
    GetAddressesResponse,
    AddAddressResponse,
    AddAddressVariables,
    UpdateAddressResponse,
    UpdateAddressVariables,
    DeleteAddressResponse,
    DeleteAddressVariables
} from '@/types/user';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import FormStyle from '@/app/components/FormStyle';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Tipo para el formulario que sea compatible con useForm
type AddAddressFormInput = {
    firstName: string;
    lastName: string;
    address: string;
    optAddress: string; // Cambiamos a string en lugar de string | null
    city: string;
    zipCode: string;
    phone: string;
};

// Tipo para enviar al backend
type AddAddressInput = Omit<Address, "id">;

export function AddressesContent() {
    const { data: session, status } = useSession();

    // Corregir el tipado de la query
    const { loading: loadingAddresses, data, error: errorAddresses } = useQuery<GetAddressesResponse>(GET_ADDRESSES);
    const addresses = data?.getAddresses || [];

    // Mutations con tipado correcto
    const [addAddress, { loading: loadingAdd }] = useMutation<AddAddressResponse, AddAddressVariables>(ADD_ADDRESS, {
        refetchQueries: [{ query: GET_ADDRESSES }],
    });

    const [updateAddress, { loading: loadingUpdate }] = useMutation<UpdateAddressResponse, UpdateAddressVariables>(UPDATE_ADDRESS, {
        refetchQueries: [{ query: GET_ADDRESSES }],
    });

    const [deleteAddress, { loading: loadingDelete }] = useMutation<DeleteAddressResponse, DeleteAddressVariables>(DELETE_ADDRESS, {
        refetchQueries: [{ query: GET_ADDRESSES }],
    });

    // Estados para el formulario y UI
    const [isFieldNull, setIsFieldNull] = useState(false);
    const [nullElement, setNullElement] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const {
        formState,
        onInputChange,
        onResetForm,
        setFormState
    } = useForm<AddAddressFormInput>({
        firstName: "",
        lastName: "",
        address: "",
        optAddress: "",
        city: "",
        zipCode: "",
        phone: "",
    });

    const handleSubmitAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar si el usuario está autenticado
        if (status !== "authenticated" || !session?.user?.id) {
            console.error("Usuario no autenticado");
            return;
        }

        let fieldNull = false;
        let nullKey = "";

        const formKeys = Object.keys(formState) as Array<keyof AddAddressFormInput>;

        formKeys.forEach((key) => {
            if (formState[key] === "" && key !== "optAddress") {
                fieldNull = true;
                nullKey = key;
            }
        });

        if (fieldNull) {
            setIsFieldNull(true);
            setNullElement(nullKey);
            return;
        } else {
            setIsFieldNull(false);
            setNullElement("");
        }

        try {
            // Convertir el formState a AddAddressInput para enviar al backend
            const addressInput: AddAddressInput = {
                userId: session.user.id, // Obtener userId de la sesión
                firstName: formState.firstName,
                lastName: formState.lastName,
                address: formState.address,
                optAddress: formState.optAddress || null,
                city: formState.city,
                zipCode: formState.zipCode,
                phone: formState.phone,
            };
            console.log(editingAddress);

            if (editingAddress) {
                // Actualizar dirección existente (sin incluir userId en el input de actualización)
                const updateInput = {
                    userId: session.user.id,
                    firstName: formState.firstName,
                    lastName: formState.lastName,
                    address: formState.address,
                    optAddress: formState.optAddress || null,
                    city: formState.city,
                    zipCode: formState.zipCode,
                    phone: formState.phone,
                };

                await updateAddress({
                    variables: {
                        id: editingAddress.id,
                        input: updateInput
                    }
                });
                console.log("Dirección actualizada:", editingAddress.id);
            } else {
                // Agregar nueva dirección
                await addAddress({
                    variables: { input: addressInput }
                });
                console.log("Dirección agregada:", formState.firstName);
            }

            onResetForm();
            setEditingAddress(null);
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Error al procesar dirección:", err);
        }
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setFormState({
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            optAddress: address.optAddress || "",
            city: address.city,
            zipCode: address.zipCode,
            phone: address.phone,
        });
        setIsDialogOpen(true);
    };

    // Pre-llenar el formulario con datos del usuario si está disponible
    const handleOpenNewAddressDialog = () => {
        if (session?.user) {
            setFormState({
                firstName: session.user.firstName || "",
                lastName: session.user.lastName || "",
                address: "",
                optAddress: "",
                city: "",
                zipCode: "",
                phone: session.user.phone || "",
            });
            setEditingAddress(null)
        }
        setIsDialogOpen(true);
    };
    const handleDeleteAddress = async (addressId: number) => {
        try {
            await deleteAddress({
                variables: { id: addressId }
            });
            console.log('Dirección eliminada:', addressId);
        } catch (err) {
            console.error("Error al eliminar dirección:", err);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingAddress(null);
        onResetForm();
        setIsFieldNull(false);
        setNullElement("");
    };

    const isLoading = loadingAdd || loadingUpdate || loadingDelete;

    // Mostrar loading si no hay sesión aún
    if (status === "loading") {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Direcciones de Envío</h2>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si no está autenticado
    if (status !== "authenticated") {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Direcciones de Envío</h2>
                <div className="text-center py-16">
                    <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sesión requerida</h3>
                    <p className="text-gray-500 dark:text-gray-400">Debes iniciar sesión para gestionar tus direcciones</p>
                </div>
            </div>
        );
    }

    if (loadingAddresses) {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Direcciones de Envío</h2>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando direcciones...</p>
                </div>
            </div>
        );
    }

    if (errorAddresses) {
        return (
            <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
                <h2 className="font-bold text-xl pb-3 dark:text-white">Direcciones de Envío</h2>
                <div className="text-center py-16">
                    <div className="bg-red-100 dark:bg-red-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Error al cargar direcciones</h3>
                    <p className="text-gray-500 dark:text-gray-400">Por favor, intenta recargar la página</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl dark:text-white">Direcciones de Envío</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors text-sm font-medium"
                            onClick={handleOpenNewAddressDialog}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar dirección
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md dark:bg-[#302f31] max-h-[80vh] overflow-y-auto"
                        aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress ? 'Editar Dirección' : 'Agregar Nueva Dirección'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitAddress} className="p-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormStyle
                                    label="Nombre *"
                                    type="text"
                                    name="firstName"
                                    value={formState.firstName}
                                    onChange={onInputChange}
                                    placeholder="Juan"
                                    autoComplete="given-name"
                                />
                                <FormStyle
                                    label="Apellido *"
                                    type="text"
                                    name="lastName"
                                    value={formState.lastName}
                                    onChange={onInputChange}
                                    placeholder="Pérez"
                                    autoComplete="family-name"
                                />
                            </div>

                            <FormStyle
                                label="Dirección *"
                                type="text"
                                name="address"
                                value={formState.address}
                                onChange={onInputChange}
                                placeholder="Av. Principal 123"
                                autoComplete="street-address"
                            />

                            <FormStyle
                                label="Dirección de referencia (opcional)"
                                type="text"
                                name="optAddress"
                                value={formState.optAddress}
                                onChange={onInputChange}
                                placeholder="Departamento 2B"
                                autoComplete="address-line2"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormStyle
                                    label="Ciudad *"
                                    type="text"
                                    name="city"
                                    value={formState.city}
                                    onChange={onInputChange}
                                    placeholder="Lima"
                                    autoComplete="address-level2"
                                />
                                <FormStyle
                                    label="Código Postal *"
                                    type="text"
                                    name="zipCode"
                                    value={formState.zipCode}
                                    onChange={onInputChange}
                                    placeholder="15001"
                                    autoComplete="postal-code"
                                />
                            </div>

                            <FormStyle
                                label="Teléfono *"
                                type="tel"
                                name="phone"
                                value={formState.phone}
                                onChange={onInputChange}
                                placeholder="+51 987 654 321"
                                autoComplete="tel"
                            />

                            {/* Mensaje de error */}
                            {isFieldNull && (
                                <div className="flex justify-center items-center bg-white/90 dark:bg-[#302f31]/95 mb-4">
                                    <div className="text-center bg-red-200 dark:bg-red-900/60 p-5 rounded-md">
                                        <p className="text-red-600 dark:text-red-300 text-sm">
                                            Faltan rellenar algunos campos obligatorios
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseDialog}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg 
                                        hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    {isLoading
                                        ? (editingAddress ? 'Actualizando...' : 'Guardando...')
                                        : (editingAddress ? 'Actualizar Dirección' : 'Guardar Dirección')
                                    }
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Lista de direcciones */}
            {addresses.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-purple-100 dark:bg-purple-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No tienes direcciones guardadas</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Agrega una dirección de envío para facilitar tus compras</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className="bg-white dark:bg-[#3a393b] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditAddress(address)}
                                            disabled={isLoading}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    disabled={isLoading || loadingDelete}
                                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {loadingDelete ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </AlertDialogTrigger>

                                            {/* Lógica Dual */}
                                            <AlertDialogContent className="bg-white dark:bg-[#302f31] dark:border-[#302f31]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-gray-900 dark:text-white">
                                                        ¿Eliminar dirección?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-500 dark:text-gray-300">
                                                        Esta acción eliminará permanentemente esta dirección de tu lista de envíos.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-white text-gray-900 border-gray-200 hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-gray-500 dark:hover:bg-white/10 dark:hover:text-white">
                                                        Cancelar
                                                    </AlertDialogCancel>

                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {address.firstName} {address.lastName}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {address.address}
                                        {address.optAddress && `, ${address.optAddress}`}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {address.city} {address.zipCode}
                                    </p>
                                    {address.phone && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            <span className="font-medium">Teléfono:</span> {address.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}