import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [addAmount, setAddAmount] = useState('');
  const [paymentData, setPaymentData] = useState({ receiverEmail: '', amount: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/wallet/add', { amount: parseFloat(addAmount) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Money added successfully!');
      setAddAmount('');
      fetchUserProfile();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding money');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/payment/send', {
        receiverEmail: paymentData.receiverEmail,
        amount: parseFloat(paymentData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Payment sent successfully!');
      setPaymentData({ receiverEmail: '', amount: '' });
      fetchUserProfile();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error sending payment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Mini Payment Portal</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="wallet-info">
          <h2>Welcome, {user.name}</h2>
          <p>Balance: ₹{user.balance}</p>
        </div>

        <div className="actions">
          <div className="add-money">
            <h3>Add Money</h3>
            <form onSubmit={handleAddMoney}>
              <input
                type="number"
                placeholder="Amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                required
              />
              <button type="submit">Add Money</button>
            </form>
          </div>

          <div className="make-payment">
            <h3>Make Payment</h3>
            <form onSubmit={handlePayment}>
              <input
                type="email"
                placeholder="Receiver Email"
                value={paymentData.receiverEmail}
                onChange={(e) => setPaymentData({ ...paymentData, receiverEmail: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Amount"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                required
              />
              <button type="submit">Send Payment</button>
            </form>
          </div>
        </div>

        <div className="navigation">
          <button onClick={() => navigate('/transactions')}>View Transaction History</button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
