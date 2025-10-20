import React, { useState, useEffect } from 'react';
import { deviceService, tamperLogService } from '../services/firebaseService';
import { 
  Monitor, 
  Battery, 
  Wifi, 
  MapPin, 
  Calendar, 
  Settings,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check URL parameters for initial filters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, []);

  // Load devices from Firebase
  useEffect(() => {
    const loadDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        const devicesData = await deviceService.getAllDevices();
        setDevices(devicesData);
      } catch (err) {
        console.error('Error loading devices:', err);
        setError('Failed to load devices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDevices();

    // Set up real-time subscription
    const unsubscribe = deviceService.subscribeToDevices((updatedDevices) => {
      setDevices(updatedDevices);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'tamper': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'tamper': return AlertTriangle;
      case 'offline': return Clock;
      default: return Clock;
    }
  };

  const getBatteryColor = (level) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || device.region.toLowerCase() === regionFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    if (dateString.toDate) {
      return dateString.toDate().toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Devices</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state when no devices exist
  if (!loading && devices.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <Monitor className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-blue-800 font-medium text-lg mb-2">No Devices Found</h3>
        <p className="text-blue-600">
          No devices have been registered yet. Devices will appear here automatically when they are added to your Firebase collection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Device Inventory</h3>
              <p className="mt-1 text-sm text-gray-500">Manage and monitor all registered devices</p>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="tamper">Tamper Alert</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Devices List */}
        <div className="lg:col-span-2">
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Heartbeat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Battery
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevices.map((device) => {
                      const StatusIcon = getStatusIcon(device.status);
                      return (
                        <tr 
                          key={device.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedDevice(device)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Monitor className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{device.name}</div>
                                <div className="text-sm text-gray-500">{device.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StatusIcon className={`h-4 w-4 mr-2 ${getStatusColor(device.status).split(' ')[0]}`} />
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                                {device.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">{device.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimestamp(device.lastHeartbeat)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Battery className={`h-4 w-4 mr-2 ${getBatteryColor(device.batteryLevel)}`} />
                              <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
                                {device.batteryLevel}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDevice(device);
                              }}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Device Details Panel */}
        <div className="lg:col-span-1">
          {selectedDevice ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Device Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Device Profile</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDevice.status)}`}>
                        {selectedDevice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedDevice.name}</p>
                  </div>

                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Device ID:</span>
                        <span className="text-gray-900">{selectedDevice.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="text-gray-900">{selectedDevice.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manufacturer:</span>
                        <span className="text-gray-900">{selectedDevice.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Model:</span>
                        <span className="text-gray-900">{selectedDevice.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Serial Number:</span>
                        <span className="text-gray-900">{selectedDevice.serialNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Firmware & Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Firmware & Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Firmware Version:</span>
                        <span className="text-gray-900">{selectedDevice.firmwareVersion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Heartbeat:</span>
                        <span className="text-gray-900">{formatTimestamp(selectedDevice.lastHeartbeat)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Uptime:</span>
                        <span className="text-gray-900">{selectedDevice.uptime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Power & Battery */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Power & Battery</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Power Status:</span>
                        <span className="text-gray-900">{selectedDevice.powerStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Battery Level:</span>
                        <div className="flex items-center">
                          <Battery className={`h-4 w-4 mr-1 ${getBatteryColor(selectedDevice.batteryLevel)}`} />
                          <span className={`font-medium ${getBatteryColor(selectedDevice.batteryLevel)}`}>
                            {selectedDevice.batteryLevel}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calibration */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Calibration Certificate</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Calibration:</span>
                        <span className="text-gray-900">{formatDate(selectedDevice.calibrationDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expires:</span>
                        <span className="text-gray-900">{formatDate(selectedDevice.calibrationExpiry)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">GPS Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="text-gray-900">{selectedDevice.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Coordinates:</span>
                        <span className="text-gray-900">
                          {selectedDevice.gpsLocation.lat.toFixed(4)}, {selectedDevice.gpsLocation.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tamper History */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Tamper History</h4>
                    <div className="space-y-2">
                      {selectedDevice.tamperHistory.length > 0 ? (
                        selectedDevice.tamperHistory.map((event, index) => (
                          <div key={index} className="bg-gray-50 rounded-md p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-medium ${
                                event.status === 'Alert' ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {event.type}
                              </span>
                              <span className="text-xs text-gray-500">{formatTimestamp(event.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {event.status === 'Alert' ? 'Unauthorized access detected' : `Authorized by ${event.technician}`}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No tamper events recorded</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Device
                    </button>
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Force Sync
                    </button>
                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <Monitor className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Device Selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a device from the list to view details</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;
