import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different device statuses
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const healthyIcon = createCustomIcon('#22c55e');
const tamperIcon = createCustomIcon('#ef4444');
const offlineIcon = createCustomIcon('#6b7280');

const MapView = ({ devices = [] }) => {
  const center = [28.6139, 77.2090]; // Delhi coordinates as default

  const getIcon = (status) => {
    switch (status) {
      case 'healthy': return healthyIcon;
      case 'tamper': return tamperIcon;
      case 'offline': return offlineIcon;
      default: return offlineIcon;
    }
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={center} zoom={6} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={[device.lat, device.lng]}
            icon={getIcon(device.status)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{device.name}</h3>
                <p className="text-sm text-gray-600">ID: {device.id}</p>
                <p className="text-sm">
                  Status: <span className={`font-medium ${
                    device.status === 'healthy' ? 'text-green-600' :
                    device.status === 'tamper' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">Location: {device.location}</p>
                <p className="text-sm text-gray-600">Last Update: {device.lastUpdate}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
