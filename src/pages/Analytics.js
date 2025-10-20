import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const complianceRef = useRef(null);

  // Check URL parameters for direct navigation to compliance section
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section === 'compliance' && complianceRef.current) {
      setTimeout(() => {
        complianceRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        // Add highlight effect
        complianceRef.current.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
        setTimeout(() => {
          complianceRef.current.style.boxShadow = '';
        }, 2000);
      }, 100);
    }
  }, []);

  // Mock analytics data
  const tamperTrendsData = [
    { month: 'Jan', tamperEvents: 12, deviceFailures: 3, totalDevices: 150 },
    { month: 'Feb', tamperEvents: 19, deviceFailures: 5, totalDevices: 155 },
    { month: 'Mar', tamperEvents: 8, deviceFailures: 2, totalDevices: 160 },
    { month: 'Apr', tamperEvents: 15, deviceFailures: 4, totalDevices: 165 },
    { month: 'May', tamperEvents: 22, deviceFailures: 7, totalDevices: 170 },
    { month: 'Jun', tamperEvents: 18, deviceFailures: 6, totalDevices: 175 },
    { month: 'Jul', tamperEvents: 25, deviceFailures: 8, totalDevices: 180 },
    { month: 'Aug', tamperEvents: 14, deviceFailures: 4, totalDevices: 185 },
    { month: 'Sep', tamperEvents: 20, deviceFailures: 5, totalDevices: 190 }
  ];

  const regionData = [
    { name: 'North', tamperEvents: 45, devices: 50, rate: 90 },
    { name: 'South', tamperEvents: 32, devices: 48, rate: 66.7 },
    { name: 'East', tamperEvents: 28, devices: 46, rate: 60.9 },
    { name: 'West', tamperEvents: 38, devices: 46, rate: 82.6 }
  ];

  const tamperTypeData = [
    { name: 'Firmware Tamper', value: 35, color: '#ef4444' },
    { name: 'Enclosure Open', value: 28, color: '#f59e0b' },
    { name: 'Weight Anomaly', value: 22, color: '#3b82f6' },
    { name: 'Sensor Tamper', value: 15, color: '#8b5cf6' }
  ];

  const heatmapData = [
    { district: 'Central Delhi', state: 'Delhi', tamperRate: 8.5, lat: 28.6139, lng: 77.2090 },
    { district: 'South Mumbai', state: 'Maharashtra', tamperRate: 12.3, lat: 19.0760, lng: 72.8777 },
    { district: 'T. Nagar', state: 'Tamil Nadu', tamperRate: 6.7, lat: 13.0827, lng: 80.2707 },
    { district: 'Salt Lake', state: 'West Bengal', tamperRate: 9.2, lat: 22.5726, lng: 88.3639 },
    { district: 'Koramangala', state: 'Karnataka', tamperRate: 11.8, lat: 12.9716, lng: 77.5946 },
    { district: 'Banjara Hills', state: 'Telangana', tamperRate: 7.4, lat: 17.3850, lng: 78.4867 },
    { district: 'Vastrapur', state: 'Gujarat', tamperRate: 10.1, lat: 23.0225, lng: 72.5714 },
    { district: 'Civil Lines', state: 'Uttar Pradesh', tamperRate: 13.6, lat: 26.8467, lng: 80.9462 }
  ];

  const complianceData = [
    { month: 'Jan', compliant: 88, nonCompliant: 12 },
    { month: 'Feb', compliant: 85, nonCompliant: 15 },
    { month: 'Mar', compliant: 92, nonCompliant: 8 },
    { month: 'Apr', compliant: 87, nonCompliant: 13 },
    { month: 'May', compliant: 83, nonCompliant: 17 },
    { month: 'Jun', compliant: 89, nonCompliant: 11 },
    { month: 'Jul', compliant: 81, nonCompliant: 19 },
    { month: 'Aug', compliant: 91, nonCompliant: 9 },
    { month: 'Sep', compliant: 86, nonCompliant: 14 }
  ];

  const predictiveData = [
    { device: 'DEV007', riskScore: 85, factors: ['High vibration', 'Irregular patterns'] },
    { device: 'DEV012', riskScore: 78, factors: ['Battery degradation', 'Network issues'] },
    { device: 'DEV023', riskScore: 72, factors: ['Location history', 'Usage patterns'] },
    { device: 'DEV031', riskScore: 68, factors: ['Environmental factors', 'Age'] },
    { device: 'DEV045', riskScore: 65, factors: ['Maintenance overdue', 'Calibration drift'] }
  ];

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getHeatmapColor = (rate) => {
    if (rate >= 12) return '#dc2626'; // red-600
    if (rate >= 9) return '#ea580c';  // orange-600
    if (rate >= 6) return '#d97706';  // amber-600
    return '#16a34a'; // green-600
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Data Analytics & Insights</h3>
              <p className="mt-1 text-sm text-gray-500">Comprehensive analysis of tamper patterns and device performance</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tamper Detection Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">94.2%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">False Positive Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">2.1%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High-Risk Areas</dt>
                  <dd className="text-lg font-medium text-gray-900">8 Districts</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                  <dd className="text-lg font-medium text-gray-900">4.2 min</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tamper Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Tamper Rate Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tamperTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tamperEvents" stroke="#ef4444" strokeWidth={2} name="Tamper Events" />
                <Line type="monotone" dataKey="deviceFailures" stroke="#f59e0b" strokeWidth={2} name="Device Failures" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Tamper Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tamperEvents" fill="#3b82f6" name="Tamper Events" />
                <Bar dataKey="devices" fill="#10b981" name="Total Devices" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tamper Types Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tamper Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tamperTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tamperTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Trends */}
        <div ref={complianceRef} className="bg-white shadow rounded-lg transition-shadow duration-300">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Rate Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="compliant" stackId="1" stroke="#10b981" fill="#10b981" name="Compliant %" />
                <Area type="monotone" dataKey="nonCompliant" stackId="1" stroke="#ef4444" fill="#ef4444" name="Non-Compliant %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap and Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tamper Hotspots Heatmap */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tamper Hotspots by District</h3>
            <div className="space-y-3">
              {heatmapData.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getHeatmapColor(location.tamperRate) }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{location.district}</p>
                      <p className="text-xs text-gray-500">{location.state}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{location.tamperRate}%</p>
                    <p className="text-xs text-gray-500">tamper rate</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Low Risk</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <div className="w-3 h-3 bg-amber-600 rounded"></div>
                <div className="w-3 h-3 bg-orange-600 rounded"></div>
                <div className="w-3 h-3 bg-red-600 rounded"></div>
              </div>
              <span>High Risk</span>
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Predictive Insights</h3>
            <p className="text-sm text-gray-600 mb-4">Devices likely to be tampered soon based on AI analysis</p>
            <div className="space-y-3">
              {predictiveData.map((device, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(device.riskScore)}`}>
                      {device.riskScore}% Risk
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {device.factors.map((factor, factorIndex) => (
                      <span key={factorIndex} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button 
                onClick={() => {
                  // In real app, this would trigger AI model refresh
                  console.log('Refreshing predictions...');
                  // Show loading state briefly
                  const button = document.querySelector('[data-refresh-predictions]');
                  if (button) {
                    const originalText = button.innerHTML;
                    button.innerHTML = '<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Refreshing...';
                    button.disabled = true;
                    setTimeout(() => {
                      button.innerHTML = originalText;
                      button.disabled = false;
                      alert('Predictions refreshed successfully!');
                    }, 2000);
                  }
                }}
                data-refresh-predictions
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Predictions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Trend Analysis</h4>
              <p className="text-sm text-blue-700">Tamper events increased by 15% in the last quarter, primarily in urban areas.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Risk Factors</h4>
              <p className="text-sm text-yellow-700">High-traffic commercial areas show 3x higher tamper rates than residential zones.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Recommendations</h4>
              <p className="text-sm text-green-700">Deploy additional monitoring in North and West regions for better coverage.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
