import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ContactList.css';

function ContactList() {
  const [contacts, setContacts] = useState({});
  const [tasks, setTasks] = useState({});                                                                                                                                                
  const [newTask, setNewTask] = useState(''); // State to handle new task input
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(null); // Store the selected contact's ID

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

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddTask = (contactId) => {
    if (newTask.trim() === '') return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [contactId]: [...(prevTasks[contactId] || []), newTask],
    }));
    setNewTask('');
  };

  const handleDeleteTask = (contactId, taskIndex) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...(prevTasks[contactId] || [])];
      updatedTasks.splice(taskIndex, 1);
      return { ...prevTasks, [contactId]: updatedTasks };
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      alert('Contact deleted successfully!');
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact', error);
      alert('Error deleting contact');
    }
  };

  const handleEdit = () => {
    if (!selectedContactId) {
      alert('Please select a contact to edit.');
      return;
    }

    const contactToEdit = Object.values(contacts).flat().find(contact => contact._id === selectedContactId);

    if (contactToEdit) {
      setEditContactId(selectedContactId);
      setEditFormData({
        name: contactToEdit.name,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        additionalInfo: contactToEdit.additionalInfo,
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSave = async () => {
    if (!editContactId) return;

    try {
      await axios.put(`http://localhost:5000/api/contacts/${editContactId}`, editFormData);
      alert('Contact updated successfully!');
      setEditContactId(null); // Clear edit mode
      setSelectedContactId(null); // Clear selection
      fetchContacts(); // Refresh contacts
    } catch (error) {
      console.error('Failed to update contact', error);
      alert('Error updating contact');
    }
  };

  const filteredContacts = Object.keys(contacts).reduce((acc, type) => {
    const filtered = contacts[type].filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {});

  const handleSelectContact = (contactId) => {
    setSelectedContactId(contactId === selectedContactId ? null : contactId); // Toggle selection
  };

  return (
    <div className="contact-list">
      <h2>Contact List</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {Object.keys(filteredContacts).map((type) => (
        <div key={type} className="contact-section">
          <h3>{type} Contacts</h3>
          {filteredContacts[type].length === 0 ? (
            <p>No contacts found for {type}</p>
          ) : (
            filteredContacts[type].map((contact) => (
              <div key={contact._id} className="contact-item">
                <div className="contact-info">
                  <input
                    type="checkbox"
                    checked={selectedContactId === contact._id}
                    onChange={() => handleSelectContact(contact._id)}
                  />
                  {editContactId === contact._id ? (
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditChange}
                        placeholder="Phone"
                      />
                      <textarea
                        name="additionalInfo"
                        value={editFormData.additionalInfo}
                        onChange={handleEditChange}
                        placeholder="Additional Info"
                      />
                      <button onClick={handleSave} className="save-button">Save</button>
                      <button onClick={() => setEditContactId(null)} className="cancel-button">Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <h4>{contact.name}</h4>
                      <p>Email: {contact.email}</p>
                      <p>Phone: {contact.phone}</p>
                      <p>Info: {contact.additionalInfo}</p>
                      <div className="button-container">
                        <button onClick={handleEdit} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(contact._id)} className="delete-button">Delete</button>
                      </div>
                    </div>
                  )}

                  {/* Task/Reminder Section */}
                  <div className="task-section">
                    <h5>Tasks/Reminders</h5>
                    <ul>
                      {(tasks[contact._id] || []).map((task, index) => (
                        <li key={index}>
                          {task}
                          <button
                            onClick={() => handleDeleteTask(contact._id, index)}
                            className="delete-task-button"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                    <input
                      type="text"
                      value={newTask}
                      onChange={handleTaskChange}
                      placeholder="New Task/Reminder"
                      className="task-input"
                    />
                    <button
                      onClick={() => handleAddTask(contact._id)}
                      className="add-task-button"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}

export default ContactList;
