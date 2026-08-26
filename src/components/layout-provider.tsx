import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface LayoutContextValue {
  crumb: string | null;
  right: ReactNode;
  setCrumb: (label: string | null) => void;
  setRight: (node: ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  crumb: null,
  setCrumb: () => undefined,
  right: null,
  setRight: () => undefined,
});

function LayoutProvider({ children }: { children: ReactNode }) {
  const [crumb, setCrumb] = useState<string | null>(null);
  const [right, setRight] = useState<ReactNode>(null);
  return (
    <LayoutContext.Provider value={{ crumb, setCrumb, right, setRight }}>
      {children}
    </LayoutContext.Provider>
  );
}

function useCrumb() {
  return useContext(LayoutContext).crumb;
}

function useRightColumn() {
  return useContext(LayoutContext).right;
}

function Crumb({ children }: { children: string }) {
  const { setCrumb } = useContext(LayoutContext);
  useEffect(() => {
    setCrumb(children);
    return () => setCrumb(null);
  }, [children, setCrumb]);
  return null;
}

function RightColumn({ children }: { children: ReactNode }) {
  const { setRight } = useContext(LayoutContext);
  useEffect(() => {
    setRight(children);
    return () => setRight(null);
  }, [children, setRight]);
  return null;
}

export { Crumb, LayoutProvider, RightColumn, useCrumb, useRightColumn };
