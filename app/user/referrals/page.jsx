"use client";
import React, { useState, forwardRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import StatsCard from "../components/StatsCard";
import ReferralsSection from "../components/ReferralsSection";
import Link from "next/link";

/* 🔹 Custom Input (FULL BOX CLICKABLE) */
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className="filter_box" onClick={onClick} ref={ref}>
    <span>{value || "Filter By Date"}</span>
    <img src="/icn/calender_icn.svg" alt="" />
  </div>
));

const Referrals = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
      {/* 🔹 Header */}
      <div className="das_area_inner">

        <div className="first">
          <h2 className="dashboard_title">Referrals</h2>
        </div>

        <div className="sec">

          {/* 🔹 Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            customInput={<CustomInput />}
            popperPlacement="bottom-end"
          />

          {/* 🔹 Buttons */}
          <button
            className="commen_btn2"
            onClick={() => console.log("Sync API call")}
          >
            <img src="/icn/sync_icn.svg" alt="" />
            Sync with Instinct
          </button>

          <button
            className="commen_btn" 
          >
            <Link href="/user/referrals/new-referral">
                 <img src="/icn/plus_icn.svg" alt="" />
            New Referral
            </Link>
       
          </button>

        </div>
      </div>

      {/* 🔹 Stats */}
      <div className="row g-3">
        <StatsCard />
      </div>

      {/* 🔹 List */}
      <div className="row">
        <ReferralsSection filterDate={selectedDate} />
      </div>
    </>
  );
};

export default Referrals;