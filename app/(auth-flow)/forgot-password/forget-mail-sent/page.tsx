"use client";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function ForgotMailSent() {
  return (
    <section className="auth_flow_area forgot_password_area d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>

            {/* Logo */}
            <div className="text-center mb-4">
             <Link href="/login"> <img src="/logo_big.svg" alt="logo" className="auth_logo" /></Link>
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0 text-center">
              <Card.Body className="p-4">

                {/* Icon */}
                <div className="mail_icon_box mx-auto mb-3">
                  <img src="/icn/check_mail.svg" alt="" />
                </div>

                {/* Heading */}
                <h5 className="fw-bold">Check Your Email</h5>

                {/* Text */}
                <p className="text-muted small mt-2 mb-4">
                  Password reset link has been sent to your email. Please follow the instructions to regain access to your account.
                </p>

                {/* Button */}
                <Button    className="auth_btn w-100 mb-4">
                <Link href="/forgot-password/reset-password">
                </Link>  Back to Login
                </Button>

                <hr />

                {/* Resend */}
                <p className="small text-muted mt-3 mb-0">
                  Didn’t receive the email?{" "}
                  <span className="resend_link">Resend link</span>
                </p>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </section>
  );
}