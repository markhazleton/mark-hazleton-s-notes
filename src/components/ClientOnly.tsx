import { ReactNode, useSyncExternalStore } from "react";

type ClientOnlyProps = {
  children: ReactNode;
};

const emptySubscribe = () => () => {};

export function ClientOnly({ children }: ClientOnlyProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
