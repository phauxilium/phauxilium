class EmailVerification extends Signin {
    constructor(state) {
           super(state)
    }

    submit(e) {
        e.preventDefault()

        try {
            this.appendLoading()

            this.state.xhr.open('POST', '/e/v', true)
            this.state.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

            let code = e.target.elements.code

            this.state.xhr.send(`code=${code.value}`)

            this.state.xhr.onreadystatechange = () => {
                if (this.state.xhr.readyState === 4 && this.state.xhr.status === 200) {

                    let data = JSON.parse(this.state.xhr.responseText)
                    this.appendRemoveEl()

                    let codeHelper = document.querySelector('.code-helper')

                    codeHelper.textContent = data.codeErr

                    if(data.codeErr !== 'Invalid code') {
                        let signForm = document.querySelector('.sign-form')

                        codeHelper.classList.add('correct-helper')
                        codeHelper.textContent = 'Code verified'
                        
                        this.appendLoading()

                        setTimeout(() => {
                            let SignIn = new Signin()
                            let RenderDOM = new Render()
                            RenderDOM.render(SignIn.main(), signForm)

                            document.querySelector('.sign-inner').style.height = '460px'
                        }, 3000)
                    }
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    main() {
        return `<div class="verification-div">
                            <div class="input-container">
                                    <p class="user-email">
                                        Email is sent to: <u class="email-content"></u>
                                    </p>
                                </div>
                                <div class="input-container">
                                    <label class="label">Code</label>
                                    <input type="text" name="code" class="inputs" placeholder="Enter verification code">
                                    <span class="helper code-helper"></span>
                                </div>

                                <div class="input-container">
                                    <div class="col-6">
                                        <span class="col-12 remember-me">
                                            <a href="#" class="resend-link">Resend verification code</a>
                                        </span>
                                    </div>

                                    <div class="col-6 sign-btn-div">
                                        <button class="sign-btn verify-btn ">Verify</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
    }
}