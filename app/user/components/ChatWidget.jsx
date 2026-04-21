"use client";
import React from "react";

export default function ReferralChat() {
  return (
    <div className="ref_chat_wrap">
      <div className="ref_chat_card">

        {/* Header */}
        <div className="ref_chat_header">
          <div className="ref_chat_user">
             <div className="image">
               <img src="/icn/Dr.Sarah.svg" alt="" />
             </div>
            <div>
              <h6>Dr. Sarah Jenkins <svg xmlns="http://www.w3.org/2000/svg" width="6" height="11" viewBox="0 0 6 11" fill="none">
  <path d="M4.72185 3.6606L1.27935 0.218094C1.13883 0.0784062 0.948738 0 0.750599 0C0.552459 0 0.362371 0.0784062 0.221849 0.218094C0.151552 0.287817 0.0957569 0.370767 0.0576804 0.462162C0.0196039 0.553556 0 0.651586 0 0.750594C0 0.849603 0.0196039 0.947633 0.0576804 1.03903C0.0957569 1.13042 0.151552 1.21337 0.221849 1.28309L3.67185 4.7181C3.74215 4.78782 3.79794 4.87077 3.83602 4.96216C3.87409 5.05356 3.8937 5.15159 3.8937 5.2506C3.8937 5.3496 3.87409 5.44763 3.83602 5.53903C3.79794 5.63042 3.74215 5.71337 3.67185 5.7831L0.221849 9.2181C0.080621 9.35833 0.000884937 9.54892 0.000181675 9.74794C-0.000521587 9.94697 0.0778661 10.1381 0.218099 10.2793C0.358333 10.4206 0.548924 10.5003 0.747947 10.501C0.94697 10.5017 1.13812 10.4233 1.27935 10.2831L4.72185 6.8406C5.1432 6.41872 5.37987 5.84685 5.37987 5.2506C5.37987 4.65434 5.1432 4.08247 4.72185 3.6606V3.6606Z" fill="#374957"/>
</svg></h6>
              <span>Available</span>
            </div>
          </div>

          <div className="ref_chat_actions">
            <img src="/icn/audiocall_icn.svg" alt="" />
            <img src="/icn/videocall_icn.svg" alt="" />
          </div>

          <div className="ref_chat_close">×</div>
        </div>

        {/* Body */}
        <div className="ref_chat_body">

          <div className="ref_chat_date"><span>TODAY, OCTOBER 24</span></div>

          {/* LEFT */}
          <div className="ref_msg left">
                          <img src="/icn/Dr.Sarah.svg" alt="" />
            <div>
              <div className="ref_msg_head">
                <b>Dr. Sarah Jenkins </b>
                <span>10:42 AM</span>
              </div>
              <div className="ref_msg_box">
                I’ve reviewed Buddy's latest blood work. His liver enzymes are slightly elevated, but consistent with his current medication protocol.
              </div>
            </div>
          </div>

          {/* LEFT */}
          <div className="ref_msg left">
                        <img src="/icn/Dr.Sarah.svg" alt="" />
            <div>
              <div className="ref_msg_head">
                <b>Dr. Sarah Jenkins</b>
                <span>10:42 AM</span>
              </div>
              <div className="ref_msg_box">
                Yes, everything looks stable. Here is the comprehensive report and the referral history CSV for the records.
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="ref_msg right">
            <div>
              <div className="ref_msg_head right">
                <span>11:30 AM</span>
                <b>Me</b>
              </div>
              <div className="ref_msg_box dark">
                Thanks for sharing
              </div>
              <div className="ref_read"><img src="/icn/read_icn.svg" alt="" /> Read</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="ref_chat_footer">
          <button className="ref_plus"><img src="/icn/plus_icn1.svg" alt="" /></button>
          <input placeholder="Type a message..." />
          <button className="ref_send"><img src="/icn/send_icn.svg" alt="" /></button>
        </div>

      </div>
    </div>
  );
}