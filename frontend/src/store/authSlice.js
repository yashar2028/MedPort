import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('medport_token') || null,
  isLoading: false,
  error: null
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Registration failed. Please try again.' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Convert credentials to form data for FastAPI OAuth2 endpoint
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/token', formData);
      const { access_token, token_type } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('medport_token', access_token);
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;
      
      // Fetch user data with the token
      const userResponse = await api.get('/auth/me');
      
      return {
        token: access_token,
        user: userResponse.data
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Login failed. Please try again.' });
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    try {
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('medport_token');
      
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ detail: 'Failed to load user data. Please login again.' });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear token from localStorage
      localStorage.removeItem('medport_token');
      // Reset state
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Successful registration doesn't log the user in automatically
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.detail || 'Registration failed';
      })
      
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.detail || 'Login failed';
      })
      
      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

// Export actions and reducer
export const { logout, clearError, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
