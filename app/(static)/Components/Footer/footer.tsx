export default function Footer() {
  return (
    <footer className="">
      <div className="container-fluid">
      <img src="footer-bg.svg" alt="Kinnect" className="w-100"/>
        <div className="row align-items-center footer-section">
          {/* Left */}
          <div className="col-md-4 text-center text-md-start">
            <p className="mb-0">
              Copyright <span className="brand">Kinnect</span>. All Rights Reserved</p>
          </div>
          {/* Center */}
          <div className="col-md-4 text-center my-3 my-md-0">
            <a href="#" className="footer-link me-3">Terms of Use</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
          {/* Right (Social Icons) */}
          <div className="col-md-4 text-center text-md-end">
            <a href="#" className="social-icon">
              <img src="icn/linkedin.svg" alt="Kinnect" className="img-fluid"/>
            </a>
            <a href="#" className="social-icon">
              <img src="icn/facebook.svg" alt="Kinnect" className="img-fluid"/>
            </a>
            <a href="#" className="social-icon me-0">
              <img src="icn/instagram.svg" alt="Kinnect" className="img-fluid"/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}