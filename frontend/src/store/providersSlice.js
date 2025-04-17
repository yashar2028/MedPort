import axios from 'axios';

// Action Types
const FETCH_PROVIDERS_REQUEST = 'providers/FETCH_PROVIDERS_REQUEST';
const FETCH_PROVIDERS_SUCCESS = 'providers/FETCH_PROVIDERS_SUCCESS';
const FETCH_PROVIDERS_FAILURE = 'providers/FETCH_PROVIDERS_FAILURE';
const FETCH_PROVIDER_DETAIL_REQUEST = 'providers/FETCH_PROVIDER_DETAIL_REQUEST';
const FETCH_PROVIDER_DETAIL_SUCCESS = 'providers/FETCH_PROVIDER_DETAIL_SUCCESS';
const FETCH_PROVIDER_DETAIL_FAILURE = 'providers/FETCH_PROVIDER_DETAIL_FAILURE';
const FETCH_SPECIALTIES_REQUEST = 'providers/FETCH_SPECIALTIES_REQUEST';
const FETCH_SPECIALTIES_SUCCESS = 'providers/FETCH_SPECIALTIES_SUCCESS';
const FETCH_SPECIALTIES_FAILURE = 'providers/FETCH_SPECIALTIES_FAILURE';
const FETCH_TREATMENTS_REQUEST = 'providers/FETCH_TREATMENTS_REQUEST';
const FETCH_TREATMENTS_SUCCESS = 'providers/FETCH_TREATMENTS_SUCCESS';
const FETCH_TREATMENTS_FAILURE = 'providers/FETCH_TREATMENTS_FAILURE';
const FILTER_PROVIDERS = 'providers/FILTER_PROVIDERS';

// Initial State
const initialState = {
  providers: [],
  providerDetail: null,
  specialties: [],
  treatments: [],
  filter: {
    country: '',
    city: '',
    treatmentId: null,
    specialtyId: null,
    minRating: null,
    featured: null,
    search: ''
  },
  isLoading: false,
  error: null
};

// Reducer
export default function providersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROVIDERS_REQUEST:
    case FETCH_PROVIDER_DETAIL_REQUEST:
    case FETCH_SPECIALTIES_REQUEST:
    case FETCH_TREATMENTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_PROVIDERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        providers: action.payload,
        error: null
      };
    case FETCH_PROVIDER_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        providerDetail: action.payload,
        error: null
      };
    case FETCH_SPECIALTIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        specialties: action.payload,
        error: null
      };
    case FETCH_TREATMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        treatments: action.payload,
        error: null
      };
    case FETCH_PROVIDERS_FAILURE:
    case FETCH_PROVIDER_DETAIL_FAILURE:
    case FETCH_SPECIALTIES_FAILURE:
    case FETCH_TREATMENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case FILTER_PROVIDERS:
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload
        }
      };
    default:
      return state;
  }
}

// Action Creators
export const fetchProviders = (filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROVIDERS_REQUEST });

    // Build query params
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.city) params.append('city', filters.city);
    if (filters.treatmentId) params.append('treatment_id', filters.treatmentId);
    if (filters.specialtyId) params.append('specialty_id', filters.specialtyId);
    if (filters.minRating) params.append('min_rating', filters.minRating);
    if (filters.featured !== null && filters.featured !== undefined) params.append('featured', filters.featured);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = `/providers/${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url);

    dispatch({
      type: FETCH_PROVIDERS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_PROVIDERS_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch providers'
    });
  }
};

export const fetchProviderDetail = (providerId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PROVIDER_DETAIL_REQUEST });

    const response = await axios.get(`/providers/${providerId}`);

    dispatch({
      type: FETCH_PROVIDER_DETAIL_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_PROVIDER_DETAIL_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch provider details'
    });
  }
};

export const fetchSpecialties = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_SPECIALTIES_REQUEST });

    const response = await axios.get('providers/specialties/');

    dispatch({
      type: FETCH_SPECIALTIES_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_SPECIALTIES_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch specialties'
    });
  }
};

export const fetchTreatments = (category = null) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_TREATMENTS_REQUEST });

    const params = new URLSearchParams();
    if (category) params.append('category', category);

    const queryString = params.toString();
    const url = `/providers/treatments/${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url);

    dispatch({
      type: FETCH_TREATMENTS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_TREATMENTS_FAILURE,
      payload: error.response?.data?.detail || 'Failed to fetch treatments'
    });
  }
};

export const setProviderFilters = (filters) => (dispatch) => {
  dispatch({
    type: FILTER_PROVIDERS,
    payload: filters
  });
  dispatch(fetchProviders(filters));
};