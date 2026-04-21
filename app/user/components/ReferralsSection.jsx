"use client";
import React, { useState } from "react";

export default function ReferralsSection() {
  const [open, setOpen] = useState(false);

  return (

    <>
    <div className="col-xl-12">
    <div className="_referrals_list_wrap">

      {!open && (
        <div className="_referrals_list_wrap_inside">
 <div className="ref_summary_card" onClick={() => setOpen(true)}>
               <div className="image">
                <img src="/icn/no_referrals.svg" alt="" />
               </div>
          <h4>No referrals available yet.</h4>
        </div>
        </div>
       
      )}

      {open && (
        <div className="_referrals_list">
          <div className="ref_scroll">

            {/* Incoming */}
            <div className="ref_col">
              <h6>Incoming</h6>

              <div className="ref_card">
                <div className="ref_top">
                  <span className="badge red">Priority 1-2</span>
                  <span className="dots"><img src="/icn/drag_dot.svg" alt="" /></span>
                </div>
                <span className="time">2h ago</span>
                <h5>Luna</h5>
                <p>Sarah Miller</p>
                <button className="btn claim_btn"><img src="/icn/clame_icn.svg" alt="" />Claim Case</button>
              </div>

              <div className="ref_card">
                <div className="ref_top">
                  <span className="badge red">Priority 1-2</span>
                         <span className="dots"><img src="/icn/drag_dot.svg" alt="" /></span>
                </div>
                <span className="time">4h ago</span>
                <h5>Cooper</h5>
                <p>John Wick</p>
                <button className="btn claim_btn"><img src="/icn/clame_icn.svg" alt="" />Claim Case</button>
              </div>
            </div>

            {/* Claimed */}
            <div className="ref_col">
              <h6>Claimed</h6>

              <div className="ref_card">
                <div className="ref_top">
                  <span className="badge orange">Priority 2-3</span>
                        <span className="dots"><img src="/icn/drag_dot.svg" alt="" /></span>
                </div>
                <span className="time">6h ago</span>
                <h5>Bella</h5>
                <p>Maria Garcia</p>
                <div className="extra"> <img src="/icn/doc_img.svg" alt="" />Claimed by Dr. Aris</div>
              </div>
            </div>

            {/* Review */}
            <div className="ref_col">
              <h6>In Review</h6>

              <div className="ref_card">
                <div className="ref_top">
                  <span className="badge green">Priority 4</span>
                         <span className="dots"><img src="/icn/drag_dot.svg" alt="" /></span>
                </div>
                <span className="time">1h ago</span>
                <h5>Oliver</h5>
                <p>David Chen</p>
                <div className="status review">Review in process</div>
              </div>
            </div>

            {/* Accepted */}
            <div className="ref_col">
              <h6>Accepted</h6>

              <div className="ref_card">
                <div className="ref_top">
                  <span className="badge blue">Info Only</span>
                         <span className="dots"><img src="/icn/drag_dot.svg" alt="" /></span>
                </div>
                <span className="time">Yesterday</span>
                <h5>Max</h5>
                <p>Emily Blunt</p>
                <div className="status accepted">Accepted</div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="ref_col">
              <h6>Confirmed</h6>

              <div className="ref_card muted">
               
                      <div className="ref_top"> <span className="time">2d ago</span><span className="dots"><img alt="" src="/icn/drag_dot.svg" /></span></div>
                <h5>Milo</h5>
                <p>Chris Evans</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
    </div>
    
    </>

  );
}