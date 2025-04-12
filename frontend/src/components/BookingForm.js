import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';

const FormContainer = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const FormTitle = styled.h4`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--white-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--white-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
  
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--white-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const PriceDisplay = styled.div`
  background-color: rgba(96, 108, 56, 0.1);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PriceLabel = styled.div`
  font-weight: 500;
  color: var(--dark-color);
`;

const PriceValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.75rem;
  width: 100%;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

function BookingForm({ provider, isAuthenticated, onLoginRequired }) {
  const navigate = useNavigate();
  const [treatmentPrices, setTreatmentPrices] = useState([]);
  const [selectedTreatmentPrice, setSelectedTreatmentPrice] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Set maximum date to 1 year from now
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  // Get treatment prices for this provider
  useEffect(() => {
    if (provider && provider.treatment_prices) {
      setTreatmentPrices(provider.treatment_prices);
    }
  }, [provider]);
  
  // Handle treatment price selection
  const handleTreatmentChange = (e) => {
    setSelectedTreatmentPrice(e.target.value);
  };
  
  // Handle appointment date change
  const handleDateChange = (e) => {
    setAppointmentDate(e.target.value);
  };
  
  // Handle special requests change
  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
  };
  
  // Calculate selected treatment price
  const getSelectedPrice = () => {
    if (!selectedTreatmentPrice) return null;
    
    const selected = treatmentPrices.find(
      tp => tp.id.toString() === selectedTreatmentPrice
    );
    
    return selected ? selected.price : null;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }
    
    // Validate form
    if (!selectedTreatmentPrice) {
      setError('Please select a treatment');
      return;
    }
    
    if (!appointmentDate) {
      setError('Please select an appointment date');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      // Prepare booking data
      const bookingData = {
        provider_id: provider.id,
        treatment_price_id: parseInt(selectedTreatmentPrice, 10),
        appointment_date: new Date(appointmentDate).toISOString(),
        special_requests: specialRequests
      };
      
      // Create booking
      const response = await api.post('/bookings', bookingData);
      
      // Navigate to checkout
      navigate(`/checkout/${response.data.id}`);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Error creating booking. Please try again.');
      } else {
        setError('Error creating booking. Please try again.');
      }
      
      setIsLoading(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>Book Your Appointment</FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="treatment">Select Treatment</FormLabel>
          <FormSelect
            id="treatment"
            value={selectedTreatmentPrice}
            onChange={handleTreatmentChange}
            required
          >
            <option value="">Choose a treatment</option>
            {treatmentPrices.map(tp => (
              <option key={tp.id} value={tp.id}>
                {tp.treatment.name} - ${tp.price.toLocaleString()}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="date">Appointment Date</FormLabel>
          <FormInput
            id="date"
            type="date"
            value={appointmentDate}
            onChange={handleDateChange}
            min={minDate}
            max={maxDateStr}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="special-requests">Special Requests (Optional)</FormLabel>
          <FormTextarea
            id="special-requests"
            value={specialRequests}
            onChange={handleSpecialRequestsChange}
            placeholder="Any special requirements or medical information you want the provider to know..."
          />
        </FormGroup>
        
        {selectedTreatmentPrice && (
          <PriceDisplay>
            <PriceLabel>Total Price:</PriceLabel>
            <PriceValue>${getSelectedPrice()?.toLocaleString()}</PriceValue>
          </PriceDisplay>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Book Now'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
}

export default BookingForm;
