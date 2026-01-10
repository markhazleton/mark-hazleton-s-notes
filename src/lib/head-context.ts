import { createContext } from "react";

export type HeadMeta = {
  name?: string;
  property?: string;
  content: string;
};

export type HeadLink = {
  rel: string;
  href: string;
};

export type HeadState = {
  title: string;
  metas: HeadMeta[];
  links: HeadLink[];
};

export type HeadManager = {
  current: HeadState | null;
};

export const HeadContext = createContext<HeadManager | null>(null);

export const createHeadManager = (): HeadManager => ({
  current: null,
});
