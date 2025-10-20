import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Globe,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock user data
  const [users, setUsers] = useState([
    {
      id: 'USR001',
      name: 'Priya Singh',
      email: 'priya.singh@regulator.gov.in',
      role: 'Admin',
      region: 'Delhi',
      status: 'Active',
      lastLogin: '2024-09-22T15:30:00Z',
      permissions: ['full_access', 'user_management', 'system_config'],
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 'USR002',
      name: 'Raj Kumar',
      email: 'raj.kumar@regulator.gov.in',
      role: 'Inspector',
      region: 'Mumbai',
      status: 'Active',
      lastLogin: '2024-09-22T14:45:00Z',
      permissions: ['view_alerts', 'acknowledge_alerts', 'add_notes'],
      createdAt: '2024-02-10T10:30:00Z'
    },
    {
      id: 'USR003',
      name: 'Amit Sharma',
      email: 'amit.sharma@regulator.gov.in',
      role: 'Regulator',
      region: 'Chennai',
      status: 'Active',
      lastLogin: '2024-09-22T13:20:00Z',
      permissions: ['view_devices', 'view_reports', 'export_data'],
      createdAt: '2024-03-05T14:15:00Z'
    },
    {
      id: 'USR004',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@regulator.gov.in',
      role: 'Technician',
      region: 'Delhi',
      status: 'Inactive',
      lastLogin: '2024-09-20T16:10:00Z',
      permissions: ['firmware_update', 'device_config', 'calibration'],
      createdAt: '2024-04-12T11:45:00Z'
    },
    {
      id: 'USR005',
      name: 'Meera Patel',
      email: 'meera.patel@regulator.gov.in',
      role: 'Inspector',
      region: 'Bangalore',
      status: 'Active',
      lastLogin: '2024-09-22T15:10:00Z',
      permissions: ['view_alerts', 'acknowledge_alerts', 'add_notes'],
      createdAt: '2024-05-20T08:30:00Z'
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Inspector',
    region: 'Delhi',
    permissions: []
  });

  const [systemSettings, setSystemSettings] = useState({
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    twoFactorAuth: true,
    auditLogging: true,
    dataRetention: 365,
    apiRateLimit: 1000
  });

  const [languages] = useState([
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' }
  ]);

  const rolePermissions = {
    Admin: ['full_access', 'user_management', 'system_config', 'view_alerts', 'acknowledge_alerts', 'add_notes', 'view_devices', 'view_reports', 'export_data', 'firmware_update', 'device_config', 'calibration'],
    Regulator: ['view_devices', 'view_reports', 'export_data', 'view_alerts'],
    Inspector: ['view_alerts', 'acknowledge_alerts', 'add_notes', 'view_devices'],
    Technician: ['firmware_update', 'device_config', 'calibration', 'view_devices']
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'text-purple-600 bg-purple-100';
      case 'Regulator': return 'text-blue-600 bg-blue-100';
      case 'Inspector': return 'text-green-600 bg-green-100';
      case 'Technician': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    const user = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      ...newUser,
      status: 'Active',
      lastLogin: null,
      permissions: rolePermissions[newUser.role] || [],
      createdAt: new Date().toISOString()
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Inspector', region: 'Delhi', permissions: [] });
    setShowAddUser(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleString() : 'Never';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Admin & Access Control</h3>
              <p className="mt-1 text-sm text-gray-500">Manage users, roles, and system settings</p>
            </div>
            {activeTab === 'users' && (
              <button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Role-Based Access
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System Settings
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'languages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Multi-language
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="regulator">Regulator</option>
                  <option value="inspector">Inspector</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.region}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(user.lastLogin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            {user.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Role-Based Access Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <div key={role} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{role}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                        {permissions.length} permissions
                      </span>
                    </div>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission} className="flex items-center">
                          <Shield className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700 capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.twoFactorAuth}
                        onChange={(e) => setSystemSettings({...systemSettings, twoFactorAuth: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.auditLogging}
                        onChange={(e) => setSystemSettings({...systemSettings, auditLogging: e.target.checked})}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Enable Audit Logging
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Data & Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
                      <input
                        type="number"
                        value={systemSettings.dataRetention}
                        onChange={(e) => setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">API Rate Limit (requests/hour)</label>
                      <input
                        type="number"
                        value={systemSettings.apiRateLimit}
                        onChange={(e) => setSystemSettings({...systemSettings, apiRateLimit: parseInt(e.target.value)})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Multi-language Tab */}
          {activeTab === 'languages' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <Globe className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Multi-language Support</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Configure language support for state-level regulators across India
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {languages.map((language) => (
                  <div key={language.code} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{language.name}</h3>
                          <p className="text-xs text-gray-500">{language.code.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={language.code === 'en' || language.code === 'hi'}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Save className="h-4 w-4 mr-2" />
                  Update Languages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Inspector">Inspector</option>
                  <option value="Regulator">Regulator</option>
                  <option value="Technician">Technician</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <select
                  value={newUser.region}
                  onChange={(e) => setNewUser({...newUser, region: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
