import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--secondary-color);
  color: var(--white-color);
  padding: 3rem 0 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h5`
  color: var(--light-color);
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--accent-color);
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: var(--light-color);
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--accent-color);
    text-decoration: none;
  }
  
  i {
    margin-right: 0.5rem;
    font-size: 0.85rem;
  }
`;

const ExternalLink = styled.a`
  color: var(--light-color);
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--accent-color);
    text-decoration: none;
  }
  
  i {
    margin-right: 0.5rem;
    font-size: 0.85rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: var(--light-color);
  background-color: rgba(255, 255, 255, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--white-color);
    transform: translateY(-3px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h3 style={{ color: 'var(--white-color)', marginBottom: '1rem' }}>
                <i className="fas fa-hospital-user me-2"></i> MedPort
              </h3>
            </Link>
            <p style={{ color: 'var(--light-color)', fontSize: '0.9rem' }}>
              MedPort is your trusted marketplace for finding the best medical
              tourism services worldwide. Compare prices, read reviews, and book
              with confidence.
            </p>
            <SocialLinks>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterList>
              <FooterListItem>
                <FooterLink to="/providers">
                  <i className="fas fa-chevron-right"></i> Find Providers
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/treatments">
                  <i className="fas fa-chevron-right"></i> Treatments
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/destinations">
                  <i className="fas fa-chevron-right"></i> Popular Destinations
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/how-it-works">
                  <i className="fas fa-chevron-right"></i> How It Works
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/blog">
                  <i className="fas fa-chevron-right"></i> Blog & Resources
                </FooterLink>
              </FooterListItem>
            </FooterList>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>For Providers</FooterTitle>
            <FooterList>
              <FooterListItem>
                <FooterLink to="/join-as-provider">
                  <i className="fas fa-chevron-right"></i> Join as Provider
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/provider-login">
                  <i className="fas fa-chevron-right"></i> Provider Login
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/provider-resources">
                  <i className="fas fa-chevron-right"></i> Provider Resources
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/advertising">
                  <i className="fas fa-chevron-right"></i> Advertising Options
                </FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/success-stories">
                  <i className="fas fa-chevron-right"></i> Success Stories
                </FooterLink>
              </FooterListItem>
            </FooterList>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Contact Info</FooterTitle>
            <FooterList>
              <FooterListItem>
                <ExternalLink href="mailto:info@medport.com">
                  <i className="fas fa-envelope"></i> info@medport.com
                </ExternalLink>
              </FooterListItem>
              <FooterListItem>
                <ExternalLink href="tel:+123456789">
                  <i className="fas fa-phone-alt"></i> +1 (234) 567-89
                </ExternalLink>
              </FooterListItem>
              <FooterListItem>
                <ExternalLink href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i> 123 Medical Avenue, 
                  Health District, NY 10001
                </ExternalLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink to="/help">
                  <i className="fas fa-question-circle"></i> Help Center
                </FooterLink>
              </FooterListItem>
            </FooterList>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <p>
            &copy; {currentYear} MedPort. All rights reserved.
          </p>
          <div style={{ marginTop: '0.5rem' }}>
            <FooterLink to="/privacy-policy" style={{ margin: '0 0.75rem' }}>
              Privacy Policy
            </FooterLink>
            <FooterLink to="/terms" style={{ margin: '0 0.75rem' }}>
              Terms of Service
            </FooterLink>
            <FooterLink to="/cookie-policy" style={{ margin: '0 0.75rem' }}>
              Cookie Policy
            </FooterLink>
          </div>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
