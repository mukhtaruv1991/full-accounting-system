const API_BASE_URL = 'http://localhost:5000'; // <-- Reverted to localhost

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
    
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error('Failed to connect to the server. Please ensure the backend is running and `adb reverse tcp:5000 tcp:5000` is active.');
  }
};

export const api = {
  get: (path: string) => apiRequest('GET', path),
  post: (path: string, data: any) => apiRequest('POST', path, data),
  put: (path: string, data: any) => apiRequest('PUT', path, data),
  delete: (path: string) => apiRequest('DELETE', path),
};
