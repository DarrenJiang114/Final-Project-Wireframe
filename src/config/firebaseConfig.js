import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyBj2MB4bcSHjtbSSoOeuVTFHn3bD3ZcE_0",
    authDomain: "finalproject-78a4e.firebaseapp.com",
    databaseURL: "https://finalproject-78a4e.firebaseio.com",
    projectId: "finalproject-78a4e",
    storageBucket: "finalproject-78a4e.appspot.com",
    messagingSenderId: "102242260585",
    appId: "1:102242260585:web:b674af59df9dbdbc0f34f8",
    measurementId: "G-TSW3T6YBCG"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;