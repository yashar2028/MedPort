import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../utils/api';
import ProviderCard from '../components/ProviderCard';

const HeroSection = styled.section`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 5rem 1rem;
  margin-top: -70px; /* To account for the fixed navbar */
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding-top: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  max-width: 700px;
  margin: 0 auto;
  border-radius: 50px;
  background-color: var(--white-color);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 10px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  outline: none;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--white-color);
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #1e2812;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    border-radius: 0;
  }
`;

const Section = styled.section`
  padding: 4rem 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--secondary-color);
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  color: var(--gray-color);
  max-width: 700px;
  margin: 0 auto;
`;

const FeaturedProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturedTreatmentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TreatmentCard = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 220px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const TreatmentIcon = styled.div`
  background-color: var(--primary-light);
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-color);
  font-size: 3rem;
`;

const TreatmentContent = styled.div`
  padding: 1.25rem;
  text-align: center;
`;

const TreatmentTitle = styled.h4`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const TreatmentDescription = styled.p`
  color: var(--gray-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ViewMoreLink = styled(Link)`
  display: inline-block;
  color: var(--primary-color);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  text-align: center;
  padding: 2rem;
  border-radius: 10px;
  background-color: var(--white-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StepNumber = styled.div`
  background-color: var(--primary-color);
  color: var(--white-color);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
`;

const StepIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const StepTitle = styled.h4`
  color: var(--secondary-color);
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: var(--gray-color);
  font-size: 0.9rem;
`;

const CtaSection = styled.section`
  background-color: var(--secondary-color);
  color: var(--white-color);
  padding: 5rem 1rem;
  text-align: center;
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  margin-bottom: 1.5rem;
`;

const CtaDescription = styled.p`
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const CtaButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CtaButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: var(--primary-color);
    color: var(--white-color);
    
    &:hover {
      background-color: var(--primary-dark);
      text-decoration: none;
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--white-color);
    border: 2px solid var(--white-color);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      text-decoration: none;
    }
  }
  
  @media (max-width: 576px) {
    width: 100%;
    max-width: 250px;
  }
`;

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [popularTreatments, setPopularTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured providers
        const providersResponse = await api.get('/providers', {
          params: { featured: true, limit: 3 }
        });
        setFeaturedProviders(providersResponse.data);
        
        // Fetch treatments
        const treatmentsResponse = await api.get('/providers/treatments');
        
        // Just take the first 4 for display
        setPopularTreatments(treatmentsResponse.data.slice(0, 4));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/providers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Treatment icons mapping
  const treatmentIcons = {
    'Plastic Surgery': 'fas fa-user-md',
    'Dental': 'fas fa-tooth',
    'Hair Transplant': 'fas fa-cut',
    'Dermatology': 'fas fa-holly-berry',
    'Orthopedic': 'fas fa-bone',
    'Fertility': 'fas fa-baby',
    'Weight Loss': 'fas fa-weight',
    'Eye Surgery': 'fas fa-eye'
  };
  
  // Get icon for treatment or default
  const getTreatmentIcon = (treatment) => {
    return treatmentIcons[treatment.name] || treatmentIcons[treatment.category] || 'fas fa-stethoscope';
  };
  
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find World-Class Medical Care at Affordable Prices</HeroTitle>
          <HeroSubtitle>
            MedPort connects you with top-rated medical providers around the world for cosmetic procedures, treatments, and surgeries
          </HeroSubtitle>
          
          <form onSubmit={handleSearch}>
            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Search for procedures, treatments, or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton type="submit">
                <i className="fas fa-search me-2"></i> Search
              </SearchButton>
            </SearchBar>
          </form>
        </HeroContent>
      </HeroSection>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Featured Medical Providers</SectionTitle>
          <SectionSubtitle>
            Discover top-rated clinics and hospitals offering exceptional 
            medical services with proven track records of success
          </SectionSubtitle>
        </SectionHeader>
        
        <FeaturedProvidersGrid>
          {isLoading ? (
            // Show loading placeholders
            [...Array(3)].map((_, i) => (
              <div key={i} className="loading-placeholder" style={{ height: '400px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}></div>
            ))
          ) : featuredProviders.length > 0 ? (
            // Show actual providers
            featuredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))
          ) : (
            // No providers found
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <i className="fas fa-hospital-alt fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
              <p>No featured providers available at the moment. Check back soon!</p>
            </div>
          )}
        </FeaturedProvidersGrid>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/providers" className="btn btn-primary">
            View All Providers
          </Link>
        </div>
      </Section>
      
      <Section style={{ backgroundColor: 'rgba(96, 108, 56, 0.05)' }}>
        <SectionHeader>
          <SectionTitle>Popular Medical Treatments</SectionTitle>
          <SectionSubtitle>
            Explore the most sought-after medical procedures and treatments 
            available through our global network of healthcare providers
          </SectionSubtitle>
        </SectionHeader>
        
        <FeaturedTreatmentsContainer>
          {isLoading ? (
            // Show loading placeholders
            [...Array(4)].map((_, i) => (
              <div key={i} className="loading-placeholder" style={{ width: '220px', height: '250px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}></div>
            ))
          ) : popularTreatments.length > 0 ? (
            // Show actual treatments
            popularTreatments.map(treatment => (
              <TreatmentCard key={treatment.id}>
                <TreatmentIcon>
                  <i className={getTreatmentIcon(treatment)}></i>
                </TreatmentIcon>
                <TreatmentContent>
                  <TreatmentTitle>{treatment.name}</TreatmentTitle>
                  <TreatmentDescription>
                    {treatment.description.length > 60
                      ? `${treatment.description.substring(0, 60)}...`
                      : treatment.description}
                  </TreatmentDescription>
                  <ViewMoreLink to={`/providers?treatment_id=${treatment.id}`}>
                    Find Providers <i className="fas fa-chevron-right ms-1"></i>
                  </ViewMoreLink>
                </TreatmentContent>
              </TreatmentCard>
            ))
          ) : (
            // No treatments found
            <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
              <i className="fas fa-procedures fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
              <p>No treatments available at the moment. Check back soon!</p>
            </div>
          )}
        </FeaturedTreatmentsContainer>
      </Section>
      
      <Section>
        <SectionHeader>
          <SectionTitle>How MedPort Works</SectionTitle>
          <SectionSubtitle>
            We make it easy to find, compare, and book medical procedures abroad with our simple process
          </SectionSubtitle>
        </SectionHeader>
        
        <StepsContainer>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepIcon>
              <i className="fas fa-search"></i>
            </StepIcon>
            <StepTitle>Search & Compare</StepTitle>
            <StepDescription>
              Browse our extensive database of vetted medical providers, 
              filter by treatment type, location, and price range.
            </StepDescription>
          </StepCard>
          
          <StepCard>
            <StepNumber>2</StepNumber>
            <StepIcon>
              <i className="fas fa-calendar-check"></i>
            </StepIcon>
            <StepTitle>Book Your Procedure</StepTitle>
            <StepDescription>
              Select your preferred provider and treatment, choose 
              your dates, and secure your appointment with easy online booking.
            </StepDescription>
          </StepCard>
          
          <StepCard>
            <StepNumber>3</StepNumber>
            <StepIcon>
              <i className="fas fa-plane-departure"></i>
            </StepIcon>
            <StepTitle>Travel & Treatment</StepTitle>
            <StepDescription>
              Receive your treatment from world-class medical professionals 
              and enjoy a smooth recovery with dedicated support.
            </StepDescription>
          </StepCard>
        </StepsContainer>
      </Section>
      
      <CtaSection>
        <CtaContent>
          <CtaTitle>Ready to Start Your Medical Journey?</CtaTitle>
          <CtaDescription>
            Join thousands of patients who have found quality and affordable 
            medical care through MedPort's global network of providers.
          </CtaDescription>
          <CtaButtons>
            <CtaButton to="/providers" className="primary">
              Find Providers
            </CtaButton>
            <CtaButton to="/how-it-works" className="secondary">
              Learn More
            </CtaButton>
          </CtaButtons>
        </CtaContent>
      </CtaSection>
    </>
  );
}

export default Home;
