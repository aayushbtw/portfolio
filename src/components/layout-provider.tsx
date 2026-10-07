import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const RightContext = createContext<ReactNode>(null);

const SetRightContext = createContext<(node: ReactNode) => void>(() => {
  // stands in until a provider mounts
});

function LayoutProvider({ children }: { children: ReactNode }) {
  const [right, setRight] = useState<ReactNode>(null);

  return (
    <SetRightContext value={setRight}>
      <RightContext value={right}>{children}</RightContext>
    </SetRightContext>
  );
}

function useRightColumn(): ReactNode {
  return useContext(RightContext);
}

function RightColumn({ children }: { children: ReactNode }) {
  const setRight = useContext(SetRightContext);
  useEffect(() => {
    setRight(children);

    return () => {
      setRight(null);
    };
  }, [children, setRight]);

  return null;
}

export { LayoutProvider, RightColumn, useRightColumn };
