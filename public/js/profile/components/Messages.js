class Messages {

    viewMessage(self) {
        let key = self.getAttribute('data-key')
        let sender = self.getAttribute('data-sender')
        window.open(`/u/messages/${sender}`)

        const Ajax = new AjaxAPI()
        Ajax.post('/u/update-msg', `key=${key}`)
    }

    msgDelete(self) {
        let key = self.getAttribute('data-key')
        if (confirm('Are you sure to delete this?')) {
            const Ajax = new AjaxAPI()
            Ajax.post('/u/delete-msg', `msgKey=${key}`)
        }
    }

    appendData(datas) {
        let dataArr = []
        for(let key in datas) {
            dataArr.push({
                date: datas[key].date,
                msg: datas[key].msg,
                receiver: datas[key].receiver,
                sender: datas[key].sender,
                status: datas[key].status,
                key: datas[key].key,
                profile: datas[key].profile,
                name: datas[key].name,
                uType: datas[key].uType
            })
        }

        let nContent = document.querySelector('.n-content')
        if (JSON.stringify(datas) === '{}') {
            nContent.innerHTML = `
                <div class="notif-content col-12">
                    <span class="notif-span notif-none">Nothing to show</span>
                </div>`
        } else {
            dataArr.sort((a, b) => {
                a = a.key
                b = b.key
                return a - b
            })
            for (let i = dataArr.length - 1; i >= 0; i--) {
                let msg = dataArr[i].msg
                let dateObj = new Date(dataArr[i].date)
                let dateStr = dateObj.toString().split(' ')
                let time = dateStr[4].split(':')
                let hours = time[0] > 12 ? time[0] - 12 : time[0]
                let meridiem = time[0] > 12 ? 'PM' : 'AM'
                let finTime = `${hours}:${time[1]} ${meridiem}`
                let finalDate = `${dateStr[0]} - ${dateStr[1]} ${dateStr[2]}, ${dateStr[3]} ${finTime}`
                let img = dataArr[i].sender === 'Auxilium Team' ? '/static/images/black.png' : `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${dataArr[i].uType}/${dataArr[i].profile}`

                if (msg.length > 80) msg = `${msg.substring(0, 80)}...`

                let allias =dataArr[i].uType === 'doctor' ? 'Dr.' : ''

                let notifs = `
                            <div class="notif-content col-12 ${dataArr[i].status}">
                                <div class="notif-inner-cont  col-11" onclick="_Messages.viewMessage(this)" data-key="${dataArr[i].key}" data-sender="${dataArr[i].sender}">
                                    <div class="notif-header">
                                        <span class="notif-span notif-img">
                                            <img class="notif-img-src" src="${img}">
                                        </span>
                                    </div>
                                    <div class="notif-msg-content">
                                        <div class="col-12">
                                            <span class="notif-span notif-from">
                                                ${allias} ${dataArr[i].name}
                                            </span>
                                            <span class="notif-span notif-message ${dataArr[i].status}-msg">
                                                ${msg}
                                            </span>
                                            <span class="notif-span notif-date ${dataArr[i].status}-date">
                                                ${finalDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1 delete-notif-div" onclick="_Messages.msgDelete(this)" data-key="${dataArr[i].sender}">
                                    <i class="material-icons delete-notif">close</i>
                                </div>
                            </div>`

                nContent.innerHTML += notifs
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