/**
 * Format a date string into a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // Options for date formatting
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} The formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  if (typeof price !== 'number') {
    return '';
  }
  
  // Currency symbols mapping
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  
  const symbol = currencySymbols[currency] || '';
  
  return `${symbol}${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Truncate text to a specified length and add ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length before truncating
 * @returns {string} The truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Get user initials from full name
 * @param {string} name - The user's full name
 * @returns {string} The user's initials (max 2 characters)
 */
export const getUserInitials = (name) => {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format a status string to capitalized form
 * @param {string} status - The status string
 * @returns {string} The formatted status
 */
export const formatStatus = (status) => {
  if (!status) return '';
  
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Get status color based on booking status
 * @param {string} status - The booking status
 * @returns {object} The color object with background and text colors
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return {
        background: 'rgba(76, 175, 80, 0.1)',
        text: '#2e7d32'
      };
    case 'pending':
      return {
        background: 'rgba(255, 152, 0, 0.1)',
        text: '#e65100'
      };
    case 'cancelled':
      return {
        background: 'rgba(244, 67, 54, 0.1)',
        text: '#c62828'
      };
    case 'completed':
      return {
        background: 'rgba(33, 150, 243, 0.1)',
        text: '#0277bd'
      };
    default:
      return {
        background: 'rgba(96, 108, 56, 0.1)',
        text: 'var(--primary-color)'
      };
  }
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Parse URL query parameters
 * @returns {object} Object with query parameters
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const queryParams = {};
  
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  
  return queryParams;
};

/**
 * Build URL query string from parameters object
 * @param {object} params - The parameters object
 * @returns {string} The query string
 */
export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};
