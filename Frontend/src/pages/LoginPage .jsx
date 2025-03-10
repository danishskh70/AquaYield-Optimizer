import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // can be email or mobile
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect path after login (if none provided, default to /introduction)
  const from = location.state?.from?.pathname || '/introduction';

  const handleLogin = async () => {
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your email/mobile and password.');
      return;
    }
    setLoading(true);

    // Determine if the identifier is an email or mobile number.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier.trim());
    const loginData = {
      password: password.trim(),
      ...(isEmail ? { email: identifier.trim() } : { mobile: identifier.trim() }),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/farmers/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.token) {
        // Overwrite previous authentication data in localStorage with the latest values.
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.farmer.mobile);
        localStorage.setItem('userEmail', response.data.farmer.email);
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/registration');
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      {error && <div style={styles.error}>{error}</div>}
      <input
        type="text"
        placeholder="Email or Mobile"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        required
      />
      {loading ? (
        <div style={styles.loading}>Logging in...</div>
      ) : (
        <div style={styles.buttonContainer}>
          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>
          <button onClick={handleRegister} style={{ ...styles.button, ...styles.registerButton }}>
            Register
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '300px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
    flex: 1,
    margin: '0 5px'
  },
  registerButton: {
    backgroundColor: '#2196F3'
  },
  error: {
    color: 'red',
    marginBottom: '10px'
  },
  loading: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#4CAF50'
  }
};

export default LoginPage;
