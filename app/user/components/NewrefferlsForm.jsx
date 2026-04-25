"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Row, Col, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ReferralConfirmModel from "./ReferralConfirmModel";

export function NewrefferlsForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
  const options = [
    {
      title: "Priority 1–2 · Emergency",
      desc: "Immediate ER/CC. Requires triage & stabilization",
      color: "red",
    },
    {
      title: "Priority 2–3 · Urgent",
      desc: "Stable but needs same-day review",
      color: "orange",
    },
    {
      title: "Priority 4 · Stable",
      desc: "Outpatient case",
      color: "green",
    },
    {
      title: "Info Only (No Referral)",
      desc: "Advice or follow-up",
      color: "blue",
    },
  ];

  const [selected, setSelected] = useState(options[0]);

  // 🔹 File Upload
  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowse = (e) => {
    handleFiles(e.target.files);
  };

  return (

    <>
    <div className="reffrel_form_area">

      <div className="form_card">
        <h5>Patient Details</h5>

        <Form>
          <Row className="g-3">

            <Col md={6}>
              <Form.Group>
                <Form.Label>Patient Name <span>*</span></Form.Label>
                <Form.Control placeholder="e.g., Buddy" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Owner Name <span>*</span></Form.Label>
                <Form.Control placeholder="e.g., Jane Doe" />
              </Form.Group>
            </Col>

            {/* 🔹 Phone */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pet Owner Phone Number <span>*</span></Form.Label>

                <PhoneInput
                  country={"us"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputClass="phone_input_custom"
                  containerClass="phone_container"
                />
              </Form.Group>
            </Col>

            {/* 🔥 CUSTOM URGENCY DROPDOWN */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Urgency <span>*</span></Form.Label>

                <div className="urgency_dropdown">

                  {/* head */}
                  <div className="dropdown_head" onClick={() => setOpen(!open)}>
                    <div className="left">
                      <span className={`dot ${selected.color}`}></span>
                      {selected.title}
                    </div>
                    <span className="arrow"></span>
                  </div>

                  {/* list */}
                  {open && (
                    <div className="dropdown_list">
                      {options.map((item, i) => (
                        <div
                          key={i}
                          className="dropdown_item"
                          onClick={() => {
                            setSelected(item);
                            setOpen(false);
                          }}
                        >
                          <div className="left">
                            <div>
<span className={`dot ${item.color}`}></span>
 <strong>{item.title}</strong>
                            </div>
                            
                            <div>
                             
                              <p>{item.desc}</p>
                            </div>
                          </div>

                           
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Preferred Specialty</Form.Label>
                <Form.Select>
                  <option>Critical Care</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Reason for Referral</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe reason for referral..."
                />
              </Form.Group>
            </Col>

          </Row>
        </Form>
      </div>

      {/* 🔹 Upload */}
      <div
        className="upload_area"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input type="file" multiple id="fileInput" hidden onChange={handleBrowse} />

        <img src="/icn/upload_icn.svg" alt="" />
        <p>Drop patient records or medical images here</p>
        <small>Max 5MB per file. (image/doc/pdf) supported.</small>

        <Button onClick={() => document.getElementById("fileInput").click()} className="commen_btn2">
          Browse Files
        </Button>

        <div className="preview_list">
          {files.map((file, i) => (
            <div key={i} className="file_item">
              {file.name}
            </div>
          ))}
        </div>
      </div>

      <div className="form_footer">
        <Button className="kinnect-btn-secondary">Cancel</Button>
<Button
  className="kinnect-btn-primary "
  onClick={() => setShowConfirm(true)}
>
  Submit Referral
</Button>
      </div>

    </div>
   <ReferralConfirmModel
  show={showConfirm}
  handleClose={() => setShowConfirm(false)}
  handleConfirm={() => {
    setShowConfirm(false);
    router.push("/user/referrals");
  }}
/>
    </>
    
    
  );
}
