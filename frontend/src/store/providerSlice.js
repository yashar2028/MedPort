import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Initial state
const initialState = {
  providers: [],
  provider: null,
  featuredProviders: [],
  loading: false,
  error: null,
  filters: {
    country: '',
    city: '',
    treatment_id: '',
    specialty_id: '',
    min_rating: '',
    featured: '',
    search: ''
  }
};

// Async thunks
export const fetchProviders = createAsyncThunk(
  'providers/fetchProviders',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/providers', { params: filters });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch providers' });
    }
  }
);

export const fetchFeaturedProviders = createAsyncThunk(
  'providers/fetchFeaturedProviders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/providers', { 
        params: { 
          featured: true,
          limit: 3
        } 
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch featured providers' });
    }
  }
);

export const fetchProviderById = createAsyncThunk(
  'providers/fetchProviderById',
  async (providerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/providers/${providerId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch provider details' });
    }
  }
);

export const createReview = createAsyncThunk(
  'providers/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to create review' });
    }
  }
);

// Provider slice
const providerSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        country: '',
        city: '',
        treatment_id: '',
        specialty_id: '',
        min_rating: '',
        featured: '',
        search: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch providers cases
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch providers';
      })
      
      // Fetch featured providers cases
      .addCase(fetchFeaturedProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProviders = action.payload;
      })
      .addCase(fetchFeaturedProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch featured providers';
      })
      
      // Fetch provider by ID cases
      .addCase(fetchProviderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.provider = null;
      })
      .addCase(fetchProviderById.fulfilled, (state, action) => {
        state.loading = false;
        state.provider = action.payload;
      })
      .addCase(fetchProviderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch provider details';
      })
      
      // Create review cases
      .addCase(createReview.fulfilled, (state, action) => {
        if (state.provider) {
          // Update provider average rating and total reviews
          const newReview = action.payload;
          const totalReviews = state.provider.total_reviews + 1;
          const totalRating = state.provider.average_rating * state.provider.total_reviews + newReview.rating;
          const newAverageRating = totalRating / totalReviews;
          
          state.provider.total_reviews = totalReviews;
          state.provider.average_rating = newAverageRating;
          
          // Add new review to provider reviews if it exists
          if (state.provider.reviews) {
            state.provider.reviews.unshift(newReview);
          }
        }
      });
  }
});

// Export actions and reducer
export const { setFilters, clearFilters, clearError } = providerSlice.actions;

export default providerSlice.reducer;
