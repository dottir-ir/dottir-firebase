/**
 * Utility to help debug multiple Firebase initializations
 * This can be used to identify if Firebase is being initialized multiple times
 * or if multiple Firebase SDK scripts are being loaded
 */

// Extend Window interface to include Firebase
declare global {
  interface Window {
    firebase?: {
      apps: any[];
      [key: string]: any;
    };
  }
}

export function checkFirebaseInstances() {
  // Get all script tags in the document
  const scripts = document.getElementsByTagName('script');
  
  // Count Firebase SDK scripts
  const firebaseScripts = Array.from(scripts).filter(script => 
    script.src && script.src.includes('firebase')
  );
  
  console.log(`Found ${firebaseScripts.length} Firebase script tags:`, 
    firebaseScripts.map(s => s.src)
  );
  
  // Log any global Firebase objects
  const firebase = window.firebase;
  if (firebase) {
    console.log('Firebase app instances:', firebase);
    
    // Check for multiple Firebase app instances
    const apps = firebase.apps;
    if (Array.isArray(apps) && apps.length > 1) {
      console.warn('Multiple Firebase app instances detected:', apps);
    }
  }
}

/**
 * Usage:
 * import { checkFirebaseInstances } from './utils/firebaseDebug';
 * 
 * // In your main component (like App.tsx):
 * useEffect(() => {
 *   checkFirebaseInstances();
 * }, []);
 */ 