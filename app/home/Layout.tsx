"use client"; 

import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <NavBar />
      <div className="w-full pt-20 lg:pt-20 md:pt-20 px-0">{children}</div>
      <Footer/>
    </div>
  );
};


