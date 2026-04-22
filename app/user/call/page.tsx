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
      { id: "1", name: "Cameron Wilson", role: "Doctor", avatar: "/avatar-1.png" },
      { id: "2", name: "Jerome Bell", role: "Doctor", avatar: "/avatar-2.png" },
      { id: "3", name: "Brooklyn Simmons", role: "Doctor", avatar: "/icn/user_avatar.svg" },
      { id: "4", name: "Wade Warren", role: "Doctor", avatar: "/icn/Dr.Sarah.svg", muted: true, cameraOff: true },
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
  avatar: "/avatar-2.png",
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.56 5.72C7.18 5.11 8.17 5.08 8.82 5.65L10.76 7.34C11.42 7.92 11.58 8.88 11.14 9.64L10.16 11.32C11.18 13.25 12.75 14.82 14.68 15.84L16.36 14.86C17.12 14.42 18.08 14.58 18.66 15.24L20.35 17.18C20.92 17.83 20.89 18.82 20.28 19.44L18.94 20.78C18.3 21.42 17.37 21.67 16.49 21.45C7.99 19.27 4.73 16.01 2.55 7.51C2.33 6.63 2.58 5.7 3.22 5.06L4.56 3.72C5.18 3.11 6.17 3.08 6.82 3.65"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {crossed ? <path d="M5 5L19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : null}
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
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.5 8.5L20 6V18L15.5 15.5M6 18H14C15.1 18 16 17.1 16 16V8C16 6.9 15.1 6 14 6H6C4.9 6 4 6.9 4 8V16C4 17.1 4.9 18 6 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off ? <path d="M4.5 4.5L19.5 19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> : null}
    </svg>
  );
}

function RecordIcon() {
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8V12L14.75 14.75M12 3.75C16.56 3.75 20.25 7.44 20.25 12C20.25 16.56 16.56 20.25 12 20.25C7.44 20.25 3.75 16.56 3.75 12C3.75 7.44 7.44 3.75 12 3.75ZM9.5 2.5H14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
              ←
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
          </div>

          <div className="calls_group_video_body">
            <div className="calls_group_video_stage">
              {visibleParticipants.map((participant, index) => (
                <article key={participant.id} className={`calls_group_video_tile ${index === 0 ? "is_active" : ""}`}>
                  <Image src={participant.avatar} alt={participant.name} fill className="calls_group_video_tile_image" />
                  {index === 0 ? <span className="calls_group_video_badge">Active Speaker</span> : null}
                  <div className="calls_group_video_label">
                    <span>{participant.name}</span>
                    {participant.muted ? <MicIcon off /> : <MicIcon />}
                  </div>
                </article>
              ))}

              <div className="calls_group_video_self">
                <Image src={selfPreview.avatar} alt={selfPreview.name} fill className="calls_group_video_self_image" />
                <span>You</span>
              </div>
            </div>

            <aside className="calls_group_video_sidebar">
              <div className="calls_group_video_sidebar_head">
                <h3>Participants ({groupParticipants.length})</h3>
                <button type="button" onClick={() => router.push("/user/messages")}>
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
          {contact.remoteVisual ? <Image src={contact.remoteVisual} alt={contact.name} fill className="calls_remote_main_image" /> : null}
        </div>

        <div className="calls_self_preview">
          <Image src={selfPreview.avatar} alt={selfPreview.name} fill className="calls_self_preview_image" />
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
