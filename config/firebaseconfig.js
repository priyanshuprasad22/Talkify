import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase ,ref , set ,push , get , child, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
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
