"use client";
import "../../user/user.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons"; 
import ExternalCompleteModel from "../Components/ExternalCompleteModel";
export default function ReferralSignup() {
      const [showPassword, setShowPassword] = useState(false);
        const [showAlert, setShowAlert] = useState(false);
        const [phone, setPhone] = useState("");
 

    const handleClick = () => {
    if (!showAlert) {
      // First click → alert show
      setShowAlert(true);
    } else {
      // Second click → redirect
      router.push("/signup/profile-step"); // apna route daal dena
    }
  };
  const router = useRouter();
const [showReviewModal, setShowReviewModal] = useState(false);
  return (
    
     <>
          <section className="auth_flow_area d-flex align-items-center min-vh-100">
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
                     Submit and manage referrals with structured workflows, real-time status updates.
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
                    Stay connected with your team through real-time messaging, file sharing, and quick collaboration.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
              <p className="sign-pgp">Continuing Education Opportunities and opportunity to grow and provide the best patient care for your patients!</p>
              <p className="sign-pgp">Practice patient dashboard allows you to keep up with your patients at a glance or link to Instinct Shareville for a deeper dive!</p>
              </Col>
            </Row>

          </Col>

          {/* RIGHT SIDE */}
          <Col xl={6} className="auth_flow_right d-flex justify-content-center mt-xl-o mt-4">
            <Card className="auth_form_box   w-100  ">

              <Card.Body>


                <h5 className="fw-bold">Sign Up</h5>
                <p className="small text-muted">Enter your details to create an account.</p>
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

                  {/* NAME */}
                  <Form.Group className="mb-3">
                    <Form.Label className="justify-content-start gap-1 form-label">Full name <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Your Name" defaultValue=""/>
                  </Form.Group>

                  {/* EMAIL */}
                  <Form.Group className="mb-3">
                    <Form.Label className="justify-content-start gap-1 form-label">Email address <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" placeholder="Your Email" defaultValue=""/>
                  </Form.Group>

                  {/* Clinic / Practice name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="justify-content-start gap-1 form-label">Clinic / Practice name </Form.Label>
                    <Form.Control type="text" placeholder="Clinic / Practice name" defaultValue=""/>
                  </Form.Group>
                  
                  {/* Your referral ID */}
                  <Form.Group className="mb-3">
                    <Form.Label className="justify-content-start gap-1 form-label">Your referral ID </Form.Label>
                    <Form.Control type="text" placeholder="Your referral ID" defaultValue=""/>
                  </Form.Group>

                  {/* ✅ Phone (Working Library) */}
                    <Form.Group className="mb-4">
                      <Form.Label>Phone</Form.Label>

                      <PhoneInput
                        country={"us"}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputClass="form-control auth_phone_input"
                        buttonClass="auth_phone_dropdown"
                        containerClass="w-100"
                      />
                    </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="justify-content-start gap-1 form-label">Create Password <span className="text-danger">*</span></Form.Label>
                      <div className="form_bx">
                         <Form.Control
                      type={showPassword ? "text" : "password"}
                      className=""
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

                  {/* CONFIRM PASSWORD */}
                  <Form.Group className="mb-3 position-relative">
                    <Form.Label className="justify-content-start gap-1 form-label">Confirm Password <span className="text-danger">*</span></Form.Label>
                          <div className="form_bx">
                    <Form.Control type="password"
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

             
                  <Button className="auth_btn w-100 mt-3"  onClick={() => setShowReviewModal(true)}>
                    Sign Up
                  </Button>

                </Form>
              </Card.Body>

            </Card>
          </Col>

        </Row>
      </Container>
    </section>

      <ExternalCompleteModel   show={showReviewModal}
      handleClose={() => setShowReviewModal(false)}/>
     </>
  );
}