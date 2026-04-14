import api from './api';

export const getProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();
  Object.keys(productData).forEach(key => {
    if (key === 'images') {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    } else if (key === 'price' || key === 'originalPrice') {
      formData.append(key, parseFloat(productData[key]));
    } else {
      formData.append(key, productData[key]);
    }
  });
  
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const getUserProducts = async () => {
  const response = await api.get('/products/user/me');
  return response.data;
};

export const saveProduct = async (productId) => {
  const response = await api.post(`/products/${productId}/save`);
  return response.data;
};

export const unsaveProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}/save`);
  return response.data;
};

export const getSavedProducts = async () => {
  const response = await api.get('/products/saved/all');
  return response.data;
};
