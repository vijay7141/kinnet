"use client";

import { forwardRef, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type RecordingCategory = "webinars" | "video" | "audio";

type RecordingItem = {
  id: number;
  category: RecordingCategory;
  title: string;
  recordedAt: string;
  duration: string;
  speaker?: string;
  attendees?: string;
};

const recordings: RecordingItem[] = [
  {
    id: 1,
    category: "webinars",
    title: "Buddy Smith TPLO Consultation",
    recordedAt: "2023-10-12",
    duration: "42:15",
    speaker: "Dr. Sarah Jenkins",
    attendees: "4 Attendees",
  },
  {
    id: 2,
    category: "webinars",
    title: "New Anesthesia Protocols Q4",
    recordedAt: "2023-10-08",
    duration: "1:24:00",
    speaker: "Dr. Michael Chen",
    attendees: "12 Attendees",
  },
  {
    id: 3,
    category: "webinars",
    title: "Equine Radiology Masterclass",
    recordedAt: "2023-09-29",
    duration: "58:30",
    speaker: "Dr. Elena Rodriguez",
    attendees: "3 Attendees",
  },
  {
    id: 4,
    category: "video",
    title: "Surgery Cases",
    recordedAt: "2023-10-12",
    duration: "25:30",
  },
  {
    id: 5,
    category: "video",
    title: "Sarah Jenkins",
    recordedAt: "2023-10-08",
    duration: "1:24:00",
  },
  {
    id: 6,
    category: "video",
    title: "Marcus Thorne",
    recordedAt: "2023-09-29",
    duration: "14:00",
  },
  {
    id: 7,
    category: "audio",
    title: "Surgery Cases",
    recordedAt: "2023-10-12",
    duration: "25:30",
  },
  {
    id: 8,
    category: "audio",
    title: "Sarah Jenkins",
    recordedAt: "2023-10-08",
    duration: "18:00",
  },
  {
    id: 9,
    category: "audio",
    title: "Marcus Thorne",
    recordedAt: "2023-09-29",
    duration: "14:00",
  },
];

const tabs: { key: RecordingCategory; label: string }[] = [
  { key: "webinars", label: "Webinars" },
  { key: "video", label: "Video Calls" },
  { key: "audio", label: "Audio Calls" },
];

const categoryTitles: Record<RecordingCategory, string> = {
  webinars: "Webinars",
  video: "Video Calls",
  audio: "Audio Calls",
};

function formatDateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(left: string, right: Date) {
  const current = new Date(`${left}T00:00:00`);

  return (
    current.getFullYear() === right.getFullYear() &&
    current.getMonth() === right.getMonth() &&
    current.getDate() === right.getDate()
  );
}

const DateFilterInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void }
>(function DateFilterInput({ value, onClick }, ref) {
  return (
    <button type="button" className="recordings_filter_btn" onClick={onClick} ref={ref}>
      <span>{value || "Filter By Date"}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_818_3639)">
        <path d="M15.8333 1.66667H15V0.833333C15 0.61232 14.9122 0.400358 14.7559 0.244078C14.5996 0.0877974 14.3877 0 14.1667 0C13.9457 0 13.7337 0.0877974 13.5774 0.244078C13.4211 0.400358 13.3333 0.61232 13.3333 0.833333V1.66667H6.66667V0.833333C6.66667 0.61232 6.57887 0.400358 6.42259 0.244078C6.26631 0.0877974 6.05435 0 5.83333 0C5.61232 0 5.40036 0.0877974 5.24408 0.244078C5.0878 0.400358 5 0.61232 5 0.833333V1.66667H4.16667C3.062 1.66799 2.00296 2.1074 1.22185 2.88852C0.440735 3.66963 0.00132321 4.72867 0 5.83333L0 15.8333C0.00132321 16.938 0.440735 17.997 1.22185 18.7782C2.00296 19.5593 3.062 19.9987 4.16667 20H15.8333C16.938 19.9987 17.997 19.5593 18.7782 18.7782C19.5593 17.997 19.9987 16.938 20 15.8333V5.83333C19.9987 4.72867 19.5593 3.66963 18.7782 2.88852C17.997 2.1074 16.938 1.66799 15.8333 1.66667V1.66667ZM1.66667 5.83333C1.66667 5.17029 1.93006 4.53441 2.3989 4.06557C2.86774 3.59673 3.50363 3.33333 4.16667 3.33333H15.8333C16.4964 3.33333 17.1323 3.59673 17.6011 4.06557C18.0699 4.53441 18.3333 5.17029 18.3333 5.83333V6.66667H1.66667V5.83333ZM15.8333 18.3333H4.16667C3.50363 18.3333 2.86774 18.0699 2.3989 17.6011C1.93006 17.1323 1.66667 16.4964 1.66667 15.8333V8.33333H18.3333V15.8333C18.3333 16.4964 18.0699 17.1323 17.6011 17.6011C17.1323 18.0699 16.4964 18.3333 15.8333 18.3333Z" fill="#033E4F"/>
        <path d="M10 13.75C10.6904 13.75 11.25 13.1904 11.25 12.5C11.25 11.8096 10.6904 11.25 10 11.25C9.30964 11.25 8.75 11.8096 8.75 12.5C8.75 13.1904 9.30964 13.75 10 13.75Z" fill="#033E4F"/>
        <path d="M5.83319 13.75C6.52355 13.75 7.08319 13.1904 7.08319 12.5C7.08319 11.8096 6.52355 11.25 5.83319 11.25C5.14283 11.25 4.58319 11.8096 4.58319 12.5C4.58319 13.1904 5.14283 13.75 5.83319 13.75Z" fill="#033E4F"/>
        <path d="M14.1668 13.75C14.8572 13.75 15.4168 13.1904 15.4168 12.5C15.4168 11.8096 14.8572 11.25 14.1668 11.25C13.4765 11.25 12.9168 11.8096 12.9168 12.5C12.9168 13.1904 13.4765 13.75 14.1668 13.75Z" fill="#033E4F"/>
      </g>
      <defs>
        <clipPath id="clip0_818_3639">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    </button>
  );
});

function RecordingPreviewIcon({ category }: { category: RecordingCategory }) {
  if (category === "audio") {
    return <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
  <g clipPath="url(#clip0_102_5329)">
    <path d="M11.8358 57.4715C11.8358 58.4418 11.0483 59.2293 10.078 59.2293H2.52881C1.5585 59.2293 0.770996 58.4418 0.770996 57.4715V49.9223C0.770996 48.952 1.5585 48.1645 2.52881 48.1645C3.49912 48.1645 4.28662 48.952 4.28662 49.9223V55.7137H10.078C11.0483 55.7137 11.8358 56.5012 11.8358 57.4715ZM57.471 48.1645C56.5007 48.1645 55.7132 48.952 55.7132 49.9223V55.7137H49.9218C48.9515 55.7137 48.164 56.5012 48.164 57.4715C48.164 58.4418 48.9515 59.2293 49.9218 59.2293H57.471C58.4413 59.2293 59.2288 58.4418 59.2288 57.4715V49.9223C59.2288 48.952 58.4425 48.1645 57.471 48.1645ZM2.52881 11.8363C3.49912 11.8363 4.28662 11.0488 4.28662 10.0785V4.28711H10.078C11.0483 4.28711 11.8358 3.49961 11.8358 2.5293C11.8358 1.55898 11.0483 0.771484 10.078 0.771484H2.52881C1.5585 0.771484 0.770996 1.55898 0.770996 2.5293V10.0785C0.770996 11.0488 1.55732 11.8363 2.52881 11.8363ZM57.471 0.771484H49.9218C48.9515 0.771484 48.164 1.55898 48.164 2.5293C48.164 3.49961 48.9515 4.28711 49.9218 4.28711H55.7132V10.0785C55.7132 11.0488 56.5007 11.8363 57.471 11.8363C58.4413 11.8363 59.2288 11.0488 59.2288 10.0785V2.5293C59.2288 1.55781 58.4425 0.771484 57.471 0.771484Z" fill="black" fillOpacity="0.2"/>
    <path opacity="0.2" d="M28.0664 16C28.6001 16 29.0332 16.4331 29.0332 16.9668V44.0332C29.0332 44.5673 28.6 45 28.0664 45C27.5323 45 27.0997 44.5673 27.0996 44.0332V16.9668C27.0996 16.4331 27.5323 16 28.0664 16ZM31.9326 16C32.4667 16 32.9004 16.4331 32.9004 16.9668V44.0332C32.9003 44.5673 32.4667 45 31.9326 45C31.3992 44.9997 30.9668 44.5671 30.9668 44.0332V16.9668C30.9668 16.4333 31.3992 16.0003 31.9326 16ZM24.2002 21.7998C24.7338 21.7998 25.1669 22.2326 25.167 22.7666V38.2334C25.1669 38.7675 24.7338 39.2002 24.2002 39.2002C23.6661 39.2002 23.2335 38.7674 23.2334 38.2334V22.7666C23.2335 22.2326 23.6662 21.7998 24.2002 21.7998ZM35.7998 21.7998C36.3338 21.7998 36.7665 22.2326 36.7666 22.7666V38.2334C36.7665 38.7674 36.3339 39.2002 35.7998 39.2002C35.2662 39.2002 34.8331 38.7675 34.833 38.2334V22.7666C34.8331 22.2326 35.2662 21.7998 35.7998 21.7998ZM20.334 23.7334C20.8674 23.7336 21.2998 24.1662 21.2998 24.7002V36.2998C21.2998 36.8338 20.8674 37.2664 20.334 37.2666C19.7999 37.2666 19.3662 36.8339 19.3662 36.2998V24.7002C19.3662 24.1661 19.7999 23.7334 20.334 23.7334ZM39.666 23.7334C40.2001 23.7334 40.6338 24.1661 40.6338 24.7002V36.2998C40.6338 36.8339 40.2001 37.2666 39.666 37.2666C39.1325 37.2664 38.7002 36.8338 38.7002 36.2998V24.7002C38.7002 24.1662 39.1325 23.7336 39.666 23.7334ZM8.7334 25.667C9.26737 25.6672 9.7002 26.0998 9.7002 26.6338V34.3672C9.69995 34.901 9.26721 35.3338 8.7334 35.334C8.19989 35.334 7.76685 34.9011 7.7666 34.3672V26.6338C7.7666 26.0997 8.19974 25.667 8.7334 25.667ZM12.5996 25.667C13.1337 25.667 13.5664 26.0997 13.5664 26.6338V34.3672C13.5662 34.9011 13.1336 35.334 12.5996 35.334C12.0662 35.3339 11.634 34.901 11.6338 34.3672V26.6338C11.6338 26.0997 12.066 25.6671 12.5996 25.667ZM47.4004 25.667C47.934 25.6671 48.3662 26.0997 48.3662 26.6338V34.3672C48.366 34.901 47.9338 35.3339 47.4004 35.334C46.8664 35.334 46.4338 34.9011 46.4336 34.3672V26.6338C46.4336 26.0997 46.8663 25.667 47.4004 25.667ZM51.2666 25.667C51.8003 25.667 52.2334 26.0997 52.2334 26.6338V34.3672C52.2332 34.9011 51.8001 35.334 51.2666 35.334C50.7328 35.3338 50.3 34.901 50.2998 34.3672V26.6338C50.2998 26.0998 50.7326 25.6671 51.2666 25.667ZM4.86719 27.5996C5.40101 27.5998 5.83374 28.0326 5.83398 28.5664V32.4336C5.83391 32.9671 5.40112 33.4002 4.86719 33.4004C4.33357 33.4004 3.90046 32.9672 3.90039 32.4336V28.5664C3.90063 28.0325 4.33368 27.5996 4.86719 27.5996ZM16.4668 27.5996C17.0003 27.5996 17.4334 28.0325 17.4336 28.5664V32.4336C17.4335 32.9672 17.0004 33.4004 16.4668 33.4004C15.9328 33.4003 15.5001 32.9672 15.5 32.4336V28.5664C15.5002 28.0325 15.9329 27.5997 16.4668 27.5996ZM43.5332 27.5996C44.0672 27.5996 44.4998 28.0325 44.5 28.5664V32.4336C44.4999 32.9672 44.0673 33.4004 43.5332 33.4004C42.9998 33.4002 42.5675 32.9671 42.5674 32.4336V28.5664C42.5676 28.0326 42.9999 27.5998 43.5332 27.5996ZM55.1338 27.5996C55.6672 27.5997 56.0994 28.0326 56.0996 28.5664V32.4336C56.0995 32.9671 55.6673 33.4003 55.1338 33.4004C54.5997 33.4004 54.1671 32.9672 54.167 32.4336V28.5664C54.1672 28.0325 54.5998 27.5996 55.1338 27.5996ZM1.9668 28.5664C2.50046 28.5664 2.93359 28.9995 2.93359 29.5332V31.4668C2.93337 32.0007 2.50032 32.4336 1.9668 32.4336C1.43287 32.4336 1.00022 32.0007 1 31.4668V29.5332C1 28.9996 1.43273 28.5664 1.9668 28.5664ZM58.0332 28.5664C58.5673 28.5664 59 28.9995 59 29.5332V31.4668C58.9998 32.0007 58.5672 32.4336 58.0332 32.4336C57.4998 32.4334 57.0676 32.0006 57.0674 31.4668V29.5332C57.0674 28.9997 57.4997 28.5666 58.0332 28.5664Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_102_5329">
      <rect width="60" height="60" fill="white"/>
    </clipPath>
  </defs>
</svg>;
  }

  return <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
  <g clipPath="url(#clip0_102_5042)">
    <path d="M11.836 57.4715C11.836 58.4418 11.0485 59.2293 10.0781 59.2293H2.52893C1.55862 59.2293 0.771118 58.4418 0.771118 57.4715V49.9223C0.771118 48.952 1.55862 48.1645 2.52893 48.1645C3.49924 48.1645 4.28674 48.952 4.28674 49.9223V55.7137H10.0781C11.0485 55.7137 11.836 56.5012 11.836 57.4715ZM57.4711 48.1645C56.5008 48.1645 55.7133 48.952 55.7133 49.9223V55.7137H49.9219C48.9516 55.7137 48.1641 56.5012 48.1641 57.4715C48.1641 58.4418 48.9516 59.2293 49.9219 59.2293H57.4711C58.4414 59.2293 59.2289 58.4418 59.2289 57.4715V49.9223C59.2289 48.952 58.4426 48.1645 57.4711 48.1645ZM2.52893 11.8363C3.49924 11.8363 4.28674 11.0488 4.28674 10.0785V4.28711H10.0781C11.0485 4.28711 11.836 3.49961 11.836 2.5293C11.836 1.55898 11.0485 0.771484 10.0781 0.771484H2.52893C1.55862 0.771484 0.771118 1.55898 0.771118 2.5293V10.0785C0.771118 11.0488 1.55745 11.8363 2.52893 11.8363ZM57.4711 0.771484H49.9219C48.9516 0.771484 48.1641 1.55898 48.1641 2.5293C48.1641 3.49961 48.9516 4.28711 49.9219 4.28711H55.7133V10.0785C55.7133 11.0488 56.5008 11.8363 57.4711 11.8363C58.4414 11.8363 59.2289 11.0488 59.2289 10.0785V2.5293C59.2289 1.55781 58.4426 0.771484 57.4711 0.771484ZM39.6258 35.8059V39.9086C39.6258 41.7777 38.1047 43.2977 36.2367 43.2977H11.5254C9.65627 43.2977 8.13635 41.7766 8.13635 39.9086V21.4C8.13635 19.5309 9.65745 18.0109 11.5254 18.0109H36.2356C38.1047 18.0109 39.6246 19.532 39.6246 21.4V25.5027L49.4414 21.5066C49.9828 21.2863 50.5992 21.3496 51.0856 21.6766C51.5707 22.0035 51.8625 22.5496 51.8625 23.1355V38.1754C51.8625 38.7602 51.5707 39.3074 51.0856 39.6344C50.7914 39.8324 50.4492 39.9332 50.1047 39.9332C49.8809 39.9332 49.6559 39.8898 49.4426 39.8031L39.6258 35.8059ZM36.1102 21.5266H11.652V39.782H36.1102V21.5266ZM39.6258 29.2984V32.0102L48.3481 35.5609V25.7477L39.6258 29.2984Z" fill="black" fillOpacity="0.2"/>
  </g>
  <defs>
    <clipPath id="clip0_102_5042">
      <rect width="60" height="60" fill="white"/>
    </clipPath>
  </defs>
</svg>;
}

function MetaCalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.66667 1.66675V4.16675M13.3333 1.66675V4.16675M2.91667 7.57508H17.0833M4.58333 3.33341H15.4167C16.3371 3.33341 17.0833 4.07961 17.0833 5.00008V15.8334C17.0833 16.7539 16.3371 17.5001 15.4167 17.5001H4.58333C3.66286 17.5001 2.91667 16.7539 2.91667 15.8334V5.00008C2.91667 4.07961 3.66286 3.33341 4.58333 3.33341Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetaUserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M15.8337 17.4999C15.8337 15.6589 13.222 14.1666 10.0003 14.1666C6.77867 14.1666 4.16699 15.6589 4.16699 17.4999M10.0003 10.8333C8.15938 10.8333 6.66699 9.34087 6.66699 7.49992C6.66699 5.65897 8.15938 4.16658 10.0003 4.16658C11.8413 4.16658 13.3337 5.65897 13.3337 7.49992C13.3337 9.34087 11.8413 10.8333 10.0003 10.8333Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_818_1036)">
      <path d="M8.23181 15.1017C8.46398 15.334 8.73965 15.5183 9.04307 15.644C9.34649 15.7697 9.67171 15.8345 10.0001 15.8345C10.3286 15.8345 10.6538 15.7697 10.9572 15.644C11.2606 15.5183 11.5363 15.334 11.7685 15.1017L14.4443 12.4258C14.5878 12.2672 14.6647 12.0594 14.6592 11.8455C14.6538 11.6317 14.5662 11.4282 14.4148 11.2771C14.2634 11.126 14.0597 11.0389 13.8458 11.0338C13.632 11.0288 13.4243 11.1062 13.266 11.25L10.8276 13.6892L10.8335 0.833333C10.8335 0.61232 10.7457 0.400358 10.5894 0.244078C10.4331 0.0877974 10.2212 0 10.0001 0V0C9.77913 0 9.56717 0.0877974 9.41089 0.244078C9.25461 0.400358 9.16681 0.61232 9.16681 0.833333L9.15931 13.6733L6.73431 11.25C6.57795 11.0937 6.36591 11.006 6.14485 11.0061C5.92379 11.0062 5.71182 11.094 5.55556 11.2504C5.39931 11.4068 5.31157 11.6188 5.31165 11.8399C5.31172 12.0609 5.39961 12.2729 5.55598 12.4292L8.23181 15.1017Z" fill="#033E4F"/>
      <path d="M19.1667 13.334C18.9457 13.334 18.7337 13.4218 18.5774 13.5781C18.4211 13.7343 18.3333 13.9463 18.3333 14.1673V17.5006C18.3333 17.7217 18.2455 17.9336 18.0893 18.0899C17.933 18.2462 17.721 18.334 17.5 18.334H2.5C2.27899 18.334 2.06702 18.2462 1.91074 18.0899C1.75446 17.9336 1.66667 17.7217 1.66667 17.5006V14.1673C1.66667 13.9463 1.57887 13.7343 1.42259 13.5781C1.26631 13.4218 1.05435 13.334 0.833333 13.334V13.334C0.61232 13.334 0.400358 13.4218 0.244078 13.5781C0.0877974 13.7343 0 13.9463 0 14.1673L0 17.5006C0 18.1637 0.263392 18.7996 0.732233 19.2684C1.20107 19.7372 1.83696 20.0006 2.5 20.0006H17.5C18.163 20.0006 18.7989 19.7372 19.2678 19.2684C19.7366 18.7996 20 18.1637 20 17.5006V14.1673C20 13.9463 19.9122 13.7343 19.7559 13.5781C19.5996 13.4218 19.3877 13.334 19.1667 13.334Z" fill="#033E4F"/>
    </g>
    <defs>
      <clipPath id="clip0_818_1036">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
  );
}

export default function RecordingsPage() {
  const [activeTab, setActiveTab] = useState<RecordingCategory>("webinars");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecordings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return recordings.filter((item) => {
      if (item.category !== activeTab) {
        return false;
      }

      if (selectedDate && !isSameDay(item.recordedAt, selectedDate)) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(query) ||
        item.speaker?.toLowerCase().includes(query) ||
        item.attendees?.toLowerCase().includes(query)
      );
    });
  }, [activeTab, searchQuery, selectedDate]);

  return (
    <section className="recordings_page">
      <div className="recordings_page_intro">
        <h2 className="dashboard_title">Recordings</h2>
        <p className="dashboard_sub">
          Access and manage recordings of webinars, video calls, and audio sessions.
        </p>
      </div>

      <div className="recordings_tabs" role="tablist" aria-label="Recording categories">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`recordings_tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="recordings_toolbar">
        <div>
          <h3 className="recordings_section_title">{categoryTitles[activeTab]}</h3>
        </div>

        <div className="recordings_filters">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMM dd, yyyy"
            isClearable
            customInput={<DateFilterInput />}
            popperPlacement="bottom-end"
          />

          <label className="recordings_search" aria-label="Search recording">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M15.3337 15.3334L12.4337 12.4334M13.0003 7.66675C13.0003 10.6123 10.612 13.0001 7.66699 13.0001C4.72147 13.0001 2.33366 10.6123 2.33366 7.66675C2.33366 4.72123 4.72147 2.33341 7.66699 2.33341C10.612 2.33341 13.0003 4.72123 13.0003 7.66675Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search recording..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="row recordings_grid">
        {filteredRecordings.map((item) => (
          <div className="col-12 col-md-6 col-xl-4" key={item.id}>
            <article className="recordings_card">
              <div className="recordings_card_preview">
                <span className="recordings_duration">{item.duration}</span>
                <div className="recordings_preview_icon">
                  <RecordingPreviewIcon category={item.category} />
                </div>
              </div>

              <div className="recordings_card_body">
                <h4>{item.title}</h4>

                <div className="recordings_meta">
                  <span>
                    <MetaCalendarIcon />
                    {formatDateLabel(item.recordedAt)}
                    {item.attendees ? ` • ${item.attendees}` : ""}
                  </span>

                  {item.speaker ? (
                    <span>
                      <MetaUserIcon />
                      {item.speaker}
                    </span>
                  ) : null}
                </div>

                <div className="recordings_card_actions">
                  <button type="button" className="recordings_play_btn">
                    Play Recording
                  </button>

                  <button type="button" className="recordings_icon_btn" aria-label={`Download ${item.title}`}>
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      {!filteredRecordings.length ? (
        <div className="recordings_empty_state">
          <h4>No recordings found</h4>
          <p>Try changing the date or search filters to see more results.</p>
        </div>
      ) : null}
    </section>
  );
}
