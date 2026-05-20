import { supabase } from "@/lib/supabase"

export default async function sitemap() {
    const baseUrl = 'https://ccomponents.ca'

    const { data: parts } = await supabase
        .from("parts")
        .select("id, updated_at")

    const { data: trucks } = await supabase
        .from("trucks")
        .select("id, updated_at")

    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
        { url: `${baseUrl}/catalog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/trucks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ]

    const categoryPages = [
        'engines', 'transmissions', 'one-box',
        'ecm-electrical', 'clutch-actuators', 'body-accessories'
    ].map((slug) => ({
        url: `${baseUrl}/catalog/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }))

    const partPages = (parts || []).map((part) => ({
        url: `${baseUrl}/catalog/${part.id}`,
        lastModified: new Date(part.updated_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    const truckPages = (trucks || []).map((truck) => ({
        url: `${baseUrl}/trucks/${truck.id}`,
        lastModified: new Date(truck.updated_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    return [...staticPages, ...categoryPages, ...partPages, ...truckPages]
}