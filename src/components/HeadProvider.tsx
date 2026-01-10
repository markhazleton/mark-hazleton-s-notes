import { ReactNode } from "react";
import { HeadContext, HeadManager } from "@/lib/head-context";

type HeadProviderProps = {
  manager: HeadManager;
  children: ReactNode;
};

export function HeadProvider({ manager, children }: HeadProviderProps) {
  return <HeadContext.Provider value={manager}>{children}</HeadContext.Provider>;
}
