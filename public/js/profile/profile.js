const socket = io()

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
})

// Signed In listener
// Don't Remove!!!
socket.emit('signed in', document.querySelector('.channel').value)