import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="card-subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>
          {isLogin ? 'Sign in to your MiniPay account' : 'Join MiniPay for secure payments'}
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="loading"></span> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({ name: '', email: '', password: '' });
          }}
          className="toggle-btn"
        >
          {isLogin ? 'New to MiniPay? Create Account' : 'Already have an account? Sign In'}
        </button>

        <div style={{textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
          <p>Demo Credentials:</p>
          <p>Email: john@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
