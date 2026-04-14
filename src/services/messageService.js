import api from './api';

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async ({ receiverId, message, productId }) => {
  const response = await api.post('/messages', { receiverId, message, productId });
  return response.data;
};

export const markAsRead = async (conversationId) => {
  const response = await api.put(`/messages/${conversationId}/read`);
  return response.data;
};
