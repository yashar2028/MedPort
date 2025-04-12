import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: var(--white-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 200px;
  background-color: #e0e0e0;
  position: relative;
  overflow: hidden;
`;

const PlaceholderImage = styled.div`
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--white-color);
  font-size: 4rem;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--accent-color);
  color: var(--white-color);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  z-index: 2;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: none;
  }
`;

const Location = styled.div`
  color: var(--gray-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  
  i {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  .stars {
    color: #ffc107;
    margin-right: 0.5rem;
  }
  
  .count {
    color: var(--gray-color);
    font-size: 0.85rem;
  }
`;

const Specialties = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SpecialtyTag = styled.span`
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
`;

const PriceInfo = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceLabel = styled.div`
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const ActionButton = styled(Link)`
  display: block;
  background-color: var(--primary-color);
  color: var(--white-color);
  text-align: center;
  padding: 0.75rem;
  border-radius: 0 0 10px 10px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
    color: var(--white-color);
    text-decoration: none;
  }
`;

const ProviderCard = ({ provider }) => {
  // Calculate star rating display
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
  
  // Find lowest treatment price if available
  const lowestPrice = provider.treatment_prices && provider.treatment_prices.length > 0
    ? Math.min(...provider.treatment_prices.map(tp => tp.price))
    : null;
  
  return (
    <Card>
      <CardImage>
        {provider.featured && <FeaturedBadge>Featured</FeaturedBadge>}
        <PlaceholderImage>
          <i className="fas fa-hospital-alt"></i>
        </PlaceholderImage>
      </CardImage>
      
      <CardContent>
        <CardTitle to={`/providers/${provider.id}`}>{provider.name}</CardTitle>
        
        <Location>
          <i className="fas fa-map-marker-alt"></i>
          {provider.city}, {provider.country}
        </Location>
        
        <Rating>
          <div className="stars">
            {renderStars(provider.average_rating)}
          </div>
          <div className="count">
            ({provider.total_reviews} reviews)
          </div>
        </Rating>
        
        <Specialties>
          {provider.specialties && provider.specialties.slice(0, 3).map(specialty => (
            <SpecialtyTag key={specialty.id}>{specialty.name}</SpecialtyTag>
          ))}
          {provider.specialties && provider.specialties.length > 3 && (
            <SpecialtyTag>+{provider.specialties.length - 3} more</SpecialtyTag>
          )}
        </Specialties>
        
        {lowestPrice && (
          <PriceInfo>
            <PriceLabel>Starting from</PriceLabel>
            <Price>${lowestPrice.toLocaleString()}</Price>
          </PriceInfo>
        )}
      </CardContent>
      
      <ActionButton to={`/providers/${provider.id}`}>
        View Details
      </ActionButton>
    </Card>
  );
};

export default ProviderCard;
