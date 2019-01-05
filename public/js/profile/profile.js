const socket = io()
let specialtyDiv = document.querySelector('.add-specialty-div')
let bioDiv = document.querySelector('.add-bio-div')
document.body.addEventListener('click', e => {

    e.stopPropagation()
    let target = e.target.classList
    if(target.contains('add-specialty-btn') || 
        target.contains('add-specialty-text')) {
        const AddSpecialty = new AddSpecialization()
        const RenderDOM = new Render()

        RenderDOM.render(AddSpecialty.main(), specialtyDiv)
        document.querySelector('.inputs').focus()
    } else if (
        target.contains('add-bio-btn') ||
        target.contains('add-bio-text')) {
        const BioAdd = new AddBio()
        const RenderDOM = new Render()

        RenderDOM.render(BioAdd.main(), bioDiv)
        document.querySelector('.inputs').focus()
    }

    if(target.contains('save')) {
        let saveForm = document.querySelector('.save-form')
        saveForm.addEventListener('submit', e => {
            let saveFormParent = saveForm.parentElement.className
            if(saveFormParent === 'add-specialty-div') {
                const AddSpecialty = new AddSpecialization()
                AddSpecialty.submit(e)
            }
        })
    } else if (target.contains('cancel')) {
        const AddSpecialty = new AddSpecialization()
        const RenderDOM = new Render()
        RenderDOM.render(AddSpecialty.main(), specialtyDiv)
    }
})