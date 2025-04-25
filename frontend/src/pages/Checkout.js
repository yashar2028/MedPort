import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PaymentForm from '../components/PaymentForm';
import { api } from '../utils/api';

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
  const [error, setError] = useState('');
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load booking.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isAuthenticated, navigate]);

  const handlePaymentComplete = () => {
    // You’ll wire this to Stripe or similar later
    console.log('Payment completed for booking:', bookingId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !booking) {
    return <div>{error || 'Booking not found.'}</div>;
  }
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <h1>Checkout</h1>
        <p>Complete your booking by making a payment</p>
      </CheckoutHeader>

      <Breadcrumbs>
        <BreadcrumbItem><a href="/providers">Search</a></BreadcrumbItem>
        <BreadcrumbItem><a href={`/providers/${booking.provider.id}`}>{booking.provider.name}</a></BreadcrumbItem>
        <BreadcrumbItem><a href="#">Booking</a></BreadcrumbItem>
        <BreadcrumbItem active><a href="#">Payment</a></BreadcrumbItem>
      </Breadcrumbs>

      <PaymentForm 
        booking={{
          ...booking,
          treatmentName: booking.treatment_price.name,
          providerName: booking.provider.name,
          providerLocation: booking.provider.location,
          date: new Date(booking.appointment_date).toLocaleDateString(),
          time: new Date(booking.appointment_date).toLocaleTimeString(),
          price: booking.treatment_price.price.toFixed(2),
          fee: (booking.treatment_price.price * 0.05).toFixed(2), // example 5% fee
          total: (booking.treatment_price.price * 1.05).toFixed(2),
        }} 
        onPaymentComplete={handlePaymentComplete} 
      />
    </CheckoutContainer>
  );
}

export default Checkout;