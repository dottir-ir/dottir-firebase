import 'dotenv/config';
import { validateEnvironmentVariables } from '../src/utils/envValidation';

async function checkDeployment() {
  console.log('🔍 Starting deployment environment check...\n');

  // Validate environment variables
  const validation = validateEnvironmentVariables();

  // Print results
  if (validation.errors.length > 0) {
    console.error('❌ Deployment check failed with the following errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️  Deployment check completed with warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }

  // Check for production environment
  if (process.env.NODE_ENV === 'production') {
    console.log('\n✅ Production environment check passed');
    
    // Additional production-specific checks
    if (process.env.VITE_FIREBASE_PROJECT_ID?.includes('dev')) {
      console.error('❌ Cannot deploy to production with development Firebase project');
      process.exit(1);
    }
  } else {
    console.log('\n✅ Development environment check passed');
  }

  console.log('\n✨ All checks passed! Ready for deployment.');
}

// Run the check
checkDeployment().catch(error => {
  console.error('❌ Deployment check failed:', error);
  process.exit(1);
}); 