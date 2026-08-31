import { useEffect, useState } from 'react';
import type { Property, Project, Community, Agent, Testimonial, Article } from '../types';
import { properties as staticProperties, getPropertyBySlug as getStaticPropertyBySlug } from '../data/properties';
import { projects as staticProjects, getProjectBySlug as getStaticProjectBySlug } from '../data/projects';
import { communities as staticCommunities } from '../data/communities';
import { agents as staticAgents } from '../data/agents';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { articles as staticArticles, getArticleBySlug as getStaticArticleBySlug } from '../data/articles';
import {
  fetchProperties,
  fetchPropertyBySlug,
  fetchProjects,
  fetchProjectBySlug,
  fetchCommunities,
  fetchAgents,
  fetchAgentBySlug,
  fetchTestimonials,
  fetchArticles,
  fetchArticleBySlug,
  fetchSiteSettings,
  type SiteSettings,
} from '../lib/sanity';

// Every hook below starts with today's bundled demo content so the site
// renders immediately, then silently swaps in live Sanity content once it
// arrives (if a Sanity project is configured and has published documents).
// If Sanity isn't set up yet, or a fetch fails, the static content just stays.

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(staticProperties);
  useEffect(() => {
    let cancelled = false;
    fetchProperties()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setProperties(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return properties;
}

export function usePropertyBySlug(slug: string | undefined) {
  const [property, setProperty] = useState<Property | undefined>(() => (slug ? getStaticPropertyBySlug(slug) : undefined));
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchPropertyBySlug(slug)
      .then((doc) => {
        if (!cancelled && doc) setProperty(doc);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return property;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setProjects(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return projects;
}

export function useProjectBySlug(slug: string | undefined) {
  const [project, setProject] = useState<Project | undefined>(() => (slug ? getStaticProjectBySlug(slug) : undefined));
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchProjectBySlug(slug)
      .then((doc) => {
        if (!cancelled && doc) setProject(doc);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return project;
}

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>(staticCommunities);
  useEffect(() => {
    let cancelled = false;
    fetchCommunities()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setCommunities(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return communities;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(staticAgents);
  useEffect(() => {
    let cancelled = false;
    fetchAgents()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setAgents(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return agents;
}

export function useAgentBySlug(slug: string | undefined) {
  const [agent, setAgent] = useState<Agent | undefined>(() => staticAgents.find((a) => a.slug === slug));
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchAgentBySlug(slug)
      .then((doc) => {
        if (!cancelled && doc) setAgent(doc);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return agent;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  useEffect(() => {
    let cancelled = false;
    fetchTestimonials()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setTestimonials(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return testimonials;
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(staticArticles);
  useEffect(() => {
    let cancelled = false;
    fetchArticles()
      .then((docs) => {
        if (!cancelled && docs && docs.length > 0) setArticles(docs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return articles;
}

export function useArticleBySlug(slug: string | undefined) {
  const [article, setArticle] = useState<Article | undefined>(() => (slug ? getStaticArticleBySlug(slug) : undefined));
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchArticleBySlug(slug)
      .then((doc) => {
        if (!cancelled && doc) setArticle(doc);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return article;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroVideoUrl: '/videos/hero-luxury-home.mp4',
  heroPosterUrl: '/hero-poster.jpg',
  heroKicker: 'Dubai · International Realty',
  heroHeadlineLine1: 'Extraordinary addresses,',
  heroHeadlineLine2: 'for an extraordinary city.',
  heroSubtitle:
    'S I A Luxe Real Estate curates Dubai’s finest waterfront villas, sky residences and private estates for a global clientele — with the discretion of a private office.',
  interstitialVideoUrl: '/videos/twilight-villa.mp4',
  interstitialHeadline: 'Where every address is extraordinary',
  interstitialBody:
    'From private beach clubs to sky-high infinity pools, discover what sets a S I A Luxe residence apart.',
  contactPhone: '+971 4 555 0100',
  contactEmail: 'hello@sialuxe.ae',
  whatsappNumber: '971505550100',
  officeAddress: 'Gate Village 7, DIFC, Dubai, UAE',
};

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((doc) => {
        if (!cancelled && doc) setSettings((prev) => ({ ...prev, ...stripUndefined(doc) }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return settings;
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)) as Partial<T>;
}
