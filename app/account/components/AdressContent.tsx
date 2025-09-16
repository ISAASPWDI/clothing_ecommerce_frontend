"use client";

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Home } from 'lucide-react';
import { Address } from '@/types/user';
import { ADD_ADDRESS, GET_ADRESSES } from '@/app/queriesGraphQL';
import { useMutation, useQuery } from '@apollo/client';
import { useForm } from '@/app/hooks/useForm';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import FormStyle from '@/app/components/FormStyle';

type AddAddressInput = Omit<Address, "id">;

interface AddAddressResponse {
    addAddress: Address;
}

interface AddAddressVariables {
    input: AddAddressInput;
}

export function AddressesContent() {
    const { loading: loadingAddresses, data: addresses, error: errorAddresses } = useQuery<Address[]>(GET_ADRESSES);

    const [addAddress, { loading }] = useMutation<AddAddressResponse, AddAddressVariables>(ADD_ADDRESS, {
        refetchQueries: [{ query: GET_ADRESSES }],
    });
    const [isFieldNull, setIsFieldNull] = useState(false);
    const [nullElement, setNullElement] = useState("");

    const {
        formState,
        onInputChange,
        onResetForm,
    } = useForm<AddAddressInput>({
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

        let fieldNull = false;
        let nullKey = "";

        const formKeys = Object.keys(formState) as Array<keyof AddAddressInput>;

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
            await addAddress({
                variables: { input: { ...formState } }
            });

            console.log("Dirección agregada:", formState.firstName);
            onResetForm();
        } catch (err) {
            console.error("Error al agregar dirección:", err);
        }
    };

    const handleEditAddress = (addressId: number) => {
        console.log('Editar dirección:', addressId);
    };

    const handleDeleteAddress = (addressId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
            console.log('Eliminar dirección:', addressId);
        }
    };

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

    return (
        <div className="border rounded-lg p-6 shadow-sm dark:border-gray-700 dark:bg-[#3a393b]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl dark:text-white">Direcciones de Envío</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors text-sm font-medium">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar dirección
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md dark:bg-[#302f31] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Agregar Nueva Dirección</DialogTitle>
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
                                label="Teléfono"
                                type="tel"
                                name="phone"
                                value={formState.phone}
                                onChange={onInputChange}
                                placeholder="+51 987 654 321"
                                autoComplete="tel"
                            />
                            {/* ⬇️ Mensaje de error */}
                            {isFieldNull && (
                                <div className="flex justify-center items-center bg-white/90 dark:bg-[#302f31]/95 mb-4">
                                    <div className="text-center bg-red-200 dark:bg-red-900/60 p-5 rounded-md">
                                        <p className="text-red-600 dark:text-red-300 text-sm">
                                            Faltan rellenar algunos campos
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg 
                  hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    {loading ? 'Guardando...' : 'Guardar Dirección'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Lista de direcciones */}
            {(!addresses || addresses.length === 0) ? (
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
                                        <Home className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditAddress(address.id)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-2">
                                    <p className="font-medium text-gray-900 dark:text-white">{address.firstName} {address.lastName}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {address.address}
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
