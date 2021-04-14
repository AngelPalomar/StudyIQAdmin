import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'

/* const firebaseConfig = {
    apiKey: "AIzaSyC_6HFE2q4NQLhZQ98daaeeyF59UULo_dA",
    authDomain: "studyiq-2882a.firebaseapp.com",
    projectId: "studyiq-2882a",
    storageBucket: "studyiq-2882a.appspot.com",
    messagingSenderId: "216538651801",
    appId: "1:216538651801:web:ce0829cdffb00dbc6eac08"
} */

const firebaseConfig = {
    apiKey: "AIzaSyAJZRV7aBLmzJwRe79x4Oz65727BjnA0uk",
    authDomain: "studyiq2.firebaseapp.com",
    projectId: "studyiq2",
    storageBucket: "studyiq2.appspot.com",
    messagingSenderId: "567346465619",
    appId: "1:567346465619:web:8b427fa9e52dbe6eefafa6"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

//Generamos librería
export default {
    db,
    auth,
    storage
}