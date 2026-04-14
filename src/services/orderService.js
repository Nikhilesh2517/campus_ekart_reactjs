import api from './api';

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const confirmOrder = async (orderId, userType) => {
  const response = await api.put(`/orders/${orderId}/confirm`, { userType });
  return response.data;
};
