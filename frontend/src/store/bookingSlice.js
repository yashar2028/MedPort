import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Initial state
const initialState = {
  bookings: [],
  providerBookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch bookings' });
    }
  }
);

export const fetchProviderBookings = createAsyncThunk(
  'bookings/fetchProviderBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings/provider');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch provider bookings' });
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to fetch booking details' });
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to create booking' });
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to cancel booking' });
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to update booking status' });
    }
  }
);

// Bookings slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      state.providerBookings = [];
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings cases
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch bookings';
      })
      
      // Fetch provider bookings cases
      .addCase(fetchProviderBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.providerBookings = action.payload;
      })
      .addCase(fetchProviderBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch provider bookings';
      })
      
      // Fetch booking by ID cases
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to fetch booking details';
      })
      
      // Create booking cases
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to create booking';
      })
      
      // Cancel booking cases
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update user bookings
        const cancelledBookingId = action.payload;
        state.bookings = state.bookings.map(booking => 
          booking.id === cancelledBookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        );
        
        // Update provider bookings if any
        state.providerBookings = state.providerBookings.map(booking => 
          booking.id === cancelledBookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        );
        
        // Update current booking if it's the cancelled one
        if (state.currentBooking && state.currentBooking.id === cancelledBookingId) {
          state.currentBooking = { ...state.currentBooking, status: 'cancelled' };
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to cancel booking';
      })
      
      // Update booking status cases
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        
        const updatedBooking = action.payload;
        
        // Update user bookings
        state.bookings = state.bookings.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        
        // Update provider bookings
        state.providerBookings = state.providerBookings.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        
        // Update current booking if it's the updated one
        if (state.currentBooking && state.currentBooking.id === updatedBooking.id) {
          state.currentBooking = updatedBooking;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Failed to update booking status';
      });
  }
});

// Export actions and reducer
export const { clearBookings, clearError, setCurrentBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
