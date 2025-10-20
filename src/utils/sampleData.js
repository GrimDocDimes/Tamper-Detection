// Sample data for Firebase initialization
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { rtdb } from '../firebase/config';

// Sample alerts data
const sampleAlerts = [
  {
    deviceId: 'DEV001',
    deviceName: 'Scale Unit A1',
    severity: 'critical',
    status: 'active',
    message: 'Unauthorized access detected',
    description: 'Device tampering attempt detected at 14:30. Physical seal broken.',
    location: 'Delhi Market, Shop 5',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    timestamp: serverTimestamp(),
    assignedTo: null,
    notes: []
  },
  {
    deviceId: 'DEV002',
    deviceName: 'Scale Unit B2',
    severity: 'medium',
    status: 'pending',
    message: 'Calibration drift detected',
    description: 'Weight measurements showing consistent 2% deviation from standard.',
    location: 'Mumbai Market, Stall 12',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    timestamp: serverTimestamp(),
    assignedTo: null,
    notes: []
  },
  {
    deviceId: 'DEV003',
    deviceName: 'Scale Unit C3',
    severity: 'low',
    status: 'resolved',
    message: 'Connectivity issue resolved',
    description: 'Network connection restored after maintenance.',
    location: 'Bangalore Market, Zone A',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    timestamp: serverTimestamp(),
    assignedTo: 'Inspector Kumar',
    notes: ['Issue resolved after router replacement']
  }
];

// Sample tamper logs data
const sampleTamperLogs = [
  {
    deviceId: 'DEV001',
    deviceName: 'Scale Unit A1',
    eventType: 'Physical Tampering',
    severity: 'Critical',
    description: 'Unauthorized access to device housing',
    location: 'Delhi Market, Shop 5',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    timestamp: serverTimestamp(),
    evidence: {
      photos: ['evidence_001.jpg', 'evidence_002.jpg'],
      hash: 'sha256:abc123def456',
      signature: 'digital_signature_001'
    },
    chainOfCustody: [
      {
        action: 'Evidence collected',
        officer: 'Inspector Sharma',
        timestamp: serverTimestamp(),
        location: 'Delhi Market, Shop 5'
      }
    ]
  },
  {
    deviceId: 'DEV002',
    deviceName: 'Scale Unit B2',
    eventType: 'Software Modification',
    severity: 'High',
    description: 'Firmware modification attempt detected',
    location: 'Mumbai Market, Stall 12',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    timestamp: serverTimestamp(),
    evidence: {
      logs: ['system_log_001.txt'],
      hash: 'sha256:def456ghi789',
      signature: 'digital_signature_002'
    },
    chainOfCustody: [
      {
        action: 'Anomaly detected',
        officer: 'System Monitor',
        timestamp: serverTimestamp(),
        location: 'Mumbai Market, Stall 12'
      }
    ]
  }
];

// Sample devices data
const sampleDevices = [
  {
    name: 'Scale Unit A1',
    type: 'Digital Scale',
    location: 'Delhi Market, Shop 5',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    status: 'healthy',
    lastSeen: serverTimestamp(),
    batteryLevel: 85,
    firmwareVersion: '2.1.3',
    serialNumber: 'DS001-2024',
    installationDate: serverTimestamp()
  },
  {
    name: 'Scale Unit B2',
    type: 'Digital Scale',
    location: 'Mumbai Market, Stall 12',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    status: 'warning',
    lastSeen: serverTimestamp(),
    batteryLevel: 45,
    firmwareVersion: '2.1.2',
    serialNumber: 'DS002-2024',
    installationDate: serverTimestamp()
  },
  {
    name: 'Scale Unit C3',
    type: 'Digital Scale',
    location: 'Bangalore Market, Zone A',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'offline',
    lastSeen: serverTimestamp(),
    batteryLevel: 0,
    firmwareVersion: '2.1.1',
    serialNumber: 'DS003-2024',
    installationDate: serverTimestamp()
  }
];

// Function to initialize sample data (Realtime DB only for tamper logs)
export const initializeSampleData = async () => {
  try {
    for (const log of sampleTamperLogs) {
      const logRef = push(ref(rtdb, 'tamperLogs'));
      await set(logRef, {
        ...log,
        timestamp: Date.now()
      });
    }
    console.log('Sample tamper logs added successfully (Realtime DB)');
    return true;
  } catch (error) {
    console.error('Error initializing sample data (Realtime DB):', error);
    throw error;
  }
};

// Quick function to add tamper logs only
export const addSampleTamperLogs = async () => {
  try {
    for (const log of sampleTamperLogs) {
      const logRef = push(ref(rtdb, 'tamperLogs'));
      await set(logRef, {
        ...log,
        timestamp: Date.now()
      });
    }
    console.log('Sample tamper logs added successfully (Realtime DB)');
    return true;
  } catch (error) {
    console.error('Error adding sample tamper logs (Realtime DB):', error);
    throw error;
  }
};
