// EmployeeTimesheet.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const EmployeeTimesheet = ({ employeeId, show, handleClose }) => {
  const [timesheet, setTimesheet] = useState({ inTime: '', lunchInTime: '', lunchOutTime: '', outTime: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet({ ...timesheet, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost/task4/backend/timesheet.php', { ...timesheet, employeeId });
      handleClose(true); // Close modal after successful submission
    } catch (error) {
      console.error('Error adding timesheet:', error);
      // Handle error state or alert user
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Employee Timesheet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formInTime">
            <Form.Label>In Time</Form.Label>
            <Form.Control type="text" name="inTime" value={timesheet.inTime} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="formLunchInTime">
            <Form.Label>Lunch In Time</Form.Label>
            <Form.Control type="text" name="lunchInTime" value={timesheet.lunchInTime} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="formLunchOutTime">
            <Form.Label>Lunch Out Time</Form.Label>
            <Form.Control type="text" name="lunchOutTime" value={timesheet.lunchOutTime} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="formOutTime">
            <Form.Label>Out Time</Form.Label>
            <Form.Control type="text" name="outTime" value={timesheet.outTime} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Timesheet
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeTimesheet;
