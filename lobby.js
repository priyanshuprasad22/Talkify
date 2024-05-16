import { app, auth, database, onAuthStateChanged, get, ref, child, onValue  } from "./config/firebaseconfig.js";


function loadRooms() {
    const currentUser = auth.currentUser;

    if (currentUser) {

        const userRoomsRef = ref(database, `users/${currentUser.uid}/rooms`);
        onValue(userRoomsRef, (snapshot) => {
            const rooms = snapshot.val(); // Array of room IDs

            const roomList = document.getElementById('room-list');
            roomList.innerHTML = '';


            if (rooms) {
                rooms.forEach((roomId) => {
                    // Create a div for each room
            
                    const roomDiv = document.createElement('div');
                    roomDiv.className = 'room';
                    roomDiv.textContent = `Room ${roomId}`;
                    roomDiv.onclick = () => loadRoom(roomId); 
                    roomList.appendChild(roomDiv);
                });
            }
        });
    }
}

async function loadRoom(roomId) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    const roomRef = ref(database, 'rooms/' + roomId + `/chats/${auth.currentUser.uid}`);
    try {
        const snapshot = await get(roomRef);

        if (snapshot.exists()) {
            let alternate = false; 
            snapshot.forEach((childSnapshot, index) => {
                const messageData = childSnapshot.val().messageData;
                const displayName = messageData.displayName;
                const message = messageData.message;
                const timestamp = messageData.timestamp;

                const messageBlock = createMessageBlock(displayName, message, timestamp, alternate);
                chatMessages.appendChild(messageBlock);

                alternate = !alternate; 
            });
        } else {
            chatMessages.innerHTML = 'No chat messages found for the selected room.'
            console.log("No chat messages found for the selected room.");
        }
    } catch (error) {
        console.error("Error loading chat messages:", error);
    }
}

function createMessageBlock(displayName, message, timestamp, alternate) {
    const messageBlock = document.createElement('div');
    messageBlock.classList.add('message-block');

    const backgroundColor = alternate ? '#f0f6fd' : '#dbe9f3'; 
    messageBlock.style.backgroundColor = backgroundColor;

    const messageContent = document.createElement('div');
    messageContent.textContent = message;
    messageContent.classList.add('message-content');

    const senderInfo = document.createElement('div');
    senderInfo.textContent = displayName;
    senderInfo.classList.add('sender-info');

    const timestampElement = document.createElement('div');
    timestampElement.textContent = formatTimestamp(timestamp);
    timestampElement.classList.add('timestamp');

    messageBlock.appendChild(senderInfo);
    messageBlock.appendChild(messageContent);
    messageBlock.appendChild(timestampElement);

    return messageBlock;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return `${formattedDate} ${formattedTime}`;
}




function createRoom() {
    window.location="homepage.html"
    console.log("Creating a new room");
}
document.getElementById('create-room-btn').addEventListener('click', createRoom);


onAuthStateChanged(auth, (user) => {
    if (user) { 
        loadRooms();
    } else {
        console.log('No user signed in');
    }
});
