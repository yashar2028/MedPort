import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import styled from 'styled-components';

const NavbarContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.5rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--white-color);
  font-size: 1.5rem;
  font-weight: 700;
  
  img {
    height: 40px;
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: absolute;
    flex-direction: column;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--primary-color);
    padding: 1rem 0;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: var(--white-color);
  text-decoration: none;
  margin: 0 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  color: var(--white-color);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--accent-color);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: var(--white-color);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <NavbarContainer>
      <NavInner>
        <Logo to="/">
          <img src="/logo.svg" alt="MedPort Logo" />
          <span>MedPort</span>
        </Logo>
        
        <MobileMenuButton onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </MobileMenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/providers">Providers</NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">My Profile</NavLink>
              {user && user.role === 'provider' && (
                <NavLink to="/provider-dashboard">Dashboard</NavLink>
              )}
              <NavButton onClick={handleLogout}>Logout</NavButton>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavLinks>
      </NavInner>
    </NavbarContainer>
  );
}

export default Navbar;