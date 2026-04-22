'use client';

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
  attachment?: MessageAttachment;
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

const initialConversations: Conversation[] = [
  {
    id: "icu-team",
    name: "General",
    role: "24",
    status: "available",
    isGroup: true,
    groupDescription: "General discussion and announcements",
    createdByMe: true,
    notificationsMuted: false,
    preview: "General discussion and announcements",
    time: "154 Messages",
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
        role: "Offline",
        avatar: "/icn/Dr.Sarah.svg",
        isAdmin: true,
      },
      {
        id: "julian",
        name: "Dr. Julian Miller",
        role: "Available",
        avatarClassName: "messages_avatar_julian",
      },
      {
        id: "elena",
        name: "Nurse Elena Vance",
        role: "Available",
        avatarClassName: "messages_avatar_elena",
      },
    ],
    messages: [
      {
        id: 10,
        sender: "contact",
        author: "Dr. Sarah Jenkins",
        text: "I uploaded the latest case history and imaging notes for the group.",
        time: "09:25 AM",
        attachment: {
          name: "Case_History_2026.csv",
          size: "156 KB",
        },
      },
      {
        id: 11,
        sender: "me",
        author: "Me",
        text: "Thanks team. Please keep this group updated after rounds.",
        time: "09:32 AM",
        read: true,
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
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("sarah");
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  // Group frames live in this page because they share the same sidebar, composer,
  // info panel, and conversation state as the one-to-one Messages flow.
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [groupCreateStep, setGroupCreateStep] = useState<"select" | "details" | "created">("select");
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>(["sarah", "julian"]);
  const [groupName, setGroupName] = useState("Surgery Experts");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupSettingsTab, setGroupSettingsTab] = useState<"overview" | "members" | "notifications">("overview");
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
  const [openMessageActionsId, setOpenMessageActionsId] = useState<number | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<SharedAttachment | null>(null);
  const [modalPreviewAttachment, setModalPreviewAttachment] = useState<SharedAttachment | null>(null);
  const [typingConversationId] = useState<string | null>("sarah");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const contactOptions = useMemo<GroupMember[]>(
    () =>
      conversations
        .filter((conversation) => !conversation.isGroup)
        .map((conversation) => ({
          id: conversation.id,
          name: conversation.name,
          role: conversation.role,
          avatar: conversation.avatar,
          avatarClassName: conversation.avatarClassName,
        })),
    [conversations]
  );

  const selectedGroupMembers = useMemo(
    () => contactOptions.filter((contact) => selectedGroupMemberIds.includes(contact.id)),
    [contactOptions, selectedGroupMemberIds]
  );

  const pinnedSidebarConversations = useMemo(
    () => conversations.filter((conversation) => conversation.isGroup || conversation.id === "julian"),
    [conversations]
  );

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

    return selectedConversation.messages
      .filter((message) => message.attachment)
      .map((message) => ({
        ...(message.attachment as MessageAttachment),
        id: message.id,
        author: message.author,
        time: message.time,
        text: message.text,
      }));
  }, [selectedConversation]);

  const isStandalonePanel = isNewMessageOpen || isCreateGroupOpen || !selectedConversation;
  const pinnedMessages = selectedConversation?.messages.filter((message) => message.pinned) ?? [];
  const isContactTyping = Boolean(selectedConversation && typingConversationId === selectedConversation.id);

  const resetGroupDraft = () => {
    setGroupCreateStep("select");
    setSelectedGroupMemberIds(["sarah", "julian"]);
    setGroupName("Surgery Experts");
    setGroupDescription("");
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
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMessageActionsId(null);
        setModalPreviewAttachment(null);
        setIsCreateMenuOpen(false);
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
    setGroupSettingsTab("overview");
    setMemberPendingRemoval(null);
    setIsLeaveGroupOpen(false);
    setChatSearch("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setPreviewAttachment(null);
    setModalPreviewAttachment(null);
  };

  const openNewMessage = () => {
    setIsNewMessageOpen(true);
    setIsCreateMenuOpen(false);
    setIsCreateGroupOpen(false);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setSelectedConversationId(null);
    setActiveTab("chat");
    setNewMessageSearch("");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setPreviewAttachment(null);
    setModalPreviewAttachment(null);
  };

  const openCreateGroup = () => {
    resetGroupDraft();
    setIsCreateMenuOpen(false);
    setIsCreateGroupOpen(true);
    setIsNewMessageOpen(false);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setSelectedConversationId(null);
    setActiveTab("chat");
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setPreviewAttachment(null);
    setModalPreviewAttachment(null);
  };

  const startNewConversation = (conversationId = newMessageRecipientId) => {
    setSelectedConversationId(conversationId);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
    setIsInfoOpen(false);
    setIsSearchOpen(false);
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setOpenMessageActionsId(null);
    setPreviewAttachment(null);
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

  const toggleInfo = () => {
    if (!selectedConversation) {
      return;
    }

    setIsInfoOpen((current) => !current);
    setIsSearchOpen(false);
    setIsNewMessageOpen(false);
    setIsCreateGroupOpen(false);
  };

  const toggleGroupMember = (memberId: string) => {
    setSelectedGroupMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId]
    );
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
      text: message.attachment ? `${message.attachment.name} attached` : message.text,
    });
    setOpenMessageActionsId(null);
  };

  const handleCopy = async (message: MessageItem) => {
    const payload = [message.text, message.attachment ? `${message.attachment.name} (${message.attachment.size})` : ""]
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

  const renderAttachmentCard = (attachment: MessageAttachment, className = "") => (
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

    return null;
  };

  const renderFilesPanel = () => {
    const imageAttachments = sharedAttachments.filter((attachment) => getAttachmentKind(attachment.name) === "image");
    const videoAttachments = sharedAttachments.filter((attachment) => getAttachmentKind(attachment.name) === "video");
    const fileAttachments = sharedAttachments.filter((attachment) => getAttachmentKind(attachment.name) === "file");
    const selectedPreview =
      previewAttachment && sharedAttachments.some((attachment) => attachment.id === previewAttachment.id)
        ? previewAttachment
        : imageAttachments[0] ?? videoAttachments[0] ?? null;

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

        <div className="messages_files_grid">
          {fileAttachments.map((attachment) => (
            <article key={attachment.id} className="messages_file_tile">
              {renderAttachmentCard(attachment, "file_view")}
              <small>{attachment.time}</small>
            </article>
          ))}
        </div>

        <div className="messages_media_columns">
          <section>
            <div className="messages_media_section_title">
              <span>Messages - Image View</span>
              <strong>{imageAttachments.length} Images</strong>
            </div>
            <div className="messages_media_grid">
              {imageAttachments.map((attachment) => (
                <button
                  type="button"
                  key={attachment.id}
                  className={`messages_media_tile ${
                    selectedPreview?.id === attachment.id ? "active" : ""
                  }`}
                  onClick={() => setPreviewAttachment(attachment)}
                >
                  {attachment.url ? <img src={attachment.url} alt={attachment.name} /> : null}
                  <span>{attachment.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="messages_media_section_title">
              <span>Messages - Video Preview</span>
              <strong>{videoAttachments.length} Videos</strong>
            </div>
            <div className="messages_media_grid">
              {videoAttachments.map((attachment) => (
                <button
                  type="button"
                  key={attachment.id}
                  className={`messages_media_tile video ${
                    selectedPreview?.id === attachment.id ? "active" : ""
                  }`}
                  onClick={() => setPreviewAttachment(attachment)}
                >
                  <span className="messages_media_play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="11" cy="11" r="11" fill="#033E4F" />
                      <path d="M8.75 6.75L15 11L8.75 15.25V6.75Z" fill="white" />
                    </svg>
                  </span>
                  <span>{attachment.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {selectedPreview ? renderMediaPreview(selectedPreview) : null}
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
    setActiveTab("chat");
  };

  const renderGroupMemberRow = (member: GroupMember, options?: { removable?: boolean }) => (
    <div className="messages_group_member_row" key={member.id}>
      <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
      <div>
        <h4>{member.name}</h4>
        <span>{member.isAdmin ? "Group Admin" : member.role}</span>
      </div>
      {options?.removable && member.id !== "me" ? (
        <button type="button" onClick={() => setMemberPendingRemoval(member)}>
          Remove
        </button>
      ) : null}
    </div>
  );

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
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="11.5" cy="10.5" r="4" stroke="#033E4F" strokeWidth="1.7" />
                <circle cx="20.5" cy="11.5" r="3.25" stroke="#033E4F" strokeWidth="1.7" />
                <path d="M4.5 23.5C5.75 18.75 17.25 18.75 18.5 23.5" stroke="#033E4F" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M16.75 20.25C19.3 18.9 24.6 19.55 25.5 23.5" stroke="#033E4F" strokeWidth="1.7" strokeLinecap="round" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M9.844 1.875L13.125 5.156L10.313 5.938L8.438 7.813L11.25 10.625L10.156 11.719L7.344 8.906L5.469 10.781L4.688 13.594L1.406 10.313L4.219 9.531L6.094 7.656L3.281 4.844L4.375 3.75L7.188 6.563L9.063 4.688L9.844 1.875Z" stroke="#E4432D" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
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
                    <path d="M4.875 5.688C5.773 5.688 6.5 4.96 6.5 4.063S5.773 2.438 4.875 2.438 3.25 3.165 3.25 4.063s.727 1.625 1.625 1.625Z" stroke="#9BA5AF" strokeWidth="1.1" />
                    <path d="M1.625 10.563C2.08 8.91 7.67 8.91 8.125 10.563" stroke="#9BA5AF" strokeWidth="1.1" strokeLinecap="round" />
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
    const primarySelectedMembers = contactOptions.filter((member) => selectedGroupMemberIds.includes(member.id)).slice(0, 3);
    const remainingMembers = contactOptions.filter((member) => !primarySelectedMembers.some((selected) => selected.id === member.id));

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
                  setGroupSettingsTab("overview");
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
          <div className="messages_group_photo_upload">
            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="27" viewBox="0 0 31 27" fill="none">
              <path d="M4.5 7.5H9.1L11.1 4.5H17.8L19.8 7.5H24.5C26.157 7.5 27.5 8.843 27.5 10.5V21C27.5 22.657 26.157 24 24.5 24H4.5C2.843 24 1.5 22.657 1.5 21V10.5C1.5 8.843 2.843 7.5 4.5 7.5Z" stroke="#033E4F" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="14.5" cy="15.75" r="4.25" stroke="#033E4F" strokeWidth="2" />
              <path d="M24.5 3V8" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 5.5H27" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 8.75L8.75 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6.75 2H8.75V4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

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
          <strong>{selectedGroupMemberIds.length} Participants Selected</strong>
        </div>

        <div className="messages_consult_search">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M15.5 15.5L11.95 11.95M13.875 7.688C13.875 11.106 11.106 13.875 7.688 13.875C4.269 13.875 1.5 11.106 1.5 7.688C1.5 4.269 4.269 1.5 7.688 1.5C11.106 1.5 13.875 4.269 13.875 7.688Z" stroke="#71787C" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input placeholder="Search by name, role, or specialty..." />
        </div>

        <div className="messages_consult_selected_list">
          {primarySelectedMembers.map((member) => (
            <button type="button" key={member.id} className="selected" onClick={() => toggleGroupMember(member.id)}>
              <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
              <div>
                <h4>{member.id === "sarah" ? "Dr. Sarah Johnson" : member.name}</h4>
                <span>{member.id === "sarah" ? "Surgery" : member.role}</span>
              </div>
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </strong>
            </button>
          ))}
        </div>

        <div className="messages_consult_member_grid">
          {remainingMembers.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  className={selectedGroupMemberIds.includes(member.id) ? "selected" : ""}
                  onClick={() => toggleGroupMember(member.id)}
                >
                  <ContactAvatar name={member.name} avatar={member.avatar} avatarClassName={member.avatarClassName} />
                  <div>
                    <h4>{member.id === "marcus" ? "Marcus Chen" : member.id === "elena" ? "Patty Vance" : member.name}</h4>
                    <span>{member.role}</span>
                  </div>
                  <strong aria-hidden="true"></strong>
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

  // Implements: Messages - new group info, Group Admin variants, Leave Group,
  // Group Remove Member, and the Group Settings/Members/Notifications tabs.
  const renderGroupInfoPanel = (conversation: Conversation) => {
    const members = conversation.members ?? [];
    const isAdmin = Boolean(conversation.createdByMe || members.find((member) => member.id === "me" && member.isAdmin));

    return (
      <aside className="messages_info_panel messages_group_info_panel">
        <div className="messages_info_profile">
          <ContactAvatar name={conversation.name} large />
          <span className="messages_group_frame_label">
            {isAdmin ? "Messages - new group info - Group Admin" : "Messages - new group info"}
          </span>
          <h3>{conversation.name}</h3>
          <p>{conversation.groupDescription}</p>
        </div>

        <div className="messages_group_settings_tabs">
          <button type="button" className={groupSettingsTab === "overview" ? "active" : ""} onClick={() => setGroupSettingsTab("overview")}>
            Group - Settings
          </button>
          <button type="button" className={groupSettingsTab === "members" ? "active" : ""} onClick={() => setGroupSettingsTab("members")}>
            Group - Settings/Members
          </button>
          <button type="button" className={groupSettingsTab === "notifications" ? "active" : ""} onClick={() => setGroupSettingsTab("notifications")}>
            Group - Settings/Notifications
          </button>
        </div>

        {groupSettingsTab === "overview" ? (
          <div className="messages_info_section">
            <h4>Group settings</h4>
            <p>{members.length} members. {conversation.notificationsMuted ? "Notifications are muted." : "Notifications are enabled."}</p>
            <div className="messages_group_info_actions">
              <button type="button" onClick={() => setGroupSettingsTab("members")}>Manage Members</button>
              <button type="button" onClick={() => setGroupSettingsTab("notifications")}>Notifications</button>
            </div>
          </div>
        ) : null}

        {groupSettingsTab === "members" ? (
          <div className="messages_info_section">
            <h4>{isAdmin ? "Members and admin controls" : "Members"}</h4>
            <div className="messages_group_member_list">
              {members.map((member) => renderGroupMemberRow(member, { removable: isAdmin }))}
            </div>
          </div>
        ) : null}

        {groupSettingsTab === "notifications" ? (
          <div className="messages_info_section">
            <h4>Notification preferences</h4>
            <button type="button" className="messages_group_toggle" onClick={toggleGroupNotifications}>
              <span>{conversation.notificationsMuted ? "Muted" : "Enabled"}</span>
              <strong>{conversation.notificationsMuted ? "Turn On" : "Mute"}</strong>
            </button>
            <p>Use this setting to pause alerts for busy group conversations without leaving the group.</p>
          </div>
        ) : null}

        <div className="messages_info_section">
          <button type="button" className="messages_group_leave_btn" onClick={() => setIsLeaveGroupOpen(true)}>
            {isAdmin ? "Messages - Leave Group Admin" : "Leave Group"}
          </button>
        </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="8.75" stroke="#E4432D" strokeWidth="1.5" />
                <path d="M8 8L14 14" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 8L8 14" stroke="#E4432D" strokeWidth="1.5" strokeLinecap="round" />
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
            <p>Choose a conversation from the list or start a new message to begin communicating</p>
            <div className="messages_select_actions">
              <button type="button" className="kinnect-btn-primary" onClick={openNewMessage}>
                New Message
              </button>
              <button type="button" className="kinnect-btn-secondary" onClick={openCreateGroup}>
                Create Group
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
                  <span className="messages_pinned_author">{message.author}-</span>
                  <span className="messages_pinned_text">
                    {message.attachment ? `${message.attachment.name} attached` : message.text}
                  </span>
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
                name={selectedConversation.name}
                avatar={selectedConversation.avatar}
                avatarClassName={selectedConversation.avatarClassName}
              />
            ) : null}

            <div className="messages_bubble_block">
              <div className={`messages_bubble_head ${message.sender === "me" ? "outgoing" : ""}`}>
                {message.sender === "contact" ? <b>{message.author}</b> : null}
                <span>{message.time}</span>
                {message.sender === "me" ? <b>{message.author}</b> : null}
              </div>

              <div className={`messages_bubble_actions ${message.sender === "me" ? "outgoing" : ""}`}>
                <div className="messages_actions_menu_wrap">
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

                {message.attachment ? (
                  renderAttachmentCard({
                    ...message.attachment,
                    id: message.id,
                    author: message.author,
                    time: message.time,
                    text: message.text,
                  })
                ) : null}
              </div>

              {message.sender === "me" && message.read ? (
                <div className="messages_read_status">
                  <img src="/icn/read_icn.svg" alt="" />
                  Read
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
            <p>{selectedConversation.name.split(" ")[1] ?? selectedConversation.name} is typing...</p>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className="messages_page">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <rect x="4.75" y="4.75" width="16.5" height="16.5" rx="5" stroke="#374957" strokeWidth="1.8" />
                      <path d="M9 10H17" stroke="#374957" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M9 13H17" stroke="#374957" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M9 16H13.5" stroke="#374957" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Start New Chat
                  </button>
                  <button type="button" onClick={openCreateGroup}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <rect x="4.75" y="4.75" width="6.5" height="6.5" rx="1.25" stroke="#374957" strokeWidth="1.8" />
                      <rect x="14.75" y="4.75" width="6.5" height="6.5" rx="1.25" stroke="#374957" strokeWidth="1.8" />
                      <rect x="4.75" y="14.75" width="6.5" height="6.5" rx="1.25" stroke="#374957" strokeWidth="1.8" />
                      <rect x="14.75" y="14.75" width="6.5" height="6.5" rx="1.25" stroke="#374957" strokeWidth="1.8" />
                      <path d="M11.25 8H14.75" stroke="#374957" strokeWidth="1.8" />
                      <path d="M8 11.25V14.75" stroke="#374957" strokeWidth="1.8" />
                      <path d="M18 11.25V14.75" stroke="#374957" strokeWidth="1.8" />
                      <path d="M11.25 18H14.75" stroke="#374957" strokeWidth="1.8" />
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
                  {selectedConversation ? (
                    <>
                      <ContactAvatar
                        name={selectedConversation.name}
                        avatar={selectedConversation.avatar}
                        avatarClassName={selectedConversation.avatarClassName}
                        large
                      />

                      <div>
                        {selectedConversation.isGroup ? (
                          <span className="messages_group_header_label">Messages - new group</span>
                        ) : null}
                        <h2>{selectedConversation.name}</h2>
                        <div className="messages_chat_status">
                          <span className={selectedConversation.status}></span>
                          {selectedConversation.role}
                        </div>
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
                    <button type="button" aria-label="Audio call" disabled={!selectedConversation}>
                      <img src="/icn/audiocall_icn.svg" alt="" />
                    </button>
                    <button type="button" aria-label="Video call" disabled={!selectedConversation}>
                      <img src="/icn/videocall_icn.svg" alt="" />
                    </button>
                    <button type="button" aria-label="Conversation info" disabled={!selectedConversation}>
                      <img src="/icn/i_icn.svg" alt="" />
                    </button>
                    <button
                      type="button"
                      aria-label="Open conversation info"
                      className={isInfoOpen ? "active" : ""}
                      onClick={toggleInfo}
                      disabled={!selectedConversation}
                    >
                      <img src="/icn/user_icn.svg" alt="" />
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
                    renderGroupInfoPanel(selectedConversation)
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
                        <button type="button">
                          <img src="/icn/audiocall_icn.svg" alt="" />
                          Call
                        </button>
                        <button type="button">
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
                      placeholder="Type a message..."
                    />

                    <button type="button" className="messages_composer_icon_btn" aria-label="Emoji">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8.25" stroke="#374957" strokeWidth="1.5" />
                        <circle cx="7.25" cy="8" r="1" fill="#374957" />
                        <circle cx="12.75" cy="8" r="1" fill="#374957" />
                        <path d="M6.5 12C7.26739 13.0232 8.50441 13.6667 10 13.6667C11.4956 13.6667 12.7326 13.0232 13.5 12" stroke="#374957" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>

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
