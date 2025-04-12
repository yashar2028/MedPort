import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PaymentForm from '../components/PaymentForm';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CheckoutHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-color);
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  
  &:not(:last-child)::after {
    content: "›";
    margin: 0 0.5rem;
    color: var(--gray-color);
  }
  
  a {
    color: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-color)'};
    text-decoration: none;
    font-weight: ${props => props.active ? '500' : 'normal'};
  }
`;

function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // For the purpose of this demo, we're using placeholder data
    // In a real app, you would fetch the booking data from your API
    setTimeout(() => {
      const demoBooking = {
        id: bookingId || '123',
        treatmentName: 'Hair Transplant - FUE Method',
        providerName: 'Istanbul Hair Clinic',
        providerLocation: 'Istanbul, Turkey',
        date: 'June 15, 2023',
        time: '10:00 AM',
        price: '2,500.00',
        fee: '125.00',
        total: '2,625.00',
        status: 'pending'
      };
      
      setBooking(demoBooking);
      setIsLoading(false);
    }, 1000);
  }, [bookingId, isAuthenticated, navigate]);
  
  const handlePaymentComplete = () => {
    // In a real app, you would update the booking status in your API
    console.log('Payment completed for booking:', bookingId);
  };
  
  if (isLoading) {
    return (
      <CheckoutContainer>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </CheckoutContainer>
    );
  }
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <h1>Checkout</h1>
        <p>Complete your booking by making a payment</p>
      </CheckoutHeader>
      
      <Breadcrumbs>
        <BreadcrumbItem>
          <a href="/providers">Search</a>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <a href={`/providers/${booking?.providerId || '1'}`}>Provider</a>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <a href="#">Booking</a>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <a href="#">Payment</a>
        </BreadcrumbItem>
      </Breadcrumbs>
      
      <PaymentForm 
        booking={booking} 
        onPaymentComplete={handlePaymentComplete} 
      />
    </CheckoutContainer>
  );
}

export default Checkout;