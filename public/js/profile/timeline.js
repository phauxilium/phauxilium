let showSched = document.querySelector('.view-sched')
let hideSched = document.querySelector('.hide-sched')
let schedContent = document.querySelector('.sched-content')

let viewMore = document.querySelector('.view-more') 
let viewLess = document.querySelector('.view-less')
let detailsDiv = document.querySelector('.details-div')
let details = document.querySelector('.details')

//  ------------- Expands Div ---------------
const showMore = (elClick, elDiv, height, elDivContent) => {
    elClick.addEventListener('click', () => {
        elDiv.style.height = height
        elDivContent.style.display = "block"
    })
}


// -------------- Lessen Div ---------------
const showLess = (elClick, elDiv, height,  elDivContent) => {
    elClick.addEventListener('click', () => {
        elDiv.style.height = height
        elDivContent.style.display = "none"
    })
}


//  ---------------- Handling Event Listener Errors ------------
try {

    showMore(viewMore, detailsDiv, "100%", details)
    showMore(showSched, schedContent, "100%")

    showLess(viewLess, detailsDiv, "100%", details)
    showLess(hideSched, schedContent, "0")

}catch(e) {
    console.log('')
}


// -----------  Show modal function ----------

let outerModalTrick = document.querySelector('.outer-modal-trick')
let outerModal = document.querySelector('.outer-modal')

const showModal = (showDiv, btn, btnName) => {
    outerModalTrick.style.display = "block"
    outerModal.style.display = "block"
    showDiv.style.display = "block"
    btn.textContent = btnName
}


// -------------- Handling Submit Appointment Form ------------
let appointmentForm = document.querySelector('.appointment-form')

let socket = io()

appointmentForm.addEventListener('submit', (e) => {    
    e.preventDefault()

    let time = e.target.elements.setAppointmentTime
    let date = e.target.elements.setAppointmentDate

    // Emitting Events

    socket.emit('submitAppointment', {
        'time': time.value,
        'date': date.value,
        'name': 'Dr. Gerphil Kier De la Cruz'
    })

    week.value = 'Monday'
    time.value = ''
    date.value = ''

    let message = document.querySelector('.message')

    if(setSchedBtn.textContent === 'Set Appointment')
        message.textContent = "Appointment successfully set"
    else
        message.textContent = "Reschedule successfully set"

    message.style.display = "block"

    setTimeout(() => {
        message.style.display = "none"
        message.textContent = ""
    }, 3000)
})


// Listening for event from server side
socket.on('submitAppointment', data => {
    let todayTbl = document.querySelector('.today-tbl')
    let row = todayTbl.insertRow(todayTbl.rows.length)

    let col1 = row.insertCell(0)
    col1.classList.add('sched-td-today')
    col1.innerHTML = `${data.time}am`

    let col2 = row.insertCell(1)
    col2.classList.add('sched-td-today')
    col2.innerHTML = `${data.name}`

    let col3 = row.insertCell(2)
    col3.classList.add('sched-td-today')
    col3.innerHTML = `<button class="today-cancel">Cancel</button>`
})


// -------------- Handling Submit Cancel Form -----------------
let cancelForm = document.querySelector('.cancel-form')

cancelForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let cancelMessage = document.querySelector('.cancel-message')
    e.target.elements.textarea.value = ''
    cancelMessage.style.display = 'block';
    setTimeout(() => {
        cancelMessage.style.display = 'none'
    }, 3000)
})


// -------------- Handling Submit Add Medical Records Form

let addMedicalForm = document.querySelector('.add-medical-form')

addMedicalForm.addEventListener('submit', (e) => {

    e.preventDefault()

    let addMedicalMessage = document.querySelector('.add-medical-message')
    e.target.elements.textarea.value = ''
    addMedicalMessage.style.display = 'block'
    setTimeout(() => {
        addMedicalMessage.style.display = 'none'
    }, 3000)

})


// ------------- Changing Active Buttons --------------
// ------------ Changing Divs ----------------
let barBtns = document.querySelectorAll('.bar-btn')
let innerTimelineDivs = document.querySelectorAll('.inner-timeline-div')

barBtns.forEach((barBtn, index) => {
    barBtn.addEventListener('click', () => {

        // Buttons
        barBtns.forEach((btn) => {
            btn.classList.remove('active')
        })
        barBtn.classList.add('active')

        // Divs
        innerTimelineDivs.forEach((innerTimelineDiv) => {
            innerTimelineDiv.classList.remove('active-div')
        })

        innerTimelineDivs[index].classList.add('active-div')

    })
})


// --------------- Handling Chat Listeners ----------------
let chatForm = document.querySelector('.chat-form')

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let chatValue = e.target.elements.chatInput
    let name = e.target.elements.name
    let img = e.target.elements.img
    socket.emit('chatSend', {
        name: name.value,
        message: chatValue.value,
        img: img.value
    })

    chatValue.value = ''

})



socket.on('chatSend', data => {
    let chatBody = document.querySelector('.chat-body')
    let div = document.createElement('div')
    div.className = 'message-div'

    chatBody.append(div)
    div.innerHTML = `
     <b class="chat-name">
        ${data.name}
    </b> <br /> 
    <div class="chat-output">${data.message}
    </div>`

})


// ----------------- Adaptive Text Area --------------
// var chatOutput = document.querySelector('chat-output');

// chatOutput.addEventListener('keydown', () => {
//     setTimeout(() => {
//         this.style.cssText = 'height:auto; padding:0;'
//         this.style.cssText = `height: ${this.scrollHeight}px`
//     }, 0)
// });
        


// -------------- Body Event Listeners ----------------------
let appointmentModal = document.querySelector('.appointment-modal')
let setSchedBtn = document.querySelector('.setSched-btn')

let cancelModal = document.querySelector('.cancel-modal')
let cancelSchedBtn = document.querySelector('.cancel-sched-btn')

let addMedicalModal = document.querySelector('.add-medical-modal')
let addMedicalSchedBtn = document.querySelector('.add-medical-sched-btn')

let centerInnerDiv = document.querySelectorAll('.center-inner-div') 

document.body.addEventListener('click', (e) => {

    e.stopPropagation()

    // ------------ Hiding Modals ----------------
    let classList = e.target.classList
    if(
        classList.contains('close-modal-icon') || 
        classList.contains('close-modal-div') || 
        classList.contains('outer-modal-trick') ||
        classList.contains('outer-modal') ||
        classList.value === '' 
        ) {
            outerModalTrick.style.display = "none"
            outerModal.style.display = "none"
            appointmentModal.style.display = "none"
            cancelModal.style.display = "none"
            addMedicalModal.style.display = "none"

    }
    

    // -------------- Showing Modals -------------
    if(classList.contains('setAppointment')) {
        showModal(appointmentModal, setSchedBtn, 'Set Appointment')
    } else if(classList.contains('today-re-sched')) {
        showModal(appointmentModal, setSchedBtn, 'Reschedule')
    } else if(classList.contains('today-cancel')) {
        showModal(cancelModal, '', '')
    } else if(classList.contains('addMedicalRecords')) {
        showModal(addMedicalModal, '', '')
    }


    // ------------  Handling show Timeline and Chat Body
    if(classList.contains('sched-icon')) {
        centerInnerDiv.forEach((key) => {
            key.classList.remove('active-center-div')
        })
        centerInnerDiv[0].classList.add('active-center-div')
    } else if(classList.contains('sendMessage')) {
        centerInnerDiv.forEach((key) => {
            key.classList.remove('active-center-div')
        })
        centerInnerDiv[1].classList.add('active-center-div')
    }
     
})

