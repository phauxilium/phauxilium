socket.on('chat count', datas => {
    let messageContainer = document.querySelector('.msg-count')
    datas === 0 ? messageContainer.style.display = "none" : messageContainer.style.display = "inline"
    messageContainer.textContent = datas
}) 