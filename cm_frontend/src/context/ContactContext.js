// src/context/ContactContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState({});

  // Fetch contacts from the server
  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      const groupedContacts = {};

      response.data.forEach(contact => {
        if (!groupedContacts[contact.type]) {
          groupedContacts[contact.type] = [];
        }
        groupedContacts[contact.type].push(contact);
      });

      setContacts(groupedContacts);
    } catch (error) {
      console.error('Failed to retrieve contacts', error);
    }
  };

  // Function to add a new contact
  const addContact = async (newContact) => {
    try {
      await axios.post('http://localhost:5000/api/contacts', newContact);
      fetchContacts(); // Refresh contacts after adding
    } catch (error) {
      console.error('Failed to add contact', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <ContactContext.Provider value={{ contacts, fetchContacts, addContact }}>
      {children}
    </ContactContext.Provider>
  );
};
