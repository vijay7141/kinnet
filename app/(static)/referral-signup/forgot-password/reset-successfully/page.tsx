"use client";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function ResetSuccess() {
  return (
    <section className="auth_flow_area forgot_password_area d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>

            {/* Logo */}
            <div className="text-center mb-4">
              <img src="/logo_big.svg" alt="logo" className="auth_logo" />
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0 text-center">
              <Card.Body className="p-0">

                {/* Icon */}
                <div className="success_icon_box mx-auto mb-3">
                  <img src="/icn/check_icn.svg" alt="" />
                </div>

                {/* Heading */}
                <h5 className="fw-bold"></h5>

                {/* Text */}
                <p className="text-muted small mt-2 mb-4">
                  Your referral has been submitted successfully.<br />
                Your referral ID is <span className="refrl-copy">#12345. <img src="/icn/copy.svg" alt="" /></span><br />To track the status, create an account and use this ID under referrals.
                </p>

                {/* Button */}
                <div className="d-flex gap-3">
                <Link href="/forgot-password/reset-link-expired"
                  className="commen_btn2 border-0 w-100 d-block">Done
                </Link>
                <Link href="/forgot-password/reset-link-expired"
                  className="auth_btn w-100 d-block">
                  Create Account
                </Link>
                </div>


              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </section>
  );
}