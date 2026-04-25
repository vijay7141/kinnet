import Link from "next/link";
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
        <h5 className="fw-bold">Your profile completed</h5>

        {/* Text */}
        <p className="text-muted small mt-2 mb-4">
          Your profile is now complete. You’re all set to explore and make the most of all features available to you.
        </p>

        {/* Button */}

        <Link href="/user/dashboard">
       
        <Button className="auth_btn w-100"  >
          Continue to Dashboard
        </Button>
 </Link>
      </Modal.Body>
    </Modal>
  );
}