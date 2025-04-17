import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { api } from '../utils/api';
import { fetchProviderBookings, updateBookingStatus } from '../store/bookingSlice';
import { formatDate } from '../utils/helpers';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const DashboardSubtitle = styled.p`
  color: var(--gray-color);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardSidebar = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const DashboardNav = styled.div`
  margin-top: 1rem;
`;

const NavItem = styled.button`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => `rgba(${props.color}, 0.1)`};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${props => `rgb(${props.color})`};
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => `rgb(${props.color})`};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--gray-color);
  font-size: 0.9rem;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: rgba(96, 108, 56, 0.05);
  padding: 1rem;
  border-radius: 8px;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--white-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ClearButton = styled.button`
  background-color: transparent;
  color: var(--gray-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const BookingCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
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

const BookingTitle = styled.h4`
  margin: 0;
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

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
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

const BookingPatient = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const PatientIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
`;

const PatientInfo = styled.div`
  .name {
    font-weight: 600;
    color: var(--secondary-color);
  }
  
  .email {
    font-size: 0.85rem;
    color: var(--gray-color);
  }
`;

const BookingFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.02);
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const UpdateButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
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
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  min-height: 120px;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  
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
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const TreatmentTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background-color: rgba(96, 108, 56, 0.1);
    color: var(--secondary-color);
    font-weight: 600;
  }
  
  tr:hover td {
    background-color: rgba(96, 108, 56, 0.05);
  }
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
  
  &.delete {
    color: var(--danger-color);
    
    &:hover {
      color: #c62828;
    }
  }
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

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

function ProviderDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings, loading } = useSelector(state => state.bookings);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [providerProfile, setProviderProfile] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [treatmentPrices, setTreatmentPrices] = useState([]);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    date: ''
  });
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    revenue: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    website: '',
    license_number: '',
    specialty_ids: [],
    treatment_ids: []
  });
  const [treatmentPriceForm, setTreatmentPriceForm] = useState({
    treatment_id: '',
    price: '',
    currency: 'USD',
    description: ''
  });
  const [loading2, setLoading2] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Load provider data, treatments, specialties
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading2(true);
        setError('');
        
        // Fetch provider bookings
        dispatch(fetchProviderBookings());
        
        // Fetch provider profile
        const providerResponse = await api.get('/providers/');
        const ownProvider = providerResponse.data.find(p => p.user_id === user.id);
        
        if (ownProvider) {
          setProviderProfile(ownProvider);
          
          // Set form data from provider profile
          setFormData({
            name: ownProvider.name || '',
            description: ownProvider.description || '',
            address: ownProvider.address || '',
            city: ownProvider.city || '',
            country: ownProvider.country || '',
            phone: ownProvider.phone || '',
            website: ownProvider.website || '',
            license_number: ownProvider.license_number || '',
            specialty_ids: ownProvider.specialties.map(s => s.id) || [],
            treatment_ids: ownProvider.treatments.map(t => t.id) || []
          });
          
          // Fetch treatment prices
          const pricesResponse = await api.get(`/providers/${ownProvider.id}/`);
          setTreatmentPrices(pricesResponse.data.treatment_prices || []);
        }
        
        // Fetch treatments
        const treatmentsResponse = await api.get('/providers/treatments/');
        setTreatments(treatmentsResponse.data);
        
        // Fetch specialties
        const specialtiesResponse = await api.get('/providers/specialties/');
        setSpecialties(specialtiesResponse.data);
        
        setLoading2(false);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        setError('Failed to load provider data. Please try again.');
        setLoading2(false);
      }
    };
    
    fetchProviderData();
  }, [dispatch, user]);
  
  // Calculate statistics when bookings change
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const total = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const confirmed = bookings.filter(b => b.status === 'confirmed').length;
      const cancelled = bookings.filter(b => b.status === 'cancelled').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      
      // Calculate total revenue from confirmed and completed bookings
      const revenue = bookings
        .filter(b => ['confirmed', 'completed'].includes(b.status))
        .reduce((sum, booking) => sum + booking.treatment_price.price, 0);
      
      setStats({
        totalBookings: total,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        cancelledBookings: cancelled,
        completedBookings: completed,
        revenue
      });
      
      // Initialize filtered bookings with all bookings
      setFilteredBookings(bookings);
    }
  }, [bookings]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    if (!bookings) return;
    
    let filtered = [...bookings];
    
    // Filter by status
    if (filter.status) {
      filtered = filtered.filter(b => b.status === filter.status);
    }
    
    // Filter by date
    if (filter.date) {
      const filterDate = new Date(filter.date);
      filtered = filtered.filter(b => {
        const bookingDate = new Date(b.appointment_date);
        return bookingDate.toDateString() === filterDate.toDateString();
      });
    }
    
    // Filter by search term (patient name or treatment)
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.user.full_name.toLowerCase().includes(searchTerm) ||
        b.treatment_price.treatment.name.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredBookings(filtered);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilter({
      status: '',
      search: '',
      date: ''
    });
    setFilteredBookings(bookings || []);
  };
  
  // Handle status change for a booking
  const handleStatusChange = (bookingId, status) => {
    setUpdatedStatuses(prev => ({
      ...prev,
      [bookingId]: status
    }));
  };
  
  // Update booking status
  const updateStatus = async (bookingId) => {
    if (!updatedStatuses[bookingId]) return;
    
    setStatusUpdating(bookingId);
    
    try {
      await dispatch(updateBookingStatus({
        bookingId,
        status: updatedStatuses[bookingId]
      })).unwrap();
      
      // Remove from updated statuses
      const updatedStatusesCopy = { ...updatedStatuses };
      delete updatedStatusesCopy[bookingId];
      setUpdatedStatuses(updatedStatusesCopy);
      
      setStatusUpdating(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
      setStatusUpdating(null);
    }
  };
  
  // Handle profile form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => parseInt(option.value, 10));
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };
  
  // Handle treatment price form input change
  const handleTreatmentPriceChange = (e) => {
    const { name, value } = e.target;
    setTreatmentPriceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    setLoading2(true);
    
    try {
      if (providerProfile) {
        // Update existing provider
        const response = await api.put(`/providers/${providerProfile.id}/`, formData);
        setProviderProfile(response.data);
        setSuccess('Provider profile updated successfully');
      } else {
        // Create new provider
        const newProviderData = {
          ...formData,
          user_id: user.id
        };
        
        const response = await api.post('/providers/', newProviderData);
        setProviderProfile(response.data);
        setSuccess('Provider profile created successfully');
      }
      
      setLoading2(false);
    } catch (error) {
      console.error('Error updating provider profile:', error);
      
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Error updating provider profile. Please try again.');
      }
      
      setLoading2(false);
    }
  };
  
  // Submit treatment price
  const handleAddTreatmentPrice = async (e) => {
    e.preventDefault();
    
    if (!treatmentPriceForm.treatment_id || !treatmentPriceForm.price) {
      setError('Please select a treatment and enter a price');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading2(true);
    
    try {
      const priceData = {
        ...treatmentPriceForm,
        price: parseFloat(treatmentPriceForm.price),
        provider_id: providerProfile.id
      };
      
      const response = await api.post('/providers/treatment-prices/', priceData);
      
      // Add new price to the list
      setTreatmentPrices(prev => [...prev, response.data]);
      
      // Reset form
      setTreatmentPriceForm({
        treatment_id: '',
        price: '',
        currency: 'USD',
        description: ''
      });
      
      setSuccess('Treatment price added successfully');
      setLoading2(false);
    } catch (error) {
      console.error('Error adding treatment price:', error);
      
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Error adding treatment price. Please try again.');
      }
      
      setLoading2(false);
    }
  };
  
  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Get user initials
  const getUserInitials = (name) => {
    if (!name) return '?';
    
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Effect to apply filters when filter changes
  useEffect(() => {
    applyFilters();
  }, [filter, bookings]);
  
  // Render loading state
  if (loading && loading2) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Provider Dashboard</DashboardTitle>
        <DashboardSubtitle>Manage your medical provider profile, bookings, and patients</DashboardSubtitle>
      </DashboardHeader>
      
      <DashboardGrid>
        <DashboardSidebar>
          <h3>Provider Menu</h3>
          
          <DashboardNav>
            <NavItem 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-th-large"></i> Dashboard Overview
            </NavItem>
            
            <NavItem 
              active={activeTab === 'bookings'}
              onClick={() => setActiveTab('bookings')}
            >
              <i className="fas fa-calendar-check"></i> Manage Bookings
            </NavItem>
            
            <NavItem 
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-hospital-alt"></i> Provider Profile
            </NavItem>
            
            <NavItem 
              active={activeTab === 'treatments'}
              onClick={() => setActiveTab('treatments')}
            >
              <i className="fas fa-procedures"></i> Treatments & Prices
            </NavItem>
          </DashboardNav>
        </DashboardSidebar>
        
        <ContentSection>
          {activeTab === 'overview' && (
            <>
              <SectionTitle>Dashboard Overview</SectionTitle>
              
              <StatsGrid>
                <StatCard color="96, 108, 56">
                  <StatIcon color="96, 108, 56">
                    <i className="fas fa-calendar-check"></i>
                  </StatIcon>
                  <StatValue color="96, 108, 56">{stats.totalBookings}</StatValue>
                  <StatLabel>Total Bookings</StatLabel>
                </StatCard>
                
                <StatCard color="255, 152, 0">
                  <StatIcon color="255, 152, 0">
                    <i className="fas fa-clock"></i>
                  </StatIcon>
                  <StatValue color="255, 152, 0">{stats.pendingBookings}</StatValue>
                  <StatLabel>Pending Bookings</StatLabel>
                </StatCard>
                
                <StatCard color="76, 175, 80">
                  <StatIcon color="76, 175, 80">
                    <i className="fas fa-check-circle"></i>
                  </StatIcon>
                  <StatValue color="76, 175, 80">{stats.confirmedBookings}</StatValue>
                  <StatLabel>Confirmed Bookings</StatLabel>
                </StatCard>
                
                <StatCard color="33, 150, 243">
                  <StatIcon color="33, 150, 243">
                    <i className="fas fa-flag-checkered"></i>
                  </StatIcon>
                  <StatValue color="33, 150, 243">{stats.completedBookings}</StatValue>
                  <StatLabel>Completed Bookings</StatLabel>
                </StatCard>
                
                <StatCard color="244, 67, 54">
                  <StatIcon color="244, 67, 54">
                    <i className="fas fa-times-circle"></i>
                  </StatIcon>
                  <StatValue color="244, 67, 54">{stats.cancelledBookings}</StatValue>
                  <StatLabel>Cancelled Bookings</StatLabel>
                </StatCard>
                
                <StatCard color="40, 167, 69">
                  <StatIcon color="40, 167, 69">
                    <i className="fas fa-dollar-sign"></i>
                  </StatIcon>
                  <StatValue color="40, 167, 69">${stats.revenue.toLocaleString()}</StatValue>
                  <StatLabel>Total Revenue</StatLabel>
                </StatCard>
              </StatsGrid>
              
              <h3>Recent Bookings</h3>
              
              {filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.slice(0, 3).map(booking => (
                  <BookingCard key={booking.id}>
                    <BookingHeader status={booking.status}>
                      <BookingTitle>Booking #{booking.id}</BookingTitle>
                      <BookingStatus status={booking.status}>
                        {formatStatus(booking.status)}
                      </BookingStatus>
                    </BookingHeader>
                    
                    <BookingBody>
                      <BookingPatient>
                        <PatientIcon>
                          {getUserInitials(booking.user.full_name)}
                        </PatientIcon>
                        <PatientInfo>
                          <div className="name">{booking.user.full_name}</div>
                          <div className="email">{booking.user.email}</div>
                        </PatientInfo>
                      </BookingPatient>
                      
                      <BookingGrid>
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
                      </BookingGrid>
                    </BookingBody>
                  </BookingCard>
                ))
              ) : (
                <EmptyState>
                  <i className="far fa-calendar-alt fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
                  <h3>No Bookings Yet</h3>
                  <p>You don't have any bookings yet.</p>
                </EmptyState>
              )}
            </>
          )}
          
          {activeTab === 'bookings' && (
            <>
              <SectionTitle>Manage Bookings</SectionTitle>
              
              <FilterBar>
                <div>
                  <FilterSelect 
                    name="status" 
                    value={filter.status} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </FilterSelect>
                </div>
                
                <div>
                  <FilterInput
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <FilterInput
                    type="text"
                    name="search"
                    placeholder="Search by patient or treatment..."
                    value={filter.search}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <ClearButton onClick={clearFilters}>
                  Clear Filters
                </ClearButton>
              </FilterBar>
              
              {filteredBookings && filteredBookings.length > 0 ? (
                filteredBookings.map(booking => (
                  <BookingCard key={booking.id}>
                    <BookingHeader status={booking.status}>
                      <BookingTitle>Booking #{booking.id}</BookingTitle>
                      <BookingStatus status={booking.status}>
                        {formatStatus(booking.status)}
                      </BookingStatus>
                    </BookingHeader>
                    
                    <BookingBody>
                      <BookingPatient>
                        <PatientIcon>
                          {getUserInitials(booking.user.full_name)}
                        </PatientIcon>
                        <PatientInfo>
                          <div className="name">{booking.user.full_name}</div>
                          <div className="email">{booking.user.email}</div>
                        </PatientInfo>
                      </BookingPatient>
                      
                      <BookingGrid>
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
                        
                        <BookingDetail>
                          <div className="label">Booked On</div>
                          <div className="value">{formatDate(booking.created_at)}</div>
                        </BookingDetail>
                      </BookingGrid>
                      
                      {booking.special_requests && (
                        <BookingDetail style={{ marginTop: '1rem' }}>
                          <div className="label">Special Requests</div>
                          <div className="value">{booking.special_requests}</div>
                        </BookingDetail>
                      )}
                    </BookingBody>
                    
                    <BookingFooter>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '1rem' }}>Update Status:</div>
                        <StatusSelect 
                          value={updatedStatuses[booking.id] || booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          disabled={booking.status === 'cancelled'}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </StatusSelect>
                      </div>
                      
                      <UpdateButton 
                        onClick={() => updateStatus(booking.id)}
                        disabled={
                          statusUpdating === booking.id || 
                          !updatedStatuses[booking.id] || 
                          updatedStatuses[booking.id] === booking.status ||
                          booking.status === 'cancelled'
                        }
                      >
                        {statusUpdating === booking.id ? 'Updating...' : 'Update Status'}
                      </UpdateButton>
                    </BookingFooter>
                  </BookingCard>
                ))
              ) : (
                <EmptyState>
                  <i className="far fa-calendar-alt fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
                  <h3>No Bookings Found</h3>
                  <p>No bookings match your current filters.</p>
                </EmptyState>
              )}
            </>
          )}
          
          {activeTab === 'profile' && (
            <>
              <SectionTitle>Provider Profile</SectionTitle>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <form onSubmit={handleProfileUpdate}>
                <FormGroup>
                  <FormLabel htmlFor="name">Provider Name</FormLabel>
                  <FormInput
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="description">Provider Description</FormLabel>
                  <FormTextarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormGroup>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <FormInput
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <FormInput
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormGroup>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormInput
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="phone">Phone</FormLabel>
                    <FormInput
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormGroup>
                    <FormLabel htmlFor="website">Website (Optional)</FormLabel>
                    <FormInput
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="license_number">License Number (Optional)</FormLabel>
                    <FormInput
                      id="license_number"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormGroup>
                    <FormLabel htmlFor="specialty_ids">Specialties</FormLabel>
                    <FormSelect
                      id="specialty_ids"
                      name="specialty_ids"
                      multiple
                      size="5"
                      value={formData.specialty_ids}
                      onChange={handleMultiSelectChange}
                      required
                    >
                      {specialties.map(specialty => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </FormSelect>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '0.5rem' }}>
                      Hold Ctrl/Cmd key to select multiple
                    </div>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="treatment_ids">Treatments Offered</FormLabel>
                    <FormSelect
                      id="treatment_ids"
                      name="treatment_ids"
                      multiple
                      size="5"
                      value={formData.treatment_ids}
                      onChange={handleMultiSelectChange}
                      required
                    >
                      {treatments.map(treatment => (
                        <option key={treatment.id} value={treatment.id}>
                          {treatment.name}
                        </option>
                      ))}
                    </FormSelect>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)', marginTop: '0.5rem' }}>
                      Hold Ctrl/Cmd key to select multiple
                    </div>
                  </FormGroup>
                </div>
                
                <FormActions>
                  <FormButton type="button" className="secondary">
                    Cancel
                  </FormButton>
                  <FormButton type="submit" className="primary" disabled={loading2}>
                    {loading2 ? 'Saving...' : (providerProfile ? 'Update Profile' : 'Create Profile')}
                  </FormButton>
                </FormActions>
              </form>
            </>
          )}
          
          {activeTab === 'treatments' && (
            <>
              <SectionTitle>Treatments & Prices</SectionTitle>
              
              {!providerProfile ? (
                <ErrorMessage>
                  Please create a provider profile first before adding treatment prices.
                </ErrorMessage>
              ) : (
                <>
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  {success && <SuccessMessage>{success}</SuccessMessage>}
                  
                  <h3>Current Treatment Prices</h3>
                  
                  {treatmentPrices.length > 0 ? (
                    <TreatmentTable>
                      <thead>
                        <tr>
                          <th>Treatment</th>
                          <th>Description</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {treatmentPrices.map(tp => (
                          <tr key={tp.id}>
                            <td>{tp.treatment.name}</td>
                            <td>{tp.description || tp.treatment.description}</td>
                            <td>${tp.price.toLocaleString()} {tp.currency}</td>
                            <td>
                              <ActionButton>
                                <i className="fas fa-edit"></i>
                              </ActionButton>
                              <ActionButton className="delete">
                                <i className="fas fa-trash-alt"></i>
                              </ActionButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </TreatmentTable>
                  ) : (
                    <EmptyState>
                      <i className="fas fa-tags fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
                      <h3>No Treatment Prices</h3>
                      <p>You haven't added any treatment prices yet.</p>
                    </EmptyState>
                  )}
                  
                  <h3 style={{ marginTop: '2rem' }}>Add New Treatment Price</h3>
                  
                  <form onSubmit={handleAddTreatmentPrice}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                      <FormGroup>
                        <FormLabel htmlFor="treatment_id">Treatment</FormLabel>
                        <FormSelect
                          id="treatment_id"
                          name="treatment_id"
                          value={treatmentPriceForm.treatment_id}
                          onChange={handleTreatmentPriceChange}
                          required
                        >
                          <option value="">Select Treatment</option>
                          {treatments
                            .filter(t => formData.treatment_ids.includes(t.id))
                            .map(treatment => (
                              <option key={treatment.id} value={treatment.id}>
                                {treatment.name}
                              </option>
                            ))}
                        </FormSelect>
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel htmlFor="price">Price</FormLabel>
                        <FormInput
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={treatmentPriceForm.price}
                          onChange={handleTreatmentPriceChange}
                          required
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel htmlFor="currency">Currency</FormLabel>
                        <FormSelect
                          id="currency"
                          name="currency"
                          value={treatmentPriceForm.currency}
                          onChange={handleTreatmentPriceChange}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </FormSelect>
                      </FormGroup>
                    </div>
                    
                    <FormGroup>
                      <FormLabel htmlFor="description">Description (Optional)</FormLabel>
                      <FormTextarea
                        id="description"
                        name="description"
                        value={treatmentPriceForm.description}
                        onChange={handleTreatmentPriceChange}
                        placeholder="Add any specific details about this treatment..."
                      />
                    </FormGroup>
                    
                    <FormActions>
                      <FormButton type="button" className="secondary" onClick={() => {
                        setTreatmentPriceForm({
                          treatment_id: '',
                          price: '',
                          currency: 'USD',
                          description: ''
                        });
                        setError('');
                        setSuccess('');
                      }}>
                        Clear Form
                      </FormButton>
                      <FormButton type="submit" className="primary" disabled={loading2}>
                        {loading2 ? 'Adding...' : 'Add Treatment Price'}
                      </FormButton>
                    </FormActions>
                  </form>
                </>
              )}
            </>
          )}
        </ContentSection>
      </DashboardGrid>
    </DashboardContainer>
  );
}

export default ProviderDashboard;
