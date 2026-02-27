import { Metadata } from 'next';
import OrderDetailClient from './OrderDetailClient';

type Props = {
  params: { externalReference: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { externalReference: orderRef } = await params;

  return {
    title: `Orden ${orderRef.split('-')[1].slice(0,4)}... | Minimalist`,
    description: `Detalles de tu orden ${orderRef}.`,
    openGraph: {
      title: `Orden ${orderRef.split('-')[1].slice(0,4)}...`,
      description: `Detalles de tu orden ${orderRef}`,
      type: 'website',
    },
  };
}


export default async function OrderDetailPage({ params }: Props) {
  const { externalReference } = await params;

  return <OrderDetailClient externalReference={externalReference} />;
}
