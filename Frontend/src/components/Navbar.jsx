import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/NavFooter.css';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Determine if the user is logged in (authentication state stored in localStorage)
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const toggleSidebar = () => {
    if (isLoggedIn) {
      setShowSidebar(prevState => !prevState);
    } else {
      navigate('/login');
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const handleLogout = () => {
    // Clear authentication token and user ID from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false); // Close the sidebar if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <nav>
          <div className="logo-container">
            <NavLink to="/">
              <img src="/assets/Logo.png" alt="Logo" className="navbar-logo" loading="lazy" />
            </NavLink>
          </div>
          <ul className="nav-menu">
            {/* <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/introduction" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/Cropmanagement" className={({ isActive }) => (isActive ? 'active' : '')}>
                Crop Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/information" className={({ isActive }) => (isActive ? 'active' : '')}>
                Information
              </NavLink>
            </li>
            <li>
              <NavLink to="/references" className={({ isActive }) => (isActive ? 'active' : '')}>
                References
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                About
              </NavLink>
            </li>
          </ul>
          <div className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            &#x2022;&#x2022;&#x2022; {/* Three dots icon */}
          </div>
        </nav>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="sidebar" ref={sidebarRef}>
          <div className="sidebar-content">
            <ul>
              <li>
                <NavLink
                  to="/account"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={closeSidebar}
                >
                  Account
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/support"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={closeSidebar}
                >
                  Support
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/logout"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;