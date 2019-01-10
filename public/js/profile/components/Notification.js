class Notification {

    notifModalView(datas) {
        if(!datas) {
            nContent.innerHTML = `
            <img src="/static/images/loader.svg" alt="Loading..." class="loader">
            `
        } else {
            let dateObj = new Date(datas.date)
            let dateStr = dateObj.toString().split(' ')
            let time = dateStr[4].split(':')
            let hours = time[0] > 12 ? time[0] - 12 : time
            let meridiem = time[0] > 12 ? 'pm' : 'am'
            let finTime = `${hours}:${time[1]} ${meridiem}`
            let finalDate = `${dateStr[0]} - ${dateStr[1]} ${dateStr[2]}, ${dateStr[3]} ${finTime}`
            let img = datas.from === 'Auxilium Team' ? '/static/images/black.png' : `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas.uType}/${datas.img}`
            let innerContModal = document.querySelector('.inner-cont-modal')
            innerContModal.innerHTML = `
                    <div class="inner-modal">
                        <span class="modal-notif-span span-close">
                            <i class="material-icons close-icon">close</i>
                        </span>
                        <span class="modal-notif-span modal-img-notif">
                            <img src="${img}" alt="Could'nt load" class="modal-img-src">
                        </span>
                        <span class="modal-notif-span modal-title-notif">${datas.from}</span>
                        <span class="modal-notif-span modal-msg-notif">${datas.message}</span>
                        <span class="modal-notif-span modal-date-notif">${finalDate}</span>
                    </div>
            `
        }
    }

    viewNotifs(param) {
        let notifID = param.getAttribute('data-notif-id')
        let notifType = param.getAttribute('data-notif-type')
        if (notifType === 'message') {
            document.querySelector('.outer-modal-bg').style.display = "block"
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        this.notifModalView(datas)
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        }
    }

    appendData(datas) {
        let nContent = document.querySelector('.n-content')
        if(!datas) {
            nContent.innerHTML = `
            <img src="/static/images/loader.svg" alt="Loading..." class="loader">
            `
        } else {
            for (let data = datas.length - 1; data >= 0; data--) {
                if (datas[data] !== 0) {
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

                    let notifs = `
                <div class="notif-content col-12 ${datas[data].status}" onclick="Notif.viewNotifs(this)" data-notif-id="${data}" data-notif-type="${datas[data].type}">
                    <div class="notif-header">
                        <span class="notif-span notif-img">
                            <img class="notif-img-src" src="${img}" alt="Could'nt load image">
                        </span>
                        <span class="notif-span notif-from">
                            ${datas[data].from}
                        </span>
                    </div>
                    <span class="notif-span notif-message ${datas[data].status}-msg">
                        ${msg}
                    </span>
                    <span class="notif-span notif-date ${datas[data].status}-date">
                        ${finalDate}
                    </span>
                </div>`

                    nContent.innerHTML += notifs
                }
            }
        }
    }

    main() {
        return `
        <div class="notif-div col-12">
            <span class="notif-title col-12">Notifications</span>
            <div class="n-content">
        </div>`
    }
}