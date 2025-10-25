import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [transactions, setTransactions] = useState([]);
  const [paymentData, setPaymentData] = useState({ receiverEmail: '', amount: '' });
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchTransactions();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/payment/send`, paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Payment sent successfully!');
      setPaymentData({ receiverEmail: '', amount: '' });
      fetchProfile();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/wallet/add`, { amount: addMoneyAmount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Money added successfully!');
      setAddMoneyAmount('');
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/payment/refund/${transactionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Refund processed successfully!');
      fetchProfile();
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Refund failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalSent = transactions
    .filter(t => t.sender_id === user?.id)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalReceived = transactions
    .filter(t => t.receiver_id === user?.id)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="fade-in">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-brand">MiniPay</div>
        <div className="navbar-user">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="main-content">
        {/* Error/Success Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(16, 185, 129, 0.2)'}}>{success}</div>}

        {/* Stats Cards */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>₹{user?.balance || 0}</h3>
            <p>Current Balance</p>
          </div>
          <div className="stat-card">
            <h3>₹{totalSent}</h3>
            <p>Total Sent</p>
          </div>
          <div className="stat-card">
            <h3>₹{totalReceived}</h3>
            <p>Total Received</p>
          </div>
          <div className="stat-card">
            <h3>{transactions.length}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="dashboard-grid">
          {/* Add Money Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Money</h3>
            </div>
            <form onSubmit={handleAddMoney}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? <span className="loading"></span> : 'Add Money'}
              </button>
            </form>
          </div>

          {/* Send Payment Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Send Payment</h3>
            </div>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label className="form-label">Recipient Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="recipient@example.com"
                  value={paymentData.receiverEmail}
                  onChange={(e) => setPaymentData({...paymentData, receiverEmail: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter amount"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading"></span> : 'Send Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header justify-between">
            <h3 className="card-title">Recent Transactions</h3>
            <button onClick={() => navigate('/transactions')} className="btn btn-secondary">
              View All
            </button>
          </div>

          {transactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    <td>
                      {transaction.sender_id === user?.id ? (
                        <span style={{color: 'var(--danger-color)'}}>Sent to {transaction.receiver_name}</span>
                      ) : (
                        <span style={{color: 'var(--accent-color)'}}>Received from {transaction.sender_name}</span>
                      )}
                    </td>
                    <td>₹{transaction.amount}</td>
                    <td>
                      <span className={`status-badge ${
                        transaction.status === 'Success' ? 'status-success' :
                        transaction.status === 'Refunded' ? 'status-refunded' : 'status-failed'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      {transaction.status === 'Success' && transaction.sender_id === user?.id && (
                        <button onClick={() => handleRefund(transaction.id)} className="btn btn-danger btn-sm">
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center" style={{color: 'var(--text-secondary)', padding: '2rem'}}>
              No transactions yet. Start by adding money or sending a payment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
