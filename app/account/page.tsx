import { Metadata } from 'next';
import { Suspense } from 'react';
import AccountClient from './AccountClient';

type Props = {
  searchParams: Promise<{ tab?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const tab = params.tab || 'profile';
  
  const titles: Record<string, string> = {
    profile: 'Perfil',
    orders: 'Mis Órdenes',
    wishlist: 'Lista de Deseos',
    config: 'Configuración',
    addresses: 'Direcciones'
  };
  
  const descriptions: Record<string, string> = {
    profile: 'Administra tu información personal y preferencias de cuenta',
    orders: 'Revisa el historial de tus compras y el estado de tus órdenes',
    wishlist: 'Guarda tus productos favoritos en tu lista de deseos',
    config: 'Configura las preferencias de tu cuenta',
    addresses: 'Administra tus direcciones de envío y facturación'
  };

  const title = titles[tab] || 'Mi Cuenta';
  const description = descriptions[tab] || 'Administra tu cuenta y preferencias';

  return {
    title: `${title} - Mi Cuenta`,
    description: description,
    openGraph: {
      title: `${title} - Mi Cuenta`,
      description: description,
    },
    robots: {
      index: false, 
      follow: true,
    }
  };
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AccountClient />
    </Suspense>
  );
}