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

    let week = e.target.elements.setAppointmentWeek
    let time = e.target.elements.setAppointmentTime
    let date = e.target.elements.setAppointmentDate

    // Emitting Events

    socket.emit('submitAppointment', {
        'week': week.value,
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
    let schedTdToday = document.querySelectorAll('.sched-td-today')    
    let row = todayTbl.insertRow((schedTdToday.length / 3) + 1)

    let col1 = row.insertCell(0)
    col1.classList.add('sched-td-today')
    col1.innerHTML = `${data.time}am`

    let col2 = row.insertCell(1)
    col2.classList.add('sched-td-today')
    col2.innerHTML = `${data.name}`

    let col3 = row.insertCell(2)
    col3.classList.add('sched-td-today')
    col3.innerHTML = `
        <button class="today-re-sched">Reschedule</button>
        <button class="today-cancel">Cancel</button>
    `
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



// -------------- Body Event Listeners ----------------------
let appointmentModal = document.querySelector('.appointment-modal')
let setSchedBtn = document.querySelector('.setSched-btn')

let cancelModal = document.querySelector('.cancel-modal')
let cancelSchedBtn = document.querySelector('.cancel-sched-btn')

let addMedicalModal = document.querySelector('.add-medical-modal')
let addMedicalSchedBtn = document.querySelector('.add-medical-sched-btn')

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

})

