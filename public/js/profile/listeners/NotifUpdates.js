socket.on('notif updates', datas => {
    let notifContainer = document.querySelector('.notif-count')
    datas === 0 ? notifContainer.style.display = "none" : notifContainer.style.display = "inline"
    notifContainer.textContent = datas
})