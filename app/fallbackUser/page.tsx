'use client';

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import GoogleButton from "../account/components/GoogleButton";
import Layout from "../home/Layout";
import Link from "next/link";

export default function FallbackUser() {
    return (
        <Layout>


            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-[#3a393b] shadow-2xl rounded-2xl p-10 max-w-lg w-full text-center"
                >
                    <h1 className="text-3xl font-extrabold text-purple-700 dark:text-purple-600 mb-4">
                        Tu sesión ha finalizado 👋
                    </h1>
                    <p className="text-zinc-600 dark:text-gray-300 mb-6">
                        Para acceder a tu cuenta y wishlist, inicia sesión nuevamente.
                    </p>

                    {/* Botón de Google */}
                    <div className="flex justify-center mb-10">
                        <GoogleButton
                            onClick={() => signIn("google", { callbackUrl: "/account" })}
                        />
                    </div>

                    {/* Opción de credenciales */}
                    <button
                        onClick={() => signIn("credentials", { callbackUrl: "/account" })}
                        className="w-full bg-purple-600 dark:bg-purple-600 text-white py-2 rounded-lg shadow hover:bg-purple-700 dark:hover:bg-purple-700 transition"
                    >
                        Iniciar sesión con Email
                    </button>

                    {/* Continuar sin iniciar sesión */}
                    <p className="text-sm text-zinc-500 dark:text-gray-400 mt-6">
                        ¿Prefieres seguir explorando?{" "}
                        <Link href={"/shop"}>
                            <span className="text-purple-600 dark:text-purple-600 font-semibold hover:underline">
                                Continuar comprando sin iniciar sesión
                            </span>
                        </Link>

                    </p>
                </motion.div>
            </div>
        </Layout>
    );
}