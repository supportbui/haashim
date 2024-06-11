import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import AddEditCustomer from './crudlist'; // Adjust path based on your file structure

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/customers'); // Adjust URL as per your backend
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowModal(true);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (customerData.id) {
        // If customerData has an id, it means we are updating an existing customer
        await axios.put(`http://localhost:3000/api/customers/${customerData.id}`, customerData);
        setCustomers(customers.map((cust) => (cust.id === customerData.id ? customerData : cust)));
      } else {
        // Otherwise, we are adding a new customer
        const response = await axios.post('http://localhost:3000/api/customers', customerData);
        setCustomers([...customers, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3000/api/customers/${customerId}`);
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleAdd} variant="primary" style={{ marginBottom: '20px' }}>
        Add Customer
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(customer)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(customer.id)} style={{ marginLeft: '10px' }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddEditCustomer
        show={showModal}
        handleClose={() => setShowModal(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default CustomerList;
