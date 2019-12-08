// Base de Datos Firebase.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

// Configuraciones de Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDyCRZge5ATfhgPZpGFbcZrZLPmmqWDcLI",
    authDomain: "tienda-database-a1d33.firebaseapp.com",
    databaseURL: "https://tienda-database-a1d33.firebaseio.com",
    projectId: "tienda-database-a1d33",
    storageBucket: "tienda-database-a1d33.appspot.com",
    messagingSenderId: "413071785371",
    appId: "1:413071785371:web:ac337bac22ff2195f2f53e"
  };
  
  // Initialize Firebase
  export default firebase.initializeApp(firebaseConfig);