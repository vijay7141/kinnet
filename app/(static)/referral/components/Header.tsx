'use client';

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type HeaderProps = {
  toggleSidebar: () => void;
};

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: "referral" | "message" | "call";
  avatar?: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "New Referral",
    title: "Luna (Persian Cat) - Sarah Miller",
    description: "Claimed: Dr. Sarah Jenkins",
    time: "2m ago",
    unread: true,
    icon: "referral",
  },
  {
    id: 2,
    type: "New Message",
    title: "Dr. Sarah Jenkins",
    description: '"The lab results for @Bella are back. Please check the thyroid levels before..."',
    time: "15m ago",
    unread: true,
    icon: "message",
    avatar: "/icn/user_avatar.svg",
  },
  {
    id: 3,
    type: "Missed Call",
    title: "Owner: Marcus Wright (Luna)",
    description: "Patient: Luna I Follow-up on post-op medication response.",
    time: "1h ago",
    unread: false,
    icon: "call",
  },
];

function NotificationIcon({ icon, avatar }: { icon: NotificationItem["icon"]; avatar?: string }) {
  if (icon === "message" && avatar) {
    return (
      <span className="dash_notification_media dash_notification_media_avatar" aria-hidden="true">
        <img src='/icn/Dr.Sarah.svg' alt="" />
      </span>
    );
  }

  if (icon === "call") {
    return (
      <span className="dash_notification_media" aria-hidden="true">
       <img src="/icn/call_icn1.svg" alt="" />
      </span>
    );
  }

  return (
    <span className="dash_notification_media" aria-hidden="true">
      <img src="/icn/referral_icn1.svg" alt="" />
    </span>
  );
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  };

  return (
    <div className="dash_header">
      <img src="/logo_big.svg" alt="logo" className="logo" />

      <div className="dash_search">
        <input placeholder="Search patient, referral, or document..." />
        <button type="button" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.8045 14.8626L11.8252 10.8833C12.9096 9.55698 13.4428 7.86465 13.3144 6.15629C13.1861 4.44794 12.406 2.85427 11.1356 1.70493C9.86516 0.555594 8.20158 -0.0614848 6.48895 -0.0186636C4.77632 0.0241577 3.14566 0.723603 1.93426 1.935C0.72287 3.14639 0.0234252 4.77705 -0.019396 6.48968C-0.0622172 8.20231 0.554862 9.86589 1.7042 11.1363C2.85354 12.4067 4.44721 13.1868 6.15556 13.3152C7.86392 13.4435 9.55625 12.9103 10.8825 11.8259L14.8619 15.8053C14.9876 15.9267 15.156 15.9939 15.3308 15.9924C15.5056 15.9909 15.6728 15.9207 15.7964 15.7971C15.92 15.6735 15.9901 15.5063 15.9916 15.3315C15.9932 15.1567 15.926 14.9883 15.8045 14.8626ZM6.66652 12.0006C5.61169 12.0006 4.58054 11.6878 3.70348 11.1018C2.82642 10.5157 2.14283 9.68277 1.73916 8.70823C1.3355 7.73369 1.22988 6.66134 1.43567 5.62677C1.64145 4.59221 2.1494 3.6419 2.89529 2.89602C3.64117 2.15014 4.59147 1.64219 5.62604 1.4364C6.66061 1.23061 7.73296 1.33623 8.7075 1.7399C9.68204 2.14356 10.515 2.82715 11.101 3.70421C11.6871 4.58127 11.9999 5.61242 11.9999 6.66725C11.9983 8.08125 11.4359 9.43689 10.436 10.4367C9.43615 11.4366 8.08052 11.999 6.66652 12.0006Z" fill="#033E4F" />
          </svg>
        </button>
      </div>

      <div className="dash_header_right_area">
        <div className="dash_notification_wrap" ref={notificationRef}>
          <button
            type="button"
            className={`dash_notify_icon ${isNotificationsOpen ? "active" : ""}`}
            onClick={() => setIsNotificationsOpen((current) => !current)}
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <img src="/icn/fi-rr-bell.svg" alt="" />
           
          </button>

          {isNotificationsOpen ? (
            <div className="dash_notification_panel">
              <div className="dash_notification_panel_head">
                <h3>Notifications</h3>
                <button type="button" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              </div>

              <div className="dash_notification_list">
                {notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={`dash_notification_item ${notification.unread ? "unread" : ""}`}
                  >
                    <NotificationIcon icon={notification.icon} avatar={notification.avatar} />

                    <div className="dash_notification_content">
                      <div className="dash_notification_meta">
                        <span className="dash_notification_type">{notification.type}</span>
                        <span className="dash_notification_time">{notification.time}</span>
                      </div>
                      <h4>{notification.title}</h4>
                      <p>{notification.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="dash_vertical_line"></div>

        <Link href="" className="dash_user_info">
          <h4 className="dash_user_name">Dr. Elena Rodriguez</h4>
          <p className="dash_user_role">Lead Surgeon</p>
        </Link>

        <Link href="" className="dash_user_avatar">
          <img src="/icn/user_avatar.svg" alt="user" />
        </Link>

        <button className="mobile_side_show" onClick={toggleSidebar} type="button">
          <img src="/icn/navs.svg" alt="Open navigation" />
        </button>
      </div>
    </div>
  );
}
