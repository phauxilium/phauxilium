class AddSpecialization {
    constructor() {
        this.state = {
            saveDiv: document.querySelector('.save-cancel-div'),
            inputs: document.querySelector('.inputs'),
        }
    }


    addSpecializationBtn() {
        return `<button class="add-specialty-btn">
                            <i class="material-icons add-icon">add</i><span class="add-specialty-text">Add specialization</span>
                        </button>`
    }

    saveCancelBtn() {
        return `
                    <button class="save-cancel-btn save">Save</button>  
                    <button type="button" class="save-cancel-btn cancel">Cancel</button>
                    `
    }

    saving() {
        this.state.saveDiv.textContent = 'Saving...'
        this.state.inputs.setAttribute('disabled', '')
    }

    doneSaving() {
        this.state.inputs.removeAttribute('disabled')

        const RenderDOM = new Render()
        RenderDOM.render(this.saveCancelBtn(), this.state.saveDiv)
    }

    submit(e) {
        e.preventDefault()

        this.saving()

        let specialization = e.target.elements.specialization.value
        const Ajax = new AjaxAPI()

        Ajax.post('/u/d/add', `specialization=${specialization}`)

        Ajax.xhr.onreadystatechange = () => {
            if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                try {
                    let datas = JSON.parse(Ajax.xhr.responseText)
                    this.doneSaving()
                    document.querySelector('.specialization-helper').textContent = datas.specializationErr ? datas.specializationErr : ''

                    if(!datas.specializationEr) {
                        let channel = document.querySelector('.channel').value                     

                        socket.emit('join', channel)

                        socket.emit('specializationUpdate', channel)

                        this.saving()
                        this.state.saveDiv.style.color = "green"
                        this.state.saveDiv.textContent = "Saved successfully"
                        setTimeout(() => {
                            const RenderDOM = new Render()
                            const specialtyDiv = document.querySelector('.add-specialty-div')
                            RenderDOM.render(this.addSpecializationBtn(), specialtyDiv)
                        }, 3000)
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        }
    }
    main() {
        return `<form class="save-form">
                            <div class="inputs-container col-12">
                                <input type="text" name="specialization" class="inputs" placeholder="Add specialization">
                                <span class="helper specialization-helper"></span>
                            </div>

                            <div class="save-cancel-div col-12">
                                <button class="save-cancel-btn save">Save</button>
                                
                                <button type="button" class="save-cancel-btn cancel">Cancel</button>
                            </div>
                        </form>`
    }
}