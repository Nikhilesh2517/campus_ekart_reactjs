import api from './api';

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (conversationId, content) => {
  const response = await api.post(`/messages/${conversationId}`, { content });
  return response.data;
};

export const createConversation = async (userId, productId) => {
  const response = await api.post('/messages/conversations', { userId, productId });
  return response.data;
};

export const markAsRead = async (conversationId) => {
  const response = await api.put(`/messages/${conversationId}/read`);
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/messages/${conversationId}`);
  return response.data;
};