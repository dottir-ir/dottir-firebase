const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, createIndex } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestore() {
  try {
    // Create collections
    const collections = ['users', 'cases', 'comments'];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
    
    // Create indexes
    const indexes = [
      {
        collection: 'cases',
        fields: ['authorId', 'createdAt'],
      },
      {
        collection: 'cases',
        fields: ['createdAt'],
      },
      {
        collection: 'comments',
        fields: ['caseId', 'createdAt'],
      },
    ];
    
    for (const index of indexes) {
      await createIndex(db, index.collection, index.fields);
      console.log(`Created index on ${index.collection} for fields: ${index.fields.join(', ')}`);
    }
    
    console.log('Firestore setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Firestore:', error);
  }
}

setupFirestore(); 