'use client';

import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';

type ChannelMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  avatarClassName?: string;
  online?: boolean;
  host?: boolean;
  muted?: boolean;
};

type ChannelFile = {
  id: number;
  name: string;
  label: string;
  sharedOn: string;
  sentBy: string;
  icon: 'doc' | 'video' | 'image';
};

type ChannelMessage = {
  id: number;
  author: string;
  role?: string;
  sender: 'member' | 'me';
  text: string;
  time: string;
  pinned?: boolean;
  pinnedTitle?: string;
  attachments?: Array<{ name: string; size: string; type: string }>;
};

type ChannelItem = {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  messagesCount: number;
  pinned: boolean;
  privateChannel?: boolean;
  filesSize: string;
  createdAt: string;
  createdBy: string;
  hasMessages: boolean;
  files: ChannelFile[];
  members: ChannelMember[];
  messages: ChannelMessage[];
};

type SettingsTab = 'general' | 'members' | 'notifications';

const initialChannels: ChannelItem[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General discussion and announcements',
    membersCount: 24,
    messagesCount: 154,
    pinned: true,
    filesSize: '124 MB',
    createdAt: 'Oct 12, 2023',
    createdBy: 'Dr. Aris Thorne',
    hasMessages: true,
    files: [
      { id: 1, name: 'Patient_Intake_Cooper.docx', label: 'Added by Nurse Jackie', sharedOn: '2 hours ago', sentBy: 'Sarah Jenkins', icon: 'doc' },
      { id: 2, name: 'Emergency_Surgery_Log.mp4', label: 'Surgery Department', sharedOn: 'Yesterday', sentBy: 'Michael Chen', icon: 'video' },
      { id: 3, name: 'XRAY_Thorax_Bella.jpg', label: 'Imaging Unit 4', sharedOn: 'Oct 12, 2023', sentBy: 'James Wilson', icon: 'image' },
    ],
    members: [
      { id: 'sarah', name: 'Dr. Sarah Jenkins', role: 'Specialist - Surgery', avatar: '/icn/Dr.Sarah.svg', online: true, host: true },
      { id: 'julian', name: 'Dr. Julian Miller', role: 'Specialist - Surgery', avatar: '/avatar-2.png', online: true },
      { id: 'elena', name: 'Nurse Elena Vance', role: 'Specialist - Surgery', avatar: '/avatar-1.png' },
      { id: 'marcus', name: 'Dr. Marcus Reed', role: 'Specialist - Surgery', avatar: '/avatar-2.png' },
    ],
    messages: [
      {
        id: 1,
        author: 'Dr. Aris',
        sender: 'member',
        text: 'Team, please ensure you review the updated sterilization sequence for ortho cases. All staff must sign off in the Documents tab before Monday\'s shift.',
        time: '09:12 AM',
        pinned: true,
        pinnedTitle: 'Updated Pre-Op Protocol (v4.2)',
      },
      {
        id: 2,
        author: 'Dr. Sarah Jenkins',
        role: 'Surgeon',
        sender: 'member',
        text: "I've reviewed Buddy's latest bloodwork. His liver enzymes are slightly elevated, but consistent with his current medication protocol.",
        time: '10:42 AM',
      },
      {
        id: 3,
        author: 'Marcus Thorne',
        role: 'Nurse',
        sender: 'member',
        text: 'Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.',
        time: '10:42 AM',
        attachments: [
          { name: 'Blood_Panel_Bella.pdf', size: '2.4 MB', type: 'PDF Document' },
          { name: 'Case_History_2026.csv', size: '156 KB', type: 'CSV Data' },
        ],
      },
      {
        id: 4,
        author: 'Dr. John Smith',
        role: 'Consultant',
        sender: 'member',
        text: 'Proceed with caution. Marcus, please prep the Isoflurane machine for Room 3.',
        time: '10:42 AM',
      },
      {
        id: 5,
        author: 'Me',
        sender: 'me',
        text: "He's eating well! We switched to the prescription diet this morning.",
        time: '11:30 AM',
      },
    ],
  },
  {
    id: 'surgery',
    name: 'Surgery Cases',
    description: 'Surgical cases discussions',
    membersCount: 12,
    messagesCount: 89,
    pinned: true,
    privateChannel: true,
    filesSize: '84 MB',
    createdAt: 'Oct 09, 2023',
    createdBy: 'Dr. Elena Rodriguez',
    hasMessages: false,
    files: [],
    members: [
      { id: 'sarah', name: 'Dr. Sarah Jenkins', role: 'Specialist - Surgery', avatar: '/icn/Dr.Sarah.svg', online: true },
      { id: 'michael', name: 'Dr. Michael Chen', role: 'Specialist - Surgery', avatar: '/avatar-2.png', online: true },
      { id: 'elena', name: 'Nurse Elena Vance', role: 'Specialist - Surgery', avatar: '/avatar-1.png' },
      { id: 'marcus', name: 'Dr. Marcus Reed', role: 'Specialist - Surgery', avatar: '/avatar-2.png' },
    ],
    messages: [],
  },
  {
    id: 'cardiology',
    name: 'Cardiology Consults',
    description: 'Cardiology consultation room',
    membersCount: 24,
    messagesCount: 154,
    pinned: false,
    filesSize: '56 MB',
    createdAt: 'Sep 29, 2023',
    createdBy: 'Dr. Aris Thorne',
    hasMessages: false,
    files: [],
    members: [
      { id: 'sarah', name: 'Dr. Sarah Jenkins', role: 'Specialist - Surgery', avatar: '/icn/Dr.Sarah.svg', online: true },
      { id: 'julian', name: 'Dr. Julian Miller', role: 'Specialist - Surgery', avatar: '/avatar-2.png', online: true },
    ],
    messages: [],
  },
];

function ChannelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="13" cy="12" r="5.5" stroke="#033E4F" strokeWidth="2" />
      <circle cx="22" cy="14" r="4.5" stroke="#033E4F" strokeWidth="2" />
      <path d="M4 27.5C5.7 21.2 20.3 21.2 22 27.5" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 23.5C22.4 21.6 29 22.3 30 27.5" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5.75" stroke="#033E4F" strokeWidth="1.5" />
      <path d="M12.5 12.5L15.75 15.75" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.25" stroke="#033E4F" strokeWidth="1.5" />
      <path d="M9 8V12" stroke="#033E4F" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="5.5" r="1" fill="#033E4F" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 14.25C7 15.1 7.85 15.75 9 15.75C10.15 15.75 11 15.1 11.25 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 6.75C4.5 4.26472 6.51472 2.25 9 2.25C11.4853 2.25 13.5 4.26472 13.5 6.75V9.0685C13.5 9.56119 13.6469 10.0427 13.9221 10.4514L15 12.0525H3L4.07786 10.4514C4.35309 10.0427 4.5 9.56119 4.5 9.0685V6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6.5" cy="6.25" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.25" cy="7.25" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.25 14.25C3.1 10.75 9.9 10.75 10.75 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.75 12.75C12.35 11.85 15.7 12.2 16.25 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7.5 2.75H10.5L10.95 4.55C11.2935 4.66792 11.6188 4.81638 11.9225 4.99125L13.6125 4.275L15.725 6.3875L15.0088 8.0775C15.1836 8.3812 15.3321 8.70652 15.45 9.05L17.25 9.5V12.5L15.45 12.95C15.3321 13.2935 15.1836 13.6188 15.0088 13.9225L15.725 15.6125L13.6125 17.725L11.9225 17.0088C11.6188 17.1836 11.2935 17.3321 10.95 17.45L10.5 19.25H7.5L7.05 17.45C6.70652 17.3321 6.3812 17.1836 6.0775 17.0088L4.3875 17.725L2.275 15.6125L2.99125 13.9225C2.81638 13.6188 2.66792 13.2935 2.55 12.95L0.75 12.5V9.5L2.55 9.05C2.66792 8.70652 2.81638 8.3812 2.99125 8.0775L2.275 6.3875L4.3875 4.275L6.0775 4.99125C6.3812 4.81638 6.70652 4.66792 7.05 4.55L7.5 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" transform="scale(0.75) translate(3 3)" />
      <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PhoneIcon() {
  return <img src="/icn/audiocall_icn.svg" alt="" />;
}

function VideoIcon() {
  return <img src="/icn/videocall_icn.svg" alt="" />;
}

function DocIcon({ type }: { type: ChannelFile['icon'] }) {
  if (type === 'video') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3.5" y="3.5" width="15" height="15" rx="3" stroke="#033E4F" strokeWidth="1.5" />
        <path d="M9 8L14 11L9 14V8Z" fill="#033E4F" />
      </svg>
    );
  }

  if (type === 'image') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3.5" y="3.5" width="15" height="15" rx="3" stroke="#033E4F" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.5" fill="#033E4F" />
        <path d="M6 15L9.5 11.5L12 14L14 12L16 15" stroke="#033E4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6.5 3.5H12.5L16.5 7.5V17C16.5 17.8284 15.8284 18.5 15 18.5H7C6.17157 18.5 5.5 17.8284 5.5 17V4.5C5.5 3.94772 5.94772 3.5 6.5 3.5Z" stroke="#033E4F" strokeWidth="1.5" />
      <path d="M12.5 3.75V7.5H16.25" stroke="#033E4F" strokeWidth="1.5" />
    </svg>
  );
}

function DownloadIcon() {
  return <img src="/icn/send_icn.svg" alt="" className="channels_download_icon" />;
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 4.167L6.667 10L12.5 15.833" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState(initialChannels);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>('general');
  const [directoryTab, setDirectoryTab] = useState<'chat' | 'files'>('chat');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [view, setView] = useState<'directory' | 'settings'>('directory');
  const [showDetails, setShowDetails] = useState(false);
  const [channelSearch, setChannelSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [muteChannel, setMuteChannel] = useState(false);
  const [isMobileChannelOpen, setIsMobileChannelOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploadHintVisible, setIsUploadHintVisible] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const syncMobileState = () => {
      if (window.innerWidth > 768) {
        setIsMobileChannelOpen(false);
      }
    };

    syncMobileState();
    window.addEventListener('resize', syncMobileState);

    return () => window.removeEventListener('resize', syncMobileState);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element) || !target.closest('.messages_emoji_picker_wrap')) {
        setIsEmojiPickerOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsEmojiPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const selectedChannel = useMemo(
    () => channels.find((channel) => channel.id === selectedChannelId) ?? null,
    [channels, selectedChannelId]
  );

  const filteredChannels = useMemo(() => {
    const query = channelSearch.trim().toLowerCase();
    if (!query) {
      return channels;
    }

    return channels.filter((channel) => {
      return channel.name.toLowerCase().includes(query) || channel.description.toLowerCase().includes(query);
    });
  }, [channels, channelSearch]);

  const filteredMembers = useMemo(() => {
    if (!selectedChannel) {
      return [];
    }

    const query = memberSearch.trim().toLowerCase();
    if (!query) {
      return selectedChannel.members;
    }

    return selectedChannel.members.filter((member) => {
      return member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query);
    });
  }, [memberSearch, selectedChannel]);

  const pinnedChannels = filteredChannels.filter((channel) => channel.pinned);
  const allChannels = filteredChannels;

  const selectChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setDirectoryTab('chat');
    setView('directory');
    setShowDetails(false);
    setIsEmojiPickerOpen(false);
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setIsMobileChannelOpen(true);
    }
  };

  const togglePin = () => {
    if (!selectedChannel) {
      return;
    }

    setChannels((current) =>
      current.map((channel) =>
        channel.id === selectedChannel.id ? { ...channel, pinned: !channel.pinned } : channel
      )
    );
  };

  const sendMessage = () => {
    const trimmed = draftMessage.trim();
    if ((!trimmed && !attachedFile) || !selectedChannel) {
      return;
    }

    setChannels((current) =>
      current.map((channel) =>
        channel.id === selectedChannel.id
          ? {
              ...channel,
              hasMessages: true,
              messagesCount: channel.messagesCount + 1,
              messages: [
                ...channel.messages,
                {
                  id: Date.now(),
                  author: 'Me',
                  sender: 'me',
                  text: trimmed,
                  time: 'Now',
                  attachments: attachedFile ? [attachedFile] : undefined,
                },
              ],
            }
          : channel
      )
    );
    setDraftMessage('');
    setAttachedFile(null);
    setIsDragActive(false);
    setIsEmojiPickerOpen(false);
  };

  const addEmojiToDraft = (emojiData: EmojiClickData) => {
    setDraftMessage((current) => `${current}${emojiData.emoji}`);
    setIsEmojiPickerOpen(false);
  };

  const storeAttachedFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const sizeInMb = file.size / (1024 * 1024);
    const size = sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';

    setAttachedFile({
      name: file.name,
      size,
      type: extension === 'PDF' ? 'PDF Document' : `${extension} File`,
    });
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    storeAttachedFile(event.target.files?.[0] ?? null);
    event.target.value = '';
  };

  const renderEmojiPicker = () => (
    <div className="messages_emoji_picker_wrap">
      <button
        type="button"
        className={`messages_composer_icon_btn ${isEmojiPickerOpen ? 'active' : ''}`}
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
  );

  return (
    <section className={`channels_page ${isMobileChannelOpen ? 'mobile_channel_open' : ''}`}>
      {view === 'settings' && selectedChannel ? (
        <div className="channels_settings_page">
          <div className="channels_settings_hero">
            <button type="button" className="channels_mobile_back" onClick={() => setIsMobileChannelOpen(false)} aria-label="Back to channels">
              <BackIcon />
            </button>
            <div className="channels_settings_icon"><ChannelIcon /></div>
            <div>
              <h1>{selectedChannel.name}</h1>
              <p>{selectedChannel.description}</p>
            </div>
          </div>

          <div className="channels_settings_tabs">
            <button type="button" className={settingsTab === 'general' ? 'active' : ''} onClick={() => setSettingsTab('general')}>
              <SettingsIcon />
              General
            </button>
            <button type="button" className={settingsTab === 'members' ? 'active' : ''} onClick={() => setSettingsTab('members')}>
              <MembersIcon />
              Members
            </button>
            <button type="button" className={settingsTab === 'notifications' ? 'active' : ''} onClick={() => setSettingsTab('notifications')}>
              <BellIcon />
              Notifications
            </button>
          </div>

          {settingsTab === 'general' ? (
            <div className="channels_settings_general">
              <div className="channels_settings_general_main">
                <h2>Channel Information</h2>
                <label>
                  <span>Channel Name</span>
                  <input value={selectedChannel.id === 'general' ? 'Post-Op Recovery Group' : selectedChannel.name} readOnly />
                </label>
                <label>
                  <span>Description</span>
                  <textarea readOnly value="A focused environment for veterinary surgeons and nursing staff to manage the critical 48-hour post-operative window for complex cases." />
                </label>
                <div className="channels_settings_private">
                  <strong>Private Channel</strong>
                  <p>Only invited staff members can view this archive.</p>
                </div>
              </div>
              <aside className="channels_settings_general_side">
                <div className="channels_settings_stats">
                  <div><span>Created</span><strong>{selectedChannel.createdAt}</strong></div>
                  <div><span>By</span><strong>{selectedChannel.createdBy}</strong></div>
                  <div><span>Files</span><strong>{selectedChannel.filesSize}</strong></div>
                </div>
                <button type="button" className="channels_leave_btn">Leave Channel</button>
              </aside>
            </div>
          ) : null}

          {settingsTab === 'members' ? (
            <div className="channels_settings_members">
              <h2>Members</h2>
              <div className="channels_search_bar">
                <SearchIcon />
                <input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search members" />
              </div>
              <div className="channels_members_list channels_members_list_plain">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="channels_member_row">
                    <div className="channels_member_identity">
                      <div className="channels_member_avatar">
                        <img src={member.avatar ?? '/icn/user_avatar.svg'} alt={member.name} />
                        {member.online ? <span className="online"></span> : null}
                      </div>
                      <div>
                        <strong>{member.name}</strong>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="channels_settings_footer_action"><button type="button" className="messages_group_leave_btn v2">Leave Channel</button></div>
            </div>
          ) : null}

          {settingsTab === 'notifications' ? (
            <div className="channels_settings_notifications">
              <div className="channels_notify_row">
                <div>
                  <strong>Notifications</strong>
                  <p>Receive alerts for important updates and activity in this channel.</p>
                </div>
                <button type="button" className={`channels_toggle ${notificationsEnabled ? 'active' : ''}`} onClick={() => setNotificationsEnabled((current) => !current)}>
                  <span></span>
                </button>
              </div>
              <div className="channels_notify_row">
                <div>
                  <strong>Mute Channel</strong>
                  <p>Only get notified if someone @mentions you personally</p>
                </div>
                <button type="button" className={`channels_toggle ${muteChannel ? 'active' : ''}`} onClick={() => setMuteChannel((current) => !current)}>
                  <span></span>
                </button>
              </div>
              <div className="channels_settings_footer_action"><button type="button" className="channels_leave_btn">Leave Channel</button></div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className={`channels_directory ${showDetails ? 'details_open' : ''}`}>
          <aside className="channels_sidebar">
            <div className="channels_sidebar_top">
              <h1>Channels</h1>
              <button type="button" className="channels_add_btn" aria-label="Create channel">+</button>
            </div>

            <div className="channels_search_bar">
              <SearchIcon />
              <input value={channelSearch} onChange={(event) => setChannelSearch(event.target.value)} placeholder="Search Channels" />
            </div>

            <div className="channels_list_block">
              <span className="channels_list_label">Pinned</span>
              {pinnedChannels.map((channel) => (
                <button key={channel.id} type="button" className={`channels_list_item ${selectedChannelId === channel.id ? 'active' : ''}`} onClick={() => selectChannel(channel.id)}>
                  <div className="channels_list_icon"><ChannelIcon /></div>
                  <div className="channels_list_copy">
                    <div className="channels_list_title_row">
                      <strong>{channel.name}</strong>
                      {channel.pinned ? <span className="channels_pin_mark">📌</span> : null}
                    </div>
                    <p>{channel.description}</p>
                    <small>{channel.membersCount} &nbsp;&nbsp; {channel.messagesCount} Messages</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="channels_list_block">
              <span className="channels_list_label">All Channels</span>
              {allChannels.map((channel) => (
                <button key={channel.id} type="button" className={`channels_list_item ${selectedChannelId === channel.id ? 'active' : ''}`} onClick={() => selectChannel(channel.id)}>
                  <div className="channels_list_icon"><ChannelIcon /></div>
                  <div className="channels_list_copy">
                    <strong>{channel.name}</strong>
                    <p>{channel.description}</p>
                    <small>{channel.membersCount} &nbsp;&nbsp; {channel.messagesCount} Messages</small>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="channels_main">
            {selectedChannel ? (
              <>
                <div className="channels_chat_header">
                  <div className="channels_chat_identity">
                    <button type="button" className="channels_mobile_back" onClick={() => setIsMobileChannelOpen(false)} aria-label="Back to channels">
                      <BackIcon />
                    </button>
                    <div className="channels_chat_icon"><ChannelIcon /></div>
                    <div>
                      <h2>{selectedChannel.name}</h2>
                      <p>{selectedChannel.description}</p>
                    </div>
                  </div>

                  <div className="channels_chat_actions_area">
                    <div className="channels_chat_tabs">
                      <button type="button" className={directoryTab === 'chat' ? 'active' : ''} onClick={() => setDirectoryTab('chat')}>Chat</button>
                      <button type="button" className={directoryTab === 'files' ? 'active' : ''} onClick={() => setDirectoryTab('files')}>Files</button>
                    </div>
                    <div className="channels_chat_actions">
                      <button type="button"><PhoneIcon /></button>
                      <button type="button"><VideoIcon /></button>
                      <button type="button" onClick={() => setShowDetails((current) => !current)}><InfoIcon /></button>
                      <button type="button"><SearchIcon /></button>
                    </div>
                  </div>
                </div>

                {directoryTab === 'files' ? (
                  <div className="channels_files_table_wrap">
                    <div className="channels_files_table">
                      <div className="channels_files_table_head">
                        <span>File Name</span>
                        <span>Shared On</span>
                        <span>Sent By</span>
                        <span>Actions</span>
                      </div>
                      {selectedChannel.files.map((file) => (
                        <div key={file.id} className="channels_files_table_row">
                          <div className="channels_file_name">
                            <div className="channels_file_icon"><DocIcon type={file.icon} /></div>
                            <div>
                              <strong>{file.name}</strong>
                              <p>{file.label}</p>
                            </div>
                          </div>
                          <span>{file.sharedOn}</span>
                          <span>{file.sentBy}</span>
                          <div className="channels_file_actions">
                            <button type="button"><img src="/icn/eye_icn.svg" alt="" /></button>
                            <button type="button"><DownloadIcon /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedChannel.hasMessages ? (
                  <>
                    <div className="channels_chat_feed">
                      <div className="channels_day_divider"><span>Today, October 24</span></div>

                      {selectedChannel.messages.map((message) => (
                        <div key={message.id} className={`channels_message_row ${message.sender === 'me' ? 'me' : ''}`}>
                          {message.pinned ? (
                            <div className="channels_pinned_card">
                              <span>Pinned by Dr. Aris</span>
                              <div>
                                <div className="channels_pinned_icon"><DocIcon type="doc" /></div>
                                <div>
                                  <strong>{message.pinnedTitle}</strong>
                                  <p>{message.text}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              {message.sender === 'member' ? (
                                <div className="channels_message_head">
                                  <b>{message.author}</b>
                                  {message.role ? <em>{message.role}</em> : null}
                                  <span>{message.time}</span>
                                </div>
                              ) : (
                                <div className="channels_message_head channels_message_head_me">
                                  <span>{message.time}</span>
                                  <b>Me</b>
                                </div>
                              )}
                              <div className={`channels_message_bubble ${message.sender === 'me' ? 'me' : ''}`}>
                                <p>{message.text}</p>
                                {message.attachments?.length ? (
                                  <div className="channels_message_attachments">
                                    {message.attachments.map((attachment) => (
                                      <div key={attachment.name} className="channels_message_attachment">
                                        <div className="channels_attachment_icon"><DocIcon type="doc" /></div>
                                        <div>
                                          <strong>{attachment.name}</strong>
                                          <span>{attachment.size} • {attachment.type}</span>
                                        </div>
                                        <button type="button"><DownloadIcon /></button>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                              {message.sender === 'me' ? <div className="channels_delivery_mark">Read</div> : null}
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="messages_composer_wrap channels_messages_composer_wrap">
                      <div
                        className={`messages_composer ${isDragActive ? 'drag_active' : ''}`}
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
                          storeAttachedFile(event.dataTransfer.files?.[0] ?? null);
                          setIsDragActive(false);
                        }}
                      >
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
                            className={`messages_upload_tooltip_wrap ${isUploadHintVisible ? 'visible' : ''}`}
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
                              if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Type a message..."
                          />

                          {renderEmojiPicker()}

                          <button type="button" className="messages_send_btn" onClick={sendMessage}>
                            Send
                            <img src="/icn/send_icn.svg" alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="channels_empty_chat">
                    <div className="channels_empty_chat_icon"><ChannelIcon /></div>
                    <h3>{selectedChannel.name}</h3>
                    <p>{selectedChannel.description}</p>
                    <div className="messages_composer_wrap channels_messages_composer_wrap channels_composer_empty">
                      <div
                        className={`messages_composer ${isDragActive ? 'drag_active' : ''}`}
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
                          storeAttachedFile(event.dataTransfer.files?.[0] ?? null);
                          setIsDragActive(false);
                        }}
                      >
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
                            className={`messages_upload_tooltip_wrap ${isUploadHintVisible ? 'visible' : ''}`}
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
                              if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage();
                              }
                            }}
                            placeholder="Type a message..."
                          />

                          {renderEmojiPicker()}

                          <button type="button" className="messages_send_btn" onClick={sendMessage}>
                            Send
                            <img src="/icn/send_icn.svg" alt="" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="channels_select_state">
                <h2>Select a Channel</h2>
                <p>Choose a channel to view discussions and collaborate with team members</p>
              </div>
            )}
          </div>

          {showDetails && selectedChannel ? (
            <aside className="channels_details_panel">
              <div className="channels_details_head">
                <h3>Channel Details</h3>
                <button type="button" onClick={() => setShowDetails(false)}>×</button>
              </div>

              <div className="channels_details_icon"><ChannelIcon /></div>
              <h4>{selectedChannel.name}</h4>
              <p>{selectedChannel.description}</p>
              <div className="channels_details_meta">{selectedChannel.membersCount} &nbsp;&nbsp; {selectedChannel.messagesCount} Messages</div>

              <div className="channels_details_actions">
                <button type="button"><PhoneIcon /></button>
                <button type="button"><VideoIcon /></button>
              </div>

              <div className="channels_details_stats">
                <div><span>Members</span><strong>{selectedChannel.membersCount}</strong></div>
                <div><span>Messages</span><strong>{selectedChannel.messagesCount}</strong></div>
              </div>

              <div className="channels_details_links">
                <button type="button" onClick={() => { setView('settings'); setSettingsTab('notifications'); setShowDetails(false); }}><BellIcon />Notification Settings</button>
                <button type="button" onClick={() => { setView('settings'); setSettingsTab('general'); setShowDetails(false); }}><SettingsIcon />Channel Settings</button>
                <button type="button" onClick={togglePin}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11.625 2.625L15.375 6.375L12.1875 7.3125L10.125 9.375L13.5 12.75L12 14.25L8.625 10.875L6.5625 12.9375L5.625 16.125L1.875 12.375L5.0625 11.4375L7.125 9.375L3.75 6L5.25 4.5L8.625 7.875L10.6875 5.8125L11.625 2.625Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>{selectedChannel.pinned ? 'Unpin Channel' : 'Pin Channel'}</button>
              </div>

              <div className="channels_details_members_head">
                <span>Members</span>
                <button type="button"><SearchIcon /></button>
              </div>
              <div className="channels_members_list">
                {selectedChannel.members.map((member) => (
                  <div key={member.id} className="channels_member_row">
                    <div className="channels_member_identity">
                      <div className="channels_member_avatar">
                        <img src={member.avatar ?? '/icn/user_avatar.svg'} alt={member.name} />
                        {member.online ? <span className="online"></span> : null}
                      </div>
                      <div>
                        <strong>{member.name}</strong>
                        <p>{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="messages_group_leave_btn v2">Leave Channel</button>
            </aside>
          ) : null}
        </div>
      )}
    </section>
  );
}
