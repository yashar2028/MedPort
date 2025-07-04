import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchTreatments, fetchTopRatedTreatments } from '../store/providersSlice';

const HeroSection = styled.section`
  background: linear-gradient(rgba(40, 54, 24, 0.7), rgba(40, 54, 24, 0.7)), 
              url('https://images.unsplash.com/photo-1551076805-e1869033e561') center/cover no-repeat;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--white-color);
  padding: 0 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  margin-top: 2rem;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  color: var(--dark-color);
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  background-color: var(--background-color);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  i {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--secondary-color);
    margin-bottom: 1rem;
  }

  p {
    color: var(--gray-color);
  }
`;

const TreatmentsSection = styled.section`
  padding: 4rem 1rem;
  background-color: white;
`;

const TreatmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TreatmentCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const TreatmentContent = styled.div`
  padding: 1.5rem;

  h3 {
    font-size: 1.25rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--gray-color);
    margin-bottom: 1rem;
  }
`;

const CtaSection = styled.section`
  padding: 4rem 1rem;
  background-color: var(--primary-color);
  color: var(--white-color);
  text-align: center;
`;

const CtaContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;


const TopReviewsSection = styled.section`
  padding: 4rem 1rem;
  background-color: var(--background-color);
`;

const ReviewCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  &.gold-star img {
    object-fit: contain;
    width: 100px;
    height: 100px;
    margin: 1rem auto 0;
  }

  div {
    padding: 1.25rem;
  }

  h4 {
    margin: 0.5rem 0;
    color: var(--secondary-color);
  }

  small {
    display: block;
    color: var(--gray-color);
    margin-bottom: 0.5rem;
  }
`;

function Home() {
  const dispatch = useDispatch();
  const { treatments, topRatedTreatments = [] } = useSelector(state => state.providers);
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    dispatch(fetchTreatments());
    dispatch(fetchTopRatedTreatments());
  }, [dispatch]);

  const treatmentImages = {
    '1': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937',
    '2': 'https://images.unsplash.com/photo-1588776814546-daab30f310ce',
    '3': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118',
    '4': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
  };

  const featuredTreatments = treatments.slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedTreatment) queryParams.append('treatment', selectedTreatment);
    if (selectedCountry) queryParams.append('country', selectedCountry);
    navigate(`/providers?${queryParams.toString()}`);
  };

  return (
    <>
      <HeroSection>
        <HeroTitle>Find Your Perfect Healthcare Provider</HeroTitle>
        <HeroSubtitle>
          Discover top-rated medical tourism providers worldwide. Compare prices, read reviews, and book with confidence.
        </HeroSubtitle>
        <Link to="/providers" className="btn btn-lg btn-primary">Explore Providers</Link>

        <SearchContainer>
          <SearchForm onSubmit={handleSearch}>
            <Select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
            >
              <option value="">Select Treatment</option>
              {treatments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>

            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              <option value="turkey">Turkey</option>
              <option value="thailand">Thailand</option>
              <option value="india">India</option>
              <option value="mexico">Mexico</option>
              <option value="brazil">Brazil</option>
            </Select>
            <Button type="submit">Search</Button>
          </SearchForm>
        </SearchContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose MedPort?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard><i className="fas fa-user-md"></i><h3>Verified Providers</h3><p>All healthcare providers are thoroughly vetted and verified for quality and credentials.</p></FeatureCard>
          <FeatureCard><i className="fas fa-dollar-sign"></i><h3>Price Transparency</h3><p>Compare prices across different providers and countries to find the best value.</p></FeatureCard>
          <FeatureCard><i className="fas fa-star"></i><h3>Authentic Reviews</h3><p>Read genuine reviews from patients who have experienced the services firsthand.</p></FeatureCard>
          <FeatureCard><i className="fas fa-calendar-check"></i><h3>Secure Booking</h3><p>Book your medical procedures with confidence through our secure platform.</p></FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <TreatmentsSection>
        <SectionTitle>Popular Treatments</SectionTitle>
        <TreatmentsGrid>
          {featuredTreatments.map(treatment => (
            <TreatmentCard key={treatment.id}>
              <img src={treatmentImages[treatment.category] || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528'} alt={treatment.name} />
              <TreatmentContent>
                <h3>{treatment.name}</h3>
                <p>{treatment.description?.substring(0, 100)}...</p>
                <Link to={`/treatments/${treatment.id}`} className="btn btn-outline">Learn More</Link>
              </TreatmentContent>
            </TreatmentCard>
          ))}
        </TreatmentsGrid>
      </TreatmentsSection>

      <TopReviewsSection>
        <SectionTitle>Top Reviewed Treatments</SectionTitle>
        <TreatmentsGrid>
          {topRatedTreatments.slice(0, 3).map(review => {
            const isGoldStar = !treatmentImages[review.treatmentCategory];
            return (
              <ReviewCard key={review.id} className={isGoldStar ? 'gold-star' : ''}>
                <img
                  src={
                    treatmentImages[review.treatmentCategory] ||
                    'https://res.cloudinary.com/dnig6f8zz/image/upload/v1751028299/vecteezy_gold-star-png-shotting-gold-star-png-transparent-gold_21664704_gvmdzt.png'
                  }
                  alt={review.treatmentName}
                />
                <div>
                  <h4>{review.treatmentName}</h4>
                  <small>By <strong>{review.providerName}</strong></small>
                  <p>“{review.reviewSnippet}...”</p>
                  <Link to={`/providers/${review.providerId}`} className="btn btn-outline">Visit Provider</Link>
                </div>
              </ReviewCard>
            );
          })}
        </TreatmentsGrid>
      </TopReviewsSection>

      <CtaSection>
        <CtaContainer>
          <h2>Ready to Begin Your Medical Tourism Journey?</h2>
          <p>Join thousands of satisfied patients who found the perfect healthcare solution through MedPort.</p>
          <Link to="/register" className="btn btn-lg btn-secondary">Create a Free Account</Link>
        </CtaContainer>
      </CtaSection>
    </>
  );
}

export default Home;