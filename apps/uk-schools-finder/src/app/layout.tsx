import './global.css';
import { Header, Footer, Content } from 'antd/es/layout/layout';
import { EffectorNext } from '@effector/next';
import { HeaderArea } from '../components/header';
import { FooterArea } from '../components/footer';
import Layout from 'antd/es/layout';

export const metadata = {
  title: 'UK Schools Finder - Find Perfect Schools for Your Family',
  description: 'Find the best schools in the UK to help choose your next family home. Compare schools, explore neighborhoods, and make informed decisions about where to live based on education quality.',
  openGraph: {
    title: 'UK Schools Finder - Find Perfect Schools for Your Family',
    description: 'Find the best schools in the UK to help choose your next family home. Compare schools, explore neighborhoods, and make informed decisions about where to live based on education quality.',
    url: 'https://uk-schools-finder.vercel.app',
    siteName: 'UK Schools Finder',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'UK Schools Finder - School search and neighborhood explorer'
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Schools Finder - Find Perfect Schools for Your Family',
    description: 'Find the best schools in the UK to help choose your next family home. Compare schools, explore neighborhoods, and make informed decisions about where to live based on education quality.',
    images: ['/og-image.jpg'], // Same image as OpenGraph
  },
  keywords: [
    'UK schools',
    'school finder',
    'education',
    'family homes',
    'neighborhood search',
    'school ratings',
    'property area',
    'family friendly areas',
    'school catchment areas',
    'UK education'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <EffectorNext>
          <Layout className="h-full grid grid-rows-[auto_1fr_auto]">
            <Header className="bg-white shadow-md">
              <HeaderArea />
            </Header>

            <Content>{children}</Content>

            <Footer className="bg-white shadow-md">
              <FooterArea />
            </Footer>
          </Layout>
        </EffectorNext>
      </body>
    </html>
  );
}
