// Quick script to initialize Firebase with sample data
import { addSampleTamperLogs } from './utils/sampleData';

const init = async () => {
  try {
    console.log('🚀 Adding sample tamper logs to Firebase...');
    await addSampleTamperLogs();
    console.log('✅ Sample data added successfully!');
    console.log('🔄 Please refresh the TamperLog page to see the data.');
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
  }
};

init();
