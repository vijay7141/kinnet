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

type MessageItem = {
  id: number;
  sender: "contact" | "me";
  author: string;
  text: string;
  time: string;
  read?: boolean;
  pinned?: boolean;
  pinnedTitle?: string;
  deliveryStatus?: "Read" | "Delivered";
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

const getAttachmentKind = (fileName: string) => {
  const extension = getAttachmentExtension(fileName);

  if (imageExtensions.has(extension)) {
    return "image";
  }

  if (videoExtensions.has(extension)) {
    return "video";
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
          <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82" fill="none">
            <path d="M17 22C17 15.9249 21.9249 11 28 11H54C60.0751 11 65 15.9249 65 22V49C65 55.0751 60.0751 60 54 60H38.3909L25.0476 70.8953C23.4144 72.2284 21 71.0672 21 68.9584V60.5C18.7909 58.5476 17 54.9475 17 50.5V22Z" fill="#A9D6DC" />
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

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

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
    setIsInfoOpen(true);
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
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4.667V18.083" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8.75 12.833L14 18.083L19.25 12.833" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.833 22.167H22.167" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );

  const renderPreviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.25 12C3.9967 8.12806 7.66483 5.625 12 5.625C16.3352 5.625 20.0033 8.12806 21.75 12C20.0033 15.8719 16.3352 18.375 12 18.375C7.66483 18.375 3.9967 15.8719 2.25 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
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
      return <span>PDF</span>;
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
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none">
        <path d="M5.25 1.5H17.25L25 9.25V26.75C25 28.8211 23.3211 30.5 21.25 30.5H5.25C3.17893 30.5 1.5 28.8211 1.5 26.75V5.25C1.5 3.17893 3.17893 1.5 5.25 1.5Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M17 2V9.5H24.5" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M8 17H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M8 23H16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 8L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
            <div>
              <span>Messages - Image View</span>
              <h3>{attachment.name}</h3>
              <p>
                {attachment.size} &bull; Shared by {attachment.author} at {attachment.time}
              </p>
            </div>
            <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
              {renderDownloadIcon()}
              Download
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
            <div>
              <span>Messages - Video Preview</span>
              <h3>{attachment.name}</h3>
              <p>
                {attachment.size} &bull; Shared by {attachment.author} at {attachment.time}
              </p>
            </div>
            <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
              {renderDownloadIcon()}
              Download
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

    return (
      <div className="messages_media_preview file_view">
        <div className="messages_media_preview_head">
          <div>
            <span>Messages - File Preview</span>
            <h3>{attachment.name}</h3>
            <p>
              {attachment.size} &bull; {getAttachmentTypeLabel(attachment.name)} &bull; Shared by {attachment.author}
            </p>
          </div>
          <button type="button" onClick={() => handleDownloadAttachment(attachment)}>
            {renderDownloadIcon()}
            Download
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
                  id: Date.now(),
                  sender: "me",
                  author: "Me",
                  text: trimmedMessage,
                  time: "Now",
                  read: true,
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
  <g clip-path="url(#clip0_462_12680)">
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
  <g clip-path="url(#clip0_817_9427)">
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
    const isAdmin = Boolean(conversation.createdByMe || members.find((member) => member.id === "me" && member.isAdmin));
    const currentView = groupSettingsView ?? "settings";
    const frameLabel =
      currentView === "members"
        ? "Group - Settings/Members"
        : currentView === "notifications"
          ? "Group - Settings/Notifications"
          : "Group - Settings";

    return (
      <aside className="messages_info_panel messages_group_settings_panel">
        <div className="messages_group_settings_head">
          <button type="button" className="messages_group_back_btn" onClick={() => setGroupSettingsView(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11.25 14.25L6 9L11.25 3.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <span>{frameLabel}</span>
            <h3>Group Settings</h3>
          </div>
          <button type="button" className="messages_group_close_btn" aria-label="Close group settings" onClick={toggleInfo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="messages_group_settings_profile">
          <div className="messages_group_settings_avatar" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 42 42" fill="none">
              <circle cx="15.5" cy="15" r="5.25" stroke="#0B5064" strokeWidth="2.2" />
              <circle cx="25.75" cy="15.75" r="4.5" stroke="#0B5064" strokeWidth="2.2" opacity="0.88" />
              <path d="M7.75 30.25C7.75 25.9698 11.2198 22.5 15.5 22.5H18C22.2802 22.5 25.75 25.9698 25.75 30.25" stroke="#0B5064" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M21.5 30.25C21.5 27.2124 23.9624 24.75 27 24.75H28.5C31.5376 24.75 34 27.2124 34 30.25" stroke="#0B5064" strokeWidth="2.2" strokeLinecap="round" opacity="0.88" />
            </svg>
          </div>
          <div>
            <h4>{conversation.name}</h4>
            <p>{conversation.groupDescription}</p>
          </div>
        </div>

        <div className="messages_group_settings_tabs" role="tablist" aria-label="Group settings sections">
          <button
            type="button"
            className={currentView === "settings" ? "active" : ""}
            onClick={() => setGroupSettingsView("settings")}
          >
            Settings
          </button>
          <button
            type="button"
            className={currentView === "members" ? "active" : ""}
            onClick={() => setGroupSettingsView("members")}
          >
            Members
          </button>
          <button
            type="button"
            className={currentView === "notifications" ? "active" : ""}
            onClick={() => setGroupSettingsView("notifications")}
          >
            Notifications
          </button>
        </div>

        {currentView === "settings" ? (
          <div className="messages_group_settings_content">
            <section className="messages_group_setting_card">
              <div>
                <h4>Group Name</h4>
                <p>{conversation.name}</p>
              </div>
              <button type="button">Edit</button>
            </section>
            <section className="messages_group_setting_card">
              <div>
                <h4>Description</h4>
                <p>{conversation.groupDescription}</p>
              </div>
              <button type="button">Edit</button>
            </section>
            <section className="messages_group_setting_card split">
              <div>
                <h4>Invite Permissions</h4>
                <p>{isAdmin ? "Admins and care team members can invite people." : "Only admins can invite people."}</p>
              </div>
              <span>{isAdmin ? "Admin" : "Member"}</span>
            </section>
            <button type="button" className="messages_group_danger_action messages_group_leave_btn v2" onClick={() => setIsLeaveGroupOpen(true)}>
              Leave Group
            </button>
          </div>
        ) : null}

        {currentView === "members" ? (
          <div className="messages_group_settings_content">
            <div className="messages_group_settings_search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.875 16.875L12.9876 12.9876M14.625 8.4375C14.625 11.8553 11.8553 14.625 8.4375 14.625C5.01974 14.625 2.25 11.8553 2.25 8.4375C2.25 5.01974 5.01974 2.25 8.4375 2.25C11.8553 2.25 14.625 5.01974 14.625 8.4375Z" stroke="#0B5064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                placeholder="Search members..."
                value={groupDirectorySearch}
                onChange={(event) => setGroupDirectorySearch(event.target.value)}
              />
            </div>
            <button type="button" className="messages_group_add_member_btn" onClick={() => setIsGroupDirectoryOpen((current) => !current)}>
              Add Member
            </button>
            {isGroupDirectoryOpen ? (
              <div className="messages_group_directory_panel compact">
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
            <div className="messages_group_settings_member_list">
              {members.map((member) => (
                <article key={member.id} className="messages_group_setting_member">
                  <div className="messages_group_member_identity_v2">
                    <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
                    <div>
                      <h4>{member.name}</h4>
                      <span>{member.id === "me" ? "Specialist - Surgery" : member.role}</span>
                    </div>
                  </div>
                  {member.isAdmin ? <strong>Admin</strong> : null}
                  {isAdmin && member.id !== "me" ? (
                    <button type="button" aria-label={`Remove ${member.name}`} onClick={() => setMemberPendingRemoval(member)}>
                      Remove
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {currentView === "notifications" ? (
          <div className="messages_group_settings_content">
            <section className="messages_group_notification_card">
              <div>
                <h4>Mute Group Notifications</h4>
                <p>Pause push and in-app alerts for this group.</p>
              </div>
              <button
                type="button"
                className={`messages_group_switch ${conversation.notificationsMuted ? "active" : ""}`}
                onClick={toggleGroupNotifications}
                aria-pressed={conversation.notificationsMuted}
              >
                <span></span>
              </button>
            </section>
            <section className="messages_group_notification_card">
              <div>
                <h4>Mentions</h4>
                <p>Notify me when someone mentions my name.</p>
              </div>
              <button type="button" className="messages_group_switch active" aria-pressed="true">
                <span></span>
              </button>
            </section>
            <section className="messages_group_notification_card">
              <div>
                <h4>Shared Files</h4>
                <p>Alert me when new documents are uploaded.</p>
              </div>
              <button type="button" className="messages_group_switch active" aria-pressed="true">
                <span></span>
              </button>
            </section>
          </div>
        ) : null}
      </aside>
    );
  };

  // Implements: Messages - new group info, Group Admin variants, Leave Group,
  // Group Remove Member, and the Group Settings/Members/Notifications tabs.
  const renderGroupInfoPanel = (conversation: Conversation) => {
    const members = conversation.members ?? [];
    const isAdmin = Boolean(conversation.createdByMe || members.find((member) => member.id === "me" && member.isAdmin));
    const groupMemberCountDisplay = conversation.id === "icu-team" ? 24 : members.length;
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
                  setGroupSettingsView("members");
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
  <g clip-path="url(#clip0_817_8142)">
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
  <g clip-path="url(#clip0_817_6148)">
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
                    <path d="M10.6673 2.66699L13.3339 5.33366L10.6673 6.00033L8.66732 8.00033L12.0007 11.3337L10.6673 12.667L7.33398 9.33366L5.33398 11.3337L4.66732 14.0003L2.00065 11.3337L4.00065 8.00033L2.00065 4.66699L3.33398 3.33366L6.66732 5.33366L8.66732 3.33366L10.6673 2.66699Z" fill="#E4432D" />
                  </svg>
                  <div className="messages_pinned_content">
                    <span className="messages_pinned_author">Pinned by {message.author}</span>
                    <strong>{message.pinnedTitle ?? message.attachment?.name ?? "Pinned Update"}</strong>
                    <span className="messages_pinned_text">{message.text}</span>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 6.25L3.75 10L7.5 13.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.167 10H12.5C15.031 10 16.667 11.831 16.667 14.167V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12.917 2.917L17.083 7.083L13.542 8.125L11.25 10.417L15 14.167L13.333 15.833L9.583 12.083L7.292 14.375L6.25 17.917L2.083 13.75L5.625 12.708L7.917 10.417L4.167 6.667L5.833 5L9.583 8.75L11.875 6.458L12.917 2.917Z" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {message.pinned ? "Unpin" : "Pin"}
                        </button>
                        <button type="button" onClick={() => handleCopy(message)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="5.833" y="5.833" width="10" height="10" rx="1.667" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M4.167 12.5H3.75C2.829 12.5 2.083 11.754 2.083 10.833V3.75C2.083 2.829 2.829 2.083 3.75 2.083H10.833C11.754 2.083 12.5 2.829 12.5 3.75V4.167" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
      {incomingCallAlert ? (
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.4593 12.6439C18.2941 12.8552 18.0653 13.0076 17.8067 13.0788C17.5481 13.15 17.2735 13.1361 17.0234 13.0393L13.1953 11.6807L13.1726 11.6721C12.9812 11.5955 12.8117 11.4727 12.6792 11.3147C12.5467 11.1568 12.4553 10.9685 12.4133 10.7666L11.9281 8.44238C10.6694 8.0135 9.30364 8.01652 8.04685 8.45098L7.58591 10.7572C7.54526 10.9613 7.4543 11.152 7.32128 11.312C7.18827 11.4721 7.0174 11.5964 6.82419 11.6736L6.80154 11.6822L2.97341 13.0393C2.83131 13.0953 2.68005 13.1244 2.52732 13.1252C2.3372 13.1255 2.1495 13.0825 1.97852 12.9994C1.80753 12.9163 1.65776 12.7952 1.5406 12.6455C0.194505 10.9096 0.345286 8.60566 1.907 7.04316C6.29372 2.65488 13.7039 2.65488 18.0929 7.04316C19.6547 8.6041 19.8054 10.908 18.4593 12.6439ZM16.875 15.0002H3.12497C2.95921 15.0002 2.80024 15.066 2.68303 15.1833C2.56582 15.3005 2.49997 15.4594 2.49997 15.6252C2.49997 15.791 2.56582 15.9499 2.68303 16.0671C2.80024 16.1843 2.95921 16.2502 3.12497 16.2502H16.875C17.0407 16.2502 17.1997 16.1843 17.3169 16.0671C17.4341 15.9499 17.5 15.791 17.5 15.6252C17.5 15.4594 17.4341 15.3005 17.3169 15.1833C17.1997 15.066 17.0407 15.0002 16.875 15.0002Z" fill="white"/>
              </svg>
            </button>
            <button type="button" className="messages_incoming_call_accept" onClick={acceptIncomingCall}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18.1156 13.678C17.9763 14.7366 17.4564 15.7083 16.6531 16.4116C15.8497 17.1149 14.8177 17.5018 13.75 17.4998C7.54688 17.4998 2.50001 12.453 2.50001 6.24984C2.49809 5.1821 2.88492 4.15017 3.58824 3.34679C4.29155 2.54341 5.26326 2.02352 6.32188 1.88422C6.58958 1.85153 6.86067 1.9063 7.09468 2.04034C7.3287 2.17438 7.51309 2.38052 7.62032 2.62797L9.27032 6.31156V6.32094C9.35242 6.51035 9.38633 6.71715 9.36901 6.92287C9.3517 7.12859 9.2837 7.32681 9.1711 7.49984C9.15704 7.52094 9.14219 7.54047 9.12657 7.56L7.50001 9.48812C8.08516 10.6772 9.32891 11.91 10.5336 12.4967L12.4352 10.8787C12.4538 10.8631 12.4734 10.8484 12.4938 10.835C12.6666 10.7197 12.8655 10.6493 13.0725 10.6302C13.2794 10.6111 13.4878 10.6439 13.6789 10.7256L13.6891 10.7303L17.3695 12.3795C17.6174 12.4864 17.8241 12.6706 17.9585 12.9047C18.093 13.1387 18.1481 13.41 18.1156 13.678Z" fill="white"/>
            </svg>
            </button>
          </div>
        </div>
      ) : null}

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
  <g clip-path="url(#clip0_817_6403)">
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
            <div className="messages_list_section_label">Pinned</div>
            {pinnedSidebarConversations.map((conversation) =>
              renderSidebarConversation(conversation, { pinned: true })
            )}
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
                    ←
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
                    <button type="button" aria-label="Audio call" disabled={!selectedConversation} onClick={() => openCallScreen("audio")}>
                      <img src="/icn/audiocall_icn.svg" alt="" />
                    </button>
                    <button type="button" aria-label="Video call" disabled={!selectedConversation} onClick={() => openCallScreen("video")}>
                      <img src="/icn/videocall_icn.svg" alt="" />
                    </button>
                    <button
                      type="button"
                      aria-label="Conversation info"
                      className={isInfoOpen ? "active" : ""}
                      onClick={toggleInfo}
                      disabled={!selectedConversation}
                    >
                      <img src="/icn/i_icn.svg" alt="" />
                    </button>
                    <button
                      type="button"
                      aria-label="Search in chat"
                      className={isSearchOpen ? "active" : ""}
                      onClick={toggleSearch}
                      disabled={!selectedConversation}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M18.75 18.75L14.4313 14.4313M16.25 9.375C16.25 13.172 13.172 16.25 9.375 16.25C5.57796 16.25 2.5 13.172 2.5 9.375C2.5 5.57796 5.57796 2.5 9.375 2.5C13.172 2.5 16.25 5.57796 16.25 9.375Z" stroke={isSearchOpen ? "#FFFFFF" : "#033E4F"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
                    <div className="messages_info_profile">
                      <ContactAvatar
                        name={selectedConversation.name}
                        avatar={selectedConversation.avatar}
                        avatarClassName={selectedConversation.avatarClassName}
                        large
                      />
                      <h3>{selectedConversation.name}</h3>
                      <p>{selectedConversation.role}</p>
                    </div>

                    <div className="messages_info_section">
                      <h4>Contact actions</h4>
                      <div className="messages_info_actions">
                        <button type="button" onClick={() => openCallScreen("audio")}>
                          <img src="/icn/audiocall_icn.svg" alt="" />
                          Call
                        </button>
                        <button type="button" onClick={() => openCallScreen("video")}>
                          <img src="/icn/videocall_icn.svg" alt="" />
                          Video
                        </button>
                        <button type="button">
                          <img src="/icn/message_icn.svg" alt="" />
                          Message
                        </button>
                      </div>
                    </div>

                    <div className="messages_info_section">
                      <h4>Shared files</h4>
                      <div className="messages_info_file">
                        <span>Referral-history.csv</span>
                        <small>Updated 2 hours ago</small>
                      </div>
                      <div className="messages_info_file">
                        <span>Ultrasound-report.pdf</span>
                        <small>Updated yesterday</small>
                      </div>
                    </div>

                    <div className="messages_info_section">
                      <h4>Conversation notes</h4>
                      <p>
                        Follow-up pending for lab review and owner callback. Keep this thread pinned for the next case
                        update.
                      </p>
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
                      <strong>B</strong>
                    </button>
                    <button type="button">
                      <em>I</em>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M4.37492 7.29232L8.74992 2.91732C9.39425 2.27299 10.4399 2.27299 11.0842 2.91732C11.7286 3.56165 11.7286 4.60732 11.0842 5.25165L5.54258 10.7933C4.57658 11.7593 3.00959 11.7593 2.04359 10.7933C1.07759 9.82732 1.07759 8.26033 2.04359 7.29433L7.29359 2.04433" stroke="#374957" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M5.25 2.25H10.875L13.5 4.875V13.875C13.5 14.4963 12.9963 15 12.375 15H5.625C5.00368 15 4.5 14.4963 4.5 13.875V3C4.5 2.58579 4.83579 2.25 5.25 2.25Z" stroke="#033E4F" strokeWidth="1.4" strokeLinejoin="round" />
                          <path d="M10.5 2.625V5.25H13.125" stroke="#033E4F" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <strong>{attachedFile.name}</strong>
                        <span>{attachedFile.size}</span>
                      </div>
                      <button type="button" onClick={() => setAttachedFile(null)} aria-label="Remove attached file">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M5.25 5.25L12.75 12.75" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M12.75 5.25L5.25 12.75" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
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
                        <path d="M10 4.16699V15.8337" stroke="#374957" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M15.8337 10H4.16699" stroke="#374957" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="8.25" stroke="#374957" strokeWidth="1.5" />
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
                          <circle cx="10" cy="10" r="8.25" stroke="#374957" strokeWidth="1.5" />
                          <circle cx="7.25" cy="8" r="1" fill="#374957" />
                          <circle cx="12.75" cy="8" r="1" fill="#374957" />
                          <path d="M6.5 12C7.26739 13.0232 8.50441 13.6667 10 13.6667C11.4956 13.6667 12.7326 13.0232 13.5 12" stroke="#374957" strokeWidth="1.5" strokeLinecap="round" />
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
          <div className="messages_group_confirm_card">
            <span className="messages_group_frame_label">Messages - Leave Group Admin</span>
            <h3>Leave this group?</h3>
            <p>If you are the admin, another admin should remain before you leave.</p>
            <div className="messages_group_flow_actions">
              <button type="button" className="kinnect-btn-secondary" onClick={() => setIsLeaveGroupOpen(false)}>
                Cancel
              </button>
              <button type="button" className="kinnect-btn-primary" onClick={leaveSelectedGroup}>
                Leave Group
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
