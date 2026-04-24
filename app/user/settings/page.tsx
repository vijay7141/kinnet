"use client";

import { useState } from "react";

type ToastState = "success" | null;

type NotificationMatrixItem = {
  id: number;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  browser: boolean;
};

type NotificationSettingsState = {
  onlineStatus: boolean;
  doNotDisturb: boolean;
  days: string[];
  quietFrom: string;
  quietTo: string;
  matrix: NotificationMatrixItem[];
};

const notificationSnapshot: NotificationSettingsState = {
  onlineStatus: true,
  doNotDisturb: false,
  days: ["Monday"],
  quietFrom: "20:00",
  quietTo: "07:00",
  matrix: [
    {
      id: 1,
      label: "Group Message Alerts",
      description: "Critical health changes or surgery alerts",
      email: true,
      push: true,
      browser: true,
    },
    {
      id: 2,
      label: "Direct Messages",
      description: "Chat notifications from fellow clinicians",
      email: false,
      push: true,
      browser: true,
    },
    {
      id: 3,
      label: "Chanel Message Alerts",
      description: "Critical health changes or surgery alerts",
      email: true,
      push: true,
      browser: true,
    },
    {
      id: 4,
      label: "Referral Updates",
      description: "New case assignments and status changes",
      email: true,
      push: false,
      browser: false,
    },
    {
      id: 5,
      label: "System Maintenance",
      description: "Platform updates and technical reports",
      email: true,
      push: false,
      browser: false,
    },
  ],
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`settings_toggle ${checked ? "active" : ""}`}
      onClick={onChange}
      aria-label={label}
      aria-pressed={checked}
    >
      <span></span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
      <path
        d="M8 12.5L10.7 15.2L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5V12L15.25 15.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SettingsPage() {
  const [toast, setToast] = useState<ToastState>(null);
  const [notifications, setNotifications] = useState<NotificationSettingsState>(notificationSnapshot);

  const toggleNotificationChannel = (
    id: number,
    field: keyof Pick<NotificationMatrixItem, "email" | "push" | "browser">
  ) => {
    setNotifications((current) => ({
      ...current,
      matrix: current.matrix.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      ),
    }));
  };

  const toggleDay = (day: string) => {
    setNotifications((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((entry) => entry !== day)
        : [...current.days, day],
    }));
  };

  return (
    <section className="settings_page">
      <div className="settings_page_head">
        <div>
          <h2 className="dashboard_title">Notification Settings</h2>
          <p className="dashboard_sub">
            Configure how you receive message alerts, and administrative notifications across all your devices.
          </p>
        </div>
      </div>

      {toast ? (
        <div className="settings_toast">
          <button type="button" className="settings_toast_close" onClick={() => setToast(null)} aria-label="Close toast">
            x
          </button>
          <div className="settings_toast_icon">
            <CheckIcon />
          </div>
          <div>
            <h4>Preferences Saved Successfully</h4>
            <p>Your notification preferences have been updated.</p>
          </div>
        </div>
      ) : null}

      <div className="settings_notification_grid">
        <aside className="settings_notification_sidebar">
          <div className="settings_panel settings_notification_card">
            <h3 className="settings_section_heading">Current Availability</h3>

            <div className="settings_availability_row">
              <div className="settings_availability_label">
                <span className="settings_status_dot"></span>
                <span>Online Status</span>
              </div>
              <Toggle
                checked={notifications.onlineStatus}
                onChange={() =>
                  setNotifications((current) => ({ ...current, onlineStatus: !current.onlineStatus }))
                }
                label="Toggle online status"
              />
            </div>

            <div className="settings_availability_row">
              <div className="settings_availability_label">
                <img src="../icn/donot-distrb.svg" alt="Do Not Disturb Icon" className="settings_dnd_icon" />
                <span>Do Not Disturb</span>
              </div>
              <Toggle
                checked={notifications.doNotDisturb}
                onChange={() =>
                  setNotifications((current) => ({ ...current, doNotDisturb: !current.doNotDisturb }))
                }
                label="Toggle do not disturb"
              />
            </div>

            <p className="settings_helper_text">
              &quot;Do Not Disturb&quot; suppresses all audible alerts but allows high-priority surgical updates to pass
              through.
            </p>

            <div className="settings_days_wrap">
              <h4>When to Receive Notifications</h4>
              <div className="settings_days_list">
                {weekDays.map((day) => (
                  <label key={day} className="settings_day_option">
                    <input
                      type="checkbox"
                      checked={notifications.days.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="settings_notification_content">
          <div className="settings_panel settings_notification_table_panel">
            <div className="settings_notification_table_head">
              <span>Notification Category</span>
              <span>Email</span>
              <span>Push</span>
              <span>Browser</span>
            </div>

            {notifications.matrix.map((item) => (
              <div key={item.id} className="settings_notification_row">
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>

                <label className="settings_square_check">
                  <input
                    type="checkbox"
                    checked={item.email}
                    onChange={() => toggleNotificationChannel(item.id, "email")}
                  />
                  <span></span>
                  <strong className="settings_square_check_label">Email</strong>
                </label>

                <label className="settings_square_check">
                  <input
                    type="checkbox"
                    checked={item.push}
                    onChange={() => toggleNotificationChannel(item.id, "push")}
                  />
                  <span></span>
                  <strong className="settings_square_check_label">Push</strong>
                </label>

                <label className="settings_square_check">
                  <input
                    type="checkbox"
                    checked={item.browser}
                    onChange={() => toggleNotificationChannel(item.id, "browser")}
                  />
                  <span></span>
                  <strong className="settings_square_check_label">Browser</strong>
                </label>
              </div>
            ))}
          </div>

          <div className="settings_panel settings_quiet_hours_panel">
            <div className="settings_quiet_hours_head">
              <div>
                <h3 className="settings_section_heading">Notification Quiet Hours</h3>
                <p>Automatically silence all non-emergency alerts during your off-shift hours.</p>
              </div>
              <div className="settings_clock_badge">
                <ClockIcon />
              </div>
            </div>

            <div className="settings_time_range">
              <div className="settings_time_box">
                <label>From</label>
                <input
                  type="time"
                  value={notifications.quietFrom}
                  onChange={(event) =>
                    setNotifications((current) => ({ ...current, quietFrom: event.target.value }))
                  }
                />
              </div>
              <span className="settings_time_dash">-</span>
              <div className="settings_time_box">
                <label>To</label>
                <input
                  type="time"
                  value={notifications.quietTo}
                  onChange={(event) =>
                    setNotifications((current) => ({ ...current, quietTo: event.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="settings_footer_actions">
            <button
              type="button"
              className="settings_secondary_btn"
              onClick={() => setNotifications(notificationSnapshot)}
            >
              Discard Changes
            </button>
            <button type="button" className="commen_btn settings_primary_btn" onClick={() => setToast("success")}>
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
