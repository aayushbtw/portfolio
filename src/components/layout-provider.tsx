import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface LayoutContextValue {
  left: ReactNode;
  right: ReactNode;
  setLeft: (node: ReactNode) => void;
  setRight: (node: ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  left: null,
  setLeft: () => undefined,
  right: null,
  setRight: () => undefined,
});

function LayoutProvider({ children }: { children: ReactNode }) {
  const [left, setLeft] = useState<ReactNode>(null);
  const [right, setRight] = useState<ReactNode>(null);
  return (
    <LayoutContext.Provider value={{ left, setLeft, right, setRight }}>
      {children}
    </LayoutContext.Provider>
  );
}

function useLeftColumn() {
  return useContext(LayoutContext).left;
}

function useRightColumn() {
  return useContext(LayoutContext).right;
}

function LeftColumn({ children }: { children: ReactNode }) {
  const { setLeft } = useContext(LayoutContext);
  useEffect(() => {
    setLeft(children);
    return () => setLeft(null);
  }, [children, setLeft]);
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

export {
  LayoutProvider,
  LeftColumn,
  RightColumn,
  useLeftColumn,
  useRightColumn,
};
