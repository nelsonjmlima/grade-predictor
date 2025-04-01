
import { ReactNode } from "react";
import SideNav from "./SideNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SideNav />
      <div className="flex-1 min-w-0">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
