import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';
import { updateUserProfile } from '../store/authSlice';
import { fetchUserBookings, cancelBooking } from '../store/bookingSlice';
import { formatDate } from '../utils/helpers';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  color: var(--gray-color);
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const UserName = styled.h3`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: var(--gray-color);
  margin-bottom: 0.5rem;
`;

const UserRole = styled.div`
  display: inline-block;
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ProfileNav = styled.div`
  margin-top: 1.5rem;
`;

const ProfileNavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: ${props => props.active ? 'rgba(96, 108, 56, 0.1)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--dark-color)'};
  text-align: left;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(96, 108, 56, 0.1);
    color: var(--primary-color);
  }
  
  i {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
  }
`;

const ContentSection = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const BookingCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--white-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return 'rgba(76, 175, 80, 0.1)';
      case 'pending':
        return 'rgba(255, 152, 0, 0.1)';
      case 'cancelled':
        return 'rgba(244, 67, 54, 0.1)';
      case 'completed':
        return 'rgba(33, 150, 243, 0.1)';
      default:
        return 'rgba(96, 108, 56, 0.1)';
    }
  }};
`;

const BookingStatus = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => {
    switch (props.status) {
      case 'confirmed':
        return '#2e7d32';
      case 'pending':
        return '#e65100';
      case 'cancelled':
        return '#c62828';
      case 'completed':
        return '#0277bd';
      default:
        return 'var(--primary-color)';
    }
  }};
`;

const BookingBody = styled.div`
  padding: 1rem;
`;

const BookingProvider = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const ProviderIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled(Link)`
  font-weight: 600;
  color: var(--secondary-color);
  display: block;
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const ProviderLocation = styled.div`
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BookingDetail = styled.div`
  .label {
    font-size: 0.85rem;
    color: var(--gray-color);
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-weight: 500;
  }
`;

const BookingFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
`;

const BookingButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: var(--primary-color);
    color: var(--white-color);
    
    &:hover {
      background-color: var(--primary-dark);
      text-decoration: none;
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    
    &:hover {
      background-color: rgba(96, 108, 56, 0.1);
      text-decoration: none;
    }
  }
  
  &.danger {
    background-color: transparent;
    color: var(--danger-color);
    border: 1px solid var(--danger-color);
    
    &:hover {
      background-color: rgba(244, 67, 54, 0.1);
      text-decoration: none;
    }
  }
  
  &:disabled {
    background-color: var(--gray-color);
    border-color: var(--gray-color);
    color: var(--white-color);
    cursor: not-allowed;
  }
  
  i {
    margin-right: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const FormButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: var(--primary-color);
    color: var(--white-color);
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--gray-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: #f0f0f0;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(96, 108, 56, 0.2);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings, loading: bookingsLoading } = useSelector(state => state.bookings);
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [profileData, setProfileData] = useState({
    email: '',
    full_name: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  
  // Load user data and bookings
  useEffect(() => {
    if (user) {
      setProfileData({
        ...profileData,
        email: user.email || '',
        full_name: user.full_name || ''
      });
      
      // Fetch user bookings
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user]);
  
  // Handle profile form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Clear messages
    setError('');
    setSuccess('');
    
    // Validate password fields
    if (profileData.new_password || profileData.current_password) {
      if (profileData.new_password !== profileData.confirm_password) {
        setError('New password and confirmation do not match');
        return;
      }
      
      if (!profileData.current_password) {
        setError('Current password is required to set a new password');
        return;
      }
      
      if (profileData.new_password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        email: profileData.email,
        full_name: profileData.full_name
      };
      
      // Add password if being changed
      if (profileData.new_password && profileData.current_password) {
        updateData.password = profileData.new_password;
      }
      
      // Update profile
      const response = await api.put('/users/me', updateData);
      
      // Update Redux state
      dispatch(updateUserProfile(response.data));
      
      // Show success message
      setSuccess('Profile updated successfully');
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Error updating profile. Please try again.');
      }
      
      setLoading(false);
    }
  };
  
  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    setCancellingBookingId(bookingId);
    
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      setCancellingBookingId(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setCancellingBookingId(null);
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.full_name) return '?';
    
    return user.full_name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format booking status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>My Profile</ProfileTitle>
        <ProfileSubtitle>Manage your account information and bookings</ProfileSubtitle>
      </ProfileHeader>
      
      <ProfileGrid>
        <ProfileSidebar>
          <UserInfo>
            <ProfileAvatar>{getUserInitials()}</ProfileAvatar>
            <UserName>{user?.full_name}</UserName>
            <UserEmail>{user?.email}</UserEmail>
            <UserRole>{user?.role}</UserRole>
          </UserInfo>
          
          <ProfileNav>
            <ProfileNavItem 
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-check"></i> My Bookings
            </ProfileNavItem>
            
            <ProfileNavItem 
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user-edit"></i> Edit Profile
            </ProfileNavItem>
            
            {user?.role === 'provider' && (
              <ProfileNavItem as={Link} to="/provider-dashboard">
                <i className="fas fa-clinic-medical"></i> Provider Dashboard
              </ProfileNavItem>
            )}
          </ProfileNav>
        </ProfileSidebar>
        
        <ContentSection>
          {activeTab === 'bookings' && (
            <>
              <SectionTitle>My Bookings</SectionTitle>
              
              {bookingsLoading ? (
                <LoadingSpinner>
                  <div className="spinner"></div>
                </LoadingSpinner>
              ) : bookings && bookings.length > 0 ? (
                bookings.map(booking => (
                  <BookingCard key={booking.id}>
                    <BookingHeader status={booking.status}>
                      <h4>Booking #{booking.id}</h4>
                      <BookingStatus status={booking.status}>
                        {formatStatus(booking.status)}
                      </BookingStatus>
                    </BookingHeader>
                    
                    <BookingBody>
                      <BookingProvider>
                        <ProviderIcon>
                          <i className="fas fa-hospital-alt"></i>
                        </ProviderIcon>
                        <ProviderInfo>
                          <ProviderName to={`/providers/${booking.provider.id}`}>
                            {booking.provider.name}
                          </ProviderName>
                          <ProviderLocation>
                            {booking.provider.city}, {booking.provider.country}
                          </ProviderLocation>
                        </ProviderInfo>
                      </BookingProvider>
                      
                      <BookingDetails>
                        <BookingDetail>
                          <div className="label">Treatment</div>
                          <div className="value">{booking.treatment_price.treatment.name}</div>
                        </BookingDetail>
                        
                        <BookingDetail>
                          <div className="label">Date</div>
                          <div className="value">{formatDate(booking.appointment_date)}</div>
                        </BookingDetail>
                        
                        <BookingDetail>
                          <div className="label">Price</div>
                          <div className="value">${booking.treatment_price.price.toLocaleString()} {booking.treatment_price.currency}</div>
                        </BookingDetail>
                      </BookingDetails>
                      
                      {booking.special_requests && (
                        <BookingDetail>
                          <div className="label">Special Requests</div>
                          <div className="value">{booking.special_requests}</div>
                        </BookingDetail>
                      )}
                    </BookingBody>
                    
                    <BookingFooter>
                      {booking.status === 'pending' && (
                        <>
                          <BookingButton to={`/checkout/${booking.id}`} className="primary">
                            <i className="fas fa-credit-card"></i> Complete Payment
                          </BookingButton>
                          
                          <BookingButton 
                            as="button" 
                            className="danger"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingBookingId === booking.id}
                          >
                            {cancellingBookingId === booking.id ? (
                              'Cancelling...'
                            ) : (
                              <>
                                <i className="fas fa-times"></i> Cancel Booking
                              </>
                            )}
                          </BookingButton>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <>
                          <BookingButton to={`/providers/${booking.provider.id}`} className="secondary">
                            <i className="fas fa-hospital-alt"></i> View Provider
                          </BookingButton>
                          
                          <BookingButton 
                            as="button" 
                            className="danger"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingBookingId === booking.id}
                          >
                            {cancellingBookingId === booking.id ? (
                              'Cancelling...'
                            ) : (
                              <>
                                <i className="fas fa-times"></i> Cancel Booking
                              </>
                            )}
                          </BookingButton>
                        </>
                      )}
                      
                      {booking.status === 'completed' && (
                        <BookingButton to={`/providers/${booking.provider.id}`} className="secondary">
                          <i className="fas fa-star"></i> Write a Review
                        </BookingButton>
                      )}
                      
                      {booking.status === 'cancelled' && (
                        <BookingButton to={`/providers/${booking.provider.id}`} className="secondary">
                          <i className="fas fa-redo"></i> Book Again
                        </BookingButton>
                      )}
                    </BookingFooter>
                  </BookingCard>
                ))
              ) : (
                <EmptyState>
                  <i className="far fa-calendar-alt fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
                  <h3>No Bookings Yet</h3>
                  <p className="mb-4">You haven't made any bookings yet. Start exploring providers to book your medical procedure.</p>
                  <Link to="/providers" className="btn btn-primary">
                    Find Providers
                  </Link>
                </EmptyState>
              )}
            </>
          )}
          
          {activeTab === 'profile' && (
            <>
              <SectionTitle>Edit Profile</SectionTitle>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <form onSubmit={handleProfileUpdate}>
                <FormGroup>
                  <FormLabel htmlFor="full_name">Full Name</FormLabel>
                  <FormInput
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={profileData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <FormInput
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '2rem 0' }}></div>
                
                <h4 style={{ marginBottom: '1.5rem' }}>Change Password</h4>
                
                <FormGroup>
                  <FormLabel htmlFor="current_password">Current Password</FormLabel>
                  <FormInput
                    id="current_password"
                    name="current_password"
                    type="password"
                    value={profileData.current_password}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="new_password">New Password</FormLabel>
                  <FormInput
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={profileData.new_password}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="confirm_password">Confirm New Password</FormLabel>
                  <FormInput
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={profileData.confirm_password}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormActions>
                  <FormButton 
                    type="button" 
                    className="secondary"
                    onClick={() => {
                      setProfileData({
                        ...profileData,
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                      });
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Cancel
                  </FormButton>
                  <FormButton 
                    type="submit" 
                    className="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </FormButton>
                </FormActions>
              </form>
            </>
          )}
        </ContentSection>
      </ProfileGrid>
    </ProfileContainer>
  );
}

export default UserProfile;
