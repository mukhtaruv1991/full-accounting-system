const API_BASE_URL = 'https://full-accounting-backend.onrender.com';

const apiRequest = async (method: string, path: string, data: any = null) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // Add Authorization token if it exists
  const token = localStorage.getItem('token');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Add selected company ID to every request
  const companyData = localStorage.getItem('selectedCompany');
  if (companyData) {
    const company = JSON.parse(companyData);
    headers.append('x-company-id', company.companyId);
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
