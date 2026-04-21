"use client";
import Link from "next/link";
import React ,{ useState } from "react"; 
import SendSMSModel from "../../components/SendSMSModel";
import SMSSuccessModal from "../../components/SMSSuccessModal";
import ChatWidget from "../../components/ChatWidget";

export default function ReferralsDetails() {
   const [showSMS, setShowSMS] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
  return (
    <>
    <div className="ref_details_exact2">

      {/* HEADER */}
      <div className="das_area_inner">
        <div>
          <h2 className="dashboard_title">New Referral</h2>
          <p className="dashboard_sub">Cooper</p>
        </div>

        <div className="sec">
          <button className="commen_btn2">Update</button>
          <button className="commen_btn">
            <img src="/icn/edit_icn.svg" alt="" />
            Edit Case
          </button>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="timeline_box2">
        <div className="timeline_header">
          <h6>Status Timeline</h6>
          <span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M5.25 8.74951H6.41667V5.24951H5.25V8.74951V8.74951M5.83333 4.08285C5.99861 4.08285 6.13715 4.02694 6.24896 3.91514C6.36076 3.80333 6.41667 3.66479 6.41667 3.49951C6.41667 3.33423 6.36076 3.19569 6.24896 3.08389C6.13715 2.97208 5.99861 2.91618 5.83333 2.91618C5.66806 2.91618 5.52951 2.97208 5.41771 3.08389C5.3059 3.19569 5.25 3.33423 5.25 3.49951C5.25 3.66479 5.3059 3.80333 5.41771 3.91514C5.52951 4.02694 5.66806 4.08285 5.83333 4.08285V4.08285M5.83333 11.6662C5.02639 11.6662 4.26806 11.5131 3.55833 11.2068C2.84861 10.9006 2.23125 10.4849 1.70625 9.95993C1.18125 9.43493 0.765625 8.81757 0.459375 8.10785C0.153125 7.39812 0 6.63979 0 5.83285C0 5.0259 0.153125 4.26757 0.459375 3.55785C0.765625 2.84812 1.18125 2.23076 1.70625 1.70576C2.23125 1.18076 2.84861 0.765137 3.55833 0.458887C4.26806 0.152637 5.02639 -0.000488281 5.83333 -0.000488281C6.64028 -0.000488281 7.39861 0.152637 8.10833 0.458887C8.81806 0.765137 9.43542 1.18076 9.96042 1.70576C10.4854 2.23076 10.901 2.84812 11.2073 3.55785C11.5135 4.26757 11.6667 5.0259 11.6667 5.83285C11.6667 6.63979 11.5135 7.39812 11.2073 8.10785C10.901 8.81757 10.4854 9.43493 9.96042 9.95993C9.43542 10.4849 8.81806 10.9006 8.10833 11.2068C7.39861 11.5131 6.64028 11.6662 5.83333 11.6662V11.6662M5.83333 10.4995C7.13611 10.4995 8.23958 10.0474 9.14375 9.14326C10.0479 8.2391 10.5 7.13562 10.5 5.83285C10.5 4.53007 10.0479 3.42659 9.14375 2.52243C8.23958 1.61826 7.13611 1.16618 5.83333 1.16618C4.53056 1.16618 3.42708 1.61826 2.52292 2.52243C1.61875 3.42659 1.16667 4.53007 1.16667 5.83285C1.16667 7.13562 1.61875 8.2391 2.52292 9.14326C3.42708 10.0474 4.53056 10.4995 5.83333 10.4995V10.4995M5.83333 5.83285V5.83285V5.83285V5.83285V5.83285V5.83285V5.83285V5.83285V5.83285V5.83285" fill="#033E4F"/>
</svg></span>
        </div>

        <div className="timeline_steps">
          <div className="step active">
            <span></span>
            <div className="content">
                <p>Referral Created</p>
            <small>Oct 12, 10:45 AM</small>
              <span>Dr. James Sterling</span>
            </div>
          </div>

          <div className="step active">
            <span></span>
           <div className="content">
               <p>Received</p>
            <small>Oct 12, 11:15 AM</small>
           </div>
          </div>

          <div className="step active">
            <span></span>
           <div className="content">
                <p>Claimed</p>
            <small>Oct 12, 2:30 PM</small>
              <span className="colored">Dr. Sarah Jenkins</span>

           </div>
          </div>

          <div className="step">
            <span></span>
            <div className="content">
                <p>In Review</p>
            </div>
          </div>

          <div className="step">
            <span></span>
            <div className="content">
                <p>Accepted</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="row g-4 mt-1">

        {/* LEFT */}
        <div className="col-xl-4">
          <div className="left_card">

            <h4>Cooper</h4>

            <div className="flex_row">
              <div className="left_inside_bx">
                 <div className="left_inside_in">
                              <span>Species </span>
                <button><img src="/icn/red_edit_icn.svg" alt="" /></button>
                 </div>
                <p>Persian Cat</p>
              </div>
              <div className="left_inside_bx">
              
                 <div className="left_inside_in">
                              <span>Age </span>
                <button><img src="/icn/red_edit_icn.svg" alt="" /></button>
                 </div>
                <p>4 Years</p>
              </div>
            </div>

            <div className="flex_row">
                <div className="left_inside_bx">
   
        <div className="left_inside_in">
                              <span>Sex </span>
                <button><img src="/icn/red_edit_icn.svg" alt="" /></button>
                 </div>
  
              <p>Male</p></div>
                 
             
            </div>

           

            <div className="owner">
                <div className="owner_inner">
                     <p className="label">Owner Contact</p> 
                     <button className="sms_btn" onClick={() => setShowSMS(true)}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M3.5 5.25C3.66528 5.25 3.80382 5.1941 3.91563 5.08229C4.02743 4.97049 4.08333 4.83194 4.08333 4.66667C4.08333 4.50139 4.02743 4.36285 3.91563 4.25104C3.80382 4.13924 3.66528 4.08333 3.5 4.08333C3.33472 4.08333 3.19618 4.13924 3.08437 4.25104C2.97257 4.36285 2.91667 4.50139 2.91667 4.66667C2.91667 4.83194 2.97257 4.97049 3.08437 5.08229C3.19618 5.1941 3.33472 5.25 3.5 5.25ZM5.83333 5.25C5.99861 5.25 6.13715 5.1941 6.24896 5.08229C6.36076 4.97049 6.41667 4.83194 6.41667 4.66667C6.41667 4.50139 6.36076 4.36285 6.24896 4.25104C6.13715 4.13924 5.99861 4.08333 5.83333 4.08333C5.66806 4.08333 5.52951 4.13924 5.41771 4.25104C5.3059 4.36285 5.25 4.50139 5.25 4.66667C5.25 4.83194 5.3059 4.97049 5.41771 5.08229C5.52951 5.1941 5.66806 5.25 5.83333 5.25ZM8.16667 5.25C8.33194 5.25 8.47049 5.1941 8.58229 5.08229C8.6941 4.97049 8.75 4.83194 8.75 4.66667C8.75 4.50139 8.6941 4.36285 8.58229 4.25104C8.47049 4.13924 8.33194 4.08333 8.16667 4.08333C8.00139 4.08333 7.86285 4.13924 7.75104 4.25104C7.63924 4.36285 7.58333 4.50139 7.58333 4.66667C7.58333 4.83194 7.63924 4.97049 7.75104 5.08229C7.86285 5.1941 8.00139 5.25 8.16667 5.25ZM0 11.6667V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H10.5C10.8208 0 11.0955 0.114236 11.324 0.342708C11.5524 0.571181 11.6667 0.845833 11.6667 1.16667V8.16667C11.6667 8.4875 11.5524 8.76215 11.324 8.99063C11.0955 9.2191 10.8208 9.33333 10.5 9.33333H2.33333L0 11.6667ZM1.8375 8.16667H10.5V1.16667H1.16667V8.82292L1.8375 8.16667ZM1.16667 8.16667V1.16667V8.16667Z" fill="white"/>
</svg>Send SMS</button>
                </div>
             <div className="orner_mn_bx">
                <img src="/icn/orner_icn.svg" alt="" />
                <div className="content">
                     <h6>Sarah Johnson</h6>
              <small>+1 (555) 012-3456</small>
                </div>
             </div>
             
            </div>
            <div className="form_bx d-block mt-3">
<label htmlFor="" className="mb-1">Preferred Specialty</label>
            <select>
              <option>Critical Care</option>
            </select>
            </div>
       <div className="form_bx d-block">
<label htmlFor="" className="mb-1">Assign To</label>

            <select>
              <option>Select Staff Member</option>
            </select>
            </div>
   

          </div>

          <div className="quick_card2">
            <h6>Quick Referral Context</h6>
                <div className="quick_card2_inner">
                      <img src="/icn/i_icn.svg" alt="" />
                      <div className="content">
                        <p>Referred by Dr. Aris Thorne</p>
                        <span>Urgency: Priority 1–2 · Emergency</span>
                      </div>
                      <img src="/icn/meassege_new.svg" alt="" />

                </div>
                 <div className="quick_card2_inner">
                      <img src="/icn/calender_new.svg" alt="" />
                      <div className="content">
                        <p>Accepted on Oct 24, 2023</p>
                        <span>Appt scheduled for Oct 27</span>
                      </div> 

                </div>
    
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-xl-8">

          <div className="status_box2">
            <img src="/icn/round_check1.svg" alt="" />
             <div className="content">
                      <h6>Status: Accepted</h6>
            <p>
              The cardiac oncology specialist has accepted this referral and reviewed the records.
            </p>
             </div>
          </div>

          <div className="notes_card2">
            <div className="notes_header">Clinical Notes <img src="/icn/red_edit_icn.svg" alt=""></img></div>
<div className="status_box2_inner">
       <div className="note_block">
              <span>Reason For Referral</span>
              <p>
              Patient presents with Grade 3/6 systolic heart murmur and intermittent syncope. Previous echo shows mitral valve thickening. Specialist review required for comprehensive cardiac staging and long-term management plan.
              </p>
            </div>

            <div className="note_block">
              <span>Tentative Diagnosis</span>
              <p>Tentative Diagnosis</p>
            </div>
        <div className="note_block">
              <span>Attached Media</span> 
            </div>
            <div className="media_grid">
                
              <img src="/icn/xray.png" alt="" />
              <img src="/icn/sample.png" alt="" />
              <div className="upload_box2">
                <img src="/icn/camera_icn.svg" alt="" />
                Add File</div>
            </div>
</div>
         

          </div>

        </div>
      </div>

    </div>

 <SendSMSModel
  show={showSMS}
  handleClose={() => setShowSMS(false)}
  handleSuccessOpen={() => setShowSuccess(true)}
/>

        <SMSSuccessModal
  show={showSuccess}
  handleClose={() => setShowSuccess(false)}
/>
<ChatWidget />
    </>
    

  );
}