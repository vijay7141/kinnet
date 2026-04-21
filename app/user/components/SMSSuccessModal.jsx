"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function SMSSuccessModal({ show, handleClose }) {
  return (
      <Modal
          show={show}
          onHide={handleClose}
          centered
          className="auth_modal"
        >
          <Modal.Body className="text-center  ">
    
            {/* Icon */}
            <div className="mb-3">
              <img src="/icn/review_icn.svg" alt="" style={{ width: "64px" }} />
            </div>
    
            {/* Heading */}
            <h5 className="fw-bold">SMS Sent Successfully</h5>

    
            {/* Text */}
            <p className="text-muted small mt-2 mb-4">
             The SMS has been successfully sent to the pet owner. 
            </p>
    
            {/* Button */}
            <div className="buttons">
           
    <Button className="kinnect-btn-primary" onClick={handleClose}>
             Done
            </Button>
            </div>
        
    
          </Modal.Body>
        </Modal>
  );
}