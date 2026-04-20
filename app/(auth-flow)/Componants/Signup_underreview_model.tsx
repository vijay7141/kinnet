import { Modal, Button } from "react-bootstrap";

export default function SignupUnderReviewModal({ show, handleClose }: any) {
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
        <h5 className="fw-bold">Profile Under Review</h5>

        {/* Text */}
        <p className="text-muted small mt-2 mb-4">
          Your profile is currently under review.  
          We’ll notify you once it’s approved.
        </p>

        {/* Button */}
        <Button className="auth_btn w-100" onClick={handleClose}>
          Continue to Dashboard
        </Button>

      </Modal.Body>
    </Modal>
  );
}