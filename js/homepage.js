import { auth ,onAuthStateChanged} from "../config/firebaseconfig.js";

document.addEventListener('DOMContentLoaded', function () {

    const userEmailSection = document.getElementById('userEmail');

    userEmailSection.addEventListener('click', ()=>{

        const confirmLogout = confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            localStorage.removeItem('firebaseAuthToken');
            window.location.href = 'index.html'; 
        }

    })

    const authToken = localStorage.getItem('firebaseAuthToken');

    if (authToken) {
        
        onAuthStateChanged(auth, (user) => {
            if (user) {

                const userEmail = user.email;
                userEmailSection.textContent = userEmail;
                
            } else {
                
                localStorage.removeItem('firebaseAuthToken');
                window.location.href = 'index.html'; 
            }
        });
    }
    else
    {
        window.location.href = 'index.html'; 
    }

    let form = document.getElementById('lobby__form');

    let displayName = sessionStorage.getItem('display_name');
    if (displayName) {
        form.name.value = displayName;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        sessionStorage.setItem('display_name', e.target.name.value);

        let inviteCode = e.target.room.value;
        if (!inviteCode) {
            inviteCode = String(Math.floor(Math.random() * 10000));
        }
        window.location = `room.html?room=${inviteCode}`;
    });
});
