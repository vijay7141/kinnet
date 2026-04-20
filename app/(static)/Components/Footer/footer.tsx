export default function Footer() {
  return (
    <footer className="footer-section text-white">
      <div className="container">

        <div className="row align-items-center py-4">

          {/* Left */}
          <div className="col-md-4 text-center text-md-start">
            <p className="mb-0">
              © {new Date().getFullYear()} <span className="brand">Kinnect</span>. All Rights Reserved
            </p>
          </div>

          {/* Center */}
          <div className="col-md-4 text-center my-3 my-md-0">
            <a href="#" className="footer-link me-3">Terms of Use</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>

          {/* Right (Social Icons) */}
          <div className="col-md-4 text-center text-md-end">
            <a href="#" className="social-icon me-2">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="#" className="social-icon me-2">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-instagram"></i>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}