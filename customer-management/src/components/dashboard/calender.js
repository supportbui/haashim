import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Meeting',
      start: new Date(2024, 5, 15, 10, 0),
      end: new Date(2024, 5, 15, 12, 0),
    },
    {
      id: 2,
      title: 'Lunch',
      start: new Date(2024, 5, 16, 12, 0),
      end: new Date(2024, 5, 16, 13, 0),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: null,
    end: null,
  });

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({
      title: '',
      start: null,
      end: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleAddEvent = async () => {
    try {
      // Validate start and end times
      if (!newEvent.title || !newEvent.start || !newEvent.end) {
        alert('Please fill in all fields.');
        return;
      }

      // Add the event locally
      const updatedEvents = [...events, { ...newEvent }];
      setEvents(updatedEvents);

      // Example API call to add event to server
      await axios.post('http://localhost/add-event', newEvent);

      // Close modal after successful addition
      handleCloseModal();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
        <Button variant="primary" onClick={handleShowModal}>
          Add Event
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton style={{ padding: '60px' }}>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </Form.Group>
            <Form.Group controlId="formStart">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start"
                value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEnd">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end"
                value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
