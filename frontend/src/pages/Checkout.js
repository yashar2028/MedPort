import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import { api } from '../utils/api';

const stripePromise = loadStripe('pk_test_51RURpIR8SHLd1Q5T4CIRvg210YQ5NfmRVRiT71YJKrHBg2pR9Bcpw9TmFIKm7K8PrSASSNOeJnUA3rufhgbD2IAo00O1e2uXki');

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
  const { isAuthenticated } = useSelector(state => state.auth);

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookingAndPaymentIntent = async () => {
      try {
        // 1. Fetch booking
        const bookingRes = await api.get(`/bookings/${bookingId}`);
        const bookingData = bookingRes.data;

        // 2. Create payment intent on backend
        const intentRes = await api.post('/payments/create-payment-intent', {
          booking_id: bookingId,
        });

        setBooking({
          ...bookingData,
          treatmentName: bookingData.treatment_price.name,
          providerName: bookingData.provider.name,
          providerLocation: bookingData.provider.location,
          date: new Date(bookingData.appointment_date).toLocaleDateString(),
          time: new Date(bookingData.appointment_date).toLocaleTimeString(),
          price: bookingData.treatment_price.price.toFixed(2),
          fee: (bookingData.treatment_price.price * 0.05).toFixed(2),
          total: (bookingData.treatment_price.price * 1.05).toFixed(2),
        });

        setClientSecret(intentRes.data.client_secret);
      } catch (err) {
        console.error(err);
        setError('Failed to load booking or payment.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingAndPaymentIntent();
  }, [bookingId, isAuthenticated, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !booking || !clientSecret) return <div>{error || 'Booking not found or payment failed.'}</div>;

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

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm booking={booking} bookingId={bookingId} />
      </Elements>
    </CheckoutContainer>
  );
}

export default Checkout;