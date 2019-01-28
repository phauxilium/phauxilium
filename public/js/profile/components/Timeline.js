class Timeline {
    // Upcoming Schedules
    upcoming() {
        document.querySelector('.center-div').innerHTML = `
                    <div class="timeline-div col-12">
                        <div class="timeline-nav col-12">
                            <span class="timeline-btns-div col-4">
                                <span class="timeline-btns today-btn">
                                    Today
                                </span>
                            </span>
                            <span class="timeline-btns-div col-4">
                                <span class="timeline-btns active-timeline  upcoming-btn">
                                    Upcoming
                                </span>
                            </span>
                            <span class="timeline-btns-div col-4">
                                <span class="timeline-btns pending-btn">
                                    Pending
                                </span>
                            </span>
                        </div>

                        <div class="timeline-contents">
                        </div>
                    </div>`

        document.querySelector('.timeline-contents').innerHTML = `
            <div class="loader-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>
        `
        let schedContent = ''
        let arr  = []
        const Ajax = new AjaxAPI()
        Ajax.post('/u/get-schedules', `type=upcoming`)
        Ajax.xhr.onreadystatechange = () => {
            try {
                if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                    let datas = JSON.parse(Ajax.xhr.responseText)
                    let dataStr = JSON.stringify(datas)
                    if (dataStr === '{}') {
                        schedContent = '<div class="nothing">Nothing to show</div>'
                    } else {
                        for (let key in datas) {
                            let dateStr = new Date(datas[key].date).toString().split(' ')
                            let time = datas[key].time.split(':')

                            arr.push({
                                finDate: new Date(`${dateStr[1]} ${dateStr[2]}, ${dateStr[3]}, ${time[0]}:${time[1]}:00`),
                                key: key,
                                date: datas[key].date,
                                img: datas[key].img,
                                name: datas[key].name,
                                receiver: datas[key].receiver,
                                sender: datas[key].sender,
                                status: datas[key].status,
                                time: datas[key].time,
                                uType: datas[key].uType
                            })                             
                        }
                    }
                    // Sorting Time
                    arr.sort((a, b) => {
                        a = new Date(a.finDate);
                        b = new Date(b.finDate);
                        return a - b;
                    })

                    for(let key in arr) {
                        let dateStr = new Date(arr[key].date).toString().split(' ')
                        let time = arr[key].time.split(':')
                        let hours = ''
                        if (time[0] === '00') {
                            hours = 12
                        } else if (time[0] > 12) {
                            hours = time[0] - 12
                        } else {
                            hours = time[0]
                        }

                        let meridiem = time[0] >= 12 ? 'PM' : 'AM'
                        let finTime = `${hours}:${time[1]} ${meridiem}`
                        let finalDate = `${dateStr[0]} - ${dateStr[1]}. ${dateStr[2]}, ${dateStr[3]} ${finTime}`
                        
                        let allias = arr[key].uType === 'doctor' ? 'Dr.' : ''

                        let btns = `
                        <div class="accept-decline-div">
                            <button class="accept-btn">Reschedule</button>
                            <button class="decline-btn">Cancel</button>
                        </div>`

                        schedContent += `
                        <div class="outer-sched" data-key=${arr[key].key} data-sender=${arr[key].sender} data-receiver=${arr[key].receiver}>
                            <div class="schedule-header">
                                <div class="sched-avatar-div">
                                    <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${arr[key].uType}/${arr[key].img}" class="sched-avatar" alt="Couldn't load image">
                                </div>
                                <div class="col-9">
                                    <div class="sched-name-div">
                                        ${allias} ${arr[key].name}
                                    </div>
                                    <div class="sched-time-div">
                                        ${finalDate}
                                    </div>
                                </div>
                            </div>
                            ${btns}
                        </div>
                    `
                    }
                    document.querySelector('.timeline-contents').innerHTML = schedContent
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    // Pending Schedules
    pending() {
        document.querySelector('.center-div').innerHTML = `
                        <div class="timeline-div col-12">
                            <div class="timeline-nav col-12">
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns today-btn">
                                        Today
                                    </span>
                                </span>
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns upcoming-btn">
                                        Upcoming
                                    </span>
                                </span>
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns active-timeline  pending-btn">
                                        Pending
                                    </span>
                                </span>
                            </div>

                            <div class="timeline-contents">
                            </div>
                        </div>`

        document.querySelector('.timeline-contents').innerHTML = `
            <div class="loader-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>
        `
        let schedContent = ''
        const Ajax = new AjaxAPI()
        Ajax.post('/u/get-schedules', `type=pending`)
        Ajax.xhr.onreadystatechange = () => {
            try {
                if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                    let datas = JSON.parse(Ajax.xhr.responseText)
                    let dataStr = JSON.stringify(datas)
                    if (dataStr === '{}') {
                        schedContent = '<div class="nothing">Nothing to show</div>'
                    } else {
                        for (let key in datas) {
                            let dateStr = new Date(datas[key].date).toString().split(' ')
                            let time = datas[key].time.split(':')
                            let hours = ''
                            if (time[0] === '00') {
                                hours = 12
                            } else if (time[0] > 12) {
                                hours = time[0] - 12
                            } else {
                                hours = time[0]
                            }

                            let meridiem = time[0] >= 12 ? 'PM' : 'AM'
                            let finTime = `${hours}:${time[1]} ${meridiem}`
                            let finalDate = `${dateStr[0]} - ${dateStr[1]}. ${dateStr[2]}, ${dateStr[3]} ${finTime}`

                            let allias = datas[key].uType === 'doctor' ? 'Dr.' : ''

                            let btns = ''

                            if(datas[key].uType !== 'doctor') {
                                btns = `
                                <div class="accept-decline-div">
                                    <button class="accept-btn">Accept</button>
                                    <button class="decline-btn">Decline</button>
                                </div>`
                            } else {
                                btns = `
                                <div class="accept-decline-div">
                                    <button class="decline-btn">Cancel</button>
                                </div>`
                            }

                            schedContent += `
                            <div class="outer-sched" data-key=${key} data-sender=${datas[key].sender} data-receiver=${datas[key].receiver}>
                                <div class="schedule-header">
                                    <div class="sched-avatar-div">
                                        <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas[key].uType}/${datas[key].img}" class="sched-avatar" alt="Couldn't load image">
                                    </div>
                                    <div class="col-9">
                                        <div class="sched-name-div">
                                            ${allias} ${datas[key].name}
                                        </div>
                                        <div class="sched-time-div">
                                            ${finalDate}
                                        </div>
                                    </div>
                                </div>
                                ${btns}
                            </div>
                        `
                        }
                    }
                    document.querySelector('.timeline-contents').innerHTML = schedContent
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    // Todays Schedule
    today() {
        document.querySelector('.center-div').innerHTML = `
                        <div class="timeline-div col-12">
                            <div class="timeline-nav col-12">
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns active-timeline today-btn">
                                        Today
                                    </span>
                                </span>
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns upcoming-btn">
                                        Upcoming
                                    </span>
                                </span>
                                <span class="timeline-btns-div col-4">
                                    <span class="timeline-btns pending-btn">
                                        Pending
                                    </span>
                                </span>
                            </div>

                            <div class="timeline-contents">
                            </div>
                        </div>`
        document.querySelector('.timeline-contents').innerHTML = `
            <div class="loader-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>
        `
        let schedContent = ''
        const Ajax = new AjaxAPI()
        Ajax.post('/u/get-schedules', `type=today`)
        Ajax.xhr.onreadystatechange = () => {
            try {
                if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                    let datas = JSON.parse(Ajax.xhr.responseText)
                    let dataStr = JSON.stringify(datas)
                    let arr = []
                    if (dataStr === '{}') {
                        schedContent = '<div class="nothing">Nothing to show</div>'
                    } else {
                        for (let key in datas) {
                            let dateStr = new Date(datas[key].date).toString().split(' ')
                            let time = datas[key].time.split(':')

                            arr.push({
                                finDate: new Date(`${dateStr[1]} ${dateStr[2]}, ${dateStr[3]}, ${time[0]}:${time[1]}:00`),
                                key: key,
                                date: datas[key].date,
                                img: datas[key].img,
                                name: datas[key].name,
                                receiver: datas[key].receiver,
                                sender: datas[key].sender,
                                status: datas[key].status,
                                time: datas[key].time,
                                uType: datas[key].uType
                            })
                        }

                        arr.sort((a, b) => {
                            a = a.finDate
                            b = b.finDate

                            return a - b
                        })

                        for(let key in arr) {
                            let time = arr[key].time.split(':')
                            let hours = ''
                            if (time[0] === '00') {
                                hours = 12
                            } else if (time[0] > 12) {
                                hours = time[0] - 12
                            } else {
                                hours = time[0]
                            }

                            let allias = arr[key].uType === 'doctor' ? 'Dr.' : ''

                            let meridiem = time[0] >= 12 ? 'PM' : 'AM'
                            let finTime = `${hours}:${time[1]} ${meridiem}`
                            // let finalDate = `${dateStr[0]} - ${dateStr[1]}. ${dateStr[2]}, ${dateStr[3]} ${finTime}`

                            let btns = `
                                <div class="accept-decline-div">
                                    <button class="accept-btn">Reschedule</button>
                                    <button class="decline-btn">Cancel</button>
                                </div>`

                            schedContent += `
                            <div class="outer-sched" data-key=${arr[key].key} data-sender=${arr[key].sender} data-receiver=${arr[key].receiver}>
                                <div class="schedule-header">
                                    <div class="sched-avatar-div">
                                        <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${arr[key].uType}/${arr[key].img}" class="sched-avatar" alt="Couldn't load image">
                                    </div>
                                    <div class="col-9">
                                        <div class="sched-name-div">
                                            ${allias} ${arr[key].name}
                                        </div>
                                        <div class="sched-time-div">
                                            ${finTime}
                                        </div>
                                    </div>
                                </div>
                                ${btns}
                            </div>
                        `
                        }
                    }
                    document.querySelector('.timeline-contents').innerHTML = schedContent
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}