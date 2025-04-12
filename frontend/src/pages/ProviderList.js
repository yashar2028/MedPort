import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProviders, fetchSpecialties, fetchTreatments, setProviderFilters } from '../store/providersSlice';

const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 2rem;
  text-align: center;
`;

const FiltersContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--secondary-color);
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  color: var(--dark-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.2);
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  color: var(--dark-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(96, 108, 56, 0.2);
  }
`;

const FilterButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ClearButton = styled.button`
  background-color: transparent;
  color: var(--gray-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  margin-left: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: var(--danger-color);
    border-color: var(--danger-color);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProviderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProviderImage = styled.div`
  height: 200px;
  background-color: var(--primary-color);
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ProviderContent = styled.div`
  padding: 1.5rem;
`;

const ProviderName = styled.h3`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const ProviderLocation = styled.p`
  color: var(--gray-color);
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const ProviderRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .stars {
    color: var(--accent-color);
    margin-right: 0.5rem;
  }
  
  .count {
    color: var(--gray-color);
    font-size: 0.875rem;
  }
`;

const ProviderSpecialties = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SpecialtyTag = styled.span`
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const ViewProfileButton = styled(Link)`
  display: block;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: var(--secondary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-color);
    margin-bottom: 1.5rem;
  }
`;

function generateProviderImage(name) {
  // Generate a deterministic image based on the provider name
  // In a real app, this would be a real image from the API
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
  return `https://images.unsplash.com/photo-${1550000000000 + nameHash}-abcdefghijkl?w=500&h=300&fit=crop`;
}

function ProviderList() {
  const dispatch = useDispatch();
  const { providers, specialties, treatments, isLoading, filter } = useSelector(state => state.providers);
  const [localFilter, setLocalFilter] = useState({
    country: '',
    city: '',
    treatmentId: '',
    specialtyId: '',
    minRating: '',
    featured: '',
    search: '',
  });
  
  useEffect(() => {
    dispatch(fetchProviders());
    dispatch(fetchSpecialties());
    dispatch(fetchTreatments());
  }, [dispatch]);
  
  useEffect(() => {
    // Initialize local filter from redux state
    setLocalFilter({
      country: filter.country || '',
      city: filter.city || '',
      treatmentId: filter.treatmentId || '',
      specialtyId: filter.specialtyId || '',
      minRating: filter.minRating || '',
      featured: filter.featured === true ? 'true' : 
                filter.featured === false ? 'false' : '',
      search: filter.search || '',
    });
  }, [filter]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFilterSubmit = () => {
    // Convert string values to appropriate types
    const formattedFilter = {
      ...localFilter,
      treatmentId: localFilter.treatmentId ? Number(localFilter.treatmentId) : null,
      specialtyId: localFilter.specialtyId ? Number(localFilter.specialtyId) : null,
      minRating: localFilter.minRating ? Number(localFilter.minRating) : null,
      featured: localFilter.featured === 'true' ? true : 
                localFilter.featured === 'false' ? false : null,
    };
    
    dispatch(setProviderFilters(formattedFilter));
  };
  
  const clearFilters = () => {
    setLocalFilter({
      country: '',
      city: '',
      treatmentId: '',
      specialtyId: '',
      minRating: '',
      featured: '',
      search: '',
    });
    
    dispatch(setProviderFilters({
      country: '',
      city: '',
      treatmentId: null,
      specialtyId: null,
      minRating: null,
      featured: null,
      search: '',
    }));
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };
  
  return (
    <PageContainer>
      <PageTitle>Find Healthcare Providers</PageTitle>
      
      <FiltersContainer>
        <FilterGroup>
          <div>
            <FilterLabel htmlFor="search">Search</FilterLabel>
            <FilterInput
              type="text"
              id="search"
              name="search"
              placeholder="Search providers..."
              value={localFilter.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <div>
            <FilterLabel htmlFor="country">Country</FilterLabel>
            <FilterSelect
              id="country"
              name="country"
              value={localFilter.country}
              onChange={handleFilterChange}
            >
              <option value="">All Countries</option>
              <option value="turkey">Turkey</option>
              <option value="thailand">Thailand</option>
              <option value="india">India</option>
              <option value="mexico">Mexico</option>
              <option value="brazil">Brazil</option>
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel htmlFor="city">City</FilterLabel>
            <FilterInput
              type="text"
              id="city"
              name="city"
              placeholder="City..."
              value={localFilter.city}
              onChange={handleFilterChange}
            />
          </div>
        </FilterGroup>
        
        <FilterGroup>
          <div>
            <FilterLabel htmlFor="treatmentId">Treatment</FilterLabel>
            <FilterSelect
              id="treatmentId"
              name="treatmentId"
              value={localFilter.treatmentId}
              onChange={handleFilterChange}
            >
              <option value="">All Treatments</option>
              {treatments.map(treatment => (
                <option key={treatment.id} value={treatment.id}>
                  {treatment.name}
                </option>
              ))}
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel htmlFor="specialtyId">Specialty</FilterLabel>
            <FilterSelect
              id="specialtyId"
              name="specialtyId"
              value={localFilter.specialtyId}
              onChange={handleFilterChange}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel htmlFor="minRating">Minimum Rating</FilterLabel>
            <FilterSelect
              id="minRating"
              name="minRating"
              value={localFilter.minRating}
              onChange={handleFilterChange}
            >
              <option value="">Any Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </FilterSelect>
          </div>
          
          <div>
            <FilterLabel htmlFor="featured">Featured</FilterLabel>
            <FilterSelect
              id="featured"
              name="featured"
              value={localFilter.featured}
              onChange={handleFilterChange}
            >
              <option value="">All Providers</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </FilterSelect>
          </div>
        </FilterGroup>
        
        <ButtonContainer>
          <ClearButton onClick={clearFilters}>Clear Filters</ClearButton>
          <FilterButton onClick={handleFilterSubmit}>Apply Filters</FilterButton>
        </ButtonContainer>
      </FiltersContainer>
      
      {isLoading ? (
        <LoadingContainer>
          <div className="spinner"></div>
        </LoadingContainer>
      ) : providers.length === 0 ? (
        <EmptyState>
          <h3>No Providers Found</h3>
          <p>Try adjusting your filters or search to find healthcare providers.</p>
          <FilterButton onClick={clearFilters}>Clear All Filters</FilterButton>
        </EmptyState>
      ) : (
        <ProvidersGrid>
          {providers.map(provider => (
            <ProviderCard key={provider.id}>
              <ProviderImage>
                <img
                  src={generateProviderImage(provider.name)}
                  alt={provider.name}
                />
                {provider.featured && <FeaturedBadge>Featured</FeaturedBadge>}
              </ProviderImage>
              
              <ProviderContent>
                <ProviderName>{provider.name}</ProviderName>
                <ProviderLocation>
                  <i className="fas fa-map-marker-alt mr-1"></i> {provider.city}, {provider.country}
                </ProviderLocation>
                
                <ProviderRating>
                  <div className="stars">
                    {renderStars(provider.average_rating)}
                  </div>
                  <div className="count">
                    ({provider.total_reviews} reviews)
                  </div>
                </ProviderRating>
                
                <ProviderSpecialties>
                  {provider.specialties.slice(0, 3).map(specialty => (
                    <SpecialtyTag key={specialty.id}>
                      {specialty.name}
                    </SpecialtyTag>
                  ))}
                  {provider.specialties.length > 3 && (
                    <SpecialtyTag>+{provider.specialties.length - 3} more</SpecialtyTag>
                  )}
                </ProviderSpecialties>
                
                <ViewProfileButton to={`/providers/${provider.id}`}>
                  View Profile
                </ViewProfileButton>
              </ProviderContent>
            </ProviderCard>
          ))}
        </ProvidersGrid>
      )}
    </PageContainer>
  );
}

export default ProviderList;