// Reverting to the public URL, as the internal one is not working as expected on the free tier.
const API_BASE_URL = 'https://full-accounting-backend.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiRequest = async (method: string, path: string, data: any = null) => {
  const headers = new Headers(getAuthHeaders());

  const config: RequestInit = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(response.statusText || `HTTP error! Status: ${response.status}`);
      }
      throw new Error(errorData.message || 'An unknown server error occurred.');
    }
    
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};

  } catch (error: any) {
    console.error('API Request Failed:', error);
    
    // This is the message you are seeing. It indicates a network-level failure.
    if (error.message.includes('Failed to fetch')) {
       throw new Error('Failed to connect to the server. Please check your connection and try again.');
    }
    
    throw error;
  }
};

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data: any) => apiRequest('POST', path, data),
  put: (path: string, data: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
