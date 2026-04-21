
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";

export default function PrivacyPolicyPage() {
  return (
    <main className="privacy-policy-page">
      <Header/>
      <section className="privacy-policy-shell">
        <div className="container-fluid">
          <div className="privacy-policy-card">
            <div className="privacy-policy-header">
              <h1>Terms of Use</h1>
              <p>Effective updated: March 26, 2026</p>
            </div>

            <div className="privacy-policy-content">
              <section className="privacy-policy-section">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to VETLIN Clinical, a part of the Clinical
                  Intelligence Framework. We are committed to protecting the
                  privacy of veterinary professionals and the sensitive clinical
                  data entrusted to our platform. This Privacy Policy explains
                  how we collect, use, and safeguard information within our
                  specialized veterinary ecosystem.
                </p>
                <p>
                  By using VETLIN Clinical, you acknowledge the terms of this
                  policy and our commitment to maintaining the highest standards
                  of data integrity and professional confidentiality.
                </p>
              </section>

              <section className="privacy-policy-section">
                <h2>2. Information We Collect</h2>
                <p className="privacy-policy-intro">
                  To provide a high-performance clinical experience, we collect
                  three primary categories of information:
                </p>

                <div className="privacy-policy-group">
                  <h3>Personal Information</h3>
                  <p>
                    This includes identifying information during account
                    registration, such as your full name, professional
                    credentials (DVM, BVSc, and LVT), clinic affiliation, email
                    address, and login credentials.
                  </p>
                </div>

                <div className="privacy-policy-group">
                  <h3>Clinical Data</h3>
                  <p>
                    As a specialized veterinary tool, we process patient data
                    including medical histories, diagnostic imaging, lab
                    results, pharmaceutical records, and provider notes. This
                    information is treated with the same level of care as human
                    medical records under HIPAA-equivalent standards.
                  </p>
                </div>

                <div className="privacy-policy-group">
                  <h3>Usage &amp; Technical Data</h3>
                  <p>
                    We collect diagnostic information required to ensure our
                    platform operates with performance, including session
                    duration, tool utilization metrics, IP addresses, and
                    device identifiers to ensure platform stability and
                    optimization.
                  </p>
                </div>
              </section>

              <section className="privacy-policy-section">
                <h2>3. How We Use Your Information</h2>
                <p className="privacy-policy-intro">
                  We utilize collected data solely for the following
                  professional purposes:
                </p>
                <ul className="privacy-policy-list">
                  <li>
                    Providing and maintaining the VETLIN Clinical platform
                    services.
                  </li>
                  <li>
                    Enabling secure collaboration among professional veterinary
                    teams.
                  </li>
                  <li>
                    Ensuring accurate authentication and professional
                    verification.
                  </li>
                  <li>
                    Generating analytics to improve diagnostic workflows and UX
                    efficiency.
                  </li>
                  <li>
                    Compliance with legal obligations and veterinary regulatory
                    standards.
                  </li>
                </ul>
              </section>

              <section className="privacy-policy-highlight">
                <h2>4. Data Sharing & Disclosure</h2>
                <p>We do not sell clinical data. Data sharing is limited to functional clinical requirements:</p>

                <div className="privacy-policy-highlight-grid">
                  <div>
                    <h3>Instinct Integration</h3>
                    <p>VetLink Clinical maintains a deep integration with Instinct Science systems. Data flow between these platforms is strictly governed by secure API protocols to ensure seamless inpatient care and workflow continuity.</p>
                  </div>

                  <div>
                    <h3>Referrals & Consultations</h3>
                    <p>Information may be shared with designated specialty hospitals or consultants when a user explicitly initiates a "Referral" or "Consult Request" action within the platform.</p>
                  </div>
                </div>
              </section>

              <section className="privacy-policy-section">
                <h2>5. Data Security & HIPAA Context</h2>
                <p>While veterinary data is not technically governed by the human HIPAA framework in all jurisdictions, VetLink Clinical adopts HIPAA-compliant security protocols as our baseline standard. This includes:</p>
                <ul className="privacy-policy-list">
                  <li>
                    AES-256 encryption for data at rest and TLS 1.3 for data in
                    transit.
                  </li>
                  <li>
                    Role-based access controls (RBAC) and session management
                    safeguards.
                  </li>
                  <li>
                    Regular third-party security audits and penetration
                    testing.
                  </li>
                  <li>
                    Granular access monitoring for designated clinical teams.
                  </li>
                </ul>
              </section>

              <section className="privacy-policy-section">
                <h2>6. Your Rights</h2>
                <p>
                  VETLIN Clinical provides professional users with the right to
                  access, rectify, or request the deletion of personal account
                  information. For clinical patient records, data retention
                  follows state-mandated veterinary record keeping laws with
                  typically required storage for a minimum of 3 to 7 years.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
