import React from 'react';
import Image from 'next/image'
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="flex justify-center w-full py-12 px-6 bg-white dark:bg-[#302f31] transition-colors duration-300">
            <div className="max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Certifications Column */}
                    <div className="space-y-6">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Certificaciones</h3>

                        {/* B-Corp Certification */}
                        <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 border-2 border-gray-800 dark:border-gray-200 rounded-full flex items-center justify-center">
                                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">B</span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                <p className="font-medium">Certified</p>
                                <p>This company meets the highest standards of social and environmental impact</p>
                            </div>
                        </div>

                        {/* Climate Label */}
                        <div className="border border-gray-300 dark:border-[#3a393b] p-3 rounded">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-100">THE CLIMATE LABEL</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300">CERTIFIED</p>
                        </div>

                        {/* Science Based Targets */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-blue-400 rounded-full"></div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">SCIENCE BASED</p>
                                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">TARGETS</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 uppercase">driving ambitious corporate climate action</p>
                        </div>

                        {/* Restorative Coalition */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 border-2 border-green-600 rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-green-700 dark:text-green-400">Restorative</p>
                                <p className="font-bold text-sm text-green-700 dark:text-green-400">Coalition</p>
                            </div>
                        </div>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Soporte</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li><a href="#" className="hover:text-gray-800 dark:hover:text-gray-100">contacto</a></li>
                            <li><a href="#" className="hover:text-gray-800 dark:hover:text-gray-100">centro de ayuda</a></li>
                            <li><a href="#" className="hover:text-gray-800 dark:hover:text-gray-100">envíos</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Empresa</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li><a href="#" className="hover:text-gray-800 dark:hover:text-gray-100">localizador de tiendas</a></li>
                            <li><a href="#" className="hover:text-gray-800 dark:hover:text-gray-100">guía de tallas</a></li>
                        </ul>
                    </div>

                    {/* Connected Column */}
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Conectado</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-800 dark:text-gray-100 font-medium mb-2">
                                Únete a las listas de Email y Text de Minimalist para obtener descuentos
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                                Regístrate para información privilegiada sobre ventas, nuevos productos y más.
                            </p>

                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Dirección de email"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#3a393b] rounded text-sm bg-white dark:bg-[#3a393b] text-gray-800 dark:text-gray-100"
                                />
                                <input
                                    type="tel"
                                    placeholder="Número de teléfono"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-[#3a393b] rounded text-sm bg-white dark:bg-[#3a393b] text-gray-800 dark:text-gray-100"
                                />
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                                Al enviar este formulario, aceptas recibir mensajes de texto promocionales recurrentes y automatizados
                                de Minimalist. El consentimiento no es una condición de compra.
                            </p>

                            <button className="w-full bg-green-600 text-white py-2 px-4 rounded mt-4 text-sm hover:bg-green-700 dark:hover:bg-green-500 transition-colors">
                                Suscribirme →
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-3 mt-4">
                            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="https://img.icons8.com/?size=256&id=Xy10Jcu1L2Su&format=png"
                                    alt="Instagram"
                                    width={40}
                                    height={40}
                                />
                            </Link>

                            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="https://img.icons8.com/?size=256&id=uLWV5A9vXIPu&format=png"
                                    alt="Facebook"
                                    width={40}
                                    height={40}
                                />
                            </Link>

                            <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src="https://img.icons8.com/?size=256&id=118640&format=png"
                                    alt="TikTok"
                                    width={40}
                                    height={40}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="flex justify-center items-center space-x-4 mt-18 mb-6">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/mercado-pago.png"
                            alt="Mercado Pago"
                            fill
                            sizes="40px"
                            className="object-contain rounded-md"
                        />
                    </div>
                    <div>
                        {/* Visa */}
                        <svg className="w-14 h-auto pr-2 mt-2 space-y-2" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-visa">
                            <title id="pi-visa">Visa</title>
                            <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                            <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                            <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
                        </svg>
                    </div>
                    <div className="relative w-14 h-8 mt-1">
                        <Image
                            src="/mastercard.png"
                            alt="Mercado Pago"
                            fill
                            sizes="60px"
                            className="object-contain"
                        />
                    </div>
                    <Image
                        src={`/yape.webp`}
                        width={36}
                        height={36}
                        alt="Yape"
                        className='rounded-sm'
                    />
                </div>

                {/* Land Acknowledgment */}
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Reconocemos y honramos a los pueblos originarios que han cuidado y protegido estas tierras
                        a lo largo de generaciones, y reafirmamos nuestro compromiso con el respeto, la diversidad
                        y la inclusión.
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                    <span>© 2025. Todos los derechos reservados.</span>
                    <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200">Política de Privacidad</a>
                    <span>&</span>
                    <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200">Política de Copyright</a>
                    <span>.</span>
                    <a href="#" className="hover:text-gray-700 dark:hover:text-gray-200">Términos y Condiciones</a>
                    <span>.</span>
                </div>
            </div>
        </footer>
    );
};
