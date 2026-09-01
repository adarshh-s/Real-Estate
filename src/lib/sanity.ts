import { createClient } from '@sanity/client';
import type { Property, Project, Community, Agent, Testimonial, Article } from '../types';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: true })
  : null;

const PROPERTY_PROJECTION = `{
  "id": _id,
  title,
  "slug": slug.current,
  community,
  subCommunity,
  type,
  status,
  priceAED,
  rentPeriod,
  beds,
  baths,
  sizeSqft,
  plotSqft,
  furnishing,
  completion,
  "images": images[].asset->url,
  description,
  amenities,
  "agentId": agent->slug.current,
  tags,
  featured,
  yearBuilt,
  reference,
  "location": location{lat, lng}
}`;

const PROJECT_PROJECTION = `{
  "id": _id,
  name,
  "slug": slug.current,
  developer,
  community,
  status,
  priceFromAED,
  paymentPlan,
  handover,
  "images": images[].asset->url,
  description,
  unitTypes,
  amenities
}`;

const COMMUNITY_PROJECTION = `{
  "id": _id,
  name,
  "slug": slug.current,
  "image": image.asset->url,
  tagline,
  description,
  avgPricePerSqft,
  avgRentalYield,
  listingsCount,
  popularFor,
  "location": location{lat, lng}
}`;

const AGENT_PROJECTION = `{
  "id": _id,
  name,
  "slug": slug.current,
  title,
  "photo": photo.asset->url,
  phone,
  whatsapp,
  email,
  languages,
  specialties,
  bio,
  listingsCount
}`;

const TESTIMONIAL_PROJECTION = `{
  "id": _id,
  name,
  role,
  quote
}`;

const ARTICLE_PROJECTION = `{
  "id": _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  "coverImage": coverImage.asset->url,
  "images": images[].asset->url,
  category,
  "authorId": author->slug.current,
  publishedAt,
  readMinutes,
  featured
}`;

export interface SiteSettings {
  heroVideoUrl?: string;
  heroPosterUrl?: string;
  heroKicker?: string;
  heroHeadlineLine1?: string;
  heroHeadlineLine2?: string;
  heroSubtitle?: string;
  interstitialVideoUrl?: string;
  interstitialHeadline?: string;
  interstitialBody?: string;
  contactPhone?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  officeAddress?: string;
}

export async function fetchProperties(): Promise<Property[] | null> {
  if (!sanityClient) return null;
  const docs = await sanityClient.fetch<Property[]>(`*[_type == "property"] | order(_createdAt desc) ${PROPERTY_PROJECTION}`);
  return docs;
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Property | null>(
    `*[_type == "property" && slug.current == $slug][0] ${PROPERTY_PROJECTION}`,
    { slug },
  );
}

export async function fetchProjects(): Promise<Project[] | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Project[]>(`*[_type == "project"] | order(_createdAt desc) ${PROJECT_PROJECTION}`);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Project | null>(
    `*[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}`,
    { slug },
  );
}

export async function fetchCommunities(): Promise<Community[] | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Community[]>(`*[_type == "community"] | order(name asc) ${COMMUNITY_PROJECTION}`);
}

export async function fetchAgents(): Promise<Agent[] | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Agent[]>(`*[_type == "agent"] | order(name asc) ${AGENT_PROJECTION}`);
}

export async function fetchAgentBySlug(slug: string): Promise<Agent | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Agent | null>(`*[_type == "agent" && slug.current == $slug][0] ${AGENT_PROJECTION}`, { slug });
}

export async function fetchTestimonials(): Promise<Testimonial[] | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Testimonial[]>(`*[_type == "testimonial"] ${TESTIMONIAL_PROJECTION}`);
}

export async function fetchArticles(): Promise<Article[] | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Article[]>(`*[_type == "article"] | order(publishedAt desc) ${ARTICLE_PROJECTION}`);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<Article | null>(
    `*[_type == "article" && slug.current == $slug][0] ${ARTICLE_PROJECTION}`,
    { slug },
  );
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]{
    "heroVideoUrl": heroVideo.asset->url,
    "heroPosterUrl": heroPoster.asset->url,
    heroKicker,
    heroHeadlineLine1,
    heroHeadlineLine2,
    heroSubtitle,
    "interstitialVideoUrl": interstitialVideo.asset->url,
    interstitialHeadline,
    interstitialBody,
    contactPhone,
    contactEmail,
    whatsappNumber,
    officeAddress
  }`);
}
