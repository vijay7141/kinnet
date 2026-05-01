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
              <div>
                <h3>Reason for Referral</h3>
                <p>
                  Initial examination at referral clinic showed a Grade III/VI systolic murmur localized
                  to the left apex. ECG revealed intermittent ventricular premature contractions. Blood
                  work (CBC/Chem) within normal limits for age and breed, however NT-proBNP was
                  significantly elevated (1800 pmol/L).
                </p>
              </div>

              <div className="quick_card2">
            <h6>Quick Referral Context</h6>
                <div className="quick_card2_inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" fill="#D9D9D9" fill-opacity="0.01"/>
                        <path d="M10 18.5C9.45 18.5 8.97917 18.3042 8.5875 17.9125C8.19583 17.5208 8 17.05 8 16.5C8 15.95 8.19583 15.4792 8.5875 15.0875C8.97917 14.6958 9.45 14.5 10 14.5C10.55 14.5 11.0208 14.6958 11.4125 15.0875C11.8042 15.4792 12 15.95 12 16.5C12 17.05 11.8042 17.5208 11.4125 17.9125C11.0208 18.3042 10.55 18.5 10 18.5V18.5M8 12.5V0.5H12V12.5H8V12.5" fill="#9CEDED"/>
                      </svg>
                      <div className="content">
                        <p>Referred by Dr. Aris Thorne</p>
                        <span>Urgency: Emergency</span>
                      </div>

                </div>
                 <div className="quick_card2_inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_1277_6777)">
                          <path d="M15.8333 0.833252H4.16667C3.062 0.834575 2.00296 1.27399 1.22185 2.0551C0.440735 2.83622 0.00132321 3.89526 0 4.99992L0 14.9999C0.00132321 16.1046 0.440735 17.1636 1.22185 17.9447C2.00296 18.7259 3.062 19.1653 4.16667 19.1666H15.8333C16.938 19.1653 17.997 18.7259 18.7782 17.9447C19.5593 17.1636 19.9987 16.1046 20 14.9999V4.99992C19.9987 3.89526 19.5593 2.83622 18.7782 2.0551C17.997 1.27399 16.938 0.834575 15.8333 0.833252V0.833252ZM4.16667 2.49992H15.8333C16.3323 2.5009 16.8196 2.65118 17.2325 2.93142C17.6453 3.21166 17.9649 3.60904 18.15 4.07242L11.7683 10.4549C11.2987 10.9227 10.6628 11.1853 10 11.1853C9.33715 11.1853 8.70131 10.9227 8.23167 10.4549L1.85 4.07242C2.03512 3.60904 2.35468 3.21166 2.76754 2.93142C3.1804 2.65118 3.66768 2.5009 4.16667 2.49992V2.49992ZM15.8333 17.4999H4.16667C3.50363 17.4999 2.86774 17.2365 2.3989 16.7677C1.93006 16.2988 1.66667 15.663 1.66667 14.9999V6.24992L7.05333 11.6333C7.83552 12.4135 8.89521 12.8516 10 12.8516C11.1048 12.8516 12.1645 12.4135 12.9467 11.6333L18.3333 6.24992V14.9999C18.3333 15.663 18.0699 16.2988 17.6011 16.7677C17.1323 17.2365 16.4964 17.4999 15.8333 17.4999Z" fill="#9CEDED"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1277_6777">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="content">
                        <p>Email</p>
                        <span>aris_thorne@gmail.com</span>
                      </div> 
                </div>
                <div className="quick_card2_inner">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_1277_4298)">
                          <path d="M10.833 0.833444C10.833 0.61243 10.9208 0.400468 11.0771 0.244188C11.2333 0.0879075 11.4453 0.000110103 11.6663 0.000110103C13.8757 0.00253643 15.9939 0.881289 17.5562 2.44357C19.1185 4.00584 19.9972 6.12405 19.9996 8.33344C19.9996 8.55446 19.9118 8.76642 19.7556 8.9227C19.5993 9.07898 19.3873 9.16678 19.1663 9.16678C18.9453 9.16678 18.7333 9.07898 18.577 8.9227C18.4208 8.76642 18.333 8.55446 18.333 8.33344C18.331 6.56594 17.628 4.8714 16.3782 3.62159C15.1283 2.37178 13.4338 1.66876 11.6663 1.66678C11.4453 1.66678 11.2333 1.57898 11.0771 1.4227C10.9208 1.26642 10.833 1.05446 10.833 0.833444V0.833444ZM11.6663 5.00011C12.5504 5.00011 13.3982 5.3513 14.0233 5.97642C14.6485 6.60154 14.9996 7.44939 14.9996 8.33344C14.9996 8.55446 15.0874 8.76642 15.2437 8.9227C15.4 9.07898 15.612 9.16678 15.833 9.16678C16.054 9.16678 16.266 9.07898 16.4222 8.9227C16.5785 8.76642 16.6663 8.55446 16.6663 8.33344C16.665 7.00777 16.1378 5.73677 15.2004 4.79937C14.263 3.86198 12.992 3.33477 11.6663 3.33344C11.4453 3.33344 11.2333 3.42124 11.0771 3.57752C10.9208 3.7338 10.833 3.94576 10.833 4.16678C10.833 4.38779 10.9208 4.59975 11.0771 4.75603C11.2333 4.91231 11.4453 5.00011 11.6663 5.00011V5.00011ZM19.2438 13.9493C19.7267 14.4335 19.9979 15.0895 19.9979 15.7734C19.9979 16.4574 19.7267 17.1134 19.2438 17.5976L18.4855 18.4718C11.6605 25.0059 -4.94783 8.40178 1.48549 1.55511L2.44383 0.721777C2.92863 0.252341 3.57877 -0.007349 4.25358 -0.00111086C4.92839 0.00512727 5.57361 0.276792 6.04966 0.75511C6.07549 0.780944 7.61965 2.78678 7.61965 2.78678C8.07784 3.26813 8.33291 3.90755 8.33182 4.57211C8.33073 5.23667 8.07358 5.87525 7.61382 6.35511L6.64882 7.56844C7.18286 8.86604 7.96804 10.0453 8.95924 11.0385C9.95045 12.0317 11.1281 12.8193 12.4246 13.3559L13.6455 12.3851C14.1254 11.9257 14.7639 11.6689 15.4282 11.6679C16.0926 11.667 16.7318 11.9221 17.213 12.3801C17.213 12.3801 19.218 13.9234 19.2438 13.9493ZM18.0971 15.1609C18.0971 15.1609 16.103 13.6268 16.0771 13.6009C15.9055 13.4307 15.6735 13.3352 15.4317 13.3352C15.19 13.3352 14.958 13.4307 14.7863 13.6009C14.7638 13.6243 13.083 14.9634 13.083 14.9634C12.9697 15.0536 12.8349 15.1127 12.6919 15.1349C12.5488 15.1571 12.4024 15.1417 12.2671 15.0901C10.5875 14.4648 9.06193 13.4857 7.79368 12.2193C6.52543 10.953 5.54416 9.4288 4.91632 7.75011C4.86066 7.61299 4.84251 7.46352 4.86374 7.31706C4.88498 7.1706 4.94483 7.03244 5.03716 6.91678C5.03716 6.91678 6.37632 5.23511 6.39882 5.21344C6.56904 5.04177 6.66455 4.80979 6.66455 4.56803C6.66455 4.32626 6.56904 4.09429 6.39882 3.92261C6.37299 3.89761 4.83882 1.90178 4.83882 1.90178C4.66457 1.74553 4.43716 1.66186 4.2032 1.6679C3.96923 1.67394 3.74644 1.76925 3.58049 1.93428L2.62216 2.76761C-2.0795 8.42094 12.313 22.0151 17.2671 17.3334L18.0263 16.4584C18.2042 16.2937 18.3111 16.0662 18.3243 15.824C18.3375 15.5819 18.256 15.3441 18.0971 15.1609V15.1609Z" fill="#9CEDED"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1277_4298">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="content">
                        <p>Phone</p>
                        <span>+1 (555) 012-3456</span>
                      </div> 
                </div>
    
          </div>
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
