import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const SidebarContext = createContext<{
  content: ReactNode;
  setContent: (node: ReactNode) => void;
}>({ content: null, setContent: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);
  return (
    <SidebarContext.Provider value={{ content, setContent }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContent() {
  return useContext(SidebarContext).content;
}

export function Sidebar({ children }: { children: ReactNode }) {
  const { setContent } = useContext(SidebarContext);
  useEffect(() => {
    setContent(children);
    return () => setContent(null);
  }, [children, setContent]);
  return null;
}
