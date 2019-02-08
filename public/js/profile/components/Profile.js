class Profile {
    constructor(datas, renderDiv, search) {
        this.datas = datas
        this.renderDiv = renderDiv
        this.search = search
        this.centerDiv = document.querySelector('.center-div'),
        this.week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }

    profDetails() {
        let docs = this.datas
        let dob = new Date(docs.datas.basicInfo.dob).toString().split(' ')
        let prc = ''
        let clinicInfo = ''

        if(docs.datas.uType === 'doctor') {
            let line = '--:-- --'
            let from = {
                0: docs.datas.clinics[0].schedules.from[0],
                1: docs.datas.clinics[0].schedules.from[1],
                2: docs.datas.clinics[0].schedules.from[2],
                3: docs.datas.clinics[0].schedules.from[3],
                4: docs.datas.clinics[0].schedules.from[4],
                5: docs.datas.clinics[0].schedules.from[5],
                6: docs.datas.clinics[0].schedules.from[6]
            }

            let to = {
                0: docs.datas.clinics[0].schedules.to[0],
                1: docs.datas.clinics[0].schedules.to[1],
                2: docs.datas.clinics[0].schedules.to[2],
                3: docs.datas.clinics[0].schedules.to[3],
                4: docs.datas.clinics[0].schedules.to[4],
                5: docs.datas.clinics[0].schedules.to[5],
                6: docs.datas.clinics[0].schedules.to[6]
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
            this.week.forEach(value => {
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


            if(docs.datas.uType === 'doctor' && !this.search) {
                prc = `
                <div class="col-6 basic-contents">
                    <span class="basic-label labels">
                        PRC License number
                        </span>
                    <span class="input-data">
                        ${docs.prc}
                    </span>
                    <span class="saving-edited"></span>
                </div>
                `
            }

            if (docs.datas.uType === 'doctor') {
                let searchBtn = ''
                let editBtn = ''

                if(!this.search) {
                    searchBtn = `
                    <i class="material-icons add-sched-icon" data-cID="0">
                        edit
                    </i>
                    <span class="add-sched-text" data-cID="0">
                        Edit schedule
                    </span>
                    `

                    editBtn = `
                        <span class="edit-clinic-info">
                            <i class="material-icons edit-clinic-icon">
                                edit
                            </i>
                            <span class="edit-clinic-text">
                                Edit Clinic info
                            </span>
                        </span>`
                }

                clinicInfo = `
                <div class="outer-clinic-content">
                    <div class="clinic-title">
                        Clinic Information
                        ${editBtn}
                        <!-- 
                        <span class="add-clinic">
                            <i class="material-icons add-clinic-icon">
                                add
                            </i>
                            <span class="add-clinic-text">
                                Add clinic
                            </span>
                        </span> -->
                    </div>
                    
                    <div class="clinic-info-content">
                        <div class="col-6 clinic-contents">
                            <span class="clinic-label labels">
                                Clinic's name
                            </span>
                            <span class="input-data">
                                ${docs.datas.clinics[0].name}
                            </span>
                        </div>
                    
                        <div class="col-6 clinic-contents">
                            <span class="clinic-label labels">
                                Location
                            </span>
                            <span class="input-data">
                                ${docs.datas.clinics[0].address}
                            </span>
                        </div>
                    
                        <div class="col-9 clinic-contact">
                            <span class="clinic-label labels">
                                Clinic's contact number
                            </span>
                            <span class="input-data">
                                ${docs.datas.clinics[0].contact[0]}
                            </span>
                        </div>
                        <span class="col-3 add-contact">
                            <!-- <span class="add-contact-text">
                                <i class="material-icons add-contact-icon">
                                    add
                                </i>
                                Add contact number
                            </span> -->
                        </span>
                    
                        <div class="col-12 sched-title">
                            <div class="schedule-title">
                                Clinic's Schedule
                                <span class="add-sched">
                                    ${searchBtn}
                                </span>
                            </div>
                        </div>
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
                    </div>
                </div>`
            }
        }

        let address = ''
        let editBtn = ''
        let dobStr = ''
        let contactNumber = ''
        let mobileMap = ''
        if(docs.datas.uType === 'doctor') {
            if(docs.datas.clinics[0].map) {
                mobileMap = `
                    <div class="col-12 mobile-map-div">
                        <img src="https://res.cloudinary.com/dreyan/image/upload/v1549509780/ax-images/doctor/maps/${docs.datas.clinics[0].map}" alt="Map" class="desktop-map-img">
                    </div>`
            }
        }

        if (!this.search) {
            dobStr = `
                        <div class="col-6 basic-contents">
                            <span class="basic-label labels">
                                Date of Birth
                            </span>
                            <span class="input-data">
                                ${dob[1]} ${dob[2]}, ${dob[3]}
                            </span>
                            <span class="saving-edited"></span>
                        </div>`

            address = `
                            <div class="col-6 basic-contents">
                                <span class="basic-label labels">
                                    Address
                                </span>
                                <span class="input-data">
                                ${docs.datas.basicInfo.address}
                                </span>
                                <span class="saving-edited"></span>                            
                            </div>
                `

            contactNumber = `
                        <div class="col-6 basic-contents">
                            <span class="basic-label labels">
                                Contact number
                            </span>
                            <span class="input-data">
                            ${docs.datas.basicInfo.contact}
                            </span>
                            <span class="saving-edited"></span>                        
                        </div>
`

            editBtn = `
                    <span class="edit-info">
                        <i class="material-icons edit-info-icon">
                            edit
                        </i>
                        <span class="edit-info-text">
                            Edit Info
                        </span>
                    </span>`

        }

        let details = `
        <div class="profile-title">
            Basic Information
            ${editBtn}
        </div>

        <div class="basic-info-content">
            <div class="col-4 basic-contents">
                <span class="basic-label labels">
                    Firstname
                </span> <br />
                <span class="input-data">
                ${docs.datas.basicInfo.fname}
                </span>
                <span class="saving-edited"></span>
            </div>

            <div class="col-4 basic-contents">
                <span class="basic-label labels">
                    Middle name
                </span> <br />
                <span class="input-data"> 
                ${docs.datas.basicInfo.mname}
                </span>
                <span class="saving-edited"></span>
            </div>

            <div class="col-4 basic-contents">
                <span class="basic-label labels">
                    Lastname
                </span> <br />
                <span class="input-data">
                    ${docs.datas.basicInfo.lname}
                </span>
                <span class="saving-edited"></span>
            </div>     

            <div class="col-6 basic-contents">
                <span class="basic-label labels">
                    Gender
                </span>
                <span class="input-data">
                    ${docs.datas.basicInfo.gender}
                </span>
                <span class="saving-edited"></span>
            </div>

            ${dobStr}

            ${address}

            ${contactNumber}

            <div class="col-6 basic-contents">
                <span class="basic-label labels">
                    Email
                </span>
                <span class="input-data">
                ${docs.email}
                </span>
                <span class="saving-edited">
                    <!-- <button class="edited-save">
                        Save
                    </button>
                    <button class="edited-cancel">
                        Cancel
                    </button> -->
                </span>
            </div>
            ${prc}
        </div>
        ${clinicInfo}
        ${mobileMap}
           `
           this.centerDiv.innerHTML = details
    }

    profile() {
        let docs = this.datas
        let name = `${docs.datas.basicInfo.fname} ${docs.datas.basicInfo.mname} ${docs.datas.basicInfo.lname}`
        let specialty = ''
        let _specialtyDiv = ''

        if(docs.datas.uType === 'doctor' && !this.search) {
            specialty = `
                        <div class="add-specialty-div">
                            <button class="add-specialty-btn">
                                <i class="material-icons add-icon">add</i>
                                <span class="add-specialty-text">Add specialization</span>
                            </button>
                        </div>`

        }


        if (docs.datas.uType === 'doctor') {
            name = `Dr. ${name}`
            _specialtyDiv = `
                    <div class="specialty">
                            <div class="specialty-content">
                            </div>
                            ${specialty}
                        </div>
                `
        }

        
        let imgBtn = ''
        let desktopMap = ''
        if(docs.datas.uType === 'doctor') {
            if(docs.datas.clinics[0].map) {
                desktopMap = 
                        `<div class="desktop-map-div">
                            <img src="https://res.cloudinary.com/dreyan/image/upload/v1549509780/ax-images/doctor/maps/${docs.datas.clinics[0].map}" alt="Map" class="desktop-map-img">
                        </div>`
            }
        }
        if(!this.search) {
            imgBtn = `
                <div class="upload-container">
                        <label for="upload-btn" class="material-icons camera-icon" title="Change profile picture">
                            camera_alt
                        </label>
                    </div>
                `
        }


        let connect = ''
        if(this.search && docs.datas.uType === 'doctor') {
            connect = `
                        <div class="connect-div">
                                <div class="col-6">
                                    <i class="material-icons col-12">
                                        <span class="icon-cont appointment-icon-cont">
                                            today
                                        </span>
                                    </i>
                                    <span class="appointment-text col-12">
                                        Set Appointment
                                    </span>
                                </div>
                                <div class="col-6">
                                    <i class="material-icons col-12">
                                        <span class="icon-cont message-icon-cont">
                                            email
                                        </span>
                                    </i>
                                    <span class="message-text col-12">
                                        Message
                                    </span>
                                </div>
                            </div>`
        } else if(this.search) {
            connect = `
                            <div class="connect-div">
                                <div class="col-12 patient-msg-div">
                                    <i class="material-icons col-12 message-icon-cont">
                                        <span class="icon-cont message-icon-cont">
                                            email
                                        </span>
                                    </i>
                                    <span class="message-text col-12">
                                        Message
                                    </span>
                                </div>
                            </div>`
        }


        this.renderDiv.innerHTML = `
            <div class="inner-profile-div">
                <div class="image-div">
                   <center>
                        <div class="img-content-div">
                            ${imgBtn}
                            <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${docs.datas.uType}/${docs.datas.basicInfo.profile}" class="image">
                        </div>
                    </center>

                    <form class="upload-form" method="POST" enctype="multipart/form-data">
                        <input type="file" id="upload-btn" name="upload-avatar" class="upload-avatar">
                    </form>

                    <div class="details-div">
                        <span class="uploading-text"></span>
                        <div class="name">
                            ${name}
                        </div>
                        ${_specialtyDiv}
                        ${connect}
                        <div class="add-bio-div">

                            <!-- <button class="add-bio-btn">
                                <i class="material-icons add-icon">add</i>
                                <span class="add-bio-text">Add bio</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
            ${desktopMap}
            `

        if(docs.datas.uType === 'doctor') {
            let specialtyDiv = document.querySelector('.specialty-content')
            let objLen = Object.keys(docs.datas.specialty).length
            let count = 0

            for (let data in docs.datas.specialty) {
                count++
                if (docs.datas.specialty[data] !== 0 ) {
                    specialtyDiv.append(docs.datas.specialty[data].specialization)
                    if (count !== objLen) specialtyDiv.append(' / ')
                }
            }
        }

        this.centerDiv.innerHTML = `
        `

        // Updating profile picture 
        document.querySelector('.upload-avatar').addEventListener('change', e => {
            let formData = document.querySelector('.upload-form')
            let uploadingText = document.querySelector('.uploading-text')
            let uploadingContainer = document.querySelector('.upload-container')
            uploadingText.textContent = 'Uploading...'
            uploadingContainer.style.display = "none"
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/u/upload/avatar/', true)
            xhr.send(new FormData(formData))
            xhr.onreadystatechange = () => {
                try {
                    if(xhr.readyState === 4 && xhr.status === 200) {
                        let datas = JSON.parse(xhr.responseText)
                        uploadingText.textContent = ''
                        if(!datas.fileErr) {
                            document.querySelector('.image').setAttribute('src', `https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas.uType}/${datas.profile}`)
                            uploadingContainer.style.display = "block"
                        } else {
                            alert(datas.fileErr)
                            uploadingContainer.style.display = "block"
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}