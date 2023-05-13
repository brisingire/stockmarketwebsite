// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footerContainer">
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
      <div className="websiteInfo">
        <p style={{fontSize: "smaller"}}>Data updated every 6 hours.</p>
        <p style={{fontSize: "smaller"}}>All Price Data is normalized.</p>
      </div>
      
    </div>
  );
};

export default Footer;