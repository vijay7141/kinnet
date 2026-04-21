import Link from "next/link";

export default function HomePage() {
  return (
    <main className="kinnect-home bg-white">
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
                  <p className="lead text-secondary mb-4">
                    Improving the referral experience for clinics, staff, and
                    pet owners with one connected workspace.
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <Link
                      href="/signup"
                      className="btn kinnect-btn-primary px-4 py-3 fw-semibold"
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
                <h2 className="mb-0">
                  Focus on the Patient,
                  <br />
                  not the Paperwork
                </h2>
                <Link href="" className="get-startd">Get Started</Link>
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
                <p>Quickly connect with Kin's skilled emergency and specialty teams.</p>

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
                          <p className="mb-0 ">Access Kin's past and upcoming CE webinars.</p>
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

      <section className="testi-mon py-5">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
            <div>
              <h2 className="fw-bold mb-0">
                What referring veterinarians are saying
              </h2>
            </div>
          </div>

          <div className="row g-4">
              <div className="col-md-4 col-xl-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 kinnect-quote-card">
                  <p className="text-secondary mb-4">
                    "Kinnect has transformed our referral speed. We save hours every day that used to be spent chasing phone calls."
                  </p>
                  <div className="mt-auto d-flex gap-3">
                    <img src="avatar-1.png" alt="Kinnect" className="img-fluid"/>
                    <div >
                    <p className="fw-bold text-dark mb-1">Dr. Sarah Mitchell</p>
                    <p className="small text-secondary mb-0">
                      Senior Veterinarian, Urban Vet Care
                    </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xl-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 kinnect-quote-card">
                  <p className="text-secondary mb-4">
                    "Kinnect has transformed our referral speed. We save hours every day that used to be spent chasing phone calls."
                  </p>
                  <div className="mt-auto d-flex gap-3">
                    <img src="avatar-1.png" alt="Kinnect" className="img-fluid"/>
                    <div >
                    <p className="fw-bold text-dark mb-1">Dr. Sarah Mitchell</p>
                    <p className="small text-secondary mb-0">
                      Senior Veterinarian, Urban Vet Care
                    </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xl-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 kinnect-quote-card">
                  <p className="text-secondary mb-4">
                    "Kinnect has transformed our referral speed. We save hours every day that used to be spent chasing phone calls."
                  </p>
                  <div className="mt-auto d-flex gap-3">
                    <img src="avatar-1.png" alt="Kinnect" className="img-fluid"/>
                    <div >
                    <p className="fw-bold text-dark mb-1">Dr. Sarah Mitchell</p>
                    <p className="small text-secondary mb-0">
                      Senior Veterinarian, Urban Vet Care
                    </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-5">
        <div className="container-xxl">
          <div className="kinnect-cta rounded-5 overflow-hidden p-4 p-lg-5 text-center text-lg-start">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="display-6 fw-bold text-white mb-2">
                  Start using Kinnect today
                </h2>
                <p className="text-white-50 mb-0">
                  Join veterinary teams building faster, clearer referral
                  experiences.
                </p>
              </div>
              <div className="col-lg-4">
                <div className="d-flex flex-wrap justify-content-lg-end gap-3">
                  <Link
                    href="/signup"
                    className="btn btn-info rounded-pill px-4 py-3 fw-semibold text-dark"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="btn kinnect-btn-primary rounded-pill px-4 py-3 fw-semibold"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-4">
        <div className="container-xxl">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 small text-secondary">
            <p className="mb-0">Copyright 2026. All Rights Reserved.</p>
            <div className="d-flex gap-3">
              <Link href="/" className="text-secondary">
                Terms of Service
              </Link>
              <Link href="/" className="text-secondary">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
