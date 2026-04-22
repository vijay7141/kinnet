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
      <img src="/icn/calender_new.svg" alt="" />
    </button>
  );
});

function RecordingPreviewIcon({ category }: { category: RecordingCategory }) {
  if (category === "audio") {
    return <img src="/icn/audiocall_icn.svg" alt="" />;
  }

  return <img src="/icn/videocall_icn.svg" alt="" />;
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4V15M12 15L7.5 10.5M12 15L16.5 10.5M5 19H19"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
