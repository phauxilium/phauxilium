class PatientFiles {
    constructor() {
        this.MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }

    loadForm() {
        document.querySelector('.inner-cont-modal').innerHTML = `
        <div class="inner-modal col-12">
                        <span class="modal-notif-span span-close">
                            <i class="material-icons close-icon">close</i>
                        </span>
                        <div class="register-patient">
                            <form class="reg-patient-form">
                                <div class="patient-form-div active-form">
                                    <div class="inputs-container col-6">
                                        <label class="labels">Firstname <span class="asterisk">*</span></label>
                                        <input type="text" name="fname" class="inputs" placeholder="Firstname">
                                        <span class="helper fname-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-6">
                                        <label class="labels">Middle name <span class="asterisk">*</span></label>
                                        <input type="text" name="mname" class="inputs" placeholder="Middle name">
                                        <span class="helper mname-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-6">
                                        <label class="labels">Lastname <span class="asterisk">*</span></label>
                                        <input type="text" name="lname" class="inputs" placeholder="Lastname">
                                        <span class="helper lname-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-6">
                                        <label class="labels">Birthdate <span class="asterisk">*</span></label>
                                        <input type="date" name="dob" class="inputs" placeholder="Middle name">
                                        <span class="helper dob-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-6 gender-cont">
                                        <label class="labels">Gender <span class="asterisk">*</span></label>
                                        <select class="inputs" name="gender">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <span class="helper gender-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-6 civil-status-cont">
                                        <label class="labels">Civil Status <span class="asterisk">*</span></label>
                                        <select class="inputs" name="cStatus">
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                        <span class="helper cStatus-helper"></span>
                                    </div>
                                
                                    <div class="inputs-container col-12">
                                        <label class="labels">Address <span class="asterisk">*</span></label>
                                        <input type="text" name="address" class="inputs" placeholder="Address">
                                        <span class="helper address-helper"></span>
                                    </div>
                                </div>

                                <div class="patient-form-div">
                                    <div class="inputs-container col-6">
                                            <label class="labels">Blood type</label>
                                            <input type="text" name="bloodType" class="inputs" placeholder="Blood Type">
                                            <span class="helper bloodtype-helper"></span>
                                        </div>

                                        <div class="inputs-container col-6">
                                            <label class="labels">Email address</label>
                                            <input type="text" name="email" class="inputs" placeholder="Email">
                                            <span class="helper email-helper"></span>
                                        </div>

                                        <div class="inputs-container col-12">
                                            <label class="labels">Occupation</label>
                                            <input type="text" name="occupation" class="inputs" placeholder="Occupation">
                                            <span class="helper occupation-helper"></span>
                                        </div>

                                        <div class="inputs-container col-12">
                                            <label class="labels">Companions name</label>
                                            <input type="text" name="compName" class="inputs" placeholder="Companions name">
                                            <span class="helper companion-helper"></span>
                                        </div>

                                        <div class="inputs-container col-12">
                                            <label class="labels">Past medical history <span class="asterisk">*</span></label>
                                            <textarea class="inputs-textarea" name="history" placeholder="Past medical history"></textarea>
                                            <span class="helper history-helper"></span>
                                        </div>
                                    
                                </div>

                                <div class="inputs-container col-12">
                                    <div class="col-6 left-patient-btn">
                                         <a href="#" class="go-back-link">Go back</a>
                                    </div>
                                    <div class="col-6 right-patient-btn">
                                        <button class="patient-file-btn">Next</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
        `

        document.querySelector('.reg-patient-form').addEventListener('submit', e => {
            e.preventDefault()
            const Ajax = new AjaxAPI()
            let patient = {
                fname: e.target.elements.fname.value,
                mname: e.target.elements.mname.value,
                lname: e.target.elements.lname.value,
                dob: e.target.elements.dob.value,
                gender: e.target.elements.gender.value,
                cStatus: e.target.elements.cStatus.value,
                address: e.target.elements.address.value
            }
            let send = `fname=${patient.fname}&mname=${patient.mname}&lname=${patient.lname}&dob=${patient.dob}&gender=${patient.gender}&cStatus=${patient.cStatus}&address=${patient.address}`

            let patientBtn = document.querySelector('.patient-file-btn')
            let goBack = document.querySelector('.go-back-link')
            let patientFormDiv = document.querySelectorAll('.patient-form-div')

            if(patientBtn.textContent === 'Next') {
                Ajax.post('/u/submit/patient-reg', send)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                            let datas = JSON.parse(Ajax.xhr.responseText)
                            document.querySelector('.fname-helper').textContent = datas.fnameErr || ''
                            document.querySelector('.mname-helper').textContent = datas.mnameErr || ''
                            document.querySelector('.lname-helper').textContent = datas.lnameErr || ''
                            document.querySelector('.dob-helper').textContent = datas.dobErr || ''
                            document.querySelector('.gender-helper').textContent = datas.genderErr || ''
                            document.querySelector('.cStatus-helper').textContent = datas.cStatusErr || ''
                            document.querySelector('.address-helper').textContent = datas.addressErr || ''

                            if (!datas.fnameErr && !datas.mnameErr && !datas.lnameErr &&
                                !datas.dobErr && !datas.genderErr && !datas.cStatusErr &&
                                !datas.addressErr) {

                                patientFormDiv[0].classList.remove('active-form')
                                patientFormDiv[1].classList.add('active-form')
                                goBack.style.visibility = "visible"
                                patientBtn.textContent = "Save"
                            }
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            } else if(patientBtn.textContent === 'Save') {
                patient.bloodType = e.target.elements.bloodType.value
                patient.email = e.target.elements.email.value
                patient.occupation = e.target.elements.occupation.value
                patient.companion = e.target.elements.compName.value
                patient.history = e.target.elements.history.value
                // Go back
                goBack.addEventListener('click', () => {
                    patientFormDiv[1].classList.remove('active-form')
                    patientFormDiv[0].classList.add('active-form')
                    goBack.style.visibility = "hidden"
                    patientBtn.textContent = "Next"
                })

                send += `&bloodType=${patient.bloodType}&email=${patient.email}&occupation=${patient.occupation}&companion=${patient.companion}&history=${patient.history}`

                if (patientBtn.textContent === 'Save') {
                    patientBtn.textContent = 'Saving...'
                    Ajax.post('/u/submit/patient-reg', send)
                    Ajax.xhr.onreadystatechange = () => {
                        try {
                            if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                let datas = JSON.parse(Ajax.xhr.responseText)
                                document.querySelector('.email-helper').textContent = datas.emailErr || ''
                                document.querySelector('.history-helper').textContent = datas.historyErr || ''
                                patientBtn.textContent = 'Save'

                                if(!datas.historyErr && !datas.emailErr) {
                                    patientBtn.textContent = 'Saved'
                                    
                                    Ajax.post('/u/view/all/patient-files', '')
                                    Ajax.xhr.onreadystatechange = () => {
                                        try {
                                            if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                                let datas = JSON.parse(Ajax.xhr.responseText)
                                                this.main(datas)
                                            }
                                        } catch (err) {
                                            console.log(err)
                                        }
                                    }
                                    setTimeout(() => {
                                        document.querySelector('.outer-modal-bg').style.display = "none"
                                    }, 2000)
                                }
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    }
                }
            }
        })  
    }   

    individualProfile(datas, key) {
        let empty = 'N/A'
        let dob = datas.dob.split('-')
        dob = `${this.MONTH[parseInt(dob[1]) - 1]}. ${dob[2]}, ${dob[0]}`
        let dateObj = new Date(datas.date)
        let dateStr = dateObj.toString().split(' ')
        let time = dateStr[4].split(':')
        let hours = ''
        if(time[0] === '00') {
            hours = 12
        } else if(time[0] > 12) {
            hours = time[0] - 12
        } else {
            hours = time[0]
        }
        let meridiem = time[0] >= 12 ? 'pm' : 'am'
        let finTime = `${hours}:${time[1]} ${meridiem}`
        let finalDate = `${dateStr[0]} - ${dateStr[1]}. ${dateStr[2]}, ${dateStr[3]} ${finTime}`
        
        let medRecords = ''
        if(datas.medRecords.length === 1) {
            medRecords = '<div class="medical-records-content nothing">Nothing to show.</div>'
        } else {
            let click = ''
            let medData = datas.medRecords
            for(let key in medData) {
                if(key !== '0') {
                    let dateStr = medData[key].date.split(' ')
                    let time = dateStr[4].split(':')
                    let hours = ''
                    if (time[0] === '00') {
                        hours = 12
                    } else if (time[0] > 12) {
                        hours = time[0] - 12
                    } else {
                        hours = time[0]
                    }


                    let meridiem = time[0] >= 12 ? 'pm' : 'am'
                    let finTime = `${hours}:${time[1]} ${meridiem}`
                    let finalDate = `${dateStr[0]} - ${dateStr[1]}. ${dateStr[2]}, ${dateStr[3]} ${finTime}`

                    try {
                        if (medData[key].attached !== '') {
                            click = `window.open('https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/doctor/assets/${medData[key].filename}')`
                        } else {
                            click = ''
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    
                    medRecords += `
                        <div class="medical-records-content col-12">
                            <div class="col-12 med-cont">
                                <label class="labels">Date Added</label>
                                <span class="col-12 med-rec"> ${finalDate} </span>
                            </div>

                            <div class="col-12 med-cont">
                                <label class="labels">Complain</label>
                                <span class="col-12 med-rec"> ${medData[key].complains || empty} </span>
                            </div>
                            
                            <div class="col-12 med-cont">
                                <label class="labels">Findings</label>
                                <span class="col-12 med-rec"> ${medData[key].findings || empty} </span>
                            </div>

                            <div class="col-12 med-cont">
                                <label class="labels">Attached File</label>
                                <span class="col-12 attached-file  med-rec" onclick="${click}">
                                    ${medData[key].attached || empty} 
                                </span>
                            </div>
                            <a href="#">Delete</a>
                        </div>
                    `
                }
            }
        }

        document.querySelector('.center-div').innerHTML = `
         <div class="patients-div" data-key=${key}>
                <div class="patients-title col-12">
                    <div class="patient-title-text col-6">
                        ${datas.lname}, ${datas.fname} ${datas.mname}
                    </div>
                    <div class="add-patient-div">
                        <span class="edit-patient-cont">
                            <i class="material-icons edit-patient-icon">edit</i>
                        </span>
                        <span class="edit-patient-text">
                            Edit Profile
                        </span>
                    </div>
                </div>
                <div class="patient-profile-div">
                    <div class="patient-datas-div col-12">
                        <label class="labels">Date Records Added</label>
                        <span class="patient-data">${finalDate}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Firstname</label>
                        <span class="patient-data">${datas.fname}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Middle name</label>
                        <span class="patient-data">${datas.mname}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Lastname</label>
                        <span class="patient-data">${datas.lname}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Date of Birth</label>
                        <span class="patient-data">${dob}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Age</label>
                        <span class="patient-data">${datas.age}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Gender</label>
                        <span class="patient-data">${datas.gender}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Blood Type</label>
                        <span class="patient-data">${datas.bloodType || empty}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Email address</label>
                        <span class="patient-data">${datas.email || empty}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Civil Status</label>
                        <span class="patient-data">${datas.cStatus || empty}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Occupation</label>
                        <span class="patient-data">${datas.occupation || empty}</span>
                    </div>

                    <div class="patient-datas-div col-6">
                        <label class="labels">Companion</label>
                        <span class="patient-data">${datas.companion || empty}</span>
                    </div>

                    <div class="patient-datas-div col-12">
                        <label class="labels">Address</label>
                        <span class="patient-data">${datas.address}</span>
                    </div>

                    <div class="patient-datas-div col-12">
                        <label class="labels">Past medical history</label>
                        <span class="patient-data"> ${datas.history || empty}</span>
                    </div>
                </div>
            </div>
            <div class="medical-records-div">
                <div class="patients-title col-12">
                    <div class="patient-title-text col-6">
                        Medical Records
                    </div>
                    <div class="add-patient-div">
                        <span class="edit-patient-cont">
                            <i class="material-icons add-med-icon">add</i>
                        </span>
                        <span class="add-med-text">
                            Add Records    
                        </span>
                    </div>
                </div>
                ${medRecords}
            </div>
            `
    }

    addMedicalRecords() {
        document.querySelector('.inner-cont-modal').innerHTML = `
                <div class="inner-modal">
                    <span class="modal-notif-span span-close">
                        <i class="material-icons close-icon">close</i>
                    </span>
                    <form class="add-med-form" enctype="multipart/form-data">
                        <div class="inputs-container">
                            <label class="labels">Complains</label>
                            <input type="text" class="inputs" name="complains" placeholder="Complains">
                        </div>
                        <div class="inputs-container">
                            <label class="labels">Findings</label>
                            <textarea class="inputs-textarea" name="findings" placeholder="Findings"></textarea>                            
                        </div>
                        <div class="inputs-container">
                            <label for="attach" class="material-icons attach-icon">attach_file</label>
                            <label for="attach" class="attach-text">Attach file</label>
                            <input type="file" class="attach-input" name="attach" id="attach">
                            <span class="filename"></span>
                        </div>
                        <input type="hidden" name="key" class="patient-key">
                        <div class="inputs-container">
                            <button class="add-med-btn">Save</button>
                        </div>
                    </form>
                </div>
            `

        document.querySelector('.attach-input').addEventListener('change', e => {
            document.querySelector('.filename').textContent = e.target.value.replace(/.*[\/\\]/, '')
        })

        let btn = document.querySelector('.add-med-btn')
        let key = document.querySelector('.patients-div').getAttribute('data-key')
        document.querySelector('.patient-key').value = key
        document.querySelector('.add-med-form').addEventListener('submit', e => {
            e.preventDefault()
            btn.textContent = 'Saving...'
            let form = new FormData(e.target)
            let xhr = new XMLHttpRequest()
            xhr.open('POST', '/u/add/med-records', true)
            xhr.send(form)
            xhr.onreadystatechange = () => {
               try {
                   if (xhr.readyState === 4 && xhr.status === 200) {
                       let datas = JSON.parse(xhr.responseText)
                       btn.textContent = 'Save'
                       if (datas.fileErr) {
                           alert(datas.fileErr)
                       } else {
                           const Ajax = new AjaxAPI()
                           Ajax.post('/u/view/individual/patient-profile', `key=${key}`)
                           Ajax.xhr.onreadystatechange = () => {
                               try {
                                   if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                                       let datas = JSON.parse(Ajax.xhr.responseText)
                                       this.individualProfile(datas, key)
                                   }
                               } catch(err) {
                                   console.log(err)
                               }
                           }
                           btn.textContent = 'Saved'
                           setTimeout(() => {
                            document.querySelector('.outer-modal-bg').style.display = "none"
                           }, 2000)
                       }
                   }
               } catch (err) {
                   console.log(err)
               }
           }
        })
    }

    main(datas) {
        let patientData = ''

        if(datas.length === 1) patientData = `<div class="patient-contents nothing">Nothing to show</div>`
        else {
            for(let key in datas) {
                if(key !== '0') {
                    let name = `${datas[key].lname}, ${datas[key].fname} ${datas[key].mname}`
                    patientData += `
                           <div class="patient-contents" data-key=${key}>
                                <span class="patients-name col-10">
                                    ${name}
                                </span>
                                <span class="material-icons col-2 del-patient-icon">
                                    close
                                </span>
                           </div>
                            `
                }
            }
        }
        document.querySelector('.center-div').innerHTML = `
         <div class="patients-div">
                <div class="patients-title col-12">
                    <div class="patient-title-text col-6">
                        Patient Files
                    </div>
                    <div class="add-patient-div">
                        <span class="add-patient-cont">
                            <i class="material-icons add-patient-icon">add</i>
                        </span>
                        <span class="add-patient-text">
                            Add Patient
                        </span>
                    </div>
                </div>
                ${patientData}
            </div>
            `
    }
}