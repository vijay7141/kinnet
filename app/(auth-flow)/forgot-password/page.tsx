"use client";
 
import { Container, Row, Col, Card, Form, Button, NavLink } from "react-bootstrap";
import Link from "next/link";
export default function ForgotPassword() {
  return (
    <section className="auth_flow_area forgot_password_area d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col xl={5} md={8}>

            {/* Logo */}
            <div className="text-center mb-4">
      <Link href="/login"> <img src="/logo_big.svg" alt="logo" className="auth_logo" /></Link>
            </div>

            {/* Card */}
            <Card className="auth_form_box border-0">
              <Card.Body className="p-4">

                <h5 className="fw-bold mb-2">Forgot Password?</h5>

                <p className="text-muted small mb-4">
                 Enter the email address associated with your account. We'll send a secure link to reset your password.
                </p>

                <Form>

                  {/* Email */}
                  <Form.Group className="mb-4">
                    <Form.Label>
                      Email Address <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="dr.smith@vcawestside.com"
                      className="auth_input"
                    />
                  </Form.Group>

                  {/* Button */}
                  <Link href="/forgot-password/forget-mail-sent">
                  <Button className="auth_btn w-100 mb-4">
                    Send Reset Link
                  </Button>
                  </Link>
                  

                  <hr />

                  {/* Back to Login */}
                  <div className="text-center mt-3">
                    <Link href="/login" className="back_login">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M2.86875 6.75L7.06875 10.95L6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875Z" fill="#E4432D"/>
</svg> Back to Login
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