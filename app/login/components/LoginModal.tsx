"use client";

import GoogleButton from '@/app/account/components/GoogleButton';
import FormStyle from '@/app/components/FormStyle';
import { useForm } from '@/app/hooks/useForm';
import LoadingSpinner from '@/app/registration/components/LoadingSpinner';
import { Product } from '@/types/product';
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useEffect, useState } from 'react';


interface LoginModalProps {
  onLoginSuccess?: () => void;
  product: Product;
}

export default function LoginModal({ onLoginSuccess, product }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { formState, onInputChange } = useForm({
    email: '',
    password: '',
  });
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Llamar al callback cuando el login sea exitoso
      onLoginSuccess?.();
    }
  }, [status, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Limpia errores anteriores
  
    const { email, password } = formState;
  
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      setIsLoading(false);
      return;
    }
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (res?.ok && !res.error) {
        console.log("Inicio de sesión es correcto :)");
        // El useEffect se encargará de llamar onLoginSuccess
      } else {
        setError("Correo o contraseña incorrectos.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError("Ocurrió un error inesperado. Inténtalo nuevamente.");
      setIsLoading(false);
    }
  };
  
  if (isLoading || status === "authenticated") {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-10 w-full">
      <div className="max-w-md mx-auto">
        {/* Texto de bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold animate__animated animate__fadeIn mb-3">
            Inicia sesión para continuar
          </h1>
          <p className="text-gray-500 dark:text-gray-200 animate__animated animate__fadeIn">
            Necesitas una cuenta para agregar favoritos
          </p>
        </div>

        {/* Form de login */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded animate__animated animate__headShake animate__slow">
                {error}
              </div>
            )}
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
          
          {/* Recordar contraseña */}
          {/* <div className="animate__animated animate__fadeIn flex justify-end px-2 mt-4">
            <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
              ¿Olvidaste la contraseña?
            </a>
          </div> */}
          
          <button 
            type="submit" 
            className="animate__animated animate__pulse animate__delay-3s w-full flex justify-center items-center px-4 py-3 mt-6 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in w-5 h-5 mr-2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" x2="3" y1="12" y2="12"></line>
            </svg>
            Iniciar sesión
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-200 animate__animated animate__fadeInUp">
          ¿Aún no tienes una cuenta?
          <Link href="/registration" className="ml-2 font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
            Crea una
          </Link>
        </p>

        <hr className="mt-4 mb-3 border-t-2 border-gray-200" />
        
        <p className="text-center mt-5 mb-4 text-sm text-gray-600 dark:text-gray-200 animate__animated animate__fadeInUp">
          O continúe con
        </p>
        
        <div className="flex justify-center">
          <GoogleButton onClick={() => signIn('google', { callbackUrl: `/products/${product.slug}` })} />
        </div>
      </div>
    </div>
  );
}