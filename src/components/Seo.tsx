import { useEffect, useMemo } from "react";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
} from "@/lib/site";
import { HeadState } from "@/lib/head-context";
import { useHeadManager } from "@/hooks/use-head-manager";

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
};

const normalizeUrl = (value?: string) => {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("http")) {
    return value;
  }

  const trimmed = value.startsWith("/") ? value : `/${value}`;
  return `${SITE_URL}${trimmed}`;
};

const applyHeadToDocument = (head: HeadState) => {
  if (typeof document === "undefined") {
    return;
  }

  document.title = head.title;

  const existing = document.head.querySelectorAll("[data-head-managed='true']");
  existing.forEach((node) => node.remove());

  head.metas.forEach((meta) => {
    const element = document.createElement("meta");
    if (meta.name) {
      element.setAttribute("name", meta.name);
    }
    if (meta.property) {
      element.setAttribute("property", meta.property);
    }
    element.setAttribute("content", meta.content);
    element.setAttribute("data-head-managed", "true");
    document.head.appendChild(element);
  });

  head.links.forEach((link) => {
    const element = document.createElement("link");
    element.setAttribute("rel", link.rel);
    element.setAttribute("href", link.href);
    element.setAttribute("data-head-managed", "true");
    document.head.appendChild(element);
  });
};

export function Seo({
  title,
  description,
  keywords,
  canonical,
  image,
  type = "website",
  robots,
}: SeoProps) {
  const headRef = useHeadManager();
  const resolvedTitle = title ?? DEFAULT_TITLE;
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION;
  const resolvedKeywords = keywords ?? DEFAULT_KEYWORDS;
  const resolvedCanonical = normalizeUrl(canonical) ?? SITE_URL;
  const resolvedImage = normalizeUrl(image) ?? DEFAULT_IMAGE;

  const head = useMemo<HeadState>(
    () => ({
      title: resolvedTitle,
      metas: [
        { name: "description", content: resolvedDescription },
        { name: "keywords", content: resolvedKeywords },
        ...(robots ? [{ name: "robots", content: robots }] : []),
        { property: "og:type", content: type },
        { property: "og:title", content: resolvedTitle },
        { property: "og:description", content: resolvedDescription },
        { property: "og:url", content: resolvedCanonical },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: resolvedImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: resolvedTitle },
        { name: "twitter:description", content: resolvedDescription },
        { name: "twitter:image", content: resolvedImage },
      ],
      links: [{ rel: "canonical", href: resolvedCanonical }],
    }),
    [
      resolvedTitle,
      resolvedDescription,
      resolvedKeywords,
      robots,
      type,
      resolvedCanonical,
      resolvedImage,
    ],
  );

  if (typeof window === "undefined") {
    // eslint-disable-next-line react-hooks/refs
    headRef.current = head;
  }

  useEffect(() => {
    headRef.current = head;
    applyHeadToDocument(head);
  }, [head, headRef]);

  return null;
}
