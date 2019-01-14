class DoctorSchedule {
    constructor(cid, modal) {
        this.weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        this.cID = cid
        this.innerCont = modal
    }

    submit() {
        document.querySelector('.add-sched-form').addEventListener('submit', e => {
            e.preventDefault()

            document.querySelector('.save-sched-btn').textContent = 'Saving...'

            const Ajax = new AjaxAPI()
            let schedules = {
                from0: e.target.elements.from0.value,
                to0: e.target.elements.to0.value,

                from1: e.target.elements.from1.value,
                to1: e.target.elements.to1.value,
                
                from2: e.target.elements.from2.value,
                to2: e.target.elements.to2.value,
                
                from3: e.target.elements.from3.value,
                to3: e.target.elements.to3.value,
                
                from4: e.target.elements.from4.value,
                to4: e.target.elements.to4.value,
                
                from5: e.target.elements.from5.value,
                to5: e.target.elements.to5.value,
                
                from6: e.target.elements.from6.value,
                to6: e.target.elements.to6.value,

                cID: this.cID
            }

            let send = ''
            for(let key in schedules) {
                send += `${key}=${schedules[key]}&`
            }

            Ajax.post('/u/add/schedules', send)
            
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        
                        let err = []
                        for(let key in datas.err) {
                            if(key !== 'nullErr') {
                                document.querySelector(`.${key}`).textContent = datas.err[key] ? datas.err[key] : ''
                                if(datas.err[key] === 'Invalid time')
                                    err.push(true)
                            }
                        }

                        if(err.indexOf(true) === -1) {
                            const centerDiv = document.querySelector('.center-div')
                            centerDiv.innerHTML = `
                                <div class="inner-profile-div">
                                    <img src="/static/images/loader.svg" class="loader">
                                </div>
                            `

                            Ajax.post('/u/my/profile')
                            Ajax.xhr.onreadystatechange = () => {
                                try {
                                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                        let docs = JSON.parse(Ajax.xhr.responseText)
                                        const Prof = new Profile(docs)
                                        Prof.profDetails()
                                    }
                                } catch(err) {
                                    console.log(err)
                                }
                            }
                            document.querySelector('.save-sched-btn').textContent = 'Saved'
                            setTimeout(() => {
                                document.querySelector('.outer-modal-bg').style.display = "none"
                                document.querySelector('.inner-cont-modal').classList.remove('sched-div')
                            }, 2000)

                            // profileDiv.style.display = "block"
                            // profileDiv.innerHTML = `
                            //         <div class="inner-profile-div">
                            //             <img src="/static/images/loader.svg" class="loader">
                            //         </div>
                            //     `
                           
                        } else {
                            document.querySelector('.save-sched-btn').textContent = 'Save'
                        }
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        })
    }

    main() {
        const Ajax = new AjaxAPI()
        Ajax.post('/u/my/profile')
        Ajax.xhr.onreadystatechange = () => {
            try {
                if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                    let docs = JSON.parse(Ajax.xhr.responseText)
                    let datas = docs.datas.clinics[0].schedules
                    
                    let inputs = ''
                    this.weeks.forEach(value => {
                        inputs += `
                                <div class="col-12 inner-sched-cont days-cont">
                                    ${value}
                                </div>
                            `
                    })

                    let from = ''
                    for(let key in datas.from) {
                        from += `
                            <div class="col-12 inner-sched-cont">
                                <label class="labels">From</label>
                                <input type="time" name="from${key}" class="inputs set-sched-input" value="${datas.from[key]}">
                                <span class="helper fromErr${key}"></span>
                            </div>
                        `
                    }


                    let to = ''
                    for(let key in datas.to) {
                        to += `
                        <div class="col-12 inner-sched-cont">
                            <label class="labels">To</label>
                            <input type="time" name="to${key}" class="inputs set-sched-input" value="${datas.to[key]}">
                            <span class="helper toErr${key}"></span>
                        </div>`
                    }

                   this.innerCont.innerHTML = 
                   `
                        <div class="inner-modal col-12">
                            <span class="modal-notif-span span-close">
                                <i class="material-icons close-icon">close</i>
                            </span>
                            <div class="col-12 sched-title">
                                Set schedule
                            </div>
                            <form action="POST" class="add-sched-form">
                            <div class="col-4 sched-cont">
                                ${inputs}
                            </div>
                            <div class="col-4 sched-cont">
                                ${from}
                            </div>
                            <div class="col-4 sched-cont">
                                ${to}
                            </div>
                                <div class="col-12 sched-btn-div">
                                        <button class="save-sched-btn">
                                            Save
                                        </button>
                                    </div>
                            </form>
                        </div>
                            `
                        this.submit()
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}