"use client";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

import { signIn } from 'next-auth/react'
import Link from 'next/link';
import { useForm } from '../hooks/useForm';
import { useMutation, ApolloError } from '@apollo/client';
import { CREATE_USER } from '../queriesGraphQL';
import { CreateUserInput, CreateUserResponse } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Copy, RefreshCcw } from "lucide-react";
import LoadingSpinner from "./components/LoadingSpinner";
import GoogleButton from "../account/components/GoogleButton";
import FormStyle from "../components/FormStyle";
import HelpPassword from "../account/components/HelpPassword";
import { useHelpPassword } from '../hooks/useHelpPassword';

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { helpPass,
    setHelpPass,
    handleCopy,
    generatePassword} = useHelpPassword({
      help: null,
      password: "",
      copied: false,
    });

  // const [help, setHelp] = useState<string | null>(null);
  // const [password, setPassword] = useState<string>("");
  // const [copied, setCopied] = useState<boolean>(false);

  const { formState, onInputChange } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    image: '',
    rol: 'USER',
    authType: 'MANUAL',
  })

  // const generatePassword = useCallback((): void => {
  //   const length = 12
  //   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"
  //   let newPassword = ""
  //   for (let i = 0; i < length; i++) {
  //     newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
  //   }
  //   setPassword(newPassword)
  //   setCopied(false)
  // }, []);

  // const handleCopy = (): void => {
  //   navigator.clipboard.writeText(password)
  //   setCopied(true)
  //   setTimeout(() => setCopied(false), 2000)
  // }

  const [registerUser] = useMutation<CreateUserResponse, { data: CreateUserInput }>(CREATE_USER);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    if (!formState.firstName || !formState.email || !formState.password) {
      setError("Por favor, rellena todo los espacios");
      setIsLoading(false);
      return;
    }
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;

        if (!formState.firstName.trim() ||
            !nameRegex.test(formState.firstName) ||
            formState.firstName.trim().length < 3) {
              setError("El nombre debe tener al menos 3 letras y contener caracteres válidos");
            return;
        }

        if (!formState.lastName.trim() ||
            !nameRegex.test(formState.lastName) ||
            formState.lastName.trim().length < 3) {
              setError("El apellido debe tener al menos 3 letras y contener caracteres válidos");
            return;
        }
    if (formState.password.length <= 11 || formState.password.length >= 25) {
      setError("La contraseña debe tener entre 12 y 24 caracteres de largo");
      setHelpPass({
        ...helpPass,
        help: "¿ Necesitas ayuda para tu contraseña ?"
      })
      setIsLoading(false);
      return;
    }
    if(error !== null){
      setIsLoading(false);
    }
    setIsLoading(true)
    try {
      // 1. Registrar al usuario enviando la data al backend
      const { data } = await registerUser({
        variables: {
          data: {
            ...formState,
            name: formState.firstName + ' ' + formState.lastName
          }
        }
      });

      if (data?.createUser) {
        // 2. Iniciar sesión con las credenciales y los datos se envian a nextAuth
        const result = await signIn('credentials', {
          redirect: false,
          email: formState.email,
          password: formState.password
        });

        if (result?.ok) {
          // 3. Si el token esta establecio correctamente
          router.replace('/account');
        } else {
          setError(`Login failed: ${result?.error || 'Unknown error'}`);
          router.push(`/login?registrationSuccess=true&email=${encodeURIComponent(formState.email)}`);
        }
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorMessage = error.message;
        setError(`${errorMessage}`);
        console.error('Error al registrar:', errorMessage);
      } else {
        setError('An unknown error occurred');
        console.error('Error desconocido:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [formState, registerUser, router, error, helpPass, setHelpPass]);

  return (
    <>
      {/* Registro de usuario */}
      {isLoading ? <LoadingSpinner />
        : <div className="flex flex-col xl:flex-row">
          <div className="animate__animated animate__fadeIn bg-[url('../public/login-background-image.webp')] bg-cover bg-center xl:w-1/2 xl:min-h-screen">
          </div>
          <div className="flex xl:w-1/2 p-10 justify-center items-center ">

            <div className="w-3xl md:px-28 lg:px-28 xl:px-28 ">
              {/* Texto de bienvenida */}
              <div className="">
                <div className="flex items-center gap-4">
                  <Link href="/login" className="cursor-pointer text-gray-200">
                    <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate__animated animate__fadeIn">

                      <circle cx="50" cy="50" r="45" stroke="#8200db" strokeWidth="5" fill="#8200db" />
                      <polyline points="60,30 40,50 60,70" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <span>Volver</span>
                </div>


                <h1 className="text-4xl font-bold mb-3 animate__animated animate__fadeIn mt-5">
                  Registrate
                </h1>

                <p className="text-gray-500 dark:text-gray-200 mb-3 animate__animated animate__fadeIn">
                  Registrese con
                </p>
                <GoogleButton onClick={ () => signIn('google', { callbackUrl: '/account' }) }/>

              </div>
              {/* Inputs de credenciales */}
              <form onSubmit={handleSubmit}>
                <hr className="mt-7 mb-6 border-t-2 border-gray-200" />

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate__animated animate__headShake animate__slow">
                    {error}
                  </div>
                )}
                <p className='text-gray-500 dark:text-gray-200 mb-6'> O Crea una nueva cuenta</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormStyle
                    label="Nombres"
                    type="text"
                    name="firstName"
                    value={formState.firstName}
                    onChange={onInputChange}
                    placeholder="Ingresa tus nombres"
                    autoComplete="given-name"
                  />
                  <FormStyle
                    label="Apellidos"
                    type="text"
                    name="lastName"
                    value={formState.lastName}
                    onChange={onInputChange}
                    placeholder="Ingresa tus apellidos"
                    autoComplete="family-name"
                  />
                  <FormStyle
                    label="Correo electrónico"
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={onInputChange}
                    placeholder="Ingresa tu correo"
                    autoComplete="email"
                  />
                  <FormStyle
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formState.password}
                    onChange={onInputChange}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                  />


                </div>
                {/* {help && <p className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded animate__animated animate__headShake'> {help}
                  <Popover>
                    <PopoverTrigger
                      className="ms-2 cursor-pointer"
                      onClick={generatePassword}
                    >
                      Click aquí
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm break-all">{password}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={generatePassword}>
                            <RefreshCcw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleCopy}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {copied && <p className="font-medium text-xs text-green-500 mt-2">¡Contraseña copiada!</p>}
                    </PopoverContent>
                  </Popover>

                </p>} */}
                <HelpPassword help={helpPass.help} password={ helpPass.password} copied={helpPass.copied} generatePassword={generatePassword}  handleCopy= {handleCopy} />

                <button type="submit" className="animate__animated animate__pulse animate__delay-3s w-full flex justify-center items-center px-4 py-3 mt-6 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-0 dark:focus:ring-offset-0 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in w-5 h-5 mr-2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4">
                    </path>
                    <polyline points="10 17 15 12 10 7">
                    </polyline>
                    <line x1="15" x2="3" y1="12" y2="12">

                    </line>
                  </svg>
                  Registrate
                </button>

              </form>

            </div>

          </div>
        </div>}

    </>
  )
}
