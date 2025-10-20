import React, { useState, useEffect, useRef } from 'react';
import { tamperLogService } from '../services/firebaseService';
import { AlertTriangle, Search } from 'lucide-react';

const Alerts = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tamperLogs, setTamperLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTamperLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const logsData = await tamperLogService.getAllTamperLogs(50);
        setTamperLogs(logsData);
      } catch (err) {
        console.error('Error loading tamper logs:', err);
        setError('Failed to load tamper logs. Please check your connection and try again.');
        setTamperLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadTamperLogs();
  }, []);

  // Clear all alerts function (no toast logic)
  const clearAllToasts = () => {
    // No toast logic, function can be removed or repurposed if needed
  };

  const filteredLogs = tamperLogs.filter(log => {
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      log.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tamper Alerts Feed</h3>
              <p className="mt-1 text-sm text-gray-500">Monitor and manage tamper events and incidents</p>
            </div>
            <div className="flex space-x-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Device ID, name, location, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={clearAllToasts}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Clear All Alerts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tamper Logs Table or Empty State */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-red-600">Loading tamper alerts...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Tamper Alerts</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterSeverity !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'No tamper alerts have been detected.'}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{log.deviceName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{log.eventType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            log.severity === 'critical' ? 'bg-red-800 text-white' :
                            log.severity === 'high' ? 'bg-red-500 text-white' :
                            log.severity === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;