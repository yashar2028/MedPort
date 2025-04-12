import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--white-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0.5rem 1rem;
`;

const NavbarInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
    color: var(--primary-color);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: var(--white-color);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 1rem;
  }
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: var(--dark-color);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  
  &:hover, &.active {
    color: var(--primary-color);
  }
  
  &.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    flex-direction: column;
    width: 100%;
  }
`;

const NavButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'var(--white-color)' : 'var(--primary-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--primary-color)'};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-left: ${props => props.primary ? '0.5rem' : '0'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'rgba(96, 108, 56, 0.1)'};
  }
  
  @media (max-width: 768px) {
    margin: 0.25rem 0;
    width: 100%;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-color);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserMenu = styled.div`
  position: relative;
  margin-left: 1.5rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  color: var(--dark-color);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: var(--dark-color);
  text-decoration: none;
  
  &:hover {
    background-color: rgba(96, 108, 56, 0.1);
    color: var(--primary-color);
    text-decoration: none;
  }
`;

const DropdownButton = styled.button`
  display: block;
  padding: 0.75rem 1rem;
  color: var(--danger-color);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
`;

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };
  
  return (
    <NavbarContainer style={{ backgroundColor: scrolled ? 'var(--white-color)' : 'rgba(255, 255, 255, 0.95)' }}>
      <NavbarInner>
        <Logo to="/">
          <i className="fas fa-hospital-user me-2"></i> MedPort
        </Logo>
        
        <MenuToggle onClick={toggleMenu}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </MenuToggle>
        
        <NavLinks isOpen={menuOpen}>
          <NavLink 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </NavLink>
          <NavLink 
            to="/providers" 
            className={location.pathname.startsWith('/providers') ? 'active' : ''}
          >
            Find Providers
          </NavLink>
          
          {isAuthenticated ? (
            <UserMenu className="user-menu">
              <UserButton onClick={toggleUserMenu}>
                <i className="fas fa-user-circle me-2"></i>
                {user?.username || 'Account'}
                <i className={`fas fa-chevron-${userMenuOpen ? 'up' : 'down'} ms-2`}></i>
              </UserButton>
              
              <UserMenuDropdown isOpen={userMenuOpen}>
                <DropdownLink to="/profile">My Profile</DropdownLink>
                {user?.role === 'provider' && (
                  <DropdownLink to="/provider-dashboard">Provider Dashboard</DropdownLink>
                )}
                <DropdownButton onClick={handleLogout}>Log Out</DropdownButton>
              </UserMenuDropdown>
            </UserMenu>
          ) : (
            <AuthButtons>
              <NavButton onClick={() => navigate('/login')}>Log In</NavButton>
              <NavButton primary onClick={() => navigate('/signup')}>Sign Up</NavButton>
            </AuthButtons>
          )}
        </NavLinks>
      </NavbarInner>
    </NavbarContainer>
  );
}

export default Navbar;
