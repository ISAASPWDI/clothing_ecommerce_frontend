import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { ProductFiltersProvider } from "../hooks/ProductFiltersContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProductFiltersProvider>
      <div className="min-h-screen flex flex-col items-center">
        <NavBar />
        <div className="max-w-7xl pt-20 md:pt-20 px-0">{children}</div>
        <Footer/>
      </div>
    </ProductFiltersProvider>
  );
}