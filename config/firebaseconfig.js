import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase ,ref , set ,push , get , child, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHQDmHp5Wv097tQqAzC_nPonqoPFBbUjM",
    authDomain: "user-b6f2f.firebaseapp.com",
    projectId: "user-b6f2f",
    storageBucket: "user-b6f2f.appspot.com",
    messagingSenderId: "177137279576",
    appId: "1:177137279576:web:7ca7f7e23ec53b21f1202d",
    measurementId: "G-52GS9GP01B"
}

const app=initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth= getAuth(app);

window.auth=auth
window.database=database
window.ref=ref
window.set=set
window.push=push
window.get=get
window.child=child
window.onValue=onValue

console.log(auth);

export {app,database,auth,child,signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword,get,ref,onValue}