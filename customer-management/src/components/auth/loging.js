import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import './login.css'; 

const SESSION_TIMEOUT = 1; // Timeout in minutes


const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hits, setHits] = useState(0);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const history = useHistory();

  useEffect(() => {
    const storedHits = localStorage.getItem('loginHits');
    if (storedHits) {
      setHits(JSON.parse(storedHits));
    }

    let sessionTimeoutId;

    const resetSessionTimeout = () => {
      clearTimeout(sessionTimeoutId);
      sessionTimeoutId = setTimeout(logout, SESSION_TIMEOUT * 60 * 1000);
    };

    const checkActivity = () => {
      window.addEventListener('mousemove', resetSessionTimeout);
      window.addEventListener('keypress', resetSessionTimeout);
    };

    const logout = () => {
      setAuth(false);
      localStorage.removeItem('loginHits');
      setHits(0);
      history.push('/home'); 
    };

    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000); 

    resetSessionTimeout();
    checkActivity();

    return () => {
      clearInterval(intervalId);
      clearTimeout(sessionTimeoutId);
      window.removeEventListener('mousemove', resetSessionTimeout);
      window.removeEventListener('keypress', resetSessionTimeout);
    };
  }, [history, setAuth, setHits]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email and password validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    
    if (email === 'test@example.com' && password === 'password123') {
      setAuth(true);
      localStorage.setItem('loginHits', JSON.stringify(hits + 1));
      setHits(hits + 1);
      history.push('/home');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="current-time">{`Current time: ${time}`}</div>
      <div className="login-attempts">{`Login attempts: ${hits}`}</div>
      {error && <Alert variant="danger" className="alert">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="form-group">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className="form-control"
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="form-group">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="form-control"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="btn">
          Login
        </Button>
      </Form>
      <div className="register-link">
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
