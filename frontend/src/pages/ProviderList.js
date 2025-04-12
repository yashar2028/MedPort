import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';
import ProviderCard from '../components/ProviderCard';
import SearchFilters from '../components/SearchFilters';
import ComparisonTool from '../components/ComparisonTool';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: var(--gray-color);
  max-width: 800px;
`;

const ProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  color: var(--gray-color);
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: var(--dark-color);
  margin-bottom: 1.5rem;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const LoadingCard = styled.div`
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 10px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const PaginationButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--white-color)'};
  color: ${props => props.active ? 'var(--white-color)' : 'var(--dark-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'rgba(96, 108, 56, 0.1)'};
  }
  
  &:disabled {
    background-color: var(--border-color);
    color: var(--gray-color);
    cursor: not-allowed;
  }
`;

function ProviderList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    country: queryParams.get('country') || '',
    city: queryParams.get('city') || '',
    treatment_id: queryParams.get('treatment_id') || '',
    specialty_id: queryParams.get('specialty_id') || '',
    min_rating: queryParams.get('min_rating') || '',
    featured: queryParams.get('featured') || '',
    search: queryParams.get('search') || ''
  });
  
  const providersPerPage = 9;
  
  // Fetch providers based on filters and pagination
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        
        // Prepare query parameters
        const params = {
          skip: (currentPage - 1) * providersPerPage,
          limit: providersPerPage,
          ...filters
        };
        
        // Filter out empty parameters
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });
        
        // Fetch providers
        const response = await api.get('/providers', { params });
        setProviders(response.data);
        
        // Calculate total pages (approximate since we don't have total count)
        // In a real implementation, the API should return total count
        setTotalPages(Math.ceil(response.data.length / providersPerPage) || 1);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setLoading(false);
      }
    };
    
    fetchProviders();
  }, [currentPage, filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when changing filters
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      pages.push(1);
      
      // Calculate range of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Build title based on filters
  const getPageTitle = () => {
    if (filters.search) {
      return `Search Results for "${filters.search}"`;
    }
    
    let title = 'Medical Providers';
    
    if (filters.treatment_id) {
      title = 'Treatment Providers';
    }
    
    if (filters.country) {
      title = `Medical Providers in ${filters.country}`;
    }
    
    if (filters.city && filters.country) {
      title = `Medical Providers in ${filters.city}, ${filters.country}`;
    } else if (filters.city) {
      title = `Medical Providers in ${filters.city}`;
    }
    
    if (filters.featured === 'true') {
      title = `Featured ${title}`;
    }
    
    return title;
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{getPageTitle()}</PageTitle>
        <PageDescription>
          Compare prices, read reviews, and book your medical procedures with confidence
        </PageDescription>
      </PageHeader>
      
      <SearchFilters onFilter={handleFilterChange} />
      
      <ComparisonTool />
      
      {loading ? (
        <LoadingGrid>
          {[...Array(providersPerPage)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </LoadingGrid>
      ) : providers.length > 0 ? (
        <ProvidersGrid>
          {providers.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </ProvidersGrid>
      ) : (
        <NoResults>
          <NoResultsIcon>
            <i className="fas fa-search"></i>
          </NoResultsIcon>
          <NoResultsText>No providers match your search criteria</NoResultsText>
          <button 
            className="btn btn-outline-primary"
            onClick={() => handleFilterChange({})}
          >
            Clear All Filters
          </button>
        </NoResults>
      )}
      
      {!loading && providers.length > 0 && (
        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </PaginationButton>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <PaginationButton key={`ellipsis-${index}`} disabled>
                ...
              </PaginationButton>
            ) : (
              <PaginationButton
                key={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationButton>
            )
          ))}
          
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </PaginationButton>
        </Pagination>
      )}
    </PageContainer>
  );
}

export default ProviderList;
