import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Header = ({ handleLogout }) => {

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '400px 100px 20px 0px ' }}>
      <Button as={Link} to="/login" variant="dark" onClick={handleLogout}>Logout</Button>
    </div>
  );

};

export default Header;
