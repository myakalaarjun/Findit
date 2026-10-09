import api from './api';

export const getListings = async (params = {}) => {
  const response = await api.get('/listings', { params });
  return response.data;
};

export const getListingById = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await api.post('/listings', listingData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.patch(`/listings/${id}`, listingData);
  return response.data;
};

export const markListingAsSold = async (id) => {
  const response = await api.post(`/listings/${id}/sold`);
  return response.data;
};
