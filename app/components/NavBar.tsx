"use client";
import { Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useProductFilters } from "../hooks/ProductFiltersContext";

export default function NavBar() {
    const { searchTerm, setSearchTerm } = useProductFilters();
    const { data: session } = useSession()
    console.log(session);
    console.log(session?.user.rol);
    const pathname = usePathname();
    const router = useRouter()
    const [menuActive, setMenuActive] = useState<boolean>(true);

    const handleRouteChange = (): void => {
        localStorage.setItem("previousRoute", pathname);
        router.push("/login");
    }
    const { setTheme } = useTheme();

    const handleMenu = (): void => {
        setMenuActive((active: boolean) => !active);
    };
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push('/shop');
        }
    };

    const handleIconClick = () => {
        if (searchTerm.trim()) {
            router.push('/shop');
        }
    };
    return (
        <>
            <header className="relative">
                <div className="animate__animated animate__fadeIn animate__faster flex items-center justify-between px-8 lg:px-16 fixed top-0 w-full mx-auto h-20 bg-white/80 dark:bg-[#302f31]/80 backdrop-blur-md z-50 -translate-x-1/2">

                    {/* Logo: Minimalista */}
                    <div>
                        <Link href="/home">
                            <Button className="px-0 lg:px-5 shadow-none rounded-sm bg-transparent hover:bg-transparent cursor-pointer">
                                <p className="font-medium text-xl text-purple-700">Minimalista</p>
                            </Button>
                        </Link>
                    </div>
                    {/* Menú hamburguesa disponible en móviles */}
                    <div className="flex md:hidden">
                        <button
                            onClick={handleMenu}
                            className="group duration-200 ease-in rounded-sm cursor-pointer hover:bg-purple-200/70 dark:hover:bg-purple-700  p-2"
                            type="button"
                        >
                            {menuActive ? (
                                // SVG del menú activo
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-menu text-purple-700 dark:group-hover:text-white"
                                >
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            ) : (
                                // SVG del menú desactivado
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-x text-purple-700 dark:group-hover:text-white"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* Navegación: Inicio, Tienda y Acerca de (visibles en md hacia arriba) */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center">
                            <li className={`relative group font-medium me-10 ${pathname === "/home" ? "text-purple-700" : ""}`}>
                                <Link href="/home">
                                    Inicio
                                    <span className="underline-animation"></span>
                                </Link>
                            </li>

                            <li className={`relative group font-medium me-10 ${pathname === "/shop" ? "text-purple-700" : ""}`}>
                                <Link href="/shop">
                                    Tienda
                                    <span className="underline-animation"></span>
                                </Link>

                            </li>
                            <li className={`relative group font-medium me-10 ${pathname === "/about" ? "text-purple-700" : ""}`}>
                                <Link href="/about">
                                    Nosotros
                                    <span className="underline-animation"></span>
                                </Link>

                            </li>

                        </ul>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="border border-none dark:border-gray-600  dark:hover:bg-purple-700 hover:bg-purple-200/70 "
                                >
                                    <Sun className="h-[1.4rem] w-[1.4rem] rotate-0 scale-100 transition-transform duration-300 ease-in-out dark:-rotate-90 dark:scale-0 text-purple-700 " />
                                    <Moon className="absolute h-[1.4rem] w-[1.4rem] rotate-90 scale-0 transition-transform duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-[#302f31] border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg"
                            >
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                    className="cursor-pointer px-4 py-2 dark:hover:bg-purple-700  focus:bg-purple-200/70 transition-colors"
                                >
                                    Light
                                </DropdownMenuItem>


                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                    className="cursor-pointer px-4 py-2 focus:bg-purple-200/70 dark:hover:bg-purple-700 transition-colors"
                                >
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("system")}
                                    className="cursor-pointer px-4 py-2 focus:bg-purple-200/70 dark:hover:bg-purple-700 transition-colors"
                                >
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </nav>
                    {/* Navegación: Account y Cart (visibles en md hacia arriba) */}
                    <nav className="hidden md:flex">
                        <ul className="flex">
                            <form onSubmit={handleSearchSubmit} className="relative flex-grow ms-10 me-0 md:me-10">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleIconClick}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                                >
                                    <Search size={18} className="text-zinc-400" />
                                </button>
                            </form>
                            <li className="w-10 h-10 me-10">
                                {session && session.user?.image ?
                                    <Button className="shadow-none bg-white hover:bg-white cursor-pointer w-full h-full p-0">
                                        {/* Link rodea solo la imagen */}
                                        <Link href="/account" passHref>
                                            <Image
                                                src={session.user.image}
                                                alt="user-image"
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        </Link>
                                    </Button>
                                    :
                                    <Button className={`shadow-none rounded-sm bg-transparent me-10 hover:bg-purple-200/70 dark:hover:bg-purple-700 cursor-pointer ${pathname === '/login' ? "bg-purple-100 dark:bg-purple-700" : ""}`} onClick={handleRouteChange}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-user text-purple-700 dark:text-white"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </Button>
                                }
                            </li>
                            <li>
                                <Link href="/cart">
                                    <Button className="shadow-none rounded-sm bg-transparent hover:bg-purple-200/70 dark:hover:bg-purple-700 cursor-pointer">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-shopping-cart text-purple-700 dark:text-white"
                                        >
                                            <circle cx="8" cy="21" r="1"></circle>
                                            <circle cx="19" cy="21" r="1"></circle>
                                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                        </svg>
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            {/* Nuevo div agregado después del contenedor fixed para móviles */}
            <div
                className={`md:hidden fixed top-16 left-0 w-full bg-white dark:bg-[#302f31] z-40 transition-transform duration-500 ${menuActive ? "-translate-y-full scale-70" : "translate-y-0"
                    }`}>
                <nav className="py-4 px-4 border-t border-t-gray-300 dark:border-t-purple-700">
                    <ul className="flex flex-col">
                        <li className="rounded-sm font-medium mt-4 hover:bg-purple-100 dark:hover:bg-purple-700">
                            <Link
                                href="/home"
                                className={`block py-2 px-4 ${pathname === "/home" ? "text-purple-700 dark:hover:text-white" : ""}`}
                            >
                                Inicio
                            </Link>
                        </li>
                        <li className="rounded-sm font-medium mt-4 hover:bg-purple-100 dark:hover:bg-purple-700">
                            <Link
                                href="/shop"
                                className={`block py-2 px-4 ${pathname === "/shop" ? "text-purple-700 dark:hover:text-white" : ""}`}
                            >
                                Tienda
                            </Link>
                        </li>
                        <li className="rounded-sm font-medium mt-4 hover:bg-purple-100 dark:hover:bg-purple-700">
                            <Link
                                href="/about"
                                className={`block py-2 px-4 ${pathname === "/about" ? "text-purple-700 dark:hover:text-white" : ""}`}
                            >
                                Nosotros
                            </Link>
                        </li>
                        <li className="w-full p-4 min-w-[133px]">

                            <form onSubmit={handleSearchSubmit} className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleIconClick}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                                >
                                    <Search size={18} className="text-zinc-400" />
                                </button>
                            </form>

                        </li>
                    </ul>
                </nav>
                <nav className="pt-2 pb-8 px-8">
                    <ul className="flex justify-between">

                        <li className="w-1/2 me-5 min-w-[133px]">

                            <Button className={`flex justify-center shadow-none rounded-sm w-full border border-gray-200 bg-white hover:bg-purple-100 cursor-pointer ${pathname === "/login" ? "bg-purple-100" : ""}`} onClick={handleRouteChange}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-user text-black"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <p className="font-medium text-black">Mi cuenta</p>
                            </Button>

                        </li>
                        <li className="w-1/2 min-w-[103px]">
                            <Link href="/cart">
                                <Button className="shadow-none rounded-sm w-full bg-purple-600 hover:bg-purple-700  cursor-pointer">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-shopping-cart text-white"
                                    >
                                        <circle cx="8" cy="21" r="1"></circle>
                                        <circle cx="19" cy="21" r="1"></circle>
                                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                    </svg>
                                    <p className="font-medium text-white">Carrito (0)</p>
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

        </>
    );
};
