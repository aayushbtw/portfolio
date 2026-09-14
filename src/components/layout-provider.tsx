import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface LayoutContextValue {
  right: ReactNode;
  setRight: (node: ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  right: null,
  setRight: () => {
    // stands in until a provider mounts
  },
});

function LayoutProvider({ children }: { children: ReactNode }) {
  const [right, setRight] = useState<ReactNode>(null);

  return (
    <LayoutContext.Provider value={{ right, setRight }}>
      {children}
    </LayoutContext.Provider>
  );
}

function useRightColumn() {
  return useContext(LayoutContext).right;
}

function RightColumn({ children }: { children: ReactNode }) {
  const { setRight } = useContext(LayoutContext);
  useEffect(() => {
    setRight(children);

    return () => setRight(null);
  }, [children, setRight]);

  return null;
}

export { LayoutProvider, RightColumn, useRightColumn };
