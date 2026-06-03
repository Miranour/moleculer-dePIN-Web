import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  type?: string;
  image?: string;
}

export function SEO({ 
  title, 
  description = "Merkeziyetsiz moleküler simülasyon ve docking platformu. Araştırmanızı hızlandırın.", 
  type = "website",
  image = "https://depinlab.com/og-image.jpg"
}: SEOProps) {
  const siteTitle = `${title} | dePINLab`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
