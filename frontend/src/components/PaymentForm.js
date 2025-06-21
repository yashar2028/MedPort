import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { api } from '../utils/api';

const PaymentContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PaymentHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--gray-color);
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const OrderSummary = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: 4px;

  h3 {
    margin-bottom: 1rem;
    color: var(--secondary-color);
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &.total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    font-weight: 700;
  }
`;

const PaymentSuccess = styled.div`
  text-align: center;
  padding: 2rem;

  i {
    font-size: 4rem;
    color: var(--success-color);
    margin-bottom: 1rem;
  }

  h2 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--gray-color);
    margin-bottom: 2rem;
  }
`;

function PaymentFormComponent({ booking, onPaymentComplete }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  setIsProcessing(true);
  setError(null);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: window.location.origin + '/profile',
    },
    redirect: 'if_required',
  });

  if (error) {
    setError(error.message);
    setIsProcessing(false);
    return;
  }

  if (paymentIntent?.status === 'succeeded') {
    try {
      await api.post(`/payments/confirm-payment/${booking.id}`);
    } catch (err) {
      console.error('Backend confirmation failed:', err);
      setError('Payment was successful but booking confirmation failed.');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
    setIsSuccess(true);
    if (onPaymentComplete) onPaymentComplete();
  } else {
    setIsProcessing(false);
  }
};

  if (isSuccess) {
    return (
      <PaymentContainer>
        <PaymentSuccess>
          <i className="fas fa-check-circle"></i>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Thank you for using MedPort. Please leave a review after receiving your service and completing your treatment.</p>
          <Button as={Link} href="/profile">View My Bookings</Button>
        </PaymentSuccess>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <PaymentHeader>
        <h2>Complete Your Payment</h2>
        <p>All transactions are secure and encrypted</p>
      </PaymentHeader>

      <StyledForm onSubmit={handleSubmit}>
        <PaymentElement />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <OrderSummary>
          <h3>Order Summary</h3>
          <SummaryItem>
            <span>Treatment:</span>
            <span>{booking?.treatmentName}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Provider:</span>
            <span>{booking?.providerName}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Date:</span>
            <span>{booking?.date}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Subtotal:</span>
            <span>${booking?.price}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Platform Fee:</span>
            <span>${booking?.fee}</span>
          </SummaryItem>
          <SummaryItem className="total">
            <span>Total:</span>
            <span>${booking?.total}</span>
          </SummaryItem>
        </OrderSummary>

        <Button type="submit" disabled={isProcessing || !stripe || !elements}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </StyledForm>
    </PaymentContainer>
  );
}

export default PaymentFormComponent;