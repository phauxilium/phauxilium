socket.on('notif updates', datas => {
    let notifLength = datas.length - 1
    let notifContainer = document.querySelector('.notif-count')
    notifLength === 0 ? notifContainer.style.display = "none" : notifContainer.style.display = "inline"
    notifContainer.textContent = notifLength
})