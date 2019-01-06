class Signup extends Signin{

    constructor(state) {
        super(state)
    }
    
    submit(e) {
        e.preventDefault()
        this.appendLoading()
        this.disableInputs()
        this.state.xhr.open('POST', '/signup', true)
        this.state.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

        let email = e.target.elements.emailSignup
        let password = e.target.elements.passwordSignup
        let cpassword = e.target.elements.cpasswordSignup

        this.state.xhr.send(`email=${email.value}&password=${password.value}&cpassword=${cpassword.value}`)

        this.state.xhr.onreadystatechange = () => {
            if(this.state.xhr.readyState === 4 && this.state.xhr.status === 200)

            try {
                let data = JSON.parse(this.state.xhr.responseText)

                this.appendRemoveEl()
                this.enableInputs()

                let emailHelper = document.querySelector('.email-helper-signup')
                emailHelper.textContent = data.emailErr

                let passwordHelper = document.querySelector('.password-helper-signup')
                passwordHelper.textContent = data.passwordErr

                let cpasswordHelper = document.querySelector('.cpassword-helper-signup')
                cpasswordHelper.textContent = data.cpasswordErr

                if(data.sendFailed)
                    alert(data.sendFailed)
                
                if(!data.emailErr && !data.passwordErr && !data.cpasswordErr && !data.sendFailed) {
                    let signForm = document.querySelector('.sign-form')

                    let EmailVerify = new EmailVerification()
                    let RenderDOM = new Render()

                    RenderDOM.render(EmailVerify.main(), signForm)

                    document.querySelector('.email-content').textContent = data.email
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    main() {
        return `<div class="signup-div">
                        <div class="input-container">
                            <label class="label">Email</label>
                            <input type="text" name="emailSignup" class="inputs email" placeholder="youremail@example.com">
                            <span class="helper email-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <label class="label">Password</label>
                            <input type="password" name="passwordSignup" class="inputs" placeholder="Password">
                            <span class="helper password-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <label class="label">Confirm Password</label>
                            <input type="password" name="cpasswordSignup" class="inputs" placeholder="Confirm Password">
                            <span class="helper cpassword-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <span class="col-6 remember-me">
                                <a href="#" class="sign-in-link">Sign-in</a>
                            </span>

                            <div class="col-6 sign-btn-div">
                                <button class="sign-btn">Sign-up</button>
                            </div>
                        </div>
                    </div>`
    }
}