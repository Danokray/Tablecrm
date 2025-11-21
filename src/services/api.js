import axios from 'axios';

const BASE_URL = 'https://app.tablecrm.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let currentToken = null;

export const setAuthToken = (token) => {
  currentToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Auth token set in headers');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('Auth token removed from headers');
  }
};

export const getToken = () => currentToken;

export const getAllClients = async () => {
  try {
    const token = getToken();
    console.log('Getting all clients API call');
    const response = await api.get('/contragents/', {
      params: { 
        token: token
      },
    });
    console.log('All clients response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected all clients data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting all clients:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const searchClients = async (phone) => {
  try {
    const token = getToken();
    console.log('Searching clients API call:', { phone, token: token ? 'present' : 'missing' });
    const response = await api.get('/contragents/', {
      params: { 
        phone: phone.trim(),
        phone_number: phone.trim(),
        q: phone.trim(),
        search: phone.trim(),
        token: token
      },
    });
    console.log('Clients search response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected clients data structure:', data);
    return [];
  } catch (error) {
    console.error('Error searching clients:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const getPayboxes = async () => {
  try {
    const token = getToken();
    const response = await api.get('/payboxes/', {
      params: {
        token: token
      }
    });
    console.log('Payboxes response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected payboxes data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting payboxes:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      if (error.response.data?.detail) {
        console.error('Detail array:', error.response.data.detail);
        error.response.data.detail.forEach((item, index) => {
          console.error(`Detail[${index}]:`, item);
        });
      }
    }
    throw error;
  }
};

export const getOrganizations = async () => {
  try {
    const token = getToken();
    const response = await api.get('/organizations/', {
      params: {
        token: token
      }
    });
    console.log('Organizations response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected organizations data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting organizations:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      if (error.response.data?.detail) {
        console.error('Detail array:', error.response.data.detail);
        error.response.data.detail.forEach((item, index) => {
          console.error(`Detail[${index}]:`, item);
        });
      }
    }
    throw error;
  }
};

export const getWarehouses = async () => {
  try {
    const token = getToken();
    const response = await api.get('/warehouses/', {
      params: {
        token: token
      }
    });
    console.log('Warehouses response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected warehouses data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting warehouses:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      if (error.response.data?.detail) {
        console.error('Detail array:', error.response.data.detail);
        error.response.data.detail.forEach((item, index) => {
          console.error(`Detail[${index}]:`, item);
        });
      }
    }
    throw error;
  }
};

export const getPriceTypes = async () => {
  try {
    const token = getToken();
    const response = await api.get('/price_types/', {
      params: {
        token: token
      }
    });
    console.log('Price types response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected price types data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting price types:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      if (error.response.data?.detail) {
        console.error('Detail array:', error.response.data.detail);
        error.response.data.detail.forEach((item, index) => {
          console.error(`Detail[${index}]:`, item);
        });
      }
    }
    throw error;
  }
};

export const getNomenclature = async (params = {}) => {
  try {
    const token = getToken();
    console.log('Searching nomenclature API call:', { params, token: token ? 'present' : 'missing' });
    const searchParams = {
      token: token
    };
    
    if (params.search) {
      searchParams.search = params.search;
      searchParams.q = params.search;
      searchParams.name = params.search;
    }
    
    const response = await api.get('/nomenclature/', { 
      params: searchParams
    });
    console.log('Nomenclature response:', response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.result) {
      return data.result;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.data) {
      return data.data;
    }
    if (data?.items) {
      return data.items;
    }
    console.warn('Unexpected nomenclature data structure:', data);
    return [];
  } catch (error) {
    console.error('Error getting nomenclature:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const createSale = async (data, conduct = false) => {
  try {
    const token = getToken();
    console.log('createSale data:', data);
    console.log('createSale conduct:', conduct);
    console.log('createSale token:', token ? 'present' : 'missing');
    
    let payload;
    if (Array.isArray(data)) {
      payload = data.map(item => ({
        ...item,
        conduct,
      }));
    } else {
      payload = [{
        ...data,
        conduct,
      }];
    }
    
    console.log('createSale payload:', JSON.stringify(payload, null, 2));
    
    const url = `/docs_sales/?token=${encodeURIComponent(token || '')}`;
    console.log('createSale URL:', url);
    
    const response = await api.post(url, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

export default api;
