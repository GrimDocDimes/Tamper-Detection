// Firebase connection and integration test
import { db } from '../firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { alertService, tamperLogService, deviceService } from '../services/firebaseService';

export const testFirebaseBackend = async () => {
  const testResults = {
    firebaseConfig: false,
    databaseConnection: false,
    collections: {
      alerts: { exists: false, count: 0 },
      tamperLogs: { exists: false, count: 0 },
      devices: { exists: false, count: 0 }
    },
    services: {
      alertService: false,
      tamperLogService: false,
      deviceService: false
    },
    realTimeSubscriptions: false,
    errors: []
  };

  console.log('🔍 Testing Firebase Backend Connection...');

  // 1. Test Firebase Configuration
  try {
    if (db && db.app) {
      testResults.firebaseConfig = true;
      console.log('✅ Firebase configuration loaded');
    } else {
      throw new Error('Firebase not properly initialized');
    }
  } catch (error) {
    testResults.errors.push(`Firebase config error: ${error.message}`);
    console.error('❌ Firebase configuration failed:', error);
  }

  // 2. Test Database Connection
  try {
    const testQuery = query(collection(db, 'alerts'), limit(1));
    await getDocs(testQuery);
    testResults.databaseConnection = true;
    console.log('✅ Database connection successful');
  } catch (error) {
    testResults.errors.push(`Database connection error: ${error.message}`);
    console.error('❌ Database connection failed:', error);
    return testResults; // Stop here if no connection
  }

  // 3. Test Collections
  const collectionsToTest = ['alerts', 'tamperLogs', 'devices'];
  
  for (const collectionName of collectionsToTest) {
    try {
      const testQuery = query(collection(db, collectionName), limit(10));
      const snapshot = await getDocs(testQuery);
      testResults.collections[collectionName] = {
        exists: true,
        count: snapshot.size
      };
      console.log(`✅ Collection '${collectionName}': ${snapshot.size} documents`);
    } catch (error) {
      testResults.collections[collectionName] = {
        exists: false,
        count: 0,
        error: error.message
      };
      console.log(`⚠️ Collection '${collectionName}': ${error.message}`);
    }
  }

  // 4. Test Firebase Services
  try {
    const alerts = await alertService.getAllAlerts(5);
    testResults.services.alertService = true;
    console.log(`✅ Alert Service: Retrieved ${alerts.length} alerts`);
  } catch (error) {
    testResults.services.alertService = false;
    testResults.errors.push(`Alert Service error: ${error.message}`);
    console.error('❌ Alert Service failed:', error);
  }

  try {
    const tamperLogs = await tamperLogService.getAllTamperLogs(5);
    testResults.services.tamperLogService = true;
    console.log(`✅ Tamper Log Service: Retrieved ${tamperLogs.length} logs`);
  } catch (error) {
    testResults.services.tamperLogService = false;
    testResults.errors.push(`Tamper Log Service error: ${error.message}`);
    console.error('❌ Tamper Log Service failed:', error);
  }

  try {
    const devices = await deviceService.getAllDevices(5);
    testResults.services.deviceService = true;
    console.log(`✅ Device Service: Retrieved ${devices.length} devices`);
  } catch (error) {
    testResults.services.deviceService = false;
    testResults.errors.push(`Device Service error: ${error.message}`);
    console.error('❌ Device Service failed:', error);
  }

  // 5. Test Real-time Subscriptions
  try {
    let subscriptionReceived = false;
    const unsubscribe = alertService.subscribeToAlerts((alerts) => {
      subscriptionReceived = true;
      console.log(`✅ Real-time subscription: Received ${alerts.length} alerts`);
      if (unsubscribe) unsubscribe();
    });

    // Wait for subscription to trigger
    await new Promise(resolve => setTimeout(resolve, 3000));
    testResults.realTimeSubscriptions = subscriptionReceived;
    
    if (!subscriptionReceived) {
      console.log('⚠️ Real-time subscription did not receive data within 3 seconds');
    }
  } catch (error) {
    testResults.errors.push(`Real-time subscription error: ${error.message}`);
    console.error('❌ Real-time subscription failed:', error);
  }

  return testResults;
};

export const printTestReport = (results) => {
  console.log('\n📊 FIREBASE BACKEND TEST REPORT');
  console.log('=================================');
  
  console.log(`🔧 Firebase Config: ${results.firebaseConfig ? '✅ OK' : '❌ FAILED'}`);
  console.log(`🔗 Database Connection: ${results.databaseConnection ? '✅ CONNECTED' : '❌ FAILED'}`);
  
  console.log('\n📁 Collections:');
  Object.entries(results.collections).forEach(([name, status]) => {
    const icon = status.exists ? '✅' : '⚠️';
    const info = status.exists ? `${status.count} docs` : 'empty/missing';
    console.log(`  ${icon} ${name}: ${info}`);
  });
  
  console.log('\n🔧 Services:');
  Object.entries(results.services).forEach(([name, status]) => {
    const icon = status ? '✅' : '❌';
    console.log(`  ${icon} ${name}: ${status ? 'WORKING' : 'FAILED'}`);
  });
  
  console.log(`\n⚡ Real-time Updates: ${results.realTimeSubscriptions ? '✅ WORKING' : '❌ NOT WORKING'}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors:');
    results.errors.forEach((error, i) => console.log(`  ${i + 1}. ${error}`));
  }
  
  const isFullyIntegrated = results.firebaseConfig && 
                           results.databaseConnection && 
                           Object.values(results.services).every(s => s) &&
                           results.realTimeSubscriptions;
  
  console.log(`\n🎯 Integration Status: ${isFullyIntegrated ? '✅ COMPLETE' : '⚠️ INCOMPLETE'}`);
  
  return isFullyIntegrated;
};
