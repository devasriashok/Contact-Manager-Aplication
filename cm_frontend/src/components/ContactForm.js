import React, { useState } from 'react';

const ContactForm = ({ onSubmit }) => {
  const [parentField, setParentField] = useState('');
  const [childFields, setChildFields] = useState([{ childName: '', fields: {} }]);

  const handleChildFieldChange = (index, field, value) => {
    const newChildFields = [...childFields];
    newChildFields[index] = { ...newChildFields[index], [field]: value };
    setChildFields(newChildFields);
  };

  const addChildField = () => {
    setChildFields([...childFields, { childName: '', fields: {} }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ parentField, childFields });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Parent Field</label>
      <input type="text" value={parentField} onChange={(e) => setParentField(e.target.value)} />

      {childFields.map((child, index) => (
        <div key={index}>
          <label>Child Field Name</label>
          <input
            type="text"
            value={child.childName}
            onChange={(e) => handleChildFieldChange(index, 'childName', e.target.value)}
          />
          {/* Add custom fields here */}
        </div>
      ))}

      <button type="button" onClick={addChildField}>Add Child Field</button>
      <button type="submit">Save Contact</button>
    </form>
  );
};

export default ContactForm;
