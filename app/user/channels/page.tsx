'use client';

import { type EmojiClickData } from 'emoji-picker-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import MessagesComposer from '../messages/MessagesComposer';

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
  url?: string;
};

type ChannelAttachment = {
  name: string;
  size: string;
  type: string;
  url?: string;
};

type ChannelReply = {
  author: string;
  text: string;
};

type DeliveryStatus = 'Sending...' | 'Sent' | 'Delivered' | 'Read';

type ChannelMessage = {
  id: number;
  author: string;
  role?: string;
  sender: 'member' | 'me';
  text: string;
  time: string;
  pinned?: boolean;
  pinnedTitle?: string;
  attachments?: ChannelAttachment[];
  replyTo?: ChannelReply;
  deliveryStatus?: DeliveryStatus;
};

type ChannelSharedAttachment = ChannelAttachment & {
  id: number;
  author: string;
  time: string;
  text: string;
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
      { id: 3, name: 'XRAY_Thorax_Bella.jpg', label: 'Imaging Unit 4', sharedOn: 'Oct 12, 2023', sentBy: 'James Wilson', icon: 'image', url: '/icn/xray.png' },
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
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M20.1819 16.6201C21.9059 15.3381 23.0299 13.2921 23.0299 10.9831C23.0299 7.1071 19.8769 3.9541 16.0009 3.9541C12.1249 3.9541 8.9719 7.1071 8.9719 10.9831C8.9719 13.2921 10.0959 15.3381 11.8199 16.6201C8.7469 17.6531 6.5249 20.5551 6.5249 23.9711V24.9511C6.5249 26.1131 7.3499 27.1151 8.4869 27.3331C10.9579 27.8061 13.4859 28.0451 16.0019 28.0451C18.5179 28.0451 21.0459 27.8051 23.5179 27.3331C24.6539 27.1151 25.4789 26.1131 25.4789 24.9511V23.9711C25.4769 20.5551 23.2539 17.6531 20.1819 16.6201ZM10.7709 10.9831C10.7709 8.1001 13.1169 5.7541 15.9999 5.7541C18.8829 5.7541 21.2289 8.1001 21.2289 10.9831C21.2289 13.8661 18.8829 16.2121 15.9999 16.2121C13.1169 16.2121 10.7709 13.8671 10.7709 10.9831ZM23.6759 24.9511C23.6759 25.2511 23.4659 25.5101 23.1769 25.5651C18.4579 26.4671 13.5409 26.4671 8.8239 25.5651C8.5339 25.5091 8.3239 25.2511 8.3239 24.9511V23.9711C8.3239 20.6851 10.9969 18.0121 14.2819 18.0121H17.7179C21.0029 18.0121 23.6759 20.6851 23.6759 23.9711V24.9511Z" fill="#033E4F"/>
  <path d="M27.0592 16.2967C28.2412 15.2227 28.9602 13.6757 28.9602 12.0287C28.9602 9.65266 27.5312 7.55366 25.3202 6.68166C24.8602 6.50066 24.3362 6.72566 24.1532 7.18866C23.9702 7.65066 24.1972 8.17366 24.6602 8.35566C26.1792 8.95466 27.1592 10.3967 27.1592 12.0277C27.1592 13.6527 26.1412 15.1347 24.6272 15.7177C24.2432 15.8657 24.0082 16.2547 24.0572 16.6637C24.1052 17.0727 24.4252 17.3957 24.8322 17.4497C27.0652 17.7447 29.1002 20.0607 29.1002 22.3077V23.0777C29.1002 23.2247 28.9962 23.3577 28.8542 23.3857C28.6772 23.4207 28.4932 23.4527 28.3032 23.4857L27.9192 23.5527C27.4302 23.6417 27.1062 24.1097 27.1942 24.5987C27.2732 25.0337 27.6522 25.3377 28.0792 25.3377C28.1332 25.3377 28.1862 25.3327 28.2412 25.3227L28.6072 25.2587C28.8132 25.2227 29.0142 25.1887 29.2042 25.1507C30.1862 24.9577 30.9002 24.0857 30.9002 23.0777V22.3077C30.9002 19.8267 29.2742 17.4297 27.0592 16.2967Z" fill="#033E4F"/>
  <path d="M4.0811 23.5551L3.6971 23.4881C3.5081 23.4551 3.3231 23.4241 3.1431 23.3871C3.0051 23.3601 2.9001 23.2281 2.9001 23.0801V22.3101C2.9001 20.0631 4.9341 17.7471 7.1681 17.4521C7.5751 17.3981 7.8961 17.0751 7.9431 16.6661C7.9921 16.2571 7.7561 15.8681 7.3731 15.7201C5.8581 15.1371 4.8411 13.6541 4.8411 12.0301C4.8411 10.3981 5.8211 8.95605 7.3401 8.35805C7.8031 8.17505 8.0291 7.65205 7.8471 7.19005C7.6641 6.72705 7.1391 6.50105 6.6801 6.68305C4.4691 7.55505 3.0401 9.65405 3.0401 12.0301C3.0401 13.6761 3.7601 15.2241 4.9411 16.2981C2.7261 17.4301 1.1001 19.8271 1.1001 22.3101V23.0801C1.1001 24.0881 1.8141 24.9601 2.7931 25.1521C2.9851 25.1911 3.1871 25.2251 3.3931 25.2611L3.7591 25.3251C3.8141 25.3351 3.8671 25.3401 3.9211 25.3401C4.3481 25.3401 4.7271 25.0351 4.8061 24.6011C4.8951 24.1121 4.5701 23.6441 4.0811 23.5551Z" fill="#033E4F"/>
</svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_7646)">
    <path d="M19.7557 18.5783L14.7815 13.6041C16.137 11.9463 16.8035 9.83087 16.643 7.69543C16.4826 5.55999 15.5075 3.5679 13.9195 2.13123C12.3315 0.694554 10.252 -0.0767949 8.11119 -0.0232684C5.97039 0.0302581 3.93207 0.904564 2.41783 2.41881C0.903588 3.93305 0.0292815 5.97137 -0.024245 8.11216C-0.0777715 10.253 0.693577 12.3324 2.13025 13.9205C3.56693 15.5085 5.55901 16.4836 7.69445 16.644C9.8299 16.8044 11.9453 16.138 13.6032 14.7825L18.5773 19.7566C18.7345 19.9084 18.945 19.9924 19.1635 19.9905C19.382 19.9886 19.591 19.901 19.7455 19.7465C19.9 19.592 19.9877 19.383 19.9896 19.1645C19.9914 18.946 19.9075 18.7355 19.7557 18.5783ZM8.33315 15.0008C7.01461 15.0008 5.72568 14.6098 4.62935 13.8773C3.53302 13.1447 2.67854 12.1035 2.17395 10.8854C1.66937 9.66718 1.53735 8.32673 1.79458 7.03353C2.05182 5.74032 2.68676 4.55243 3.61911 3.62008C4.55146 2.68773 5.73934 2.05279 7.03255 1.79556C8.32576 1.53832 9.6662 1.67035 10.8844 2.17493C12.1025 2.67952 13.1437 3.534 13.8763 4.63033C14.6088 5.72665 14.9998 7.01559 14.9998 8.33413C14.9978 10.1016 14.2948 11.7962 13.045 13.046C11.7952 14.2958 10.1007 14.9988 8.33315 15.0008Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_7646">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_6393)">
    <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433286 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9971 7.34872 18.9426 4.80684 17.0679 2.9321C15.1932 1.05736 12.6513 0.00286757 10 0V0ZM10 18.3333C8.35183 18.3333 6.74066 17.8446 5.37025 16.9289C3.99984 16.0132 2.93174 14.7117 2.30101 13.189C1.67028 11.6663 1.50525 9.99076 1.82679 8.37425C2.14834 6.75774 2.94201 5.27288 4.10745 4.10744C5.27289 2.94201 6.75774 2.14833 8.37425 1.82679C9.99076 1.50525 11.6663 1.67027 13.189 2.301C14.7118 2.93173 16.0132 3.99984 16.9289 5.37025C17.8446 6.74066 18.3333 8.35182 18.3333 10C18.3309 12.2094 17.4522 14.3276 15.8899 15.8899C14.3276 17.4522 12.2094 18.3309 10 18.3333V18.3333Z" fill="#033E4F"/>
    <path d="M9.99967 8.3335H9.16634C8.94533 8.3335 8.73337 8.42129 8.57709 8.57757C8.42081 8.73385 8.33301 8.94582 8.33301 9.16683C8.33301 9.38784 8.42081 9.5998 8.57709 9.75608C8.73337 9.91237 8.94533 10.0002 9.16634 10.0002H9.99967V15.0002C9.99967 15.2212 10.0875 15.4331 10.2437 15.5894C10.4 15.7457 10.612 15.8335 10.833 15.8335C11.054 15.8335 11.266 15.7457 11.4223 15.5894C11.5785 15.4331 11.6663 15.2212 11.6663 15.0002V10.0002C11.6663 9.55814 11.4907 9.13421 11.1782 8.82165C10.8656 8.50909 10.4417 8.3335 9.99967 8.3335Z" fill="#033E4F"/>
    <path d="M10 6.6665C10.6904 6.6665 11.25 6.10686 11.25 5.4165C11.25 4.72615 10.6904 4.1665 10 4.1665C9.30964 4.1665 8.75 4.72615 8.75 5.4165C8.75 6.10686 9.30964 6.6665 10 6.6665Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_6393">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function BellIcon() {
  return (
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#41484B"></path></svg>
  );
}

function MessageStatusIcon({ deliveryStatus }: { deliveryStatus: DeliveryStatus }) {
  const stroke = deliveryStatus === 'Read' ? '#18A0AA' : '#033E4F';

  if (deliveryStatus === 'Delivered') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6.5L4.4 8.9L10 3.3" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
      <path d="M1 6.4L3.3 8.7L8.1 3.9" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 6.4L7.5 8.7L12.3 3.9" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MembersIcon() {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#41484B"></path></svg>
  );
}

function SettingsIcon() {
  return (
   <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z" fill="#41484B"></path></svg>
  );
}

function PhoneIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="#033E4F"/>
</svg>;
}

function VideoIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V6.5L20 2.5V13.5L16 9.5V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2ZM2 14H14V2H2V14ZM2 14V2V14Z" fill="#033E4F"/>
</svg>;
}

function DocIcon({ type }: { type: ChannelFile['icon'] }) {
  if (type === 'video') {
    return (
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_9432)">
    <path d="M15.8333 20H4.16667C3.062 19.9987 2.00296 19.5593 1.22185 18.7782C0.440735 17.997 0.00132321 16.938 0 15.8333L0 4.16667C0.00132321 3.062 0.440735 2.00296 1.22185 1.22185C2.00296 0.440735 3.062 0.00132321 4.16667 0L15.8333 0C16.938 0.00132321 17.997 0.440735 18.7782 1.22185C19.5593 2.00296 19.9987 3.062 20 4.16667V15.8333C19.9987 16.938 19.5593 17.997 18.7782 18.7782C17.997 19.5593 16.938 19.9987 15.8333 20V20ZM4.16667 1.66667C3.50363 1.66667 2.86774 1.93006 2.3989 2.3989C1.93006 2.86774 1.66667 3.50363 1.66667 4.16667V15.8333C1.66667 16.4964 1.93006 17.1323 2.3989 17.6011C2.86774 18.0699 3.50363 18.3333 4.16667 18.3333H15.8333C16.4964 18.3333 17.1323 18.0699 17.6011 17.6011C18.0699 17.1323 18.3333 16.4964 18.3333 15.8333V4.16667C18.3333 3.50363 18.0699 2.86774 17.6011 2.3989C17.1323 1.93006 16.4964 1.66667 15.8333 1.66667H4.16667ZM7.785 14.1708C7.43761 14.1697 7.09668 14.0768 6.79667 13.9017C6.50029 13.732 6.25429 13.4867 6.08386 13.1908C5.91342 12.8949 5.82467 12.559 5.82667 12.2175V7.7825C5.82638 7.44095 5.91593 7.10534 6.08632 6.80933C6.25671 6.51332 6.50195 6.26733 6.79743 6.09603C7.09291 5.92473 7.42825 5.83416 7.7698 5.83339C8.11134 5.83263 8.44708 5.9217 8.74333 6.09167L13.1417 8.2875C13.4472 8.45243 13.703 8.69606 13.8827 8.99315C14.0624 9.29025 14.1593 9.62998 14.1635 9.97715C14.1676 10.3243 14.0789 10.6663 13.9064 10.9676C13.7339 11.2689 13.484 11.5186 13.1825 11.6908L8.7025 13.93C8.42309 14.0894 8.10667 14.1724 7.785 14.1708V14.1708ZM7.76417 7.50417C7.71824 7.50415 7.67312 7.51622 7.63333 7.53917C7.59011 7.5632 7.55425 7.59855 7.52959 7.64142C7.50492 7.68428 7.49239 7.73305 7.49333 7.7825V12.2175C7.49362 12.2662 7.50656 12.314 7.53091 12.3562C7.55525 12.3984 7.59015 12.4335 7.63218 12.4582C7.6742 12.4828 7.72192 12.4961 7.77062 12.4967C7.81933 12.4973 7.86736 12.4852 7.91 12.4617L12.39 10.2217C12.4234 10.1956 12.4499 10.1618 12.4673 10.1232C12.4847 10.0845 12.4925 10.0423 12.49 10C12.491 9.95044 12.4785 9.90153 12.4536 9.85863C12.4288 9.81572 12.3927 9.78045 12.3492 9.75667L7.95417 7.56083C7.89687 7.52568 7.83136 7.50614 7.76417 7.50417V7.50417Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_9432">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
    );
  }

  if (type === 'image') {
    return (
     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_9445)">
    <path d="M14.9995 15.8328C15.1643 15.8328 15.3254 15.7839 15.4624 15.6923C15.5994 15.6007 15.7062 15.4706 15.7693 15.3183C15.8323 15.1661 15.8488 14.9986 15.8167 14.8369C15.7845 14.6753 15.7052 14.5268 15.5887 14.4103L10.4454 9.26779C9.66399 8.48667 8.60438 8.04785 7.49953 8.04785C6.39468 8.04785 5.33506 8.48667 4.55369 9.26779L2.74369 11.077C2.59189 11.2341 2.5079 11.4446 2.5098 11.6631C2.5117 11.8816 2.59934 12.0906 2.75384 12.2451C2.90835 12.3997 3.11736 12.4873 3.33586 12.4892C3.55436 12.4911 3.76486 12.4071 3.92203 12.2553L5.73203 10.4461C6.20804 9.99124 6.84111 9.73739 7.49953 9.73739C8.15794 9.73739 8.79101 9.99124 9.26703 10.4461L14.4104 15.5886C14.5666 15.7449 14.7785 15.8327 14.9995 15.8328Z" fill="#033E4F"/>
    <path d="M13.3337 8.74935C13.9105 8.74935 14.4744 8.57829 14.9541 8.2578C15.4337 7.93732 15.8076 7.48179 16.0283 6.94884C16.2491 6.41589 16.3068 5.82945 16.1943 5.26367C16.0817 4.69789 15.804 4.17819 15.3961 3.77029C14.9882 3.36239 14.4684 3.0846 13.9027 2.97206C13.3369 2.85952 12.7505 2.91728 12.2175 3.13803C11.6845 3.35879 11.229 3.73263 10.9085 4.21227C10.5881 4.69191 10.417 5.25582 10.417 5.83268C10.417 6.60623 10.7243 7.3481 11.2713 7.89508C11.8182 8.44206 12.5601 8.74935 13.3337 8.74935V8.74935ZM13.3337 4.58268C13.5809 4.58268 13.8226 4.656 14.0281 4.79335C14.2337 4.9307 14.3939 5.12592 14.4885 5.35433C14.5831 5.58274 14.6079 5.83407 14.5596 6.07655C14.5114 6.31902 14.3924 6.54175 14.2175 6.71657C14.0427 6.89138 13.82 7.01043 13.5775 7.05867C13.335 7.1069 13.0837 7.08214 12.8553 6.98753C12.6269 6.89292 12.4317 6.73271 12.2943 6.52715C12.157 6.32159 12.0837 6.07991 12.0837 5.83268C12.0837 5.50116 12.2154 5.18322 12.4498 4.9488C12.6842 4.71438 13.0021 4.58268 13.3337 4.58268V4.58268Z" fill="#033E4F"/>
    <path d="M19.1663 13.334C18.9453 13.334 18.7334 13.4218 18.5771 13.5781C18.4208 13.7343 18.333 13.9463 18.333 14.1673V15.834C18.333 16.497 18.0696 17.1329 17.6008 17.6017C17.1319 18.0706 16.496 18.334 15.833 18.334H14.1663C13.9453 18.334 13.7334 18.4218 13.5771 18.5781C13.4208 18.7343 13.333 18.9463 13.333 19.1673C13.333 19.3883 13.4208 19.6003 13.5771 19.7566C13.7334 19.9128 13.9453 20.0006 14.1663 20.0006H15.833C16.9377 19.9993 17.9967 19.5599 18.7778 18.7788C19.5589 17.9977 19.9983 16.9386 19.9997 15.834V14.1673C19.9997 13.9463 19.9119 13.7343 19.7556 13.5781C19.5993 13.4218 19.3873 13.334 19.1663 13.334Z" fill="#033E4F"/>
    <path d="M0.833333 6.66667C1.05435 6.66667 1.26631 6.57887 1.42259 6.42259C1.57887 6.26631 1.66667 6.05435 1.66667 5.83333V4.16667C1.66667 3.50363 1.93006 2.86774 2.3989 2.3989C2.86774 1.93006 3.50363 1.66667 4.16667 1.66667H5.83333C6.05435 1.66667 6.26631 1.57887 6.42259 1.42259C6.57887 1.26631 6.66667 1.05435 6.66667 0.833333C6.66667 0.61232 6.57887 0.400358 6.42259 0.244078C6.26631 0.0877974 6.05435 0 5.83333 0L4.16667 0C3.062 0.00132321 2.00296 0.440735 1.22185 1.22185C0.440735 2.00296 0.00132321 3.062 0 4.16667L0 5.83333C0 6.05435 0.0877974 6.26631 0.244078 6.42259C0.400358 6.57887 0.61232 6.66667 0.833333 6.66667Z" fill="#033E4F"/>
    <path d="M5.83333 18.334H4.16667C3.50363 18.334 2.86774 18.0706 2.3989 17.6017C1.93006 17.1329 1.66667 16.497 1.66667 15.834V14.1673C1.66667 13.9463 1.57887 13.7343 1.42259 13.5781C1.26631 13.4218 1.05435 13.334 0.833333 13.334C0.61232 13.334 0.400358 13.4218 0.244078 13.5781C0.0877974 13.7343 0 13.9463 0 14.1673L0 15.834C0.00132321 16.9386 0.440735 17.9977 1.22185 18.7788C2.00296 19.5599 3.062 19.9993 4.16667 20.0006H5.83333C6.05435 20.0006 6.26631 19.9128 6.42259 19.7566C6.57887 19.6003 6.66667 19.3883 6.66667 19.1673C6.66667 18.9463 6.57887 18.7343 6.42259 18.5781C6.26631 18.4218 6.05435 18.334 5.83333 18.334Z" fill="#033E4F"/>
    <path d="M15.833 0H14.1663C13.9453 0 13.7334 0.0877974 13.5771 0.244078C13.4208 0.400358 13.333 0.61232 13.333 0.833333C13.333 1.05435 13.4208 1.26631 13.5771 1.42259C13.7334 1.57887 13.9453 1.66667 14.1663 1.66667H15.833C16.496 1.66667 17.1319 1.93006 17.6008 2.3989C18.0696 2.86774 18.333 3.50363 18.333 4.16667V5.83333C18.333 6.05435 18.4208 6.26631 18.5771 6.42259C18.7334 6.57887 18.9453 6.66667 19.1663 6.66667C19.3873 6.66667 19.5993 6.57887 19.7556 6.42259C19.9119 6.26631 19.9997 6.05435 19.9997 5.83333V4.16667C19.9983 3.062 19.5589 2.00296 18.7778 1.22185C17.9967 0.440735 16.9377 0.00132321 15.833 0V0Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_9445">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
    );
  }

  return (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_9325)">
    <path d="M16.6245 4.61335L13.7212 1.70835C13.1806 1.16513 12.5377 0.734461 11.8297 0.441235C11.1216 0.148009 10.3625 -0.00195323 9.59616 1.92072e-05H5.83366C4.729 0.00134242 3.66996 0.440754 2.88884 1.22187C2.10773 2.00298 1.66832 3.06202 1.66699 4.16669V15.8334C1.66832 16.938 2.10773 17.9971 2.88884 18.7782C3.66996 19.5593 4.729 19.9987 5.83366 20H14.167C15.2717 19.9987 16.3307 19.5593 17.1118 18.7782C17.8929 17.9971 18.3323 16.938 18.3337 15.8334V8.73752C18.3357 7.9712 18.1857 7.2121 17.8923 6.50416C17.599 5.79623 17.168 5.15355 16.6245 4.61335V4.61335ZM15.4462 5.79169C15.7006 6.05347 15.9195 6.34768 16.097 6.66669H12.5003C12.2793 6.66669 12.0674 6.57889 11.9111 6.42261C11.7548 6.26633 11.667 6.05437 11.667 5.83335V2.23669C11.9861 2.41412 12.2806 2.63265 12.5428 2.88669L15.4462 5.79169ZM16.667 15.8334C16.667 16.4964 16.4036 17.1323 15.9348 17.6011C15.4659 18.07 14.83 18.3334 14.167 18.3334H5.83366C5.17062 18.3334 4.53473 18.07 4.06589 17.6011C3.59705 17.1323 3.33366 16.4964 3.33366 15.8334V4.16669C3.33366 3.50364 3.59705 2.86776 4.06589 2.39892C4.53473 1.93008 5.17062 1.66669 5.83366 1.66669H9.59616C9.73283 1.66669 9.86533 1.69335 10.0003 1.70585V5.83335C10.0003 6.49639 10.2637 7.13228 10.7326 7.60112C11.2014 8.06996 11.8373 8.33335 12.5003 8.33335H16.6278C16.6403 8.46835 16.667 8.60002 16.667 8.73752V15.8334Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_9325">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>
  );
}

function DownloadIcon() {
  return<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_930_5295)">
    <path d="M8.23169 15.1017C8.46386 15.334 8.73953 15.5183 9.04295 15.644C9.34636 15.7697 9.67159 15.8345 10 15.8345C10.3285 15.8345 10.6537 15.7697 10.9571 15.644C11.2605 15.5183 11.5362 15.334 11.7684 15.1017L14.4442 12.4258C14.5877 12.2672 14.6646 12.0594 14.6591 11.8455C14.6536 11.6317 14.5661 11.4282 14.4147 11.2771C14.2633 11.126 14.0595 11.0389 13.8457 11.0338C13.6318 11.0288 13.4242 11.1062 13.2659 11.25L10.8275 13.6892L10.8334 0.833333C10.8334 0.61232 10.7456 0.400358 10.5893 0.244078C10.433 0.0877974 10.221 0 10 0V0C9.77901 0 9.56705 0.0877974 9.41077 0.244078C9.25449 0.400358 9.16669 0.61232 9.16669 0.833333L9.15919 13.6733L6.73419 11.25C6.57783 11.0937 6.36579 11.006 6.14473 11.0061C5.92367 11.0062 5.7117 11.094 5.55544 11.2504C5.39919 11.4068 5.31145 11.6188 5.31152 11.8399C5.3116 12.0609 5.39949 12.2729 5.55586 12.4292L8.23169 15.1017Z" fill="#374957"/>
    <path d="M19.1667 13.333C18.9457 13.333 18.7337 13.4208 18.5774 13.5771C18.4211 13.7334 18.3333 13.9453 18.3333 14.1663V17.4997C18.3333 17.7207 18.2455 17.9326 18.0893 18.0889C17.933 18.2452 17.721 18.333 17.5 18.333H2.5C2.27899 18.333 2.06702 18.2452 1.91074 18.0889C1.75446 17.9326 1.66667 17.7207 1.66667 17.4997V14.1663C1.66667 13.9453 1.57887 13.7334 1.42259 13.5771C1.26631 13.4208 1.05435 13.333 0.833333 13.333V13.333C0.61232 13.333 0.400358 13.4208 0.244078 13.5771C0.0877974 13.7334 0 13.9453 0 14.1663L0 17.4997C0 18.1627 0.263392 18.7986 0.732233 19.2674C1.20107 19.7363 1.83696 19.9997 2.5 19.9997H17.5C18.163 19.9997 18.7989 19.7363 19.2678 19.2674C19.7366 18.7986 20 18.1627 20 17.4997V14.1663C20 13.9453 19.9122 13.7334 19.7559 13.5771C19.5996 13.4208 19.3877 13.333 19.1667 13.333Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_930_5295">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg>;
}

function BackIcon() {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M13 5.00079H3L6.29 1.71079C6.38373 1.61783 6.45812 1.50723 6.50889 1.38537C6.55966 1.26351 6.5858 1.1328 6.5858 1.00079C6.5858 0.86878 6.55966 0.738074 6.50889 0.616215C6.45812 0.494356 6.38373 0.383755 6.29 0.290792C6.10264 0.104541 5.84919 0 5.585 0C5.32081 0 5.06736 0.104541 4.88 0.290792L0.59 4.59079C0.214412 4.96414 0.00223279 5.47121 0 6.00079C0.00486659 6.52689 0.216844 7.02989 0.59 7.40078L4.88 11.7008C4.97324 11.7934 5.0838 11.8667 5.20537 11.9165C5.32694 11.9664 5.45714 11.9918 5.58854 11.9913C5.71993 11.9909 5.84995 11.9645 5.97116 11.9138C6.09238 11.8631 6.20242 11.789 6.295 11.6958C6.38758 11.6025 6.46089 11.492 6.51075 11.3704C6.5606 11.2488 6.58602 11.1186 6.58556 10.9872C6.58509 10.8558 6.55875 10.7258 6.50804 10.6046C6.45733 10.4834 6.38324 10.3734 6.29 10.2808L3 7.00078H13C13.2652 7.00078 13.5196 6.89543 13.7071 6.70789C13.8946 6.52035 14 6.266 14 6.00079C14 5.73557 13.8946 5.48122 13.7071 5.29368C13.5196 5.10614 13.2652 5.00079 13 5.00079Z" fill="#033E4F"></path></svg>
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
  const [attachedFile, setAttachedFile] = useState<ChannelAttachment | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploadHintVisible, setIsUploadHintVisible] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChannelReply | null>(null);
  const [copiedToast, setCopiedToast] = useState('');
  const [openMessageActionsId, setOpenMessageActionsId] = useState<number | null>(null);
  const [modalPreviewAttachment, setModalPreviewAttachment] = useState<ChannelSharedAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageStatusTimeoutsRef = useRef<number[]>([]);

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

      if (!(target instanceof Element) || !target.closest('.messages_actions_menu_wrap')) {
        setOpenMessageActionsId(null);
      }

      if (!(target instanceof Element) || !target.closest('.messages_emoji_picker_wrap')) {
        setIsEmojiPickerOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMessageActionsId(null);
        setModalPreviewAttachment(null);
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

  useEffect(() => {
    if (!copiedToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopiedToast(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copiedToast]);

  useEffect(() => {
    const timeoutIds = messageStatusTimeoutsRef.current;

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
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
  const pinnedMessages = selectedChannel?.messages.filter((message) => message.pinned) ?? [];

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

  const getChannelMessageMember = (author: string) => {
    if (!selectedChannel) {
      return null;
    }

    return (
      selectedChannel.members.find((member) => member.name === author) ??
      selectedChannel.members.find((member) => author.includes(member.name) || member.name.includes(author)) ??
      null
    );
  };

  const getAttachmentIconType = (attachment: { name: string; type: string }): ChannelFile['icon'] => {
    const typeLabel = attachment.type.toLowerCase();
    const extension = attachment.name.split('.').pop()?.toLowerCase() ?? '';

    if (typeLabel.includes('video') || ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) {
      return 'video';
    }

    if (typeLabel.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }

    return 'doc';
  };

  const getAttachmentExtension = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

  const getAttachmentKind = (name: string) => {
    const extension = getAttachmentExtension(name);

    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }

    if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) {
      return 'video';
    }

    if (extension === 'pdf') {
      return 'pdf';
    }

    return 'file';
  };

  const getAttachmentTypeLabel = (name: string) => {
    const extension = getAttachmentExtension(name);

    if (extension === 'pdf') {
      return 'PDF Document';
    }

    if (getAttachmentKind(name) === 'video') {
      return 'Video File';
    }

    if (getAttachmentKind(name) === 'image') {
      return 'Image File';
    }

    return extension ? `${extension.toUpperCase()} File` : 'File';
  };

  const getAttachmentTone = (name: string) => {
    const kind = getAttachmentKind(name);

    if (kind === 'pdf') {
      return 'pdf';
    }

    if (kind === 'video') {
      return 'video';
    }

    if (kind === 'image') {
      return 'image';
    }

    return 'file';
  };

  const truncateAttachmentName = (name: string) => (name.length > 24 ? `${name.slice(0, 21)}...` : name);

  const getChannelFileSharedAttachment = (file: ChannelFile): ChannelSharedAttachment => ({
    id: file.id,
    name: file.name,
    size: file.label,
    type: getAttachmentTypeLabel(file.name),
    url: file.url,
    author: file.sentBy,
    time: file.sharedOn,
    text: file.label,
  });

  const sendMessage = () => {
    const trimmed = draftMessage.trim();
    const messageId = Date.now();

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
                  id: messageId,
                  author: 'Me',
                  sender: 'me',
                  text: trimmed,
                  time: 'Now',
                  attachments: attachedFile ? [attachedFile] : undefined,
                  replyTo: replyingTo ?? undefined,
                  deliveryStatus: 'Sending...',
                },
              ],
            }
          : channel
      )
    );
    setDraftMessage('');
    setAttachedFile(null);
    setReplyingTo(null);
    setIsDragActive(false);
    setIsEmojiPickerOpen(false);

    const deliveryStatuses: DeliveryStatus[] = ['Sent', 'Delivered', 'Read'];

    const statusTimeouts = deliveryStatuses.map((status, index) =>
      window.setTimeout(() => {
        setChannels((current) =>
          current.map((channel) =>
            channel.id === selectedChannel.id
              ? {
                  ...channel,
                  messages: channel.messages.map((message) =>
                    message.id === messageId ? { ...message, deliveryStatus: status } : message
                  ),
                }
              : channel
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

  const togglePinnedMessage = (messageId: number) => {
    if (!selectedChannel) {
      return;
    }

    setChannels((current) =>
      current.map((channel) =>
        channel.id === selectedChannel.id
          ? {
              ...channel,
              messages: channel.messages.map((message) =>
                message.id === messageId ? { ...message, pinned: !message.pinned } : message
              ),
            }
          : channel
      )
    );
  };

  const handleReply = (message: ChannelMessage) => {
    setReplyingTo({
      author: message.author,
      text: message.attachments?.length ? `${message.attachments[0].name} attached` : message.text,
    });
    setOpenMessageActionsId(null);
  };

  const handleCopy = async (message: ChannelMessage) => {
    const payload = [
      message.text,
      message.attachments?.map((attachment) => `${attachment.name} (${attachment.size})`).join('\n') ?? '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedToast('Copied Message Text');
    } catch {
      setCopiedToast('Copied Message Text');
    }

    setOpenMessageActionsId(null);
  };

  const handleDownloadAttachment = (attachment: ChannelAttachment) => {
    const link = document.createElement('a');

    if (attachment.url) {
      link.href = attachment.url;
    } else {
      const fallbackFile = new Blob(
        [`${attachment.name}\n${attachment.size} • ${getAttachmentTypeLabel(attachment.name)}\nDemo attachment export.`],
        { type: 'text/plain' }
      );

      link.href = URL.createObjectURL(fallbackFile);
    }

    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (link.href.startsWith('blob:')) {
      window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    }
  };

  const renderDownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_channels_download)">
        <path d="M9.87725 18.122C10.1559 18.4008 10.4867 18.6219 10.8508 18.7728C11.2149 18.9237 11.6051 19.0014 11.9992 19.0014C12.3934 19.0014 12.7836 18.9237 13.1477 18.7728C13.5118 18.6219 13.8426 18.4008 14.1212 18.122L17.3322 14.911C17.5044 14.7206 17.5968 14.4713 17.5902 14.2147C17.5836 13.958 17.4786 13.7138 17.2969 13.5325C17.1151 13.3512 16.8707 13.2467 16.614 13.2406C16.3574 13.2346 16.1083 13.3274 15.9182 13.5L12.9922 16.427L12.9992 1C12.9992 0.734784 12.8939 0.48043 12.7064 0.292893C12.5188 0.105357 12.2645 0 11.9992 0C11.734 0 11.4797 0.105357 11.2921 0.292893C11.1046 0.48043 10.9992 0.734784 10.9992 1L10.9902 16.408L8.08025 13.5C7.89261 13.3125 7.63817 13.2072 7.3729 13.2073C7.10763 13.2074 6.85326 13.3129 6.66575 13.5005C6.47824 13.6881 6.37295 13.9426 6.37305 14.2079C6.37314 14.4731 6.47861 14.7275 6.66625 14.915L9.87725 18.122Z" fill="#033E4F"/>
        <path d="M23 16C22.7348 16 22.4804 16.1054 22.2929 16.2929C22.1054 16.4804 22 16.7348 22 17V21C22 21.2652 21.8946 21.5196 21.7071 21.7071C21.5196 21.8946 21.2652 22 21 22H3C2.73478 22 2.48043 21.8946 2.29289 21.7071C2.10536 21.5196 2 21.2652 2 21V17C2 16.7348 1.89464 16.4804 1.70711 16.2929C1.51957 16.1054 1.26522 16 1 16C0.734784 16 0.48043 16.1054 0.292893 16.2929C0.105357 16.4804 0 16.7348 0 17L0 21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H21C21.7956 24 22.5587 23.6839 23.1213 23.1213C23.6839 22.5587 24 21.7956 24 21V17C24 16.7348 23.8946 16.4804 23.7071 16.2929C23.5196 16.1054 23.2652 16 23 16Z" fill="#033E4F"/>
      </g>
      <defs>
        <clipPath id="clip0_channels_download">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const renderAttachmentIcon = (attachment: ChannelAttachment) => {
    const kind = getAttachmentKind(attachment.name);

    if (kind === 'pdf') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 10.5H8V8.5H9C9.28333 8.5 9.52083 8.40417 9.7125 8.2125C9.90417 8.02083 10 7.78333 10 7.5V6.5C10 6.21667 9.90417 5.97917 9.7125 5.7875C9.52083 5.59583 9.28333 5.5 9 5.5H7V10.5ZM8 7.5V6.5H9V7.5H8ZM11 10.5H13C13.2833 10.5 13.5208 10.4042 13.7125 10.2125C13.9042 10.0208 14 9.78333 14 9.5V6.5C14 6.21667 13.9042 5.97917 13.7125 5.7875C13.5208 5.59583 13.2833 5.5 13 5.5H11V10.5ZM12 9.5V6.5H13V9.5H12ZM15 10.5H16V8.5H17V7.5H16V6.5H17V5.5H15V10.5ZM6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6ZM6 14H18V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H16V20H2ZM6 2V14V2Z" fill="#E4432D"/>
        </svg>
      );
    }

    if (kind === 'video') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <rect x="3.75" y="6.25" width="22.5" height="17.5" rx="3" stroke="currentColor" strokeWidth="2.4" />
          <path d="M12.5 11.25L19.375 15L12.5 18.75V11.25Z" fill="currentColor" />
        </svg>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M4 16H12V14H4V16ZM4 12H12V10H4V12ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H10L16 6V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM9 7V2H2V18H14V7H9Z" fill="#033E4F"/>
      </svg>
    );
  };

  const renderAttachmentCard = (attachment: ChannelAttachment | ChannelSharedAttachment, className = '') => (
    <div
      className={`messages_attachment_card ${getAttachmentKind(attachment.name) !== 'file' ? 'previewable' : ''} ${className}`}
      role={getAttachmentKind(attachment.name) !== 'file' ? 'button' : undefined}
      tabIndex={getAttachmentKind(attachment.name) !== 'file' ? 0 : undefined}
      onClick={() => {
        if (getAttachmentKind(attachment.name) !== 'file') {
          setModalPreviewAttachment(attachment as ChannelSharedAttachment);
        }
      }}
      onKeyDown={(event) => {
        if (getAttachmentKind(attachment.name) !== 'file' && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          setModalPreviewAttachment(attachment as ChannelSharedAttachment);
        }
      }}
    >
      <div className={`messages_attachment_icon ${getAttachmentTone(attachment.name)}`} aria-hidden="true">
        {renderAttachmentIcon(attachment)}
      </div>
      <div className="messages_attachment_details">
        <strong title={attachment.name}>{truncateAttachmentName(attachment.name)}</strong>
        <span>
          {attachment.size} &bull; {attachment.type || getAttachmentTypeLabel(attachment.name)}
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

    const kind = getAttachmentKind(modalPreviewAttachment.name);

    return (
      <div className="messages_preview_modal" role="dialog" aria-modal="true">
        <div className="messages_preview_backdrop" onClick={() => setModalPreviewAttachment(null)}></div>
        <div className="messages_preview_dialog">
          <button type="button" className="messages_preview_close" onClick={() => setModalPreviewAttachment(null)} aria-label="Close preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="#033E4F" strokeWidth="2" />
              <path d="M8 8L16 16" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 8L8 16" stroke="#033E4F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className={`messages_media_preview ${kind}_view`}>
            <div className="messages_media_preview_head">
              <button type="button" onClick={() => handleDownloadAttachment(modalPreviewAttachment)}>
                {renderDownloadIcon()}
              </button>
            </div>

            {kind === 'image' ? (
              <div className="messages_image_stage">
                {modalPreviewAttachment.url ? <img src={modalPreviewAttachment.url} alt={modalPreviewAttachment.name} /> : <div className="messages_missing_media">Image preview unavailable</div>}
              </div>
            ) : kind === 'video' ? (
              <div className="messages_video_stage">
                {modalPreviewAttachment.url ? <video src={modalPreviewAttachment.url} controls preload="metadata" /> : <div className="messages_video_placeholder"><h4>Video preview ready</h4><p>Attach a real video URL to play it here. This demo item can still be downloaded.</p></div>}
              </div>
            ) : kind === 'pdf' ? (
              <div className="messages_pdf_stage">
                {modalPreviewAttachment.url ? <iframe src={modalPreviewAttachment.url} title={modalPreviewAttachment.name} className="messages_pdf_frame" /> : <div className="messages_missing_media">PDF preview unavailable. Download the document to inspect it.</div>}
              </div>
            ) : (
              <div className="messages_file_preview_stage">
                <div className={`messages_attachment_icon ${getAttachmentTone(modalPreviewAttachment.name)}`} aria-hidden="true">
                  {renderAttachmentIcon(modalPreviewAttachment)}
                </div>
                <div className="messages_file_preview_copy">
                  <h4>{modalPreviewAttachment.name}</h4>
                  <p>{modalPreviewAttachment.text || 'Preview this shared file, or download it to inspect the full document contents.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                {/* <button type="button" className="channels_leave_btn">Leave Channel</button> */}
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
              {/* <div className="channels_settings_footer_action">
                <button type="button" className="messages_group_leave_btn v2">Leave Channel</button>
                </div> */}
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
              {/* <div className="channels_settings_footer_action">
                <button type="button" className="channels_leave_btn">Leave Channel</button>
                </div> */}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={`channels_directory ${showDetails ? 'details_open' : ''}`}>
          <aside className="channels_sidebar">
            <div className="channels_sidebar_top">
              <h1>Channels</h1>
             
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
                      {channel.pinned ? <span className="channels_pin_mark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M15.817 5.48635C15.1196 4.78901 11.1279 0.797289 10.5136 0.18307C10.2695 -0.0610234 9.8738 -0.0610234 9.62973 0.18307C9.38567 0.427164 9.38567 0.822883 9.62973 1.06695L10.0717 1.50891L6.7502 4.83041C5.92133 4.66632 5.06098 4.69004 4.24083 4.90188C3.2727 5.15195 2.38539 5.6597 1.67483 6.37029C1.43073 6.61435 1.43077 7.01007 1.67483 7.25416L4.76842 10.3478L0.183047 14.9331C-0.0610156 15.1771 -0.0610156 15.5729 0.183047 15.8169C0.427109 16.061 0.822859 16.061 1.06695 15.8169L5.65227 11.2316L8.74583 14.3252C8.86789 14.4473 9.0278 14.5083 9.1878 14.5083C9.34773 14.5083 9.5077 14.4472 9.62977 14.3252C10.3403 13.6146 10.8481 12.7273 11.0981 11.7592C11.31 10.939 11.3337 10.0787 11.1696 9.24982L14.4911 5.92829L14.9331 6.37023C15.1771 6.61429 15.5729 6.61432 15.817 6.37023C16.061 6.12616 16.061 5.73045 15.817 5.48635ZM10.0407 8.61101C9.88292 8.76876 9.82123 8.99866 9.87877 9.2142C10.2266 10.5167 9.94914 11.9039 9.15583 12.9674L6.09436 9.90591L6.09427 9.90579C6.09427 9.90579 6.0942 9.90573 6.09414 9.90569L3.03264 6.8442C4.09611 6.05088 5.48339 5.77345 6.78583 6.12126C7.00136 6.17882 7.23127 6.11713 7.38905 5.95935L10.9556 2.39276L13.6073 5.04438L10.0407 8.61101Z" fill="#E4432D"/>
</svg></span> : null}
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
                            <button
                              type="button"
                              aria-label={`Preview ${file.name}`}
                              onClick={() => setModalPreviewAttachment(getChannelFileSharedAttachment(file))}
                            >
                              <img src="/icn/eye_icn.svg" alt="" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Download ${file.name}`}
                              onClick={() => handleDownloadAttachment(getChannelFileSharedAttachment(file))}
                            >
                              <DownloadIcon />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : selectedChannel.hasMessages ? (
                  <>
                    <div className="channels_chat_feed">
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
                                  <path d="M11.625 2.625L15.375 6.375L12.1875 7.3125L10.125 9.375L13.5 12.75L12 14.25L8.625 10.875L6.5625 12.9375L5.625 16.125L1.875 12.375L5.0625 11.4375L7.125 9.375L3.75 6L5.25 4.5L8.625 7.875L10.6875 5.8125L11.625 2.625Z" fill="#E4432D" />
                                </svg>
                                <div className="messages_pinned_content">
                                  <strong>{message.author}</strong>
                                  <span aria-hidden="true">-</span>
                                  <span className="messages_pinned_text">
                                    {message.text || message.pinnedTitle || message.attachments?.[0]?.name || 'Pinned Update'}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="channels_day_divider"><span>Today, October 24</span></div>

                      {selectedChannel.messages.map((message) => (
                        <div key={message.id} className={`channels_message_row messages_bubble_row ${message.sender === 'me' ? 'me outgoing' : 'incoming'}`}>
                          {message.pinned ? (
                         <></>
                          ) : message.sender === 'member' ? (
                            <>
                              <div className="channels_message_avatar">
                                <img
                                  src={getChannelMessageMember(message.author)?.avatar ?? '/icn/user_avatar.svg'}
                                  alt={message.author}
                                />
                              </div>
                              <div className="channels_message_content">
                                <div className="channels_message_head">
                                  <b>{message.author}</b>
                                  {message.role ? <em className={message.role}>{message.role}</em> : null}
                                  <span>{message.time}</span>
                                  <div className={`messages_actions_menu_wrap ${openMessageActionsId === message.id ? 'open' : ''}`}>
                                    <button
                                      type="button"
                                      className="messages_actions_trigger"
                                      onClick={() => setOpenMessageActionsId((current) => (current === message.id ? null : message.id))}
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
  <g clip-path="url(#clip0_930_4587)">
    <path d="M15.3333 15.9996C15.1565 15.9996 14.9869 15.9293 14.8619 15.8043C14.7368 15.6793 14.6666 15.5097 14.6666 15.3329C14.6655 14.2724 14.2438 13.2556 13.4939 12.5057C12.7439 11.7557 11.7271 11.334 10.6666 11.3329H6.77993V12.3902C6.77987 12.6539 6.70165 12.9116 6.55513 13.1309C6.40862 13.3501 6.2004 13.5209 5.9568 13.6218C5.7132 13.7227 5.44516 13.7491 5.18655 13.6977C4.92795 13.6463 4.6904 13.5193 4.50393 13.3329L0.584596 9.41359C0.209654 9.03853 -0.000976563 8.52991 -0.000976562 7.99959C-0.000976563 7.46926 0.209654 6.96064 0.584596 6.58559L4.50393 2.66626C4.6904 2.47985 4.92795 2.35291 5.18655 2.30148C5.44516 2.25006 5.7132 2.27646 5.9568 2.37736C6.2004 2.47825 6.40862 2.6491 6.55513 2.86832C6.70165 3.08753 6.77987 3.34526 6.77993 3.60893V4.66626H9.99993C11.5907 4.66802 13.1158 5.30073 14.2406 6.42556C15.3655 7.5504 15.9982 9.07549 15.9999 10.6662V15.3329C15.9999 15.5097 15.9297 15.6793 15.8047 15.8043C15.6796 15.9293 15.5101 15.9996 15.3333 15.9996ZM5.4466 3.60893L1.52726 7.52825C1.40228 7.65327 1.33207 7.82281 1.33207 7.99959C1.33207 8.17636 1.40228 8.3459 1.52726 8.47092L5.4466 12.3902V10.6662C5.4466 10.4894 5.51683 10.3199 5.64186 10.1948C5.76688 10.0698 5.93645 9.99958 6.11326 9.99958H10.6666C11.4237 9.99936 12.1721 10.1606 12.8618 10.4726C13.5516 10.7846 14.1669 11.2402 14.6666 11.8089V10.6662C14.6652 9.42901 14.1731 8.24284 13.2982 7.36798C12.4233 6.49312 11.2372 6.001 9.99993 5.99959H6.11326C5.93645 5.99959 5.76688 5.92935 5.64186 5.80433C5.51683 5.6793 5.4466 5.50973 5.4466 5.33292V3.60893Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_4587">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                                          Reply
                                        </button>
                                        <button type="button" onClick={() => { togglePinnedMessage(message.id); setOpenMessageActionsId(null); }}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_930_6523)">
    <path d="M0.666525 16.0005C0.843321 16.0005 1.01286 15.9302 1.13786 15.8052L5.55053 11.3925L6.38253 12.2539C7.00961 12.9165 7.8739 13.3035 8.78586 13.3299C9.08987 13.3308 9.3918 13.2796 9.67852 13.1785C10.1216 13.026 10.5108 12.7481 10.7989 12.3787C11.0871 12.0092 11.2618 11.564 11.3019 11.0972C11.3742 10.4211 11.3241 9.73751 11.1539 9.0792L11.0112 8.38454C10.9842 8.27345 10.9862 8.15728 11.017 8.04718C11.0478 7.93709 11.1064 7.83677 11.1872 7.75587L12.2452 6.6972C12.2869 6.65531 12.3434 6.63138 12.4025 6.63053C12.4233 6.62667 12.4447 6.62868 12.4644 6.63634C12.484 6.644 12.5012 6.65699 12.5139 6.67387C12.8487 7.02897 13.2992 7.25304 13.7844 7.30583C14.2697 7.35862 14.7578 7.23666 15.1612 6.96187C15.3979 6.79313 15.595 6.57482 15.7387 6.32214C15.8824 6.06946 15.9693 5.7885 15.9934 5.4988C16.0174 5.20911 15.978 4.91766 15.8779 4.64474C15.7779 4.37182 15.6195 4.124 15.4139 3.91853L12.1332 0.636535C11.7963 0.291268 11.3488 0.0753909 10.8689 0.0266451C10.389 -0.0221007 9.90726 0.0993871 9.50786 0.369868C9.27111 0.538557 9.07398 0.756826 8.9302 1.00948C8.78642 1.26213 8.69945 1.54308 8.67533 1.83278C8.65122 2.12247 8.69054 2.41394 8.79057 2.68689C8.8906 2.95983 9.04893 3.20769 9.25453 3.4132L9.30519 3.46387C9.34338 3.50233 9.36481 3.55433 9.36481 3.60853C9.36481 3.66274 9.34338 3.71474 9.30519 3.7532L8.23853 4.81987C8.1567 4.90152 8.05504 4.9605 7.94354 4.991C7.83204 5.02151 7.71452 5.02249 7.60253 4.99387L7.05786 4.85453C6.38789 4.67956 5.69185 4.62694 5.00319 4.6992C4.51476 4.74979 4.05098 4.93896 3.66651 5.24441C3.28204 5.54986 2.9929 5.95886 2.83319 6.4232C2.6589 6.90037 2.62453 7.4174 2.73414 7.91344C2.84374 8.40948 3.09274 8.86389 3.45186 9.2232L4.62386 10.4365L0.195191 14.8625C0.101985 14.9558 0.038514 15.0745 0.0128023 15.2038C-0.0129094 15.3331 0.000292604 15.4672 0.0507393 15.589C0.101186 15.7108 0.186612 15.8149 0.296219 15.8881C0.405826 15.9614 0.534691 16.0005 0.666525 16.0005ZM4.08986 6.8672C4.16498 6.64008 4.30433 6.43961 4.49104 6.29005C4.67775 6.14049 4.90381 6.04827 5.14186 6.02454C5.29534 6.00856 5.44955 6.00055 5.60386 6.00053C5.98207 6.00055 6.35871 6.04917 6.72453 6.1452L7.27319 6.2852C7.60934 6.37025 7.96178 6.36674 8.29617 6.27502C8.63056 6.18331 8.93547 6.00651 9.18119 5.76187L10.2479 4.6952C10.5357 4.40653 10.6973 4.01551 10.6973 3.60787C10.6973 3.20022 10.5357 2.80921 10.2479 2.52053L10.1972 2.46987C10.1282 2.401 10.0751 2.31783 10.0417 2.22623C10.0083 2.13462 9.99541 2.0368 10.0039 1.93967C10.0124 1.84254 10.0422 1.74846 10.091 1.66406C10.1398 1.57966 10.2066 1.507 10.2865 1.4512C10.4288 1.36508 10.5964 1.33066 10.7611 1.35374C10.9257 1.37681 11.0774 1.45597 11.1905 1.57787L14.4732 4.86053C14.5422 4.9294 14.5953 5.01257 14.6287 5.10418C14.6621 5.19578 14.675 5.2936 14.6665 5.39073C14.6579 5.48787 14.6282 5.58195 14.5794 5.66634C14.5306 5.75074 14.4638 5.8234 14.3839 5.8792C14.2401 5.96649 14.0703 6.00094 13.9039 5.9766C13.7374 5.95227 13.5847 5.87068 13.4719 5.74587C13.3347 5.60444 13.1706 5.49193 12.9892 5.41498C12.8078 5.33804 12.6129 5.29821 12.4159 5.29787C12.0002 5.29976 11.6017 5.4633 11.3045 5.75387L10.2472 6.81187C10.0071 7.05212 9.83216 7.34956 9.73885 7.67615C9.64554 8.00274 9.63694 8.34771 9.71386 8.67854L9.85986 9.38387C9.99438 9.89815 10.0353 10.4324 9.98052 10.9612C9.96459 11.1768 9.88564 11.3831 9.75348 11.5542C9.62133 11.7254 9.44179 11.8539 9.23719 11.9239C8.89616 12.0135 8.5367 12.0048 8.20044 11.8986C7.86419 11.7924 7.56488 11.5931 7.33719 11.3239L4.40386 8.29054C4.22095 8.10812 4.09416 7.87709 4.03851 7.62483C3.98286 7.37257 4.00068 7.10965 4.08986 6.8672V6.8672Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_6523">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                                          {message.pinned ? 'Unpin' : 'Pin'}
                                        </button>
                                        <button type="button" onClick={() => handleCopy(message)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_930_6525)">
    <path d="M10 13.3333H3.33333C2.4496 13.3323 1.60237 12.9807 0.97748 12.3559C0.352588 11.731 0.00105857 10.8837 0 10L0 3.33333C0.00105857 2.4496 0.352588 1.60237 0.97748 0.97748C1.60237 0.352588 2.4496 0.00105857 3.33333 0L10 0C10.8837 0.00105857 11.731 0.352588 12.3559 0.97748C12.9807 1.60237 13.3323 2.4496 13.3333 3.33333V10C13.3323 10.8837 12.9807 11.731 12.3559 12.3559C11.731 12.9807 10.8837 13.3323 10 13.3333V13.3333ZM3.33333 1.33333C2.8029 1.33333 2.29419 1.54405 1.91912 1.91912C1.54405 2.29419 1.33333 2.8029 1.33333 3.33333V10C1.33333 10.5304 1.54405 11.0391 1.91912 11.4142C2.29419 11.7893 2.8029 12 3.33333 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10V3.33333C12 2.8029 11.7893 2.29419 11.4142 1.91912C11.0391 1.54405 10.5304 1.33333 10 1.33333H3.33333ZM16 12.6667V4C16 3.82319 15.9298 3.65362 15.8047 3.5286C15.6797 3.40357 15.5101 3.33333 15.3333 3.33333C15.1565 3.33333 14.987 3.40357 14.8619 3.5286C14.7369 3.65362 14.6667 3.82319 14.6667 4V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667H4C3.82319 14.6667 3.65362 14.7369 3.5286 14.8619C3.40357 14.987 3.33333 15.1565 3.33333 15.3333C3.33333 15.5101 3.40357 15.6797 3.5286 15.8047C3.65362 15.9298 3.82319 16 4 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V12.6667Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_930_6525">
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
                                <div className="channels_message_bubble">
                                  {message.replyTo ? (
                                    <div className="messages_reply_quote">
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
                                            id: Number(`${message.id}`),
                                            author: message.author,
                                            time: message.time,
                                            text: message.text,
                                          })}
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="channels_message_content channels_message_content_me">
                              <div className="channels_message_head channels_message_head_me">
                                <span>{message.time}</span>
                                <b>Me</b>
                                <div className={`messages_actions_menu_wrap ${openMessageActionsId === message.id ? 'open' : ''}`}>
                                  <button
                                    type="button"
                                    className="messages_actions_trigger"
                                    onClick={() => setOpenMessageActionsId((current) => (current === message.id ? null : message.id))}
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
</svg> Reply
                                      </button>
                                      <button type="button" onClick={() => { togglePinnedMessage(message.id); setOpenMessageActionsId(null); }}>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_871_6528)">
    <path d="M0.666525 16.0005C0.843321 16.0005 1.01286 15.9302 1.13786 15.8052L5.55053 11.3925L6.38253 12.2539C7.00961 12.9165 7.8739 13.3035 8.78586 13.3299C9.08987 13.3308 9.3918 13.2796 9.67852 13.1785C10.1216 13.026 10.5108 12.7481 10.7989 12.3787C11.0871 12.0092 11.2618 11.564 11.3019 11.0972C11.3742 10.4211 11.3241 9.73751 11.1539 9.0792L11.0112 8.38454C10.9842 8.27345 10.9862 8.15728 11.017 8.04718C11.0478 7.93709 11.1064 7.83677 11.1872 7.75587L12.2452 6.6972C12.2869 6.65531 12.3434 6.63138 12.4025 6.63053C12.4233 6.62667 12.4447 6.62868 12.4644 6.63634C12.484 6.644 12.5012 6.65699 12.5139 6.67387C12.8487 7.02897 13.2992 7.25304 13.7844 7.30583C14.2697 7.35862 14.7578 7.23666 15.1612 6.96187C15.3979 6.79313 15.595 6.57482 15.7387 6.32214C15.8824 6.06946 15.9693 5.7885 15.9934 5.4988C16.0174 5.20911 15.978 4.91766 15.8779 4.64474C15.7779 4.37182 15.6195 4.124 15.4139 3.91853L12.1332 0.636535C11.7963 0.291268 11.3488 0.0753909 10.8689 0.0266451C10.389 -0.0221007 9.90726 0.0993871 9.50786 0.369868C9.27111 0.538557 9.07398 0.756826 8.9302 1.00948C8.78642 1.26213 8.69945 1.54308 8.67533 1.83278C8.65122 2.12247 8.69054 2.41394 8.79057 2.68689C8.8906 2.95983 9.04893 3.20769 9.25453 3.4132L9.30519 3.46387C9.34338 3.50233 9.36481 3.55433 9.36481 3.60853C9.36481 3.66274 9.34338 3.71474 9.30519 3.7532L8.23853 4.81987C8.1567 4.90152 8.05504 4.9605 7.94354 4.991C7.83204 5.02151 7.71452 5.02249 7.60253 4.99387L7.05786 4.85453C6.38789 4.67956 5.69185 4.62694 5.00319 4.6992C4.51476 4.74979 4.05098 4.93896 3.66651 5.24441C3.28204 5.54986 2.9929 5.95886 2.83319 6.4232C2.6589 6.90037 2.62453 7.4174 2.73414 7.91344C2.84374 8.40948 3.09274 8.86389 3.45186 9.2232L4.62386 10.4365L0.195191 14.8625C0.101985 14.9558 0.038514 15.0745 0.0128023 15.2038C-0.0129094 15.3331 0.000292604 15.4672 0.0507393 15.589C0.101186 15.7108 0.186612 15.8149 0.296219 15.8881C0.405826 15.9614 0.534691 16.0005 0.666525 16.0005ZM4.08986 6.8672C4.16498 6.64008 4.30433 6.43961 4.49104 6.29005C4.67775 6.14049 4.90381 6.04827 5.14186 6.02454C5.29534 6.00856 5.44955 6.00055 5.60386 6.00053C5.98207 6.00055 6.35871 6.04917 6.72453 6.1452L7.27319 6.2852C7.60934 6.37025 7.96178 6.36674 8.29617 6.27502C8.63056 6.18331 8.93547 6.00651 9.18119 5.76187L10.2479 4.6952C10.5357 4.40653 10.6973 4.01551 10.6973 3.60787C10.6973 3.20022 10.5357 2.80921 10.2479 2.52053L10.1972 2.46987C10.1282 2.401 10.0751 2.31783 10.0417 2.22623C10.0083 2.13462 9.99541 2.0368 10.0039 1.93967C10.0124 1.84254 10.0422 1.74846 10.091 1.66406C10.1398 1.57966 10.2066 1.507 10.2865 1.4512C10.4288 1.36508 10.5964 1.33066 10.7611 1.35374C10.9257 1.37681 11.0774 1.45597 11.1905 1.57787L14.4732 4.86053C14.5422 4.9294 14.5953 5.01257 14.6287 5.10418C14.6621 5.19578 14.675 5.2936 14.6665 5.39073C14.6579 5.48787 14.6282 5.58195 14.5794 5.66634C14.5306 5.75074 14.4638 5.8234 14.3839 5.8792C14.2401 5.96649 14.0703 6.00094 13.9039 5.9766C13.7374 5.95227 13.5847 5.87068 13.4719 5.74587C13.3347 5.60444 13.1706 5.49193 12.9892 5.41498C12.8078 5.33804 12.6129 5.29821 12.4159 5.29787C12.0002 5.29976 11.6017 5.4633 11.3045 5.75387L10.2472 6.81187C10.0071 7.05212 9.83216 7.34956 9.73885 7.67615C9.64554 8.00274 9.63694 8.34771 9.71386 8.67854L9.85986 9.38387C9.99438 9.89815 10.0353 10.4324 9.98052 10.9612C9.96459 11.1768 9.88564 11.3831 9.75348 11.5542C9.62133 11.7254 9.44179 11.8539 9.23719 11.9239C8.89616 12.0135 8.5367 12.0048 8.20044 11.8986C7.86419 11.7924 7.56488 11.5931 7.33719 11.3239L4.40386 8.29054C4.22095 8.10812 4.09416 7.87709 4.03851 7.62483C3.98286 7.37257 4.00068 7.10965 4.08986 6.8672V6.8672Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_871_6528">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg> {message.pinned ? 'Unpin' : 'Pin'}
                                      </button>
                                      <button type="button" onClick={() => handleCopy(message)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_871_7807)">
    <path d="M10 13.3333H3.33333C2.4496 13.3323 1.60237 12.9807 0.97748 12.3559C0.352588 11.731 0.00105857 10.8837 0 10L0 3.33333C0.00105857 2.4496 0.352588 1.60237 0.97748 0.97748C1.60237 0.352588 2.4496 0.00105857 3.33333 0L10 0C10.8837 0.00105857 11.731 0.352588 12.3559 0.97748C12.9807 1.60237 13.3323 2.4496 13.3333 3.33333V10C13.3323 10.8837 12.9807 11.731 12.3559 12.3559C11.731 12.9807 10.8837 13.3323 10 13.3333V13.3333ZM3.33333 1.33333C2.8029 1.33333 2.29419 1.54405 1.91912 1.91912C1.54405 2.29419 1.33333 2.8029 1.33333 3.33333V10C1.33333 10.5304 1.54405 11.0391 1.91912 11.4142C2.29419 11.7893 2.8029 12 3.33333 12H10C10.5304 12 11.0391 11.7893 11.4142 11.4142C11.7893 11.0391 12 10.5304 12 10V3.33333C12 2.8029 11.7893 2.29419 11.4142 1.91912C11.0391 1.54405 10.5304 1.33333 10 1.33333H3.33333ZM16 12.6667V4C16 3.82319 15.9298 3.65362 15.8047 3.5286C15.6797 3.40357 15.5101 3.33333 15.3333 3.33333C15.1565 3.33333 14.987 3.40357 14.8619 3.5286C14.7369 3.65362 14.6667 3.82319 14.6667 4V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667H4C3.82319 14.6667 3.65362 14.7369 3.5286 14.8619C3.40357 14.987 3.33333 15.1565 3.33333 15.3333C3.33333 15.5101 3.40357 15.6797 3.5286 15.8047C3.65362 15.9298 3.82319 16 4 16H12.6667C13.5504 15.9989 14.3976 15.6474 15.0225 15.0225C15.6474 14.3976 15.9989 13.5504 16 12.6667V12.6667Z" fill="#033E4F"/>
  </g>
  <defs>
    <clipPath id="clip0_871_7807">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>Copy
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <div className="channels_message_bubble me">
                                {message.replyTo ? (
                                  <div className="messages_reply_quote outgoing">
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
                                          id: Number(`${message.id}`),
                                          author: message.author,
                                          time: message.time,
                                          text: message.text,
                                        })}
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                              {message.deliveryStatus ? (
                                <div className={`messages_read_status ${message.deliveryStatus.toLowerCase().replace(/[^a-z]+/g, '')}`}>
                                  <MessageStatusIcon deliveryStatus={message.deliveryStatus} />
                                  {message.deliveryStatus}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <MessagesComposer
                      attachedFile={attachedFile}
                      copiedToast={copiedToast}
                      draftMessage={draftMessage}
                      fileInputRef={fileInputRef}
                      handleAttachmentChange={handleAttachmentChange}
                      isDragActive={isDragActive}
                      isEmojiPickerOpen={isEmojiPickerOpen}
                      isUploadHintVisible={isUploadHintVisible}
                      onAddEmoji={addEmojiToDraft}
                      onDragActiveChange={setIsDragActive}
                      onDraftMessageChange={setDraftMessage}
                      onDropFile={storeAttachedFile}
                      onRemoveAttachment={() => setAttachedFile(null)}
                      onReplyClear={() => setReplyingTo(null)}
                      onSendMessage={sendMessage}
                      onUploadHintVisibleChange={setIsUploadHintVisible}
                      onEmojiPickerOpenChange={setIsEmojiPickerOpen}
                      replyingTo={replyingTo}
                      variant="channels"
                      wrapperClassName="channels_messages_composer_wrap"
                    />
                    
                  </>
                ) : (
                  <div className="channels_empty_chat">
                    <div className="channels_empty_chat_icon"><ChannelIcon /></div>
                    <h3>{selectedChannel.name}</h3>
                    <p>{selectedChannel.description}</p>
                    <MessagesComposer
                      attachedFile={attachedFile}
                      copiedToast={copiedToast}
                      draftMessage={draftMessage}
                      fileInputRef={fileInputRef}
                      handleAttachmentChange={handleAttachmentChange}
                      isDragActive={isDragActive}
                      isEmojiPickerOpen={isEmojiPickerOpen}
                      isUploadHintVisible={isUploadHintVisible}
                      onAddEmoji={addEmojiToDraft}
                      onDragActiveChange={setIsDragActive}
                      onDraftMessageChange={setDraftMessage}
                      onDropFile={storeAttachedFile}
                      onRemoveAttachment={() => setAttachedFile(null)}
                      onReplyClear={() => setReplyingTo(null)}
                      onSendMessage={sendMessage}
                      onUploadHintVisibleChange={setIsUploadHintVisible}
                      onEmojiPickerOpenChange={setIsEmojiPickerOpen}
                      replyingTo={replyingTo}
                      variant="channels"
                      wrapperClassName="channels_messages_composer_wrap channels_composer_empty"
                    />
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
                <button type="button" onClick={() => setShowDetails(false)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.25" stroke="#FF5B3A" stroke-width="1.5"></circle><path d="M6.5 6.5L11.5 11.5" stroke="#FF5B3A" stroke-width="1.5" stroke-linecap="round"></path><path d="M11.5 6.5L6.5 11.5" stroke="#FF5B3A" stroke-width="1.5" stroke-linecap="round"></path></svg></button>
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

              {/* <button type="button" className="messages_group_leave_btn v2">Leave Channel</button> */}
            </aside>
          ) : null}
        </div>
      )}
      {renderPreviewModal()}
    </section>
  );
}

