import { Fira_Sans, Poppins } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
import './assets/responsive.css';

const fira_sans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--body-color-font',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--heading-font',
});

export const metadata = {
  metadataBase: new URL('https://www.drewmarketingsolutions.com'),
  title: {
    default:  'Drew Marketing Solutions | Strategic Growth Partner',
    template: '%s | Drew Marketing Solutions',
  },
  description:
    'Nairobi-based strategic marketing and corporate communications firm. We build data-driven growth systems that connect you to the right audience.',
  keywords: [
    'marketing agency nairobi',
    'brand strategy kenya',
    'demand generation',
    'digital marketing kenya',
    'corporate communications',
    'strategic marketing',
  ],
  authors: [{ name: 'Drew Marketing Solutions' }],
  openGraph: {
    type:        'website',
    locale:      'en_KE',
    url:         'https://www.drewmarketingsolutions.com',
    siteName:    'Drew Marketing Solutions',
    title:       'Drew Marketing Solutions | Strategic Growth Partner',
    description: 'Nairobi-based strategic marketing and corporate communications firm. We build data-driven growth systems that connect you to the right audience.',
    images: [
      {
        url:    '/openGraphImage.jpg',
        width:  1200,
        height: 630,
        alt:    'Drew Marketing Solutions',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Drew Marketing Solutions | Strategic Growth Partner',
    description: 'Nairobi-based strategic marketing and corporate communications firm.',
    images:      ['/openGraphImage.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="author" content="Themeservices" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${fira_sans.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
