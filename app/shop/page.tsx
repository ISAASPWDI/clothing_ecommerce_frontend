
import { Metadata } from 'next';
import ShopContent from './components/ShopContent';

import Layout from './LayoutContent';


export const metadata: Metadata = {
  title: 'Shop - Tienda Online',
  description: 'Descubre nuestra amplia selección de productos de moda y estilo.',
};

export default function ShopPage() {
  return (
    <Layout>
      <ShopContent/>
    </Layout>
  )
}