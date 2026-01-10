import { useContext } from "react";
import { HeadContext } from "@/lib/head-context";

export function useHeadManager() {
  const context = useContext(HeadContext);
  if (!context) {
    throw new Error("useHeadManager must be used within HeadProvider.");
  }
  return context;
}
