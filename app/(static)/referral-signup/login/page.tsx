"use client";
 
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
      const [showPassword, setShowPassword] = useState(false);
           const [showAlert, setShowAlert] = useState(false);
        const router = useRouter();
      
          const handleClick = () => {
          if (!showAlert) {
            // First click → alert show
            setShowAlert(true);
          } else {
            // Second click → redirect
            router.push("/referral/referrals"); // apna route daal dena
          }
        };
  return (
     <>
          <section className="auth_flow_area forgot_password_area d-flex align-items-center min-vh-100">
      <Container fluid>
        <Row className=" "> 
          <Col xl={6} className="auth_flow_left d-flex flex-column justify-content-center px-xl-5 px-0">
            <img src="/logo_big.svg" alt="logo" className="logo" />
            <h1 className="auth_title ">
              Elevating Veterinary <br />
              <span className="text-danger">Communication.</span>
            </h1>

            <p className="auth_subtitle text-muted mt-3">
              Join Kinnect for communication, collaboration, and referrals.
            </p>

            <Row className="mt-4 g-3 d-md-flex d-none">
              <Col md={6}>
                <Card className="auth_card p-3 border-0">
                  <Card.Body>
                      <img src="/icn/instant_icn.svg" alt="" />
                    <Card.Title className="fw-bold">Referrals</Card.Title>
                    <Card.Text className="small text-muted">
                      Submit and manage referrals with structured workflows.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="auth_card p-3 border-0">
                  <Card.Body>
                      <img src="/icn/message_icn.svg" alt="" />

                    <Card.Title className="fw-bold">Instant Messages</Card.Title>
                    <Card.Text className="small text-muted">
                      Stay connected with real-time messaging.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </Col>

          {/* RIGHT SIDE */}
          <Col xl={6} className="auth_flow_right d-flex justify-content-center mt-xl-o mt-4">
            <Card className="auth_form_box   w-100  ">

              <Card.Body>
                <h5 className="fw-bold">Login</h5>
                <p className="small text-muted">
                  Enter your details to log in.
                </p>
       {showAlert && (
        <Alert  
          variant="danger"
          className="auth_alert d-flex align-items-center gap-3"
        >
          <img src="/icn/red_alert_icn.svg" alt="" />
          <span>
            That email doesn’t look right. Please try again.
          </span>
        </Alert>
      )}
                <Form>

                  {/* EMAIL */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="li@email.com"
                      defaultValue="dr.stephen.strange@vetclinic.com"
                      
                    />
                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label>Password</Form.Label>
                     <div className="form_bx">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      className="border-danger"
                      placeholder="••••••••"
                    />
                   
                   <span
                      className="auth_eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                        <img src="/icn/eye_icn.svg" alt="" />
                    </span>
                    </div>
                   
                  </Form.Group>

                 
                  {/* CHECKLIST */}
                  <div className="auth_checklist ">
                    <h6>Security Checklist</h6>
                    <ul>
                        <li>
                           <img src="/icn/auth_correct_icn.svg" alt="" /> Password must be at least 8 characters
                        </li>
                          <li>
                           <img src="/icn/auth_correct_icn.svg" alt="" /> Include 1 uppercase, 1 Lowercase
                        </li>

                          <li>
                            <img src="/icn/auth_correct_icn.svg" alt="" /> 1 Number, and 1 special character
                        </li>
                    </ul>
                   
                  </div>

                 
                    <Button className="auth_btn w-100" onClick={handleClick}>
                    Login
                  </Button>
                  <div className="forget_btn">
                     
                  <Link href="/forgot-password"> Forgot Password? </Link>
                  </div>

                </Form>

                <p className="text-center mt-3 small text-muted">
                    
                  Having trouble? <br />Contact us at  <span> contact@kinnect.com
</span>                </p>
              </Card.Body>

            </Card>
          </Col>

        </Row>
      </Container>
    </section>
     </>
  );
}