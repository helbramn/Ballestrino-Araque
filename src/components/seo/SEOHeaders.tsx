import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadersProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    structuredData?: object;
}

export const SEOHeaders: React.FC<SEOHeadersProps> = ({
    title = 'Ballestrino-Araque | Inmobiliaria Singular en Segovia',
    description = 'Inmobiliaria de confianza. No espere para comprar, compre y espere. Especialistas en propiedades singulares y exclusivas en la sierra de Segovia.',
    image = '/images/ballestrino-logo.png',
    url = window.location.href,
    type = 'website',
    structuredData
}) => {
    const siteTitle = 'Ballestrino-Araque';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
    const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};
