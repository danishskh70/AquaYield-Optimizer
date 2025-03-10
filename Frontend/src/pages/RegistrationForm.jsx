import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  // All fields are stored as strings
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate that mobile contains exactly 10 digits
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile.trim());
  const validatePassword = (password) => password.trim().length >= 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Trim input values for consistency
    const { name, mobile, email, password } = formData;
    if (!name.trim() || !mobile.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!validateMobile(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      // The backend expects JSON with string fields for name, mobile, email, and password.
      const response = await axios.post('http://localhost:5000/api/farmers/register', {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password: password.trim(),
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful!');
        // Store the user's email in localStorage for later use in CropManagement
        localStorage.setItem('userEmail', email.trim());
        // Optionally, you can also store other user details if needed
        setFormData({ name: '', mobile: '', email: '', password: '' });
        // Navigate to login after successful registration
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Farmer Registration</h1>
      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          style={styles.input}
          required
        />
        {/* Use type="tel" for mobile numbers */}
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number (10 digits)"
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          style={styles.input}
          required
          autoComplete="new-password"
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { width: '300px', margin: '0 auto', textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' },
  button: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white' },
  error: { color: 'red', marginBottom: '10px' },
  success: { color: 'green', marginBottom: '10px' },
};

export default RegistrationForm;