import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css"; // We'll add custom styles here

function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-row">
          {/* About */}
          <div className="footer-col">
            <h5>About Live Art</h5>
            <p>
              Live Art empowers creativity, uniting artists to transform visions into reality. Join us in celebrating artistic expression.
            </p>
          </div>
          {/* Quick Links */}
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/join">Join Us</a></li>
              <li><a href="/salary-management">Salary Management</a></li>
              <li><a href="/report-analyze">Report Analyze</a></li>
            </ul>
          </div>
          {/* Google Maps */}
          <div className="footer-col">
            <h5>Visit Us</h5>
            <iframe
              title="Live Art Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450923!2d144.95373631531787!3d-37.81627967975178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577ee2a8b9dc8f2!2sMelbourne%20CBD%2C%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sin!4v1614732163489!5m2!1sen!2sin"
              width="100%"
              height="120"
              style={{ border: "0", borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
          {/* Newsletter */}
          <div className="footer-col">
            <h5>Newsletter</h5>
            <p>Stay updated with the latest news and special offers from Live Art.</p>
            <form className="footer-newsletter">
              <input type="email" placeholder="Enter your email" aria-label="Subscriber's email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <hr />
        {/* Social Media */}
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
        </div>
        <p className="footer-copyright">
          © 2025 Live Art Clothings | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;