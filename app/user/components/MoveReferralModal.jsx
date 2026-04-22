"use client";

import { Button, Modal } from "react-bootstrap";

export default function MoveReferralModal({
  show,
  handleClose,
  currentStage = "Current",
  nextStage = "Next",
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      className="move_referral_modal"
    >
      <Modal.Body>
        <div className="move_referral_modal_icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
  <path d="M6.94444 26V15.0526H0L12.5 0L25 15.0526H18.0556V26H6.94444ZM9.72222 23.2632H15.2778V12.3158H19.1319L12.5 4.31053L5.86806 12.3158H9.72222V23.2632Z" fill="#033E4F"/>
</svg>
        </div>


        <h5>
          Move Referral From [{currentStage}] To
          <br />
          [{nextStage}]?
        </h5>

        <div className="move_referral_modal_actions">
          <Button className="kinnect-btn-secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="kinnect-btn-primary " onClick={handleClose}>
            Confirm &amp; Notify
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
