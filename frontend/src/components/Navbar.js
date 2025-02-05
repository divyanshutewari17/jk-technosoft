import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the JWT token
    navigate('/'); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Blog App</div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;