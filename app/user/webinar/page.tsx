"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type WebinarView = "list" | "create" | "waiting" | "live";
type WebinarType = "private" | "public";
type LivePanel = "chat" | "attendees";
type LiveRole = "attendee" | "host";
type SelectorMode = "attendees" | "hosts" | null;

type Person = {
  id: number;
  name: string;
  role: string;
  image: string;
};

type WebinarCard = {
  id: number;
  title: string;
  dateLabel: string;
  host: string;
  startingSoon?: boolean;
};

const attendeeDirectory: Person[] = [
  { id: 1, name: "Marcus Chen", role: "Pharmacy Lead", image: "/avatar-1.png" },
  { id: 2, name: "Patty Vance", role: "Front Desk Admin", image: "/avatar-2.png" },
  { id: 3, name: "Dr. Sarah Johnson", role: "Surgery", image: "/avatar-2.png" },
  { id: 4, name: "Dr. Lisa Wong", role: "General Practice", image: "/avatar-1.png" },
];

const hostDirectory: Person[] = [
  { id: 5, name: "Elena Rodriguez", role: "Anesthesia Tech", image: "/avatar-1.png" },
  { id: 6, name: "Dr. James Wilson", role: "Pharmacy Lead", image: "/avatar-2.png" },
  { id: 7, name: "Dr. Sarah Jenkins", role: "General Practice", image: "/avatar-2.png" },
  { id: 8, name: "Dr. Michael Chen", role: "Surgery", image: "/avatar-1.png" },
];

const initialWebinars: WebinarCard[] = [
  {
    id: 1,
    title: "Buddy Smith TPLO Consultation",
    dateLabel: "Oct 12, 2026, 3:30 PM",
    host: "Dr. Sarah Jenkins",
    startingSoon: true,
  },
  {
    id: 2,
    title: "New Anesthesia Protocols Q4",
    dateLabel: "June 07, 2026, 5:45 PM",
    host: "Dr. Michael Chen",
  },
];

const initialChatMessages = [
  {
    id: 1,
    author: "Dr. Mark Chen",
    time: "14:02",
    message:
      "Excellent point about the mitral valve regurgitation metrics. Are we seeing these trends in younger breeds now?",
  },
  {
    id: 2,
    author: "Sarah Jennings, RVT",
    time: "14:04",
    message: "The resolution on this slide is incredible. Makes it much easier to see the subtle lesions.",
  },
  {
    id: 3,
    author: "Dr. Alex Voss",
    time: "14:05",
    message: "Will the recording be available in the library after this?",
  },
];

const initialLiveAttendees = [
  { id: 1, name: "Dr. Sarah Jenkins", title: "Host", image: "/avatar-2.png", muted: false, cameraOff: false },
  { id: 2, name: "Dr. Michael Chen", title: "Surgery", image: "/avatar-1.png", muted: false, cameraOff: false },
  { id: 3, name: "Elena Rodriguez", title: "Clinical Staff", image: "/avatar-2.png", muted: true, cameraOff: false },
  { id: 4, name: "Dr. James Wilson", title: "Observer", image: "/avatar-1.png", muted: false, cameraOff: false },
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.667 1.667V4.167M13.333 1.667V4.167M2.917 7.5H17.083M4.583 3.333H15.417C16.337 3.333 17.083 4.079 17.083 5V15.833C17.083 16.754 16.337 17.5 15.417 17.5H4.583C3.663 17.5 2.917 16.754 2.917 15.833V5C2.917 4.079 3.663 3.333 4.583 3.333Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 5.5V10L13.2 11.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M15.833 17.5C15.833 15.659 13.221 14.167 10 14.167C6.779 14.167 4.167 15.659 4.167 17.5M10 10.833C8.159 10.833 6.667 9.341 6.667 7.5C6.667 5.659 8.159 4.167 10 4.167C11.841 4.167 13.333 5.659 13.333 7.5C13.333 9.341 11.841 10.833 10 10.833Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15C13.657 15 15 13.657 15 12V7C15 5.343 13.657 4 12 4C10.343 4 9 5.343 9 7V12C9 13.657 10.343 15 12 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6 11.5C6 14.814 8.686 17.5 12 17.5C15.314 17.5 18 14.814 18 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 10.5L19.5 7.5V16.5L15 13.5V10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="4.5" y="7.5" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 15V5M12 5L8.5 8.5M12 5L15.5 8.5M5 15.5V18C5 19.105 5.895 20 7 20H17C18.105 20 19 19.105 19 18V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 4.5H15M5.5 7H18.5M9 10V17M15 10V17M7.5 7L8 18C8.036 18.828 8.719 19.5 9.548 19.5H14.452C15.281 19.5 15.964 18.828 16 18L16.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13.5 5.5L18.5 10.5M5 19L9.5 18L17.5 10C18.163 9.337 18.535 8.438 18.535 7.5C18.535 6.562 18.163 5.663 17.5 5C16.837 4.337 15.938 3.965 15 3.965C14.062 3.965 13.163 4.337 12.5 5L4.5 13L3.5 17.5L5 19Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WebinarEmptyIcon() {
  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden="true">
      <rect x="14" y="18" width="48" height="34" rx="4" stroke="currentColor" strokeWidth="2.8" />
      <path d="M20 30H56M20 40H56M32 18V52M44 18V52M38 60H50M44 52V60" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="27" cy="24" r="5" stroke="currentColor" strokeWidth="2.8" />
      <circle cx="51" cy="24" r="5" stroke="currentColor" strokeWidth="2.8" />
      <circle cx="27" cy="35" r="5" stroke="currentColor" strokeWidth="2.8" />
      <circle cx="51" cy="35" r="5" stroke="currentColor" strokeWidth="2.8" />
    </svg>
  );
}

function ToggleRadio({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="webinar_radio" onClick={onClick}>
      <span className={checked ? "active" : ""}>{checked ? "✓" : ""}</span>
      {label}
    </button>
  );
}

export default function WebinarPage() {
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<WebinarView>("list");
  const [webinars, setWebinars] = useState<WebinarCard[]>(initialWebinars);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [webinarType, setWebinarType] = useState<WebinarType>("private");
  const [allowChat, setAllowChat] = useState(false);
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<number[]>([1, 2]);
  const [selectedHostIds, setSelectedHostIds] = useState<number[]>([5, 6]);
  const [selectorMode, setSelectorMode] = useState<SelectorMode>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [livePanel, setLivePanel] = useState<LivePanel>("chat");
  const [liveRole, setLiveRole] = useState<LiveRole>("attendee");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const selectedAttendees = useMemo(
    () => attendeeDirectory.filter((person) => selectedAttendeeIds.includes(person.id)),
    [selectedAttendeeIds]
  );
  const selectedHosts = useMemo(
    () => hostDirectory.filter((person) => selectedHostIds.includes(person.id)),
    [selectedHostIds]
  );
  const combinedDirectory = selectorMode === "attendees" ? attendeeDirectory : hostDirectory;
  const combinedSelectedIds = selectorMode === "attendees" ? selectedAttendeeIds : selectedHostIds;

  const resetCreateForm = () => {
    setTitle("");
    setDescription("");
    setSelectedDate("");
    setSelectedTime("");
    setWebinarType("private");
    setAllowChat(false);
    setSelectedAttendeeIds([1, 2]);
    setSelectedHostIds([5, 6]);
    setSelectorMode(null);
  };

  const handleDelete = (id: number) => {
    setWebinars((current) => current.filter((item) => item.id !== id));
  };

  const togglePerson = (id: number) => {
    if (selectorMode === "attendees") {
      setSelectedAttendeeIds((current) =>
        current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
      );
      return;
    }

    setSelectedHostIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  };

  const removeSelected = (id: number, mode: "attendees" | "hosts") => {
    if (mode === "attendees") {
      setSelectedAttendeeIds((current) => current.filter((entry) => entry !== id));
      return;
    }

    setSelectedHostIds((current) => current.filter((entry) => entry !== id));
  };

  const continueCreate = () => {
    if (!title.trim() || !selectedHostIds.length) {
      return;
    }

    const nextWebinar: WebinarCard = {
      id: Date.now(),
      title,
      dateLabel: selectedDate && selectedTime ? `${selectedDate}, ${selectedTime}` : "Oct 22, 2026, 5:30 PM",
      host: selectedHosts[0]?.name ?? "Dr. Elena Rodriguez",
    };

    setWebinars((current) => [nextWebinar, ...current]);
    setShowSuccessModal(true);
  };

  const openLive = (role: LiveRole) => {
    setLiveRole(role);
    setView("live");
    setSelectorMode(null);
  };

  useEffect(() => {
    if (!selectorMode) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setSelectorMode(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [selectorMode]);

  const pageTitle = view === "create" ? "Create Webinar" : "Webinars";

  return (
    <section className={`webinar_page ${view === "live" || view === "waiting" ? "webinar_page_full" : ""}`}>
      {view !== "live" && view !== "waiting" ? (
        <>
          <div className="webinar_head">
            <div>
              <h2 className="dashboard_title">{pageTitle}</h2>
              <p className="dashboard_sub">Browse upcoming webinars. Join live sessions to stay updated.</p>
            </div>

            {view === "list" ? (
              <div className="webinar_head_actions">
                <button
                  type="button"
                  className="commen_btn webinar_primary_btn webinar_head_primary"
                  onClick={() => {
                    setView("create");
                    setSelectorMode(null);
                  }}
                >
                  Create Webinar
                </button>
              </div>
            ) : null}
          </div>

          {view === "list" ? (
            webinars.length ? (
              <div className="webinar_cards">
                {webinars.map((item) => (
                  <article key={item.id} className="webinar_card">
                    <div className="webinar_card_media">
                      <div className="webinar_card_media_icon">
                        <WebinarEmptyIcon />
                      </div>
                    </div>

                    <div className="webinar_card_body">
                      <h3>{item.title}</h3>
                      <div className="webinar_card_meta">
                        <span>
                          <CalendarIcon />
                          {item.dateLabel}
                        </span>
                        <span>
                          <UserIcon />
                          {item.host}
                        </span>
                      </div>

                      <div className="webinar_card_actions">
                        <button
                          type="button"
                          className="commen_btn webinar_primary_btn webinar_join_btn"
                          onClick={() => {
                            if (item.startingSoon) {
                              setView("waiting");
                            } else {
                              openLive("host");
                            }
                          }}
                        >
                          Join Webinar
                        </button>
                        <button type="button" className="webinar_icon_btn" onClick={() => setView("create")} aria-label="Edit webinar">
                          <EditIcon />
                        </button>
                        <button type="button" className="webinar_icon_btn" onClick={() => handleDelete(item.id)} aria-label="Delete webinar">
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="webinar_empty_state">
                <div className="webinar_empty_icon_wrap">
                  <div className="webinar_empty_icon_shadow"></div>
                  <div className="webinar_empty_icon">
                    <WebinarEmptyIcon />
                  </div>
                </div>
                <h3>No Upcoming Webinars</h3>
                <p>There are no scheduled webinars at the moment. Check back later for new sessions.</p>
              </div>
            )
          ) : (
            <div className="webinar_create_card">
              <div className="webinar_form_grid">
                <div className="webinar_field webinar_field_half">
                  <label>Title</label>
                  <input placeholder="Webinar Title" value={title} onChange={(event) => setTitle(event.target.value)} />
                </div>

                <div className="webinar_field webinar_field_full">
                  <label>Description</label>
                  <textarea
                    placeholder="Webinar Title"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="webinar_field webinar_field_half">
                  <label>Date</label>
                  <div className="webinar_input_icon">
                    <input type="text" placeholder="Select" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
                    <CalendarIcon />
                  </div>
                </div>

                <div className="webinar_field webinar_field_half">
                  <label>Time</label>
                  <div className="webinar_input_icon">
                    <input type="text" placeholder="00:00" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} />
                    <ClockIcon />
                  </div>
                </div>
              </div>

              <div className="webinar_options_grid">
                <div className="webinar_option_block">
                  <div className="webinar_option_head">
                    <h4>Webinar Type</h4>
                    {webinarType === "private" ? <span>{selectedAttendees.length} Attendee Selected</span> : null}
                  </div>
                  <div className="webinar_radio_row">
                    <ToggleRadio checked={webinarType === "private"} label="Private" onClick={() => setWebinarType("private")} />
                    <ToggleRadio checked={webinarType === "public"} label="Public" onClick={() => setWebinarType("public")} />
                  </div>
                </div>

                <div className="webinar_option_block">
                  <div className="webinar_option_head">
                    <h4>Allow Live Chat</h4>
                  </div>
                  <div className="webinar_radio_row">
                    <ToggleRadio checked={allowChat} label="Yes" onClick={() => setAllowChat(true)} />
                    <ToggleRadio checked={!allowChat} label="No" onClick={() => setAllowChat(false)} />
                  </div>
                </div>
              </div>

              {webinarType === "private" ? (
                <div className="webinar_selector_group" ref={selectorMode === "attendees" ? selectorRef : null}>
                  <div className="webinar_selector_input" onClick={() => setSelectorMode(selectorMode === "attendees" ? null : "attendees")}>
                    Choose attendee
                  </div>
                  {selectorMode === "attendees" ? (
                    <div className="webinar_selector_dropdown">
                      {combinedDirectory.map((person) => (
                        <button key={person.id} type="button" className="webinar_selector_item" onClick={() => togglePerson(person.id)}>
                          <div className="webinar_selector_person">
                            <Image src={person.image} alt={person.name} width={54} height={54} />
                            <div>
                              <h5>{person.name}</h5>
                              <p>{person.role}</p>
                            </div>
                          </div>
                          <span className={`webinar_selector_check ${combinedSelectedIds.includes(person.id) ? "active" : ""}`}>
                            {combinedSelectedIds.includes(person.id) ? "✓" : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="webinar_chip_row">
                    {selectedAttendees.map((person) => (
                      <span key={person.id} className="webinar_chip">
                        <Image src={person.image} alt={person.name} width={24} height={24} />
                        {person.name}
                        <button type="button" onClick={() => removeSelected(person.id, "attendees")}>
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="webinar_selector_group" ref={selectorMode === "hosts" ? selectorRef : null}>
                <div className="webinar_option_head webinar_option_head_hosts">
                  <h4>Choose Host/Presenter</h4>
                  <span>{selectedHosts.length} Host Selected</span>
                </div>
                <div className="webinar_selector_input" onClick={() => setSelectorMode(selectorMode === "hosts" ? null : "hosts")}>
                  Search by name, role, or specialty...
                </div>
                {selectorMode === "hosts" ? (
                  <div className="webinar_selector_dropdown">
                    {combinedDirectory.map((person) => (
                      <button key={person.id} type="button" className="webinar_selector_item" onClick={() => togglePerson(person.id)}>
                        <div className="webinar_selector_person">
                          <Image src={person.image} alt={person.name} width={54} height={54} />
                          <div>
                            <h5>{person.name}</h5>
                            <p>{person.role}</p>
                          </div>
                        </div>
                        <span className={`webinar_selector_check ${combinedSelectedIds.includes(person.id) ? "active" : ""}`}>
                          {combinedSelectedIds.includes(person.id) ? "✓" : ""}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="webinar_chip_row">
                  {selectedHosts.map((person) => (
                    <span key={person.id} className="webinar_chip">
                      <Image src={person.image} alt={person.name} width={24} height={24} />
                      {person.name}
                      <button type="button" onClick={() => removeSelected(person.id, "hosts")}>
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="webinar_create_actions">
                <button type="button" className="webinar_secondary_btn" onClick={() => setView("list")}>
                  Cancel
                </button>
                <button type="button" className="commen_btn webinar_primary_btn webinar_continue_btn" onClick={continueCreate}>
                  Continue
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}

      {view === "waiting" ? (
        <div className="webinar_waiting_room">
          <Image src="/logo_big.svg" alt="KIN" className="webinar_waiting_logo" width={320} height={88} />
          <div className="webinar_waiting_card">
            <span className="webinar_waiting_badge">Waiting Room</span>
            <h2>The Session Will Begin Shortly</h2>
            <p>
              Stay tuned for &quot;Advanced Oncology Diagnostics in Small Animals&quot; with Dr. Helena Vance.
            </p>
            <div className="webinar_waiting_countdown">
              <span>Starting In</span>
              <strong>
                <ClockIcon />
                04:12
              </strong>
            </div>
          </div>

          <div className="webinar_waiting_meta">
            <h3>Advanced Oncology Diagnostics in Small Animals</h3>
            <p>
              Presented by <span>Dr. Helena Vance</span>, Chief of Surgery
            </p>
          </div>

          <div className="webinar_waiting_actions">
            <button type="button" className="settings_secondary_btn" onClick={() => setView("list")}>
              Back
            </button>
            <button type="button" className="commen_btn webinar_primary_btn" onClick={() => openLive("attendee")}>
              Join When Ready
            </button>
          </div>
        </div>
      ) : null}

      {view === "live" ? (
        <div className="webinar_live_room">
          <div className="webinar_live_topbar">
            <button type="button" className="webinar_back_btn" onClick={() => setView("list")}>
              ←
            </button>
            <h2>Kinnet Clinical</h2>
            <span className="webinar_live_badge">Live</span>
            <span className="webinar_live_viewers">128 Viewers</span>
            <div className="webinar_live_topbar_right">
              <button type="button" className="webinar_live_bell" aria-label="Notifications">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M10 17.5C10.92 17.5 11.667 16.753 11.667 15.833H8.333C8.333 16.753 9.08 17.5 10 17.5ZM15 14.167V9.167C15 6.608 13.608 4.467 11.167 3.887V3.333C11.167 2.642 10.691 2.167 10 2.167C9.309 2.167 8.833 2.642 8.833 3.333V3.887C6.383 4.467 5 6.6 5 9.167V14.167L3.333 15.833V16.667H16.667V15.833L15 14.167Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="webinar_live_userline"></div>
              <div className="webinar_live_user">
                <div>
                  <h4>Dr. Elena Rodriguez</h4>
                  <p>Lead Surgeon</p>
                </div>
                <Image src="/icn/user_avatar.svg" alt="Dr. Elena Rodriguez" width={48} height={48} />
              </div>
            </div>
          </div>

          <div className="webinar_live_shell">
            <div className="webinar_live_stage">
              <div className="webinar_live_host_tag">
                Host: Dr. Mark Chen{liveRole === "host" ? " (Presenting)" : ""}
              </div>
              <div className="webinar_live_main_feed">
                <div className="webinar_live_speaker"></div>
                <div className={`webinar_live_self_tile ${liveRole === "host" ? "host_mode" : ""}`}>
                  <Image src="/avatar-2.png" alt="Dr. Sarah Jenkins" width={240} height={240} />
                  <span>Dr. Sarah Jenkins</span>
                </div>
              </div>

              {liveRole === "attendee" ? (
                <div className="webinar_live_participants_strip">
                  {[...selectedHosts, ...selectedAttendees.slice(0, 2)].map((person) => (
                    <div key={person.id} className="webinar_live_participant_card">
                      <Image src={person.image} alt={person.name} width={220} height={160} />
                      <span>{person.name}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="webinar_live_controls">
                <button type="button" className="webinar_control_btn">
                  <MicrophoneIcon />
                </button>
                <button type="button" className="webinar_control_btn">
                  <CameraIcon />
                </button>
                {liveRole === "host" ? (
                  <button
                    type="button"
                    className={`webinar_control_btn webinar_share_btn ${isScreenSharing ? "active" : ""}`}
                    onClick={() => setIsScreenSharing((current) => !current)}
                  >
                    <ShareIcon />
                    <span>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  className={`webinar_control_btn ${isRecording ? "recording" : ""}`}
                  onClick={() => setIsRecording((current) => !current)}
                >
                  <RecordIcon />
                </button>
                <button type="button" className="webinar_leave_btn" onClick={() => setView("list")}>
                  {liveRole === "host" ? "End Webinar" : "Leave Webinar"}
                </button>
                {liveRole === "host" && isRecording ? <div className="webinar_recording_badge">Recording 01:42:08</div> : null}
              </div>
            </div>

            <aside className="webinar_live_sidebar">
              <div className="webinar_live_sidebar_tabs">
                <button type="button" className={livePanel === "chat" ? "active" : ""} onClick={() => setLivePanel("chat")}>
                  Live Chat
                </button>
                <button type="button" className={livePanel === "attendees" ? "active" : ""} onClick={() => setLivePanel("attendees")}>
                  Attendees
                </button>
              </div>

              {livePanel === "chat" ? (
                <div className="webinar_chat_panel">
                  {initialChatMessages.map((message, index) => (
                    <div key={message.id}>
                      <div className="webinar_chat_head">
                        <strong>{message.author}</strong>
                        <span>{message.time}</span>
                      </div>
                      <div className="webinar_chat_bubble">{message.message}</div>
                      {index === 1 ? <div className="webinar_chat_notice">New Viewer Joined: Dr. Patel</div> : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="webinar_attendee_panel">
                  {initialLiveAttendees.map((person) => (
                    <div key={person.id} className="webinar_attendee_row">
                      <div className="webinar_attendee_identity">
                        <Image src={person.image} alt={person.name} width={58} height={58} />
                        <div>
                          <h5>{person.name}</h5>
                          <p>{person.title}</p>
                        </div>
                      </div>
                      <div className="webinar_attendee_actions">
                        <MicrophoneIcon />
                        <CameraIcon />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {livePanel === "chat" ? (
                <div className="webinar_chat_input">
                  <input placeholder="Type a message..." />
                  <button type="button">
                    <Image src="/icn/send_icn.svg" alt="send" width={28} height={28} />
                  </button>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      ) : null}

      {showSuccessModal ? (
        <div className="webinar_modal_backdrop">
          <div className="webinar_success_modal">
            <div className="webinar_success_icon">✓</div>
            <h3>Webinar Created Successfully</h3>
            <p>
              Your {webinarType} webinar has been created successfully and is now visible in the Webinars tab.
            </p>
            <button
              type="button"
              className="commen_btn webinar_primary_btn"
              onClick={() => {
                setShowSuccessModal(false);
                resetCreateForm();
                setView("list");
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
