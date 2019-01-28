class Notification {
    notifModalView(datas) {
        let dateObj = new Date(datas.date)
        let dateStr = dateObj.toString().split(' ')
        let time = dateStr[4].split(':')
        let hours = time[0] > 12 ? time[0] - 12 : time[0]
        let meridiem = time[0] >= 12 ? 'pm' : 'am'
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
                    <span class="modal-notif-span modal-title-notif">${datas.name}</span>
                    <span class="modal-notif-span modal-msg-notif">${datas.message}</span>
                    <span class="modal-notif-span modal-date-notif">${finalDate}</span>
                </div>
        `
    }

    // View Individual Notification
    viewNotifs(param) {
        let notifID = param.getAttribute('data-notif-id')
        let notifType = param.getAttribute('data-notif-type')
        document.querySelector('.inner-cont-modal').innerHTML = `
        <img src="/static/images/loader.svg" alt="Loading..." class="loader">
        `

        if (notifType === 'message') {
            document.querySelector('.outer-modal-bg').style.display = "block"
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        this.notifModalView(datas)
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        } else if(notifType === 'pending') {
            document.querySelector('.center-div').innerHTML = `
                <img src="/static/images/loader.svg" alt="Loading..." class="loader">
                `
            const _Timeline = new Timeline()
            _Timeline.pending()

            let navIcons = document.querySelectorAll('.nav-icons')
            navIcons.forEach(value => value.classList.remove('active-icon'))

            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
        } else if (notifType === 'upcoming') {
            document.querySelector('.center-div').innerHTML = `
                <img src="/static/images/loader.svg" alt="Loading..." class="loader">
                `
            const _Timeline = new Timeline()
            _Timeline.upcoming()

            let navIcons = document.querySelectorAll('.nav-icons')
            navIcons.forEach(value => value.classList.remove('active-icon'))

            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
        } else if (notifType === 'today') {
            document.querySelector('.center-div').innerHTML = `
                <img src="/static/images/loader.svg" alt="Loading..." class="loader">
                `
            const _Timeline = new Timeline()
            _Timeline.today()

            let navIcons = document.querySelectorAll('.nav-icons')
            navIcons.forEach(value => value.classList.remove('active-icon'))

            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
        }
    } 

    appendData(datas) {
        let nContent = document.querySelector('.n-content')
        if(datas.length === 1) {
            nContent.innerHTML = `
                <div class="notif-content col-12">
                    <span class="notif-span notif-none">Nothing to show</span>
                </div>`
        } else {
            for (let data = datas.length - 1; data >= 0; data--) {
                if (datas[data] !== 0) {
                    let msg = datas[data].message
                    let dateObj = new Date(datas[data].date)
                    let dateStr = dateObj.toString().split(' ')
                    let time = dateStr[4].split(':')
                    let hours = time[0] > 12 ? time[0] - 12 : time[0]
                    let meridiem = time[0] >= 12 ? 'PM' : 'AM'
                    let finTime = `${hours}:${time[1]} ${meridiem}`
                    let finalDate = `${dateStr[0]} - ${dateStr[1]} ${dateStr[2]}, ${dateStr[3]} ${finTime}`
                    let img = datas[data].from === 'Auxilium Team' ? '/static/images/black.png' : `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas[data].uType}/${datas[data].img}`

                    if (msg.length > 80) msg = `${msg.substring(0, 80)}...`
                    let allias = datas[data].uType === 'doctor' ? 'Dr.' : ''

                    let notifs = `
                <div class="notif-content col-12 ${datas[data].status}" onclick="Notif.viewNotifs(this)" data-notif-id="${data}" data-notif-type="${datas[data].type}">
                    <div class="notif-header">
                        <span class="notif-span notif-img">
                            <img class="notif-img-src" src="${img}" alt="Could'nt load image">
                        </span>
                        <span class="notif-span notif-from">
                            ${allias} ${datas[data].name}
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
            <div class="n-content"></div>
        </div>`
    }
}