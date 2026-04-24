"use client";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap";

export default function ReferralConfirmModel({
  show,
  handleClose,
  handleConfirm,
}) {
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
            <h5 className="fw-bold">Confirm Submission?</h5>

    
            {/* Text */}
            <p className="text-muted small mt-2 mb-4">
              You are about to submit a referral for Luna Smith. 
            </p>
    
            {/* Button */}
            <div className="buttons">
               <Button className="kinnect-btn-secondary " onClick={handleClose}>
             Edit Form
            </Button> 
      <Button className="kinnect-btn-primary"  >
      <Link href="/user/referrals">Confirm</Link>
             
            </Button>
            </div>
        
    
          </Modal.Body>
        </Modal>
  
  );
}