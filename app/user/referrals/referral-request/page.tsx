"use client";

import Image from "next/image";
import { useState } from "react";
import MoveReferralModal from "../../components/MoveReferralModal";

const timelineSteps = [
  {
    title: "Referral Created",
    time: "Oct 12, 10:45 AM",
    badge: "Dr. James Sterling",
    active: true,
  },
  {
    title: "Received",
    time: "Oct 12, 11:15 AM",
    active: true,
  },
  {
    title: "Claimed",
    time: "Oct 12, 2:30 PM",
    badge: "In Progress",
    active: true,
    badgeDark: true,
  },
  {
    title: "In Review",
    time: "Pending Action",
    active: false,
  },
  {
    title: "Accepted",
    active: false,
  },
];

export default function Page() {
  const [showMoveModal, setShowMoveModal] = useState(false);

  return (
    <>
      <section className="referral_request_page">
        <div className="referral_request_layout">
          <div className="referral_request_main">
            <div className="referral_request_top">
              <article className="referral_request_card referral_request_card--white">
                <h3>Patient Information</h3>
                <h4>Luna</h4>

                <div className="referral_request_badge">High</div>

                <div className="referral_request_meta">
                  <span>Referred On</span>
                  <strong>Oct 12, 2023</strong>
                </div>
              </article>

              <article className="referral_request_card referral_request_card--blue">
                <h3>Owner Information</h3>
                <h4>Sarah Miller</h4>

                <div className="referral_request_contact">
                  <span className="referral_request_contact_icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M9.8875 10.5C8.67222 10.5 7.47153 10.2351 6.28542 9.70521C5.09931 9.17535 4.02014 8.4243 3.04792 7.45208C2.07569 6.47986 1.32465 5.40069 0.794792 4.21458C0.264931 3.02847 0 1.82778 0 0.6125C0 0.4375 0.0583333 0.291667 0.175 0.175C0.291667 0.0583333 0.4375 0 0.6125 0H2.975C3.11111 0 3.23264 0.0461806 3.33958 0.138542C3.44653 0.230903 3.50972 0.340278 3.52917 0.466667L3.90833 2.50833C3.92778 2.66389 3.92292 2.79514 3.89375 2.90208C3.86458 3.00903 3.81111 3.10139 3.73333 3.17917L2.31875 4.60833C2.51319 4.96806 2.7441 5.31562 3.01146 5.65104C3.27882 5.98646 3.57292 6.30972 3.89375 6.62083C4.19514 6.92222 4.51111 7.20174 4.84167 7.45937C5.17222 7.71701 5.52222 7.95278 5.89167 8.16667L7.2625 6.79583C7.35 6.70833 7.46424 6.64271 7.60521 6.59896C7.74618 6.55521 7.88472 6.54306 8.02083 6.5625L10.0333 6.97083C10.1694 7.00972 10.2812 7.08021 10.3687 7.18229C10.4562 7.28437 10.5 7.39861 10.5 7.525V9.8875C10.5 10.0625 10.4417 10.2083 10.325 10.325C10.2083 10.4417 10.0625 10.5 9.8875 10.5ZM1.76458 3.5L2.72708 2.5375L2.47917 1.16667H1.18125C1.22986 1.56528 1.29792 1.95903 1.38542 2.34792C1.47292 2.73681 1.59931 3.12083 1.76458 3.5ZM6.98542 8.72083C7.36458 8.88611 7.75104 9.01736 8.14479 9.11458C8.53854 9.21181 8.93472 9.275 9.33333 9.30417V8.02083L7.9625 7.74375L6.98542 8.72083Z" fill="#033E4F"/>
                    </svg>
                  </span>
                  <span>(555) 123-4567</span>
                </div>
              </article>
            </div>

            <article className="referral_request_card referral_request_card--white referral_request_reason">
              <h3>Reason for Referral</h3>
              <p>
                Initial examination at referral clinic showed a Grade III/VI systolic murmur localized
                to the left apex. ECG revealed intermittent ventricular premature contractions. Blood
                work (CBC/Chem) within normal limits for age and breed, however NT-proBNP was
                significantly elevated (1800 pmol/L).
              </p>
            </article>

            <section className="referral_request_media">
              <h5>Attached Media</h5>
              <div className="referral_request_media_grid">
                <Image
                  src="/icn/xray.png"
                  alt="X-ray attachment"
                  width={140}
                  height={112}
                />
                <Image
                  src="/icn/sample.png"
                  alt="Additional attachment"
                  width={140}
                  height={112}
                />
              </div>
            </section>
          </div>

          <aside className="referral_request_sidebar">
            <div className="referral_request_card referral_request_card--blue referral_request_timeline">
              <div className="referral_request_timeline_header">
                <h3>Status Timeline</h3>
                <span aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M6.125 10.2083H7.29167V6.70833H6.125V10.2083ZM6.70833 5.54167C6.87361 5.54167 7.01215 5.48576 7.12396 5.37396C7.23576 5.26215 7.29167 5.12361 7.29167 4.95833C7.29167 4.79306 7.23576 4.65451 7.12396 4.54271C7.01215 4.4309 6.87361 4.375 6.70833 4.375C6.54306 4.375 6.40451 4.4309 6.29271 4.54271C6.1809 4.65451 6.125 4.79306 6.125 4.95833C6.125 5.12361 6.1809 5.26215 6.29271 5.37396C6.40451 5.48576 6.54306 5.54167 6.70833 5.54167ZM6.70833 14C5.73958 14 4.82812 13.8161 3.97396 13.4483C3.11979 13.0806 2.37674 12.5816 1.74479 11.9513C1.11285 11.321 0.613889 10.5794 0.247917 9.72656C-0.118056 8.8737 -0.300347 7.96354 -0.299999 6.99609C-0.299652 6.02865 -0.116319 5.11849 0.25 4.26563C0.616319 3.41276 1.11562 2.67118 1.74792 2.04089C2.38021 1.41059 3.12326 0.911675 3.97708 0.544141C4.8309 0.176606 5.74167 -0.00668401 6.70938 0.00018775C7.67708 0.00705951 8.58785 0.19035 9.44167 0.550063C10.2955 0.909776 11.0385 1.40869 11.6708 2.04681C12.3031 2.68494 12.8021 3.42738 13.1677 4.27414C13.5333 5.12091 13.7156 6.03051 13.7146 7.00295C13.7135 7.97539 13.5302 8.88611 13.1646 9.7351C12.799 10.5841 12.3 11.3257 11.6677 11.9599C11.0354 12.5941 10.2924 13.0931 9.43854 13.4568C8.58472 13.8205 7.67465 14.0016 6.70833 14ZM6.70833 12.8333C8.30625 12.8333 9.66016 12.2781 10.7701 11.1677C11.88 10.0573 12.4347 8.70295 12.434 7.10458C12.4333 5.50622 11.8781 4.1523 10.7682 3.04283C9.65833 1.93335 8.30417 1.37861 6.70573 1.37861C5.10729 1.37861 3.75339 1.93379 2.64396 3.04414C1.53453 4.15449 0.979819 5.50885 0.979819 7.10724C0.979819 8.70562 1.535 10.0595 2.64535 11.1689C3.75569 12.2784 5.11002 12.8332 6.70833 12.8333Z"
                      fill="#033E4F"
                    />
                  </svg>
                </span>
              </div>

              <div className="referral_request_timeline_list">
                {timelineSteps.map((step) => (
                  <div
                    key={step.title}
                    className={`referral_request_timeline_item${
                      step.active ? " is-active" : ""
                    }`}
                  >
                    <span className="referral_request_timeline_dot" aria-hidden="true" />
                    <div className="referral_request_timeline_content">
                      <h6>{step.title}</h6>
                      {step.time ? <p>{step.time}</p> : null}
                      {step.badge ? (
                        <span
                          className={`referral_request_timeline_badge${
                            step.badgeDark ? " referral_request_timeline_badge--dark" : ""
                          }`}
                        >
                          {step.badge}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="kinnect-btn-primary"
              onClick={() => setShowMoveModal(true)}
            >
              <span>Accept Referral</span>
              <span className="referral_request_accept_icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M5.54167 10.0728L2.26042 6.79158L3.08542 5.96658L5.54167 8.41658L10.9146 3.04367L11.7396 3.8745L5.54167 10.0728Z"
                    fill="#E4432D"
                  />
                </svg>
              </span>
            </button>
          </aside>
        </div>
      </section>

      <MoveReferralModal
        show={showMoveModal}
        handleClose={() => setShowMoveModal(false)}
        currentStage="Current"
        nextStage="Next"
      />
    </>
  );
}
