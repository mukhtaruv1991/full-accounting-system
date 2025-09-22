const API_BASE_URL = 'https://full-accounting-backend.onrender.com';

const apiRequest = async (method: string, path: string, data: any = null) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const token = localStorage.getItem('token');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);

    // Check if the response is successful
    if (!response.ok) {
      let errorData;
      try {
        // Try to parse error response from the server
        errorData = await response.json();
      } catch (e) {
        // If parsing fails, use the status text
        throw new Error(response.statusText || `HTTP error! Status: ${response.status}`);
      }
      // Throw an error with the message from the server
      throw new Error(errorData.message || 'An unknown error occurred.');
    }

    // Handle cases where the response might be empty (e.g., for DELETE requests)
    const responseText = await response.text();
    if (!responseText) {
      return {}; // Return an empty object for empty responses
    }
    
    return JSON.parse(responseText);

  } catch (error: any) {
    // Log the detailed error for future debugging
    console.error('API Request Failed:', error);
    
    // Re-throw a user-friendly error message
    // This is the message you are seeing
    if (error.message.includes('Failed to fetch')) {
       throw new Error('Failed to connect to the server. Please check your connection and try again.');
    }
    
    // Throw other errors (like from response.ok check) as they are
    throw error;
  }
};

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data: any) => apiRequest('POST', path, data),
  put: (path: string, data: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
