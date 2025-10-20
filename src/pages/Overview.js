import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import MapView from '../components/MapView';
import { deviceService, kpiService, activityService } from '../services/firebaseService';
import { 
  Monitor, 
  AlertTriangle, 
  WifiOff, 
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';

const Overview = () => {
  const [filters, setFilters] = useState({
    region: 'all',
    deviceType: 'all',
    owner: 'all',
    manufacturer: 'all'
  });

  const [devices, setDevices] = useState([]);
  const [activities, setActivities] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalDevices: 0,
    activeAlerts: 0,
    offlineDevices: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load devices and KPIs in parallel
        const [devicesData, kpiDataResult, activitiesData] = await Promise.all([
          deviceService.getAllDevices(),
          kpiService.calculateKPIs(),
          activityService.getRecentActivities(5)
        ]);

        // Transform device data for map compatibility
        const transformedDevices = devicesData.map(device => ({
          ...device,
          lat: device.gpsLocation?.lat || 0,
          lng: device.gpsLocation?.lng || 0,
          region: device.region?.toLowerCase() || 'unknown',
          type: device.type?.toLowerCase().replace(' ', '_') || 'unknown'
        }));

        setDevices(transformedDevices);
        setKpiData(kpiDataResult);
        setActivities(activitiesData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions
    const unsubscribeDevices = deviceService.subscribeToDevices((updatedDevices) => {
      const transformedDevices = updatedDevices.map(device => ({
        ...device,
        lat: device.gpsLocation?.lat || 0,
        lng: device.gpsLocation?.lng || 0,
        region: device.region?.toLowerCase() || 'unknown',
        type: device.type?.toLowerCase().replace(' ', '_') || 'unknown'
      }));
      setDevices(transformedDevices);
    });

    const unsubscribeActivities = activityService.subscribeToActivities((updatedActivities) => {
      setActivities(updatedActivities.slice(0, 5));
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeDevices();
      unsubscribeActivities();
    };
  }, []);

  // Recalculate KPIs when devices change
  useEffect(() => {
    if (devices.length > 0) {
      const total = devices.length;
      const alerts = devices.filter(d => d.status === 'tamper').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      const healthy = devices.filter(d => d.status === 'healthy').length;
      const compliance = total > 0 ? Math.round((healthy / total) * 100) : 0;

      setKpiData({
        totalDevices: total,
        activeAlerts: alerts,
        offlineDevices: offline,
        complianceRate: compliance
      });
    }
  }, [devices]);

  const filteredDevices = devices.filter(device => {
    return (filters.region === 'all' || device.region === filters.region) &&
           (filters.deviceType === 'all' || device.type === filters.deviceType) &&
           (filters.owner === 'all' || device.owner === filters.owner) &&
           (filters.manufacturer === 'all' || device.manufacturer === filters.manufacturer);
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Devices"
          value={kpiData.totalDevices}
          subtitle="Registered devices"
          icon={Monitor}
          color="blue"
          navigateTo="/devices"
        />
        <KPICard
          title="Active Alerts"
          value={kpiData.activeAlerts}
          subtitle="Last 24 hours"
          icon={AlertTriangle}
          color="red"
          trend={{ direction: 'up', value: '+2' }}
          navigateTo="/alerts"
        />
        <KPICard
          title="Offline Devices"
          value={kpiData.offlineDevices}
          subtitle=">24h offline"
          icon={WifiOff}
          color="gray"
          onClick={() => {
            // Navigate to devices page with offline filter
            window.location.href = '/devices?status=offline';
          }}
        />
        <KPICard
          title="Compliance Rate"
          value={`${kpiData.complianceRate}%`}
          subtitle="Healthy vs tampered"
          icon={CheckCircle}
          color="green"
          trend={{ direction: 'down', value: '-5%' }}
          navigateTo="/analytics?section=compliance"
        />
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Filters</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Device Type</label>
              <select
                value={filters.deviceType}
                onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="weighing_scale">Weighing Scale</option>
                <option value="fuel_dispenser">Fuel Dispenser</option>
                <option value="gas_meter">Gas Meter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner</label>
              <select
                value={filters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Owners</option>
                <option value="Delhi Municipal Corp">Delhi Municipal Corp</option>
                <option value="Mumbai Municipal Corp">Mumbai Municipal Corp</option>
                <option value="Chennai Municipal Corp">Chennai Municipal Corp</option>
                <option value="Kolkata Municipal Corp">Kolkata Municipal Corp</option>
                <option value="Bangalore Municipal Corp">Bangalore Municipal Corp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
              <select
                value={filters.manufacturer}
                onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="all">All Manufacturers</option>
                <option value="TechScale Inc">TechScale Inc</option>
                <option value="PrecisionTech">PrecisionTech</option>
                <option value="AccuWeigh">AccuWeigh</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Device Locations</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Healthy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Tamper Alert</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span>Offline</span>
              </div>
            </div>
          </div>
          <MapView devices={filteredDevices} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            {activities.length > 0 ? (
              <ul className="-mb-8">
                {activities.map((activity, index) => {
                  const isLast = index === activities.length - 1;
                  const getActivityIcon = (type) => {
                    switch (type) {
                      case 'tamper': return AlertTriangle;
                      case 'offline': return WifiOff;
                      case 'online': return CheckCircle;
                      default: return Monitor;
                    }
                  };
                  const getActivityColor = (type) => {
                    switch (type) {
                      case 'tamper': return 'bg-red-500';
                      case 'offline': return 'bg-gray-500';
                      case 'online': return 'bg-green-500';
                      default: return 'bg-blue-500';
                    }
                  };
                  const ActivityIcon = getActivityIcon(activity.type);
                  
                  return (
                    <li key={activity.id}>
                      <div className={`relative ${!isLast ? 'pb-8' : ''}`}>
                        {!isLast && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center ring-8 ring-white`}>
                              <ActivityIcon className="h-4 w-4 text-white" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.description || activity.message}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {activity.timestamp ? new Date(activity.timestamp.toDate()).toLocaleString() : 'Unknown time'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Monitor className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Activity</h3>
                <p className="mt-1 text-sm text-gray-500">Activity will appear here as devices report status changes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
