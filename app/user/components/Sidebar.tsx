"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type SidebarProps = {
  sidebarOpen?: boolean;
};

export default function Sidebar({ sidebarOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => pathname === path;

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
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_818_3890)">
    <path d="M19.0253 7.6422L15.7928 4.4097C15.4618 4.08997 14.9342 4.09915 14.6145 4.43021C14.3026 4.75313 14.3026 5.26513 14.6145 5.58806L17.847 8.82056C17.9431 8.91849 18.027 9.02763 18.097 9.14556C18.0845 9.14556 18.0745 9.13888 18.062 9.13888L4.99201 9.16556C4.53178 9.16556 4.15869 9.53864 4.15869 9.99888C4.15869 10.4591 4.53178 10.8322 4.99201 10.8322L18.057 10.8055C18.0803 10.8055 18.0995 10.7938 18.122 10.7922C18.0481 10.9332 17.9544 11.0628 17.8437 11.1772L14.6112 14.4097C14.2801 14.7294 14.271 15.257 14.5907 15.588C14.9104 15.9191 15.4379 15.9283 15.769 15.6085C15.776 15.6018 15.7828 15.595 15.7895 15.588L19.022 12.3555C20.3233 11.0538 20.3233 8.94384 19.022 7.6422H19.0253Z" fill="white"/>
    <path d="M5.83478 18.3333H4.16811C2.7874 18.3333 1.66811 17.214 1.66811 15.8333V4.16668C1.66811 2.78598 2.7874 1.66668 4.16811 1.66668H5.83478C6.29502 1.66668 6.66811 1.29359 6.66811 0.833359C6.66811 0.373125 6.29506 0 5.83478 0H4.16811C1.86811 0.00277344 0.00423828 1.86664 0.00146484 4.16668V15.8334C0.00423828 18.1334 1.86811 19.9973 4.16814 20H5.83482C6.29506 20 6.66814 19.6269 6.66814 19.1667C6.66814 18.7064 6.29506 18.3333 5.83478 18.3333Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_818_3890">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg> Logout
        </button>
      </aside>

      {showLogoutModal ? (
        <div className="settings_logout_modal_backdrop">
          <div className="settings_logout_modal">
            <div className="settings_logout_icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                <g clip-path="url(#clip0_818_2245)">
                  <path d="M12.4323 16.25C12.145 16.25 11.8695 16.3641 11.6663 16.5673C11.4631 16.7705 11.349 17.046 11.349 17.3333V20.5833C11.349 21.4453 11.0066 22.2719 10.3971 22.8814C9.7876 23.4909 8.96095 23.8333 8.099 23.8333H5.41667C4.55471 23.8333 3.72806 23.4909 3.11857 22.8814C2.50908 22.2719 2.16667 21.4453 2.16667 20.5833V5.41667C2.16667 4.55471 2.50908 3.72806 3.11857 3.11857C3.72806 2.50908 4.55471 2.16667 5.41667 2.16667H8.099C8.96095 2.16667 9.7876 2.50908 10.3971 3.11857C11.0066 3.72806 11.349 4.55471 11.349 5.41667V8.66667C11.349 8.95398 11.4631 9.22953 11.6663 9.4327C11.8695 9.63586 12.145 9.75 12.4323 9.75C12.7197 9.75 12.9952 9.63586 13.1984 9.4327C13.4015 9.22953 13.5157 8.95398 13.5157 8.66667V5.41667C13.5139 3.98061 12.9427 2.60385 11.9273 1.5884C10.9118 0.572955 9.53506 0.00172018 8.099 0H5.41667C3.98061 0.00172018 2.60385 0.572955 1.5884 1.5884C0.572955 2.60385 0.00172018 3.98061 0 5.41667L0 20.5833C0.00172018 22.0194 0.572955 23.3961 1.5884 24.4116C2.60385 25.427 3.98061 25.9983 5.41667 26H8.099C9.53506 25.9983 10.9118 25.427 11.9273 24.4116C12.9427 23.3961 13.5139 22.0194 13.5157 20.5833V17.3333C13.5157 17.046 13.4015 16.7705 13.1984 16.5673C12.9952 16.3641 12.7197 16.25 12.4323 16.25Z" fill="#374957"/>
                  <path d="M24.7729 10.7032L19.8047 5.73503C19.7048 5.63156 19.5853 5.54903 19.4531 5.49225C19.3209 5.43547 19.1788 5.40559 19.0349 5.40434C18.8911 5.40309 18.7484 5.4305 18.6153 5.48497C18.4822 5.53944 18.3612 5.61988 18.2595 5.7216C18.1578 5.82331 18.0773 5.94427 18.0229 6.07741C17.9684 6.21055 17.941 6.3532 17.9422 6.49704C17.9435 6.64089 17.9734 6.78304 18.0301 6.91521C18.0869 7.04738 18.1694 7.16692 18.2729 7.26686L22.8901 11.8851L6.50033 11.9176C6.21301 11.9176 5.93746 12.0317 5.73429 12.2349C5.53113 12.4381 5.41699 12.7136 5.41699 13.0009C5.41699 13.2883 5.53113 13.5638 5.73429 13.767C5.93746 13.9701 6.21301 14.0843 6.50033 14.0843L22.954 14.0507L18.2707 18.735C18.1673 18.835 18.0847 18.9545 18.028 19.0867C17.9712 19.2188 17.9413 19.361 17.9401 19.5048C17.9388 19.6487 17.9662 19.7913 18.0207 19.9245C18.0752 20.0576 18.1556 20.1786 18.2573 20.2803C18.359 20.382 18.48 20.4624 18.6131 20.5169C18.7463 20.5714 18.8889 20.5988 19.0328 20.5975C19.1766 20.5963 19.3188 20.5664 19.4509 20.5096C19.5831 20.4529 19.7026 20.3703 19.8026 20.2669L24.7707 15.2987C25.3803 14.6895 25.723 13.8632 25.7234 13.0014C25.7238 12.1396 25.3819 11.3129 24.7729 10.7032Z" fill="#374957"/>
                </g>
                <defs>
                  <clipPath id="clip0_818_2245">
                    <rect width="26" height="26" fill="white"/>
                  </clipPath>
                </defs>
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
