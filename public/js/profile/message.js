function sendMessage(event) {
    event.preventDefault()
    const Ajax = new AjaxAPI()
    let textArea = document.querySelector('.chat-textarea')

    let key = document.querySelector('.key').value
    Ajax.post('/u/send-message', `msg=${textArea.value.replace(/\r?\n/gi, '')}&key=${key}`)
    textArea.value = ''
}

let textareaHeight = document.querySelector('.textarea-div').offsetHeight
document.querySelector('.chat-textarea').style.height = `${textareaHeight}px`

let textArea = document.querySelector('.chat-textarea')
textArea.addEventListener('keyup', e => {
    if(e.keyCode === 13) {
        sendMessage(e)
    }
})

document.querySelector('.chat-form').addEventListener('submit', e => {
    sendMessage(e)
})


// Socket Listeners

// Signed In listener
// Don't Remove!!!
try {
    socket.emit('signed in', document.querySelector('.channel').value)
} catch {
    console.log('')
}

socket.on('chat updates' , datas => {
    let msgs = ''
    let senderKey = document.querySelector('.channel').value
    let receiverKey = document.querySelector('.key').value

    for(key in datas) {
        if(datas[key] !== 0) {
            if((datas[key].sender === senderKey && datas[key].receiver === receiverKey) || 
                (datas[key].receiver === senderKey && datas[key].sender === receiverKey)) {
                let className = datas[key].sender === senderKey ? 'sender' : 'receiver'
                let widthClass = ''
                widthClass = datas[key].msg.length > 30 ? 'widthLimit' : ''

                let date = datas[key].date.split(' ')
                date = `${date[0]} - ${date[1]}. ${date[2]}, ${date[3]} ${date[4]}`
                msgs += `
                    <div class="${className}">
                        <div class="col-12">
                            <span class="${className}-chat-cont ${widthClass}">
                                ${datas[key].msg}
                            </span>
                        </div>
                        <div class="col-12">
                            <span class="${className}-date date-msg">
                                ${date}
                            </span>
                        </div>
                    </div>
                `
            }
        }
    }

    let chatContent = document.querySelector('.chat-content')
    chatContent.innerHTML = msgs

    let chatContentHeight = chatContent.scrollHeight
    chatContent.scrollTop = chatContentHeight
})
