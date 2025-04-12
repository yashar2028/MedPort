import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--secondary-color);
  color: var(--white-color);
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--accent-color);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: var(--white-color);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    color: var(--white-color);
    font-size: 1.5rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-left: 1rem;
  padding-right: 1rem;
`;

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>MedPort</h3>
          <p>Find and book top-quality healthcare providers for your medical tourism needs.</p>
          <SocialLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/providers">Find Providers</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Popular Treatments</h3>
          <FooterLink to="/treatments/hair-transplant">Hair Transplant</FooterLink>
          <FooterLink to="/treatments/plastic-surgery">Plastic Surgery</FooterLink>
          <FooterLink to="/treatments/dental">Dental Procedures</FooterLink>
          <FooterLink to="/treatments/weight-loss">Weight Loss Surgery</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Support</h3>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/help">Help Center</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; {year} MedPort. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;