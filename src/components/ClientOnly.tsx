import { ReactNode, useEffect, useState } from "react";

type ClientOnlyProps = {
  children: ReactNode;
};

export function ClientOnly({ children }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
