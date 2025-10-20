// Quick Firebase test runner
import { testFirebaseBackend, printTestReport } from './utils/connectionTest';

const runTest = async () => {
  console.log('🚀 Starting Firebase Backend Test...\n');
  
  try {
    const results = await testFirebaseBackend();
    const isComplete = printTestReport(results);
    
    if (isComplete) {
      console.log('\n🎉 Firebase integration is COMPLETE and working properly!');
    } else {
      console.log('\n⚠️ Firebase integration has issues that need attention.');
    }
    
    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
runTest();
