// Use the internal service name provided by Render for direct, fast, and reliable communication.
// The backend service is named 'full-accounting-backend' and runs on port 5000.
const API_BASE_URL = 'http://full-accounting-backend:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

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
    
    if (error.message.includes('Failed to fetch')) {
       throw new Error('Internal connection failed. The backend service might be starting up. Please wait a moment and try again.');
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
