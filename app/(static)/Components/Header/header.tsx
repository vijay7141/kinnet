"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg px-3 py-3">
        <div className="container-fluid px-0">
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <img
              src="/logo_big.svg"
              alt="Kinnect"
              className="kinnect-logo img-fluid"
            />
          </Link>

          <button
            type="button"
            className="kinnect-nav-toggle"
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
            aria-expanded={isMenuOpen}
            aria-controls="kinnect-site-nav"
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          <div
            id="kinnect-site-nav"
            className={
              isMenuOpen
                ? "kinnect-nav-panel is-open ms-lg-auto"
                : "kinnect-nav-panel ms-lg-auto"
            }
          >
            <ul className="navbar-nav kinnect-nav-list align-items-center justify-content-end gap-2 gap-lg-3 small fw-semibold">
              <li className="nav-item">
                <Link
                  href="#journey"
                  className="nav-link text-dark"
                  onClick={closeMenu}
                >
                  How it Works
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="#contact"
                  className="nav-link text-dark"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/login" className="nav-link text-dark" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/signup"
                  className="btn kinnect-btn-primary px-3 py-2"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
