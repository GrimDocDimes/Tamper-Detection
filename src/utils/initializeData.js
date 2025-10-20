import { initializeSampleData } from '../services/firebaseService';

// Call this function once to populate your Firestore with sample data
export const setupInitialData = async () => {
  try {
    console.log('Initializing sample data...');
    await initializeSampleData();
    console.log('Sample data initialized successfully!');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Uncomment the line below and refresh your app once to initialize data
// setupInitialData();
