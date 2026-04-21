"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg px-3 px-lg-4 py-3">
              <div className="container-fluid px-0">
                <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
                  <img
                    src="/logo_big.svg"
                    alt="Kinnect"
                    className="kinnect-logo img-fluid"
                  />
                </Link>

                <div className="ms-lg-auto">
                  <ul className="navbar-nav flex-row flex-wrap align-items-center justify-content-end gap-2 gap-lg-3 small fw-semibold">
                    <li className="nav-item">
                      <Link href="" className="nav-link text-dark">
                        How it Works
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="" className="nav-link text-dark">
                        Contact
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="" className="nav-link text-dark">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/signup"
                        className="btn kinnect-btn-primary px-3 py-2"
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