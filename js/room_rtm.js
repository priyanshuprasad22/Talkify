let handleMemberJoined = async (MemberId) => {
    console.log('A new member has joined the room:', MemberId)
    addMemberToDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)

    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])
    addBotMessageToDom(`Welcome to the room ${name}! 👋`)
}

let addMemberToDom = async (MemberId) => {
    let {name} = await rtmClient.getUserAttributesByKeys(MemberId, ['name'])

    let membersWrapper = document.getElementById('member__list')
    let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                        <span class="green__icon"></span>
                        <p class="member_name">${name}</p>
                    </div>`

    membersWrapper.insertAdjacentHTML('beforeend', memberItem)
}

let updateMemberTotal = async (members) => {
    let total = document.getElementById('members__count')
    total.innerText = members.length
}
 
let handleMemberLeft = async (MemberId) => {
    removeMemberFromDom(MemberId)

    let members = await channel.getMembers()
    updateMemberTotal(members)
}

let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`)
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${name} has left the room.`)
        
    memberWrapper.remove()
}

let getMembers = async () => {
    let members = await channel.getMembers()
    updateMemberTotal(members)
    for (let i = 0; members.length > i; i++){
        addMemberToDom(members[i])
    }
}

let handleChannelMessage = async (messageData, MemberId) => {
    console.log('A new message was received')
    let data = JSON.parse(messageData.text)

    if(data.type === 'chat'){
        addMessageToDom(data.displayName, data.message)
    }

    if(data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove()

        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null
    
            for(let i = 0; videoFrames.length > i; i++){
                videoFrames[i].style.height = '300px'
                videoFrames[i].style.width = '300px'
            }
        }
    }
}

// let sendMessage = async (e) => {
//     e.preventDefault()

//     let message = e.target.message.value
//     channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
//     addMessageToDom(displayName, message)
//     e.target.reset()
// }

let addBotMessageToDom = (botMessage) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Talkify </strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}


let addMessageToDom = (name, message) => {
    let messagesWrapper = document.getElementById('messages')

    let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`

    messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){
        lastMessage.scrollIntoView()
    }
}

let sendMessage = async (e) => {
    e.preventDefault();

    const auth = window.auth;
    const database = window.database;
    const ref = window.ref; 
    const set = window.set; 
    const get = window.get;
    const push = window.push;
    const roomId = window.roomId;

    let message = e.target.message.value;

    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;

        let messageData = {
            displayName: displayName,
            message: message,
            userId: userId,
            timestamp: new Date().toISOString()
        };

        try {
            const userRef = ref(database, 'users/' + userId);
            const userSnapshot = await get(userRef); 
            let userData = userSnapshot.val() || {};

            

            if (!userData.rooms || !userData.rooms.includes(roomId)) {
                userData.rooms = userData.rooms || [];
                userData.rooms.push(roomId);
                await set(userRef, userData);
            }

            await push(ref(database, 'rooms/' + roomId + '/chats/' + userId), {
                messageData
            });

            addMessageToDom(displayName, message);
            channel.sendMessage({ text: JSON.stringify({ 'type': 'chat', 'message': message, 'displayName': displayName }) });
            e.target.reset();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } else {
        console.log('User is not signed in');
    }
}






let leaveChannel = async () => {
    await channel.leave()
    await rtmClient.logout()
}

window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)

// export {handleMemberJoined,updateMemberTotal,handleMemberLeft,handleChannelMessage,sendMessage,getMembers,leaveChannel,addBotMessageToDom,addMessageToDom};