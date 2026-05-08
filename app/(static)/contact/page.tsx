
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Header />
      <section className="contact-shell">
        <div className="container-fluid">
            <div className="row">
                <div className="col-xxl-6 col-xl-5 my-auto">
   <div className="contact-form-card">
               
              <h1>
                Get in <span>Touch</span>
              </h1>
              <p>
                Connect with the Kinnect team for referrals, platform support,
                or partnership questions. We&apos;ll point you to the right
                person quickly.
              </p>

              <form className="contact-form-grid">
                <input type="text" placeholder="Name *" aria-label="Name" />
                <input type="email" placeholder="Email" aria-label="Email" />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  aria-label="Phone number"
                />
                <select defaultValue="" aria-label="How did you find us">
                  <option value="" disabled>
                    How did you find us?
                  </option>
                  <option value="referral">Referral partner</option>
                  <option value="search">Google search</option>
                  <option value="social">Social media</option>
                  <option value="event">Conference or event</option>
                </select>
                <button type="submit">Send</button>
              </form>
            </div>
                </div>
                <div className="col-xxl-6 col-xl-7">
                      <div className="contact-visual-panel" aria-hidden="true">
             
            <img src="/doctor_contact_us.png" alt="" />
            </div>
                </div>
            </div>
          
        </div>
      </section>
      <Footer />
    </main>
  );
}
