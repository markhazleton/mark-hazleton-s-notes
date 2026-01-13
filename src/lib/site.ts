export const SITE_NAME = "Mark Hazleton";
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://markhazleton.com";
export const BASE_PATH = import.meta.env.BASE_URL ?? "/";

export const withBasePath = (value?: string | null) => {
  if (value == null || value === "") {
    return value ?? undefined;
  }

  if (value.startsWith("http")) {
    return value;
  }

  const base = BASE_PATH.endsWith("/") ? BASE_PATH : `${BASE_PATH}/`;
  const trimmed = value.startsWith("/") ? value.slice(1) : value;
  return `${base}${trimmed}`;
};
export const DEFAULT_TITLE = "Mark Hazleton | Technical Solutions Architect";
export const DEFAULT_DESCRIPTION =
  "Technical Solutions Architect designing resilient .NET and Azure systems for healthcare and enterprise. 15+ years turning complexity into clarity through scalable cloud architecture.";
export const DEFAULT_KEYWORDS =
  "Mark Hazleton, technical solutions architect, cloud architecture, Azure, .NET, healthcare system architecture, enterprise cloud migration, scalable architecture, integration patterns, systems design, event-driven architecture, observability, resilient systems, Wichita KS";
export const DEFAULT_IMAGE = `${SITE_URL}/placeholder.svg`;
