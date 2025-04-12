import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../utils/api';

const PaymentFormContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const CreditCardForm = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const InputGroup = styled.div`
  flex: 1;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--dark-color);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      border-color: var(--primary-color);
      outline: none;
      box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
    }
  }
`;

const PaymentButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
  
  i {
    margin-right: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #721c24;
  background-color: #f8d7da;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const CardInfo = styled.div`
  font-size: 0.9rem;
  color: var(--gray-color);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

function PaymentForm({ booking, paymentIntentSecret, onPaymentSuccess }) {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc || !cardDetails.cardholderName) {
      setError('Please fill in all card details');
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real app, this would use Stripe.js to handle the payment
      // For our placeholder, we'll just simulate a successful payment
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call our confirm-payment endpoint
      await api.post(`/payments/confirm-payment/${booking.id}`);
      
      // Notify parent component
      onPaymentSuccess();
    } catch (apiError) {
      console.error('Error processing payment:', apiError);
      setError('There was an error processing your payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <PaymentFormContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <form onSubmit={handleSubmit}>
        <CreditCardForm>
          <FormGroup>
            <InputGroup>
              <label htmlFor="cardholderName">Cardholder Name</label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                placeholder="John Smith"
                value={cardDetails.cardholderName}
                onChange={handleChange}
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <InputGroup>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                maxLength="19"
              />
            </InputGroup>
          </FormGroup>
          
          <FormRow>
            <InputGroup>
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleChange}
                maxLength="5"
              />
            </InputGroup>
            
            <InputGroup>
              <label htmlFor="cvc">CVC</label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={handleChange}
                maxLength="3"
              />
            </InputGroup>
          </FormRow>
        </CreditCardForm>
        
        <PaymentButton type="submit" disabled={processing}>
          {processing ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              <i className="fas fa-lock"></i> Pay ${booking?.treatment_price?.price} {booking?.treatment_price?.currency}
            </>
          )}
        </PaymentButton>
      </form>
      
      <CardInfo>
        <i className="fas fa-shield-alt"></i>
        Your payment information is secure and encrypted
      </CardInfo>
      
      <CardInfo style={{ marginTop: '0.5rem' }}>
        <i className="fas fa-info-circle"></i>
        This is a placeholder payment form for demonstration purposes only
      </CardInfo>
    </PaymentFormContainer>
  );
}

export default PaymentForm;