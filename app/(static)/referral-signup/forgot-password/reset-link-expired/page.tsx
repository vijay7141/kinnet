"use client";
import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";

export default function LinkExpired() {
  return (
    <section className="auth_flow_area forgot_password_area error_expire_sec d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>

            {/* Logo */}
            <div className="text-center mb-4">
              <img src="/logo_big.svg" alt="logo" className="auth_logo" />
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0 text-center">
              <Card.Body className="p-4">

                {/* Icon */}
                <div className="expired_icon_box mx-auto mb-3">
                  <img src="/icn/error_icn.svg" alt="" />
                </div>

                {/* Heading */}
                <h5 className="fw-bold">Invite Link Expired</h5>

                {/* Description */}
                <p className="text-muted small mt-2 mb-4">
                  This invite link has expired. Please contact our support team to request a new invitation.
                </p>

                {/* Extra Text */}
                <p className="text-muted small mb-2">
                  Looking to submit a referral?{" "}
                  <Link href="#" className="highlight_link">
                    Click here
                  </Link>
                </p>

                <p className="text-muted small my-2">Or</p>

                {/* Contact */}
                <Row className="mt-3">
                  <Col xs={6}>
                    <p className="small text-muted mb-1">Contact us at</p>
                    <p className="bold contact_text">
                      contact@kinnet.com
                    </p>
                  </Col>

                  <Col xs={6}>
                    <p className="small text-muted mb-1">Call us</p>
                    <p className="bold contact_text">
                      +1 213-555-0123
                    </p>
                  </Col>
                </Row>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </section>
  );
}