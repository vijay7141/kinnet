"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ sidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
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

        <button type="button" className="dash_logout" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      </aside>

      {showLogoutModal ? (
        <div className="settings_logout_modal_backdrop">
          <div className="settings_logout_modal">
            <div className="settings_logout_icon" aria-hidden="true">
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M12.8333 7H8.16667C7.23819 7 6.34799 7.36875 5.69162 8.02513C5.03524 8.6815 4.6665 9.57174 4.6665 10.5002V17.5002C4.6665 18.4287 5.03524 19.3189 5.69162 19.9753C6.34799 20.6317 7.23819 21.0004 8.16667 21.0004H12.8333M16.3332 17.5002L21.0002 12.8332M21.0002 12.8332L16.3332 8.16626M21.0002 12.8332H9.33317"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Are You Sure You Want to Logout?</h3>
            <div className="settings_logout_actions">
              <button type="button" className="settings_secondary_btn" onClick={() => setShowLogoutModal(false)}>
                No
              </button>
              <button type="button" className="commen_btn settings_primary_btn" onClick={handleLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
