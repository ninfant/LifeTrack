import type { ReactNode } from "react";
import Header from "./Header/Header.tsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header />
      <main className="w-full flex-1">{children}</main>
    </div>
  );
};

export default Layout;
