import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend URL

export const getContacts = async () => {
  const response = await axios.get(`${API_URL}/api/contacts`);
  return response.data;
};

export const addContact = async (contactData) => {
  const response = await axios.post(`${API_URL}/api/contacts`, contactData);
  return response.data;
};
