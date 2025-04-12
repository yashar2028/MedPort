import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';
import PaymentForm from '../components/PaymentForm';
import { formatDate } from '../utils/helpers';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--gray-color);
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutSection = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
`;

const BookingDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const BookingRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BookingLabel = styled.div`
  font-weight: 500;
  color: var(--dark-color);
`;

const BookingValue = styled.div`
  color: var(--gray-color);
`;

const ProviderCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: rgba(96, 108, 56, 0.05);
  border-radius: 6px;
  margin-bottom: 1.5rem;
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

const PriceSummary = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &.total {
    font-weight: 700;
    font-size: 1.2rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px dashed var(--border-color);
    color: var(--secondary-color);
  }
`;

const PriceLabel = styled.div``;

const PriceValue = styled.div``;

const BookingStatus = styled.div`
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(96, 108, 56, 0.2);
    border-top: 5px solid var(--primary-color);
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
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch booking data and create payment intent
  useEffect(() => {
    const fetchBookingAndCreatePayment = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch booking details
        const bookingResponse = await api.get(`/bookings/${bookingId}`);
        setBooking(bookingResponse.data);
        
        // Check if booking is already paid
        if (bookingResponse.data.status === 'confirmed') {
          setPaymentSuccess(true);
          setLoading(false);
          return;
        }
        
        // Create payment intent
        const paymentResponse = await api.post(`/payments/create-payment-intent`, {
          booking_id: parseInt(bookingId, 10)
        });
        
        setClientSecret(paymentResponse.data.client_secret);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        
        if (error.response && error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
        } else {
          setError('Error loading booking information. Please try again.');
        }
        
        setLoading(false);
      }
    };
    
    fetchBookingAndCreatePayment();
  }, [bookingId]);
  
  // Handle payment success
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Update booking status in local state
    if (booking) {
      setBooking({
        ...booking,
        status: 'confirmed'
      });
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/profile')}
          >
            Go to My Bookings
          </button>
        </div>
      </PageContainer>
    );
  }
  
  if (!booking) {
    return (
      <PageContainer>
        <ErrorMessage>Booking information not found</ErrorMessage>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/profile')}
          >
            Go to My Bookings
          </button>
        </div>
      </PageContainer>
    );
  }
  
  const { provider, treatment_price } = booking;
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Checkout</PageTitle>
        <PageDescription>Complete your booking payment</PageDescription>
      </PageHeader>
      
      {paymentSuccess ? (
        <SuccessMessage>
          <i className="fas fa-check-circle fa-3x mb-3"></i>
          <h3>Payment Successful!</h3>
          <p>Your booking has been confirmed. Thank you for using MedPort!</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/profile" className="btn btn-primary">
              View My Bookings
            </Link>
          </div>
        </SuccessMessage>
      ) : (
        <CheckoutGrid>
          <div>
            <CheckoutSection>
              <SectionTitle>Booking Details</SectionTitle>
              
              <ProviderCard>
                <ProviderIcon>
                  <i className="fas fa-hospital-alt"></i>
                </ProviderIcon>
                <ProviderInfo>
                  <ProviderName to={`/providers/${provider.id}`}>
                    {provider.name}
                  </ProviderName>
                  <ProviderLocation>
                    {provider.city}, {provider.country}
                  </ProviderLocation>
                </ProviderInfo>
              </ProviderCard>
              
              <BookingDetails>
                <BookingRow>
                  <BookingLabel>Treatment</BookingLabel>
                  <BookingValue>{treatment_price.treatment.name}</BookingValue>
                </BookingRow>
                
                <BookingRow>
                  <BookingLabel>Appointment Date</BookingLabel>
                  <BookingValue>{formatDate(booking.appointment_date)}</BookingValue>
                </BookingRow>
                
                <BookingRow>
                  <BookingLabel>Booking Status</BookingLabel>
                  <BookingValue>
                    <BookingStatus status={booking.status}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </BookingStatus>
                  </BookingValue>
                </BookingRow>
                
                {booking.special_requests && (
                  <BookingRow>
                    <BookingLabel>Special Requests</BookingLabel>
                    <BookingValue>{booking.special_requests}</BookingValue>
                  </BookingRow>
                )}
              </BookingDetails>
              
              <PriceSummary>
                <PriceRow>
                  <PriceLabel>Treatment Price</PriceLabel>
                  <PriceValue>${treatment_price.price.toLocaleString()} {treatment_price.currency}</PriceValue>
                </PriceRow>
                
                {/* You can add more items here like taxes, fees, etc. */}
                
                <PriceRow className="total">
                  <PriceLabel>Total</PriceLabel>
                  <PriceValue>${treatment_price.price.toLocaleString()} {treatment_price.currency}</PriceValue>
                </PriceRow>
              </PriceSummary>
            </CheckoutSection>
          </div>
          
          <div>
            <CheckoutSection>
              <SectionTitle>Payment Information</SectionTitle>
              
              <PaymentForm 
                booking={booking}
                paymentIntentSecret={clientSecret}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </CheckoutSection>
          </div>
        </CheckoutGrid>
      )}
    </PageContainer>
  );
}

export default Checkout;
