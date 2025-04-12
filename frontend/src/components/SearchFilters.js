import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';

const FilterContainer = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h4`
  margin-bottom: 1.25rem;
  color: var(--secondary-color);
  font-weight: 600;
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
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

const FilterInput = styled.input`
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

const FilterButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const ResetButton = styled.button`
  background-color: transparent;
  color: var(--gray-color);
  border: none;
  padding: 0;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

function SearchFilters({ onFilter }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [countries, setCountries] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    country: searchParams.get('country') || '',
    city: searchParams.get('city') || '',
    treatment_id: searchParams.get('treatment_id') || '',
    specialty_id: searchParams.get('specialty_id') || '',
    min_rating: searchParams.get('min_rating') || '',
    featured: searchParams.get('featured') || '',
    search: searchParams.get('search') || ''
  });
  
  // Fetch filter options data
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        
        // Fetch countries (using providers endpoint with aggregation)
        const providersResponse = await api.get('/providers');
        const uniqueCountries = [...new Set(providersResponse.data.map(p => p.country))].sort();
        setCountries(uniqueCountries);
        
        // Fetch treatments
        const treatmentsResponse = await api.get('/providers/treatments');
        setTreatments(treatmentsResponse.data);
        
        // Fetch specialties
        const specialtiesResponse = await api.get('/providers/specialties');
        setSpecialties(specialtiesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setLoading(false);
      }
    };
    
    fetchFilterData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: checked ? 'true' : ''
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    // Update URL and notify parent component
    navigate(`/providers?${params.toString()}`);
    
    if (onFilter) {
      onFilter(filters);
    }
  };
  
  const handleReset = () => {
    setFilters({
      country: '',
      city: '',
      treatment_id: '',
      specialty_id: '',
      min_rating: '',
      featured: '',
      search: ''
    });
    
    navigate('/providers');
    
    if (onFilter) {
      onFilter({});
    }
  };
  
  return (
    <FilterContainer>
      <FilterTitle>Find Your Perfect Provider</FilterTitle>
      <FilterForm onSubmit={handleSubmit}>
        <FilterGroup>
          <FilterLabel htmlFor="search">Search</FilterLabel>
          <FilterInput
            type="text"
            id="search"
            name="search"
            placeholder="Search providers..."
            value={filters.search}
            onChange={handleInputChange}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="country">Country</FilterLabel>
          <FilterSelect
            id="country"
            name="country"
            value={filters.country}
            onChange={handleInputChange}
          >
            <option value="">All Countries</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="city">City</FilterLabel>
          <FilterInput
            type="text"
            id="city"
            name="city"
            placeholder="Enter city..."
            value={filters.city}
            onChange={handleInputChange}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="treatment_id">Treatment</FilterLabel>
          <FilterSelect
            id="treatment_id"
            name="treatment_id"
            value={filters.treatment_id}
            onChange={handleInputChange}
          >
            <option value="">All Treatments</option>
            {treatments.map(treatment => (
              <option key={treatment.id} value={treatment.id}>{treatment.name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="specialty_id">Specialty</FilterLabel>
          <FilterSelect
            id="specialty_id"
            name="specialty_id"
            value={filters.specialty_id}
            onChange={handleInputChange}
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="min_rating">Minimum Rating</FilterLabel>
          <FilterSelect
            id="min_rating"
            name="min_rating"
            value={filters.min_rating}
            onChange={handleInputChange}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={filters.featured === 'true'}
            onChange={handleCheckboxChange}
          />
          <FilterLabel htmlFor="featured" style={{ margin: 0 }}>
            Featured Providers Only
          </FilterLabel>
        </FilterGroup>
        
        <FilterGroup style={{ gridColumn: '1 / -1' }}>
          <FilterButton type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Apply Filters'}
          </FilterButton>
          <ResetButton type="button" onClick={handleReset} disabled={loading}>
            Reset Filters
          </ResetButton>
        </FilterGroup>
      </FilterForm>
    </FilterContainer>
  );
}

export default SearchFilters;
