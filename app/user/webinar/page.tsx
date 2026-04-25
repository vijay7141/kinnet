"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type WebinarView = "list" | "create" | "waiting" | "live";
type WebinarType = "private" | "public";
type LivePanel = "chat" | "attendees";
type LiveRole = "attendee" | "host";
type SelectorMode = "attendees" | "hosts" | null;
type MobileLiveView = "stage" | "chat" | "attendees";

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

type ChatMessage = {
  id: number;
  author: string;
  time: string;
  message: string;
};

type LiveAttendee = {
  id: number;
  name: string;
  title: string;
  image: string;
  muted: boolean;
  cameraOff: boolean;
};

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: "referral" | "message" | "call";
  avatar?: string;
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

const initialChatMessages: ChatMessage[] = [
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

const initialLiveAttendees: LiveAttendee[] = [
  { id: 1, name: "Dr. Sarah Jenkins", title: "Host", image: "/avatar-2.png", muted: false, cameraOff: false },
  { id: 2, name: "Dr. Michael Chen", title: "Surgery", image: "/avatar-1.png", muted: false, cameraOff: false },
  { id: 3, name: "Elena Rodriguez", title: "Clinical Staff", image: "/avatar-2.png", muted: true, cameraOff: false },
  { id: 4, name: "Dr. James Wilson", title: "Observer", image: "/avatar-1.png", muted: false, cameraOff: false },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "New Referral",
    title: "Luna (Persian Cat) - Sarah Miller",
    description: "Claimed: Dr. Sarah Jenkins",
    time: "2m ago",
    unread: true,
    icon: "referral",
  },
  {
    id: 2,
    type: "New Message",
    title: "Dr. Sarah Jenkins",
    description: '"The lab results for @Bella are back. Please check the thyroid levels before..."',
    time: "15m ago",
    unread: true,
    icon: "message",
    avatar: "/icn/user_avatar.svg",
  },
  {
    id: 3,
    type: "Missed Call",
    title: "Owner: Marcus Wright (Luna)",
    description: "Patient: Luna I Follow-up on post-op medication response.",
    time: "1h ago",
    unread: false,
    icon: "call",
  },
];

function NotificationIcon({ icon, avatar }: { icon: NotificationItem["icon"]; avatar?: string }) {
  if (icon === "message" && avatar) {
    return (
      <span className="dash_notification_media dash_notification_media_avatar" aria-hidden="true">
        <Image src="/icn/Dr.Sarah.svg" alt="" width={40} height={40} />
      </span>
    );
  }

  if (icon === "call") {
    return (
      <span className="dash_notification_media" aria-hidden="true">
        <Image src="/icn/call_icn1.svg" alt="" width={20} height={20} />
      </span>
    );
  }

  return (
    <span className="dash_notification_media" aria-hidden="true">
      <Image src="/icn/referral_icn1.svg" alt="" width={20} height={20} />
    </span>
  );
}

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

function MutedMicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15C13.657 15 15 13.657 15 12V7C15 5.343 13.657 4 12 4C10.343 4 9 5.343 9 7V12C9 13.657 10.343 15 12 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6 11.5C6 14.814 8.686 17.5 12 17.5C15.314 17.5 18 14.814 18 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 5L19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 10.5L19.5 7.5V16.5L15 13.5V10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="4.5" y="7.5" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 5L20 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
  <path d="M9 12H11V7.85L12.6 9.425L14.025 8L10 4L6 8L7.425 9.4L9 7.825V12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM2 14H18V2H2V14ZM2 14V2V14Z" fill="white"/>
</svg>
  );
}
function StopShareIcon() {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
  <path d="M5.25 8.25H6.75V6.75C6.75 6.5375 6.82187 6.35938 6.96562 6.21562C7.10938 6.07187 7.2875 6 7.5 6H9V7.5L11.25 5.25L9 3V4.5H7.5C6.875 4.5 6.34375 4.71875 5.90625 5.15625C5.46875 5.59375 5.25 6.125 5.25 6.75V8.25ZM2.25 11.25C1.8375 11.25 1.48438 11.1031 1.19062 10.8094C0.896875 10.5156 0.75 10.1625 0.75 9.75V1.5C0.75 1.0875 0.896875 0.734375 1.19062 0.440625C1.48438 0.146875 1.8375 0 2.25 0H14.25C14.6625 0 15.0156 0.146875 15.3094 0.440625C15.6031 0.734375 15.75 1.0875 15.75 1.5V9.75C15.75 10.1625 15.6031 10.5156 15.3094 10.8094C15.0156 11.1031 14.6625 11.25 14.25 11.25H2.25ZM2.25 9.75H14.25V1.5H2.25V9.75ZM2.25 9.75V1.5V9.75ZM0 13.5V12H16.5V13.5H0Z" fill="#033E4F"/>
</svg>
  )
}
function RecordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  );
}

function StopRecordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17.5 3.33333H14.9166C14.7232 2.39284 14.2115 1.54779 13.4677 0.940598C12.7239 0.333408 11.7935 0.0012121 10.8333 0L9.16663 0C8.20645 0.0012121 7.27606 0.333408 6.53225 0.940598C5.78844 1.54779 5.27671 2.39284 5.08329 3.33333H2.49996C2.27895 3.33333 2.06698 3.42113 1.9107 3.57741C1.75442 3.73369 1.66663 3.94565 1.66663 4.16667C1.66663 4.38768 1.75442 4.59964 1.9107 4.75592C2.06698 4.9122 2.27895 5 2.49996 5H3.33329V15.8333C3.33462 16.938 3.77403 17.997 4.55514 18.7782C5.33626 19.5593 6.3953 19.9987 7.49996 20H12.5C13.6046 19.9987 14.6637 19.5593 15.4448 18.7782C16.2259 17.997 16.6653 16.938 16.6666 15.8333V5H17.5C17.721 5 17.9329 4.9122 18.0892 4.75592C18.2455 4.59964 18.3333 4.38768 18.3333 4.16667C18.3333 3.94565 18.2455 3.73369 18.0892 3.57741C17.9329 3.42113 17.721 3.33333 17.5 3.33333V3.33333ZM9.16663 1.66667H10.8333C11.3502 1.6673 11.8542 1.82781 12.2763 2.1262C12.6984 2.42459 13.0178 2.84624 13.1908 3.33333H6.80913C6.98211 2.84624 7.30154 2.42459 7.72361 2.1262C8.14569 1.82781 8.64973 1.6673 9.16663 1.66667V1.66667ZM15 15.8333C15 16.4964 14.7366 17.1323 14.2677 17.6011C13.7989 18.0699 13.163 18.3333 12.5 18.3333H7.49996C6.83692 18.3333 6.20103 18.0699 5.73219 17.6011C5.26335 17.1323 4.99996 16.4964 4.99996 15.8333V5H15V15.8333Z" fill="#033E4F"/>
      <path d="M8.33333 14.9987C8.55435 14.9987 8.76631 14.9109 8.92259 14.7546C9.07887 14.5983 9.16666 14.3864 9.16666 14.1654V9.16536C9.16666 8.94435 9.07887 8.73239 8.92259 8.57611C8.76631 8.41983 8.55435 8.33203 8.33333 8.33203C8.11232 8.33203 7.90036 8.41983 7.74408 8.57611C7.5878 8.73239 7.5 8.94435 7.5 9.16536V14.1654C7.5 14.3864 7.5878 14.5983 7.74408 14.7546C7.90036 14.9109 8.11232 14.9987 8.33333 14.9987Z" fill="#033E4F"/>
      <path d="M11.6665 14.9987C11.8875 14.9987 12.0995 14.9109 12.2558 14.7546C12.4121 14.5983 12.4999 14.3864 12.4999 14.1654V9.16536C12.4999 8.94435 12.4121 8.73239 12.2558 8.57611C12.0995 8.41983 11.8875 8.33203 11.6665 8.33203C11.4455 8.33203 11.2336 8.41983 11.0773 8.57611C10.921 8.73239 10.8332 8.94435 10.8332 9.16536V14.1654C10.8332 14.3864 10.921 14.5983 11.0773 14.7546C11.2336 14.9109 11.4455 14.9987 11.6665 14.9987Z" fill="#033E4F"/>  
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_818_6709)">
        <path d="M15.5468 0.774735L5.38683 10.9347C4.99878 11.3207 4.69114 11.7798 4.48173 12.2854C4.27231 12.7911 4.16528 13.3333 4.16683 13.8806V14.9997C4.16683 15.2207 4.25462 15.4327 4.4109 15.589C4.56718 15.7453 4.77915 15.8331 5.00016 15.8331H6.11933C6.66663 15.8346 7.2088 15.7276 7.71446 15.5182C8.22011 15.3088 8.67921 15.0011 9.06516 14.6131L19.2252 4.45307C19.7122 3.96488 19.9856 3.30346 19.9856 2.6139C19.9856 1.92434 19.7122 1.26293 19.2252 0.774735C18.7299 0.301313 18.0711 0.0371094 17.386 0.0371094C16.7009 0.0371094 16.0421 0.301313 15.5468 0.774735V0.774735ZM18.0468 3.27473L7.88683 13.4347C7.41693 13.9018 6.78183 14.1647 6.11933 14.1664H5.83349V13.8806C5.83523 13.2181 6.09813 12.583 6.56516 12.1131L16.7252 1.95307C16.9031 1.78303 17.1398 1.68815 17.386 1.68815C17.6322 1.68815 17.8688 1.78303 18.0468 1.95307C18.2218 2.1285 18.32 2.36614 18.32 2.6139C18.32 2.86166 18.2218 3.09931 18.0468 3.27473V3.27473Z" fill="#033E4F"/>
        <path d="M19.1667 7.4825C18.9457 7.4825 18.7337 7.5703 18.5774 7.72658C18.4211 7.88286 18.3333 8.09482 18.3333 8.31583V12.5H15C14.337 12.5 13.7011 12.7634 13.2322 13.2322C12.7634 13.7011 12.5 14.337 12.5 15V18.3333H4.16667C3.50363 18.3333 2.86774 18.0699 2.3989 17.6011C1.93006 17.1323 1.66667 16.4964 1.66667 15.8333V4.16667C1.66667 3.50363 1.93006 2.86774 2.3989 2.3989C2.86774 1.93006 3.50363 1.66667 4.16667 1.66667H11.7017C11.9227 1.66667 12.1346 1.57887 12.2909 1.42259C12.4472 1.26631 12.535 1.05435 12.535 0.833333C12.535 0.61232 12.4472 0.400358 12.2909 0.244078C12.1346 0.0877974 11.9227 0 11.7017 0L4.16667 0C3.062 0.00132321 2.00297 0.440735 1.22185 1.22185C0.440735 2.00296 0.00132321 3.062 0 4.16667L0 15.8333C0.00132321 16.938 0.440735 17.997 1.22185 18.7782C2.00297 19.5593 3.062 19.9987 4.16667 20H13.6192C14.1666 20.0016 14.7089 19.8945 15.2147 19.6851C15.7205 19.4757 16.1797 19.1681 16.5658 18.78L18.7792 16.565C19.1673 16.1791 19.475 15.72 19.6846 15.2143C19.8941 14.7087 20.0013 14.1665 20 13.6192V8.31583C20 8.09482 19.9122 7.88286 19.7559 7.72658C19.5996 7.5703 19.3877 7.4825 19.1667 7.4825ZM15.3875 17.6017C15.0525 17.9358 14.6289 18.1672 14.1667 18.2683V15C14.1667 14.779 14.2545 14.567 14.4107 14.4107C14.567 14.2545 14.779 14.1667 15 14.1667H18.2708C18.1677 14.6279 17.9367 15.0508 17.6042 15.3867L15.3875 17.6017Z" fill="#033E4F"/>
      </g>
      <defs>
        <clipPath id="clip0_818_6709">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function WebinarEmptyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path d="M30 6.90586C30.4854 6.90586 30.8789 6.51234 30.8789 6.02695C30.8789 5.54156 30.4854 5.14805 30 5.14805C29.5146 5.14805 29.1211 5.54156 29.1211 6.02695C29.1211 6.51234 29.5146 6.90586 30 6.90586ZM55.6055 5.02266H35.9419C35.462 2.17594 32.981 0 30 0C27.019 0 24.538 2.17594 24.0581 5.02266H4.39453C1.97133 5.02266 0 6.99398 0 9.41719V42.382C0 44.8052 1.97133 46.7766 4.39453 46.7766H21.2801L21.3687 46.9869C22.7006 50.1566 21.9122 53.8691 19.4065 56.225L18.084 57.469C17.6445 57.8832 17.5043 58.5139 17.7273 59.0756C17.9502 59.6372 18.4846 60 19.0888 60H40.9114C41.5155 60 42.05 59.6372 42.2729 59.0756C42.4959 58.5139 42.3559 57.8832 41.9156 57.4684L40.5936 56.225C38.0882 53.8691 37.2996 50.1567 38.6313 46.9876L38.7202 46.7767H44.1377C44.6231 46.7767 45.0166 46.3832 45.0166 45.8978C45.0166 45.4124 44.6231 45.0189 44.1377 45.0189H4.39453C2.94059 45.0189 1.75781 43.8361 1.75781 42.3821V37.8299H58.2422V42.3821C58.2422 43.8361 57.0594 45.0189 55.6055 45.0189H48.2391C47.7537 45.0189 47.3602 45.4124 47.3602 45.8978C47.3602 46.3832 47.7537 46.7767 48.2391 46.7767H55.6055C58.0287 46.7767 60 44.8054 60 42.3821V9.41719C60 6.99398 58.0287 5.02266 55.6055 5.02266ZM36.8288 46.7766C35.4785 50.5111 36.475 54.7652 39.3892 57.5054L40.1725 58.2422H19.8275L20.6107 57.5055C23.5249 54.7654 24.5214 50.5116 23.1712 46.7766H36.8288ZM30 1.75781C32.3541 1.75781 34.2694 3.67301 34.2694 6.02719C34.2694 8.37949 32.357 10.2935 30.0053 10.2963C30.0035 10.2963 30.0018 10.2961 30 10.2961C29.9982 10.2961 29.9965 10.2963 29.9947 10.2963C27.643 10.2934 25.7306 8.37949 25.7306 6.02719C25.7306 3.67301 27.6459 1.75781 30 1.75781ZM1.75781 9.41719C1.75781 7.96324 2.94059 6.78047 4.39453 6.78047H24.0216C24.3574 9.46043 26.4582 11.5988 29.1211 11.9896V20.5471H21.6266C21.2114 18.6809 19.9938 17.0696 18.3348 16.1491C18.8361 15.4804 19.1336 14.6503 19.1336 13.752V12.6973C19.1336 10.4892 17.3372 8.69285 15.1291 8.69285C12.9211 8.69285 11.1246 10.4892 11.1246 12.6974V13.7521C11.1246 14.6503 11.4219 15.4804 11.9232 16.149C11.4614 16.4036 11.0284 16.7114 10.6393 17.0672C9.6191 18.0001 8.92359 19.2149 8.63109 20.5471H1.75781V9.41719ZM13.4409 17.382C13.9543 17.6216 14.5261 17.7564 15.129 17.7564C15.7325 17.7564 16.3049 17.6214 16.8186 17.3813C18.2538 17.9108 19.3617 19.1019 19.8086 20.5471H10.4463C10.7 19.716 11.1722 18.9618 11.8255 18.3645C12.2938 17.9363 12.8473 17.6013 13.4409 17.382ZM12.8824 13.752V12.6973C12.8824 11.4585 13.8902 10.4507 15.129 10.4507C16.3678 10.4507 17.3756 11.4585 17.3756 12.6973V13.752C17.3756 14.9907 16.3678 15.9986 15.129 15.9986C13.8902 15.9986 12.8824 14.9907 12.8824 13.752ZM10.4463 36.072C10.7 35.2413 11.1722 34.4875 11.8256 33.8899C12.295 33.4605 12.8486 33.1255 13.4412 32.9073C13.9545 33.147 14.5262 33.2816 15.129 33.2816C15.7322 33.2816 16.3043 33.1467 16.8178 32.9068C18.2536 33.4364 19.3618 34.6271 19.8087 36.0718H10.4463V36.072ZM12.8824 29.2772V28.2225C12.8824 26.9837 13.8902 25.9759 15.129 25.9759C16.3678 25.9759 17.3756 26.9837 17.3756 28.2225V29.2772C17.3756 30.516 16.3678 31.5238 15.129 31.5238C13.8902 31.5238 12.8824 30.516 12.8824 29.2772ZM40.1885 36.072C40.4422 35.2414 40.9144 34.4875 41.5678 33.8899C42.0373 33.4605 42.5907 33.1256 43.1832 32.9073C43.6965 33.1468 44.2682 33.2816 44.871 33.2816C45.4743 33.2816 46.0464 33.1467 46.5599 32.9068C47.9957 33.4363 49.104 34.6271 49.5509 36.072H40.1885ZM42.6243 29.2772V28.2225C42.6243 26.9837 43.6321 25.9759 44.8709 25.9759C46.1096 25.9759 47.1175 26.9837 47.1175 28.2225V29.2772C47.1175 30.516 46.1096 31.5238 44.8709 31.5238C43.6321 31.5238 42.6243 30.516 42.6243 29.2772ZM58.2422 36.072H51.3689C50.9537 34.2061 49.736 32.5951 48.0764 31.6746C48.578 31.0058 48.8754 30.1755 48.8754 29.2772V28.2225C48.8754 26.0145 47.079 24.2181 44.871 24.2181C42.6629 24.2181 40.8666 26.0145 40.8666 28.2225V29.2772C40.8666 30.1754 41.1639 31.0055 41.6652 31.6743C41.2039 31.9286 40.7711 32.2365 40.3816 32.5928C39.3613 33.5258 38.6658 34.7402 38.3733 36.072H30.8789V31.9364C30.8789 31.451 30.4854 31.0575 30 31.0575C29.5146 31.0575 29.1211 31.451 29.1211 31.9364V36.072H21.6267C21.2116 34.2062 19.9939 32.5954 18.3345 31.6748C18.836 31.0059 19.1336 30.1758 19.1336 29.2772V28.2225C19.1336 26.0145 17.3372 24.2181 15.1291 24.2181C12.9211 24.2181 11.1246 26.0145 11.1246 28.2226V29.2773C11.1246 30.1754 11.4219 31.0055 11.9231 31.6743C11.4618 31.9287 11.0288 32.2366 10.6393 32.5929C9.61898 33.5258 8.92336 34.7404 8.63098 36.0721H1.75781V22.3049H29.1211V27.8348C29.1211 28.3202 29.5146 28.7138 30 28.7138C30.4854 28.7138 30.8789 28.3202 30.8789 27.8348V22.3049H58.2422V36.072ZM43.1829 17.3821C43.6962 17.6217 44.2679 17.7565 44.8709 17.7565C45.4745 17.7565 46.0468 17.6215 46.5606 17.3813C47.9959 17.9108 49.1039 19.1019 49.5507 20.5471H40.1884C40.4421 19.716 40.9143 18.9618 41.5676 18.3645C42.0359 17.9363 42.5893 17.6013 43.1829 17.3821ZM42.6243 13.752V12.6973C42.6243 11.4585 43.6321 10.4507 44.8709 10.4507C46.1096 10.4507 47.1175 11.4585 47.1175 12.6973V13.752C47.1175 14.9907 46.1096 15.9986 44.8709 15.9986C43.6321 15.9986 42.6243 14.9907 42.6243 13.752ZM58.2422 20.5471H51.3688C50.9536 18.6809 49.7359 17.0695 48.0768 16.1489C48.5781 15.4801 48.8754 14.6501 48.8754 13.752V12.6973C48.8754 10.4892 47.079 8.69285 44.871 8.69285C42.6629 8.69285 40.8666 10.4892 40.8666 12.6973V13.752C40.8666 14.6502 41.1639 15.4804 41.6653 16.1491C41.2035 16.4037 40.7706 16.7115 40.3816 17.0672C39.3614 18.0001 38.6659 19.2149 38.3734 20.5471H30.8789V11.9896C33.5416 11.5988 35.6425 9.46043 35.9784 6.78047H55.6055C57.0594 6.78047 58.2422 7.96324 58.2422 9.41719V20.5471Z" fill="black"/>
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
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
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
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [liveAttendees, setLiveAttendees] = useState<LiveAttendee[]>(initialLiveAttendees);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [mobileLiveView, setMobileLiveView] = useState<MobileLiveView>("stage");

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
  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

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

    const formattedDate = selectedDate
      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "Oct 22, 2026";

    const formattedTime = selectedTime
      ? new Date(`1970-01-01T${selectedTime}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : "5:30 PM";

    const nextWebinar: WebinarCard = {
      id: Date.now(),
      title,
      dateLabel: `${formattedDate}, ${formattedTime}`,
      host: selectedHosts[0]?.name ?? "Dr. Elena Rodriguez",
    };

    setWebinars((current) => [nextWebinar, ...current]);
    setShowSuccessModal(true);
  };

  const openLive = (role: LiveRole) => {
    setLiveRole(role);
    setView("live");
    setMobileLiveView("stage");
    setLivePanel("chat");
    setSelectorMode(null);
    setIsMicMuted(false);
    setIsVideoMuted(false);
    setChatMessages(initialChatMessages);
    setChatInput("");
    setLiveAttendees(initialLiveAttendees);
  };

  const toggleAttendeeAudio = (id: number) => {
    setLiveAttendees((current) =>
      current.map((person) => (person.id === id ? { ...person, muted: !person.muted } : person))
    );
  };

  const toggleAttendeeVideo = (id: number) => {
    setLiveAttendees((current) =>
      current.map((person) => (person.id === id ? { ...person, cameraOff: !person.cameraOff } : person))
    );
  };

  const handleSendMessage = () => {
    const message = chatInput.trim();

    if (!message) {
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setChatMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "Dr. Elena Rodriguez",
        time,
        message,
      },
    ]);
    setChatInput("");
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const pageTitle = view === "create" ? "Create Webinar" : "Webinars";
  const mobilePanelTitle = mobileLiveView === "attendees" ? "Attendees" : "Live Chat";

  const webinarChatContent = (
    <div className="webinar_chat_panel">
      {chatMessages.map((message, index) => (
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
  );

  const webinarAttendeeContent = (
    <div className="webinar_attendee_panel">
      {liveAttendees.map((person) => (
        <div key={person.id} className="webinar_attendee_row">
          <div className="webinar_attendee_identity">
            <Image src={person.image} alt={person.name} width={58} height={58} />
            <div>
              <h5>{person.name}</h5>
              <p>{person.title}</p>
            </div>
          </div>
          <div className="webinar_attendee_actions">
            <button
              type="button"
              className={`webinar_attendee_action_btn ${person.muted ? "muted" : ""}`}
              onClick={() => toggleAttendeeAudio(person.id)}
              aria-label={person.muted ? `Unmute ${person.name}` : `Mute ${person.name}`}
            >
              {person.muted ? <MutedMicIcon /> : <MicrophoneIcon />}
            </button>
            <button
              type="button"
              className={`webinar_attendee_action_btn ${person.cameraOff ? "muted" : ""}`}
              onClick={() => toggleAttendeeVideo(person.id)}
              aria-label={person.cameraOff ? `Turn on ${person.name} video` : `Turn off ${person.name} video`}
            >
              {person.cameraOff ? <CameraOffIcon /> : <CameraIcon />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
                  <img src="/icn/plus_icn.svg" alt="" />
                  Create Webinar
                </button>
              </div>
            ) : null}
          </div>

          {view === "list" ? (
            webinars.length ? (
              <div className="row webinar_cards">
                {webinars.map((item) => (
                  <div key={item.id} className="col-md-6 col-xl-4">
                    <article className="webinar_card">
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
                  </div>
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
                    placeholder="Webinar Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div className="webinar_field webinar_field_half">
                  <label>Date</label>
                  <div
                    className="webinar_input_icon webinar_picker_field"
                    onClick={() => dateInputRef.current?.showPicker?.()}
                  >
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={selectedDate}
                      onChange={(event) => setSelectedDate(event.target.value)}
                    />
                    <CalendarIcon />
                  </div>
                </div>

                <div className="webinar_field webinar_field_half">
                  <label>Time</label>
                  <div
                    className="webinar_input_icon webinar_picker_field"
                    onClick={() => timeInputRef.current?.showPicker?.()}
                  >
                    <input
                      ref={timeInputRef}
                      type="time"
                      value={selectedTime}
                      onChange={(event) => setSelectedTime(event.target.value)}
                    />
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
                  Create Webinar
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
          <div className="webinar_live_topbar jusify-content-between">
            <div className="webinar_live_inforgt">
            <button type="button" className="webinar_back_btn" onClick={() => setView("list")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <g clipPath="url(#clip0_818_269)">
                <path d="M1.17372 18.7865L6.33372 23.9999C6.45767 24.1248 6.60514 24.224 6.76762 24.2917C6.9301 24.3594 7.10437 24.3943 7.28039 24.3943C7.4564 24.3943 7.63068 24.3594 7.79316 24.2917C7.95563 24.224 8.1031 24.1248 8.22705 23.9999C8.35202 23.8759 8.45122 23.7284 8.51891 23.566C8.5866 23.4035 8.62145 23.2292 8.62145 23.0532C8.62145 22.8772 8.5866 22.7029 8.51891 22.5404C8.45122 22.378 8.35202 22.2305 8.22705 22.1065L3.48039 17.3332H30.6671C31.0207 17.3332 31.3598 17.1927 31.6099 16.9427C31.8599 16.6926 32.0004 16.3535 32.0004 15.9999C32.0004 15.6462 31.8599 15.3071 31.6099 15.0571C31.3598 14.807 31.0207 14.6665 30.6671 14.6665H3.40039L8.22705 9.83987C8.46344 9.5919 8.59531 9.26245 8.59531 8.91987C8.59531 8.57728 8.46344 8.24784 8.22705 7.99987C8.1031 7.8749 7.95563 7.7757 7.79316 7.70801C7.63068 7.64032 7.4564 7.60547 7.28039 7.60547C7.10437 7.60547 6.9301 7.64032 6.76762 7.70801C6.60514 7.7757 6.45767 7.8749 6.33372 7.99987L1.17372 13.1332C0.424651 13.8832 0.00390625 14.8999 0.00390625 15.9599C0.00390625 17.0199 0.424651 18.0365 1.17372 18.7865V18.7865Z" fill="#374957"/>
              </g>
              <defs>
                <clipPath id="clip0_818_269">
                  <rect width="32" height="32" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            </button>
            <h2>Kinnet Clinical</h2>
            <span className="webinar_live_badge">Live</span>
            <span className="webinar_live_viewers">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path d="M0 10V8.6875C0 8.09028 0.305556 7.60417 0.916667 7.22917C1.52778 6.85417 2.33333 6.66667 3.33333 6.66667C3.51389 6.66667 3.6875 6.67014 3.85417 6.67708C4.02083 6.68403 4.18056 6.70139 4.33333 6.72917C4.13889 7.02083 3.99306 7.32639 3.89583 7.64583C3.79861 7.96528 3.75 8.29861 3.75 8.64583V10H0ZM5 10V8.64583C5 8.20139 5.12153 7.79514 5.36458 7.42708C5.60764 7.05903 5.95139 6.73611 6.39583 6.45833C6.84028 6.18056 7.37153 5.97222 7.98958 5.83333C8.60764 5.69444 9.27778 5.625 10 5.625C10.7361 5.625 11.4132 5.69444 12.0312 5.83333C12.6493 5.97222 13.1806 6.18056 13.625 6.45833C14.0694 6.73611 14.4097 7.05903 14.6458 7.42708C14.8819 7.79514 15 8.20139 15 8.64583V10H5ZM16.25 10V8.64583C16.25 8.28472 16.2049 7.94444 16.1146 7.625C16.0243 7.30556 15.8889 7.00694 15.7083 6.72917C15.8611 6.70139 16.0174 6.68403 16.1771 6.67708C16.3368 6.67014 16.5 6.66667 16.6667 6.66667C17.6667 6.66667 18.4722 6.85069 19.0833 7.21875C19.6944 7.58681 20 8.07639 20 8.6875V10H16.25ZM6.77083 8.33333H13.25C13.1111 8.05556 12.7257 7.8125 12.0938 7.60417C11.4618 7.39583 10.7639 7.29167 10 7.29167C9.23611 7.29167 8.53819 7.39583 7.90625 7.60417C7.27431 7.8125 6.89583 8.05556 6.77083 8.33333ZM3.33333 5.83333C2.875 5.83333 2.48264 5.67014 2.15625 5.34375C1.82986 5.01736 1.66667 4.625 1.66667 4.16667C1.66667 3.69444 1.82986 3.29861 2.15625 2.97917C2.48264 2.65972 2.875 2.5 3.33333 2.5C3.80556 2.5 4.20139 2.65972 4.52083 2.97917C4.84028 3.29861 5 3.69444 5 4.16667C5 4.625 4.84028 5.01736 4.52083 5.34375C4.20139 5.67014 3.80556 5.83333 3.33333 5.83333ZM16.6667 5.83333C16.2083 5.83333 15.816 5.67014 15.4896 5.34375C15.1632 5.01736 15 4.625 15 4.16667C15 3.69444 15.1632 3.29861 15.4896 2.97917C15.816 2.65972 16.2083 2.5 16.6667 2.5C17.1389 2.5 17.5347 2.65972 17.8542 2.97917C18.1736 3.29861 18.3333 3.69444 18.3333 4.16667C18.3333 4.625 18.1736 5.01736 17.8542 5.34375C17.5347 5.67014 17.1389 5.83333 16.6667 5.83333ZM10 5C9.30556 5 8.71528 4.75694 8.22917 4.27083C7.74306 3.78472 7.5 3.19444 7.5 2.5C7.5 1.79167 7.74306 1.19792 8.22917 0.71875C8.71528 0.239583 9.30556 0 10 0C10.7083 0 11.3021 0.239583 11.7812 0.71875C12.2604 1.19792 12.5 1.79167 12.5 2.5C12.5 3.19444 12.2604 3.78472 11.7812 4.27083C11.3021 4.75694 10.7083 5 10 5ZM10 3.33333C10.2361 3.33333 10.434 3.25347 10.5938 3.09375C10.7535 2.93403 10.8333 2.73611 10.8333 2.5C10.8333 2.26389 10.7535 2.06597 10.5938 1.90625C10.434 1.74653 10.2361 1.66667 10 1.66667C9.76389 1.66667 9.56597 1.74653 9.40625 1.90625C9.24653 2.06597 9.16667 2.26389 9.16667 2.5C9.16667 2.73611 9.24653 2.93403 9.40625 3.09375C9.56597 3.25347 9.76389 3.33333 10 3.33333Z" fill="#033E4F"/>
              </svg> &nbsp;
              128 Viewers</span>
              </div>
            <div className="dash_header_right_area">
              <div className="dash_notification_wrap" ref={notificationRef}>
                <button
                  type="button"
                  className={`dash_notify_icon ${isNotificationsOpen ? "active" : ""}`}
                  onClick={() => setIsNotificationsOpen((current) => !current)}
                  aria-label="Open notifications"
                  aria-expanded={isNotificationsOpen}
                >
                  <Image src="/icn/fi-rr-bell.svg" alt="" width={25} height={25} />
                  {unreadCount ? <span className="dash_notify_badge">{unreadCount}</span> : null}
                </button>

                {isNotificationsOpen ? (
                  <div className="dash_notification_panel">
                    <div className="dash_notification_panel_head">
                      <h3>Notifications</h3>
                      <button type="button" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    </div>

                    <div className="dash_notification_list">
                      {notifications.map((notification) => (
                        <article
                          key={notification.id}
                          className={`dash_notification_item ${notification.unread ? "unread" : ""}`}
                        >
                          <NotificationIcon icon={notification.icon} avatar={notification.avatar} />

                          <div className="dash_notification_content">
                            <div className="dash_notification_meta">
                              <span className="dash_notification_type">{notification.type}</span>
                              <span className="dash_notification_time">{notification.time}</span>
                            </div>
                            <h4>{notification.title}</h4>
                            <p>{notification.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="dash_vertical_line"></div>

              <Link href="/user/profile" className="dash_user_info">
                <h4 className="dash_user_name">Dr. Elena Rodriguez</h4>
                <p className="dash_user_role">Lead Surgeon</p>
              </Link>

              <Link href="/user/profile" className="dash_user_avatar">
                <Image src="/icn/user_avatar.svg" alt="user" width={45} height={45} />
              </Link>
            </div>
          </div>

          <div className="webinar_live_shell">
            <div className="webinar_live_stage">
              <div className="webinar_live_host_tag">
                Host: Dr. Mark Chen{liveRole === "host" ? " (Presenting)" : ""}
              </div>
              <div className="webinar_live_main_feed">
                <div className="webinar_live_speaker"></div>
                <div
                  className={`webinar_live_self_tile ${liveRole === "host" ? "host_mode" : ""} ${
                    isVideoMuted ? "video_off" : ""
                  }`}
                >
                  <Image src="/sarah-cll.png" alt="Dr. Sarah Jenkins" width={192} height={192} />
                  {isVideoMuted ? <div className="webinar_live_self_tile_overlay">Camera Off</div> : null}
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
                <button
                  type="button"
                  className={`webinar_control_btn ${isMicMuted ? "muted" : ""}`}
                  onClick={() => setIsMicMuted((current) => !current)}
                  aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
                >
                  {isMicMuted ? <MutedMicIcon /> : <MicrophoneIcon />}
                </button>
                <button
                  type="button"
                  className={`webinar_control_btn ${isVideoMuted ? "muted" : ""}`}
                  onClick={() => setIsVideoMuted((current) => !current)}
                  aria-label={isVideoMuted ? "Turn on camera" : "Turn off camera"}
                >
                  {isVideoMuted ? <CameraOffIcon /> : <CameraIcon />}
                </button>
                {liveRole === "host" ? (
                  <div className="webinar_share_wrap">
                    {!isScreenSharing ? <div className="webinar_share_tooltip">Share Screen</div> : null}
                  <button 
  type="button"
  className={`webinar_control_btn webinar_share_btn ${isScreenSharing ? "active" : ""}`}
  onClick={() => setIsScreenSharing((current) => !current)}
  aria-label={isScreenSharing ? "Stop sharing screen" : "Share screen"}
>
  {/* First Icon */}
  {!isScreenSharing && <ShareIcon />}

  {/* Second State (Icon + Text) */}
  {isScreenSharing && (
    <span className="webinar_share_btn_label" data-mobile-label="Stop">
      <StopShareIcon /> Stop Sharing
    </span>
  )}
</button>
                  </div>
                ) : null}
                <button
                  type="button"
                  className={`webinar_control_btn ${isRecording ? "recording" : ""}`}
                  onClick={() => setIsRecording((current) => !current)}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <StopRecordIcon /> : <RecordIcon />}
                </button>
                <button
                  type="button"
                  className="webinar_leave_btn"
                  onClick={() => setView("list")}
                >
                  <span className="webinar_leave_btn_text">{liveRole === "host" ? "End Webinar" : "Leave Webinar"}</span>
                  <span className="webinar_leave_btn_mobile">{liveRole === "host" ? "End" : "Leave Webinar"}</span>
                </button>
                {liveRole === "host" && isRecording ? (
                  <div className="webinar_recording_badge">
                    <span>Recording</span>
                    <strong>01:42:08</strong>
                  </div>
                ) : null}
              </div>

              <div className="webinar_live_mobile_tabs">
                <button
                  type="button"
                  className={livePanel === "chat" ? "active" : ""}
                  onClick={() => {
                    setLivePanel("chat");
                    setMobileLiveView("chat");
                  }}
                >
                  Live Chat
                </button>
                <button
                  type="button"
                  className={livePanel === "attendees" ? "active" : ""}
                  onClick={() => {
                    setLivePanel("attendees");
                    setMobileLiveView("attendees");
                  }}
                >
                  Attendees
                </button>
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
                webinarChatContent
              ) : (
                webinarAttendeeContent
              )}

              {livePanel === "chat" ? (
                <div className="webinar_chat_input">
                  <input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button type="button" onClick={handleSendMessage} aria-label="Send message">
                    <Image src="/icn/send-red.svg" alt="send" width={40} height={37} />
                  </button>
                </div>
              ) : null}
            </aside>
          </div>

          {mobileLiveView !== "stage" ? (
            <div className="webinar_mobile_overlay">
              <div className="webinar_mobile_overlay_head">
                <button type="button" className="webinar_mobile_overlay_back" onClick={() => setMobileLiveView("stage")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10.35 18.75L3.59998 12L10.35 5.25M4.53748 12H20.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <h3>{mobilePanelTitle}</h3>
              </div>

              <div className="webinar_mobile_overlay_tabs">
                <button
                  type="button"
                  className={mobileLiveView === "chat" ? "active" : ""}
                  onClick={() => {
                    setLivePanel("chat");
                    setMobileLiveView("chat");
                  }}
                >
                  Live Chat
                </button>
                <button
                  type="button"
                  className={mobileLiveView === "attendees" ? "active" : ""}
                  onClick={() => {
                    setLivePanel("attendees");
                    setMobileLiveView("attendees");
                  }}
                >
                  Attendees
                </button>
              </div>

              <div className="webinar_mobile_overlay_body">
                {mobileLiveView === "chat" ? webinarChatContent : webinarAttendeeContent}
              </div>

              {mobileLiveView === "chat" ? (
                <div className="webinar_chat_input webinar_mobile_overlay_input">
                  <input
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button type="button" onClick={handleSendMessage} aria-label="Send message">
                    <Image src="/icn/send-red.svg" alt="send" width={40} height={37} />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {showSuccessModal ? (
        <div className="webinar_modal_backdrop">
          <div className="webinar_success_modal">
            <div className="webinar_success_icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2.6" />
                <path
                  d="M24 12.5L27.34 15.18L31.57 14.84L33.04 18.81L36.82 20.72L35.84 24.85L37.38 28.8L34.09 31.54L33.28 35.71L29.05 36.02L26.42 39.36L22.43 37.96L18.75 40.07L16.36 36.56L12.21 35.78L12.23 31.54L9.5 28.29L11.91 24.81L11 20.66L14.69 18.57L16.15 14.6L20.38 14.96L24 12.5Z"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.2 24.25L22.04 28.09L29.82 20.31"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Webinar Created Successfully</h3>
            <p>
              {webinarType === "public"
                ? "Your public webinar has been created successfully and is now visible to all users in the Webinars tab."
                : "Your private webinar has been created successfully and is now ready for the selected attendees and hosts."}
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
