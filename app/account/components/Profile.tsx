import FormStyle from '@/app/components/FormStyle';
import HelpPassword from '@/app/account/components/HelpPassword';
import { useForm } from '@/app/hooks/useForm';
import { useHelpPassword } from '@/app/hooks/useHelpPassword';
import { UPDATE_USER } from '@/app/queriesGraphQL';
import { useMutation } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useRef, useState } from 'react'

interface SessionOptions {
    session: {
        accessToken?: string,
        user: {
            id: string;
            firstName: string;
            lastName?: string | null;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            rol: string;
            authType: string;
            phone?: string | null;
        };
    } | null;
}
interface UpdateUserInput {
    id: string;
    firstName?: string;
    lastName?: string;
    password: string;
    phone?: string;
    authType: string;
    rol: string;
    name?: string;
    email: string;
    emailVerified?: string;
    image?: string;
}

export default function Profile({ session }: SessionOptions) {
    const { update } = useSession();
    const { formState, onInputChange, setFormState } = useForm({
        firstName: "",
        lastName: "",
        phone: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });
    const errorRef = useRef<HTMLDivElement | null>(null);
    const { helpPass,
        setHelpPass,
        handleCopy,
        generatePassword } = useHelpPassword({
            help: null,
            password: "",
            copied: false,
        });
    const scrollToError = (errorText: string) => {
        setMessage({ text: errorText, type: "error" });
        setTimeout(() => {
            errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 10);
        // Limpiar mensaje de error después de 3 segundos
        setTimeout(() => {
            setMessage({ text: "", type: "" });
        }, 3000);
    };
    const [updateUser] = useMutation<UpdateUserInput>(UPDATE_USER);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;

        if (!formState.firstName.trim() ||
            !nameRegex.test(formState.firstName) ||
            formState.firstName.trim().length < 3) {
            scrollToError("First name must be at least 3 letters and contain only valid characters");
            return;
        }

        if (!formState.lastName.trim() ||
            !nameRegex.test(formState.lastName) ||
            formState.lastName.trim().length < 3) {
            scrollToError("Last name must be at least 3 letters and contain only valid characters");
            return;
        }


        if (formState.newPassword) {
            if (formState.newPassword !== formState.confirmPassword) {
                scrollToError("Las contraseñas no coinciden");
                setHelpPass({
                    ...helpPass,
                    help: "¿ Necesitas ayuda para tu contraseña ?"
                })
                return;
            }
            if (formState.newPassword.length <= 11 || formState.confirmPassword.length >= 25) {
                scrollToError("La contraseña debe tener entre 12 y 24 caracteres de largo");
                setHelpPass({
                    ...helpPass,
                    help: "¿ Necesitas ayuda para tu contraseña ?"
                })
                return;
            }
        }

        if (formState.phone && formState.phone.length < 10) {
            scrollToError("Phone number must be at least 10 digits");
            return;
        }

        try {
            const userData = {
                id: session?.user.id,
                firstName: formState.firstName.trim(),
                lastName: formState.lastName.trim(),
                phone: formState.phone?.trim() || undefined,
                password: formState.newPassword,
                authType: session?.user.authType,
                rol: session?.user.rol,
                email: session?.user.email!.trim(),
                name: `${formState.firstName.trim()} ${formState.lastName.trim()}`,
            };

            // Solo añadir la contraseña si se ha especificado una nueva
            if (formState.newPassword && formState.newPassword.length > 0) {
                userData.password = formState.newPassword;
            }

            console.log("Datos enviados para actualización:", JSON.stringify(userData, null, 2));
            console.log("Token utilizado:", session?.accessToken);
            
            await updateUser({
                variables: {
                    data: userData,
                },
            });

            // Actualizar la sesión de NextAuth con los nuevos datos
            await update({
                user: {
                    ...session?.user,
                    firstName: formState.firstName.trim(),
                    lastName: formState.lastName.trim(),
                    phone: formState.phone?.trim() || null,
                    name: `${formState.firstName.trim()} ${formState.lastName.trim()}`,
                }
            });

            // Actualizar los valores iniciales con los nuevos datos guardados
            const newInitialValues = {
                firstName: formState.firstName.trim(),
                lastName: formState.lastName.trim(),
                phone: formState.phone?.trim() || "",
            };
            
            setInitialValues(newInitialValues);
            
            // Limpiar los campos de contraseña
            setFormState(prev => ({
                ...prev,
                newPassword: "",
                confirmPassword: "",
            }));

            setMessage({ text: "Profile updated successfully", type: "success" });
            setHasChanges(false);
            
            // Auto-scroll al mensaje de éxito
            setTimeout(() => {
                errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 10);

            // Limpiar mensaje de éxito después de 2 segundos
            setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 2000);
        } catch (error) {
            if (error instanceof Error) {
                scrollToError(error.message);
            }
        }
    };



    useEffect(() => {
        if (session?.user) {
            const initial = {
                firstName: session.user.firstName || "",
                lastName: session.user.lastName || "",
                phone: session.user.phone || "",
            };
            setFormState(prev => ({
                ...prev,
                ...initial
            }));
            setInitialValues(initial);
        }
    }, [session, setFormState]);

    useEffect(() => {
        const isChanged =
            formState.firstName !== initialValues.firstName ||
            formState.lastName !== initialValues.lastName ||
            formState.phone !== initialValues.phone ||
            formState.newPassword !== "" ||
            formState.confirmPassword !== "";

        setHasChanges(isChanged);
    }, [formState, initialValues]);


    return (
        <div>
            <h2 className="font-bold text-xl pb-3">Información del perfil</h2>

            {message.text && (
                <div className={`p-3 rounded mb-4 ${message.type === "error" ? "bg-red-100 text-red-700" :
                    message.type === "success" ? "bg-green-100 text-green-700" :
                        "bg-blue-100 text-blue-700"
                    }`} ref={errorRef}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormStyle
                        label="Nombres"
                        type="text"
                        name="firstName"
                        value={formState.firstName}
                        onChange={onInputChange}
                        placeholder="Enter your first name"
                        autoComplete="given-name"
                    />

                    <FormStyle
                        label="Apellidos"
                        type="text"
                        name="lastName"
                        value={formState.lastName}
                        onChange={onInputChange}
                        placeholder="Enter your last name"
                        autoComplete="family-name"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <FormStyle
                        label="Número de teléfono"
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={onInputChange}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                    />
                </div>

                <h2 className="font-bold text-xl mt-10 mb-6">Cambiar contraseña</h2>

                {session?.user.authType === 'PROVIDER' ?
                    <div className="max-w-[250px] text-center bg-yellow-100 rounded-md">
                        <p className=" text-yellow-700 p-3 ">Tú no tienes una contraseña</p>
                    </div> :
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <FormStyle
                            label="Nueva contraseña"
                            type="password"
                            name="newPassword"
                            value={formState.newPassword}
                            onChange={onInputChange}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                        />

                        <FormStyle
                            label="Confirmar nueva contraseña"
                            type="password"
                            name="confirmPassword"
                            value={formState.confirmPassword}
                            onChange={onInputChange}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                        />
                    </div>}

                <HelpPassword help={helpPass.help} password={helpPass.password} copied={helpPass.copied} generatePassword={generatePassword} handleCopy={handleCopy} />

                <button
                    type="submit"
                    className={`px-6 py-3 rounded-md mt-5 text-white font-medium ${hasChanges ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                    disabled={!hasChanges}
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}