// lib/seo.js - Centralized SEO configuration

export const siteConfig = {
  name: "CoreComponents",
  description:
    "Premium automotive and trucking parts for heavy-duty trucks. Freightliner, Peterbilt, Kenworth, International parts and complete truck sales.",
  url: "https://ccomponents.ca",
  ogImage: "/og-image.jpg", // We'll create this later
  links: {
    facebook: "https://facebook.com/ccomponents",
    twitter: "https://twitter.com/ccomponents",
  },
  address: {
    street: "Brampton, Ontario",
    city: "Brampton",
    state: "Ontario",
    zip: "",
    country: "Canada",
  },
  contact: {
    phone: "(123) 456-7890", // Update with real phone
    email: "info@ccomponents.ca",
  },
};

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
  path = "",
}) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullDescription = description || siteConfig.description;
  const fullUrl = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords:
      "truck parts, heavy duty truck parts, Freightliner parts, Peterbilt parts, Kenworth parts, International truck parts, semi truck parts, diesel engine parts, brake parts, transmission parts",
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_CA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
      creator: "@ccomponents",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// Generate product structured data (JSON-LD)
export function generateProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} for heavy-duty trucks`,
    sku: product.sku,
    image: product.images?.[0] || siteConfig.ogImage,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/catalog/${product.id}`,
      priceCurrency: "CAD",
      price: product.retail_price,
      availability:
        product.stock_status === "in_stock"
          ? "https://schema.org/InStock"
          : product.stock_status === "low_stock"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    brand: {
      "@type": "Brand",
      name: product.manufacturer || "OEM",
    },
  };
}

// Generate organization structured data
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      addressCountry: siteConfig.address.country,
    },
    sameAs: [siteConfig.links.facebook, siteConfig.links.twitter],
    priceRange: "$$",
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
