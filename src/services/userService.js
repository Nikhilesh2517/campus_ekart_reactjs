import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getUserListings = async () => {
  const response = await api.get('/users/listings');
  return response.data;
};

export const getSavedItems = async () => {
  const response = await api.get('/users/saved');
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get('/users/orders');
  return response.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.put('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/users/password', { oldPassword, newPassword });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete('/users/account');
  return response.data;
};