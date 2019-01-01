class ChooseSignup {

    completeSignup(obj) {
        let RenderDOM = new Render()
        RenderDOM.render(obj.main(), signForm)
        signInner.style.height = '500px'

        document.querySelector('.fname').focus()
        
        // ------------ Go back Event Listener -----------
        let goBack = document.querySelector('.go-back')
        goBack.addEventListener('click', () => {
            obj.goBack()
        })
    }
    main() {
        return `<div class="c-signup">
                            <h2 class="c-title">Complete signup</h2>
                            <label class="container">As a doctor
                                <input type="radio" checked="checked" name="radio">
                                <span class="checkmark"></span>
                                <p class="description">Some description</p>
                            </label>
                            <label class="container">As a patient
                                <input type="radio" name="radio">
                                <span class="checkmark"></span>
                                <p class="description">Some description</p>
                            </label>
                            <button class="sign-btn">Next</button>
                        </div>`
    }
}