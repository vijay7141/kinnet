'use client';

import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { type ChangeEvent, type Dispatch, type DragEvent, type KeyboardEvent, type RefObject, type SetStateAction } from 'react';

type ComposerReply = {
  author: string;
  text: string;
};

type ComposerAttachment = {
  name: string;
  size: string;
};

type MessagesComposerProps = {
  attachedFile: ComposerAttachment | null;
  copiedToast?: string;
  draftMessage: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDragActive: boolean;
  isEmojiPickerOpen: boolean;
  isUploadHintVisible: boolean;
  onAddEmoji: (emojiData: EmojiClickData) => void;
  onDragActiveChange: Dispatch<SetStateAction<boolean>>;
  onDraftMessageChange: Dispatch<SetStateAction<string>>;
  onDropFile: (file: File | null) => void;
  onRemoveAttachment: () => void;
  onReplyClear?: () => void;
  onSendMessage: () => void;
  onUploadHintVisibleChange: Dispatch<SetStateAction<boolean>>;
  onEmojiPickerOpenChange: Dispatch<SetStateAction<boolean>>;
  replyingTo?: ComposerReply | null;
  variant?: 'messages' | 'channels';
  wrapperClassName?: string;
};

export default function MessagesComposer({
  attachedFile,
  copiedToast = '',
  draftMessage,
  fileInputRef,
  handleAttachmentChange,
  isDragActive,
  isEmojiPickerOpen,
  isUploadHintVisible,
  onAddEmoji,
  onDragActiveChange,
  onDraftMessageChange,
  onDropFile,
  onRemoveAttachment,
  onReplyClear,
  onSendMessage,
  onUploadHintVisibleChange,
  onEmojiPickerOpenChange,
  replyingTo = null,
  variant = 'messages',
  wrapperClassName = '',
}: MessagesComposerProps) {
  const isChannelsVariant = variant === 'channels';
  const composerWrapClassName = ['messages_composer_wrap', wrapperClassName].filter(Boolean).join(' ');

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDragActiveChange(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextTarget = event.relatedTarget as Node | null;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      onDragActiveChange(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDropFile(event.dataTransfer.files?.[0] ?? null);
    onDragActiveChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={composerWrapClassName}>
      <div
        className={`messages_composer ${isDragActive ? 'drag_active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
            {isChannelsVariant ? (
              <strong><svg xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 12" fill="none">
                  <path d="M0 11.6667V0H4.60417C5.50694 0 6.34028 0.277778 7.10417 0.833333C7.86806 1.38889 8.25 2.15972 8.25 3.14583C8.25 3.85417 8.09028 4.39931 7.77083 4.78125C7.45139 5.16319 7.15278 5.4375 6.875 5.60417C7.22222 5.75694 7.60764 6.04167 8.03125 6.45833C8.45486 6.875 8.66667 7.5 8.66667 8.33333C8.66667 9.56944 8.21528 10.434 7.3125 10.9271C6.40972 11.4201 5.5625 11.6667 4.77083 11.6667H0ZM2.52083 9.33333H4.6875C5.35417 9.33333 5.76042 9.16319 5.90625 8.82292C6.05208 8.48264 6.125 8.23611 6.125 8.08333C6.125 7.93056 6.05208 7.68403 5.90625 7.34375C5.76042 7.00347 5.33333 6.83333 4.625 6.83333H2.52083V9.33333ZM2.52083 4.58333H4.45833C4.91667 4.58333 5.25 4.46528 5.45833 4.22917C5.66667 3.99306 5.77083 3.72917 5.77083 3.4375C5.77083 3.10417 5.65278 2.83333 5.41667 2.625C5.18056 2.41667 4.875 2.3125 4.5 2.3125H2.52083V4.58333Z" fill="#494949" />
                </svg></strong>
            ) : (
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="12" viewBox="0 0 9 12" fill="none">
                  <path d="M0 11.6667V0H4.60417C5.50694 0 6.34028 0.277778 7.10417 0.833333C7.86806 1.38889 8.25 2.15972 8.25 3.14583C8.25 3.85417 8.09028 4.39931 7.77083 4.78125C7.45139 5.16319 7.15278 5.4375 6.875 5.60417C7.22222 5.75694 7.60764 6.04167 8.03125 6.45833C8.45486 6.875 8.66667 7.5 8.66667 8.33333C8.66667 9.56944 8.21528 10.434 7.3125 10.9271C6.40972 11.4201 5.5625 11.6667 4.77083 11.6667H0ZM2.52083 9.33333H4.6875C5.35417 9.33333 5.76042 9.16319 5.90625 8.82292C6.05208 8.48264 6.125 8.23611 6.125 8.08333C6.125 7.93056 6.05208 7.68403 5.90625 7.34375C5.76042 7.00347 5.33333 6.83333 4.625 6.83333H2.52083V9.33333ZM2.52083 4.58333H4.45833C4.91667 4.58333 5.25 4.46528 5.45833 4.22917C5.66667 3.99306 5.77083 3.72917 5.77083 3.4375C5.77083 3.10417 5.65278 2.83333 5.41667 2.625C5.18056 2.41667 4.875 2.3125 4.5 2.3125H2.52083V4.58333Z" fill="#494949" />
                </svg>
              </strong>
            )}
          </button>

          <button type="button">
            {isChannelsVariant ? (
             <em>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                  <path d="M0 11.6667V9.58333H3.33333L5.83333 2.08333H2.5V0H10.8333V2.08333H7.91667L5.41667 9.58333H8.33333V11.6667H0Z" fill="#494949" />
                </svg>
              </em>
            ) : (
              <em>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                  <path d="M0 11.6667V9.58333H3.33333L5.83333 2.08333H2.5V0H10.8333V2.08333H7.91667L5.41667 9.58333H8.33333V11.6667H0Z" fill="#494949" />
                </svg>
              </em>
            )}
          </button>

          <div
            className={`messages_upload_tooltip_wrap ${isUploadHintVisible ? 'visible' : ''}`}
            onMouseEnter={() => onUploadHintVisibleChange(true)}
            onMouseLeave={() => onUploadHintVisibleChange(false)}
          >
            <button
              type="button"
              aria-label="Upload file"
              onClick={() => fileInputRef.current?.click()}
              onFocus={() => onUploadHintVisibleChange(true)}
              onBlur={() => onUploadHintVisibleChange(false)}
            >
              {isChannelsVariant ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11.4212 4.7791C11.3274 4.68536 11.2003 4.6327 11.0677 4.6327C10.9351 4.6327 10.8079 4.68536 10.7142 4.7791L5.26818 10.2486C5.03603 10.4808 4.76043 10.665 4.45711 10.7906C4.15379 10.9163 3.82868 10.981 3.50036 10.981C2.83727 10.981 2.20133 10.7177 1.73243 10.2488C1.26353 9.78001 1.00007 9.1441 1.00003 8.48102C0.999979 7.81794 1.26334 7.182 1.73218 6.7131L7.00668 1.4171C7.28872 1.13954 7.66902 0.984682 8.06472 0.986246C8.46043 0.987811 8.83949 1.14567 9.11933 1.42545C9.39917 1.70522 9.55712 2.08425 9.55878 2.47995C9.56044 2.87566 9.40567 3.25599 9.12818 3.5381L3.85368 8.8341C3.75855 8.92523 3.63191 8.9761 3.50018 8.9761C3.36845 8.9761 3.2418 8.92523 3.14668 8.8341C3.05294 8.74033 3.00029 8.61318 3.00029 8.4806C3.00029 8.34801 3.05294 8.22086 3.14668 8.1271L7.84268 3.4096C7.93376 3.3153 7.98415 3.18899 7.98302 3.0579C7.98188 2.9268 7.92929 2.80139 7.83659 2.70869C7.74388 2.61598 7.61848 2.5634 7.48738 2.56226C7.35628 2.56112 7.22998 2.61152 7.13568 2.7026L2.43968 7.4201C2.30036 7.55939 2.18985 7.72476 2.11445 7.90676C2.03906 8.08877 2.00025 8.28384 2.00025 8.48085C2.00025 8.67785 2.03906 8.87293 2.11445 9.05493C2.18985 9.23694 2.30036 9.40231 2.43968 9.5416C2.72549 9.81433 3.10537 9.9665 3.50043 9.9665C3.89549 9.9665 4.27537 9.81433 4.56118 9.5416L9.83518 4.2451C10.2942 3.77425 10.5492 3.14152 10.545 2.48398C10.5408 1.82644 10.2777 1.19704 9.81267 0.732108C9.34768 0.26718 8.71823 0.00416912 8.06069 4.91387e-05C7.40315 -0.00407084 6.77046 0.251032 6.29968 0.710097L1.02518 6.0061C0.368768 6.66251 -9.78128e-09 7.55279 0 8.4811C9.78128e-09 9.4094 0.368768 10.2997 1.02518 10.9561C1.68159 11.6125 2.57187 11.9813 3.50018 11.9813C4.42848 11.9813 5.31877 11.6125 5.97518 10.9561L11.4212 5.4881C11.4679 5.44163 11.505 5.38639 11.5303 5.32556C11.5556 5.26472 11.5686 5.19948 11.5686 5.1336C11.5686 5.06771 11.5556 5.00247 11.5303 4.94164C11.505 4.8808 11.4679 4.82556 11.4212 4.7791V4.7791Z" fill="#494949" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11.4212 4.7791C11.3274 4.68536 11.2003 4.6327 11.0677 4.6327C10.9351 4.6327 10.8079 4.68536 10.7142 4.7791L5.26818 10.2486C5.03603 10.4808 4.76043 10.665 4.45711 10.7906C4.15379 10.9163 3.82868 10.981 3.50036 10.981C2.83727 10.981 2.20133 10.7177 1.73243 10.2488C1.26353 9.78001 1.00007 9.1441 1.00003 8.48102C0.999979 7.81794 1.26334 7.182 1.73218 6.7131L7.00668 1.4171C7.28872 1.13954 7.66902 0.984682 8.06472 0.986246C8.46043 0.987811 8.83949 1.14567 9.11933 1.42545C9.39917 1.70522 9.55712 2.08425 9.55878 2.47995C9.56044 2.87566 9.40567 3.25599 9.12818 3.5381L3.85368 8.8341C3.75855 8.92523 3.63191 8.9761 3.50018 8.9761C3.36845 8.9761 3.2418 8.92523 3.14668 8.8341C3.05294 8.74033 3.00029 8.61318 3.00029 8.4806C3.00029 8.34801 3.05294 8.22086 3.14668 8.1271L7.84268 3.4096C7.93376 3.3153 7.98415 3.18899 7.98302 3.0579C7.98188 2.9268 7.92929 2.80139 7.83659 2.70869C7.74388 2.61598 7.61848 2.5634 7.48738 2.56226C7.35628 2.56112 7.22998 2.61152 7.13568 2.7026L2.43968 7.4201C2.30036 7.55939 2.18985 7.72476 2.11445 7.90676C2.03906 8.08877 2.00025 8.28384 2.00025 8.48085C2.00025 8.67785 2.03906 8.87293 2.11445 9.05493C2.18985 9.23694 2.30036 9.40231 2.43968 9.5416C2.72549 9.81433 3.10537 9.9665 3.50043 9.9665C3.89549 9.9665 4.27537 9.81433 4.56118 9.5416L9.83518 4.2451C10.2942 3.77425 10.5492 3.14152 10.545 2.48398C10.5408 1.82644 10.2777 1.19704 9.81267 0.732108C9.34768 0.26718 8.71823 0.00416912 8.06069 4.91387e-05C7.40315 -0.00407084 6.77046 0.251032 6.29968 0.710097L1.02518 6.0061C0.368768 6.66251 -9.78128e-09 7.55279 0 8.4811C9.78128e-09 9.4094 0.368768 10.2997 1.02518 10.9561C1.68159 11.6125 2.57187 11.9813 3.50018 11.9813C4.42848 11.9813 5.31877 11.6125 5.97518 10.9561L11.4212 5.4881C11.4679 5.44163 11.505 5.38639 11.5303 5.32556C11.5556 5.26472 11.5686 5.19948 11.5686 5.1336C11.5686 5.06771 11.5556 5.00247 11.5303 4.94164C11.505 4.8808 11.4679 4.82556 11.4212 4.7791V4.7791Z" fill="#494949" />
                </svg>
              )}
            </button>
            <div className="messages_upload_tooltip">
              <span>Upload File</span>
            </div>
          </div>
          <span></span>
        </div>

        {replyingTo && onReplyClear ? (
          <div className="messages_reply_preview">
            <div>
              <strong>Replying to {replyingTo.author}</strong>
              <span>{replyingTo.text}</span>
            </div>
            <button type="button" onClick={onReplyClear} aria-label="Cancel reply">
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
              {isChannelsVariant ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M5.25 2.25H10.875L13.5 4.875V13.875C13.5 14.4963 12.9963 15 12.375 15H5.625C5.00368 15 4.5 14.4963 4.5 13.875V3C4.5 2.58579 4.83579 2.25 5.25 2.25Z" stroke="#033E4F" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M10.5 2.625V5.25H13.125" stroke="#033E4F" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 10.5H8V8.5H9C9.28333 8.5 9.52083 8.40417 9.7125 8.2125C9.90417 8.02083 10 7.78333 10 7.5V6.5C10 6.21667 9.90417 5.97917 9.7125 5.7875C9.52083 5.59583 9.28333 5.5 9 5.5H7V10.5ZM8 7.5V6.5H9V7.5H8ZM11 10.5H13C13.2833 10.5 13.5208 10.4042 13.7125 10.2125C13.9042 10.0208 14 9.78333 14 9.5V6.5C14 6.21667 13.9042 5.97917 13.7125 5.7875C13.5208 5.59583 13.2833 5.5 13 5.5H11V10.5ZM12 9.5V6.5H13V9.5H12ZM15 10.5H16V8.5H17V7.5H16V6.5H17V5.5H15V10.5ZM6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H6ZM6 14H18V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H16V20H2ZM6 2V14V2Z" fill="#E4432D" />
                </svg>
              )}
            </div>
            <div>
              <strong>{attachedFile.name}</strong>
              <span>{attachedFile.size}</span>
            </div>
            <button type="button" onClick={onRemoveAttachment} aria-label="Remove attached file">
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
            {isChannelsVariant ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#494949"/>
</svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#494949" />
              </svg>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="messages_file_input"
            onChange={handleAttachmentChange}
          />

          <input
            value={draftMessage}
            onChange={(event) => onDraftMessageChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />

          <div className="messages_emoji_picker_wrap">
            <button
              type="button"
              className={`messages_composer_icon_btn ${isEmojiPickerOpen ? 'active' : ''}`}
              aria-label="Emoji"
              aria-expanded={isEmojiPickerOpen}
              onClick={() => onEmojiPickerOpenChange((current) => !current)}
            >
              {isChannelsVariant ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8.25" stroke="#374957" strokeWidth="1.5" />
                  <circle cx="7.25" cy="8" r="1" fill="#374957" />
                  <circle cx="12.75" cy="8" r="1" fill="#374957" />
                  <path d="M6.5 12C7.26739 13.0232 8.50441 13.6667 10 13.6667C11.4956 13.6667 12.7326 13.0232 13.5 12" stroke="#374957" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13.5 9C13.9167 9 14.2708 8.85417 14.5625 8.5625C14.8542 8.27083 15 7.91667 15 7.5C15 7.08333 14.8542 6.72917 14.5625 6.4375C14.2708 6.14583 13.9167 6 13.5 6C13.0833 6 12.7292 6.14583 12.4375 6.4375C12.1458 6.72917 12 7.08333 12 7.5C12 7.91667 12.1458 8.27083 12.4375 8.5625C12.7292 8.85417 13.0833 9 13.5 9ZM6.5 9C6.91667 9 7.27083 8.85417 7.5625 8.5625C7.85417 8.27083 8 7.91667 8 7.5C8 7.08333 7.85417 6.72917 7.5625 6.4375C7.27083 6.14583 6.91667 6 6.5 6C6.08333 6 5.72917 6.14583 5.4375 6.4375C5.14583 6.72917 5 7.08333 5 7.5C5 7.91667 5.14583 8.27083 5.4375 8.5625C5.72917 8.85417 6.08333 9 6.5 9ZM10 15.5C11.1333 15.5 12.1625 15.1792 13.0875 14.5375C14.0125 13.8958 14.6833 13.05 15.1 12H13.45C13.0833 12.6167 12.5958 13.1042 11.9875 13.4625C11.3792 13.8208 10.7167 14 10 14C9.28333 14 8.62083 13.8208 8.0125 13.4625C7.40417 13.1042 6.91667 12.6167 6.55 12H4.9C5.31667 13.05 5.9875 13.8958 6.9125 14.5375C7.8375 15.1792 8.86667 15.5 10 15.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#494949" />
                </svg>
              )}
            </button>

            {isEmojiPickerOpen ? (
              <div className="messages_emoji_picker" aria-label="Choose emoji">
                <EmojiPicker
                  onEmojiClick={onAddEmoji}
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

          <button type="button" className="messages_send_btn" onClick={onSendMessage}>
            Send
            <img src="/icn/send_icn.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
