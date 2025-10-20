// Firebase connection test utility
import { db } from '../firebase/config';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test basic connection with a simple query
    const testQuery = query(collection(db, 'alerts'), limit(1));
    const snapshot = await getDocs(testQuery);
    
    console.log('✅ Firebase connection successful');
    console.log(`Found ${snapshot.size} documents in alerts collection`);
    
    return { success: true, message: 'Firebase connected successfully' };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    
    if (error.code === 'permission-denied') {
      return { 
        success: false, 
        message: 'Firebase permission denied. Check Firestore rules or authentication.' 
      };
    } else if (error.code === 'unavailable') {
      return { 
        success: false, 
        message: 'Firebase service unavailable. Check internet connection.' 
      };
    } else {
      return { 
        success: false, 
        message: `Firebase error: ${error.message}` 
      };
    }
  }
};

// Test function to check if collections exist
export const checkCollections = async () => {
  const collections = ['alerts', 'tamperLogs', 'devices'];
  const results = {};
  
  for (const collectionName of collections) {
    try {
      const testQuery = query(collection(db, collectionName), limit(1));
      const snapshot = await getDocs(testQuery);
      results[collectionName] = {
        exists: true,
        documentCount: snapshot.size
      };
    } catch (error) {
      results[collectionName] = {
        exists: false,
        error: error.message
      };
    }
  }
  
  return results;
};

// Run comprehensive Firebase test
export const runFirebaseTest = async () => {
  console.log('🔥 Starting Firebase Diagnostic Test...');
  
  // Test 1: Basic connection
  const connectionTest = await testFirebaseConnection();
  console.log('Connection Test:', connectionTest);
  
  // Test 2: Check collections
  const collectionsTest = await checkCollections();
  console.log('Collections Test:', collectionsTest);
  
  // Test 3: Check Firebase config
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
    appId: process.env.REACT_APP_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing'
  };
  
  console.log('Firebase Config:', config);
  
  return {
    connection: connectionTest,
    collections: collectionsTest,
    config: config
  };
};
