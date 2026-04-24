'use client';

import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

type MessageAttachment = {
  name: string;
  size: string;
  url?: string;
};

type SharedAttachment = MessageAttachment & {
  id: number;
  author: string;
  time: string;
  text: string;
};

type GroupMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  avatarClassName?: string;
  isAdmin?: boolean;
};

type GroupSettingsView = "settings" | "members" | "notifications";

type ConsultationCandidate = {
  id: string;
  name: string;
  role: string;
  chipLabel: string;
  avatar?: string;
  avatarClassName?: string;
};

type MessageReply = {
  author: string;
  text: string;
};

type DeliveryStatus = "Sending..." | "Sent" | "Delivered" | "Read";

type MessageItem = {
  id: number;
  sender: "contact" | "me";
  author: string;
  text: string;
  time: string;
  read?: boolean;
  pinned?: boolean;
  pinnedTitle?: string;
  deliveryStatus?: DeliveryStatus;
  attachment?: MessageAttachment;
  attachments?: MessageAttachment[];
  replyTo?: MessageReply;
};

type Conversation = {
  id: string;
  name: string;
  role: string;
  status: "available" | "offline";
  isGroup?: boolean;
  groupDescription?: string;
  createdByMe?: boolean;
  notificationsMuted?: boolean;
  members?: GroupMember[];
  avatar?: string;
  avatarClassName?: string;
  preview: string;
  time: string;
  unreadCount: number;
  hasMessages: boolean;
  messages: MessageItem[];
};

type ContactInfoPanelData = {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  preferredLabel: string;
  statusText: string;
  daysActive: number;
};

type IncomingCallAlert = {
  conversationId: string;
  name: string;
  role: string;
  type: "audio" | "video";
  avatar: string;
};

const initialConversations: Conversation[] = [
  {
    id: "icu-team",
    name: "Surgery Experts",
    role: "Surgical cases discussions",
    status: "available",
    isGroup: true,
    groupDescription: "Surgical cases discussions",
    createdByMe: true,
    notificationsMuted: false,
    preview: "Updated pre-op protocol and case discussion notes",
    time: "10:42 AM",
    unreadCount: 0,
    hasMessages: true,
    members: [
      {
        id: "me",
        name: "Dr. Elena Rodriguez",
        role: "Lead Surgeon",
        avatar: "/icn/user_avatar.svg",
        isAdmin: true,
      },
      {
        id: "sarah",
        name: "Dr. Sarah Jenkins",
        role: "Surgery Lead",
        avatar: "/icn/Dr.Sarah.svg",
        isAdmin: true,
      },
      {
        id: "marcus",
        name: "Marcus Thorne",
        role: "Pharmacy Lead",
        avatar: "/avatar-2.png",
      },
      {
        id: "elena",
        name: "Dr. Aris",
        role: "Surgeon",
        avatar: "/avatar-1.png",
      },
    ],
    messages: [
      {
        id: 10,
        sender: "contact",
        author: "Dr. Aris",
        text: "Team, please ensure you review the updated sterilization sequence for ortho cases. All staff must sign off in the Documents tab before Monday's shift.",
        time: "09:12 AM",
        pinned: true,
        pinnedTitle: "Updated Pre-Op Protocol (v4.2)",
      },
      {
        id: 11,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "I've reviewed Buddy's latest bloodwork. His liver enzymes are slightly elevated, but consistent with his current medication protocol.",
        time: "10:42 AM",
      },
      {
        id: 12,
        sender: "contact",
        author: "Marcus Thorne",
        text: "Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.",
        time: "10:42 AM",
        attachments: [
          {
            name: "Blood_Panel_Bella.pdf",
            size: "2.4 MB",
          },
          {
            name: "Case_History_2026.csv",
            size: "156 KB",
          },
        ],
      },
      {
        id: 13,
        sender: "me",
        author: "Me",
        text: "He's eating well. We switched to the prescription diet this morning.",
        time: "11:30 AM",
        read: true,
        deliveryStatus: "Read",
      },
      {
        id: 14,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "Proceed with caution. Marcus, please prep the Isoflurane machine for Room 3. Sarah, let's meet at the scrub station in 10.",
        time: "10:42 AM",
      },
      {
        id: 15,
        sender: "me",
        author: "Me",
        text: "He's eating well. We switched to the prescription diet this morning.",
        time: "11:30 AM",
        deliveryStatus: "Delivered",
      },
    ],
  },
  {
    id: "sarah",
    name: "Dr. Sarah Jenkins",
    role: "Offline",
    status: "offline",
    avatar: "/icn/Dr.Sarah.svg",
    preview: "I've reviewed the ultrasound results...",
    time: "2m ago",
    unreadCount: 1,
    hasMessages: true,
    messages: [
      {
        id: 1,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "I've reviewed Buddy's latest blood work. His liver enzymes are slightly elevated, but consistent with his current medication protocol.",
        time: "10:42 AM",
      },
      {
        id: 2,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.",
        time: "10:42 AM",
        attachment: {
          name: "referral-history.csv",
          size: "248 KB",
        },
        pinned: true,
      },
      {
        id: 4,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "",
        time: "10:58 AM",
        attachment: {
          name: "Blood_Panel_Bella.pdf",
          size: "2.4 MB",
        },
      },
      {
        id: 5,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "",
        time: "11:04 AM",
        attachment: {
          name: "Case_History_2026.csv",
          size: "156 KB",
        },
      },
      {
        id: 6,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "Please review this image from the imaging room.",
        time: "11:12 AM",
        attachment: {
          name: "xray-preview.png",
          size: "1.8 MB",
          url: "/icn/xray.png",
        },
      },
      {
        id: 7,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "",
        time: "11:18 AM",
        attachment: {
          name: "post-op-walkthrough.mp4",
          size: "8.7 MB",
        },
      },
      {
        id: 3,
        sender: "me",
        author: "Me",
        text: "Thanks for sharing",
        time: "11:30 AM",
        read: true,
        replyTo: {
          author: "Dr. Sarah Jenkins",
          text: "Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.",
        },
      },
    ],
  },
  {
    id: "julian",
    name: "Dr. Julian Miller",
    role: "Available",
    status: "available",
    avatarClassName: "messages_avatar_julian",
    preview: "I've reviewed the ultrasound results...",
    time: "2m ago",
    unreadCount: 0,
    hasMessages: false,
    messages: [],
  },
  {
    id: "elena",
    name: "Nurse Elena Vance",
    role: "Available",
    status: "available",
    avatarClassName: "messages_avatar_elena",
    preview: "Sent a photo",
    time: "1h ago",
    unreadCount: 0,
    hasMessages: false,
    messages: [],
  },
  {
    id: "marcus",
    name: "Dr. Marcus Reed",
    role: "Available",
    status: "available",
    avatarClassName: "messages_avatar_marcus",
    preview: "The biopsy results should be in by Friday.",
    time: "3h ago",
    unreadCount: 0,
    hasMessages: false,
    messages: [],
  },
];

const contactInfoPanelDirectory: Record<string, ContactInfoPanelData> = {
  sarah: {
    title: "Dr. Sarah Jenkins",
    subtitle: "Specialist in Internal Medicine",
    phone: "+1 (555) 012-3456",
    email: "sarah.j@example.com",
    preferredLabel: "Preferred: Email",
    statusText: "Available for Consultation",
    daysActive: 5,
  },
  julian: {
    title: "Dr. Julian Miller",
    subtitle: "Specialist in Diagnostic Imaging",
    phone: "+1 (555) 019-2844",
    email: "julian.miller@example.com",
    preferredLabel: "Preferred: Phone",
    statusText: "Available for Consultation",
    daysActive: 3,
  },
  elena: {
    title: "Nurse Elena Vance",
    subtitle: "Senior patient care coordinator",
    phone: "+1 (555) 014-7821",
    email: "elena.vance@example.com",
    preferredLabel: "Preferred: Message",
    statusText: "Available now",
    daysActive: 7,
  },
  marcus: {
    title: "Dr. Marcus Reed",
    subtitle: "Specialist in Pathology",
    phone: "+1 (555) 011-4428",
    email: "marcus.reed@example.com",
    preferredLabel: "Preferred: Email",
    statusText: "Available for Consultation",
    daysActive: 4,
  },
};

const consultationCandidates: ConsultationCandidate[] = [
  {
    id: "aris",
    name: "Dr. Aris",
    role: "Surgeon",
    chipLabel: "Dr. Aris (Surgeon)",
    avatar: "/avatar-1.png",
  },
  {
    id: "sarah",
    name: "Sarah L.",
    role: "Tech",
    chipLabel: "Sarah L. (Tech)",
    avatar: "/icn/Dr.Sarah.svg",
  },
  {
    id: "james",
    name: "Dr. James Wilson",
    role: "Pharmacy Lead",
    chipLabel: "Dr. James Wilson",
    avatar: "/avatar-2.png",
  },
  {
    id: "elena",
    name: "Elena Rodriguez",
    role: "Anesthesia Tech",
    chipLabel: "Elena Rodriguez",
    avatar: "/icn/user_avatar.svg",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Pharmacy Lead",
    chipLabel: "Marcus Chen",
    avatarClassName: "messages_avatar_marcus",
  },
  {
    id: "patty",
    name: "Patty Vance",
    role: "Front Desk Admin",
    chipLabel: "Patty Vance",
    avatar: "/avatar-1.png",
  },
];

const groupDirectoryCandidates: GroupMember[] = [
  { id: "sarah-johnson", name: "Dr. Sarah Johnson", role: "Surgery", avatar: "/avatar-1.png" },
  { id: "sarah", name: "Dr. Sarah Jenkins", role: "General Practice", avatar: "/icn/Dr.Sarah.svg" },
  { id: "lisa-wong", name: "Dr. Lisa Wong", role: "General Practice", avatar: "/avatar-2.png" },
  { id: "marcus", name: "Marcus Thorne", role: "Pharmacy Lead", avatar: "/avatar-2.png" },
  { id: "elena", name: "Dr. Elena Rodriguez", role: "Specialist - Surgery", avatar: "/icn/user_avatar.svg" },
  { id: "aris", name: "Dr. Aris", role: "Surgeon", avatar: "/avatar-1.png" },
];

const getAttachmentExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  return extension || "file";
};

const getAttachmentTypeLabel = (fileName: string) => {
  const extension = getAttachmentExtension(fileName);
  const labels: Record<string, string> = {
    csv: "CSV Data",
    doc: "Word Document",
    docx: "Word Document",
    jpg: "Image",
    jpeg: "Image",
    pdf: "PDF Document",
    png: "Image",
    mov: "Video",
    mp4: "Video",
    webm: "Video",
    webp: "Image",
    xls: "Excel Sheet",
    xlsx: "Excel Sheet",
  };

  return labels[extension] ?? `${extension.toUpperCase()} File`;
};

const getAttachmentTone = (fileName: string) => {
  const extension = getAttachmentExtension(fileName);

  return extension === "pdf" ? "pdf" : "default";
};

const imageExtensions = new Set(["jpg", "jpeg", "png", "gif", "webp"]);
const videoExtensions = new Set(["mp4", "mov", "webm"]);
const pdfExtensions = new Set(["pdf"]);

const getAttachmentKind = (fileName: string) => {
  const extension = getAttachmentExtension(fileName);

  if (imageExtensions.has(extension)) {
    return "image";
  }

  if (videoExtensions.has(extension)) {
    return "video";
  }

  if (pdfExtensions.has(extension)) {
    return "pdf";
  }

  return "file";
};

const truncateAttachmentName = (fileName: string) =>
  fileName.length > 20 ? `${fileName.slice(0, 17)}...` : fileName;

function ContactAvatar({
  name,
  avatar,
  avatarClassName,
  large = false,
}: {
  name: string;
  avatar?: string;
  avatarClassName?: string;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`messages_avatar ${large ? "large" : ""} ${avatarClassName ?? ""}`}>
      {avatar ? <img src={avatar} alt={name} /> : <span>{initials}</span>}
    </div>
  );
}

function MessagePlaceholder({ mode }: { mode: "empty" | "search" | "files" }) {
  const title =
    mode === "search" ? "Search In This Chat" : mode === "files" ? "No Files Yet" : "No Messages Yet";
  const description =
    mode === "search"
      ? "Find messages and links shared in this chat."
      : mode === "files"
        ? "Shared files and attachments for this conversation will appear here."
        : "Send a message to start a conversation";

  return (
    <div className="messages_placeholder">
      <div className={`messages_placeholder_art ${mode}`}>
        {mode === "search" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none">
            <circle cx="35.5" cy="35.5" r="18.5" stroke="#9BA5AF" strokeWidth="4.5" />
            <path d="M48.582 48.582L63.5 63.5" stroke="#9BA5AF" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        ) : mode === "files" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none">
            <path d="M28 12.5H45.25L58.5 25.75V61C58.5 65.6944 54.6944 69.5 50 69.5H28C23.3056 69.5 19.5 65.6944 19.5 61V21C19.5 16.3056 23.3056 12.5 28 12.5Z" fill="#EFF4F6" stroke="#B9C4CB" strokeWidth="3" />
            <path d="M45 12.5V25.5H58" stroke="#B9C4CB" strokeWidth="3" strokeLinejoin="round" />
            <path d="M28.5 39.5H49.5" stroke="#9BA5AF" strokeWidth="3" strokeLinecap="round" />
            <path d="M28.5 49.5H41.5" stroke="#9BA5AF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" width="83" height="84" viewBox="0 0 83 84" fill="none">
  <path d="M3.78063 83.6712L0.012438 11.7698C-0.102701 9.57282 0.580993 7.65107 2.06352 6.00455C3.54605 4.35804 5.3858 3.47721 7.58279 3.36207L71.4951 0.0125697C73.6921 -0.102569 75.6138 0.581124 77.2604 2.06365C78.9069 3.54618 79.7877 5.38594 79.9028 7.58292L82.415 55.5172C82.5301 57.7141 81.8464 59.6359 80.3639 61.2824C78.8814 62.9289 77.0416 63.8097 74.8446 63.9249L18.9213 66.8557L3.78063 83.6712Z" fill="#006A6A" fillOpacity="0.3"/>
</svg>
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  // Group frames live in this page because they share the same sidebar, composer,
  // info panel, and conversation state as the one-to-one Messages flow.
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [groupCreateStep, setGroupCreateStep] = useState<"select" | "details" | "created">("select");
  const [groupSettingsView, setGroupSettingsView] = useState<GroupSettingsView | null>(null);
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>(["aris", "sarah", "james"]);
  const [groupName, setGroupName] = useState("Surgery Experts");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupMemberSearch, setGroupMemberSearch] = useState("");
  const [groupDirectorySearch, setGroupDirectorySearch] = useState("");
  const [isGroupDirectoryOpen, setIsGroupDirectoryOpen] = useState(false);
  const [groupImagePreview, setGroupImagePreview] = useState<string | null>(null);
  const [memberPendingRemoval, setMemberPendingRemoval] = useState<GroupMember | null>(null);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [newMessageSearch, setNewMessageSearch] = useState("");
  const [newMessageRecipientId, setNewMessageRecipientId] = useState("sarah");
  const [attachedFile, setAttachedFile] = useState<MessageAttachment | null>(null);
  const [replyingTo, setReplyingTo] = useState<MessageReply | null>(null);
  const [copiedToast, setCopiedToast] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploadHintVisible, setIsUploadHintVisible] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [openMessageActionsId, setOpenMessageActionsId] = useState<number | null>(null);
  const [modalPreviewAttachment, setModalPreviewAttachment] = useState<SharedAttachment | null>(null);
  const [typingConversationId] = useState<string | null>("sarah");
  const [incomingCallAlert, setIncomingCallAlert] = useState<IncomingCallAlert | null>({
    conversationId: "marcus",
    name: "John Michael Smith",
    role: "Head of Diagnostics",
    type: "audio",
    avatar: "/avatar-1.png",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const groupImageInputRef = useRef<HTMLInputElement | null>(null);
  const messageStatusTimeoutsRef = useRef<number[]>([]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  useEffect(() => {
    const timeoutIds = messageStatusTimeoutsRef.current;

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const openCallScreen = (type: "audio" | "video", conversation: Conversation | null = selectedConversation) => {
    if (!conversation) {
      return;
    }

    const params = new URLSearchParams({
      conversation: conversation.id,
      type,
      screen: conversation.isGroup ? "active" : type === "video" ? "active" : "outgoing",
    });

    router.push(`/user/call?${params.toString()}`);
  };

  const acceptIncomingCall = () => {
    if (!incomingCallAlert) {
      return;
    }

    const params = new URLSearchParams({
      conversation: incomingCallAlert.conversationId,
      type: incomingCallAlert.type,
      screen: "active",
    });

    setIncomingCallAlert(null);
    router.push(`/user/call?${params.toString()}`);
  };

  const selectedGroupMembers = useMemo<GroupMember[]>(
    () =>
      consultationCandidates
        .filter((candidate) => selectedGroupMemberIds.includes(candidate.id))
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          role: candidate.role,
          avatar: candidate.avatar,
          avatarClassName: candidate.avatarClassName,
        })),
    [selectedGroupMemberIds]
  );

  const filteredConsultationMembers = useMemo(() => {
    const query = groupMemberSearch.trim().toLowerCase();

    if (!query) {
      return consultationCandidates;
    }

    return consultationCandidates.filter((member) =>
      [member.name, member.role, member.chipLabel].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [groupMemberSearch]);

  const filteredGroupDirectory = useMemo(() => {
    const query = groupDirectorySearch.trim().toLowerCase();

    if (!query) {
      return groupDirectoryCandidates;
    }

    return groupDirectoryCandidates.filter((member) =>
      [member.name, member.role].some((value) => value.toLowerCase().includes(query))
    );
  }, [groupDirectorySearch]);

  const pinnedSidebarConversations = useMemo(
    () => conversations.filter((conversation) => conversation.isGroup || conversation.id === "julian"),
    [conversations]
  );

  const isMobileConversationView = Boolean(selectedConversation || isNewMessageOpen || isCreateGroupOpen);
  const isMobileListView = !isMobileConversationView;

  const allSidebarConversations = useMemo(
    () => conversations.filter((conversation) => !conversation.isGroup && conversation.id !== "julian"),
    [conversations]
  );

  const newMessageResults = useMemo(() => {
    if (!newMessageSearch.trim()) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(newMessageSearch.toLowerCase())
    );
  }, [conversations, newMessageSearch]);

  const filteredMessages = useMemo(() => {
    if (!selectedConversation) {
      return [];
    }

    if (!chatSearch.trim()) {
      return selectedConversation.messages;
    }

    return selectedConversation.messages.filter((message) =>
      message.text.toLowerCase().includes(chatSearch.toLowerCase())
    );
  }, [chatSearch, selectedConversation]);

  const sharedAttachments = useMemo<SharedAttachment[]>(() => {
    if (!selectedConversation) {
      return [];
    }

    return selectedConversation.messages.flatMap((message) => {
      const attachments = message.attachments ?? (message.attachment ? [message.attachment] : []);

      return attachments.map((attachment, index) => ({
        ...attachment,
        id: Number(`${message.id}${index}`),
        author: message.author,
        time: message.time,
        text: message.text,
      }));
    });
  }, [selectedConversation]);

  const selectedContactInfo = useMemo(() => {
    if (!selectedConversation || selectedConversation.isGroup) {
      return null;
    }

    return (
      contactInfoPanelDirectory[selectedConversation.id] ?? {
        title: selectedConversation.name,
        subtitle: selectedConversation.role,
        phone: "+1 (555) 010-0000",
        email: `${selectedConversation.name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "")}@example.com`,
        preferredLabel: "Preferred: Message",
        statusText: selectedConversation.status === "available" ? "Available now" : "Currently offline",
        daysActive: 1,
      }
    );
  }, [selectedConversation]);

  const isStandalonePanel = isNewMessageOpen || isCreateGroupOpen || !selectedConversation;
  const pinnedMessages = selectedConversation?.messages.filter((message) => message.pinned) ?? [];
  const isContactTyping = Boolean(selectedConversation && typingConversationId === selectedConversation.id);

  const resetGroupDraft = () => {
    setGroupCreateStep("select");
    setSelectedGroupMemberIds(["aris", "sarah", "james"]);
    setGroupName("Surgery Experts");
    setGroupDescription("");
    setGroupMemberSearch("");
    setGroupImagePreview(null);
  };

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest(".messages_actions_menu_wrap")) {
        setOpenMessageActionsId(null);
      }

      if (!(target instanceof Element) || !target.closest(".messages_sidebar_create_actions")) {
        setIsCreateMenuOpen(false);
      }

      if (!(target instanceof Element) || !target.closest(".messages_emoji_picker_wrap")) {
        setIsEmojiPickerOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMessageActionsId(null);
        setModalPreviewAttachment(null);
        setIsCreateMenuOpen(false);
        setIsEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!copiedToast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setCopiedToast("");
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [copiedToast]);

  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setActiveTab("chat");
    setIsSearchOpen(false);
    setIsInfoOpen(false);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
    setIsCreateMenuOpen(false);
    setGroupSettingsView(null);
    setMemberPendingRemoval(null);
    setIsLeaveGroupOpen(false);
    setChatSearch("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setIsEmojiPickerOpen(false);
    setOpenMessageActionsId(null);
    setModalPreviewAttachment(null);
  };

  const openNewMessage = () => {
    setIsNewMessageOpen(true);
    setIsCreateMenuOpen(false);
    setIsCreateGroupOpen(false);
    setGroupSettingsView(null);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setSelectedConversationId(null);
    setActiveTab("chat");
    setNewMessageSearch("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setModalPreviewAttachment(null);
  };

  const openCreateGroup = () => {
    resetGroupDraft();
    setIsCreateMenuOpen(false);
    setIsCreateGroupOpen(true);
    setGroupSettingsView(null);
    setIsNewMessageOpen(false);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setSelectedConversationId(null);
    setActiveTab("chat");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setModalPreviewAttachment(null);
  };

  const startNewConversation = (conversationId = newMessageRecipientId) => {
    setSelectedConversationId(conversationId);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
    setGroupSettingsView(null);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setModalPreviewAttachment(null);
  };

  const toggleSearch = () => {
    if (!selectedConversation) {
      return;
    }

    setActiveTab("chat");
    setIsSearchOpen((current) => !current);
    setIsInfoOpen(false);
    setChatSearch("");
  };

  const returnToConversationList = () => {
    setSelectedConversationId(null);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
    setIsCreateMenuOpen(false);
    setGroupSettingsView(null);
    setMemberPendingRemoval(null);
    setIsLeaveGroupOpen(false);
    setChatSearch("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setModalPreviewAttachment(null);
  };

  const toggleInfo = () => {
    if (!selectedConversation) {
      return;
    }

    setIsInfoOpen((current) => !current);
    setGroupSettingsView(null);
    setIsSearchOpen(false);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
  };

  const toggleGroupMember = (memberId: string) => {
    setSelectedGroupMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]
    );
  };

  const handleGroupImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setGroupImagePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const createGroupConversation = () => {
    const trimmedName = groupName.trim();
    const memberCount = selectedGroupMembers.length + 1;
    const newGroupId = `group-${Date.now()}`;
    const members: GroupMember[] = [
      {
        id: "me",
        name: "Dr. Elena Rodriguez",
        role: "Lead Surgeon",
        avatar: "/icn/user_avatar.svg",
        isAdmin: true,
      },
      ...selectedGroupMembers.map((member, index) => ({
        ...member,
        isAdmin: index === 0,
      })),
    ];

    // Group creation intentionally writes to the same conversations array used by chat.
    // That keeps the "Messages - new group" frame live immediately after creation.
    setConversations((current) => [
      {
        id: newGroupId,
        name: trimmedName || "New Care Group",
        role: `${memberCount} Members`,
        status: "available",
        isGroup: true,
        groupDescription: groupDescription.trim() || "Group created for care coordination and shared updates.",
        createdByMe: true,
        notificationsMuted: false,
        preview: "Group created. Say hello to your team.",
        time: "Now",
        unreadCount: 0,
        hasMessages: true,
        members,
        messages: [
          {
            id: Date.now(),
            sender: "me",
            author: "Me",
            text: "Group created. Say hello to your team.",
            time: "Now",
            read: true,
          },
        ],
      },
      ...current,
    ]);
    setSelectedConversationId(newGroupId);
    setGroupCreateStep("created");
  };

  const updateSelectedGroup = (updater: (conversation: Conversation) => Conversation) => {
    if (!selectedConversationId) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) => (conversation.id === selectedConversationId ? updater(conversation) : conversation))
    );
  };

  const removeGroupMember = (memberId: string) => {
    // Admin-only mutation for "Messages - Group Remove Member".
    updateSelectedGroup((conversation) => {
      const nextMembers = conversation.members?.filter((member) => member.id !== memberId) ?? [];

      return {
        ...conversation,
        members: nextMembers,
        role: `${nextMembers.length} Members`,
      };
    });
    setMemberPendingRemoval(null);
  };

  const toggleGroupNotifications = () => {
    updateSelectedGroup((conversation) => ({
      ...conversation,
      notificationsMuted: !conversation.notificationsMuted,
    }));
  };

  const toggleGroupDirectoryMember = (member: GroupMember) => {
    updateSelectedGroup((conversation) => {
      const members = conversation.members ?? [];
      const exists = members.some((entry) => entry.id === member.id);

      return {
        ...conversation,
        members: exists ? members.filter((entry) => entry.id !== member.id) : [...members, member],
        role: `${exists ? members.length - 1 : members.length + 1} Members`,
      };
    });
  };

  const openGroupSettings = (view: GroupSettingsView = "settings") => {
    if (!selectedConversation?.isGroup) {
      return;
    }

    setGroupSettingsView(view);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
    setActiveTab("chat");
  };

  const leaveSelectedGroup = () => {
    if (!selectedConversationId) {
      return;
    }

    setConversations((current) => current.filter((conversation) => conversation.id !== selectedConversationId));
    setSelectedConversationId(null);
    setIsInfoOpen(false);
    setIsLeaveGroupOpen(false);
  };

  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    if (size >= 1024) {
      return `${Math.round(size / 1024)} KB`;
    }

    return `${size} B`;
  };

  const storeAttachedFile = (file: File | null) => {
    if (!file) {
      return;
    }

    setAttachedFile({
      name: file.name,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file),
    });
    setIsUploadHintVisible(false);
    setIsDragActive(false);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    storeAttachedFile(file);
    event.target.value = "";
  };

  const togglePinnedMessage = (messageId: number) => {
    if (!selectedConversationId) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId ? { ...message, pinned: !message.pinned } : message
              ),
            }
          : conversation
      )
    );
  };

  const handleReply = (message: MessageItem) => {
    setReplyingTo({
      author: message.author,
      text: message.attachments?.length
        ? `${message.attachments[0].name} attached`
        : message.attachment
          ? `${message.attachment.name} attached`
          : message.text,
    });
    setOpenMessageActionsId(null);
  };

  const handleCopy = async (message: MessageItem) => {
    const payload = [
      message.text,
      message.attachments?.map((attachment) => `${attachment.name} (${attachment.size})`).join("\n") ??
        (message.attachment ? `${message.attachment.name} (${message.attachment.size})` : ""),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedToast("Copied Message Text");
    } catch {
      setCopiedToast("Copied Message Text");
    }

    setOpenMessageActionsId(null);
  };

  const handleDownloadAttachment = (attachment: MessageAttachment) => {
    const link = document.createElement("a");

    if (attachment.url) {
      link.href = attachment.url;
    } else {
      const fallbackFile = new Blob(
        [`${attachment.name}\n${attachment.size} • ${getAttachmentTypeLabel(attachment.name)}\nDemo attachment export.`],
        { type: "text/plain" }
      );

      link.href = URL.createObjectURL(fallbackFile);
    }

    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (link.href.startsWith("blob:")) {
      window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    }
  };

  const renderDownloadIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clipPath="url(#clip0_871_4177)">
    <path d="M9.87725 18.122C10.1559 18.4008 10.4867 18.6219 10.8508 18.7728C11.2149 18.9237 11.6051 19.0014 11.9992 19.0014C12.3934 19.0014 12.7836 18.9237 13.1477 18.7728C13.5118 18.6219 13.8426 18.4008 14.1212 18.122L17.3322 14.911C17.5044 14.7206 17.5968 14.4713 17.5902 14.2147C17.5836 13.958 17.4786 13.7138 17.2969 13.5325C17.1151 13.3512 16.8707 13.2467 16.614 13.2406C16.3574 13.2346 16.1083 13.3274 15.9182 13.5L12.9922 16.427L12.9992 1C12.9992 0.734784 12.8939 0.48043 12.7064 0.292893C12.5188 0.105357 12.2645 0 11.9992 0V0C11.734 0 11.4797 0.105357 11.2921 0.292893C11.1046 0.48043 10.9992 0.734784 10.9992 1L10.9902 16.408L8.08025 13.5C7.89261 13.3125 7.63817 13.2072 7.3729 13.2073C7.10763 13.2074 6.85326 13.3129 6.66575 13.5005C6.47824 13.6881 6.37295 13.9426 6.37305 14.2079C6.37314 14.4731 6.47861 14.7275 6.66625 14.915L9.87725 18.122Z" fill="#033E4F"/>
    <path d="M23 16C22.7348 16 22.4804 16.1054 22.2929 16.2929C22.1054 16.4804 22 16.7348 22 17V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22H3C2.73478 22 2.48043 21.8946 2.29289 21.7071C2.10536 21.5196 2 21.2652 2 21V17C2 16.7348 1.89464 16.4804 1.70711 16.2929C1.51957 16.1054 1.26522 16 1 16C0.734784 16 0.48043 16.1054 0.292893 16.2929C0.105357 16.4804 0 16.7348 0 17L0 21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H21C21.7956 24 22.5587 23.6839 23.1213 23.1213C23.6839 22.5587 24 21.7956 24 21V17C24 16.7348 23.8946 16.4804 23.7071 16.2929C23.5196 16.1054 23.2652 16 23 16Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_871_4177">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );

  const renderPreviewIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clipPath="url(#clip0_841_6955)">
    <path d="M17.4527 7.06421C16.2894 5.16971 13.6434 1.99121 8.99943 1.99121C4.35543 1.99121 1.70943 5.16971 0.546178 7.06421C0.186574 7.64584 -0.00390625 8.31614 -0.00390625 8.99996C-0.00390625 9.68378 0.186574 10.3541 0.546178 10.9357C1.70943 12.8302 4.35543 16.0087 8.99943 16.0087C13.6434 16.0087 16.2894 12.8302 17.4527 10.9357C17.8123 10.3541 18.0028 9.68378 18.0028 8.99996C18.0028 8.31614 17.8123 7.64584 17.4527 7.06421V7.06421ZM16.1739 10.1505C15.1749 11.775 12.9137 14.5087 8.99943 14.5087C5.08518 14.5087 2.82393 11.775 1.82493 10.1505C1.61128 9.80475 1.49812 9.40637 1.49812 8.99996C1.49812 8.59356 1.61128 8.19518 1.82493 7.84946C2.82393 6.22496 5.08518 3.49121 8.99943 3.49121C12.9137 3.49121 15.1749 6.22196 16.1739 7.84946C16.3876 8.19518 16.5007 8.59356 16.5007 8.99996C16.5007 9.40637 16.3876 9.80475 16.1739 10.1505V10.1505Z" fill="#374957"/>
    <path d="M9 5.25C8.25832 5.25 7.5333 5.46993 6.91661 5.88199C6.29993 6.29404 5.81928 6.87971 5.53545 7.56494C5.25162 8.25016 5.17736 9.00416 5.32206 9.73159C5.46675 10.459 5.8239 11.1272 6.34835 11.6517C6.8728 12.1761 7.54098 12.5333 8.26841 12.6779C8.99584 12.8226 9.74984 12.7484 10.4351 12.4645C11.1203 12.1807 11.706 11.7001 12.118 11.0834C12.5301 10.4667 12.75 9.74168 12.75 9C12.7488 8.0058 12.3533 7.05267 11.6503 6.34967C10.9473 5.64666 9.9942 5.25119 9 5.25V5.25ZM9 11.25C8.55499 11.25 8.11998 11.118 7.74997 10.8708C7.37996 10.6236 7.09157 10.2722 6.92127 9.86104C6.75098 9.4499 6.70642 8.9975 6.79323 8.56105C6.88005 8.12459 7.09434 7.72368 7.40901 7.40901C7.72368 7.09434 8.12459 6.88005 8.56105 6.79323C8.99751 6.70642 9.44991 6.75097 9.86104 6.92127C10.2722 7.09157 10.6236 7.37996 10.8708 7.74997C11.118 8.11998 11.25 8.55499 11.25 9C11.25 9.59674 11.0129 10.169 10.591 10.591C10.169 11.0129 9.59674 11.25 9 11.25Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_841_6955">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );

  const getAttachmentDateLabel = (attachment: SharedAttachment) => {
    const labels: Record<string, string> = {
      "Blood_Panel_Bella.pdf-10:58 AM": "Yesterday",
      "Case_History_2026.csv-11:04 AM": "2 Days Ago",
      "referral-history.csv-10:42 AM": "09/03/2026",
      "Blood_Panel_Bella.pdf-10:42 AM": "06/03/2026",
    };

    return labels[`${attachment.name}-${attachment.time}`] ?? attachment.time;
  };

  const renderAttachmentIcon = (attachment: MessageAttachment) => {
    const extension = getAttachmentExtension(attachment.name);

    if (extension === "pdf") {
      return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M7 10.5H8V8.5H9C9.28333 8.5 9.52083 8.40417 9.7125 8.2125C9.90417 8.02083 10 7.78333 10 7.5V6.5C10 6.21667 9.90417 5.97917 9.7125 5.7875C9.52083 5.59583 9.28333 5.5 9 5.5H7V10.5ZM8 7.5V6.5H9V7.5H8ZM11 10.5H13C13.2833 10.5 13.5208 10.4042 13.7125 10.2125C13.9042 10.0208 14 9.78333 14 9.5V6.5C14 6.21667 13.9042 5.97917 13.7125 5.7875C13.5208 5.59583 13.2833 5.5 13 5.5H11V10.5ZM12 9.5V6.5H13V9.5H12ZM15 10.5H16V8.5H17V7.5H16V6.5H17V5.5H15V10.5ZM6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6ZM6 14H18V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H16V20H2ZM6 2V14V2Z" fill="#E4432D"/>
</svg>;
    }

    if (getAttachmentKind(attachment.name) === "video") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="3.75" y="6.25" width="22.5" height="17.5" rx="3" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12.5 11.25L19.375 15L12.5 18.75V11.25Z" fill="currentColor" />
        </svg>
      );
    }

    return (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
  <path d="M4 16H12V14H4V16ZM4 12H12V10H4V12ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H10L16 6V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM9 7V2H2V18H14V7H9ZM2 2V7V2V7V18V2Z" fill="#033E4F"/>
</svg>
    );
  };

  const renderAttachmentCard = (attachment: MessageAttachment | SharedAttachment, className = "") => (
    <div
      className={`messages_attachment_card ${getAttachmentKind(attachment.name) !== "file" ? "previewable" : ""} ${className}`}
      role={getAttachmentKind(attachment.name) !== "file" ? "button" : undefined}
      tabIndex={getAttachmentKind(attachment.name) !== "file" ? 0 : undefined}
      onClick={() => {
        if (getAttachmentKind(attachment.name) !== "file") {
          setModalPreviewAttachment(attachment as SharedAttachment);
        }
      }}
      onKeyDown={(event) => {
        if (getAttachmentKind(attachment.name) !== "file" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setModalPreviewAttachment(attachment as SharedAttachment);
        }
      }}
    >
      <div className={`messages_attachment_icon ${getAttachmentTone(attachment.name)}`} aria-hidden="true">
        {renderAttachmentIcon(attachment)}
      </div>
      <div className="messages_attachment_details">
        <strong title={attachment.name}>{truncateAttachmentName(attachment.name)}</strong>
        <span>
          {attachment.size} &bull; {getAttachmentTypeLabel(attachment.name)}
        </span>
      </div>
      <button
        type="button"
        className="messages_attachment_download"
        onClick={(event) => {
          event.stopPropagation();
          handleDownloadAttachment(attachment);
        }}
        aria-label={`Download ${attachment.name}`}
      >
        {renderDownloadIcon()}
      </button>
    </div>
  );

  const renderPreviewModal = () => {
    if (!modalPreviewAttachment) {
      return null;
    }

    return (
      <div className="messages_preview_modal" role="dialog" aria-modal="true">
        <div className="messages_preview_backdrop" onClick={() => setModalPreviewAttachment(null)}></div>
        <div className="messages_preview_dialog">
          <button
            type="button"
            className="messages_preview_close"
            onClick={() => setModalPreviewAttachment(null)}
            aria-label="Close preview"
          >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clipPath="url(#clip0_871_8725)">
    <path d="M15.9994 8.00031C15.8119 7.81284 15.5576 7.70752 15.2924 7.70752C15.0273 7.70752 14.773 7.81284 14.5854 8.00031L11.9995 10.5863L9.41346 8.00031C9.22486 7.81815 8.97226 7.71735 8.71006 7.71963C8.44786 7.72191 8.19705 7.82708 8.01164 8.01249C7.82623 8.1979 7.72107 8.44871 7.71879 8.7109C7.71651 8.9731 7.8173 9.2257 7.99946 9.41431L10.5855 12.0003L7.99946 14.5863C7.8173 14.7749 7.71651 15.0275 7.71879 15.2897C7.72107 15.5519 7.82623 15.8027 8.01164 15.9881C8.19705 16.1735 8.44786 16.2787 8.71006 16.281C8.97226 16.2833 9.22486 16.1825 9.41346 16.0003L11.9995 13.4143L14.5854 16.0003C14.7741 16.1825 15.0267 16.2833 15.2888 16.281C15.551 16.2787 15.8019 16.1735 15.9873 15.9881C16.1727 15.8027 16.2778 15.5519 16.2801 15.2897C16.2824 15.0275 16.1816 14.7749 15.9994 14.5863L13.4135 12.0003L15.9994 9.41431C16.1869 9.22678 16.2922 8.97247 16.2922 8.70731C16.2922 8.44214 16.1869 8.18783 15.9994 8.00031Z" fill="#033E4F"/>
    <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_871_8725">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
</svg>
          </button>
          {renderMediaPreview(modalPreviewAttachment)}
        </div>
      </div>
    );
  };

  const renderMediaPreview = (attachment: SharedAttachment) => {
    const kind = getAttachmentKind(attachment.name);

    if (kind === "image") {
      return (
        <div className="messages_media_preview image_view">
          <div className="messages_media_preview_head">
          
            <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
              {renderDownloadIcon()}
               
            </button>
          </div>
          <div className="messages_image_stage">
            {attachment.url ? (
              <img src={attachment.url} alt={attachment.name} />
            ) : (
              <div className="messages_missing_media">Image preview unavailable</div>
            )}
          </div>
        </div>
      );
    }

    if (kind === "video") {
      return (
        <div className="messages_media_preview video_view">
          <div className="messages_media_preview_head">
       
            <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
              {renderDownloadIcon()}
               
            </button>
          </div>
          <div className="messages_video_stage">
            {attachment.url ? (
              <video src={attachment.url} controls preload="metadata" />
            ) : (
              <div className="messages_video_placeholder">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                    <circle cx="21" cy="21" r="20" fill="#033E4F" />
                    <path d="M17.5 13.75L29.167 21L17.5 28.25V13.75Z" fill="white" />
                  </svg>
                </span>
                <h4>Video preview ready</h4>
                <p>Upload or attach a real video file to play it here. This demo item can still be downloaded.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (kind === "pdf") {
      return (
        <div className="messages_media_preview pdf_view">
          <div className="messages_media_preview_head">
       
            <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
              {renderDownloadIcon()}
               
            </button>
          </div>
          <div className="messages_pdf_stage">
            {attachment.url ? (
              <iframe
                src={attachment.url}
                title={attachment.name}
                className="messages_pdf_frame"
              />
            ) : (
              <div className="messages_missing_media">
                PDF preview unavailable. Attach a real PDF URL to render it here, or download the document.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="messages_media_preview file_view">
        <div className="messages_media_preview_head">
         
          <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
            {renderDownloadIcon()}
             
          </button>
        </div>
        <div className="messages_file_preview_stage">
          <div className={`messages_attachment_icon ${getAttachmentTone(attachment.name)}`} aria-hidden="true">
            {renderAttachmentIcon(attachment)}
          </div>
          <div className="messages_file_preview_copy">
            <h4>{attachment.name}</h4>
            <p>{attachment.text || "Preview this shared file, or download it to inspect the full document contents."}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderFileListItem = (attachment: SharedAttachment) => (
    <article key={attachment.id} className="messages_file_list_item">
      <div className={`messages_attachment_icon ${getAttachmentTone(attachment.name)}`} aria-hidden="true">
        {renderAttachmentIcon(attachment)}
      </div>
      <div className="messages_file_list_copy">
        <strong title={attachment.name}>{truncateAttachmentName(attachment.name)}</strong>
        <span>
          {attachment.size} &bull; {getAttachmentTypeLabel(attachment.name)} &bull; {getAttachmentDateLabel(attachment)}
        </span>
      </div>
      <div className="messages_file_list_actions">
        <button
          type="button"
          className="messages_file_action_btn"
          aria-label={`Preview ${attachment.name}`}
          onClick={() => setModalPreviewAttachment(attachment)}
        >
          {renderPreviewIcon()}
        </button>
        <button
          type="button"
          className="messages_file_action_btn"
          aria-label={`Download ${attachment.name}`}
          onClick={() => handleDownloadAttachment(attachment)}
        >
          {renderDownloadIcon()}
        </button>
      </div>
    </article>
  );

  const renderFilesPanel = () => {
    const fileAttachments = sharedAttachments.filter((attachment) => getAttachmentKind(attachment.name) === "file");

    if (sharedAttachments.length === 0) {
      return <MessagePlaceholder mode="files" />;
    }

    return (
      <div className="messages_files_view">
        <div className="messages_files_head">
          <div>
            <span>Messages - File view</span>
            <h3>Shared Files</h3>
            <p>Documents, images, and videos shared in this conversation.</p>
          </div>
          <strong>{sharedAttachments.length} items</strong>
        </div>

        <div className="messages_files_list">{fileAttachments.map((attachment) => renderFileListItem(attachment))}</div>
      </div>
    );
  };

  const sendMessage = () => {
    const trimmedMessage = draftMessage.trim();
    const messageId = Date.now();

    if ((!trimmedMessage && !attachedFile) || !selectedConversationId) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              hasMessages: true,
              preview: trimmedMessage,
              time: "Now",
              unreadCount: 0,
              messages: [
                ...conversation.messages,
                {
                  id: messageId,
                  sender: "me",
                  author: "Me",
                  text: trimmedMessage,
                  time: "Now",
                  read: true,
                  deliveryStatus: "Sending...",
                  attachment: attachedFile ?? undefined,
                  replyTo: replyingTo ?? undefined,
                },
              ],
            }
          : conversation
      )
    );

    setDraftMessage("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setIsSearchOpen(false);
    setIsInfoOpen(false);
    setIsEmojiPickerOpen(false);
    setActiveTab("chat");

    const deliveryStatuses: DeliveryStatus[] = ["Sent", "Delivered", "Read"];

    const statusTimeouts = deliveryStatuses.map((status, index) =>
      window.setTimeout(() => {
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === selectedConversationId
              ? {
                  ...conversation,
                  messages: conversation.messages.map((message) =>
                    message.id === messageId ? { ...message, deliveryStatus: status } : message
                  ),
                }
              : conversation
          )
        );
      }, 2000 * (index + 1))
    );

    messageStatusTimeoutsRef.current.push(...statusTimeouts);
  };

  const addEmojiToDraft = (emojiData: EmojiClickData) => {
    setDraftMessage((current) => `${current}${emojiData.emoji}`);
    setIsEmojiPickerOpen(false);
  };

  const renderSidebarConversation = (conversation: Conversation, options?: { pinned?: boolean }) => {
    const isActive = selectedConversationId === conversation.id;

    return (
      <button
        type="button"
        key={conversation.id}
        className={`messages_conversation_item ${isActive ? "active" : ""} ${
          conversation.isGroup ? "group_item" : ""
        }`}
        onClick={() => selectConversation(conversation.id)}
      >
        <div className="messages_conversation_avatar">
          {conversation.isGroup ? (
            <div className="messages_group_avatar" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M20.182 16.6201C21.906 15.3381 23.03 13.2921 23.03 10.9831C23.03 7.1071 19.877 3.9541 16.001 3.9541C12.125 3.9541 8.97199 7.1071 8.97199 10.9831C8.97199 13.2921 10.096 15.3381 11.82 16.6201C8.74699 17.6531 6.52499 20.5551 6.52499 23.9711V24.9511C6.52499 26.1131 7.34999 27.1151 8.48699 27.3331C10.958 27.8061 13.486 28.0451 16.002 28.0451C18.518 28.0451 21.046 27.8051 23.518 27.3331C24.654 27.1151 25.479 26.1131 25.479 24.9511V23.9711C25.477 20.5551 23.254 17.6531 20.182 16.6201ZM10.771 10.9831C10.771 8.1001 13.117 5.7541 16 5.7541C18.883 5.7541 21.229 8.1001 21.229 10.9831C21.229 13.8661 18.883 16.2121 16 16.2121C13.117 16.2121 10.771 13.8671 10.771 10.9831ZM23.676 24.9511C23.676 25.2511 23.466 25.5101 23.177 25.5651C18.458 26.4671 13.541 26.4671 8.82399 25.5651C8.53399 25.5091 8.32399 25.2511 8.32399 24.9511V23.9711C8.32399 20.6851 10.997 18.0121 14.282 18.0121H17.718C21.003 18.0121 23.676 20.6851 23.676 23.9711V24.9511Z" fill="#033E4F"/>
  <path d="M27.059 16.2967C28.241 15.2227 28.96 13.6757 28.96 12.0287C28.96 9.65266 27.531 7.55366 25.32 6.68166C24.86 6.50066 24.336 6.72566 24.153 7.18866C23.97 7.65066 24.197 8.17366 24.66 8.35566C26.179 8.95466 27.159 10.3967 27.159 12.0277C27.159 13.6527 26.141 15.1347 24.627 15.7177C24.243 15.8657 24.008 16.2547 24.057 16.6637C24.105 17.0727 24.425 17.3957 24.832 17.4497C27.065 17.7447 29.1 20.0607 29.1 22.3077V23.0777C29.1 23.2247 28.996 23.3577 28.854 23.3857C28.677 23.4207 28.493 23.4527 28.303 23.4857L27.919 23.5527C27.43 23.6417 27.106 24.1097 27.194 24.5987C27.273 25.0337 27.652 25.3377 28.079 25.3377C28.133 25.3377 28.186 25.3327 28.241 25.3227L28.607 25.2587C28.813 25.2227 29.014 25.1887 29.204 25.1507C30.186 24.9577 30.9 24.0857 30.9 23.0777V22.3077C30.9 19.8267 29.274 17.4297 27.059 16.2967Z" fill="#033E4F"/>
  <path d="M4.08101 23.5551L3.69701 23.4881C3.50801 23.4551 3.32301 23.4241 3.14301 23.3871C3.00501 23.3601 2.90001 23.2281 2.90001 23.0801V22.3101C2.90001 20.0631 4.93401 17.7471 7.16801 17.4521C7.57501 17.3981 7.89601 17.0751 7.94301 16.6661C7.99201 16.2571 7.75601 15.8681 7.37301 15.7201C5.85801 15.1371 4.84101 13.6541 4.84101 12.0301C4.84101 10.3981 5.82101 8.95605 7.34001 8.35805C7.80301 8.17505 8.02901 7.65205 7.84701 7.19005C7.66401 6.72705 7.13901 6.50105 6.68001 6.68305C4.46901 7.55505 3.04001 9.65405 3.04001 12.0301C3.04001 13.6761 3.76001 15.2241 4.94101 16.2981C2.72601 17.4301 1.10001 19.8271 1.10001 22.3101V23.0801C1.10001 24.0881 1.81401 24.9601 2.79301 25.1521C2.98501 25.1911 3.18701 25.2251 3.39301 25.2611L3.75901 25.3251C3.81401 25.3351 3.86701 25.3401 3.92101 25.3401C4.34801 25.3401 4.72701 25.0351 4.80601 24.6011C4.89501 24.1121 4.57001 23.6441 4.08101 23.5551Z" fill="#033E4F"/>
</svg>
            </div>
          ) : (
            <>
              <ContactAvatar
                name={conversation.name}
                avatar={conversation.avatar}
                avatarClassName={conversation.avatarClassName}
              />
              <span
                className={`messages_presence_dot ${
                  conversation.status === "available" ? "available" : "offline"
                }`}
              />
            </>
          )}
        </div>

        <div className="messages_conversation_content">
          <div className="messages_conversation_row">
            <h3>
              {conversation.name}
              {options?.pinned ? (
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_462_12680)">
    <path d="M15.817 5.48635C15.1196 4.78901 11.1278 0.797289 10.5136 0.18307C10.2695 -0.0610234 9.87377 -0.0610234 9.6297 0.18307C9.38564 0.427164 9.38564 0.822883 9.6297 1.06695L10.0717 1.50891L6.75017 4.83041C5.9213 4.66632 5.06095 4.69004 4.2408 4.90188C3.27267 5.15195 2.38536 5.6597 1.6748 6.37029C1.4307 6.61435 1.43074 7.01007 1.6748 7.25416L4.76839 10.3478L0.183016 14.9331C-0.0610461 15.1771 -0.0610461 15.5729 0.183016 15.8169C0.427079 16.061 0.822829 16.061 1.06692 15.8169L5.65224 11.2316L8.7458 14.3252C8.86786 14.4473 9.02777 14.5083 9.18777 14.5083C9.3477 14.5083 9.50767 14.4472 9.62973 14.3252C10.3403 13.6146 10.848 12.7273 11.0981 11.7592C11.31 10.939 11.3337 10.0787 11.1696 9.24982L14.4911 5.92829L14.933 6.37023C15.177 6.61429 15.5728 6.61432 15.8169 6.37023C16.061 6.12616 16.061 5.73045 15.817 5.48635ZM10.0406 8.61101C9.88289 8.76876 9.8212 8.99866 9.87873 9.2142C10.2266 10.5167 9.94911 11.9039 9.1558 12.9674L6.09433 9.90591L6.09424 9.90579C6.09424 9.90579 6.09417 9.90573 6.09411 9.90569L3.03261 6.8442C4.09608 6.05088 5.48336 5.77345 6.7858 6.12126C7.00133 6.17882 7.23124 6.11713 7.38902 5.95935L10.9556 2.39276L13.6072 5.04438L10.0406 8.61101Z" fill="#E4432D"/>
  </g>
  <defs>
    <clipPath id="clip0_462_12680">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
              ) : null}
            </h3>
            {!conversation.isGroup ? (
              <span className={conversation.unreadCount > 0 ? "unread_time" : ""}>{conversation.time}</span>
            ) : null}
          </div>
          <div className="messages_conversation_row">
            {conversation.isGroup ? (
              <div className="messages_group_meta">
                <p>{conversation.preview}</p>
                <span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
  <g clipPath="url(#clip0_817_9427)">
    <path d="M6.5 6.5C7.14279 6.5 7.77114 6.30939 8.3056 5.95228C8.84006 5.59516 9.25662 5.08758 9.50261 4.49372C9.74859 3.89986 9.81295 3.2464 9.68755 2.61596C9.56215 1.98552 9.25262 1.40643 8.7981 0.951904C8.34358 0.497384 7.76448 0.187851 7.13404 0.0624493C6.50361 -0.0629527 5.85014 0.00140818 5.25628 0.247393C4.66242 0.493378 4.15484 0.909938 3.79772 1.4444C3.44061 1.97886 3.25 2.60721 3.25 3.25C3.25086 4.11169 3.59355 4.93784 4.20285 5.54715C4.81216 6.15646 5.63831 6.49914 6.5 6.5ZM6.5 1.08333C6.92853 1.08333 7.34743 1.21041 7.70374 1.44848C8.06004 1.68656 8.33775 2.02495 8.50174 2.42085C8.66573 2.81676 8.70864 3.25241 8.62504 3.6727C8.54143 4.09299 8.33508 4.47905 8.03206 4.78207C7.72905 5.08508 7.34299 5.29144 6.9227 5.37504C6.5024 5.45864 6.06676 5.41573 5.67085 5.25174C5.27495 5.08775 4.93656 4.81004 4.69848 4.45374C4.46041 4.09743 4.33333 3.67853 4.33333 3.25C4.33333 2.67537 4.56161 2.12427 4.96794 1.71794C5.37426 1.31161 5.92536 1.08333 6.5 1.08333V1.08333Z" fill="#374957"/>
    <path d="M6.5 7.58398C5.20751 7.58542 3.96837 8.09949 3.05444 9.01342C2.14051 9.92735 1.62643 11.1665 1.625 12.459C1.625 12.6026 1.68207 12.7404 1.78365 12.842C1.88523 12.9436 2.02301 13.0007 2.16667 13.0007C2.31033 13.0007 2.4481 12.9436 2.54968 12.842C2.65126 12.7404 2.70833 12.6026 2.70833 12.459C2.70833 11.4534 3.10781 10.4889 3.81889 9.77787C4.52996 9.0668 5.49439 8.66732 6.5 8.66732C7.50561 8.66732 8.47004 9.0668 9.18111 9.77787C9.89219 10.4889 10.2917 11.4534 10.2917 12.459C10.2917 12.6026 10.3487 12.7404 10.4503 12.842C10.5519 12.9436 10.6897 13.0007 10.8333 13.0007C10.977 13.0007 11.1148 12.9436 11.2164 12.842C11.3179 12.7404 11.375 12.6026 11.375 12.459C11.3736 11.1665 10.8595 9.92735 9.94556 9.01342C9.03163 8.09949 7.79249 7.58542 6.5 7.58398V7.58398Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_817_9427">
      <rect width="13" height="13" fill="white"/>
    </clipPath>
  </defs>
</svg>
                  {conversation.role}
                </span>
                <span>{conversation.time}</span>
              </div>
            ) : (
              <p>{conversation.preview}</p>
            )}
            {conversation.unreadCount > 0 ? (
              <span className="messages_unread_badge">{conversation.unreadCount}</span>
            ) : null}
          </div>
        </div>
      </button>
    );
  };

  // Implements: Messages - Create Group, Messages - fill group details,
  // Messages - group created. Kept as one renderer so step transitions remain obvious.
  const renderCreateGroupPanel = () => {
    const canContinue = selectedGroupMemberIds.length > 0;
    const canCreate = groupName.trim().length > 0 && canContinue;
    const participantCount = selectedGroupMemberIds.length;
    const selectedChipMembers = consultationCandidates.filter(
      (member) => ["aris", "sarah"].includes(member.id) && selectedGroupMemberIds.includes(member.id)
    );
    const suggestedMembers = filteredConsultationMembers.filter((member) => !["aris", "sarah"].includes(member.id));

    if (groupCreateStep === "created") {
      return (
        <div className="messages_group_flow">
          <div className="messages_group_success">
            <div className="messages_group_success_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="21" fill="#9CEDED" />
                <path d="M12.5 21.5L18.25 27.25L30 15.5" stroke="#033E4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Messages - group created</span>
            <h3>{groupName || selectedConversation?.name || "New Group"} Created</h3>
            <p>Your care team group is ready. You can open the group chat or adjust group settings.</p>
            <div className="messages_group_flow_actions">
              <button
                type="button"
                className="kinnect-btn-primary"
                onClick={() => {
                  setIsCreateGroupOpen(false);
                  setIsInfoOpen(false);
                }}
              >
                Open New Group
              </button>
              <button
                type="button"
                className="kinnect-btn-secondary"
                onClick={() => {
                  setIsCreateGroupOpen(false);
                  setIsInfoOpen(true);
                }}
              >
                Group Info
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="messages_group_flow">
        <div className="messages_consult_group_head">
          <div>
            <h3>New Consultation Group</h3>
            <p>Surgical Case Configuration</p>
          </div>
          <button type="button" onClick={() => setIsCreateGroupOpen(false)} aria-label="Close create group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 4.5L13.5 13.5" stroke="#191C1D" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M13.5 4.5L4.5 13.5" stroke="#191C1D" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="messages_consult_group_body">
          <button
            type="button"
            className="messages_group_photo_upload"
            onClick={() => groupImageInputRef.current?.click()}
            aria-label="Upload consultation group image"
          >
            {groupImagePreview ? (
              <img src={groupImagePreview} alt="Group upload preview" className="messages_group_photo_preview" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">
                <path d="M4.5 7.5H9.1L11.1 4.5H17.8L19.8 7.5H24.5C26.157 7.5 27.5 8.843 27.5 10.5V21C27.5 22.657 26.157 24 24.5 24H4.5C2.843 24 1.5 22.657 1.5 21V10.5C1.5 8.843 2.843 7.5 4.5 7.5Z" stroke="#033E4F" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="14.5" cy="15.75" r="4.25" stroke="#033E4F" strokeWidth="2" />
                <path d="M24.5 3V8" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 5.5H27" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 8.75L8.75 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6.75 2H8.75V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <input ref={groupImageInputRef} type="file" accept="image/*" hidden onChange={handleGroupImageChange} />

          <div className="messages_consult_group_fields">
            <label>
              Group Name <span>*</span>
              <input value={groupName} onChange={(event) => setGroupName(event.target.value)} />
            </label>
            <label>
              Short Description
              <textarea value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)} />
            </label>
          </div>
        </div>

        <div className="messages_consult_member_head">
          <span>Select Members</span>
          <strong>{participantCount} Participants Selected</strong>
        </div>

        <div className="messages_consult_search">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M15.5 15.5L11.95 11.95M13.875 7.688C13.875 11.106 11.106 13.875 7.688 13.875C4.269 13.875 1.5 11.106 1.5 7.688C1.5 4.269 4.269 1.5 7.688 1.5C11.106 1.5 13.875 4.269 13.875 7.688Z" stroke="#71787C" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search by name, role, or specialty..."
            value={groupMemberSearch}
            onChange={(event) => setGroupMemberSearch(event.target.value)}
          />
        </div>

        <div className="messages_consult_selected_list">
          {selectedChipMembers.map((member) => (
            <button type="button" key={member.id} className="selected" onClick={() => toggleGroupMember(member.id)}>
              <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
              <span>{member.chipLabel}</span>
              <strong aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2L8 8" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 2L2 8" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </strong>
            </button>
          ))}
        </div>

        <div className="messages_consult_suggested_head">Suggested for Surgical Teams</div>

        <div className="messages_consult_member_grid">
          {suggestedMembers.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  className={selectedGroupMemberIds.includes(member.id) ? "selected" : ""}
                  onClick={() => toggleGroupMember(member.id)}
                >
                  <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
                  <div>
                    <h4>{member.name}</h4>
                    <span>{member.role}</span>
                  </div>
                  <strong aria-hidden="true">
                    {selectedGroupMemberIds.includes(member.id) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1.5 4.5L4.5 7.5L9.5 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </strong>
                </button>
          ))}
        </div>

        <div className="messages_consult_actions">
          <button type="button" disabled={!canCreate} onClick={createGroupConversation}>
            Create Group
          </button>
        </div>
      </div>
    );
  };

  const renderGroupSettingsPanel = (conversation: Conversation) => {
    const members = conversation.members ?? [];
    const currentView = groupSettingsView ?? "settings";
    const groupMemberCountDisplay = conversation.id === "icu-team" ? members.length + 20 : members.length;

    return (
      <div className="messages_group_settings_page channels_settings_page">
        <div className="channels_settings_hero">
          <button type="button" className="channels_mobile_back" onClick={() => setGroupSettingsView(null)} aria-label="Back to group chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4.167L6.667 10L12.5 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="channels_settings_icon">
         <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
  <path d="M31.5344 25.9684C34.2281 23.9652 35.9844 20.7684 35.9844 17.1605C35.9844 11.1043 31.0578 6.17773 25.0016 6.17773C18.9453 6.17773 14.0187 11.1043 14.0187 17.1605C14.0187 20.7684 15.775 23.9652 18.4687 25.9684C13.6672 27.5824 10.1953 32.1168 10.1953 37.4543V38.9855C10.1953 40.8012 11.4844 42.3668 13.2609 42.7074C17.1219 43.4465 21.0719 43.8199 25.0031 43.8199C28.9344 43.8199 32.8844 43.4449 36.7469 42.7074C38.5219 42.3668 39.8109 40.8012 39.8109 38.9855V37.4543C39.8078 32.1168 36.3344 27.5824 31.5344 25.9684ZM16.8297 17.1605C16.8297 12.6559 20.4953 8.99023 25 8.99023C29.5047 8.99023 33.1703 12.6559 33.1703 17.1605C33.1703 21.6652 29.5047 25.3309 25 25.3309C20.4953 25.3309 16.8297 21.6668 16.8297 17.1605ZM36.9938 38.9855C36.9938 39.4543 36.6656 39.859 36.2141 39.9449C28.8406 41.3543 21.1578 41.3543 13.7875 39.9449C13.3344 39.8574 13.0063 39.4543 13.0063 38.9855V37.4543C13.0063 32.3199 17.1828 28.1434 22.3156 28.1434H27.6844C32.8172 28.1434 36.9938 32.3199 36.9938 37.4543V38.9855Z" fill="#033E4F"/>
  <path d="M42.2798 25.4639C44.1266 23.7858 45.2501 21.3686 45.2501 18.7952C45.2501 15.0827 43.0173 11.803 39.5626 10.4405C38.8438 10.1577 38.0251 10.5092 37.7391 11.2327C37.4532 11.9545 37.8079 12.7717 38.5313 13.0561C40.9048 13.992 42.436 16.2452 42.436 18.7936C42.436 21.3327 40.8454 23.6483 38.4798 24.5592C37.8798 24.7905 37.5126 25.3983 37.5891 26.0373C37.6641 26.6764 38.1642 27.1811 38.8001 27.2655C42.2892 27.7264 45.4688 31.3452 45.4688 34.8561V36.0592C45.4688 36.2889 45.3063 36.4967 45.0845 36.5405C44.8079 36.5951 44.5204 36.6452 44.2235 36.6967L43.6235 36.8014C42.8595 36.9405 42.3532 37.6717 42.4907 38.4358C42.6142 39.1155 43.2063 39.5905 43.8735 39.5905C43.9579 39.5905 44.0407 39.5827 44.1266 39.567L44.6985 39.467C45.0204 39.4108 45.3345 39.3576 45.6313 39.2983C47.1657 38.9967 48.2813 37.6342 48.2813 36.0592V34.8561C48.2813 30.9795 45.7407 27.2342 42.2798 25.4639Z" fill="#033E4F"/>
  <path d="M6.37656 36.8046L5.77656 36.6999C5.48125 36.6483 5.19219 36.5999 4.91094 36.5421C4.69531 36.4999 4.53125 36.2936 4.53125 36.0624V34.8593C4.53125 31.3483 7.70938 27.7296 11.2 27.2686C11.8359 27.1843 12.3375 26.6796 12.4109 26.0405C12.4875 25.4015 12.1188 24.7936 11.5203 24.5624C9.15313 23.6515 7.56406 21.3343 7.56406 18.7968C7.56406 16.2468 9.09531 13.9936 11.4688 13.0593C12.1922 12.7733 12.5453 11.9561 12.2609 11.2343C11.975 10.5108 11.1547 10.1577 10.4375 10.4421C6.98281 11.8046 4.75 15.0843 4.75 18.7968C4.75 21.3686 5.875 23.7874 7.72031 25.4655C4.25938 27.2343 1.71875 30.9796 1.71875 34.8593V36.0624C1.71875 37.6374 2.83438 38.9999 4.36406 39.2999C4.66406 39.3608 4.97969 39.414 5.30156 39.4702L5.87344 39.5702C5.95937 39.5858 6.04219 39.5936 6.12656 39.5936C6.79375 39.5936 7.38594 39.1171 7.50938 38.439C7.64844 37.6749 7.14062 36.9436 6.37656 36.8046Z" fill="#033E4F"/>
</svg>
          </div>
          <div>
            <h1>{conversation.name}</h1>
            <p>{conversation.groupDescription}</p>
            <div className="messages_group_settings_meta">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 6.5C7.14279 6.5 7.77114 6.30939 8.3056 5.95228C8.84006 5.59516 9.25662 5.08758 9.50261 4.49372C9.74859 3.89986 9.81295 3.2464 9.68755 2.61596C9.56215 1.98552 9.25262 1.40643 8.7981 0.951904C8.34358 0.497384 7.76448 0.187851 7.13404 0.0624493C6.50361 -0.0629527 5.85014 0.00140818 5.25628 0.247393C4.66242 0.493378 4.15484 0.909938 3.79772 1.4444C3.44061 1.97886 3.25 2.60721 3.25 3.25C3.25086 4.11169 3.59355 4.93784 4.20285 5.54715C4.81216 6.15646 5.63831 6.49914 6.5 6.5ZM6.5 1.08333C6.92853 1.08333 7.34743 1.21041 7.70374 1.44848C8.06004 1.68656 8.33775 2.02495 8.50174 2.42085C8.66573 2.81676 8.70864 3.25241 8.62504 3.6727C8.54143 4.09299 8.33508 4.47905 8.03206 4.78207C7.72905 5.08508 7.34299 5.29144 6.9227 5.37504C6.5024 5.45864 6.06676 5.41573 5.67085 5.25174C5.27495 5.08775 4.93656 4.81004 4.69848 4.45374C4.46041 4.09743 4.33333 3.67853 4.33333 3.25C4.33333 2.67537 4.56161 2.12427 4.96794 1.71794C5.37426 1.31161 5.92536 1.08333 6.5 1.08333Z" fill="#71787C" />
                  <path d="M6.5 7.58398C5.20751 7.58542 3.96837 8.09949 3.05444 9.01342C2.14051 9.92735 1.62643 11.1665 1.625 12.459C1.625 12.6026 1.68207 12.7404 1.78365 12.842C1.88523 12.9436 2.02301 13.0007 2.16667 13.0007C2.31033 13.0007 2.4481 12.9436 2.54968 12.842C2.65126 12.7404 2.70833 12.6026 2.70833 12.459C2.70833 11.4534 3.10781 10.4889 3.81889 9.77787C4.52996 9.0668 5.49439 8.66732 6.5 8.66732C7.50561 8.66732 8.47004 9.0668 9.18111 9.77787C9.89219 10.4889 10.2917 11.4534 10.2917 12.459C10.2917 12.6026 10.3487 12.7404 10.4503 12.842C10.5519 12.9436 10.6897 13.0007 10.8333 13.0007C10.977 13.0007 11.1148 12.9436 11.2164 12.842C11.3179 12.7404 11.375 12.6026 11.375 12.459C11.3736 11.1665 10.8595 9.92735 9.94556 9.01342C9.03163 8.09949 7.79249 7.58542 6.5 7.58398Z" fill="#71787C" />
                </svg>
                {groupMemberCountDisplay}
              </span>
              <span>{conversation.id === "icu-team" ? 154 : conversation.messages.length} Messages</span>
            </div>
          </div>
        </div>

        <div className="channels_settings_tabs" role="tablist" aria-label="Group settings sections">
          <button
            type="button"
            className={currentView === "settings" ? "active" : ""}
            onClick={() => setGroupSettingsView("settings")}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
  <path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z" fill="#41484B"/>
</svg>
            General
          </button>
          <button
            type="button"
            className={currentView === "members" ? "active" : ""}
            onClick={() => setGroupSettingsView("members")}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#41484B"/>
</svg>
            Members
          </button>
          <button
            type="button"
            className={currentView === "notifications" ? "active" : ""}
            onClick={() => setGroupSettingsView("notifications")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
  <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#41484B"/>
</svg>
            Notifications
          </button>
          
        </div>

        {currentView === "settings" ? (
          <div className="channels_settings_general">
            <div className="channels_settings_general_main">
              <h2>Group Information</h2>
              <label>
                <span>Group Name</span>
                <input  type="text" value={conversation.name}  />
              </label>
              <label>
                <span>Description</span>
                <textarea   value={conversation.groupDescription ?? ""} />
              </label>
              <div className="channels_settings_private">
                <strong>Private Group</strong>
                <p>Only invited care team members can view this conversation.</p>
              </div>
            </div>
            <aside className="channels_settings_general_side">
              <div className="channels_settings_stats">
                <div><span>Created</span><strong>Oct 12, 2023</strong></div>
                <div><span>By</span><strong>Dr. Sarah Jenkins</strong></div>
                <div><span>Members</span><strong>{groupMemberCountDisplay}</strong></div>
              </div>
              <button type="button" className="channels_leave_btn" onClick={() => setIsLeaveGroupOpen(true)}>
                Leave Group
              </button>
            </aside>
          </div>
        ) : null}

        {currentView === "members" ? (
          <div className="channels_settings_members">
            <h2>Members</h2>
            <div className="channels_search_bar messages_group_settings_search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="#0B5064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                placeholder="Search members"
                value={groupDirectorySearch}
                onChange={(event) => setGroupDirectorySearch(event.target.value)}
              />
            </div>
            <div className="channels_members_list channels_members_list_plain">
              {members
                .filter((member) => {
                  const query = groupDirectorySearch.trim().toLowerCase();

                  if (!query) {
                    return true;
                  }

                  return member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query);
                })
                .map((member) => (
                  <div key={member.id} className="channels_member_row">
                    <div className="channels_member_identity">
                      <div className="channels_member_avatar">
                        {member.avatar ? <img src={member.avatar} alt={member.name} /> : <span>{member.name.slice(0, 2)}</span>}
                        <span className="online"></span>
                      </div>
                      <div>
                        <strong>{member.name}</strong>
                        <p>{member.id === "me" ? "Specialist - Surgery" : member.role}</p>
                      </div>
                    </div>
                    {member.id !== "me" ? (
                      <button type="button" className="messages_group_member_delete" aria-label={`Remove ${member.name}`} onClick={() => setMemberPendingRemoval(member)}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
            </div>
            <div className="channels_settings_footer_action">
              <button type="button" className="messages_group_leave_btn v2" onClick={() => setIsLeaveGroupOpen(true)}>
              Leave Group
              </button>
            </div>
          </div>
        ) : null}

        {currentView === "notifications" ? (
          <div className="channels_settings_notifications">
            <div className="channels_notify_row">
              <div>
                <strong>Notifications</strong>
                <p>Receive alerts for important updates and activity in this group.</p>
              </div>
              <button
                type="button"
                className={`channels_toggle ${!conversation.notificationsMuted ? "active" : ""}`}
                onClick={toggleGroupNotifications}
                aria-pressed={!conversation.notificationsMuted}
              >
                <span></span>
              </button>
            </div>
            <div className="channels_notify_row">
              <div>
                <strong>Mute Group</strong>
                <p>Notify me when someone mentions my name.</p>
              </div>
              <button
                type="button"
                className={`channels_toggle ${conversation.notificationsMuted ? "active" : ""}`}
                onClick={toggleGroupNotifications}
                aria-pressed={conversation.notificationsMuted}
              >
                <span></span>
              </button>
            </div>
            <div className="channels_settings_footer_action">
              <button type="button" className="channels_leave_btn" onClick={() => setIsLeaveGroupOpen(true)}>
                Leave Group
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // Implements: Messages - new group info, Group Admin variants, Leave Group,
  // Group Remove Member, and the Group Settings/Members/Notifications tabs.
  const renderGroupInfoPanel = (conversation: Conversation) => {
    const members = conversation.members ?? [];
    const isAdmin = Boolean(conversation.createdByMe || members.find((member) => member.id === "me" && member.isAdmin));
    const groupMemberCountDisplay = conversation.id === "icu-team" ? members.length + 20 : members.length;
    const groupMessageCountDisplay = conversation.id === "icu-team" ? 154 : conversation.messages.length;

    return (
      <aside className="messages_info_panel messages_group_details_panel">
        <div className="messages_group_details_head">
          <h3>Group Details</h3>
          <div className="messages_group_details_head_actions">
            <button type="button" aria-label="Edit group details">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M10.5 3L15 7.5M2.25 15.75L5.456 15.037C5.865 14.946 6.238 14.733 6.524 14.425L14.25 6.187C14.845 5.554 14.83 4.564 14.216 3.95L13.05 2.784C12.436 2.17 11.446 2.155 10.813 2.75L2.575 10.476C2.267 10.762 2.054 11.135 1.963 11.544L1.25 14.75L2.25 15.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button type="button" aria-label="Close group details" onClick={toggleInfo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="messages_group_details_hero">
          <div className="messages_group_details_icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
              <circle cx="15.5" cy="15" r="5.25" stroke="#0B5064" strokeWidth="2.2" />
              <circle cx="25.75" cy="15.75" r="4.5" stroke="#0B5064" strokeWidth="2.2" opacity="0.88" />
              <path d="M7.75 30.25C7.75 25.9698 11.2198 22.5 15.5 22.5H18C22.2802 22.5 25.75 25.9698 25.75 30.25" stroke="#0B5064" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M21.5 30.25C21.5 27.2124 23.9624 24.75 27 24.75H28.5C31.5376 24.75 34 27.2124 34 30.25" stroke="#0B5064" strokeWidth="2.2" strokeLinecap="round" opacity="0.88" />
            </svg>
          </div>
          <h4>{conversation.name}</h4>
          <p>{conversation.groupDescription}</p>
          <span>Created By: Dr. Sarah Jenkins</span>
        </div>

        <div className="messages_group_details_meta">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8.5C9.65685 8.5 11 7.15685 11 5.5C11 3.84315 9.65685 2.5 8 2.5C6.34315 2.5 5 3.84315 5 5.5C5 7.15685 6.34315 8.5 8 8.5Z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M2.75 13.25C2.75 10.9028 5.40279 9 8 9C10.5972 9 13.25 10.9028 13.25 13.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            {groupMemberCountDisplay}
          </div>
          <div>{groupMessageCountDisplay} Messages</div>
        </div>

        <div className="messages_group_details_actions">
          <button type="button" aria-label="Call group" onClick={() => openCallScreen("audio", conversation)}>
            <img src="/icn/audiocall_icn.svg" alt="" />
          </button>
          <button type="button" aria-label="Video call group" onClick={() => openCallScreen("video", conversation)}>
            <img src="/icn/videocall_icn.svg" alt="" />
          </button>
        </div>

        <div className="messages_group_details_stats">
          <article>
            <span>Members</span>
            <strong>{groupMemberCountDisplay}</strong>
          </article>
          <article>
            <span>Messages</span>
            <strong>{groupMessageCountDisplay}</strong>
          </article>
        </div>

        <div className="messages_group_detail_links">
          <button type="button" onClick={() => openGroupSettings("notifications")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 15.75C10.2426 15.75 11.25 14.7426 11.25 13.5H6.75C6.75 14.7426 7.75736 15.75 9 15.75Z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M13.5 13.5H4.5C5.32672 12.6378 5.80508 11.5021 5.85 10.308V7.875C5.85 6.18425 7.09875 4.7655 8.775 4.5525C10.7317 4.3035 12.375 5.8395 12.375 7.75V10.308C12.4199 11.5021 12.8983 12.6378 13.725 13.5H13.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Notification Settings
          </button>
          <button type="button" onClick={() => openGroupSettings("settings")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M14.25 10.125V7.875L12.774 7.425C12.6366 6.98572 12.4568 6.56088 12.2378 6.15675L12.96 4.77L11.37 3.18L9.98325 3.90225C9.57912 3.68317 9.15428 3.50343 8.715 3.366L8.25 1.875H5.99999L5.55 3.351C5.11072 3.48843 4.68588 3.66817 4.28175 3.88725L2.895 3.165L1.305 4.755L2.02725 6.14175C1.80817 6.54588 1.62843 6.97072 1.491 7.41L0 7.875V10.125L1.476 10.575C1.61343 11.0143 1.79317 11.4391 2.01225 11.8433L1.29 13.23L2.88 14.82L4.26675 14.0978C4.67088 14.3168 5.09572 14.4966 5.535 14.634L6 16.125H8.25L8.7 14.649C9.13928 14.5116 9.56412 14.3318 9.96825 14.1128L11.355 14.835L12.945 13.245L12.2228 11.8583C12.4418 11.4541 12.6216 11.0293 12.759 10.59L14.25 10.125Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Group Settings
          </button>
          <button type="button" onClick={() => setCopiedToast("Group pinned")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M10.875 2.625L14.625 6.375L11.4375 7.3125L9.375 9.375L12.75 12.75L11.25 14.25L7.875 10.875L5.8125 12.9375L4.875 16.125L1.125 12.375L4.3125 11.4375L6.375 9.375L3 6L4.5 4.5L7.875 7.875L9.9375 5.8125L10.875 2.625Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pin Group
          </button>
        </div>

        <div className="messages_group_members_block">
          <div className="messages_group_members_head">
            <span>Members</span>
            <div>
              <button
                type="button"
                aria-label="Add member"
                onClick={() => {
                  setIsGroupDirectoryOpen((current) => !current);
                  setGroupDirectorySearch("");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14.25 9H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Search members"
                onClick={() => {
                  setIsGroupDirectoryOpen(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {isGroupDirectoryOpen ? (
            <div className="messages_group_directory_panel">
              <div className="messages_group_directory_search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="#0B5064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  placeholder="Search name here..."
                  value={groupDirectorySearch}
                  onChange={(event) => setGroupDirectorySearch(event.target.value)}
                />
              </div>

              <div className="messages_group_directory_list">
                {filteredGroupDirectory.map((member) => {
                  const isSelected = members.some((entry) => entry.id === member.id);

                  return (
                    <button
                      type="button"
                      key={member.id}
                      className="messages_group_directory_item"
                      onClick={() => toggleGroupDirectoryMember(member)}
                    >
                      <div className="messages_group_directory_identity">
                        <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
                        <div>
                          <h4>{member.name}</h4>
                          <span>{member.role}</span>
                        </div>
                      </div>
                      <strong className={isSelected ? "selected" : ""} aria-hidden="true">
                        {isSelected ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                            <path d="M1.5 4.5L4.5 7.5L9.5 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : null}
                      </strong>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="messages_group_members_list_v2">
            {members.map((member) => (
              <article key={member.id} className="messages_group_member_item_v2">
                <div className="messages_group_member_identity_v2">
                  <div className="messages_group_member_avatar_wrap">
                    <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
                    <span className="messages_group_member_status_dot"></span>
                  </div>
                  <div>
                    <h4>{member.name}</h4>
                    <span>{member.id === "me" ? "Specialist - Surgery" : member.role}</span>
                  </div>
                </div>

                {isAdmin && member.id !== "me" ? (
                  <button
                    type="button"
                    className="messages_group_member_delete"
                    aria-label={`Remove ${member.name}`}
                    onClick={() => setMemberPendingRemoval(member)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3.75 5.25H14.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M6.75 5.25V4.5C6.75 3.87868 7.25368 3.375 7.875 3.375H10.125C10.7463 3.375 11.25 3.87868 11.25 4.5V5.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M5.25 5.25L5.7 13.209C5.76915 14.4314 6.7803 15.375 8.00467 15.375H9.99533C11.2197 15.375 12.2309 14.4314 12.3 13.209L12.75 5.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M7.5 8.25V12.375" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M10.5 8.25V12.375" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <button type="button" className="messages_group_leave_btn v2" onClick={() => setIsLeaveGroupOpen(true)}>
          Leave Group
        </button>
      </aside>
    );
  };

  const renderMainPanel = () => {
    if (isCreateGroupOpen) {
      return renderCreateGroupPanel();
    }

    if (isNewMessageOpen) {
      return (
        <div className="messages_new_message_state">
          <div className="messages_new_message_head">
            <div>
              <h3>New Message</h3>
            </div>
            <button type="button" onClick={() => setIsNewMessageOpen(false)} aria-label="Close new message">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clipPath="url(#clip0_817_8142)">
    <path d="M11.9998 5.99986C11.8592 5.85926 11.6685 5.78027 11.4696 5.78027C11.2707 5.78027 11.08 5.85926 10.9393 5.99986L8.99983 7.93936L7.06034 5.99986C6.91889 5.86324 6.72944 5.78765 6.53279 5.78936C6.33614 5.79107 6.14803 5.86994 6.00898 6.009C5.86992 6.14806 5.79104 6.33616 5.78933 6.53281C5.78763 6.72946 5.86322 6.91891 5.99984 7.06036L7.93934 8.99986L5.99984 10.9394C5.86322 11.0808 5.78763 11.2703 5.78933 11.4669C5.79104 11.6636 5.86992 11.8517 6.00898 11.9907C6.14803 12.1298 6.33614 12.2087 6.53279 12.2104C6.72944 12.2121 6.91889 12.1365 7.06034 11.9999L8.99983 10.0604L10.9393 11.9999C11.0808 12.1365 11.2702 12.2121 11.4669 12.2104C11.6635 12.2087 11.8516 12.1298 11.9907 11.9907C12.1297 11.8517 12.2086 11.6636 12.2103 11.4669C12.212 11.2703 12.1364 11.0808 11.9998 10.9394L10.0603 8.99986L11.9998 7.06036C12.1404 6.91972 12.2194 6.72899 12.2194 6.53011C12.2194 6.33124 12.1404 6.14051 11.9998 5.99986Z" fill="#E4432D"/>
    <path d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389957 7.20038 -0.17433 9.00998 0.172937 10.7558C0.520204 12.5016 1.37737 14.1053 2.63604 15.364C3.89472 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9974 6.61384 17.0484 4.32616 15.3611 2.63889C13.6738 0.951621 11.3862 0.00258081 9 0V0ZM9 16.5C7.51664 16.5 6.0666 16.0601 4.83323 15.236C3.59986 14.4119 2.63856 13.2406 2.07091 11.8701C1.50325 10.4997 1.35473 8.99168 1.64411 7.53682C1.9335 6.08197 2.64781 4.74559 3.6967 3.6967C4.7456 2.64781 6.08197 1.9335 7.53683 1.64411C8.99168 1.35472 10.4997 1.50325 11.8701 2.0709C13.2406 2.63856 14.4119 3.59985 15.236 4.83322C16.0601 6.06659 16.5 7.51664 16.5 9C16.4978 10.9885 15.7069 12.8948 14.3009 14.3009C12.8948 15.7069 10.9885 16.4978 9 16.5V16.5Z" fill="#E4432D"/>
  </g>
  <defs>
    <clipPath id="clip0_817_8142">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>
            </button>
          </div>

          <span className="messages_new_message_label">Find recipients</span>

          <div className="messages_new_message_search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={newMessageSearch}
              onChange={(event) => setNewMessageSearch(event.target.value)}
              placeholder="Search contacts..."
            />
          </div>

          <div className="messages_new_message_grid">
            <div className="messages_new_message_list">
              {newMessageResults.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={`messages_new_message_item ${
                    newMessageRecipientId === conversation.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setNewMessageRecipientId(conversation.id);
                    startNewConversation(conversation.id);
                  }}
                >
                  <ContactAvatar
                    name={conversation.name}
                    avatar={conversation.avatar}
                    avatarClassName={conversation.avatarClassName}
                  />
                  <div>
                    <h4>{conversation.name}</h4>
                    <span>{conversation.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!selectedConversation) {
      return (
        <div className="messages_select_state">
          <div className="messages_select_card">
            <h3>Select a Conversation</h3>
            <p>Choose a conversation from the list or start
a new message to begin communicating</p>
            <div className="messages_select_actions">
              <button type="button" className="kinnect-btn-primary" onClick={openNewMessage}>
                <span className="messages_new_message_plus" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_817_6148)">
    <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM13.3333 10.8333H10.8333V13.3333C10.8333 13.5543 10.7455 13.7663 10.5893 13.9226C10.433 14.0789 10.221 14.1667 10 14.1667C9.77899 14.1667 9.56703 14.0789 9.41075 13.9226C9.25447 13.7663 9.16667 13.5543 9.16667 13.3333V10.8333H6.66667C6.44566 10.8333 6.2337 10.7455 6.07742 10.5893C5.92113 10.433 5.83334 10.221 5.83334 10C5.83334 9.77899 5.92113 9.56703 6.07742 9.41074C6.2337 9.25447 6.44566 9.16667 6.66667 9.16667H9.16667V6.66667C9.16667 6.44565 9.25447 6.23369 9.41075 6.07741C9.56703 5.92113 9.77899 5.83333 10 5.83333C10.221 5.83333 10.433 5.92113 10.5893 6.07741C10.7455 6.23369 10.8333 6.44565 10.8333 6.66667V9.16667H13.3333C13.5544 9.16667 13.7663 9.25447 13.9226 9.41074C14.0789 9.56703 14.1667 9.77899 14.1667 10C14.1667 10.221 14.0789 10.433 13.9226 10.5893C13.7663 10.7455 13.5544 10.8333 13.3333 10.8333Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_817_6148">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg></span>
                New Message
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "files") {
      return renderFilesPanel();
    }

    if (isSearchOpen) {
      return (
        <div className="messages_search_state">
          <div className="messages_search_top">
            <h3>Find in chat</h3>
            <button type="button" onClick={toggleSearch} aria-label="Close chat search">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="8.75" stroke="#E4432D" strokeWidth="1.5" />
                <path d="M8 8L14 14" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 8L8 14" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="messages_chat_search_input">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              value={chatSearch}
              onChange={(event) => setChatSearch(event.target.value)}
              placeholder="Search..."
            />
          </div>

          {chatSearch.trim() ? (
            <div className="messages_search_results">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <article key={message.id} className="messages_search_result">
                    <span>{message.time}</span>
                    <p>{message.text}</p>
                  </article>
                ))
              ) : (
                <MessagePlaceholder mode="search" />
              )}
            </div>
          ) : (
            <MessagePlaceholder mode="search" />
          )}
        </div>
      );
    }

    if (!selectedConversation.hasMessages) {
      return <MessagePlaceholder mode="empty" />;
    }

    return (
      <div className="messages_feed">
        {pinnedMessages.length > 0 ? (
          <div className="messages_pinned_strip">
            <div className="messages_pinned_items">
              {pinnedMessages.map((message) => (
                <button
                  type="button"
                  key={message.id}
                  className="messages_pinned_chip"
                  onClick={() => handleReply(message)}
                >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_841_6559)">
    <path d="M15.5164 4.49538L11.5524 0.533383C11.2719 0.243208 10.8983 0.0609052 10.497 0.0183713C10.0956 -0.0241627 9.69213 0.0757816 9.35705 0.300716C9.15949 0.441208 8.99496 0.623105 8.87494 0.83372C8.75491 1.04433 8.68227 1.2786 8.66208 1.52017C8.6419 1.76175 8.67466 2.00482 8.75807 2.23243C8.84148 2.46004 8.97355 2.66672 9.14505 2.83805L9.53971 3.23205C9.64027 3.33322 9.69671 3.47007 9.69671 3.61271C9.69671 3.75536 9.64027 3.89221 9.53971 3.99338L8.13971 5.39338C8.01685 5.5157 7.86441 5.60413 7.69722 5.65004C7.53004 5.69595 7.35382 5.69779 7.18571 5.65538L6.63905 5.51538C6.00863 5.35082 5.35369 5.30136 4.70571 5.36938C4.27987 5.41366 3.87557 5.57878 3.54047 5.84525C3.20537 6.11173 2.95344 6.46845 2.81438 6.87338C2.66206 7.29193 2.6324 7.74527 2.72889 8.1801C2.82537 8.61494 3.04399 9.01319 3.35905 9.32804L4.52305 10.5334L0.195713 14.862C0.13204 14.9235 0.0812514 14.9971 0.046312 15.0784C0.0113727 15.1598 -0.00701812 15.2472 -0.00778733 15.3358C-0.00855654 15.4243 0.00831127 15.5121 0.0418319 15.594C0.0753524 15.6759 0.124855 15.7504 0.18745 15.813C0.250045 15.8756 0.324479 15.9251 0.40641 15.9586C0.488341 15.9921 0.576128 16.009 0.664647 16.0082C0.753167 16.0074 0.840647 15.989 0.921983 15.9541C1.00332 15.9192 1.07688 15.8684 1.13838 15.8047L5.44971 11.4934L6.28305 12.356C6.84797 12.9554 7.62718 13.3068 8.45038 13.3334C8.71651 13.3337 8.98075 13.2886 9.23171 13.2C9.61471 13.0679 9.95118 12.8275 10.2004 12.508C10.4495 12.1886 10.6008 11.8037 10.6357 11.4C10.7032 10.758 10.6549 10.109 10.493 9.48404L10.3517 8.80004C10.3121 8.63321 10.3158 8.45902 10.3625 8.29403C10.4091 8.12903 10.4972 7.97872 10.6184 7.85737L12.011 6.46671C12.1194 6.36733 12.2595 6.30968 12.4064 6.30404C12.4709 6.30391 12.5348 6.31664 12.5943 6.34148C12.6538 6.36632 12.7078 6.40277 12.753 6.44871L13.0904 6.78604C13.3694 7.08396 13.7455 7.2727 14.1511 7.31839C14.5567 7.36409 14.9654 7.26375 15.3037 7.03538C15.5013 6.89494 15.6659 6.71308 15.786 6.50249C15.9061 6.2919 15.9788 6.05765 15.999 5.81608C16.0193 5.5745 15.9866 5.33141 15.9032 5.10377C15.8199 4.87613 15.6878 4.66942 15.5164 4.49804V4.49538Z" fill="#E4432D"/>
  </g>
  <defs>
    <clipPath id="clip0_841_6559">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                  <div className="messages_pinned_content">
                    <strong>{message.author}</strong>
                    <span aria-hidden="true">-</span>
                    <span className="messages_pinned_text">
                      {message.text || message.pinnedTitle || message.attachment?.name || "Pinned Update"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="messages_day_divider">
          <span>Today, October 24</span>
        </div>

        {selectedConversation.messages.map((message) => (
          <div
            key={message.id}
            className={`messages_bubble_row ${message.sender === "me" ? "outgoing" : "incoming"}`}
          >
            {message.sender === "contact" ? (
              <ContactAvatar
                name={message.author}
                avatar={selectedConversation.members?.find((member) => member.name === message.author)?.avatar}
                avatarClassName={selectedConversation.members?.find((member) => member.name === message.author)?.avatarClassName}
              />
            ) : null}

            <div className="messages_bubble_block">
              <div className={`messages_bubble_head ${message.sender === "me" ? "outgoing" : ""}`}>
                <div className={`messages_bubble_head_identity ${message.sender === "me" ? "outgoing" : ""}`}>
                  {message.sender === "contact" ? <b>{message.author}</b> : null}
                  <span>{message.time}</span>
                  {message.sender === "me" ? <b>{message.author}</b> : null}
                </div>
                <div className="messages_bubble_meta">
                  <div
                    className={`messages_actions_menu_wrap ${openMessageActionsId === message.id ? "open" : ""}`}
                  >
                    <button
                      type="button"
                      className="messages_actions_trigger"
                      onClick={() =>
                        setOpenMessageActionsId((current) => (current === message.id ? null : message.id))
                      }
                      aria-label="Open message actions"
                      aria-expanded={openMessageActionsId === message.id}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>

                    {openMessageActionsId === message.id ? (
                      <div className="messages_actions_menu">
                        <button type="button" onClick={() => handleReply(message)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_841_4603)">
    <path d="M15.3333 15.9996C15.1565 15.9996 14.9869 15.9293 14.8619 15.8043C14.7368 15.6793 14.6666 15.5097 14.6666 15.3329C14.6655 14.2724 14.2438 13.2556 13.4939 12.5057C12.7439 11.7557 11.7271 11.334 10.6666 11.3329H6.77993V12.3902C6.77987 12.6539 6.70165 12.9116 6.55513 13.1309C6.40862 13.3501 6.2004 13.5209 5.9568 13.6218C5.7132 13.7227 5.44516 13.7491 5.18655 13.6977C4.92795 13.6463 4.6904 13.5193 4.50393 13.3329L0.584596 9.41359C0.209654 9.03853 -0.000976563 8.52991 -0.000976562 7.99959C-0.000976563 7.46926 0.209654 6.96064 0.584596 6.58559L4.50393 2.66626C4.6904 2.47985 4.92795 2.35291 5.18655 2.30148C5.44516 2.25006 5.7132 2.27646 5.9568 2.37736C6.2004 2.47825 6.40862 2.6491 6.55513 2.86832C6.70165 3.08753 6.77987 3.34526 6.77993 3.60893V4.66626H9.99993C11.5907 4.66802 13.1158 5.30073 14.2406 6.42556C15.3655 7.5504 15.9982 9.07549 15.9999 10.6662V15.3329C15.9999 15.5097 15.9297 15.6793 15.8047 15.8043C15.6796 15.9293 15.5101 15.9996 15.3333 15.9996ZM5.4466 3.60893L1.52726 7.52825C1.40228 7.65327 1.33207 7.82281 1.33207 7.99959C1.33207 8.17636 1.40228 8.3459 1.52726 8.47092L5.4466 12.3902V10.6662C5.4466 10.4894 5.51683 10.3199 5.64186 10.1948C5.76688 10.0698 5.93645 9.99958 6.11326 9.99958H10.6666C11.4237 9.99936 12.1721 10.1606 12.8618 10.4726C13.5516 10.7846 14.1669 11.2402 14.6666 11.8089V10.6662C14.6652 9.42901 14.1731 8.24284 13.2982 7.36798C12.4233 6.49312 11.2372 6.001 9.99993 5.99959H6.11326C5.93645 5.99959 5.76688 5.92935 5.64186 5.80433C5.51683 5.6793 5.4466 5.50973 5.4466 5.33292V3.60893Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_841_4603">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            togglePinnedMessage(message.id);
                            setOpenMessageActionsId(null);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_841_6528)">
    <path d="M0.666525 16.0005C0.843321 16.0005 1.01286 15.9302 1.13786 15.8052L5.55053 11.3925L6.38253 12.2539C7.00961 12.9165 7.8739 13.3035 8.78586 13.3299C9.08987 13.3308 9.3918 13.2796 9.67852 13.1785C10.1216 13.026 10.5108 12.7481 10.7989 12.3787C11.0871 12.0092 11.2618 11.564 11.3019 11.0972C11.3742 10.4211 11.3241 9.73751 11.1539 9.0792L11.0112 8.38454C10.9842 8.27345 10.9862 8.15728 11.017 8.04718C11.0478 7.93709 11.1064 7.83677 11.1872 7.75587L12.2452 6.6972C12.2869 6.65531 12.3434 6.63138 12.4025 6.63053C12.4233 6.62667 12.4447 6.62868 12.4644 6.63634C12.484 6.644 12.5012 6.65699 12.5139 6.67387C12.8487 7.02897 13.2992 7.25304 13.7844 7.30583C14.2697 7.35862 14.7578 7.23666 15.1612 6.96187C15.3979 6.79313 15.595 6.57482 15.7387 6.32214C15.8824 6.06946 15.9693 5.7885 15.9934 5.4988C16.0174 5.20911 15.978 4.91766 15.8779 4.64474C15.7779 4.37182 15.6195 4.124 15.4139 3.91853L12.1332 0.636535C11.7963 0.291268 11.3488 0.0753909 10.8689 0.0266451C10.389 -0.0221007 9.90726 0.0993871 9.50786 0.369868C9.27111 0.538557 9.07398 0.756826 8.9302 1.00948C8.78642 1.26213 8.69945 1.54308 8.67533 1.83278C8.65122 2.12247 8.69054 2.41394 8.79057 2.68689C8.8906 2.95983 9.04893 3.20769 9.25453 3.4132L9.30519 3.46387C9.34338 3.50233 9.36481 3.55433 9.36481 3.60853C9.36481 3.66274 9.34338 3.71474 9.30519 3.7532L8.23853 4.81987C8.1567 4.90152 8.05504 4.9605 7.94354 4.991C7.83204 5.02151 7.71452 5.02249 7.60253 4.99387L7.05786 4.85453C6.38789 4.67956 5.69185 4.62694 5.00319 4.6992C4.51476 4.74979 4.05098 4.93896 3.66651 5.24441C3.28204 5.54986 2.9929 5.95886 2.83319 6.4232C2.6589 6.90037 2.62453 7.4174 2.73414 7.91344C2.84374 8.40948 3.09274 8.86389 3.45186 9.2232L4.62386 10.4365L0.195191 14.8625C0.101985 14.9558 0.038514 15.0745 0.0128023 15.2038C-0.0129094 15.3331 0.000292604 15.4672 0.0507393 15.589C0.101186 15.7108 0.186612 15.8149 0.296219 15.8881C0.405826 15.9614 0.534691 16.0005 0.666525 16.0005ZM4.08986 6.8672C4.16498 6.64008 4.30433 6.43961 4.49104 6.29005C4.67775 6.14049 4.90381 6.04827 5.14186 6.02454C5.29534 6.00856 5.44955 6.00055 5.60386 6.00053C5.98207 6.00055 6.35871 6.04917 6.72453 6.1452L7.27319 6.2852C7.60934 6.37025 7.96178 6.36674 8.29617 6.27502C8.63056 6.18331 8.93547 6.00651 9.18119 5.76187L10.2479 4.6952C10.5357 4.40653 10.6973 4.01551 10.6973 3.60787C10.6973 3.20022 10.5357 2.80921 10.2479 2.52053L10.1972 2.46987C10.1282 2.401 10.0751 2.31783 10.0417 2.22623C10.0083 2.13462 9.99541 2.0368 10.0039 1.93967C10.0124 1.84254 10.0422 1.74846 10.091 1.66406C10.1398 1.57966 10.2066 1.507 10.2865 1.4512C10.4288 1.36508 10.5964 1.33066 10.7611 1.35374C10.9257 1.37681 11.0774 1.45597 11.1905 1.57787L14.4732 4.86053C14.5422 4.9294 14.5953 5.01257 14.6287 5.10418C14.6621 5.19578 14.675 5.2936 14.6665 5.39073C14.6579 5.48787 14.6282 5.58195 14.5794 5.66634C14.5306 5.75074 14.4638 5.8234 14.3839 5.8792C14.2401 5.96649 14.0703 6.00094 13.9039 5.9766C13.7374 5.95227 13.5847 5.87068 13.4719 5.74587C13.3347 5.60444 13.1706 5.49193 12.9892 5.41498C12.8078 5.33804 12.6129 5.29821 12.4159 5.29787C12.0002 5.29976 11.6017 5.4633 11.3045 5.75387L10.2472 6.81187C10.0071 7.05212 9.83216 7.34956 9.73885 7.67615C9.64554 8.00274 9.63694 8.34771 9.71386 8.67854L9.85986 9.38387C9.99438 9.89815 10.0353 10.4324 9.98052 10.9612C9.96459 11.1768 9.88564 11.3831 9.75348 11.5542C9.62133 11.7254 9.44179 11.8539 9.23719 11.9239C8.89616 12.0135 8.5367 12.0048 8.20044 11.8986C7.86419 11.7924 7.56488 11.5931 7.33719 11.3239L4.40386 8.29054C4.22095 8.10812 4.09416 7.87709 4.03851 7.62483C3.98286 7.37257 4.00068 7.10965 4.08986 6.8672V6.8672Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_841_6528">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                          {message.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button type="button" onClick={() => handleCopy(message)}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clipPath="url(#clip0_841_7807)">
    <path d="M10 13.3333H3.33333C2.4496 13.3323 1.60237 12.9807 0.97748 12.3559C0.352588 11.731 0.00105857 10.8837 0 10L0 3.33333C0.00105857 2.4496 0.352588 1.60237 0.97748 0.97748C1.60237 0.352588 2.4496 0.00105857 3.33333 0L10 0C10.8837 0.00105857 11.731 0.352588 12.3559 0.97748C12.9807 1.60237 13.3323 2.4496 13.3333 3.33333V10C13.3323 10.8837 12.9807 11.731 12.3559 12.3559C11.731 12.9807 10.8837 13.3323 10 13.3333V13.3333ZM3.33333 1.33333C2.8029 1.33333 2.29419 1.54405 1.91912 1.91912C1.54405 2.29419 1.33333 2.8029 1.33333 3.33333V10C1.33333 10.5304 1.54405 11.0391 1.91912 11.4142C2.29419 11.7893 2.8029 12 3.33333 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10V3.33333C12 2.8029 11.7893 2.29419 11.4142 1.91912C11.0391 1.54405 10.5304 1.33333 10 1.33333H3.33333ZM16 12.6667V4C16 3.82319 15.9298 3.65362 15.8047 3.5286C15.6797 3.40357 15.5101 3.33333 15.3333 3.33333C15.1565 3.33333 14.987 3.40357 14.8619 3.5286C14.7369 3.65362 14.6667 3.82319 14.6667 4V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667H4C3.82319 14.6667 3.65362 14.7369 3.5286 14.8619C3.40357 14.987 3.33333 15.1565 3.33333 15.3333C3.33333 15.5101 3.40357 15.6797 3.5286 15.8047C3.65362 15.9298 3.82319 16 4 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V12.6667Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_841_7807">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                          Copy
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                className={`messages_bubble ${message.sender === "me" ? "outgoing" : ""} ${
                  message.attachment && !message.text ? "attachment_only" : ""
                }`}
              >
                {message.replyTo ? (
                  <div className={`messages_reply_quote ${message.sender === "me" ? "outgoing" : ""}`}>
                    <strong>{message.replyTo.author}</strong>
                    <span>{message.replyTo.text}</span>
                  </div>
                ) : null}

                {message.text ? <p>{message.text}</p> : null}

                {message.attachments?.length ? (
                  <div className="messages_attachment_row">
                    {message.attachments.map((attachment) => (
                      <div key={attachment.name} className="messages_attachment_stack">
                        {renderAttachmentCard({
                          ...attachment,
                          id: message.id,
                          author: message.author,
                          time: message.time,
                          text: message.text,
                        })}
                      </div>
                    ))}
                  </div>
                ) : message.attachment ? (
                  renderAttachmentCard({
                    ...message.attachment,
                    id: message.id,
                    author: message.author,
                    time: message.time,
                    text: message.text,
                  })
                ) : null}
              </div>

              {message.sender === "me" && message.deliveryStatus ? (
                <div className="messages_read_status">
                  <img src="/icn/read_icn.svg" alt="" />
                  {message.deliveryStatus}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {isContactTyping ? (
          <div className="messages_typing_row">
            <div className="messages_typing_bubble" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>{selectedConversation.isGroup ? "Dr. Sarah +2 are typing..." : `${selectedConversation.name.split(" ")[1] ?? selectedConversation.name} is typing...`}</p>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      className={`messages_page ${isMobileConversationView ? "mobile_conversation_view" : ""} ${
        isMobileListView ? "mobile_list_view" : ""
      }`}
    >
      {/* {incomingCallAlert ? (
        <div className="messages_incoming_call_popup">
          <div className="messages_incoming_call_identity">
            <div className="messages_incoming_call_avatar">
              <img src={incomingCallAlert.avatar} alt={incomingCallAlert.name} />
            </div>
            <div className="messages_incoming_call_content">
              <span>Incoming {incomingCallAlert.type === "video" ? "Video" : "Audio"} Call</span>
              <h3>{incomingCallAlert.name}</h3>
              <p>{incomingCallAlert.role}</p>
            </div>
          </div>

          <div className="messages_incoming_call_actions">
            <button type="button" className="messages_incoming_call_decline" onClick={() => setIncomingCallAlert(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none">
  <path d="M17.8346 8.89199C17.6693 9.10321 17.4405 9.25567 17.1819 9.32685C16.9234 9.39804 16.6487 9.38417 16.3987 9.2873L12.5705 7.92871L12.5479 7.92012C12.3564 7.84353 12.1869 7.72077 12.0544 7.56279C11.9219 7.4048 11.8306 7.2165 11.7885 7.01465L11.3033 4.69043C10.0446 4.26155 8.67888 4.26457 7.42209 4.69902L6.96116 7.00527C6.9205 7.20935 6.82954 7.40006 6.69653 7.56009C6.56351 7.72011 6.39265 7.8444 6.19944 7.92168L6.17678 7.93027L2.34866 9.2873C2.20655 9.3433 2.0553 9.37244 1.90256 9.37324C1.71244 9.37359 1.52475 9.33056 1.35376 9.24744C1.18278 9.16432 1.033 9.04328 0.915843 8.89355C-0.430251 7.15762 -0.27947 4.85371 1.28225 3.29121C5.66897 -1.09707 13.0791 -1.09707 17.4682 3.29121C19.0299 4.85215 19.1807 7.15605 17.8346 8.89199ZM16.2502 11.2482H2.50022C2.33446 11.2482 2.17549 11.3141 2.05828 11.4313C1.94107 11.5485 1.87522 11.7075 1.87522 11.8732C1.87522 12.039 1.94107 12.198 2.05828 12.3152C2.17549 12.4324 2.33446 12.4982 2.50022 12.4982H16.2502C16.416 12.4982 16.575 12.4324 16.6922 12.3152C16.8094 12.198 16.8752 12.039 16.8752 11.8732C16.8752 11.7075 16.8094 11.5485 16.6922 11.4313C16.575 11.3141 16.416 11.2482 16.2502 11.2482Z" fill="white"/>
</svg>
            </button>
            <button type="button" className="messages_incoming_call_accept" onClick={acceptIncomingCall}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M15.6156 11.803C15.4763 12.8616 14.9564 13.8333 14.1531 14.5366C13.3497 15.2399 12.3177 15.6268 11.25 15.6248C5.04688 15.6248 7.06925e-06 10.578 7.06925e-06 4.37484C-0.00190698 3.3071 0.384919 2.27517 1.08824 1.47179C1.79155 0.668411 2.76326 0.148519 3.82188 0.00921691C4.08958 -0.0234699 4.36067 0.0312965 4.59468 0.165341C4.8287 0.299385 5.01309 0.505517 5.12032 0.752967L6.77032 4.43656V4.44594C6.85242 4.63535 6.88633 4.84215 6.86901 5.04787C6.8517 5.25359 6.7837 5.45181 6.6711 5.62484C6.65704 5.64594 6.64219 5.66547 6.62657 5.685L5.00001 7.61312C5.58516 8.80219 6.82891 10.035 8.0336 10.6217L9.93516 9.00375C9.95384 8.98805 9.9734 8.97344 9.99376 8.96C10.1666 8.84469 10.3655 8.7743 10.5725 8.7552C10.7794 8.73611 10.9878 8.7689 11.1789 8.85062L11.1891 8.85531L14.8695 10.5045C15.1174 10.6114 15.3241 10.7956 15.4585 11.0297C15.593 11.2637 15.6481 11.535 15.6156 11.803Z" fill="white"/>
</svg>
            </button>
          </div>
        </div>
      ) : null} */}

      {groupSettingsView && selectedConversation?.isGroup ? (
        renderGroupSettingsPanel(selectedConversation)
      ) : (
      <div className="messages_layout">
        <aside className="messages_sidebar_panel">
          <div className="messages_sidebar_head">
            <h1>Messages</h1>
            <div className="messages_sidebar_create_actions">
              <button
                type="button"
                className="messages_create_menu_trigger"
                aria-label="Open create menu"
                aria-expanded={isCreateMenuOpen}
                onClick={() => setIsCreateMenuOpen((current) => !current)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#E4432D" />
                  <path d="M12 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M17 12L7 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {isCreateMenuOpen ? (
                <div className="messages_create_menu">
                  <button type="button" onClick={openNewMessage}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_817_6403)">
    <path d="M19.9999 9.37297C19.8794 7.42299 19.1908 5.5509 18.0192 3.98749C16.8476 2.42409 15.244 1.23771 13.4063 0.574632C11.5686 -0.0884492 9.57696 -0.199252 7.67701 0.255883C5.77706 0.711018 4.05182 1.71219 2.714 3.13599C1.37617 4.55978 0.48424 6.34394 0.148157 8.26852C-0.187925 10.1931 0.0465362 12.174 0.822636 13.9669C1.59874 15.7598 2.88255 17.2865 4.5158 18.3586C6.14905 19.4307 8.06034 20.0015 10.014 20.0005H15.8332C16.9379 19.9994 17.9971 19.56 18.7783 18.7789C19.5594 17.9977 19.9988 16.9385 19.9999 15.8338V9.37297ZM18.3332 15.8338C18.3332 16.4968 18.0698 17.1327 17.601 17.6016C17.1321 18.0704 16.4962 18.3338 15.8332 18.3338H10.014C8.83815 18.3333 7.67558 18.0849 6.60212 17.6049C5.52866 17.1249 4.56843 16.424 3.78404 15.548C2.99585 14.6724 2.40398 13.6384 2.04812 12.5153C1.69225 11.3922 1.58062 10.206 1.72071 9.0363C1.9419 7.19125 2.77086 5.47229 4.07691 4.15041C5.38295 2.82852 7.09179 1.97889 8.93404 1.73547C9.2934 1.69043 9.6552 1.66761 10.0174 1.66714C11.9594 1.66184 13.8414 2.34039 15.3332 3.5838C16.2045 4.30792 16.9196 5.20143 17.4353 6.21016C17.951 7.21889 18.2565 8.32184 18.3332 9.45214V15.8338Z" fill="#374957"/>
    <path d="M6.66652 7.49967H9.99986C10.2209 7.49967 10.4328 7.41187 10.5891 7.25559C10.7454 7.09931 10.8332 6.88735 10.8332 6.66634C10.8332 6.44533 10.7454 6.23337 10.5891 6.07709C10.4328 5.92081 10.2209 5.83301 9.99986 5.83301H6.66652C6.44551 5.83301 6.23355 5.92081 6.07727 6.07709C5.92099 6.23337 5.83319 6.44533 5.83319 6.66634C5.83319 6.88735 5.92099 7.09931 6.07727 7.25559C6.23355 7.41187 6.44551 7.49967 6.66652 7.49967Z" fill="#374957"/>
    <path d="M13.3332 9.16699H6.66652C6.44551 9.16699 6.23355 9.25479 6.07727 9.41107C5.92099 9.56735 5.83319 9.77932 5.83319 10.0003C5.83319 10.2213 5.92099 10.4333 6.07727 10.5896C6.23355 10.7459 6.44551 10.8337 6.66652 10.8337H13.3332C13.5542 10.8337 13.7662 10.7459 13.9224 10.5896C14.0787 10.4333 14.1665 10.2213 14.1665 10.0003C14.1665 9.77932 14.0787 9.56735 13.9224 9.41107C13.7662 9.25479 13.5542 9.16699 13.3332 9.16699Z" fill="#374957"/>
    <path d="M13.3332 12.5H6.66652C6.44551 12.5 6.23355 12.5878 6.07727 12.7441C5.92099 12.9004 5.83319 13.1123 5.83319 13.3333C5.83319 13.5544 5.92099 13.7663 6.07727 13.9226C6.23355 14.0789 6.44551 14.1667 6.66652 14.1667H13.3332C13.5542 14.1667 13.7662 14.0789 13.9224 13.9226C14.0787 13.7663 14.1665 13.5544 14.1665 13.3333C14.1665 13.1123 14.0787 12.9004 13.9224 12.7441C13.7662 12.5878 13.5542 12.5 13.3332 12.5Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_817_6403">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    Start New Chat
                  </button>
                  <button type="button" onClick={openCreateGroup}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_817_7649)">
    <path d="M8.33917 2.5L6.66667 2.48833C6.66358 1.82732 6.39883 1.19442 5.93032 0.728104C5.46181 0.261783 4.82769 -7.19772e-06 4.16667 1.48424e-10L2.5 1.48425e-10C1.83696 1.48425e-10 1.20107 0.263392 0.732233 0.732233C0.263392 1.20107 0 1.83696 0 2.5L0 4.16667C-1.80219e-06 4.8287 0.262589 5.4637 0.730169 5.93237C1.19775 6.40105 1.83214 6.66512 2.49417 6.66667L2.4825 8.3275C2.48173 8.43701 2.50255 8.54559 2.54378 8.64704C2.585 8.74849 2.64581 8.84083 2.72274 8.91876C2.79967 8.9967 2.89121 9.05871 2.99211 9.10124C3.09302 9.14378 3.20133 9.16601 3.31083 9.16667H3.31583C3.53584 9.16667 3.74692 9.07968 3.90304 8.92466C4.05915 8.76963 4.14763 8.55917 4.14917 8.33917L4.16083 6.66667H4.16667C4.82971 6.66667 5.46559 6.40327 5.93443 5.93443C6.40327 5.46559 6.66667 4.82971 6.66667 4.16667V4.155L8.3275 4.16667H8.33333C8.44277 4.16705 8.55121 4.14587 8.65246 4.10435C8.75371 4.06282 8.84579 4.00176 8.92344 3.92465C9.0011 3.84754 9.0628 3.75589 9.10503 3.65493C9.14727 3.55397 9.1692 3.44569 9.16958 3.33625C9.16997 3.22682 9.14879 3.11838 9.10727 3.01713C9.06574 2.91587 9.00468 2.82379 8.92757 2.74614C8.85046 2.66849 8.75881 2.60678 8.65785 2.56455C8.55689 2.52232 8.4486 2.50038 8.33917 2.5ZM5 4.16667C5 4.38768 4.9122 4.59964 4.75592 4.75592C4.59964 4.9122 4.38768 5 4.16667 5H2.5C2.27899 5 2.06702 4.9122 1.91074 4.75592C1.75446 4.59964 1.66667 4.38768 1.66667 4.16667V2.5C1.66667 2.27899 1.75446 2.06702 1.91074 1.91074C2.06702 1.75446 2.27899 1.66667 2.5 1.66667H4.16667C4.38768 1.66667 4.59964 1.75446 4.75592 1.91074C4.9122 2.06702 5 2.27899 5 2.5V4.16667Z" fill="#374957"/>
    <path d="M17.4998 0H15.8332C15.1711 -1.80219e-06 14.5361 0.262589 14.0674 0.730169C13.5988 1.19775 13.3347 1.83214 13.3332 2.49417L11.6715 2.4825H11.6665C11.4455 2.48173 11.2332 2.56878 11.0764 2.72452C10.9195 2.88025 10.831 3.0919 10.8302 3.31292C10.8295 3.53393 10.9165 3.7462 11.0723 3.90303C11.228 4.05985 11.4396 4.14839 11.6607 4.14917L13.3332 4.16083V4.16667C13.3332 4.82971 13.5965 5.46559 14.0654 5.93443C14.5342 6.40327 15.1701 6.66667 15.8332 6.66667H15.8448L15.8332 8.3275C15.8324 8.43694 15.8532 8.54545 15.8943 8.64685C15.9355 8.74825 15.9963 8.84055 16.0731 8.91847C16.1499 8.99639 16.2414 9.05842 16.3422 9.10101C16.443 9.14359 16.5512 9.1659 16.6607 9.16667H16.6665C16.8865 9.16667 17.0976 9.07968 17.2537 8.92466C17.4098 8.76963 17.4983 8.55917 17.4998 8.33917L17.5115 6.66667C18.1725 6.66358 18.8054 6.39883 19.2717 5.93032C19.738 5.46181 19.9998 4.82769 19.9998 4.16667V2.5C19.9998 1.83696 19.7364 1.20107 19.2676 0.732233C18.7987 0.263392 18.1629 0 17.4998 0V0ZM18.3332 4.16667C18.3332 4.38768 18.2454 4.59964 18.0891 4.75592C17.9328 4.9122 17.7208 5 17.4998 5H15.8332C15.6121 5 15.4002 4.9122 15.2439 4.75592C15.0876 4.59964 14.9998 4.38768 14.9998 4.16667V2.5C14.9998 2.27899 15.0876 2.06702 15.2439 1.91074C15.4002 1.75446 15.6121 1.66667 15.8332 1.66667H17.4998C17.7208 1.66667 17.9328 1.75446 18.0891 1.91074C18.2454 2.06702 18.3332 2.27899 18.3332 2.5V4.16667Z" fill="#374957"/>
    <path d="M17.5057 13.333L17.5173 11.6713C17.518 11.5619 17.4971 11.4534 17.4558 11.3521C17.4145 11.2507 17.3537 11.1585 17.2768 11.0806C17.1999 11.0028 17.1084 10.9408 17.0075 10.8984C16.9067 10.8559 16.7984 10.8337 16.689 10.833H16.684C16.464 10.833 16.2529 10.92 16.0968 11.075C15.9407 11.23 15.8522 11.4405 15.8507 11.6605L15.839 13.333H15.8332C15.1701 13.333 14.5342 13.5964 14.0654 14.0652C13.5965 14.5341 13.3332 15.17 13.3332 15.833V15.8447L11.6723 15.833H11.6665C11.4455 15.8322 11.2332 15.9193 11.0764 16.075C10.9195 16.2307 10.831 16.4424 10.8302 16.6634C10.8295 16.8844 10.9165 17.0967 11.0723 17.2535C11.228 17.4104 11.4396 17.4989 11.6607 17.4997L13.3332 17.5113C13.3362 18.1723 13.601 18.8052 14.0695 19.2716C14.538 19.7379 15.1721 19.9997 15.8332 19.9997H17.4998C18.1629 19.9997 18.7987 19.7363 19.2676 19.2674C19.7364 18.7986 19.9998 18.1627 19.9998 17.4997V15.833C19.9998 15.171 19.7372 14.536 19.2696 14.0673C18.8021 13.5986 18.1677 13.3345 17.5057 13.333V13.333ZM18.3332 17.4997C18.3332 17.7207 18.2454 17.9326 18.0891 18.0889C17.9328 18.2452 17.7208 18.333 17.4998 18.333H15.8332C15.6121 18.333 15.4002 18.2452 15.2439 18.0889C15.0876 17.9326 14.9998 17.7207 14.9998 17.4997V15.833C14.9998 15.612 15.0876 15.4 15.2439 15.2437C15.4002 15.0875 15.6121 14.9997 15.8332 14.9997H17.4998C17.7208 14.9997 17.9328 15.0875 18.0891 15.2437C18.2454 15.4 18.3332 15.612 18.3332 15.833V17.4997Z" fill="#374957"/>
    <path d="M8.33917 15.8505L6.66667 15.8388V15.833C6.66667 15.17 6.40327 14.5341 5.93443 14.0652C5.46559 13.5964 4.82971 13.333 4.16667 13.333H4.155L4.16667 11.6722C4.16744 11.5627 4.14664 11.4542 4.10547 11.3528C4.0643 11.2514 4.00356 11.1591 3.92672 11.0812C3.84988 11.0033 3.75844 10.9413 3.65763 10.8987C3.55682 10.8561 3.4486 10.8338 3.33917 10.833H3.33333C3.11333 10.833 2.90224 10.92 2.74613 11.075C2.59002 11.23 2.50154 11.4405 2.5 11.6605L2.48833 13.333C1.82732 13.3361 1.19442 13.6008 0.728103 14.0693C0.261783 14.5379 -7.19772e-06 15.172 1.48424e-10 15.833L1.48425e-10 17.4997C1.48425e-10 18.1627 0.263392 18.7986 0.732233 19.2674C1.20107 19.7363 1.83696 19.9997 2.5 19.9997H4.16667C4.8287 19.9997 5.4637 19.7371 5.93237 19.2695C6.40105 18.8019 6.66512 18.1675 6.66667 17.5055L8.32833 17.5172H8.33333C8.55435 17.5179 8.76662 17.4309 8.92344 17.2751C9.08027 17.1194 9.16881 16.9078 9.16958 16.6867C9.17036 16.4657 9.0833 16.2535 8.92757 16.0966C8.77183 15.9398 8.56018 15.8513 8.33917 15.8505V15.8505ZM5 17.4997C5 17.7207 4.9122 17.9326 4.75592 18.0889C4.59964 18.2452 4.38768 18.333 4.16667 18.333H2.5C2.27899 18.333 2.06702 18.2452 1.91074 18.0889C1.75446 17.9326 1.66667 17.7207 1.66667 17.4997V15.833C1.66667 15.612 1.75446 15.4 1.91074 15.2437C2.06702 15.0875 2.27899 14.9997 2.5 14.9997H4.16667C4.38768 14.9997 4.59964 15.0875 4.75592 15.2437C4.9122 15.4 5 15.612 5 15.833V17.4997Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_817_7649">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    Create Group
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="messages_conversation_list">
            {/* <div className="messages_list_section_label">Pinned</div>
            {pinnedSidebarConversations.map((conversation) =>
              renderSidebarConversation(conversation, { pinned: true })
            )} */}
            <div className="messages_list_section_label all_messages">All Messages</div>
            {allSidebarConversations.map((conversation) => renderSidebarConversation(conversation))}
          </div>
        </aside>

        <div className={`messages_main_panel ${isStandalonePanel ? "new_message_mode" : ""}`}>
          {isStandalonePanel ? (
            <div className="messages_new_message_full">{renderMainPanel()}</div>
          ) : (
            <>
              <div className="messages_chat_header">
                <div className="messages_chat_identity">
                  <button type="button" className="messages_mobile_back" onClick={returnToConversationList} aria-label="Back to conversations">
                   <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 171 298" fill="none">
  <path d="M149.35 297.396C146.543 297.413 143.759 296.875 141.16 295.813C138.561 294.751 136.197 293.187 134.204 291.21L6.20357 163.21C2.23022 159.213 0 153.806 0 148.17C0 142.534 2.23022 137.127 6.20357 133.13L134.204 5.12975C138.285 1.63479 143.534 -0.191475 148.903 0.01591C154.272 0.223295 159.366 2.44904 163.165 6.24839C166.964 10.0477 169.19 15.1408 169.397 20.5099C169.605 25.879 167.779 31.1287 164.284 35.2097L51.4302 148.063L164.284 260.916C167.279 263.888 169.327 267.68 170.167 271.815C171.007 275.95 170.602 280.241 169.004 284.145C167.406 288.05 164.685 291.393 161.187 293.752C157.689 296.11 153.569 297.379 149.35 297.396Z" fill="white"/>
</svg>
                  </button>
                  {selectedConversation ? (
                    <>
                      {selectedConversation.isGroup ? (
                        <div className="messages_group_header_avatar" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <circle cx="11" cy="10" r="4" stroke="#0B5064" strokeWidth="1.8" />
                            <circle cx="19.5" cy="10.5" r="3.5" stroke="#0B5064" strokeWidth="1.8" opacity="0.88" />
                            <path d="M4.5 22C4.5 18.9624 6.96243 16.5 10 16.5H12C15.0376 16.5 17.5 18.9624 17.5 22" stroke="#0B5064" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M15 22C15 19.7909 16.7909 18 19 18H20C22.2091 18 24 19.7909 24 22" stroke="#0B5064" strokeWidth="1.8" strokeLinecap="round" opacity="0.88" />
                          </svg>
                        </div>
                      ) : (
                        <ContactAvatar
                          name={selectedConversation.name}
                          avatar={selectedConversation.avatar}
                          avatarClassName={selectedConversation.avatarClassName}
                          large
                        />
                      )}

                      <div>
                        <h2>{selectedConversation.name}</h2>
                        {selectedConversation.isGroup ? (
                          <div className="messages_group_subtitle">{selectedConversation.groupDescription}</div>
                        ) : (
                          <div className="messages_chat_status">
                            <span className={selectedConversation.status}></span>
                            {selectedConversation.role}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="messages_chat_empty_head">
                      <h2>Message Center</h2>
                      <p>Select a chat or create a new message</p>
                    </div>
                  )}
                </div>

                <div className="messages_chat_header_right">
                  <div className="messages_chat_tabs">
                    <button
                      type="button"
                      className={activeTab === "chat" ? "active" : ""}
                      onClick={() => {
                        setActiveTab("chat");
                        setIsSearchOpen(false);
                      }}
                    >
                      Chat
                    </button>
                    <button
                      type="button"
                      className={activeTab === "files" ? "active" : ""}
                      onClick={() => {
                        setActiveTab("files");
                        setIsSearchOpen(false);
                      }}
                    >
                      Files
                    </button>
                  </div>

                  <div className="messages_chat_actions">
                    <button type="button" aria-label="Audio call" disabled={!selectedConversation}  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="#033E4F"/>
</svg>
                    </button>
                    <button type="button" aria-label="Video call" disabled={!selectedConversation}  >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V6.5L20 2.5V13.5L16 9.5V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2ZM2 14H14V2H2V14ZM2 14V2V14Z" fill="#033E4F"/>
</svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Conversation info"
                      className={isInfoOpen ? "active" : ""}
                      onClick={toggleInfo}
                      disabled={!selectedConversation}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_841_10015)">
    <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10 18.3333C8.35183 18.3333 6.74066 17.8446 5.37025 16.9289C3.99984 16.0132 2.93174 14.7117 2.30101 13.189C1.67028 11.6663 1.50525 9.99076 1.82679 8.37425C2.14834 6.75774 2.94201 5.27288 4.10745 4.10744C5.27289 2.94201 6.75774 2.14833 8.37425 1.82679C9.99076 1.50525 11.6663 1.67027 13.189 2.301C14.7118 2.93173 16.0132 3.99984 16.9289 5.37025C17.8446 6.74066 18.3333 8.35182 18.3333 10C18.3309 12.2094 17.4522 14.3276 15.8899 15.8899C14.3276 17.4522 12.2094 18.3309 10 18.3333V18.3333Z" fill="#033E4F"/>
    <path d="M9.99967 8.3335H9.16634C8.94533 8.3335 8.73337 8.42129 8.57709 8.57757C8.42081 8.73385 8.33301 8.94582 8.33301 9.16683C8.33301 9.38784 8.42081 9.5998 8.57709 9.75608C8.73337 9.91237 8.94533 10.0002 9.16634 10.0002H9.99967V15.0002C9.99967 15.2212 10.0875 15.4331 10.2437 15.5894C10.4 15.7457 10.612 15.8335 10.833 15.8335C11.054 15.8335 11.266 15.7457 11.4223 15.5894C11.5785 15.4331 11.6663 15.2212 11.6663 15.0002V10.0002C11.6663 9.55814 11.4907 9.13421 11.1782 8.82165C10.8656 8.50909 10.4417 8.3335 9.99967 8.3335Z" fill="#033E4F"/>
    <path d="M10 6.6665C10.6904 6.6665 11.25 6.10686 11.25 5.4165C11.25 4.72615 10.6904 4.1665 10 4.1665C9.30964 4.1665 8.75 4.72615 8.75 5.4165C8.75 6.10686 9.30964 6.6665 10 6.6665Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_841_10015">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Search in chat"
                      className={isSearchOpen ? "active" : ""}
                      onClick={toggleSearch}
                      disabled={!selectedConversation}
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clipPath="url(#clip0_841_7662)">
    <path d="M19.7557 18.5783L14.7815 13.6041C16.137 11.9463 16.8035 9.83087 16.643 7.69543C16.4826 5.55999 15.5075 3.5679 13.9195 2.13123C12.3315 0.694554 10.252 -0.0767949 8.11119 -0.0232684C5.97039 0.0302581 3.93207 0.904564 2.41783 2.41881C0.903588 3.93305 0.0292815 5.97137 -0.024245 8.11216C-0.0777715 10.253 0.693577 12.3324 2.13025 13.9205C3.56693 15.5085 5.55901 16.4836 7.69445 16.644C9.8299 16.8044 11.9453 16.138 13.6032 14.7825L18.5773 19.7566C18.7345 19.9084 18.945 19.9924 19.1635 19.9905C19.382 19.9886 19.591 19.901 19.7455 19.7465C19.9 19.592 19.9877 19.383 19.9896 19.1645C19.9914 18.946 19.9075 18.7355 19.7557 18.5783ZM8.33315 15.0008C7.01461 15.0008 5.72568 14.6098 4.62935 13.8773C3.53302 13.1447 2.67854 12.1035 2.17395 10.8854C1.66937 9.66718 1.53735 8.32673 1.79458 7.03353C2.05182 5.74032 2.68676 4.55243 3.61911 3.62008C4.55146 2.68773 5.73934 2.05279 7.03255 1.79556C8.32576 1.53832 9.6662 1.67035 10.8844 2.17493C12.1025 2.67952 13.1437 3.534 13.8763 4.63033C14.6088 5.72665 14.9998 7.01559 14.9998 8.33413C14.9978 10.1016 14.2948 11.7962 13.045 13.046C11.7952 14.2958 10.1007 14.9988 8.33315 15.0008Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_841_7662">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`messages_panel_body ${isInfoOpen ? "with_info" : ""}`}>
                <div className="messages_panel_primary">{renderMainPanel()}</div>

                {isInfoOpen && selectedConversation ? (
                  selectedConversation.isGroup ? (
                    groupSettingsView ? renderGroupSettingsPanel(selectedConversation) : renderGroupInfoPanel(selectedConversation)
                  ) : (
                  <aside className="messages_info_panel">
                    <div className="messages_info_head">
                      <h3>Information</h3>
                      <button type="button" aria-label="Close information panel" onClick={toggleInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="7.25" stroke="#FF5B3A" strokeWidth="1.5" />
                          <path d="M6.5 6.5L11.5 11.5" stroke="#FF5B3A" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M11.5 6.5L6.5 11.5" stroke="#FF5B3A" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    <div className="messages_info_profile">
                      <ContactAvatar
                        name={selectedConversation.name}
                        avatar={selectedConversation.avatar}
                        avatarClassName={selectedConversation.avatarClassName}
                        large
                      />
                      <h3>{selectedConversation.name}</h3>
                      <p>{selectedContactInfo?.subtitle ?? selectedConversation.role}</p>
                    </div>

                    <div className="messages_info_quick_actions">
                      <button type="button" aria-label="Audio call" onClick={() => openCallScreen("audio")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="#033E4F"/>
</svg>
                      </button>
                      <button type="button" aria-label="Video call" onClick={() => openCallScreen("video")}>
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V6.5L20 2.5V13.5L16 9.5V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2ZM2 14H14V2H2V14ZM2 14V2V14Z" fill="#033E4F"/>
</svg>
                      </button>
                    </div>

                    <div className="messages_info_stats">
                      <div className="messages_info_stat_card">
                        <span>Messages</span>
                        <strong>{selectedConversation.messages.length}</strong>
                      </div>
                      <div className="messages_info_stat_card">
                        <span>Days active</span>
                        <strong>{selectedContactInfo?.daysActive ?? 1}</strong>
                      </div>
                    </div>

                    <div className="messages_info_section">
                      <h4>Contact information</h4>
                      <div className="messages_info_detail_card">
                        <div className="messages_info_detail_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#033E4F"/>
</svg>
                        </div>
                        <div>
                          <strong>{selectedContactInfo?.title ?? selectedConversation.name}</strong>
                          <span>{selectedContactInfo?.phone}</span>
                        </div>
                      </div>
                      <div className="messages_info_detail_card">
                        <div className="messages_info_detail_icon">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z" fill="#033E4F"/>
</svg>
                        </div>
                        <div>
                          <strong>{selectedContactInfo?.email}</strong>
                          <span>{selectedContactInfo?.preferredLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="messages_info_section">
                   
                      <div className="messages_info_status_card">
                           <h4>Status</h4>
                           <div className="flex_bxx">
  <span className={`messages_info_status_dot ${selectedConversation.status}`}></span>
                        <strong>{selectedContactInfo?.statusText ?? selectedConversation.role}</strong>
                           </div>
                      
                      </div>
                    </div>
                  </aside>
                  )
                ) : null}
              </div>

              <div className="messages_composer_wrap">
                <div
                  className={`messages_composer ${isDragActive ? "drag_active" : ""}`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    const nextTarget = event.relatedTarget as Node | null;
                    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                      setIsDragActive(false);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0] ?? null;
                    storeAttachedFile(file);
                  }}
                >
                  {copiedToast ? (
                    <div className="messages_copied_toast">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="6" y="5.25" width="7.5" height="9" rx="1.4" fill="#033E4F" />
                        <path d="M4.5 12.75H4.125C3.50368 12.75 3 12.2463 3 11.625V4.125C3 3.50368 3.50368 3 4.125 3H10.125C10.7463 3 11.25 3.50368 11.25 4.125V4.5" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>{copiedToast}</span>
                    </div>
                  ) : null}
                  {isDragActive ? (
                    <div className="messages_drag_overlay">
                      <strong>Drop file to attach</strong>
                      <span>Release to add it to this message</span>
                    </div>
                  ) : null}

                  <div className="messages_composer_tools">
                    <button type="button">
                      <strong><svg xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 12" fill="none">
  <path d="M0 11.6667V0H4.60417C5.50694 0 6.34028 0.277778 7.10417 0.833333C7.86806 1.38889 8.25 2.15972 8.25 3.14583C8.25 3.85417 8.09028 4.39931 7.77083 4.78125C7.45139 5.16319 7.15278 5.4375 6.875 5.60417C7.22222 5.75694 7.60764 6.04167 8.03125 6.45833C8.45486 6.875 8.66667 7.5 8.66667 8.33333C8.66667 9.56944 8.21528 10.434 7.3125 10.9271C6.40972 11.4201 5.5625 11.6667 4.77083 11.6667H0ZM2.52083 9.33333H4.6875C5.35417 9.33333 5.76042 9.16319 5.90625 8.82292C6.05208 8.48264 6.125 8.23611 6.125 8.08333C6.125 7.93056 6.05208 7.68403 5.90625 7.34375C5.76042 7.00347 5.33333 6.83333 4.625 6.83333H2.52083V9.33333ZM2.52083 4.58333H4.45833C4.91667 4.58333 5.25 4.46528 5.45833 4.22917C5.66667 3.99306 5.77083 3.72917 5.77083 3.4375C5.77083 3.10417 5.65278 2.83333 5.41667 2.625C5.18056 2.41667 4.875 2.3125 4.5 2.3125H2.52083V4.58333Z" fill="#494949"/>
</svg></strong>
                    </button>
                    <button type="button">
                      <em><svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
  <path d="M0 11.6667V9.58333H3.33333L5.83333 2.08333H2.5V0H10.8333V2.08333H7.91667L5.41667 9.58333H8.33333V11.6667H0Z" fill="#494949"/>
</svg></em>
                    </button>
                    <div
                      className={`messages_upload_tooltip_wrap ${isUploadHintVisible ? "visible" : ""}`}
                      onMouseEnter={() => setIsUploadHintVisible(true)}
                      onMouseLeave={() => setIsUploadHintVisible(false)}
                    >
                      <button
                        type="button"
                        aria-label="Upload file"
                        onClick={() => fileInputRef.current?.click()}
                        onFocus={() => setIsUploadHintVisible(true)}
                        onBlur={() => setIsUploadHintVisible(false)}
                      >
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M11.4212 4.7791C11.3274 4.68536 11.2003 4.6327 11.0677 4.6327C10.9351 4.6327 10.8079 4.68536 10.7142 4.7791L5.26818 10.2486C5.03603 10.4808 4.76043 10.665 4.45711 10.7906C4.15379 10.9163 3.82868 10.981 3.50036 10.981C2.83727 10.981 2.20133 10.7177 1.73243 10.2488C1.26353 9.78001 1.00007 9.1441 1.00003 8.48102C0.999979 7.81794 1.26334 7.182 1.73218 6.7131L7.00668 1.4171C7.28872 1.13954 7.66902 0.984682 8.06472 0.986246C8.46043 0.987811 8.83949 1.14567 9.11933 1.42545C9.39917 1.70522 9.55712 2.08425 9.55878 2.47995C9.56044 2.87566 9.40567 3.25599 9.12818 3.5381L3.85368 8.8341C3.75855 8.92523 3.63191 8.9761 3.50018 8.9761C3.36845 8.9761 3.2418 8.92523 3.14668 8.8341C3.05294 8.74033 3.00029 8.61318 3.00029 8.4806C3.00029 8.34801 3.05294 8.22086 3.14668 8.1271L7.84268 3.4096C7.93376 3.3153 7.98415 3.18899 7.98302 3.0579C7.98188 2.9268 7.92929 2.80139 7.83659 2.70869C7.74388 2.61598 7.61848 2.5634 7.48738 2.56226C7.35628 2.56112 7.22998 2.61152 7.13568 2.7026L2.43968 7.4201C2.30036 7.55939 2.18985 7.72476 2.11445 7.90676C2.03906 8.08877 2.00025 8.28384 2.00025 8.48085C2.00025 8.67785 2.03906 8.87293 2.11445 9.05493C2.18985 9.23694 2.30036 9.40231 2.43968 9.5416C2.72549 9.81433 3.10537 9.9665 3.50043 9.9665C3.89549 9.9665 4.27537 9.81433 4.56118 9.5416L9.83518 4.2451C10.2942 3.77425 10.5492 3.14152 10.545 2.48398C10.5408 1.82644 10.2777 1.19704 9.81267 0.732108C9.34768 0.26718 8.71823 0.00416912 8.06069 4.91387e-05C7.40315 -0.00407084 6.77046 0.251032 6.29968 0.710097L1.02518 6.0061C0.368768 6.66251 -9.78128e-09 7.55279 0 8.4811C9.78128e-09 9.4094 0.368768 10.2997 1.02518 10.9561C1.68159 11.6125 2.57187 11.9813 3.50018 11.9813C4.42848 11.9813 5.31877 11.6125 5.97518 10.9561L11.4212 5.4881C11.4679 5.44163 11.505 5.38639 11.5303 5.32556C11.5556 5.26472 11.5686 5.19948 11.5686 5.1336C11.5686 5.06771 11.5556 5.00247 11.5303 4.94164C11.505 4.8808 11.4679 4.82556 11.4212 4.7791V4.7791Z" fill="#494949"/>
</svg>
                      </button>
                      <div className="messages_upload_tooltip">
                        <span>Upload File</span>
                      </div>
                    </div>
                    <span></span>
                  </div>

                  {replyingTo ? (
                    <div className="messages_reply_preview">
                      <div>
                        <strong>Replying to {replyingTo.author}</strong>
                        <span>{replyingTo.text}</span>
                      </div>
                      <button type="button" onClick={() => setReplyingTo(null)} aria-label="Cancel reply">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M5.25 5.25L12.75 12.75" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M12.75 5.25L5.25 12.75" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ) : null}

                  {attachedFile ? (
                    <div className="messages_attachment_preview">
                      <div className="messages_attachment_preview_icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M7 10.5H8V8.5H9C9.28333 8.5 9.52083 8.40417 9.7125 8.2125C9.90417 8.02083 10 7.78333 10 7.5V6.5C10 6.21667 9.90417 5.97917 9.7125 5.7875C9.52083 5.59583 9.28333 5.5 9 5.5H7V10.5ZM8 7.5V6.5H9V7.5H8ZM11 10.5H13C13.2833 10.5 13.5208 10.4042 13.7125 10.2125C13.9042 10.0208 14 9.78333 14 9.5V6.5C14 6.21667 13.9042 5.97917 13.7125 5.7875C13.5208 5.59583 13.2833 5.5 13 5.5H11V10.5ZM12 9.5V6.5H13V9.5H12ZM15 10.5H16V8.5H17V7.5H16V6.5H17V5.5H15V10.5ZM6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6ZM6 14H18V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H16V20H2ZM6 2V14V2Z" fill="#E4432D"/>
</svg>
                      </div>
                      <div>
                        <strong>{attachedFile.name}</strong>
                        <span>{attachedFile.size}</span>
                      </div>
                      <button type="button" onClick={() => setAttachedFile(null)} aria-label="Remove attached file">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clipPath="url(#clip0_841_8614)">
    <path d="M11.9996 5.99986C11.8589 5.85926 11.6682 5.78027 11.4693 5.78027C11.2705 5.78027 11.0797 5.85926 10.9391 5.99986L8.99959 7.93936L7.06009 5.99986C6.91864 5.86324 6.72919 5.78765 6.53254 5.78936C6.3359 5.79107 6.14779 5.86994 6.00873 6.009C5.86968 6.14806 5.7908 6.33616 5.78909 6.53281C5.78738 6.72946 5.86298 6.91891 5.9996 7.06036L7.93909 8.99986L5.9996 10.9394C5.86298 11.0808 5.78738 11.2703 5.78909 11.4669C5.7908 11.6636 5.86968 11.8517 6.00873 11.9907C6.14779 12.1298 6.3359 12.2087 6.53254 12.2104C6.72919 12.2121 6.91864 12.1365 7.06009 11.9999L8.99959 10.0604L10.9391 11.9999C11.0805 12.1365 11.27 12.2121 11.4666 12.2104C11.6633 12.2087 11.8514 12.1298 11.9904 11.9907C12.1295 11.8517 12.2084 11.6636 12.2101 11.4669C12.2118 11.2703 12.1362 11.0808 11.9996 10.9394L10.0601 8.99986L11.9996 7.06036C12.1402 6.91972 12.2192 6.72899 12.2192 6.53011C12.2192 6.33124 12.1402 6.14051 11.9996 5.99986Z" fill="#E4432D"/>
    <path d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389957 7.20038 -0.17433 9.00998 0.172937 10.7558C0.520204 12.5016 1.37737 14.1053 2.63604 15.364C3.89472 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9974 6.61384 17.0484 4.32616 15.3611 2.63889C13.6738 0.951621 11.3862 0.00258081 9 0V0ZM9 16.5C7.51664 16.5 6.0666 16.0601 4.83323 15.236C3.59986 14.4119 2.63856 13.2406 2.07091 11.8701C1.50325 10.4997 1.35473 8.99168 1.64411 7.53682C1.9335 6.08197 2.64781 4.74559 3.6967 3.6967C4.7456 2.64781 6.08197 1.9335 7.53683 1.64411C8.99168 1.35472 10.4997 1.50325 11.8701 2.0709C13.2406 2.63856 14.4119 3.59985 15.236 4.83322C16.0601 6.06659 16.5 7.51664 16.5 9C16.4978 10.9885 15.7069 12.8948 14.3009 14.3009C12.8948 15.7069 10.9885 16.4978 9 16.5V16.5Z" fill="#E4432D"/>
  </g>
  <defs>
    <clipPath id="clip0_841_8614">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>
                      </button>
                    </div>
                  ) : null}

                  <div className="messages_composer_main">
                    <button
                      type="button"
                      className="messages_composer_icon_btn"
                      aria-label="Add attachment"
                      onClick={() => fileInputRef.current?.click()}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#494949"/>
</svg>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="messages_file_input"
                      onChange={handleAttachmentChange}
                    />

                    <input
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                    />

                    <div className="messages_emoji_picker_wrap" ref={emojiPickerRef}>
                      <button
                        type="button"
                        className={`messages_composer_icon_btn ${isEmojiPickerOpen ? "active" : ""}`}
                        aria-label="Emoji"
                        aria-expanded={isEmojiPickerOpen}
                        onClick={() => setIsEmojiPickerOpen((current) => !current)}
                      >
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M13.5 9C13.9167 9 14.2708 8.85417 14.5625 8.5625C14.8542 8.27083 15 7.91667 15 7.5C15 7.08333 14.8542 6.72917 14.5625 6.4375C14.2708 6.14583 13.9167 6 13.5 6C13.0833 6 12.7292 6.14583 12.4375 6.4375C12.1458 6.72917 12 7.08333 12 7.5C12 7.91667 12.1458 8.27083 12.4375 8.5625C12.7292 8.85417 13.0833 9 13.5 9ZM6.5 9C6.91667 9 7.27083 8.85417 7.5625 8.5625C7.85417 8.27083 8 7.91667 8 7.5C8 7.08333 7.85417 6.72917 7.5625 6.4375C7.27083 6.14583 6.91667 6 6.5 6C6.08333 6 5.72917 6.14583 5.4375 6.4375C5.14583 6.72917 5 7.08333 5 7.5C5 7.91667 5.14583 8.27083 5.4375 8.5625C5.72917 8.85417 6.08333 9 6.5 9ZM10 15.5C11.1333 15.5 12.1625 15.1792 13.0875 14.5375C14.0125 13.8958 14.6833 13.05 15.1 12H13.45C13.0833 12.6167 12.5958 13.1042 11.9875 13.4625C11.3792 13.8208 10.7167 14 10 14C9.28333 14 8.62083 13.8208 8.0125 13.4625C7.40417 13.1042 6.91667 12.6167 6.55 12H4.9C5.31667 13.05 5.9875 13.8958 6.9125 14.5375C7.8375 15.1792 8.86667 15.5 10 15.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#494949"/>
</svg>
                      </button>

                      {isEmojiPickerOpen ? (
                        <div className="messages_emoji_picker" aria-label="Choose emoji">
                          <EmojiPicker
                            onEmojiClick={addEmojiToDraft}
                            theme={Theme.LIGHT}
                            width={320}
                            height={360}
                            lazyLoadEmojis
                            previewConfig={{ showPreview: false }}
                            searchPlaceholder="Search emoji"
                          />
                        </div>
                      ) : null}
                    </div>

                    <button type="button" className="messages_send_btn" onClick={sendMessage}>
                      Send
                      <img src="/icn/send_icn.svg" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      )}
      {renderPreviewModal()}
      {memberPendingRemoval ? (
        <div className="messages_group_confirm_modal" role="dialog" aria-modal="true">
          <div className="messages_preview_backdrop" onClick={() => setMemberPendingRemoval(null)}></div>
          <div className="messages_group_confirm_card">
            <span className="messages_group_frame_label">Messages - Group Remove Member</span>
            <h3>Remove {memberPendingRemoval.name}?</h3>
            <p>This member will lose access to future updates in this group conversation.</p>
            <div className="messages_group_flow_actions">
              <button type="button" className="kinnect-btn-secondary" onClick={() => setMemberPendingRemoval(null)}>
                Cancel
              </button>
              <button type="button" className="kinnect-btn-primary" onClick={() => removeGroupMember(memberPendingRemoval.id)}>
                Remove Member
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isLeaveGroupOpen ? (
        <div className="messages_group_confirm_modal" role="dialog" aria-modal="true">
          <div className="messages_preview_backdrop" onClick={() => setIsLeaveGroupOpen(false)}></div>
          <div className="messages_group_confirm_card messages_group_confirm_card_leave">
            <div className="messages_group_confirm_icon" aria-hidden="true">
         <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
  <g clipPath="url(#clip0_871_10178)">
    <path d="M12.4323 16.25C12.145 16.25 11.8695 16.3641 11.6663 16.5673C11.4631 16.7705 11.349 17.046 11.349 17.3333V20.5833C11.349 21.4453 11.0066 22.2719 10.3971 22.8814C9.7876 23.4909 8.96095 23.8333 8.099 23.8333H5.41667C4.55471 23.8333 3.72806 23.4909 3.11857 22.8814C2.50908 22.2719 2.16667 21.4453 2.16667 20.5833V5.41667C2.16667 4.55471 2.50908 3.72806 3.11857 3.11857C3.72806 2.50908 4.55471 2.16667 5.41667 2.16667H8.099C8.96095 2.16667 9.7876 2.50908 10.3971 3.11857C11.0066 3.72806 11.349 4.55471 11.349 5.41667V8.66667C11.349 8.95398 11.4631 9.22953 11.6663 9.4327C11.8695 9.63586 12.145 9.75 12.4323 9.75C12.7197 9.75 12.9952 9.63586 13.1984 9.4327C13.4015 9.22953 13.5157 8.95398 13.5157 8.66667V5.41667C13.5139 3.98061 12.9427 2.60385 11.9273 1.5884C10.9118 0.572955 9.53506 0.00172018 8.099 0H5.41667C3.98061 0.00172018 2.60385 0.572955 1.5884 1.5884C0.572955 2.60385 0.00172018 3.98061 0 5.41667L0 20.5833C0.00172018 22.0194 0.572955 23.3961 1.5884 24.4116C2.60385 25.427 3.98061 25.9983 5.41667 26H8.099C9.53506 25.9983 10.9118 25.427 11.9273 24.4116C12.9427 23.3961 13.5139 22.0194 13.5157 20.5833V17.3333C13.5157 17.046 13.4015 16.7705 13.1984 16.5673C12.9952 16.3641 12.7197 16.25 12.4323 16.25Z" fill="#374957"/>
    <path d="M24.7729 10.7022L19.8047 5.73405C19.7048 5.63058 19.5853 5.54805 19.4531 5.49127C19.3209 5.4345 19.1788 5.40461 19.0349 5.40336C18.8911 5.40211 18.7484 5.42952 18.6153 5.48399C18.4822 5.53846 18.3612 5.6189 18.2595 5.72062C18.1578 5.82234 18.0773 5.94329 18.0229 6.07643C17.9684 6.20957 17.941 6.35222 17.9422 6.49607C17.9435 6.63991 17.9734 6.78207 18.0301 6.91424C18.0869 7.04641 18.1694 7.16595 18.2729 7.26588L22.8901 11.8841L6.50033 11.9166C6.21301 11.9166 5.93746 12.0308 5.73429 12.2339C5.53113 12.4371 5.41699 12.7126 5.41699 13C5.41699 13.2873 5.53113 13.5628 5.73429 13.766C5.93746 13.9692 6.21301 14.0833 6.50033 14.0833L22.954 14.0497L18.2707 18.734C18.1673 18.834 18.0847 18.9535 18.028 19.0857C17.9712 19.2179 17.9413 19.36 17.9401 19.5039C17.9388 19.6477 17.9662 19.7904 18.0207 19.9235C18.0752 20.0566 18.1556 20.1776 18.2573 20.2793C18.359 20.381 18.48 20.4615 18.6131 20.5159C18.7463 20.5704 18.8889 20.5978 19.0328 20.5966C19.1766 20.5953 19.3188 20.5654 19.4509 20.5087C19.5831 20.4519 19.7026 20.3694 19.8026 20.2659L24.7707 15.2977C25.3803 14.6885 25.723 13.8622 25.7234 13.0004C25.7238 12.1386 25.3819 11.312 24.7729 10.7022Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_871_10178">
      <rect width="26" height="26" fill="white"/>
    </clipPath>
  </defs>
</svg>
            </div>
       
            <h3>Are you sure you want to leave this group?</h3>
            <p>You will no longer receive messages or updates.</p>
            <div className="messages_group_flow_actions">
              <button type="button" className="kinnect-btn-secondary" onClick={() => setIsLeaveGroupOpen(false)}>
                No
              </button>
              <button type="button" className="kinnect-btn-primary" onClick={leaveSelectedGroup}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
