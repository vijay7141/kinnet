"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CallMode = "audio" | "video";
type CallScreen = "outgoing" | "incoming" | "active" | "ended" | "rejected" | "failed";

type CallParticipant = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  muted?: boolean;
  cameraOff?: boolean;
};

type CallContact = {
  id: string;
  name: string;
  role: string;
  statusLabel?: string;
  avatar: string;
  remoteVisual?: string;
  isGroup?: boolean;
  incomingCaller?: string;
  participants?: CallParticipant[];
};

const callDirectory: Record<string, CallContact> = {
  "icu-team": {
    id: "icu-team",
    name: "Surgery Cases",
    role: "Group Call",
    avatar: "/avatar-1.png",
    isGroup: true,
    incomingCaller: "Andrew Wilson",
    participants: [
      { id: "1", name: "Cameron Wilson", role: "Doctor", avatar: "/group_video_call1.png" },
      { id: "2", name: "Jerome Bell", role: "Doctor", avatar: "/group_video_call2.png" },
      { id: "3", name: "Brooklyn Simmons", role: "Doctor", avatar: "/group_video_call3.png" },
      { id: "4", name: "Wade Warren", role: "Doctor", avatar: "/group_video_call4.png", muted: true, cameraOff: true },
      { id: "5", name: "Jenny Wilson", role: "Doctor", avatar: "/avatar-2.png" },
      { id: "6", name: "Bessie Cooper", role: "Doctor", avatar: "/avatar-1.png" },
    ],
  },
  sarah: {
    id: "sarah",
    name: "Dr. Sarah Jenkins",
    role: "Head of Diagnostics",
    statusLabel: "Senior Veterinarian",
    avatar: "/icn/Dr.Sarah.svg",
    remoteVisual: "/modren-care.png",
  },
  julian: {
    id: "julian",
    name: "Dr. Julian Miller",
    role: "Doctor",
    avatar: "/avatar-1.png",
    remoteVisual: "/modren-care.png",
  },
  elena: {
    id: "elena",
    name: "Emily Rose Johnson",
    role: "Doctor",
    avatar: "/avatar-2.png",
  },
  marcus: {
    id: "marcus",
    name: "William David Brown",
    role: "Doctor",
    avatar: "/avatar-1.png",
  },
};

const selfPreview = {
  name: "You",
  avatar: "/group_video_call5.png",
};

const initialGroupMessages = [
  {
    id: 1,
    author: "Dr. Sarah Jenkins",
    time: "10:42 AM",
    text: "Patient results are uploaded to the portal.",
  },
];

function normalizeMode(value: string | null): CallMode {
  return value === "audio" ? "audio" : "video";
}

function normalizeScreen(value: string | null): CallScreen {
  if (value === "incoming" || value === "active" || value === "ended" || value === "rejected" || value === "failed") {
    return value;
  }

  return "outgoing";
}

function PhoneIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
  <path d="M15.0702 15.0704C13.3319 16.8087 11.2695 18.1714 8.88304 19.1584C6.49656 20.1454 3.94802 20.5947 1.23745 20.5063C0.883894 20.5063 0.589266 20.3884 0.353564 20.1527C0.117861 19.917 1.036e-05 19.6224 1.036e-05 19.2688L0.0442045 15.2472C0.0442039 14.9231 0.143641 14.6469 0.342515 14.4185C0.54139 14.1902 0.795506 14.0539 1.10487 14.0097L5.61267 13.391C5.81891 13.3616 6.01042 13.3763 6.1872 13.4352C6.36397 13.4941 6.52602 13.5973 6.67333 13.7446L9.1924 16.2636C9.92897 15.8806 10.6434 15.446 11.3358 14.9599C12.0282 14.4738 12.6837 13.9213 13.3025 13.3026C13.9212 12.6839 14.4736 12.0284 14.9597 11.336C15.4459 10.6436 15.8805 9.92914 16.2635 9.19257L13.7444 6.6735C13.5971 6.52619 13.494 6.36414 13.435 6.18736C13.3761 6.01059 13.3614 5.81908 13.3908 5.61284L14.0096 1.10503C14.0538 0.795674 14.19 0.541558 14.4184 0.342683C14.6467 0.143809 14.9229 0.0443725 15.247 0.0443726L19.2687 0.000178445C19.6222 0.000178445 19.9169 0.11803 20.1526 0.353732C20.3883 0.589434 20.5061 0.884062 20.5061 1.23762C20.6092 3.93346 20.1636 6.47831 19.1692 8.87216C18.1749 11.266 16.8085 13.3321 15.0702 15.0704Z" fill="white"/>
</svg>
  );
}

function MicIcon({ off = false }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.25C10.2 15.25 8.75 13.8 8.75 12V6.75C8.75 4.95 10.2 3.5 12 3.5C13.8 3.5 15.25 4.95 15.25 6.75V12C15.25 13.8 13.8 15.25 12 15.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 11.75C6.75 14.65 9.1 17 12 17C14.9 17 17.25 14.65 17.25 11.75M12 17V20.5M9.25 20.5H14.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off ? <path d="M4.5 4.5L19.5 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : null}
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 14.5H8.5L13 18V6L8.5 9.5H5.5C4.95 9.5 4.5 9.95 4.5 10.5V13.5C4.5 14.05 4.95 14.5 5.5 14.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 9.5C17.3 10.3 18.17 11.67 18.17 13.25C18.17 14.83 17.3 16.2 16 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17.75 6.5C19.72 7.91 21 10.22 21 13C21 15.78 19.72 18.09 17.75 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon({ off = false }: { off?: boolean }) {
  if (off) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <g clipPath="url(#clip0)">
          <path
            d="M1.225 16.125L13.55 3.8C13.4125 3.7625 13.275 3.75 13.125 3.75H1.875C0.8375 3.75 0 4.5875 0 5.625V14.375C0 15.1875 0.5125 15.875 1.225 16.125Z"
            fill="#033E4F"
          />
          <path
            d="M19.1 5.06281L15 7.11281V5.88406L19.8175 1.06656C20.0613 0.822812 20.0613 0.426562 19.8175 0.182812C19.5738 -0.0609375 19.1775 -0.0609375 18.9338 0.182812L0.183789 18.9328C-0.0599609 19.1766 -0.0599609 19.5728 0.183789 19.8166C0.427539 20.0603 0.823789 20.0603 1.06754 19.8166L4.63379 16.2503H13.125C14.1625 16.2503 15 15.4128 15 14.3753V12.8878L19.1 14.9378C19.3313 15.0366 19.545 15.0103 19.7 14.9128C19.8875 14.7878 20 14.5878 20 14.3753V5.62531C20 5.41281 19.8875 5.21281 19.7 5.08781C19.525 4.97531 19.2875 4.96281 19.1 5.06281Z"
            fill="#033E4F"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  // ON state (normal camera)
  return (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V6.5L20 2.5V13.5L16 9.5V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z" fill="#033E4F"/>
</svg>
  );
}
function RecordIcon({ off = false }: { off?: boolean }) {
  // OFF state (record disabled - slash + faded look)
  if (off) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="6.25"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.4"
        />
        <circle cx="12" cy="12" r="3.75" fill="currentColor" opacity="0.4" />

        {/* slash */}
        <path
          d="M4.5 4.5L19.5 19.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // ON state (normal record)
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="6.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.75" fill="currentColor" />
    </svg>
  );
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 12.5C10.16 12.5 11.5 11.16 11.5 9.5C11.5 7.84 10.16 6.5 8.5 6.5C6.84 6.5 5.5 7.84 5.5 9.5C5.5 11.16 6.84 12.5 8.5 12.5ZM15.5 11.5C16.88 11.5 18 10.38 18 9C18 7.62 16.88 6.5 15.5 6.5C14.12 6.5 13 7.62 13 9C13 10.38 14.12 11.5 15.5 11.5ZM4.5 18.5C4.5 16.57 6.29 15 8.5 15C10.71 15 12.5 16.57 12.5 18.5M13.5 18.5C13.5 17.09 14.81 15.95 16.5 15.95C18.19 15.95 19.5 17.09 19.5 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TimerIcon() {
  return (
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
  <path d="M4.5 1.5V0H9V1.5H4.5ZM6 9.75H7.5V5.25H6V9.75ZM6.75 15.75C5.825 15.75 4.95312 15.5719 4.13438 15.2156C3.31563 14.8594 2.6 14.375 1.9875 13.7625C1.375 13.15 0.890625 12.4344 0.534375 11.6156C0.178125 10.7969 0 9.925 0 9C0 8.075 0.178125 7.20312 0.534375 6.38438C0.890625 5.56563 1.375 4.85 1.9875 4.2375C2.6 3.625 3.31563 3.14062 4.13438 2.78437C4.95312 2.42812 5.825 2.25 6.75 2.25C7.525 2.25 8.26875 2.375 8.98125 2.625C9.69375 2.875 10.3625 3.2375 10.9875 3.7125L12.0375 2.6625L13.0875 3.7125L12.0375 4.7625C12.5125 5.3875 12.875 6.05625 13.125 6.76875C13.375 7.48125 13.5 8.225 13.5 9C13.5 9.925 13.3219 10.7969 12.9656 11.6156C12.6094 12.4344 12.125 13.15 11.5125 13.7625C10.9 14.375 10.1844 14.8594 9.36563 15.2156C8.54688 15.5719 7.675 15.75 6.75 15.75ZM6.75 14.25C8.2 14.25 9.4375 13.7375 10.4625 12.7125C11.4875 11.6875 12 10.45 12 9C12 7.55 11.4875 6.3125 10.4625 5.2875C9.4375 4.2625 8.2 3.75 6.75 3.75C5.3 3.75 4.0625 4.2625 3.0375 5.2875C2.0125 6.3125 1.5 7.55 1.5 9C1.5 10.45 2.0125 11.6875 3.0375 12.7125C4.0625 13.7375 5.3 14.25 6.75 14.25Z" fill="white"/>
</svg>
  );
}

function renderName(name: string) {
  return name.length > 16 ? `${name.slice(0, 13)}...` : name;
}

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = normalizeMode(searchParams.get("type"));
  const initialScreen = normalizeScreen(searchParams.get("screen"));
  const conversationId = searchParams.get("conversation") ?? "sarah";
  const contact = callDirectory[conversationId] ?? callDirectory.sarah;
  const isGroup = contact.isGroup ?? false;

  const [screen, setScreen] = useState<CallScreen>(initialScreen);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(mode === "audio");
  const [isRecording, setIsRecording] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState<CallParticipant[]>(contact.participants ?? []);
  const [groupSidebarTab, setGroupSidebarTab] = useState<"chat" | "notes">("chat");
  const [groupChatMessages, setGroupChatMessages] = useState(initialGroupMessages);
  const [groupChatInput, setGroupChatInput] = useState("");
  const [groupNotes, setGroupNotes] = useState("Key decisions and follow-up notes can be captured here.");
  const [isGroupSidebarOpen, setIsGroupSidebarOpen] = useState(false);

  const subtitle = useMemo(() => {
    if (screen === "outgoing") {
      return mode === "video" ? "Connecting..." : "Calling...";
    }

    if (screen === "incoming") {
      return mode === "video" ? "Incoming call..." : `${contact.incomingCaller ?? contact.name} is Calling...`;
    }

    if (screen === "rejected") {
      return "Call Rejected";
    }

    if (screen === "failed") {
      return "The connection was lost unexpectedly. Please check your network or try again later.";
    }

    if (screen === "ended") {
      return isGroup ? "Call Ended" : "Call Ended (04:56)";
    }

    return "00:02";
  }, [contact.incomingCaller, contact.name, isGroup, mode, screen]);

  useEffect(() => {
    if (screen !== "rejected" && screen !== "ended") {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.push("/user/messages");
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [router, screen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1200px)");

    const syncSidebarState = (event?: MediaQueryListEvent) => {
      if (event?.matches ?? mediaQuery.matches) {
        setIsGroupSidebarOpen(false);
      }
    };

    syncSidebarState();
    mediaQuery.addEventListener("change", syncSidebarState);

    return () => mediaQuery.removeEventListener("change", syncSidebarState);
  }, []);

  const openActive = () => setScreen("active");

  const restartCall = () => {
    setIsRecording(false);
    setScreen("outgoing");
  };

  const endCall = () => {
    setIsRecording(false);
    router.push("/user/messages");
  };

  const toggleGroupParticipantMute = (participantId: string) => {
    setGroupParticipants((current) =>
      current.map((participant) =>
        participant.id === participantId ? { ...participant, muted: !participant.muted } : participant
      )
    );
  };

  const toggleGroupParticipantCamera = (participantId: string) => {
    setGroupParticipants((current) =>
      current.map((participant) =>
        participant.id === participantId ? { ...participant, cameraOff: !participant.cameraOff } : participant
      )
    );
  };

  const handleGroupChatSend = () => {
    const value = groupChatInput.trim();

    if (!value) {
      return;
    }

    setGroupChatMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "You",
        time: "Now",
        text: value,
      },
    ]);
    setGroupChatInput("");
  };

  const liveControls = (
    <div className="calls_controls">
      <button
        type="button"
        className={`calls_control_btn ${isMuted ? "is_off" : ""}`}
        onClick={() => setIsMuted((current) => !current)}
      >
        <span className="calls_control_circle">
          <MicIcon off={isMuted} />
        </span>
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      </button>
      <button
        type="button"
        className={`calls_control_btn ${!isSpeakerOn ? "is_off" : ""}`}
        onClick={() => setIsSpeakerOn((current) => !current)}
      >
        <span className="calls_control_circle">
          <SpeakerIcon />
        </span>
        <span>Speaker</span>
      </button>
      <button
        type="button"
        className={`calls_control_btn ${isCameraOff ? "is_off" : ""}`}
        onClick={() => setIsCameraOff((current) => !current)}
      >
        <span className="calls_control_circle">
          <CameraIcon off={isCameraOff} />
        </span>
        <span>Camera</span>
      </button>
      <button
        type="button"
        className={`calls_control_btn ${isRecording ? "is_recording" : ""}`}
        onClick={() => setIsRecording((current) => !current)}
      >
        <span className="calls_control_circle">
          <RecordIcon />
        </span>
        <span>{mode === "audio" ? "Record Call" : "Stop"}</span>
      </button>
      <div className="calls_control_divider"></div>
      <button type="button" className="calls_end_btn" onClick={endCall}>
        <span className="calls_control_circle calls_end_circle">
          <PhoneIcon />
        </span>
        <span>End</span>
      </button>
    </div>
  );

  if (screen === "active" && mode === "video" && isGroup) {
    const visibleParticipants = groupParticipants.slice(0, 4);

    return (
      <section className="calls_page calls_group_video_page">
        <div className="calls_group_video_shell">
          <div className="calls_group_video_head">
            <button type="button" className="calls_group_video_back" onClick={() => router.push("/user/messages")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <g clipPath="url(#clip0_871_11332)">
    <path d="M1.17372 18.7865L6.33372 23.9999C6.45767 24.1248 6.60514 24.224 6.76762 24.2917C6.9301 24.3594 7.10437 24.3943 7.28039 24.3943C7.4564 24.3943 7.63068 24.3594 7.79316 24.2917C7.95563 24.224 8.1031 24.1248 8.22705 23.9999C8.35202 23.8759 8.45122 23.7284 8.51891 23.566C8.5866 23.4035 8.62145 23.2292 8.62145 23.0532C8.62145 22.8772 8.5866 22.7029 8.51891 22.5404C8.45122 22.378 8.35202 22.2305 8.22705 22.1065L3.48039 17.3332H30.6671C31.0207 17.3332 31.3598 17.1927 31.6099 16.9427C31.8599 16.6926 32.0004 16.3535 32.0004 15.9999C32.0004 15.6462 31.8599 15.3071 31.6099 15.0571C31.3598 14.807 31.0207 14.6665 30.6671 14.6665H3.40039L8.22705 9.83987C8.46344 9.5919 8.59531 9.26245 8.59531 8.91987C8.59531 8.57728 8.46344 8.24784 8.22705 7.99987C8.1031 7.8749 7.95563 7.7757 7.79316 7.70801C7.63068 7.64032 7.4564 7.60547 7.28039 7.60547C7.10437 7.60547 6.9301 7.64032 6.76762 7.70801C6.60514 7.7757 6.45767 7.8749 6.33372 7.99987L1.17372 13.1332C0.424651 13.8832 0.00390625 14.8999 0.00390625 15.9599C0.00390625 17.0199 0.424651 18.0365 1.17372 18.7865V18.7865Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_871_11332">
      <rect width="32" height="32" fill="white"/>
    </clipPath>
  </defs>
</svg>
            </button>
            <div className="calls_group_video_head_identity">
              <div className="calls_group_video_icon">
                <GroupIcon />
              </div>
              <div>
                <h2>{contact.name}</h2>
                <p>General discussion and announcements</p>
              </div>
            </div>
            <button
              type="button"
              className="calls_group_video_sidebar_toggle"
              aria-label="Toggle participants panel"
              aria-expanded={isGroupSidebarOpen}
              onClick={() => setIsGroupSidebarOpen((current) => !current)}
            >
              <GroupIcon />
              <span>Participants</span>
            </button>
          </div>

          <div className="calls_group_video_body">
            <div className="calls_group_video_stage">
              {visibleParticipants.map((participant, index) => (
                <article key={participant.id} className={`calls_group_video_tile ${index === 0 ? "is_active" : ""}`}>
                  <Image src={participant.avatar} alt={participant.name} fill className="calls_group_video_tile_image" />
                  {index === 0 ? <span className="calls_group_video_badge">Active Speaker</span> : null}
                  <div className="calls_group_video_label">
                    <span>{participant.name}</span>
                    {participant.muted ? <MicIcon off /> : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
  <path d="M2.33333 9.33333V2.33333H3.5V9.33333H2.33333ZM4.66667 11.6667V0H5.83333V11.6667H4.66667ZM0 7V4.66667H1.16667V7H0ZM7 9.33333V2.33333H8.16667V9.33333H7ZM9.33333 7V4.66667H10.5V7H9.33333Z" fill="#9FF0F0"/>
</svg>}

                  </div>
                </article>
              ))}

              <div className="calls_group_video_self">
                <Image src={selfPreview.avatar} alt={selfPreview.name} fill className="calls_group_video_self_image" />
                <span>You</span>
              </div>
            </div>

            <div
              className={`calls_group_video_sidebar_overlay ${isGroupSidebarOpen ? "is_visible" : ""}`}
              onClick={() => setIsGroupSidebarOpen(false)}
            />
            <aside className={`calls_group_video_sidebar ${isGroupSidebarOpen ? "is_open" : ""}`}>
              <div className="calls_group_video_sidebar_head">
                <h3>Participants ({groupParticipants.length})</h3>
                <button type="button" aria-label="Close participants panel" onClick={() => setIsGroupSidebarOpen(false)}>
                  ×
                </button>
              </div>

              <div className="calls_group_video_participants">
                {groupParticipants.map((participant, index) => (
                  <div key={participant.id} className="calls_group_video_participant">
                    <div className="calls_group_video_participant_identity">
                      <Image src={participant.avatar} alt={participant.name} width={42} height={42} />
                      <div>
                        <h4>{participant.name}</h4>
                        <p>{index === 0 ? "Host" : participant.role}</p>
                      </div>
                    </div>
                    <div className="calls_group_video_participant_actions">
                      <button
                        type="button"
                        className={participant.muted ? "is_off" : ""}
                        aria-label={participant.muted ? `Unmute ${participant.name}` : `Mute ${participant.name}`}
                        onClick={() => toggleGroupParticipantMute(participant.id)}
                      >
                        <MicIcon off={Boolean(participant.muted)} />
                      </button>
                      <button
                        type="button"
                        className={participant.cameraOff ? "is_off" : ""}
                        aria-label={participant.cameraOff ? `Turn on ${participant.name} camera` : `Turn off ${participant.name} camera`}
                        onClick={() => toggleGroupParticipantCamera(participant.id)}
                      >
                        <CameraIcon off={Boolean(participant.cameraOff)} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="calls_group_video_tabs">
                <button type="button" className={groupSidebarTab === "chat" ? "active" : ""} onClick={() => setGroupSidebarTab("chat")}>
                  Chat
                </button>
                <button type="button" className={groupSidebarTab === "notes" ? "active" : ""} onClick={() => setGroupSidebarTab("notes")}>
                  Notes
                </button>
              </div>

              {groupSidebarTab === "chat" ? (
                <div className="calls_group_video_chat_card">
                  <div className="calls_group_video_chat_list">
                    {groupChatMessages.map((message) => (
                      <div key={message.id} className="calls_group_video_chat_item">
                        <div className="calls_group_video_chat_avatar">{message.author.charAt(0)}</div>
                        <div>
                          <strong>{message.author}</strong>
                          <span>{message.time}</span>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="calls_group_video_chat_input">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={groupChatInput}
                      onChange={(event) => setGroupChatInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleGroupChatSend();
                        }
                      }}
                    />
                    <button type="button" onClick={handleGroupChatSend}>
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="calls_group_video_chat_card calls_group_video_notes_card">
                  <textarea
                    value={groupNotes}
                    onChange={(event) => setGroupNotes(event.target.value)}
                    placeholder="Add call notes..."
                  />
                </div>
              )}
            </aside>
          </div>

          {liveControls}
        </div>
      </section>
    );
  }

  if (screen === "active" && mode === "video" && !isGroup) {
    return (
      <section className="calls_live_cover calls_video_live">
        <div className="calls_video_overlay"></div>
        <div className="calls_timer_badge">
          <TimerIcon />
          <span>04:12</span>
        </div>
        <div className="calls_remote_chip">
          <div>
            <strong>{contact.name}</strong>
            <span>{contact.statusLabel ?? contact.role}</span>
          </div>
          <Image src={contact.avatar} alt={contact.name} width={62} height={62} />
        </div>

        <div className="calls_remote_visual">
      <Image src='/big_call_icn.png' alt={contact.name} fill className="calls_remote_main_image" /> 
        </div>

        <div className="calls_self_preview">
          <Image src='/call_prev.svg' alt={selfPreview.name} fill className="calls_self_preview_image" />
          <span>
            <MicIcon />
            You
          </span>
        </div>

        {liveControls}
      </section>
    );
  }

  if (screen === "active" && mode === "audio" && !isGroup) {
    return (
      <section className="calls_page calls_page_audio_live">
        <div className="calls_center_stage calls_center_stage_live">
          <div className="calls_center_blob"></div>
          <div className="calls_center_avatar">
            <Image src={contact.avatar} alt={contact.name} width={128} height={128} />
          </div>
          <h3>
            {contact.name} <MicIcon />
          </h3>
          <p>{contact.role}</p>
          <div className="calls_status_text">{subtitle}</div>
          {liveControls}
        </div>
      </section>
    );
  }

  const isStandardCentered = screen === "outgoing" || screen === "incoming" || screen === "ended" || screen === "rejected";

  return (
    <section className={`calls_page ${isGroup && screen === "active" ? "calls_page_group" : ""}`}>
      {screen === "failed" ? (
        <>
          <div className="calls_failed_content">
            <div className="calls_failed_icon">
              <PhoneIcon />
            </div>
            <h2>Call Failed</h2>
            <p>{subtitle}</p>
            <div className="calls_failed_actions">
              <button type="button" className="commen_btn calls_retry_btn" onClick={restartCall}>
                Retry Call
              </button>
              <button type="button" className="calls_close_btn" onClick={() => router.push("/user/messages")}>
                Close
              </button>
            </div>
          </div>

          <div className="calls_incoming_popup">
            <div className="calls_incoming_popup_head">
              <div className="calls_incoming_popup_avatar">
                <Image src="/icn/Dr.Sarah.svg" alt="Dr. Sarah Jenkins" width={88} height={88} />
                <span>
                  <CameraIcon />
                </span>
              </div>
              <div>
                <small>Incoming Video Call</small>
                <h4>Dr. Sarah Jenkins</h4>
                <p>Head of Diagnostics</p>
              </div>
            </div>
            <div className="calls_incoming_popup_actions">
              <button type="button" className="calls_popup_decline_btn" onClick={() => setScreen("rejected")}>
                Defer
              </button>
              <button type="button" className="calls_popup_accept_btn" onClick={openActive}>
                Accept
              </button>
            </div>
          </div>
        </>
      ) : null}

      {screen === "active" && isGroup ? (
        <>
          <div className="calls_group_head">
            <div>
              <h2>{contact.name}</h2>
              <p>{contact.role}</p>
            </div>
          </div>

          <div className="calls_group_stage">
            <button type="button" className="calls_group_nav">
              ←
            </button>
            <div className="calls_group_blob"></div>
            <div className="calls_group_members">
              {contact.participants?.map((participant) => (
                <article key={participant.id} className="calls_group_member">
                  <div className="calls_group_member_avatar">
                    <Image src={participant.avatar} alt={participant.name} fill className="calls_group_member_image" />
                  </div>
                  <h4>
                    {renderName(participant.name)} {participant.muted ? <span className="calls_muted_marker">•</span> : <MicIcon />}
                  </h4>
                  <p>{participant.role}</p>
                </article>
              ))}
            </div>
            <button type="button" className="calls_group_nav">
              →
            </button>
          </div>

          <div className="calls_status_text">{subtitle}</div>
          {liveControls}
        </>
      ) : null}

      {isStandardCentered ? (
        <>
          {screen === "outgoing" || screen === "incoming" ? (
            <div className="calls_status_head">
              <h2>{isGroup ? contact.name : ""}</h2>
              <p>{isGroup ? contact.role : ""}</p>
            </div>
          ) : null}

          <div className="calls_center_stage">
            <div className="calls_center_blob"></div>
            <div className="calls_center_avatar">
              {screen === "ended" && isGroup ? (
                <GroupIcon />
              ) : (
                <Image src={contact.avatar} alt={contact.name} width={128} height={128} />
              )}
            </div>
            {!isGroup || screen !== "ended" ? (
              <>
                <h3>
                  {screen === "incoming" && isGroup ? contact.incomingCaller ?? contact.name : contact.name} <MicIcon />
                </h3>
                <p>{contact.role}</p>
              </>
            ) : null}

            <div className="calls_status_text">
              {screen === "incoming" ? subtitle : screen === "outgoing" ? subtitle : subtitle}
            </div>

            {screen === "incoming" ? (
              <div className="calls_dual_actions">
                <button type="button" className="calls_answer_btn" onClick={openActive}>
                  <PhoneIcon />
                  <span>Answer</span>
                </button>
                <button type="button" className="calls_defer_btn" onClick={() => setScreen("rejected")}>
                  <PhoneIcon />
                  <span>Defer</span>
                </button>
              </div>
            ) : null}

            {screen === "rejected" ? (
              <div className="calls_dual_actions">
                <button type="button" className="calls_cancel_btn" onClick={() => router.push("/user/messages")}>
                  <span className="calls_cancel_mark">×</span>
                  <span>Cancel</span>
                </button>
                <button type="button" className="calls_answer_btn" onClick={restartCall}>
                  <PhoneIcon />
                  <span>Call Back</span>
                </button>
              </div>
            ) : null}

            {screen === "outgoing" || screen === "ended" ? liveControls : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
