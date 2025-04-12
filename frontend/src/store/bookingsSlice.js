import axios from 'axios';

// Action Types
const FETCH_USER_BOOKINGS_REQUEST = 'bookings/FETCH_USER_BOOKINGS_REQUEST';
const FETCH_USER_BOOKINGS_SUCCESS = 'bookings/FETCH_USER_BOOKINGS_SUCCESS';
const FETCH_USER_BOOKINGS_FAILURE = 'bookings/FETCH_USER_BOOKINGS_FAILURE';
const FETCH_PROVIDER_BOOKINGS_REQUEST = 'bookings/FETCH_PROVIDER_BOOKINGS_REQUEST';
const FETCH_PROVIDER_BOOKINGS_SUCCESS = 'bookings/FETCH_PROVIDER_BOOKINGS_SUCCESS';
const FETCH_PROVIDER_BOOKINGS_FAILURE = 'bookings/FETCH_PROVIDER_BOOKINGS_FAILURE';
const CREATE_BOOKING_REQUEST = 'bookings/CREATE_BOOKING_REQUEST';
const CREATE_BOOKING_SUCCESS = 'bookings/CREATE_BOOKING_SUCCESS';
const CREATE_BOOKING_FAILURE = 'bookings/CREATE_BOOKING_FAILURE';
const UPDATE_BOOKING_REQUEST = 'bookings/UPDATE_BOOKING_REQUEST';
const UPDATE_BOOKING_SUCCESS = 'bookings/UPDATE_BOOKING_SUCCESS';
const UPDATE_BOOKING_FAILURE = 'bookings/UPDATE_BOOKING_FAILURE';
const CANCEL_BOOKING_REQUEST = 'bookings/CANCEL_BOOKING_REQUEST';
const CANCEL_BOOKING_SUCCESS = 'bookings/CANCEL_BOOKING_SUCCESS';
const CANCEL_BOOKING_FAILURE = 'bookings/CANCEL_BOOKING_FAILURE';
const CREATE_PAYMENT_INTENT_REQUEST = 'bookings/CREATE_PAYMENT_INTENT_REQUEST';
const CREATE_PAYMENT_INTENT_SUCCESS = 'bookings/CREATE_PAYMENT_INTENT_SUCCESS';
const CREATE_PAYMENT_INTENT_FAILURE = 'bookings/CREATE_PAYMENT_INTENT_FAILURE';
const CONFIRM_PAYMENT_REQUEST = 'bookings/CONFIRM_PAYMENT_REQUEST';
const CONFIRM_PAYMENT_SUCCESS = 'bookings/CONFIRM_PAYMENT_SUCCESS';
const CONFIRM_PAYMENT_FAILURE = 'bookings/CONFIRM_PAYMENT_FAILURE';
const CLEAR_BOOKING_ERRORS = 'bookings/CLEAR_BOOKING_ERRORS';

// Initial State
const initialState = {
  userBookings: [],
  providerBookings: [],
  currentBooking: null,
  paymentIntent: null,
  isLoading: false,
  success: false,
  error: null
};

// Reducer
export default function bookingsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_BOOKINGS_REQUEST:
    case FETCH_PROVIDER_BOOKINGS_REQUEST:
    case CREATE_BOOKING_REQUEST:
    case UPDATE_BOOKING_REQUEST:
    case CANCEL_BOOKING_REQUEST:
    case CREATE_PAYMENT_INTENT_REQUEST:
    case CONFIRM_PAYMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        success: false,
        error: null
      };
    case FETCH_USER_BOOKINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userBookings: action.payload,
        error: null
      };
    case FETCH_PROVIDER_BOOKINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        providerBookings: action.payload,
        error: null
      };
    case CREATE_BOOKING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentBooking: action.payload,
        userBookings: [...state.userBookings, action.payload],
        success: true,
        error: null
      };
    case UPDATE_BOOKING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userBookings: state.userBookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        ),
        providerBookings: state.providerBookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        ),
        success: true,
        error: null
      };
    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userBookings: state.userBookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        ),
        providerBookings: state.providerBookings.map(booking => 
          booking.id === action.payload.id ? action.payload : booking
        ),
        success: true,
        error: null
      };
    case CREATE_PAYMENT_INTENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        paymentIntent: action.payload,
        error: null
      };
    case CONFIRM_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        error: null
      };
    case FETCH_USER_BOOKINGS_FAILURE:
    case FETCH_PROVIDER_BOOKINGS_FAILURE:
    case CREATE_BOOKING_FAILURE:
    case UPDATE_BOOKING_FAILURE:
    case CANCEL_BOOKING_FAILURE:
    case CREATE_PAYMENT_INTENT_FAILURE:
    case CONFIRM_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.payload
      };
    case CLEAR_BOOKING_ERRORS:
      return {
        ...state,
        error: null,
        success: false
      };
    default:
      return state;
  }
}

// Action Creators
export const fetchUserBookings = (status = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_USER_BOOKINGS_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    let url = '/api/bookings/user';
    if (status) {
      url += `?status=${status}`;
    }

    const response = await axios.get(url, config);

    dispatch({
      type: FETCH_USER_BOOKINGS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_BOOKINGS_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch user bookings'
    });
  }
};

export const fetchProviderBookings = (status = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_PROVIDER_BOOKINGS_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    let url = '/api/bookings/provider';
    if (status) {
      url += `?status=${status}`;
    }

    const response = await axios.get(url, config);

    dispatch({
      type: FETCH_PROVIDER_BOOKINGS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_PROVIDER_BOOKINGS_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch provider bookings'
    });
  }
};

export const createBooking = (bookingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_BOOKING_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post('/api/bookings', bookingData, config);

    dispatch({
      type: CREATE_BOOKING_SUCCESS,
      payload: response.data
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CREATE_BOOKING_FAILURE,
      payload: error.response?.data?.detail || 'Failed to create booking'
    });
    throw error;
  }
};

export const updateBooking = (bookingId, bookingData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_BOOKING_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(`/api/bookings/${bookingId}`, bookingData, config);

    dispatch({
      type: UPDATE_BOOKING_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BOOKING_FAILURE,
      payload: error.response?.data?.detail || 'Failed to update booking'
    });
  }
};

export const cancelBooking = (bookingId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CANCEL_BOOKING_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post(`/api/bookings/${bookingId}/cancel`, {}, config);

    dispatch({
      type: CANCEL_BOOKING_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: CANCEL_BOOKING_FAILURE,
      payload: error.response?.data?.detail || 'Failed to cancel booking'
    });
  }
};

export const createPaymentIntent = (bookingId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_PAYMENT_INTENT_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.post('/api/payments/create-payment-intent', 
      { booking_id: bookingId }, 
      config
    );

    dispatch({
      type: CREATE_PAYMENT_INTENT_SUCCESS,
      payload: response.data
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: CREATE_PAYMENT_INTENT_FAILURE,
      payload: error.response?.data?.detail || 'Failed to create payment intent'
    });
    throw error;
  }
};

export const confirmPayment = (bookingId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CONFIRM_PAYMENT_REQUEST });

    const token = getState().auth.token;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    await axios.post(`/api/payments/confirm/${bookingId}`, {}, config);

    dispatch({
      type: CONFIRM_PAYMENT_SUCCESS
    });
  } catch (error) {
    dispatch({
      type: CONFIRM_PAYMENT_FAILURE,
      payload: error.response?.data?.detail || 'Failed to confirm payment'
    });
  }
};

export const clearBookingErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_BOOKING_ERRORS });
};