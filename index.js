import { auth,signInWithEmailAndPassword, onAuthStateChanged } from "./config/firebaseconfig.js";

document.addEventListener('DOMContentLoaded', function() {
      
    var login = document.getElementById('submit');

    login.addEventListener('click',(e)=>{

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        signInWithEmailAndPassword(auth,email,password)
            .then(async (userCredential)=>{
                const user=await userCredential.user;
                user.getIdToken().then(function(token) {
                    
                    localStorage.setItem('firebaseAuthToken', token);
                    window.location.href = 'homepage.html';
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });

    });
});

document.addEventListener('DOMContentLoaded', function(){
    const authToken = localStorage.getItem('firebaseAuthToken');

    if (authToken) {
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                window.location.href = 'homepage.html';
            } else {
                
                localStorage.removeItem('firebaseAuthToken');
                window.location.href = 'index.html'; 
            }
        });
    }

})
        