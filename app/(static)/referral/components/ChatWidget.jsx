"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CameraVideo,
  Check2,
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
    deliveryStatus: "Read",
  },
];

const getStatusMeta = (deliveryStatus) => {
  if (deliveryStatus === "Delivered") {
    return {
      label: "Delivered",
      icon: <Check2 size={12} aria-hidden="true" />,
      className: "delivered",
    };
  }

  if (deliveryStatus === "Sent") {
    return {
      label: "Sent",
      icon: <Check2All size={12} aria-hidden="true" />,
      className: "sent",
    };
  }

  return {
    label: "Read",
    icon: <Check2All size={12} aria-hidden="true" />,
    className: "read",
  };
};

export default function ReferralChat({ isOpen = true, onClose }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const statusTimeoutsRef = useRef([]);

  useEffect(() => {
    const timeoutIds = statusTimeoutsRef.current;

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const queueMessageStatusUpdates = (messageId) => {
    const sentTimeout = window.setTimeout(() => {
      setMessages((currentMessages) =>
        currentMessages.map((item) =>
          item.id === messageId ? { ...item, deliveryStatus: "Sent" } : item
        )
      );
    }, 2000);

    const readTimeout = window.setTimeout(() => {
      setMessages((currentMessages) =>
        currentMessages.map((item) =>
          item.id === messageId ? { ...item, deliveryStatus: "Read" } : item
        )
      );
    }, 4000);

    statusTimeoutsRef.current.push(sentTimeout, readTimeout);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = message.trim();
    const messageId = Date.now();

    if (!text) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: messageId,
        side: "right",
        author: "Me",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        text,
        deliveryStatus: "Delivered",
      },
    ]);
    queueMessageStatusUpdates(messageId);
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
            onClick={() => onClose?.()}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="ref_chat_body">
          <div className="ref_chat_date">
            <span>TODAY, OCTOBER 24</span>
          </div>

          {messages.map((item) => {
            const statusMeta = item.side === "right" ? getStatusMeta(item.deliveryStatus) : null;

            return (
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
                  <div className={`ref_read ${statusMeta?.className ?? ""}`}>
                    {statusMeta?.icon} {statusMeta?.label}
                  </div>
                ) : null}
              </div>
            </div>
          )})}
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
