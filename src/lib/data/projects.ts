import projectsData from "@/data/projects.json";
import { withBasePath } from "@/lib/site";

export interface ProjectRepository {
  provider: string;
  name: string;
  url: string;
  branch?: string;
  visibility?: string;
  notes?: string;
}

export interface ProjectPromotionEnvironment {
  name: string;
  url: string;
  status?: string;
  version?: string;
  lastPromotedOn?: string;
  notes?: string;
}

export interface ProjectPromotion {
  pipeline?: string;
  currentStage?: string;
  status?: string;
  lastPromotedOn?: string;
  notes?: string;
  environments?: ProjectPromotionEnvironment[];
}

export interface ProjectSeo {
  title?: string;
  titleSuffix?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
}

export interface ProjectSocial {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
}

export interface ProjectSource {
  id: number;
  image?: string;
  p: string;
  d: string;
  h?: string;
  slug: string;
  summary?: string;
  keywords?: string;
  seo?: ProjectSeo;
  og?: ProjectSocial;
  twitter?: ProjectSocial;
  repository?: ProjectRepository;
  promotion?: ProjectPromotion;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  summary: string;
  url?: string;
  image?: string;
  keywords: string[];
  seo?: ProjectSeo;
  og?: ProjectSocial;
  twitter?: ProjectSocial;
  repository?: ProjectRepository;
  promotion?: ProjectPromotion;
}

const parseKeywords = (keywords?: string) =>
  (keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const rawProjects = projectsData as ProjectSource[];
const normalizeSocial = (social?: ProjectSocial) =>
  social
    ? {
        ...social,
        image: withBasePath(social.image),
      }
    : undefined;

export const projects: Project[] = rawProjects.map((project) => ({
  id: project.id,
  slug: project.slug,
  title: project.p,
  description: project.d,
  summary: project.summary ?? project.d,
  url: project.h,
  image: withBasePath(project.image),
  keywords: parseKeywords(project.keywords),
  seo: project.seo,
  og: normalizeSocial(project.og),
  twitter: normalizeSocial(project.twitter),
  repository: project.repository,
  promotion: project.promotion,
}));
