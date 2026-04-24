"use client";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function SendSMSModel({ show, handleClose, handleSuccessOpen }) {
  const [showError, setShowError] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleSend = () => {
    if (clickCount === 0) {
      setShowError(true);
      setClickCount(1);
    } else {
      handleClose();         // current modal close
      handleSuccessOpen();   // next modal open
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="sms_modal p-0"
    >

      {/* ERROR ALERT */}
      {showError && (
        <div className="sms_error_alert">
          <div className="error_icon">!</div>
          <span>Failed To Send SMS.</span>
        </div>
      )}

      <Modal.Body>
        <h5 className="sms_title">Send SMS</h5>

        {/* Recipient */}
        <div className="sms_field">
          <label>Recipient</label>
          <div className="sms_input_wrap">
            <input
              type="text"
              value="+1 (555) 012-3456"
              readOnly
              className="form-control"
            />
            <span className="owner">Pet Owner: Jane Doe</span>
          </div>
        </div>

        {/* Radio */}
        <div className="sms_radio">
          <label className="custom_radio">
            <input type="radio" name="status" defaultChecked />
            <span className="radio_ui"></span>
            <span className="radio_label">Stable</span>
          </label>

          <label className="custom_radio">
            <input type="radio" name="status" />
            <span className="radio_ui"></span>
            <span className="radio_label">Urgent</span>
          </label>
        </div>

        {/* Message */}
        <div className="sms_field">
          <textarea
            rows={5}
            className="form-control"
            defaultValue={`Hi,
<Pet Name> has been referred to Kin Vet by your Vet <Vet Name>. Our phone number is ###.
You can schedule your appointment here:
<Instinct Scheduler Link>
If your pet’s condition changes, our ER is open 24/7.`}
          />
        </div>

        {/* Buttons */}
        <div className="sms_actions">
          <Button className="kinnect-btn-primary" onClick={handleClose}>
            Cancel
          </Button>

          <Button className="kinnect-btn-secondary" onClick={handleSend}>
            Send SMS
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}