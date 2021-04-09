import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC_6HFE2q4NQLhZQ98daaeeyF59UULo_dA",
    authDomain: "studyiq-2882a.firebaseapp.com",
    projectId: "studyiq-2882a",
    storageBucket: "studyiq-2882a.appspot.com",
    messagingSenderId: "216538651801",
    appId: "1:216538651801:web:ce0829cdffb00dbc6eac08"
}

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