import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/seo";

export default async function sitemap() {
  const baseUrl = siteConfig.url;

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("display_order");

  // Fetch all parts
  const { data: parts } = await supabase
    .from("parts")
    .select("id, name, updated_at");

  // Fetch all trucks
  const { data: trucks } = await supabase
    .from("trucks")
    .select("id, year, make, model, updated_at");

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trucks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages = (categories || []).map((category) => ({
    url: `${baseUrl}/catalog?category=${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Part pages
  const partPages = (parts || []).map((part) => ({
    url: `${baseUrl}/catalog/${part.id}`,
    lastModified: new Date(part.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Truck pages
  const truckPages = (trucks || []).map((truck) => ({
    url: `${baseUrl}/trucks/${truck.id}`,
    lastModified: new Date(truck.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...partPages, ...truckPages];
}
