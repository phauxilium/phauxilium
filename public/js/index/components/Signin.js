class Signin {
    constructor() {
                this.state = {
                    'form': document.querySelector('.sign-form'),

                    'signBtn': document.querySelector('.sign-btn'),

                    'loading': document.createElement('span'),

                    'xhr': new XMLHttpRequest()
                }
    }

    appendRemoveEl() {
        try{
            let signBtn = document.createElement('button')
            
            let signBtnParent = this.state.loading.parentElement
                    
            this.state.loading.parentElement.removeChild(this.state.loading)
            signBtn.textContent = 'Sign in'
            signBtn.className = 'sign-btn'
            signBtnParent.insertBefore(this.state.signBtn, signBtnParent.firstChild)
        } catch(err) {
            console.log(err)
        }
    }

    submit(e) {
        try {
            e.preventDefault()

            if (this.state.form.children[0].className === 'sign-div') {

                let signBtnParent = this.state.signBtn.parentElement

                signBtnParent.removeChild(this.state.signBtn)

                this.state.loading.textContent = 'Loading...'

                signBtnParent.insertBefore(this.state.loading, signBtnParent.firstChild)

                // AJAX POST request        

                this.state.xhr.open('POST', '/signin', true)
                this.state.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

                let email = e.target.elements.emailSignin
                let password = e.target.elements.passwordSignin

                this.state.xhr.send(`email=${email.value}&password=${password.value}`)

                this.state.xhr.onreadystatechange = () => {
                    if (this.state.xhr.readyState === 4 && this.state.xhr.status === 200) {
                        this.appendRemoveEl()
                        
                        let data = JSON.parse(this.state.xhr.responseText)
                        let emailHelper = document.querySelector('.email-helper-signin')
                        emailHelper.textContent = data.emailErr

                        let passwordHelper = document.querySelector('.password-helper-signin')
                        passwordHelper.textContent = data.passwordErr

                        if (data.emailErr === '' && data.passwordErr === '') {
                            window.location = '/u/t/'

                            email.value = ''
                            password.value = ''
                        }
                    }
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    main() { 
        return `<div class="sign-div">
                        <div class="input-container">
                            <label class="label">Email</label>
                            <input type="text" name="emailSignin" class="inputs" placeholder="example@example.com">
                            <span class="helper email-helper-signin"></span>
                        </div>
    
                        <div class="input-container">
                            <label class="label">Password</label>
                            <input type="password" name="passwordSignin" class="inputs" placeholder="Password">
                            <span class="helper password-helper-signin"></span>
                        </div>
                        
                        <div class="input-container">
                            <div class="col-6 forgot-div">
                                <span>
                                    <a href="#" class="forgot-link">Forgot password?</a>
                                </span>
                        </div>

                        <div class="col-6 sign-btn-div">
                            <button class="sign-btn">Sign-in</button> <br />
                            <span>
                                <a href="#" class="sign-up-link">Don't have an account yet? <br /> Sign up for free</a>
                            </span>
                        </div>
                    </div>
                </div>`
    }
}