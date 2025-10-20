import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Eye, 
  Download, 
  FileText, 
  Clock,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

const Audit = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [userFilter, setUserFilter] = useState('all');

  // Mock audit data
  const [userActivities] = useState([
    {
      id: 'ACT001',
      timestamp: '2024-09-22T15:30:00Z',
      user: 'Inspector Raj Kumar',
      role: 'Inspector',
      action: 'Acknowledged Alert',
      resource: 'Alert ALT001 - DEV002',
      ipAddress: '192.168.1.45',
      location: 'Mumbai Office',
      status: 'Success',
      details: 'Acknowledged tamper alert and assigned to field officer'
    },
    {
      id: 'ACT002',
      timestamp: '2024-09-22T15:25:00Z',
      user: 'Admin Priya Singh',
      role: 'Admin',
      action: 'Exported Report',
      resource: 'Tamper Log Report - September 2024',
      ipAddress: '192.168.1.32',
      location: 'Delhi Headquarters',
      status: 'Success',
      details: 'Generated and downloaded monthly tamper log report'
    },
    {
      id: 'ACT003',
      timestamp: '2024-09-22T15:20:00Z',
      user: 'Regulator Amit Sharma',
      role: 'Regulator',
      action: 'Viewed Device Profile',
      resource: 'Device DEV005 - Scale Unit E5',
      ipAddress: '192.168.1.67',
      location: 'Bangalore Regional Office',
      status: 'Success',
      details: 'Accessed device profile and tamper history'
    },
    {
      id: 'ACT004',
      timestamp: '2024-09-22T15:15:00Z',
      user: 'Technician Ravi Kumar',
      role: 'Technician',
      action: 'Firmware Update',
      resource: 'Device DEV001 - Scale Unit A1',
      ipAddress: '192.168.1.89',
      location: 'Delhi Field Office',
      status: 'Failed',
      details: 'Firmware update failed due to network connectivity issues'
    },
    {
      id: 'ACT005',
      timestamp: '2024-09-22T15:10:00Z',
      user: 'Inspector Meera Patel',
      role: 'Inspector',
      action: 'Added Inspection Note',
      resource: 'Alert ALT002 - DEV005',
      ipAddress: '192.168.1.23',
      location: 'Bangalore Field Office',
      status: 'Success',
      details: 'Added field inspection notes and evidence photos'
    }
  ]);

  const [complianceReports] = useState([
    {
      id: 'RPT001',
      title: 'Monthly Compliance Report - September 2024',
      type: 'Monthly Summary',
      generatedBy: 'System',
      timestamp: '2024-09-22T00:00:00Z',
      status: 'Generated',
      devices: 190,
      compliantDevices: 164,
      complianceRate: 86.3,
      criticalIssues: 3,
      downloadUrl: '/reports/monthly-sep-2024.pdf'
    },
    {
      id: 'RPT002',
      title: 'Legal Metrology Compliance Report',
      type: 'Regulatory',
      generatedBy: 'Admin Priya Singh',
      timestamp: '2024-09-20T14:30:00Z',
      status: 'Submitted',
      devices: 190,
      compliantDevices: 168,
      complianceRate: 88.4,
      criticalIssues: 2,
      downloadUrl: '/reports/legal-metrology-sep-2024.pdf'
    },
    {
      id: 'RPT003',
      title: 'Firmware Integrity Report',
      type: 'Security',
      generatedBy: 'System',
      timestamp: '2024-09-18T09:00:00Z',
      status: 'Generated',
      devices: 190,
      compliantDevices: 185,
      complianceRate: 97.4,
      criticalIssues: 1,
      downloadUrl: '/reports/firmware-integrity-sep-2024.pdf'
    }
  ]);

  const [firmwareStatus] = useState([
    {
      deviceId: 'DEV001',
      deviceName: 'Scale Unit A1',
      currentVersion: '2.1.4',
      latestVersion: '2.1.4',
      status: 'Up to Date',
      lastUpdated: '2024-09-15T10:30:00Z',
      authorized: true
    },
    {
      deviceId: 'DEV002',
      deviceName: 'Scale Unit B2',
      currentVersion: '1.8.2',
      latestVersion: '2.1.4',
      status: 'Outdated',
      lastUpdated: '2024-08-10T14:20:00Z',
      authorized: true
    },
    {
      deviceId: 'DEV003',
      deviceName: 'Scale Unit C3',
      currentVersion: '2.0.1',
      latestVersion: '2.1.4',
      status: 'Outdated',
      lastUpdated: '2024-08-25T11:15:00Z',
      authorized: true
    },
    {
      deviceId: 'DEV004',
      deviceName: 'Scale Unit D4',
      currentVersion: '3.2.1',
      latestVersion: '2.1.4',
      status: 'Unauthorized',
      lastUpdated: '2024-09-01T16:45:00Z',
      authorized: false
    }
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFirmwareStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'up to date': return 'text-green-600 bg-green-100';
      case 'outdated': return 'text-yellow-600 bg-yellow-100';
      case 'unauthorized': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredActivities = userActivities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'all' || activity.role.toLowerCase() === userFilter.toLowerCase();
    return matchesSearch && matchesUser;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId);
  };

  const handleGenerateReport = () => {
    console.log('Generating new compliance report...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Audit & Compliance</h3>
              <p className="mt-1 text-sm text-gray-500">Monitor user activities and regulatory compliance</p>
            </div>
            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Activity Logs
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'compliance'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compliance Reports
            </button>
            <button
              onClick={() => setActiveTab('firmware')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'firmware'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Firmware Integrity
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* User Activity Logs Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="regulator">Regulator</option>
                  <option value="inspector">Inspector</option>
                  <option value="technician">Technician</option>
                </select>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>

              {/* Activity Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User & Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                              <div className="text-sm text-gray-500">{activity.action}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{activity.resource}</div>
                          <div className="text-sm text-gray-500">{activity.details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity.location}</div>
                          <div className="text-sm text-gray-500">{activity.ipAddress}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(activity.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Compliance Reports Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {complianceReports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-8 w-8 text-primary-600" />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'Generated' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{report.type}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Devices:</span>
                        <span className="text-gray-900">{report.devices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Compliant:</span>
                        <span className="text-green-600">{report.compliantDevices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Compliance Rate:</span>
                        <span className="text-gray-900">{report.complianceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Critical Issues:</span>
                        <span className="text-red-600">{report.criticalIssues}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>Generated by {report.generatedBy}</span>
                        <span>{formatTimestamp(report.timestamp)}</span>
                      </div>
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Firmware Integrity Tab */}
          {activeTab === 'firmware' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Firmware Integrity Check</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Regular monitoring of device firmware versions and authorization status
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Latest Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {firmwareStatus.map((device) => (
                      <tr key={device.deviceId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Settings className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{device.deviceName}</div>
                              <div className="text-sm text-gray-500">{device.deviceId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {device.currentVersion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {device.latestVersion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFirmwareStatusColor(device.status)}`}>
                              {device.status}
                            </span>
                            {device.authorized ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(device.lastUpdated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {device.status === 'Outdated' && (
                            <button className="text-primary-600 hover:text-primary-900">
                              Update
                            </button>
                          )}
                          {device.status === 'Unauthorized' && (
                            <button className="text-red-600 hover:text-red-900">
                              Investigate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
