const API_BASE_URL = 'https://full-accounting-backend.onrender.com'; // <-- Updated to the live backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiRequest = async (method: string, path: string, data: any = null) => {
  const headers = getAuthHeaders();
  const config: RequestInit = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.message || 'Something went wrong');
    }
    
    // Handle cases where the response might be empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request Error:', error);
    // Provide a more user-friendly error message
    throw new Error('Failed to connect to the server. Please check your connection and try again.');
  }
};

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data: any) => apiRequest('POST', path, data),
  put: (path: string, data: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
