import React, { useEffect, useState } from 'react';
import { Users, Search, Edit2, Ban, CheckCircle, LogOut, DollarSign, Activity, Shield, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboardPage() {
  // Mock admin for UI consistency without auth
  const user = { fullName: 'Admin' };
  const isAdmin = true;
  const token = 'mock-admin-token';
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [isAdmin, navigate, token]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const usersRes = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data || []);

      const depositsRes = await axios.get('/api/admin/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeposits(depositsRes.data);

      const investmentsRes = await axios.get('/api/admin/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(investmentsRes.data);

    } catch (error) {
      console.error('Error fetching admin data', error);
    }
    setLoading(false);
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await axios.post(`/api/admin/users/${userId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const updateBalance = async (userId: string, currentBalance: number) => {
    const newBalanceStr = prompt('Enter new balance:', currentBalance.toString());
    if (newBalanceStr === null) return;
    
    const newBalance = parseFloat(newBalanceStr);
    if (isNaN(newBalance)) {
      alert('Invalid amount');
      return;
    }

    try {
      await axios.post(`/api/admin/users/${userId}/balance`, { balance: newBalance }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('Failed to update balance');
    }
  };

  const handleDepositAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await axios.post(`/api/admin/deposits/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error(`Failed to ${action} deposit`, error);
      alert(`Failed to ${action} deposit`);
    }
  };

  const handleInvestmentStatus = async (id: string, status: string) => {
    try {
      await axios.post(`/api/admin/investments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to update investment status', error);
      alert('Failed to update investment status');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="sticky top-24 z-50 flex flex-col md:flex-row items-start md:items-center justify-between bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-light gap-4 transition-colors duration-300 backdrop-blur-md bg-bg-secondary/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Control Panel</h1>
              <p className="text-sm text-text-secondary">Manage users, balances, and system settings</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-light flex items-center gap-4 transition-colors duration-300">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-medium">Total Users</p>
              <h2 className="text-3xl font-bold">{users.length}</h2>
            </div>
          </div>
          <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-light flex items-center gap-4 transition-colors duration-300">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-medium">Total Platform Balance</p>
              <h2 className="text-3xl font-bold">${users.reduce((sum, u) => sum + (u.balance || 0), 0).toFixed(2)}</h2>
            </div>
          </div>
          <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-light flex items-center gap-4 transition-colors duration-300">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-medium">Active Users</p>
              <h2 className="text-3xl font-bold">{users.filter(u => u.status === 'active').length}</h2>
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-bg-secondary rounded-2xl shadow-sm border border-border-light overflow-hidden flex flex-col transition-colors duration-300">
          <div className="p-6 border-b border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-bold">Registered Users</h3>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-light bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-accent-primary outline-none transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-light text-xs uppercase tracking-wider text-text-secondary font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-bg-tertiary transition-colors">
                      <td className="p-4 font-medium">{u.full_name || 'N/A'}</td>
                      <td className="p-4 text-text-secondary">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-bg-tertiary text-text-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-medium">${(u.balance || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          u.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' 
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateBalance(u.id, u.balance || 0)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Balance"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(u.id, u.status || 'active')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === 'active' 
                                ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' 
                                : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20'
                            }`}
                            title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            {u.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions & Deposits Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-secondary rounded-2xl shadow-sm border border-border-light overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-border-light flex items-center justify-between">
              <h3 className="text-lg font-bold">Pending Deposits</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-tertiary border-b border-border-light text-xs uppercase tracking-wider text-text-secondary font-semibold">
                    <th className="p-4">User</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {deposits.filter(d => d.status === 'PENDING').length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">No pending deposits.</td>
                    </tr>
                  ) : (
                    deposits.filter(d => d.status === 'PENDING').map(d => (
                      <tr key={d.id} className="hover:bg-bg-tertiary transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{d.fullName}</p>
                          <p className="text-xs text-text-secondary">{d.email}</p>
                        </td>
                        <td className="p-4 font-mono font-medium">${d.amount.toFixed(2)}</td>
                        <td className="p-4">{d.planName || 'Wallet'}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleDepositAction(d.id, 'approve')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDepositAction(d.id, 'reject')}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-2xl shadow-sm border border-border-light overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-border-light flex items-center justify-between">
              <h3 className="text-lg font-bold">Investments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-tertiary border-b border-border-light text-xs uppercase tracking-wider text-text-secondary font-semibold">
                    <th className="p-4">User</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {investments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">No investments found.</td>
                    </tr>
                  ) : (
                    investments.map(inv => (
                      <tr key={inv.id} className="hover:bg-bg-tertiary transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{inv.fullName}</p>
                          <p className="text-xs text-text-secondary">{inv.email}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{inv.planName}</p>
                          <p className="text-xs font-mono text-text-secondary">${inv.amount.toFixed(2)}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            inv.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                            inv.status === 'paused' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select 
                            value={inv.status}
                            onChange={(e) => handleInvestmentStatus(inv.id, e.target.value)}
                            className="bg-bg-tertiary border border-border-light text-text-primary text-sm rounded-lg focus:ring-accent-primary focus:border-accent-primary block w-full p-2"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="paused">Paused</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
