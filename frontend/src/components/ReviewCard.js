import React from 'react';
import styled from 'styled-components';
import { formatDate } from '../utils/helpers';

const Card = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h5`
  margin: 0 0 0.25rem 0;
  color: var(--secondary-color);
`;

const ReviewDate = styled.div`
  font-size: 0.85rem;
  color: var(--gray-color);
`;

const Rating = styled.div`
  display: flex;
  color: #ffc107;
  font-size: 1.25rem;
`;

const VerifiedBadge = styled.div`
  background-color: var(--primary-color);
  color: var(--white-color);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  
  i {
    margin-right: 0.25rem;
  }
`;

const TreatmentLabel = styled.div`
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ReviewContent = styled.div`
  line-height: 1.6;
  color: var(--dark-color);
`;

const ReviewCard = ({ review }) => {
  // Function to render star rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };
  
  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card>
      <ReviewHeader>
        <UserInfo>
          <UserAvatar>
            {getInitials(review.user.full_name)}
          </UserAvatar>
          <UserDetails>
            <UserName>{review.user.full_name}</UserName>
            <ReviewDate>{formatDate(review.created_at)}</ReviewDate>
            {review.verified_booking && (
              <VerifiedBadge>
                <i className="fas fa-check-circle"></i> Verified Patient
              </VerifiedBadge>
            )}
          </UserDetails>
        </UserInfo>
        <Rating>
          {renderStars(review.rating)}
        </Rating>
      </ReviewHeader>
      
      {review.treatment_received && (
        <TreatmentLabel>
          <i className="fas fa-procedures me-2"></i>
          Treatment: {review.treatment_received}
        </TreatmentLabel>
      )}
      
      <ReviewContent>
        {review.comment || "This user left a rating but no written review."}
      </ReviewContent>
    </Card>
  );
};

export default ReviewCard;
