import api from './api';

export const reportListing = async (reportData) => {
  const response = await api.post('/moderation/reports', reportData);
  return response.data;
};

export const getAdminReports = async (params = {}) => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};

export const updateAdminReport = async (id, data) => {
  const response = await api.patch(`/admin/reports/${id}`, data);
  return response.data;
};
