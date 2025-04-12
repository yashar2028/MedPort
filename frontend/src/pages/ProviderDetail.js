import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { api } from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import BookingForm from '../components/BookingForm';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProviderHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProviderImageContainer = styled.div`
  flex: 0 0 300px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white-color);
  
  @media (max-width: 768px) {
    width: 100%;
    flex: none;
  }
`;

const ProviderPlaceholder = styled.div`
  font-size: 6rem;
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.h1`
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
`;

const ProviderLocation = styled.div`
  display: flex;
  align-items: center;
  color: var(--gray-color);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  
  i {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const RatingStars = styled.div`
  display: flex;
  color: #ffc107;
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const RatingCount = styled.div`
  color: var(--gray-color);
`;

const VerifiedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 1rem;
  
  i {
    margin-right: 0.5rem;
  }
`;

const FeaturedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: var(--accent-color);
  color: var(--white-color);
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  
  i {
    margin-right: 0.5rem;
  }
`;

const ProviderTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ProviderDescription = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
    color: var(--primary-color);
  }
`;

const ContentSection = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-light);
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
`;

const TabsList = styled.div`
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabItem = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--dark-color)'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SpecialtyItem = styled.div`
  background-color: rgba(96, 108, 56, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const TreatmentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
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
  
  tr:hover td {
    background-color: rgba(96, 108, 56, 0.05);
  }
`;

const PriceCell = styled.td`
  font-weight: 600;
  color: var(--primary-color);
`;

const ReviewsContainer = styled.div`
  margin-bottom: 2rem;
`;

const WriteReviewButton = styled.button`
  background-color: var(--white-color);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: rgba(96, 108, 56, 0.1);
  }
`;

const ReviewForm = styled.div`
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
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

const RatingInput = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 1.5rem;
`;

const RatingStar = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#ffc107' : '#e0e0e0'};
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0.25rem;
  
  &:hover {
    color: #ffc107;
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
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: var(--white-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
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

const CancelButton = styled.button`
  background-color: transparent;
  color: var(--gray-color);
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: rgba(96, 108, 56, 0.05);
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(96, 108, 56, 0.2);
    border-top: 5px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

function ProviderDetail() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    comment: '',
    treatment_received: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginPrompt, setLoginPrompt] = useState(false);
  
  // Fetch provider data
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch provider details
        const providerResponse = await api.get(`/providers/${providerId}`);
        setProvider(providerResponse.data);
        
        // Fetch provider reviews
        const reviewsResponse = await api.get(`/reviews/provider/${providerId}`);
        setReviews(reviewsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        setError('Failed to load provider information. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [providerId]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle star rating change
  const handleRatingChange = (rating) => {
    setReviewFormData(prev => ({ ...prev, rating }));
  };
  
  // Handle review form input change
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle review form
  const toggleReviewForm = () => {
    if (!isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    
    setShowReviewForm(prev => !prev);
    setReviewFormData({
      rating: 0,
      comment: '',
      treatment_received: ''
    });
  };
  
  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    
    if (reviewFormData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    try {
      setSubmitLoading(true);
      setError('');
      
      // Create review
      const reviewData = {
        provider_id: parseInt(providerId, 10),
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
        treatment_received: reviewFormData.treatment_received
      };
      
      const response = await api.post('/reviews', reviewData);
      
      // Add new review to list
      setReviews(prev => [response.data, ...prev]);
      
      // Reset form
      setReviewFormData({
        rating: 0,
        comment: '',
        treatment_received: ''
      });
      
      setShowReviewForm(false);
      setSubmitLoading(false);
      
      // Update provider's average rating (normally this would happen automatically on the backend)
      if (provider) {
        const newRating = (provider.average_rating * provider.total_reviews + reviewFormData.rating) / (provider.total_reviews + 1);
        setProvider(prev => ({
          ...prev,
          average_rating: newRating,
          total_reviews: prev.total_reviews + 1
        }));
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to submit review. Please try again.');
      }
      
      setSubmitLoading(false);
    }
  };
  
  // Handle login prompt
  const handleLoginPrompt = () => {
    navigate('/login');
  };
  
  // Render star rating
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
  
  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </PageContainer>
    );
  }
  
  if (error && !provider) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/providers')}
        >
          Back to Providers List
        </button>
      </PageContainer>
    );
  }
  
  if (!provider) {
    return (
      <PageContainer>
        <ErrorMessage>Provider information not found</ErrorMessage>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/providers')}
        >
          Back to Providers List
        </button>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <ProviderHeader>
        <ProviderImageContainer>
          <ProviderPlaceholder>
            <i className="fas fa-hospital-alt"></i>
          </ProviderPlaceholder>
        </ProviderImageContainer>
        
        <ProviderInfo>
          <ProviderName>{provider.name}</ProviderName>
          
          <ProviderLocation>
            <i className="fas fa-map-marker-alt"></i>
            {provider.city}, {provider.country}
          </ProviderLocation>
          
          <RatingContainer>
            <RatingStars>
              {renderStars(provider.average_rating)}
            </RatingStars>
            <RatingCount>
              {provider.average_rating.toFixed(1)} ({provider.total_reviews} reviews)
            </RatingCount>
          </RatingContainer>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {provider.is_verified && (
              <VerifiedBadge>
                <i className="fas fa-check-circle"></i> Verified Provider
              </VerifiedBadge>
            )}
            
            {provider.featured && (
              <FeaturedBadge>
                <i className="fas fa-award"></i> Featured
              </FeaturedBadge>
            )}
          </div>
          
          <ProviderTags>
            {provider.specialties.map(specialty => (
              <SpecialtyItem key={specialty.id}>
                {specialty.name}
              </SpecialtyItem>
            ))}
          </ProviderTags>
          
          <ProviderDescription>
            {provider.description}
          </ProviderDescription>
          
          <ContactInfo>
            <ContactItem>
              <i className="fas fa-phone"></i>
              {provider.phone}
            </ContactItem>
            
            {provider.website && (
              <ContactItem>
                <i className="fas fa-globe"></i>
                <a href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                  {provider.website}
                </a>
              </ContactItem>
            )}
            
            <ContactItem>
              <i className="fas fa-map-pin"></i>
              {provider.address}
            </ContactItem>
          </ContactInfo>
        </ProviderInfo>
      </ProviderHeader>
      
      <TwoColumnGrid>
        <div>
          <TabsContainer>
            <TabsList>
              <TabItem
                active={activeTab === 'info'}
                onClick={() => handleTabChange('info')}
              >
                <i className="fas fa-info-circle me-2"></i> Information
              </TabItem>
              <TabItem
                active={activeTab === 'treatments'}
                onClick={() => handleTabChange('treatments')}
              >
                <i className="fas fa-procedures me-2"></i> Treatments & Prices
              </TabItem>
              <TabItem
                active={activeTab === 'reviews'}
                onClick={() => handleTabChange('reviews')}
              >
                <i className="fas fa-star me-2"></i> Reviews
              </TabItem>
            </TabsList>
          </TabsContainer>
          
          {activeTab === 'info' && (
            <ContentSection>
              <SectionTitle>About {provider.name}</SectionTitle>
              <p style={{ marginBottom: '2rem' }}>
                {provider.description}
              </p>
              
              <h3>Specializations</h3>
              <SpecialtiesList>
                {provider.specialties.map(specialty => (
                  <SpecialtyItem key={specialty.id}>
                    {specialty.name}
                    {specialty.description && (
                      <span title={specialty.description}>
                        <i className="fas fa-info-circle ms-1"></i>
                      </span>
                    )}
                  </SpecialtyItem>
                ))}
              </SpecialtiesList>
              
              <h3>Contact Information</h3>
              <p>
                <strong>Address:</strong> {provider.address}, {provider.city}, {provider.country}<br />
                <strong>Phone:</strong> {provider.phone}<br />
                {provider.website && (
                  <>
                    <strong>Website:</strong>{' '}
                    <a href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`} target="_blank" rel="noopener noreferrer">
                      {provider.website}
                    </a>
                    <br />
                  </>
                )}
                {provider.license_number && (
                  <>
                    <strong>License Number:</strong> {provider.license_number}
                  </>
                )}
              </p>
            </ContentSection>
          )}
          
          {activeTab === 'treatments' && (
            <ContentSection>
              <SectionTitle>Treatments & Prices</SectionTitle>
              
              {provider.treatment_prices && provider.treatment_prices.length > 0 ? (
                <TreatmentsTable>
                  <thead>
                    <tr>
                      <th>Treatment</th>
                      <th>Description</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.treatment_prices.map(tp => (
                      <tr key={tp.id}>
                        <td>{tp.treatment.name}</td>
                        <td>
                          {tp.description || tp.treatment.description}
                          {tp.treatment.average_duration && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-color)' }}>
                              <strong>Duration:</strong> {tp.treatment.average_duration}
                            </div>
                          )}
                          {tp.treatment.recovery_time && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-color)' }}>
                              <strong>Recovery:</strong> {tp.treatment.recovery_time}
                            </div>
                          )}
                        </td>
                        <PriceCell>
                          ${tp.price.toLocaleString()} {tp.currency}
                        </PriceCell>
                      </tr>
                    ))}
                  </tbody>
                </TreatmentsTable>
              ) : (
                <p>No treatment prices available for this provider.</p>
              )}
              
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-color)', marginTop: '1rem' }}>
                <i className="fas fa-info-circle me-1"></i>
                Prices may vary based on individual cases. Please book a consultation for a personalized quote.
              </div>
            </ContentSection>
          )}
          
          {activeTab === 'reviews' && (
            <ContentSection>
              <SectionTitle>
                Patient Reviews <span style={{ color: 'var(--gray-color)', fontSize: '1rem' }}>({provider.total_reviews})</span>
              </SectionTitle>
              
              {!showReviewForm && (
                <div style={{ marginBottom: '2rem' }}>
                  <WriteReviewButton onClick={toggleReviewForm}>
                    <i className="fas fa-pen"></i> Write a Review
                  </WriteReviewButton>
                </div>
              )}
              
              {showReviewForm && (
                <ReviewForm>
                  <FormTitle>Write Your Review</FormTitle>
                  
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  
                  <form onSubmit={handleSubmitReview}>
                    <FormGroup>
                      <FormLabel>Rating</FormLabel>
                      <RatingInput>
                        {[1, 2, 3, 4, 5].map(star => (
                          <RatingStar
                            key={star}
                            active={star <= reviewFormData.rating}
                            onClick={() => handleRatingChange(star)}
                            type="button"
                          >
                            <i className={star <= reviewFormData.rating ? 'fas fa-star' : 'far fa-star'}></i>
                          </RatingStar>
                        ))}
                      </RatingInput>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor="treatment_received">Treatment Received (Optional)</FormLabel>
                      <FormInput
                        type="text"
                        id="treatment_received"
                        name="treatment_received"
                        placeholder="e.g., Hair Transplant, Dental Implants, etc."
                        value={reviewFormData.treatment_received}
                        onChange={handleReviewInputChange}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor="comment">Your Review (Optional)</FormLabel>
                      <FormTextarea
                        id="comment"
                        name="comment"
                        placeholder="Share your experience with this provider..."
                        value={reviewFormData.comment}
                        onChange={handleReviewInputChange}
                      />
                    </FormGroup>
                    
                    <FormActions>
                      <SubmitButton type="submit" disabled={submitLoading}>
                        {submitLoading ? 'Submitting...' : 'Submit Review'}
                      </SubmitButton>
                      <CancelButton type="button" onClick={toggleReviewForm}>
                        Cancel
                      </CancelButton>
                    </FormActions>
                  </form>
                </ReviewForm>
              )}
              
              <ReviewsContainer>
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <NoReviews>
                    <i className="far fa-comment-dots fa-3x mb-3" style={{ color: 'var(--gray-color)' }}></i>
                    <p>No reviews yet. Be the first to review this provider!</p>
                  </NoReviews>
                )}
              </ReviewsContainer>
            </ContentSection>
          )}
        </div>
        
        <div>
          <BookingForm 
            provider={provider}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => setLoginPrompt(true)}
          />
        </div>
      </TwoColumnGrid>
      
      {loginPrompt && (
        <div className="modal-backdrop" style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <i className="fas fa-user-lock fa-3x mb-3" style={{ color: 'var(--primary-color)' }}></i>
            <h3 style={{ marginBottom: '1rem' }}>Login Required</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You need to be logged in to perform this action. Would you like to log in now?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={handleLoginPrompt}
              >
                Log In
              </button>
              <button 
                className="btn"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)'
                }}
                onClick={() => setLoginPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default ProviderDetail;
