import React, { useState } from 'react';
import styled from 'styled-components';

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

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--secondary-color);
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.2);
  }
`;

const CardDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
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
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // This is a placeholder function that simulates payment processing
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
  };
  
  if (isSuccess) {
    return (
      <PaymentContainer>
        <PaymentSuccess>
          <i className="fas fa-check-circle"></i>
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Thank you for using MedPort.</p>
          <Button as="a" href="/profile">View My Bookings</Button>
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
      
      <PaymentForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="cardName">Name on Card</Label>
          <Input
            id="cardName"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Smith"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            required
            maxLength="19"
          />
        </FormGroup>
        
        <CardDetailsContainer>
          <FormGroup>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
              maxLength="5"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              required
              maxLength="3"
            />
          </FormGroup>
        </CardDetailsContainer>
        
        <OrderSummary>
          <h3>Order Summary</h3>
          <SummaryItem>
            <span>Treatment:</span>
            <span>{booking?.treatmentName || 'Hair Transplant'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Provider:</span>
            <span>{booking?.providerName || 'Istanbul Hair Clinic'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Date:</span>
            <span>{booking?.date || 'June 15, 2023'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Subtotal:</span>
            <span>${booking?.price || '2,500.00'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Platform Fee:</span>
            <span>${booking?.fee || '125.00'}</span>
          </SummaryItem>
          <SummaryItem className="total">
            <span>Total:</span>
            <span>${booking?.total || '2,625.00'}</span>
          </SummaryItem>
        </OrderSummary>
        
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </PaymentForm>
    </PaymentContainer>
  );
}

export default PaymentFormComponent;