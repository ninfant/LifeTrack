import type { ReactNode } from "react";
import Header from "./Header/Header.tsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <main className="w-full px-4 py-8">{children}</main>
    </div>
  );
};

export default Layout;
