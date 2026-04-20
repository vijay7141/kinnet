"use client";
import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function ResetPassword() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="auth_flow_area  d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5} md={8}>

            {/* Logo */}
            <div className="text-center mb-4">
              <img src="/logo_big.svg" alt="logo" className="auth_logo" />
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0">
              <Card.Body className="p-4">

                <h5 className="fw-bold mb-2">Reset Password</h5>

                <p className="text-muted small mb-4">
                  Please choose a secure password that you haven’t used before with this account.
                </p>

                <Form>

                  {/* New Password */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="justify-content-start gap-1">
                      New Password <span className="text-danger">*</span>
                    </Form.Label>

                    <div className="password_field position-relative">
                                    <div className="form_bx">
                      <Form.Control
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="auth_input"
                      />
                      <span onClick={() => setShowPass(!showPass)} className="auth_eye">
                        <img src="/icn/eye_icn.svg" alt="" />
                      </span>
                      </div>
                    </div>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4 position-relative">
                        
                    <Form.Label className="justify-content-start gap-1">
                      Confirm Password  <span className="text-danger">*</span>
                    </Form.Label>

                    <div className="password_field form_bx position-relative">
                      <Form.Control
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        className="auth_input"
                      />
                      <span onClick={() => setShowConfirm(!showConfirm)} className="auth_eye">
                        <img src="/icn/eye_icn.svg" alt="" />
                      </span>
                    </div>
                  </Form.Group>

                  {/* Checklist */}
                  <div className="auth_checklist mb-4">
                    <h6>Security Checklist</h6>
                    <ul>
                      <li>
                        <img src="/icn/auth_correct_icn.svg" alt="" />
                        Password must be at least 8 characters
                      </li>
                      <li>
                        <img src="/icn/auth_correct_icn.svg" alt="" />
                        Include 1 uppercase, 1 lowercase
                      </li>
                      <li>
                        <img src="/icn/auth_correct_icn.svg" alt="" />
                        1 Number, and 1 special character
                      </li>
                    </ul>
                  </div>

                  {/* Button */}
                  <Link href="/forgot-password/reset-successfully">
                    <Button className="auth_btn w-100 mb-4">
                      Update Password
                    </Button>
                  </Link>

                  <hr />

                  {/* Back */}
                  <div className="text-center mt-3">
                    <Link href="/login" className="back_login">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M2.86875 6.75L7.06875 10.95L6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875Z" fill="#E4432D"/>
</svg> Return to Login
                    </Link>
                  </div>

                </Form>

              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </section>
  );
}