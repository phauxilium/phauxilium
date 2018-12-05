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

appointmentForm.addEventListener('submit', (e) => {    
    e.preventDefault()

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


let appointmentModal = document.querySelector('.appointment-modal')
let setSchedBtn = document.querySelector('.setSched-btn')

let cancelModal = document.querySelector('.cancel-modal')
let cancelSchedBtn = document.querySelector('.cancel-sched-btn')

let addMedicalModal = document.querySelector('.add-medical-modal')
let addMedicalSchedBtn = document.querySelector('.add-medical-sched-btn')

document.body.addEventListener('click', (e) => {

    e.stopPropagation()

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
    
    if(classList.contains('setAppointment')) {
        showModal(appointmentModal, setSchedBtn, 'Set Appointment')
    } else if(classList.contains('today-re-sched')) {
        showModal(appointmentModal, setSchedBtn, 'Reschedule')
    } else if(classList.contains('today-cancel')) {
        showModal(cancelModal, '', '')
    } else if(classList.contains('addMedicalRecords')) {
        showModal(addMedicalModal, '', '')
    }


    let barBtn = document.querySelectorAll('.bar-btn')

    barBtn.forEach((bar) => {
        bar.classList.remove('active')
    })

    if(classList.contains('bar-btn')) {
        classList.add('active')
    }

})

