import Link from "next/link";
import TestimonialsSlider from "./Components/TestimonialsSlider";
import Header from "./Components/Header/header";
import Footer from "./Components/Footer/footer";

export default function HomePage() {
  return (
    <main className="kinnect-home bg-white">
      <Header />
      <section className="kinnect-shell">
        <div className="container-fluid">
          <div className=" overflow-hidden">          

            <section className="px-3 pb-5 pt-2 pt-lg-4 kinnect-hero">
              <div className="row align-items-center g-4 g-lg-5">
                <div className="col-lg-6">
                  <h1 className="mb-3">
                    Faster Referrals, Better Communication with Kin<span className="kinnect-text-accent">nect</span>
                  </h1>
                  <h3>Improving the Referral Experience.</h3>
                  <p>
                    Connect with Kin through Kinnect—bringing referring veterinarians, specialists, ER doctors, and hospital...
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <Link
                      href="/signup"
                      className="btn kinnect-btn-primary"
                    >
                     Submit Referral
                    </Link>
                  </div>
                </div>

                <div className="col-lg-6 text-center">
                 <img
                    src="/hero-img.png"
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="kinnect-banner">
        <div className="container-fluid">
          <div className=" ">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <h2>
                  Focus on the Patient,
                  <br />
                  not the Paperwork
                </h2>
                <Link href="" className="kinnect-btn-secondary">Get Started</Link>
              </div>
              <div className="col-lg-6">
                <div className="d-flex justify-content-lg-center gap-3">
                  <div className="kinnect-silhouette"><img src="/dog.svg" alt="Kinnect" /></div>
                  <div className="kinnect-silhouette"><img src="/cat.svg" alt="Kinnect" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="journey">
        <div className="container-fluid">
          <div className="row g-4 g-lg-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="">A Seamless Journey</h2>
              <p>Three steps to improve your referral workflow.</p>
              <img src="/doc-discuss.png" alt="Kinnect" className="img-fluid"/>
            </div>

            <div className="col-lg-6">
                      <div className="seam-card">
                        <img src="icn/create-ref.svg" alt="Kinnect" className="img-fluid"/>
                        <h3 className="h5 fw-bold mb-2">Create referral</h3>
                        <p className="text-secondary mb-0">Initiate a referral in seconds with concise, structured details. Everything is captured in a clean digital format—no faxes, lost emails, or long waits on hold.</p>
                      </div>
                      <div className="seam-card">
                        <img src="icn/kin-team.svg" alt="Kinnect" className="img-fluid"/>
                        <h3 className="h5 fw-bold mb-2">Kin Team reviews & accepts referral</h3>
                        <p className="text-secondary mb-0">Specialist teams are instantly notified and can claim referrals.</p>
                      </div>
                      <div className="seam-card">
                        <img src="icn/owner-stay.svg" alt="Kinnect" className="img-fluid"/>
                        <h3 className="h5 fw-bold mb-2">Owner stays informed</h3>
                        <p className="text-secondary mb-0">Pet owners receive automatic SMS updates with clinic details, progress notifications, and option to book online or take next steps when needed.</p>
                      </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container-fluid">
          <div className="kinnect-story overflow-hidden">
            <div className="row g-0 align-items-center">
              <div className="col-lg-6">
                <h2 className="">
                  Built for the <br />Pace of Modern Care
                </h2>
                <p>Quickly connect with Kin&apos;s skilled emergency and specialty teams.</p>

                <div className="d-grid gap-3">
                    <div className="d-flex align-items-start gap-3 mt-5">
                        <img src="icn/real-time.svg" alt="Real-time Comms" />
                        <div className="care-bx">
                        <h4>Real-time Comms</h4>
                          <p className="mb-0">Instant messaging between referring vets and hospital <br />teams ensures zero-delay consultation.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start gap-3 mt-3">
                        <img src="icn/edu-hub.svg" alt="Real-time Comms" />
                        <div className="care-bx">
                        <h4>Education Hub</h4>
                          <p className="mb-0 ">Access Kin&apos;s past and upcoming CE webinars.</p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="col-lg-6">
                <img src="modren-care.png" alt="Kinnect" className="img-fluid"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testi-mon">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-4">
                What referring veterinarians are saying
              </h2>
            </div>
          </div>

          <TestimonialsSlider />
        </div>
      </section>

      <section className="contact pt-5">
        <div className="container-fluid">
          <div className="kinnect-cta overflow-hidden p-4 p-lg-5 text-center text-lg-start">
            <div className="align-items-center g-4">
                <h2 className="mb-2">
                  Start using Kinnect today
                </h2>
                <p>
                  Join veterinary teams building faster, clearer referral
                  experiences.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link
                    href="/signup"
                    className="kinnect-btn-secondary"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="kinnect-btn-primary"
                  >
                    Submit Referral
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
