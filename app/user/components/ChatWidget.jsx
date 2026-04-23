"use client";

import React, { useState } from "react";
import {
  CameraVideo,
  Check2All,
  ChevronRight,
  Plus,
  Send,
  Telephone,
  X,
} from "react-bootstrap-icons";

const initialMessages = [
  {
    id: 1,
    side: "left",
    author: "Dr. Sarah Jenkins",
    time: "10:42 AM",
    text: "I've reviewed Buddy's latest blood work. His liver enzymes are slightly elevated, but consistent with his current medication protocol.",
  },
  {
    id: 2,
    side: "left",
    author: "Dr. Sarah Jenkins",
    time: "10:42 AM",
    text: "Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.",
  },
  {
    id: 3,
    side: "right",
    author: "Me",
    time: "11:30 AM",
    text: "Thanks for sharing",
  },
];

export default function ReferralChat() {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = message.trim();

    if (!text) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        side: "right",
        author: "Me",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        text,
      },
    ]);
    setMessage("");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="ref_chat_wrap">
      <div className="ref_chat_card">
        <div className="ref_chat_header">
          <div className="ref_chat_user">
            <div className="image">
              <img src="/icn/Dr.Sarah.svg" alt="" />
            </div>
            <div>
              <h6>
                Dr. Sarah Jenkins <ChevronRight size={12} aria-hidden="true" />
              </h6>
              <span>Available</span>
            </div>
          </div>

          <div className="ref_chat_actions">
            <button type="button" aria-label="Start audio call">
              <Telephone size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Start video call">
              <CameraVideo size={19} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="ref_chat_close"
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="ref_chat_body">
          <div className="ref_chat_date">
            <span>TODAY, OCTOBER 24</span>
          </div>

          {messages.map((item) => (
            <div key={item.id} className={`ref_msg ${item.side}`}>
              {item.side === "left" ? <img src="/icn/Dr.Sarah.svg" alt="" /> : null}
              <div>
                <div className={`ref_msg_head ${item.side === "right" ? "right" : ""}`}>
                  {item.side === "right" ? <span>{item.time}</span> : null}
                  <b>{item.author}</b>
                  {item.side === "left" ? <span>{item.time}</span> : null}
                </div>
                <div className={`ref_msg_box ${item.side === "right" ? "dark" : ""}`}>
                  {item.text}
                </div>
                {item.side === "right" ? (
                  <div className="ref_read">
                    <Check2All size={12} aria-hidden="true" /> Read
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <form className="ref_chat_footer" onSubmit={handleSubmit}>
          <button type="button" className="ref_plus" aria-label="Add attachment">
            <Plus size={20} aria-hidden="true" />
          </button>
          <input
            placeholder="Type a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit" className="ref_send" aria-label="Send message">
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
