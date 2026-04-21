"use client";
import "../../../user/user.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import SignupUnderReviewModal  from "../../Componants/Signup_underreview_model";

function page() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
const [showReviewModal, setShowReviewModal] = useState(false);
  return (
    <>
      <section className="auth_flow_area d-flex align-items-center min-vh-100">
        <Container fluid>
          <Row>
            
            {/* LEFT SIDE */}
            <Col xl={6} className="auth_flow_left d-flex flex-column justify-content-center px-xl-5 px-0">
              <img src="/logo_big.svg" alt="logo" className="logo" />
              <h1 className="auth_title">
                Elevating Veterinary <br />
                <span className="text-danger">Communication.</span>
              </h1>

              <p className="auth_subtitle text-muted mt-3">
                Join Kinnect for communication, collaboration, and referrals.
              </p>

              <Row className="mt-4 g-3">
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
              </Row>
            </Col>

            {/* RIGHT SIDE */}
            <Col xl={6} className="auth_flow_right d-flex justify-content-center mt-xl-0 mt-4">
              <Card className="auth_form_box w-100">
                <Card.Body>

                  <h5 className="fw-bold">Complete Your Profile</h5>
                  <p className="small text-muted">
                    Enter your details to activate your secure account.
                  </p>

                  <Form>

                    {/* Profile Upload */}
                    <div className="profile_upload text-center mb-4">
                      <div className="upload_circle mx-auto">
                        <img src="/icn/user_icn.svg" alt="" />
                      </div>
                      <p className="small mt-2">Upload Profile Photo</p>
                    </div>

                    {/* Name */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control type="text" placeholder="Your Name" />
                    </Form.Group>

                    {/* Role */}
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control type="text" defaultValue="Doctor" />
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

                    {/* Button */}
                    <Button
                      className="auth_btn w-100"
                onClick={() => setShowReviewModal(true)}
                    >
                      Continue to Dashboard
                    </Button>

                  </Form>

                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>
      <SignupUnderReviewModal   show={showReviewModal}
  handleClose={() => setShowReviewModal(false)}/>
    </>
  );
}

export default page;  