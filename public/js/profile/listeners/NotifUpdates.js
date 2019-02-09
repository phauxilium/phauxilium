socket.on('notif-sound', data => {
    const filename = '/static/sounds/just-like-magic'
    let mp3Source = `<source src="${filename}.mp3" type="audio/mpeg">`
    let oggSource = `<source src="${filename}.ogg" type="audio/ogg">`
    let embedSource = `<embed hidden="true" autostart="true" loop="false" src="${filename.mp3}">`
    document.querySelector(".sound").innerHTML = `<audio autoplay="autoplay">${mp3Source}${oggSource}${embedSource}</audio>`
})

socket.on('notif count', datas => {
    let notifContainer = document.querySelector('.notif-count')
    datas === 0 ? notifContainer.style.display = "none" : notifContainer.style.display = "inline"
    notifContainer.textContent = datas
})

socket.on('notif updates', datas => {
    let nContent = document.querySelector('.n-content')
    let notifIcon = document.querySelector('.notif-icon')
    if(notifIcon.classList.contains('active-icon')) {
        if (datas.length === 1) {
            nContent.innerHTML = `
                <div class="notif-content col-12">
                    <span class="notif-span notif-none nothing">Nothing to show</span>
                </div>`
        } else {
            nContent.innerHTML = ''
            for (let data = datas.length - 1; data >= 0; data--) {
                if (datas[data] !== 0 && datas[data] !== null) {
                    try {
                        let msg = datas[data].message
                        let dateObj = new Date(datas[data].date)
                        let dateStr = dateObj.toString().split(' ')
                        let time = dateStr[4].split(':')
                        let hours = time[0] > 12 ? time[0] - 12 : time
                        let meridiem = time[0] > 12 ? 'pm' : 'am'
                        let finTime = `${hours}:${time[1]} ${meridiem}`
                        let finalDate = `${dateStr[0]} - ${dateStr[1]} ${dateStr[2]}, ${dateStr[3]} ${finTime}`
                        let img = datas[data].from === 'Auxilium Team' ? '/static/images/black.png' : `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas[data].uType}/${datas[data].img}`

                        if (msg.length > 80) msg = `${msg.substring(0, 80)}...`
                        let allias = datas[data].uType === 'doctor' ? 'M.D.' : ''

                        let notifs = `
                            <div class="notif-content col-12 ${datas[data].status}">
                                <div class="notif-inner-cont  col-11" onclick="Notif.viewNotifs(this)" data-notif-id="${data}" data-notif-type="${datas[data].type}">
                                    <div class="notif-header">
                                        <span class="notif-span notif-img">
                                            <img class="notif-img-src" src="${img}">
                                        </span>
                                    </div>
                                    <div class="notif-msg-content">
                                        <div class="col-12">
                                            <span class="notif-span notif-from">
                                                ${allias} ${datas[data].name}
                                            </span>
                                            <span class="notif-span notif-message ${datas[data].status}-msg">
                                                ${msg}
                                            </span>
                                            <span class="notif-span notif-date ${datas[data].status}-date">
                                                ${finalDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1 delete-notif-div" onclick="Notif.notifDelete(this)" data-notif-id="${data}">
                                    <i class="material-icons delete-notif">close</i>
                                </div>
                            </div>`
                        nContent.innerHTML += notifs
                    } catch(err) {
                        console.log('')
                    }
                }
            }
        }
    }
})