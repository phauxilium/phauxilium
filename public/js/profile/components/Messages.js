class Messages {
    appendData(datas) {
        console.log(datas)
        let nContent = document.querySelector('.n-content')
        if (datas.length === 1) {
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
                            ${datas[data].name}
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
            <div class="message-div col-12">
                <span class="message-title col-12">Messages</span>
                <div class="n-content"></div>
            </div>
        `
    }
}