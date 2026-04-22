"use client";

import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ChangeEvent, useRef, useState } from "react";

type ToastState = "success" | "error" | null;

type ProfileState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  clinics: string[];
  highPriorityAlerts: boolean;
  emailDigest: boolean;
};

type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};

const profileSnapshot: ProfileState = {
  firstName: "Sarah",
  lastName: "Jenkins",
  email: "s.jenkins@vca-animal.com",
  phone: "1555012345",
  status: "Available for Consultation",
  clinics: ["Main Campus", "North Wing"],
  highPriorityAlerts: true,
  emailDigest: false,
};

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`settings_toggle ${checked ? "active" : ""} ${disabled ? "disabled" : ""}`}
      onClick={onChange}
      disabled={disabled}
      aria-label={label}
      aria-pressed={checked}
    >
      <span></span>
    </button>
  );
}

function CheckIcon({ variant }: { variant: "success" | "error" }) {
  if (variant === "error") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    );
  }

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

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [profile, setProfile] = useState<ProfileState>(profileSnapshot);
  const [passwords, setPasswords] = useState<PasswordState>({ current: "", next: "", confirm: "" });
  const [avatarPreview, setAvatarPreview] = useState("/avatar-2.png");
  const [savedAvatar, setSavedAvatar] = useState("/avatar-2.png");

  const setProfileField = (field: keyof ProfileState, value: string | boolean) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const resetProfile = () => {
    setProfile(profileSnapshot);
    setPasswords({ current: "", next: "", confirm: "" });
    setAvatarPreview(savedAvatar);
    setEditMode(false);
  };

  const saveProfile = () => {
    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.email.trim()) {
      setToast("error");
      return;
    }

    setSavedAvatar(avatarPreview);
    setEditMode(false);
    setToast("success");
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setToast("error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const updatePassword = () => {
    if (!passwords.current || !passwords.next || passwords.next !== passwords.confirm) {
      setToast("error");
      return;
    }

    setPasswords({ current: "", next: "", confirm: "" });
    setToast("success");
  };

  return (
    <section className="settings_page">
      <div className="settings_page_head">
        <div>
          <h2 className="dashboard_title">User Profile</h2>
          <p className="dashboard_sub">Manage your clinical credentials and notification preferences.</p>
        </div>

        <div className="settings_head_actions">
          {!editMode ? (
            <button type="button" className="commen_btn settings_primary_btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button type="button" className="settings_secondary_btn" onClick={resetProfile}>
                Discard Changes
              </button>
              <button type="button" className="commen_btn settings_primary_btn" onClick={saveProfile}>
                Save Profile
              </button>
            </>
          )}
        </div>
      </div>

      {toast ? (
        <div className={`settings_toast ${toast === "error" ? "error" : ""}`}>
          <button type="button" className="settings_toast_close" onClick={() => setToast(null)} aria-label="Close toast">
            x
          </button>
          <div className="settings_toast_icon">
            <CheckIcon variant={toast === "error" ? "error" : "success"} />
          </div>
          <div>
            <h4>{toast === "error" ? "Update Failed" : "Profile Updated Successfully"}</h4>
            <p>
              {toast === "error"
                ? "Profile update failed. Please try again."
                : "Your clinical credentials have been synchronized."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="settings_profile_grid">
        <aside className="settings_profile_sidebar">
          <div className="settings_panel settings_profile_card">
            <div className="settings_avatar_wrap">
              <div className="settings_avatar">
                <Image src={avatarPreview} alt="Dr. Sarah Jenkins" width={128} height={128} unoptimized />
              </div>

              {editMode ? (
                <button
                  type="button"
                  className="settings_avatar_edit"
                  aria-label="Update profile photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image src="/icn/camera_icn.svg" alt="" width={18} height={18} />
                </button>
              ) : null}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="settings_avatar_input"
                onChange={handleAvatarChange}
              />
            </div>

            <h3>Dr. Sarah Jenkins</h3>
            <p>Head Surgeon, DVM</p>

            <div className="settings_info_block">
              <div className="settings_info_head">
                <h4>Status</h4>
                {!editMode ? (
                  <button type="button" className="settings_icon_link" aria-label="Edit status">
                    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <path
                        d="M10.875 2.25L15.75 7.125M2.25 15.75L6.375 14.625L14.625 6.375C15.1232 5.87681 15.4031 5.20114 15.4031 4.49625C15.4031 3.79136 15.1232 3.11569 14.625 2.6175C14.1268 2.11931 13.4511 1.83944 12.7463 1.83944C12.0414 1.83944 11.3657 2.11931 10.8675 2.6175L2.6175 10.8675L1.5 15.75H2.25Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
              <div className="settings_status_line">
                <span className="settings_status_dot"></span>
                {profile.status}
              </div>
            </div>

            <div className="settings_info_block">
              <div className="settings_info_head">
                <h4>Clinics</h4>
              </div>
              <div className="settings_chip_list">
                {profile.clinics.map((clinic) => (
                  <span key={clinic} className={`settings_chip ${clinic === "Main Campus" ? "active" : ""}`}>
                    {clinic.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </aside>

        <div className="settings_profile_content">
          <div className="settings_panel">
            <h3 className="settings_section_heading">Personal Information</h3>
            <div className="settings_form_grid">
              <div className="settings_field">
                <label>First Name</label>
                <input
                  value={profile.firstName}
                  onChange={(event) => setProfileField("firstName", event.target.value)}
                  disabled={!editMode}
                />
              </div>
              <div className="settings_field">
                <label>Last Name</label>
                <input
                  value={profile.lastName}
                  onChange={(event) => setProfileField("lastName", event.target.value)}
                  disabled={!editMode}
                />
              </div>
              <div className="settings_field settings_field_full">
                <label>Email Address</label>
                <input
                  value={profile.email}
                  onChange={(event) => setProfileField("email", event.target.value)}
                  disabled={!editMode}
                />
              </div>
              <div className="settings_field settings_field_full">
                <label>Phone Number</label>
                <PhoneInput
                  country={"us"}
                  value={profile.phone}
                  onChange={(value) => setProfileField("phone", value)}
                  disabled={!editMode}
                  countryCodeEditable={false}
                  inputClass={`settings_phone_input ${editMode ? "editable" : "readonly"}`}
                  containerClass="settings_phone_input_wrap"
                  buttonClass="settings_phone_button"
                  dropdownClass="settings_phone_dropdown"
                />
              </div>
            </div>
          </div>

          <div className="settings_panel">
            <h3 className="settings_section_heading">Clinical Preferences</h3>
            <div className="settings_preference_rows">
              <div className="settings_preference_row">
                <div>
                  <h4>High-Priority Alerts</h4>
                  <p>Push notifications for life-critical surgery updates.</p>
                </div>
                <Toggle
                  checked={profile.highPriorityAlerts}
                  onChange={() => setProfileField("highPriorityAlerts", !profile.highPriorityAlerts)}
                  disabled={!editMode}
                  label="Toggle high-priority alerts"
                />
              </div>

              <div className="settings_preference_row">
                <div>
                  <h4>Email Digest</h4>
                  <p>Weekly summary of patient outcomes and lab results.</p>
                </div>
                <Toggle
                  checked={profile.emailDigest}
                  onChange={() => setProfileField("emailDigest", !profile.emailDigest)}
                  disabled={!editMode}
                  label="Toggle email digest"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings_panel settings_password_panel">
        <h3 className="settings_section_heading">Security &amp; Credentials</h3>
        <div className="settings_password_grid">
          <div className="settings_field">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))}
              placeholder="........"
            />
          </div>
          <div className="settings_field">
            <label>New Password</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))}
              placeholder="New secure password"
            />
          </div>
          <div className="settings_field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))}
              placeholder="Confirm password"
            />
          </div>
          <div className="settings_password_action">
            <button type="button" className="commen_btn settings_primary_btn" onClick={updatePassword}>
              Update Password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
