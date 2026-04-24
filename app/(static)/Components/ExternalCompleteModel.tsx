import Link from "next/link";
import { Modal, Button } from "react-bootstrap";

export default function ExternalCompleteModel({ show, handleClose }: any) {
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
        <h5 className="fw-bold">Account created</h5>

        {/* Text */}
        <p className="text-muted small mt-2 mb-4">
          You can now Kinnect with the Kin team and manage referrals!
        </p>

        {/* Button */}
        <Button className="auth_btn w-100"  >
          <Link href="/referral-signup/login">
          Continue
          </Link>
          
        </Button>

      </Modal.Body>
    </Modal>
  );
}