"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ sidebarOpen }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside className={`dash_sidebar ${sidebarOpen ? "active" : ""}`}>
      <img src="/logo_big.svg" alt="logo" className="logo" />

      <ul className="dash_menu">
        <li className={isActive("/user/dashboard") ? "active" : ""}>
          <Link href="/user/dashboard">
            <img src="/icn/home_icn.svg" alt="" />
            Dashboard
          </Link>
        </li>

        <li className={isActive("/user/referrals") ? "active" : ""}>
          <Link href="/user/referrals">
            <img src="/icn/referrals_icn.svg" alt="" />
            Referrals
          </Link>
        </li>

        <li className={isActive("/user/messages") ? "active" : ""}>
          <Link href="/user/messages">
            <img src="/icn/messages_icn.svg" alt="" />
            Messages
          </Link>
          <span>2</span>
        </li>

        <li className={isActive("/user/channels") ? "active" : ""}>
          <Link href="/user/channels">
            <img src="/icn/channels_icn.svg" alt="" />
            Channels
          </Link>
          <span>7</span>
        </li>

        <li className={isActive("/user/webinar") ? "active" : ""}>
          <Link href="/user/webinar">
            <img src="/icn/webinar_icn.svg" alt="" />
            Webinar
          </Link>
        </li>

        <li className={isActive("/user/recordings") ? "active" : ""}>
          <Link href="/user/recordings">
            <img src="/icn/recordings_icn.svg" alt="" />
            Recordings
          </Link>
        </li>

        <li className={isActive("/user/settings") ? "active" : ""}>
          <Link href="/user/settings">
            <img src="/icn/settings_icn.svg" alt="" />
            Settings
          </Link>
        </li>
      </ul>

      <button className="dash_logout">Logout</button>
    </aside>
  );
}