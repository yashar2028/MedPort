import axios from 'axios';

// Action Types
const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
const LOGOUT = 'auth/LOGOUT';
const LOAD_USER_REQUEST = 'auth/LOAD_USER_REQUEST';
const LOAD_USER_SUCCESS = 'auth/LOAD_USER_SUCCESS';
const LOAD_USER_FAILURE = 'auth/LOAD_USER_FAILURE';
const REGISTER_REQUEST = 'auth/REGISTER_REQUEST';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const REGISTER_FAILURE = 'auth/REGISTER_FAILURE';
const UPDATE_USER_PROFILE = 'auth/UPDATE_USER_PROFILE';

// Initial State
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null
};

// Reducer
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case LOGIN_FAILURE:
    case LOAD_USER_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}

// Action Creators
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await axios.post(
      '/auth/token',
      formData.toString(),
      config
    );

    // Get user data
    const userResponse = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${response.data.access_token}` // The access token is used here for successful login.
      }
    });

    localStorage.setItem('token', response.data.access_token);

    dispatch({ // Dispatch the user information (userResponse.data) that is given access for us by the token.
      type: LOGIN_SUCCESS,
      payload: {
        token: response.data.access_token,
        user: userResponse.data
      }
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.detail || 'Login failed'
    });
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(userData);
    await axios.post('/auth/register', userData, config);

    dispatch({ type: REGISTER_SUCCESS });
    
    // Login after successful registration which gives access to the login token.
    dispatch(login({
      username: userData.username,
      password: userData.password
    }));
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.detail || 'Registration failed'
    });
  }
};

export const loadUser = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    
    if (!token) {
      dispatch({ type: LOAD_USER_FAILURE });
      return;
    }

    dispatch({ type: LOAD_USER_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.get('/auth/me', config);

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAILURE,
      payload: error.response?.data?.detail || 'Failed to load user'
    });
    // Clear localStorage if token is invalid
    localStorage.removeItem('token');
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.removeItem('token'); // Clear localStorage of access token upon logout.
};

export const updateUserProfile = (userData) => (dispatch) => {
  dispatch({ 
    type: UPDATE_USER_PROFILE, 
    payload: userData 
  });
};