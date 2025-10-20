// Comprehensive Firebase integration test
import { testFirebaseConnection, checkCollections } from './firebaseTest';
import { alertService, tamperLogService, deviceService, kpiService } from '../services/firebaseService';
import { initializeSampleData } from './sampleData';

// Test Firebase connection and all services
export const runIntegrationTest = async () => {
  console.log('🔍 Starting Firebase Integration Test...');
  const results = {
    connection: false,
    collections: {},
    services: {},
    realTimeUpdates: false,
    errors: []
  };

  try {
    // 1. Test Firebase connection
    console.log('1️⃣ Testing Firebase connection...');
    const connectionTest = await testFirebaseConnection();
    results.connection = connectionTest.success;
    
    if (!connectionTest.success) {
      results.errors.push(`Connection failed: ${connectionTest.message}`);
      return results;
    }
    console.log('✅ Firebase connection successful');

    // 2. Test collections exist
    console.log('2️⃣ Checking Firebase collections...');
    const collectionsTest = await checkCollections();
    results.collections = collectionsTest;
    
    for (const [collection, status] of Object.entries(collectionsTest)) {
      if (!status.exists) {
        console.log(`⚠️ Collection '${collection}' does not exist or is empty`);
      } else {
        console.log(`✅ Collection '${collection}' exists with ${status.documentCount} documents`);
      }
    }

    // 3. Test all Firebase services
    console.log('3️⃣ Testing Firebase services...');
    
    // Test Alert Service
    try {
      const alerts = await alertService.getAllAlerts(5);
      results.services.alertService = {
        success: true,
        dataCount: alerts.length,
        hasSubscription: typeof alertService.subscribeToAlerts === 'function'
      };
      console.log(`✅ Alert Service: ${alerts.length} alerts retrieved`);
    } catch (error) {
      results.services.alertService = { success: false, error: error.message };
      results.errors.push(`Alert Service failed: ${error.message}`);
    }

    // Test Tamper Log Service
    try {
      const tamperLogs = await tamperLogService.getAllTamperLogs(5);
      results.services.tamperLogService = {
        success: true,
        dataCount: tamperLogs.length,
        hasSubscription: typeof tamperLogService.subscribeToTamperLogs === 'function'
      };
      console.log(`✅ Tamper Log Service: ${tamperLogs.length} tamper logs retrieved`);
    } catch (error) {
      results.services.tamperLogService = { success: false, error: error.message };
      results.errors.push(`Tamper Log Service failed: ${error.message}`);
    }

    // Test Device Service
    try {
      const devices = await deviceService.getAllDevices(5);
      results.services.deviceService = {
        success: true,
        dataCount: devices.length,
        hasSubscription: typeof deviceService.subscribeToDevices === 'function'
      };
      console.log(`✅ Device Service: ${devices.length} devices retrieved`);
    } catch (error) {
      results.services.deviceService = { success: false, error: error.message };
      results.errors.push(`Device Service failed: ${error.message}`);
    }

    // Test KPI Service
    try {
      const kpis = await kpiService.calculateKPIs();
      results.services.kpiService = {
        success: true,
        data: kpis
      };
      console.log(`✅ KPI Service: KPIs calculated successfully`);
    } catch (error) {
      results.services.kpiService = { success: false, error: error.message };
      results.errors.push(`KPI Service failed: ${error.message}`);
    }

    // 4. Test real-time subscriptions
    console.log('4️⃣ Testing real-time subscriptions...');
    try {
      let subscriptionWorking = false;
      
      // Test alert subscription
      const unsubscribe = alertService.subscribeToAlerts((alerts) => {
        subscriptionWorking = true;
        console.log(`✅ Real-time subscription working: received ${alerts.length} alerts`);
        unsubscribe(); // Clean up
      });
      
      // Wait a moment for the subscription to trigger
      await new Promise(resolve => setTimeout(resolve, 2000));
      results.realTimeUpdates = subscriptionWorking;
      
    } catch (error) {
      results.errors.push(`Real-time subscription failed: ${error.message}`);
    }

    console.log('🎉 Integration test completed!');
    return results;

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    results.errors.push(`Test failed: ${error.message}`);
    return results;
  }
};

// Generate integration report
export const generateIntegrationReport = (results) => {
  console.log('\n📊 FIREBASE INTEGRATION REPORT');
  console.log('================================');
  
  console.log(`🔗 Firebase Connection: ${results.connection ? '✅ Connected' : '❌ Failed'}`);
  
  console.log('\n📁 Collections Status:');
  for (const [collection, status] of Object.entries(results.collections)) {
    const statusIcon = status.exists ? '✅' : '⚠️';
    const count = status.exists ? ` (${status.documentCount} docs)` : ' (empty/missing)';
    console.log(`  ${statusIcon} ${collection}${count}`);
  }
  
  console.log('\n🔧 Services Status:');
  for (const [service, status] of Object.entries(results.services)) {
    const statusIcon = status.success ? '✅' : '❌';
    const info = status.success ? 
      ` (${status.dataCount !== undefined ? status.dataCount + ' records' : 'working'})` : 
      ` (${status.error})`;
    console.log(`  ${statusIcon} ${service}${info}`);
  }
  
  console.log(`\n⚡ Real-time Updates: ${results.realTimeUpdates ? '✅ Working' : '❌ Not working'}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors Found:');
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  const overallStatus = results.connection && 
    Object.values(results.services).every(s => s.success) && 
    results.realTimeUpdates;
    
  console.log(`\n🎯 Overall Status: ${overallStatus ? '✅ INTEGRATION COMPLETE' : '⚠️ ISSUES FOUND'}`);
  
  return overallStatus;
};

// Quick setup function to initialize data if needed
export const setupFirebaseData = async () => {
  try {
    console.log('🚀 Setting up Firebase with sample data...');
    await initializeSampleData();
    console.log('✅ Sample data added to Firebase');
    return true;
  } catch (error) {
    console.error('❌ Failed to setup Firebase data:', error);
    return false;
  }
};
