import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';

const ComparisonContainer = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ComparisonHeader = styled.div`
  margin-bottom: 2rem;
`;

const ComparisonTitle = styled.h4`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const ComparisonDescription = styled.p`
  color: var(--gray-color);
  font-size: 0.9rem;
`;

const ComparisonForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SelectLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--white-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.1);
  }
`;

const CompareButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const ComparisonResults = styled.div`
  overflow-x: auto;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background-color: rgba(96, 108, 56, 0.1);
    color: var(--secondary-color);
    font-weight: 600;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: rgba(96, 108, 56, 0.05);
  }
`;

const ProviderCell = styled.td`
  min-width: 200px;
`;

const ProviderName = styled.div`
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 0.25rem;
`;

const ProviderLocation = styled.div`
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const RatingCell = styled.td`
  min-width: 120px;
`;

const RatingStars = styled.div`
  color: #ffc107;
  margin-bottom: 0.25rem;
`;

const RatingCount = styled.div`
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const PriceCell = styled.td`
  min-width: 120px;
  font-weight: 600;
  color: var(--primary-color);
`;

const ActionCell = styled.td`
  min-width: 150px;
`;

const ViewButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
`;

function ComparisonTool() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [comparisonResults, setComparisonResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch providers and treatments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch providers
        const providersResponse = await api.get('/providers');
        setProviders(providersResponse.data);
        
        // Fetch treatments
        const treatmentsResponse = await api.get('/providers/treatments');
        setTreatments(treatmentsResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle provider selection
  const handleProviderChange = (e, index) => {
    const value = e.target.value;
    const newSelected = [...selectedProviders];
    
    if (value === '') {
      newSelected[index] = null;
    } else {
      const providerId = parseInt(value, 10);
      newSelected[index] = providerId;
    }
    
    setSelectedProviders(newSelected);
  };
  
  // Handle treatment selection
  const handleTreatmentChange = (e) => {
    setSelectedTreatment(e.target.value);
  };
  
  // Perform comparison
  const handleCompare = async () => {
    try {
      setIsLoading(true);
      
      // Filter out any null values
      const providerIds = selectedProviders.filter(id => id !== null);
      
      if (providerIds.length < 2) {
        alert('Please select at least two providers to compare');
        setIsLoading(false);
        return;
      }
      
      // Fetch detailed provider information
      const results = [];
      
      for (const providerId of providerIds) {
        const providerResponse = await api.get(`/providers/${providerId}`);
        const provider = providerResponse.data;
        
        // Find treatment price if treatment is selected
        let treatmentPrice = null;
        if (selectedTreatment) {
          const treatmentId = parseInt(selectedTreatment, 10);
          treatmentPrice = provider.treatment_prices.find(
            tp => tp.treatment.id === treatmentId
          );
        }
        
        results.push({
          ...provider,
          selected_treatment_price: treatmentPrice
        });
      }
      
      setComparisonResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error('Error performing comparison:', error);
      setIsLoading(false);
    }
  };
  
  // Render stars for ratings
  const renderStars = (rating) => {
    let stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    
    return stars;
  };
  
  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <ComparisonTitle>Compare Providers Side by Side</ComparisonTitle>
        <ComparisonDescription>
          Select providers and a treatment to compare prices, ratings, and services
        </ComparisonDescription>
      </ComparisonHeader>
      
      <ComparisonForm>
        <SelectContainer>
          <SelectLabel>Provider 1</SelectLabel>
          <StyledSelect 
            value={selectedProviders[0] || ''}
            onChange={(e) => handleProviderChange(e, 0)}
            disabled={isLoading}
          >
            <option value="">Select Provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} ({provider.city}, {provider.country})
              </option>
            ))}
          </StyledSelect>
        </SelectContainer>
        
        <SelectContainer>
          <SelectLabel>Provider 2</SelectLabel>
          <StyledSelect 
            value={selectedProviders[1] || ''}
            onChange={(e) => handleProviderChange(e, 1)}
            disabled={isLoading}
          >
            <option value="">Select Provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} ({provider.city}, {provider.country})
              </option>
            ))}
          </StyledSelect>
        </SelectContainer>
        
        <SelectContainer>
          <SelectLabel>Provider 3 (Optional)</SelectLabel>
          <StyledSelect 
            value={selectedProviders[2] || ''}
            onChange={(e) => handleProviderChange(e, 2)}
            disabled={isLoading}
          >
            <option value="">Select Provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name} ({provider.city}, {provider.country})
              </option>
            ))}
          </StyledSelect>
        </SelectContainer>
      </ComparisonForm>
      
      <SelectContainer style={{ marginBottom: '1.5rem' }}>
        <SelectLabel>Treatment (Optional)</SelectLabel>
        <StyledSelect 
          value={selectedTreatment}
          onChange={handleTreatmentChange}
          disabled={isLoading}
        >
          <option value="">All Treatments</option>
          {treatments.map(treatment => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.name}
            </option>
          ))}
        </StyledSelect>
      </SelectContainer>
      
      <CompareButton 
        onClick={handleCompare}
        disabled={isLoading || selectedProviders.filter(Boolean).length < 2}
      >
        {isLoading ? 'Loading...' : 'Compare Now'}
      </CompareButton>
      
      {comparisonResults.length > 0 && (
        <ComparisonResults>
          <ComparisonTable>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Rating</th>
                <th>Specialties</th>
                {selectedTreatment && <th>Price</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.map(provider => (
                <tr key={provider.id}>
                  <ProviderCell>
                    <ProviderName>{provider.name}</ProviderName>
                    <ProviderLocation>
                      {provider.city}, {provider.country}
                    </ProviderLocation>
                  </ProviderCell>
                  <RatingCell>
                    <RatingStars>
                      {renderStars(provider.average_rating)}
                    </RatingStars>
                    <RatingCount>
                      ({provider.total_reviews} reviews)
                    </RatingCount>
                  </RatingCell>
                  <td>
                    {provider.specialties.slice(0, 3).map(specialty => (
                      <div key={specialty.id}>{specialty.name}</div>
                    ))}
                    {provider.specialties.length > 3 && (
                      <div>+{provider.specialties.length - 3} more</div>
                    )}
                  </td>
                  {selectedTreatment && (
                    <PriceCell>
                      {provider.selected_treatment_price
                        ? `$${provider.selected_treatment_price.price.toLocaleString()}`
                        : 'Not available'}
                    </PriceCell>
                  )}
                  <ActionCell>
                    <ViewButton onClick={() => navigate(`/providers/${provider.id}`)}>
                      View Details
                    </ViewButton>
                  </ActionCell>
                </tr>
              ))}
            </tbody>
          </ComparisonTable>
        </ComparisonResults>
      )}
      
      {comparisonResults.length === 0 && !isLoading && (
        <EmptyState>
          <i className="fas fa-balance-scale fa-3x mb-3"></i>
          <p>Select providers and click "Compare Now" to see a side-by-side comparison</p>
        </EmptyState>
      )}
    </ComparisonContainer>
  );
}

export default ComparisonTool;
