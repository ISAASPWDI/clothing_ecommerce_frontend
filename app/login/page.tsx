"use client";

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from '../hooks/useForm';
import FormStyle from '../components/FormStyle';
import LoadingSpinner from '../registration/components/LoadingSpinner';
import GoogleButton from '../account/components/GoogleButton';

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { formState, onInputChange } = useForm({
    email: '',
    password: '',
  });
  const { status } = useSession();
  const router = useRouter();

  const handleRouteBeforeLogin = (): void => {
    const routeBeforeLogin = localStorage.getItem("previousRoute");
    if (typeof routeBeforeLogin === "string") return router.push(routeBeforeLogin);
  }
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [status, router]);



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
        // No hacemos nada, dejamos que el useSession maneje la navegación
        console.log("Inicio de sesión es correcto :)");
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
    <>
      {/* Inicio de sesión */}
      <div className="flex flex-col xl:flex-row">
        <div className="animate__animated animate__fadeIn bg-[url('../public/login-background-image.webp')] bg-cover bg-center xl:w-1/2 xl:min-h-screen">
        </div>
        <div className="flex xl:w-1/2 p-10 justify-center items-center ">

          <div className="w-3xl md:px-28 lg:px-28 xl:px-28 ">
            {/* Texto de bienvenida */}
            <div className="">
              <div className="flex items-center gap-4">
                <button onClick={handleRouteBeforeLogin} className="cursor-pointer text-gray-200">
                  <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="animate__animated animate__fadeIn">

                    <circle cx="50" cy="50" r="45" stroke="#8200db" strokeWidth="5" fill="#8200db" />
                    <polyline points="60,30 40,50 60,70" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span>Volver</span>
              </div>


              <h1 className="text-4xl font-bold animate__animated animate__fadeIn mt-5 mb-3">
                Bienvenido otra vez!
              </h1>
              <p className="text-gray-500 dark:text-gray-200 mb-5 animate__animated animate__fadeIn">
                Por favor inicia sesión con tu cuenta
              </p>
            </div>
            {/* Inputs de credenciales */}
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate__animated animate__headShake animate__slow">
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
                <div className="animate__animated animate__fadeIn flex justify-end px-2">
                  <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">
                    ¿ Olvidaste la contraseña?
                  </a>
                </div>
                <button type="submit" className="animate__animated animate__pulse animate__delay-3s w-full flex justify-center items-center px-4 py-3 mt-6 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-0 dark:focus:ring-offset-0 transition-colors cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in w-5 h-5 mr-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>Iniciar sesión</button>
              </form>

            <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-200 animate__animated animate__fadeInUp animate__delay-1s ">¿ Aún no tienes una cuenta ?
              <Link href="/registration" className="ml-2 font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400">Crea una</Link>
            </p>
            <hr className="mt-4 mb-3 border-t-2 border-gray-200" />
            <p className="text-center mt-5 mb-4 text-sm text-gray-600 dark:text-gray-200 animate__animated animate__fadeInUp animate__delay-1s "> O continúe con
            </p>
            <div className="flex justify-center">
              <GoogleButton onClick={ () => signIn('google', { callbackUrl: '/account' }) }/>
            </div>

          </div>

        </div>
      </div>

    </>
  )
}
