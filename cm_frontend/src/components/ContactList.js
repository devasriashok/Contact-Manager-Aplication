import React, { useEffect, useState, useContext } from 'react';
import { ContactContext } from '../context/ContactContext';
import axios from 'axios';
import './ContactList.css';

function ContactList({ userRole }) {
  const { contacts, fetchContacts } = useContext(ContactContext);
  const [tasks, setTasks] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editContactId, setEditContactId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    additionalInfo: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch alerts from the server
  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to retrieve alerts', error);
    }
  };

  // Fetch contacts and alerts on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await fetchContacts();
        await fetchAlerts();
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [fetchContacts]);

  // Handlers for task management
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

  // Handlers for deleting and editing contacts
  const handleDelete = async (contactId) => {
    if (!contactId) {
      alert('Please select a contact to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/contacts/${contactId}`);
      alert('Contact deleted successfully!');
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact', error);
      alert('Error deleting contact');
    }
  };

  const handleEdit = (contactId) => {
    const contactToEdit = Object.values(contacts).flat().find(contact => contact._id === contactId);
    
    if (contactToEdit) {
      setEditContactId(contactId);
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
      setEditContactId(null); 
      fetchContacts();
    } catch (error) {
      console.error('Failed to update contact', error);
      alert('Error updating contact');
    }
  };

  // Search functionality across name, email, and phone fields
  const filteredContacts = Object.keys(contacts).reduce((acc, type) => {
    const filtered = contacts[type].filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {});

  // Check if there are any active alerts for a specific contact type
  const hasAlertForType = (type) => {
    return alerts.some(alert => alert.type === type);
  };

  // Handle alert deletion
  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`http://localhost:5000/api/alerts/${alertId}`);
      setAlerts((prevAlerts) => prevAlerts.filter(alert => alert._id !== alertId));
      alert('Alert deleted successfully!');
    } catch (error) {
      console.error('Failed to delete alert', error);
      alert('Error deleting alert');
    }
  };
  
  

  return (
    <div className="contact-list">
      <h2>Contact List</h2>

      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <>
          {Object.keys(filteredContacts).map((type) => {
            const isAlertActive = hasAlertForType(type); // Check if alert is active for this type

            return (
              <div 
                key={type} 
                className={`contact-section ${isAlertActive ? 'alert-active' : ''}`}
                style={isAlertActive ? { border: '2px solid red', backgroundColor: '#ffe6e6' } : {}}
              >
                <h3>{type} Contacts</h3>
                {filteredContacts[type].length === 0 ? (
                  <p>No contacts found for {type}</p>
                ) : (
                  filteredContacts[type].map((contact) => (
                    <div key={contact._id} className="contact-item">
                      <div className="contact-info">
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

                            {/* Display alerts for this contact type */}
                            {alerts.filter(alert => alert.type === type).map(alert => (
  <div key={alert.id} className="alert">
    <p><strong>Alert: </strong>{alert.message}</p>
    {userRole === 'admin' && (
      <button 
        onClick={() => handleDeleteAlert(alert._id)} 
        className="delete-alert-button"
      >
        Delete Alert
      </button>
    )}
  </div>
))}

                            <div className="button-container">
                            {userRole === 'admin' && (
                              <button 
                                onClick={() => handleEdit(contact._id)} 
                                className={`edit-button ${userRole !== 'admin' ? 'disabled' : ''}`}
                                disabled={userRole !== 'admin'}
                              >
                                Edit
                              </button>
                            )}
                             {userRole === 'admin' && (
                              <button 
                                onClick={() => handleDelete(contact._id)} 
                                className={`delete-button ${userRole !== 'admin' ? 'disabled' : ''}`}
                                disabled={userRole !== 'admin'}
                              >
                                Delete
                              </button>
                            )}
                            </div>

                            {/* Task management */}
                            <div>
                              {userRole === 'admin' && (
                                <>
                                  <input 
                                    type="text" 
                                    value={newTask} 
                                    onChange={handleTaskChange}
                                    placeholder="New task"
                                  />
                                  <button onClick={() => handleAddTask(contact._id)}>Add Task</button>
                                </>
                              )}
                              {tasks[contact._id] && tasks[contact._id].map((task, index) => (
                                <div key={index} className="task">
                                  <span>{task}</span>
                                  {userRole === 'admin' && (
                                    <button onClick={() => handleDeleteTask(contact._id, index)}>Delete</button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default ContactList;
