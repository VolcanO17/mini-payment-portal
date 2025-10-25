import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, sent, received
  const [statusFilter, setStatusFilter] = useState('all'); // all, success, failed, refunded
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    }
  };

  const filterTransactions = useCallback(() => {
    let filtered = transactions;

    // Filter by type
    if (filter !== 'all') {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      if (filter === 'sent') {
        filtered = filtered.filter(t => t.sender_id === user.id);
      } else if (filter === 'received') {
        filtered = filtered.filter(t => t.receiver_id === user.id);
      }
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase() === statusFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, filter, statusFilter]);

  useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  const handleRefund = async (transactionId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/payment/refund/${transactionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Refund processed successfully!');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Refund failed');
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="fade-in">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-brand">MiniPay</div>
        <div className="navbar-user">
          <span>Transaction History</span>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="main-content">
        {/* Error/Success Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', border: '1px solid rgba(16, 185, 129, 0.2)'}}>{success}</div>}

        {/* Filters */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Filter Transactions</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>{filteredTransactions.length}</h3>
            <p>Filtered Transactions</p>
          </div>
          <div className="stat-card">
            <h3>₹{filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)}</h3>
            <p>Total Amount</p>
          </div>
          <div className="stat-card">
            <h3>{filteredTransactions.filter(t => t.status === 'Success').length}</h3>
            <p>Successful</p>
          </div>
          <div className="stat-card">
            <h3>{filteredTransactions.filter(t => t.status === 'Refunded').length}</h3>
            <p>Refunded</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Transaction Details</h3>
          </div>

          {filteredTransactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    <td>
                      {transaction.sender_id === user?.id ? (
                        <span style={{color: 'var(--danger-color)'}}>Sent</span>
                      ) : (
                        <span style={{color: 'var(--accent-color)'}}>Received</span>
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
                      {transaction.sender_id === user?.id ? (
                        <span>To: {transaction.receiver_name}</span>
                      ) : (
                        <span>From: {transaction.sender_name}</span>
                      )}
                    </td>
                    <td>
                      {transaction.status === 'Success' && transaction.sender_id === user?.id && (
                        <button
                          onClick={() => handleRefund(transaction.id)}
                          className="btn btn-danger"
                          disabled={loading}
                        >
                          {loading ? <span className="loading"></span> : 'Refund'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center" style={{color: 'var(--text-secondary)', padding: '2rem'}}>
              No transactions found matching your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
