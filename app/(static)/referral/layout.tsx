"use client";

import { ReactNode, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "../../user/user.css";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dash_layout ${sidebarOpen ? "sidebar_open" : ""}`}>
      
      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="dash_main">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard_mn">
          <div className="container-fluid">
            <main>{children}</main>
          </div>
        </div>
      </div>

    </div>
  );
}
