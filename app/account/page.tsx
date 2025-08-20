"use client";

import { useSession } from "next-auth/react"
import Layout from "../home/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import Profile from "./components/Profile";


export default function Account() {
  const { data: session } = useSession()
  console.log(session);
  
  return (
    <Layout>
      {/* Full width container */}
      <div className="py-10 px-4 md:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto">
        <h1 className="font-medium text-3xl mb-8">Mi cuenta</h1>

        {/* Custom layout for Tabs */}
        <div className="w-full">
          <Tabs defaultValue="profile" className="w-full">
            {/* Outer container for both sidebars and content */}
            <div className="flex flex-col md:flex-row w-full gap-6">
              {/* Sidebar - left side on desktop */}
              <div className="flex flex-col w-full md:w-1/4 md:min-w-[320px] h-[550px] md:max-h-[600px] bg-purple-50 rounded-lg p-6">
                {/* User info section */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-purple-100">
                  <div className="bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center">
                    {session?.user?.image ?
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Imagen del usuario'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
                  </div>
                  <div>
                    <h2 className="font-medium text-lg">
                      {session?.user?.name || 'Username'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {session?.user?.email || 'email@example.com'}
                    </p>
                  </div>
                </div>

                {/* Navigation tabs */}
                <TabsList className="flex flex-col items-start w-full space-y-2 bg-transparent mt-10 h-[300px]">
                  <TabsTrigger value="profile" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Ordenes
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    Lista de deseos
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
                    Métodos de pago
                  </TabsTrigger>
                  <TabsTrigger value="config" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Configuraciones
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="w-full justify-start px-4 py-3 data-[state=active]:bg-purple-200 hover:bg-purple-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Direcciones
                  </TabsTrigger>
                  <div className="mt-auto pt-6 w-full ">
                    <button className="flex items-center text-red-500 px-4 py-3 w-full text-left hover:bg-red-50 rounded-md cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                      Logout
                    </button>
                  </div>
                </TabsList>
              </div>

              {/* Content area - right side on desktop */}
              <div className="w-full md:w-3/4">
                <TabsContent value="profile" className="w-full border rounded-lg p-6 shadow-sm">
                  <Profile session={ session }/>
                </TabsContent>

                <TabsContent value="orders">
                  <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="font-bold text-xl pb-3">My Orders</h2>
                    <p className="text-gray-500">You dont have any orders yet.</p>
                  </div>
                </TabsContent>

                <TabsContent value="wishlist">
                  <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="font-bold text-xl pb-3">My Wishlist</h2>
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="font-bold text-xl pb-3">Payment Methods</h2>
                    <p className="text-gray-500">You dont have any payment methods saved.</p>
                  </div>
                </TabsContent>

                <TabsContent value="config">
                  <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="font-bold text-xl pb-3">Account Settings</h2>
                    <p className="text-gray-500">Configure your account preferences.</p>
                  </div>
                </TabsContent>

                <TabsContent value="addresses">
                  <div className="border rounded-lg p-6 shadow-sm">
                    <h2 className="font-bold text-xl pb-3">Shipping Addresses</h2>
                    <p className="text-gray-500">You dont have any addresses saved.</p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}