import Link from 'next/link';
import './pagemain.css';

export default function HomePage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <nav className="nav-container">
          <div className="nav-left-section">
            <img src="https://icons.veryicon.com/png/o/education-technology/smart-campus-2/class-attendance.png" alt="Logo" />
            
            <div className="nav-links">
              <Link href="/" className="nav-link">HomeHome</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </div>
          </div>
          
          <Link href="Authentication/Login" className="login-btn">Login</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="hero-container">
          <h1 className="hero-title">Attendance Tracking System</h1>
          
          <p className="hero-subtitle">
            A simple and secure way to manage student attendance
          </p>

          <div className="auth-buttons">
            <Link href="Authentication/Login" className="auth-btn auth-btn-login">
              LOGIN
            </Link>
            <Link href="Authentication/Register" className="auth-btn auth-btn-register">
              REGISTER
            </Link>
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <div className="footer-container">
          <p className="copyright">
            © 2026 Kameraprufung Inc. All rights reserved
          </p>
          
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Private Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}