import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db, rtdb } from '../firebase/config';
import { ref, onValue, get, query as rtdbQuery, limitToLast } from 'firebase/database';

// Collection names
const COLLECTIONS = {
  DEVICES: 'devices',
  ALERTS: 'alerts',
  TAMPER_LOGS: 'tamperLogs',
  ACTIVITIES: 'activities',
  USERS: 'users'
};

// Device Service
export const deviceService = {
  // Get all devices with limit for better performance
  async getAllDevices(limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.DEVICES),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching devices:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  },

  // Get device by ID
  async getDeviceById(deviceId) {
    try {
      const docRef = doc(db, COLLECTIONS.DEVICES, deviceId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Device not found');
      }
    } catch (error) {
      console.error('Error fetching device:', error);
      throw error;
    }
  },

  // Add new device
  async addDevice(deviceData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.DEVICES), {
        ...deviceData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  },

  // Update device
  async updateDevice(deviceId, updates) {
    try {
      const docRef = doc(db, COLLECTIONS.DEVICES, deviceId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  },

  // Delete device
  async deleteDevice(deviceId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.DEVICES, deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  },

  // Get devices by status
  async getDevicesByStatus(status) {
    try {
      const q = query(
        collection(db, COLLECTIONS.DEVICES),
        where('status', '==', status)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching devices by status:', error);
      throw error;
    }
  },

  // Subscribe to device updates
  subscribeToDevices(callback) {
    const q = query(
      collection(db, COLLECTIONS.DEVICES),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const devices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(devices);
    }, (error) => {
      console.error('Error in devices subscription:', error);
      callback([]); // Return empty array on error
    });
  }
};

// Alert Service
export const alertService = {
  // Get all alerts with limit for better performance
  async getAllAlerts(limitCount = 100) {
    try {
      const q = query(
        collection(db, COLLECTIONS.ALERTS),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  },

  // Get recent alerts
  async getRecentAlerts(limitCount = 10) {
    try {
      const q = query(
        collection(db, COLLECTIONS.ALERTS),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      throw error;
    }
  },

  // Add new alert
  async addAlert(alertData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), {
        ...alertData,
        timestamp: new Date(),
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding alert:', error);
      throw error;
    }
  },

  // Update alert status
  async updateAlertStatus(alertId, status, notes = '') {
    try {
      const docRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(docRef, {
        status,
        notes,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  },

  // Real-time alert updates
  subscribeToAlerts(callback, errorCallback) {
    const q = query(
      collection(db, COLLECTIONS.ALERTS),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(alerts);
    }, (error) => {
      console.error('Error in alerts subscription:', error);
      if (errorCallback) {
        errorCallback(error);
      } else {
        callback([]); // Return empty array on error if no error callback
      }
    });
  },

  // Update alert (fix missing method)
  async updateAlert(alertId, updateData) {
    try {
      const docRef = doc(db, COLLECTIONS.ALERTS, alertId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }
};

// Activity Service
export const activityService = {
  // Get recent activities
  async getRecentActivities(limitCount = 20) {
    try {
      const q = query(
        collection(db, COLLECTIONS.ACTIVITIES),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Add new activity
  async addActivity(activityData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), {
        ...activityData,
        timestamp: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  },

  // Real-time activity updates
  subscribeToActivities(callback, limitCount = 20) {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(activities);
    });
  }
};

// Tamper Log Service
export const tamperLogService = {
  // Get all tamper logs with limit for better performance (Realtime DB)
  async getAllTamperLogs(limitCount = 100) {
    try {
      const logsRef = rtdbQuery(ref(rtdb, 'tamperLogs'), limitToLast(limitCount));
      const snapshot = await get(logsRef);
      if (!snapshot.exists()) return [];
      // Convert object to array and sort by timestamp desc
      const logsArr = Object.entries(snapshot.val() || {}).map(([id, data]) => ({ id, ...data }));
      return logsArr.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error fetching tamper logs (Realtime DB):', error);
      return [];
    }
  },

  // Subscribe to tamper logs real-time updates (Realtime DB)
  subscribeToTamperLogs(callback, errorCallback) {
    const logsRef = rtdbQuery(ref(rtdb, 'tamperLogs'), limitToLast(100));
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const logsArr = [];
      snapshot.forEach(child => {
        logsArr.push({ id: child.key, ...child.val() });
      });
      // Sort by timestamp desc
      callback(logsArr.sort((a, b) => b.timestamp - a.timestamp));
    }, (error) => {
      console.error('Error in tamper logs subscription (Realtime DB):', error);
      if (errorCallback) errorCallback(error);
      else callback([]);
    });
    return unsubscribe;
  }
};

// KPI Service - Calculate KPIs from real data
export const kpiService = {
  async calculateKPIs() {
    try {
      const devices = await deviceService.getAllDevices();
      const alerts = await alertService.getRecentAlerts(100); // Get recent alerts for calculation
      
      const totalDevices = devices.length;
      const activeAlerts = alerts.filter(alert => 
        alert.status === 'active' || alert.status === 'pending'
      ).length;
      const offlineDevices = devices.filter(device => 
        device.status === 'offline'
      ).length;
      const healthyDevices = devices.filter(device => 
        device.status === 'healthy'
      ).length;
      const complianceRate = totalDevices > 0 ? 
        Math.round((healthyDevices / totalDevices) * 100) : 0;

      return {
        totalDevices,
        activeAlerts,
        offlineDevices,
        complianceRate
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw error;
    }
  }
};

// Utility function to initialize sample data (for testing)
export const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const existingDevices = await deviceService.getAllDevices();
    if (existingDevices.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Add sample devices
    const sampleDevices = [
      {
        name: 'Scale Unit A1',
        type: 'Weighing Scale',
        status: 'healthy',
        location: 'Delhi Market, Shop 5',
        region: 'North',
        owner: 'Delhi Municipal Corp',
        manufacturer: 'TechScale Inc',
        model: 'TS-2000',
        serialNumber: 'TS2000-001',
        firmwareVersion: '2.1.4',
        lastHeartbeat: new Date(),
        uptime: '99.8%',
        batteryLevel: 85,
        powerStatus: 'AC Power',
        calibrationDate: new Date('2024-08-15'),
        calibrationExpiry: new Date('2025-08-15'),
        gpsLocation: { lat: 28.6139, lng: 77.2090 }
      },
      {
        name: 'Scale Unit B2',
        type: 'Weighing Scale',
        status: 'tamper',
        location: 'Mumbai Market, Shop 15',
        region: 'West',
        owner: 'Mumbai Municipal Corp',
        manufacturer: 'PrecisionTech',
        model: 'PT-3000',
        serialNumber: 'PT3000-002',
        firmwareVersion: '1.8.2',
        lastHeartbeat: new Date(),
        uptime: '95.2%',
        batteryLevel: 45,
        powerStatus: 'Battery',
        calibrationDate: new Date('2024-07-10'),
        calibrationExpiry: new Date('2025-07-10'),
        gpsLocation: { lat: 19.0760, lng: 72.8777 }
      }
    ];

    for (const device of sampleDevices) {
      await deviceService.addDevice(device);
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};
