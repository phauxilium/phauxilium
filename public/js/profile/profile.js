document.body.addEventListener('click', e => {
    let specialtyDiv = document.querySelector('.add-specialty-div')
    let bioDiv = document.querySelector('.add-bio-div')
    
    e.stopPropagation()
    let _classList = e.target.classList

    if (_classList.contains('close-icon')) {
        document.querySelector('.outer-modal-bg').style.display = "none"
        document.querySelector('.inner-cont-modal').classList.remove('sched-div')
    }

    if(_classList.contains('add-specialty-btn') || 
        _classList.contains('add-specialty-text')) {
        const AddSpecialty = new AddSpecialization()
        const RenderDOM = new Render()
        RenderDOM.render(AddSpecialty.main(), specialtyDiv)
        document.querySelector('.inputs').focus()
    } else if (
        _classList.contains('add-bio-btn') ||
        _classList.contains('add-bio-text')) {
        const BioAdd = new AddBio()
        const RenderDOM = new Render()
        RenderDOM.render(BioAdd.main(), bioDiv)
        document.querySelector('.inputs').focus()
    }

    if(_classList.contains('save')) {
        let saveForm = document.querySelector('.save-form')
        saveForm.addEventListener('submit', e => {
            let saveFormParent = saveForm.parentElement.className
            if(saveFormParent === 'add-specialty-div') {
                const AddSpecialty = new AddSpecialization()
                AddSpecialty.submit(e)
            }
        })
    } else if (_classList.contains('cancel')) {
        const AddSpecialty = new AddSpecialization()
        const RenderDOM = new Render()
        RenderDOM.render(AddSpecialty.addSpecializationBtn(), specialtyDiv)
    }

    if(_classList.contains('add-sched-text') || _classList.contains('add-sched-icon')) {
        document.querySelector('.outer-modal-bg').style.display = "block"
        let innerContModal = document.querySelector('.inner-cont-modal')
        innerContModal.classList.add('sched-div')
        innerContModal.innerHTML = `
            <div class="inner-modal col-12">
                <img src="/static/images/loader.svg" class="loader">
            </div>`
        
        let cid = e.target.getAttribute('data-cID')
        const DoctorSched = new DoctorSchedule(cid, innerContModal)
        DoctorSched.main()
    }


    if(_classList.contains('appointment-icon-cont') ||
        _classList.contains('appointment-text')) {
            let key = document.querySelector('.key').value
            document.querySelector('.outer-modal-bg').style.display = "block"
            let innerModal = document.querySelector('.inner-cont-modal')
            innerModal.innerHTML = `
            <div class="inner-modal col-12">
                <img src="/static/images/loader.svg" class="loader">
            </div>
            `
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/sched', `key=${key}`)
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        let line = '--:-- --'
                        let week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                        let from = {
                            0: datas.from[0],
                            1: datas.from[1],
                            2: datas.from[2],
                            3: datas.from[3],
                            4: datas.from[4],
                            5: datas.from[5],
                            6: datas.from[6]
                        }

                        let to = {
                            0: datas.to[0],
                            1: datas.to[1],
                            2: datas.to[2],
                            3: datas.to[3],
                            4: datas.to[4],
                            5: datas.to[5],
                            6: datas.to[6]
                        }


                        for (let key in from) {
                            let splitTime = from[key].split(':')
                            if (splitTime[0] > 12) {
                                splitTime = `${splitTime[0] - 12}:${splitTime[1]} PM`
                            } else {
                                splitTime = `${splitTime[0]}:${splitTime[1]} AM`
                            }

                            if (splitTime.split(':')[0] !== '')
                                from[key] = splitTime
                        }

                        for (let key in to) {
                            let splitTime = to[key].split(':')
                            if (splitTime[0] > 12) {
                                splitTime = `${splitTime[0] - 12}:${splitTime[1]} PM`
                            } else {
                                splitTime = `${splitTime[0]}:${splitTime[1]} AM`
                            }

                            if (splitTime.split(':')[0] !== '')
                                to[key] = splitTime
                        }

                        let weekSched = ''
                        week.forEach(value => {
                            weekSched += `${value}<br/>`
                        })

                        let timeFrom = ''
                        for (let key in from) {
                            timeFrom += `${from[key] || line}<br/>`
                        }

                        let timeTo = ''
                        for (let key in to) {
                            timeTo += `${to[key] || line}<br/>`
                        }

                        innerModal.innerHTML = `
                            <div class="inner-modal col-12">
                                <span class="modal-notif-span span-close">
                                    <i class="material-icons close-icon">close</i>
                                </span>
                                <div class="col-12">
                                    <div class="col-4 inner-sched-text">
                                        ${weekSched}
                                    </div>
                                    <div class="col-4 inner-sched-text">
                                        ${timeFrom}
                                    </div>
                                    <div class="col-4 inner-sched-text">
                                        ${timeTo}
                                    </div>
                                </div>
                                <form class="set-appointment-form">
                                    <div class="col-4  set-sched-input">
                                        <label class="labels">Date</label>
                                        <input type="date" class="inputs" name="schedDateInput">
                                        <span class="helper set-date-helper"></span>
                                    </div>
                                    <div class="col-4 set-sched-input">
                                        <label class="labels">Time</label>
                                        <input type="time" class="inputs" name="schedTimeInput">
                                        <span class="helper set-time-helper"></span>
                                    </div>
                                    <div class="col-4 set-sched-input">
                                        <label class="labels"></label>
                                        <button class="set-sched-save">Save</button>
                                    </div>
                                </form>
                            </div>
                        `

                        document.querySelector('.set-appointment-form').addEventListener('submit', e => {
                            e.preventDefault()

                            let saveBtn = document.querySelector('.set-sched-save')
                            saveBtn.textContent = 'Saving...'
                            let date = e.target.elements.schedDateInput.value
                            let time = e.target.elements.schedTimeInput.value
                            let key = document.querySelector('.key').value

                            Ajax.post('/u/set/appointment', `date=${date}&time=${time}&key=${key}`)
                            Ajax.xhr.onreadystatechange = () => {
                                try {
                                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                        let datas = JSON.parse(Ajax.xhr.responseText)
                                        document.querySelector('.set-date-helper').textContent = datas.errDate
                                        document.querySelector('.set-time-helper').textContent = datas.errTime

                                        datas.errKey ? alert(datas.errKey) : ''

                                        saveBtn.textContent = 'Save'
                                        if(!datas.errDate && !datas.errTime && !datas.errDate && !datas.errKey) {
                                            saveBtn.textContent = 'Saved'
                                            setTimeout(() => {
                                                document.querySelector('.outer-modal-bg').style.display = "none"
                                            }, 2000)
                                        }
                                    }
                                } catch(err) {
                                    console.log(err)
                                }
                            }
                        })
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        } else if(_classList.contains('message-icon-cont') ||
        _classList.contains('message-text')) {
            let key = document.querySelector('.key').value
            window.open(`/u/messages/${key}`)
        }

        // Appointments
        if(_classList.contains('timeline-btns')) {
            let timelineBtns = document.querySelectorAll('.timeline-btns')
            timelineBtns.forEach(value => {
                value.classList.remove('active-timeline')
            })

            let btnClassList = e.target.classList
            btnClassList.add('active-timeline')
            
            const _Timeline = new Timeline()
            if(btnClassList.contains('today-btn')) _Timeline.today()
            else if(btnClassList.contains('pending-btn')) _Timeline.pending()
            else if (btnClassList.contains('upcoming-btn')) _Timeline.upcoming()
        }

        // View or Delete Patient Files
        if(_classList.contains('patients-name') || _classList.contains('del-patient-icon')) {
            let key = e.target.parentElement.getAttribute('data-key')
            const Ajax = new AjaxAPI()

            // Delete Patient Profile
            if(_classList.contains('del-patient-icon')) {
                let conf = confirm('Are you sure to delete this data?')
                if(conf) {
                    Ajax.post('/u/del/patient-profile', `key=${key}`)
                    Ajax.xhr.onreadystatechange = () => {
                        try {
                            if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                let datas = JSON.parse(Ajax.xhr.responseText)
                                const PatientFile = new PatientFiles()
                                PatientFile.main(datas)
                            }
                        } catch(err) {
                            console.log(err)
                        }
                    }
                }

                // View Patient Profile
            } else if(_classList.contains('patients-name')){
                document.querySelector('.center-div').innerHTML = `
                    <div class="patients-div col-12">
                        <img src="/static/images/loader.svg" class="loader">
                    </div>`

                Ajax.post('/u/view/individual/patient-profile', `key=${key}`)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                            let datas = JSON.parse(Ajax.xhr.responseText)
                            const PatientFile = new PatientFiles()
                            PatientFile.individualProfile(datas, key)
                        }
                    } catch(err) {
                        console.log(err)
                    }
                }
            }
        }


        // Add Medical Records
        if(_classList.contains('add-med-text')) {
            document.querySelector('.outer-modal-bg').style.display = "block"
            const PatientFile = new PatientFiles()
            PatientFile.addMedicalRecords()
        }

        if(_classList.contains('accept-btn')) {
            let timeLineBtns = document.querySelectorAll('.timeline-btns')
            if(timeLineBtns[2].classList.contains('active-timeline')) {
                e.target.textContent = 'Accepting...'
                let appointmentID = e.target.parentElement.parentElement.getAttribute('data-key')
                let sender = e.target.parentElement.parentElement.getAttribute('data-sender')
                const Ajax = new AjaxAPI()
                Ajax.post('/u/accept-req', `appointmentID=${appointmentID}&sender=${sender}`)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                            // let datas = JSON.parse(Ajax.xhr.responseText)
                            e.target.getAttribute = 'Accepted'
                            setTimeout(() => {
                                const _Timeline = new Timeline()
                                _Timeline.pending()
                            }, 2000)
                        }
                    } catch(err) {
                        console.log(err)
                    }
                }
            } else if (timeLineBtns[0].classList.contains('active-timeline') || timeLineBtns[1].classList.contains('active-timeline')) {
                let appointmentID = e.target.parentElement.parentElement.getAttribute('data-key')
                let sender = e.target.parentElement.parentElement.getAttribute('data-sender')
                let receiver = e.target.parentElement.parentElement.getAttribute('data-receiver')
                document.querySelector('.outer-modal-bg').style.display = "block"
                let innerModal = document.querySelector('.inner-cont-modal')
                innerModal.innerHTML = `
            <div class="inner-modal col-12">
                <img src="/static/images/loader.svg" class="loader">
            </div>
            `
                const Ajax = new AjaxAPI()
                Ajax.post('/u/view/sched', `key=${receiver}`)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                            let datas = JSON.parse(Ajax.xhr.responseText)
                            let line = '--:-- --'
                            let week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                            let from = {
                                0: datas.from[0],
                                1: datas.from[1],
                                2: datas.from[2],
                                3: datas.from[3],
                                4: datas.from[4],
                                5: datas.from[5],
                                6: datas.from[6]
                            }

                            let to = {
                                0: datas.to[0],
                                1: datas.to[1],
                                2: datas.to[2],
                                3: datas.to[3],
                                4: datas.to[4],
                                5: datas.to[5],
                                6: datas.to[6]
                            }


                            for (let key in from) {
                                let splitTime = from[key].split(':')
                                if (splitTime[0] > 12) {
                                    splitTime = `${splitTime[0] - 12}:${splitTime[1]} PM`
                                } else {
                                    splitTime = `${splitTime[0]}:${splitTime[1]} AM`
                                }

                                if (splitTime.split(':')[0] !== '')
                                    from[key] = splitTime
                            }

                            for (let key in to) {
                                let splitTime = to[key].split(':')
                                if (splitTime[0] > 12) {
                                    splitTime = `${splitTime[0] - 12}:${splitTime[1]} PM`
                                } else {
                                    splitTime = `${splitTime[0]}:${splitTime[1]} AM`
                                }

                                if (splitTime.split(':')[0] !== '')
                                    to[key] = splitTime
                            }

                            let weekSched = ''
                            week.forEach(value => {
                                weekSched += `${value}<br/>`
                            })

                            let timeFrom = ''
                            for (let key in from) {
                                timeFrom += `${from[key] || line}<br/>`
                            }

                            let timeTo = ''
                            for (let key in to) {
                                timeTo += `${to[key] || line}<br/>`
                            }

                            Ajax.post('/u/get/i/appointments', `appointmentID=${appointmentID}`)
                            Ajax.xhr.onreadystatechange = () => {
                                try {
                                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                        let datas = JSON.parse(Ajax.xhr.responseText)
                                        let month = new Date(datas.date).getMonth() + 1
                                        if(month < 10) month = `0${month}`
                                        let date = new Date(datas.date).toString().split(' ')
                                        date = `${date[3]}-${month}-${date[2]}`
                                        innerModal.innerHTML = `
                                            <div class="inner-modal col-12">
                                                <span class="modal-notif-span span-close">
                                                    <i class="material-icons close-icon">close</i>
                                                </span>
                                                <div class="col-12">
                                                    <div class="col-4 inner-sched-text">
                                                        ${weekSched}
                                                    </div>
                                                    <div class="col-4 inner-sched-text">
                                                        ${timeFrom}
                                                    </div>
                                                    <div class="col-4 inner-sched-text">
                                                        ${timeTo}
                                                    </div>
                                                </div>
                                                <form class="set-appointment-form">
                                                    <div class="col-4  set-sched-input">
                                                        <label class="labels">Date</label>
                                                        <input type="date" class="inputs" name="schedDateInput" value="${date}">
                                                        <span class="helper set-date-helper"></span>
                                                    </div>
                                                    <div class="col-4 set-sched-input">
                                                        <label class="labels">Time</label>
                                                        <input type="time" class="inputs" name="schedTimeInput" value="${datas.time}">
                                                        <span class="helper set-time-helper"></span>
                                                    </div>
                                                    <div class="col-4 set-sched-input">
                                                        <label class="labels"></label>
                                                        <button class="set-sched-save">Save</button>
                                                    </div>
                                                </form>
                                            </div>
                                        `

                                        document.querySelector('.set-appointment-form').addEventListener('submit', e => {
                                            e.preventDefault()

                                            let saveBtn = document.querySelector('.set-sched-save')
                                            saveBtn.textContent = 'Saving...'
                                            let date = e.target.elements.schedDateInput.value
                                            let time = e.target.elements.schedTimeInput.value

                                            Ajax.post('/u/re-sched', `date=${date}&time=${time}&sender=${sender}&receiver=${receiver}&appointmentID=${appointmentID}`)
                                            Ajax.xhr.onreadystatechange = () => {
                                                try {
                                                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                                        let datas = JSON.parse(Ajax.xhr.responseText)
                                                        document.querySelector('.set-date-helper').textContent = datas.errDate
                                                        document.querySelector('.set-time-helper').textContent = datas.errTime

                                                        datas.errKey ? alert(datas.errKey) : ''

                                                        saveBtn.textContent = 'Save'
                                                        if (!datas.errDate && !datas.errTime && !datas.errDate && !datas.errKey) {
                                                            saveBtn.textContent = 'Saved'
                                                            setTimeout(() => {
                                                                document.querySelector('.outer-modal-bg').style.display = "none"
                                                                if(timeLineBtns[0].classList.contains('active-timeline')) {
                                                                    const _Timeline = new Timeline()
                                                                    _Timeline.today()
                                                                } else if(timeLineBtns[1].classList.contains('active-timeline')) {
                                                                    const _Timeline = new Timeline()
                                                                    _Timeline.upcoming()
                                                                }
                                                            }, 2000)
                                                        }
                                                    }
                                                } catch (err) {
                                                    console.log(err)
                                                }
                                            }
                                        })
                                    }
                                } catch(err) {
                                    console.log(err)
                                }
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        } else if(_classList.contains('decline-btn')) {
            let timelineBtns = document.querySelectorAll('.timeline-btns')
            let appointmentID = e.target.parentElement.parentElement.getAttribute('data-key')
            let sender = e.target.parentElement.parentElement.getAttribute('data-sender')
            let receiver = e.target.parentElement.parentElement.getAttribute('data-receiver')
            if(confirm('Are you sure to cancel this appointment?') === true) {
                const Ajax = new AjaxAPI()
                Ajax.post('/u/decline-req', `appointmentID=${appointmentID}&sender=${sender}&receiver=${receiver}`)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                            const _Timeline = new Timeline()
                            if (timelineBtns[0].classList.contains('active-timeline')) {
                                _Timeline.today()
                            } else if(timelineBtns[1].classList.contains('active-timeline')) {
                                _Timeline.upcoming()
                            } else if (timelineBtns[2].classList.contains('active-timeline')) {
                                _Timeline.pending()
                            }
                        }
                    } catch(err) {
                        console.log(err)
                    }
                }
            }
        }
})

// Updating profile picture 
// document.querySelector('.upload-avatar').addEventListener('change', e => {
//     let formData = document.querySelector('.upload-form')
//     let uploadingText = document.querySelector('.uploading-text')
//     uploadingText.textContent = 'Uploading...'
//     const xhr = new XMLHttpRequest()
//     xhr.open('POST', '/u/upload/avatar/', true)
//     xhr.send(new FormData(formData))
//     xhr.onreadystatechange = () => {
//         try {
//             if(xhr.readyState === 4 && xhr.status === 200) {
//                 let datas = JSON.parse(xhr.responseText)
//                 uploadingText.textContent = ''
//                 if(!datas.fileErr) {
//                     document.querySelector('.image').setAttribute('src', `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas.uType}/${datas.profile}`)
//                 } else {
//                     alert(datas.fileErr)
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }
// })

// Signed In listener
// Don't Remove!!!
try {
    socket.emit('signed in', document.querySelector('.channel').value)
    socket.emit('notif-del', true)

} catch {
    console.log('')
}