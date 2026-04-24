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
             <Link href="/login"> <img src="/logo_big.svg" alt="logo" className="auth_logo" /></Link>
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0 text-center">
              <Card.Body className="p-4">

                {/* Icon */}
                <div className="success_icon_box mx-auto mb-3">
                  <img src="/icn/check_icn.svg" alt="" />
                </div>

                {/* Heading */}
                <h5 className="fw-bold">Password Reset Successfully</h5>

                {/* Text */}
                <p className="text-muted small mt-2 mb-4">
                  Your credentials have been updated. You can now access your clinical dashboard with your new secure password.
                </p>

                {/* Button */}
                <Button
                  as={Link}
                  href="/forgot-password/reset-link-expired"
                  className="auth_btn w-100"
                >
                  Back to Login
                </Button>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </section>
  );
}