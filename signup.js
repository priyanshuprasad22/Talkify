import { auth , createUserWithEmailAndPassword} from "./config/firebaseconfig.js";
document.addEventListener('DOMContentLoaded', function() {
    var signUp = document.getElementById('submit');

        signUp.addEventListener('click',(e)=>{

            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var username = document.getElementById('username').value;

            createUserWithEmailAndPassword(auth,email,password)
                .then((userCredential)=>{
                    const user=userCredential.user;
                    alert('user-created');
                    window.location.href='INDEX.HTML';
                })
                .catch((error)=>{
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    alert(errorMessage);
                });
        });
});