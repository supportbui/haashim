import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // State for confirmation modal
  const [updateMessage, setUpdateMessage] = useState(null); // State for update success/error message
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (updateMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setUpdateMessage(null);
      }, 3000); // Show the alert for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [updateMessage]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost/task4/backend/react.php');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleNextPage = () => {
    if (currentPage < Math.ceil(customers.length / customersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleShowModal = (customer = null) => {
    setCurrentCustomer(customer);
    setForm(customer ? { ...customer } : { name: '', email: '', phone: '', address: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateMessage(null); // Clear update messages when closing modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentCustomer) {
      await handleUpdateCustomer(form);
    } else {
      await handleAddCustomer(form);
    }
  };

  const handleAddCustomer = async (customer) => {
    try {
      const response = await axios.post('http://localhost/task4/backend/react.php', customer);
      setCustomers([...customers, response.data]);
      setUpdateMessage({ type: 'success', text: 'Customer added successfully' });
    } catch (error) {
      console.error('Error adding customer:', error);
      setUpdateMessage({ type: 'error', text: 'Error adding customer' });
    }
  };

  const handleUpdateCustomer = async (customer) => {
    try {
      await axios.put('http://localhost/task4/backend/react.php', customer);
      setCustomers(customers.map((cust) => (cust.id === customer.id ? customer : cust)));
      setUpdateMessage({ type: 'success', text: 'Customer updated successfully' });
    } catch (error) {
      console.error('Error updating customer:', error);
      setUpdateMessage({ type: 'error', text: 'Error updating customer' });
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete('http://localhost/task4/backend/react.php', { data: { id } });
      setCustomers(customers.filter((customer) => customer.id !== id));
      setConfirmDeleteId(null); // Clear confirmation after delete
      setUpdateMessage({ type: 'success', text: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      setUpdateMessage({ type: 'error', text: 'Error deleting customer' });
    }
  };

  const showConfirmDeleteModal = (id) => {
    setConfirmDeleteId(id);
  };

  const hideConfirmDeleteModal = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
         {showAlert && updateMessage && (
        <Alert variant={updateMessage.type === 'success' ? 'success' : 'danger'}>
          {updateMessage.text}
        </Alert>
      )}
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Customer
      </Button>

      <Table striped bordered hover>
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
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal(customer)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => showConfirmDeleteModal(customer.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(Math.ceil(customers.length / customersPerPage)).keys()].map((number) => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={handleNextPage} />
      </Pagination>

      {/* Confirmation Modal */}
      <Modal show={confirmDeleteId !== null} onHide={hideConfirmDeleteModal}>
        <Modal.Header closeButton style={{ padding: '60px' }}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideConfirmDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCustomer(confirmDeleteId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit/Add Customer Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton style={{ padding: '60px' }}>
          <Modal.Title>{currentCustomer ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
        </Modal.Header>
        {showAlert && updateMessage && (
        <Alert variant={updateMessage.type === 'success' ? 'success' : 'danger'}>
          {updateMessage.text}
        </Alert>
      )}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="number" name="phone" value={form.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={form.address} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomerTable;
