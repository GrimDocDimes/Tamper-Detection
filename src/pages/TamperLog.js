import React, { useState, useEffect } from 'react';
import { addSampleTamperLogs } from '../utils/sampleData';
import { tamperLogService } from '../services/firebaseService';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Download,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const TamperLog = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [tamperLogs, setTamperLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTamperLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading tamper logs...');
        
        // Test Firebase connection first
        const { db } = await import('../firebase/config');
        if (!db) {
          throw new Error('Firebase not initialized');
        }
        
        const logsData = await tamperLogService.getAllTamperLogs(50);
        console.log('Tamper logs loaded:', logsData.length);
        setTamperLogs(logsData);
        
        // Handle empty collection gracefully - this is normal for new Firebase projects
        if (logsData.length === 0) {
          console.log('No tamper logs found in Firebase collection');
          // Don't set error for empty collection, just show empty state
        }
      } catch (error) {
        console.error('Error loading tamper logs:', error);
        
        // More specific error messages
        if (error.code === 'permission-denied') {
          setError('Permission denied. Please check Firestore security rules.');
        } else if (error.code === 'unavailable') {
          setError('Firebase service unavailable. Please check your internet connection.');
        } else if (error.message.includes('timeout')) {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Failed to load tamper logs: ${error.message}`);
        }
        
        setTamperLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadTamperLogs();

    // Set up real-time subscription with better error handling
    let unsubscribe;
    try {
      unsubscribe = tamperLogService.subscribeToTamperLogs((logsData) => {
        console.log('Real-time update received:', logsData.length, 'tamper logs');
        setTamperLogs(logsData);
        setLoading(false);
        setError(null);
      });
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      // Don't set error here, let the initial load handle it
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = tamperLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    // Date filtering
    const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
    const now = new Date();
    let matchesDate = true;
    
    if (dateRange === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= sevenDaysAgo;
    } else if (dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= thirtyDaysAgo;
    } else if (dateRange === '90days') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesDate = logDate >= ninetyDaysAgo;
    } else if (dateRange === 'custom' && customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      matchesDate = logDate >= startDate && logDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Tamper Logs</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handler to add sample tamper logs
  const handleAddSampleData = async () => {
    try {
      await addSampleTamperLogs();
      alert('Sample tamper logs added! Reloading...');
      window.location.reload();
    } catch (err) {
      alert('Failed to add sample data: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="flex justify-end p-2">
          <button
            onClick={handleAddSampleData}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            Add Sample Tamper Logs
          </button>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tamper Event Log</h3>
              <p className="mt-1 text-sm text-gray-500">Blockchain-secured audit trail of device tampering events</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                if (e.target.value !== 'custom') {
                  setShowCustomRange(false);
                }
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>

            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Custom Date Range */}
          {showCustomRange && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tamper Logs Table or Empty State */}
      {tamperLogs.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-blue-800 font-medium text-lg mb-2">No Tamper Logs Found</h3>
          <p className="text-blue-600">
            No tamper events have been recorded yet. This collection will populate automatically when tamper events are detected by your devices.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{log.deviceName}</div>
                            <div className="text-sm text-gray-500">{log.deviceId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{log.eventType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Selected Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedLog(null)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tamper Event Details</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Event ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Device</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.deviceName} ({selectedLog.deviceId})</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Event Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.eventType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Severity</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.description}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLog.location}</p>
                  </div>
                </div>

                {/* Cryptographic Evidence */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Cryptographic Evidence</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Signature Hash</label>
                      <p className="mt-1 text-xs text-gray-900 font-mono break-all">{selectedLog.signatureHash}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Blockchain Anchor</label>
                      <p className="mt-1 text-xs text-gray-900 font-mono break-all">{selectedLog.blockchainAnchor}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Signature Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedLog.signatureValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedLog.signatureValid ? 'Valid' : 'Invalid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evidence Files */}
                {selectedLog.evidenceFiles && selectedLog.evidenceFiles.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Evidence Files</h4>
                    <div className="space-y-2">
                      {selectedLog.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.type} • {file.size}</p>
                            </div>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chain of Custody */}
                {selectedLog.chainOfCustody && selectedLog.chainOfCustody.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Chain of Custody</h4>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {selectedLog.chainOfCustody.map((event, index) => (
                          <li key={index}>
                            <div className="relative pb-8">
                              {index !== selectedLog.chainOfCustody.length - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                    <User className="h-4 w-4 text-white" />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-900">{event.action}</p>
                                    <p className="text-sm text-gray-500">by {event.actor}</p>
                                    <p className="text-xs text-gray-400 font-mono">{event.hash}</p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {formatTimestamp(event.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TamperLog;
