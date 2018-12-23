let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')
let signModal = document.querySelector('.sign-outer')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})


let signInner = document.querySelector('.sign-inner')
let signForm = document.querySelector('.sign-form')

//  ------------------- Initializing PatientSignup ----------------
let PatientSign = new PatientSignup()

//  ------------------- Signin and Signup Form Submit 
signForm.addEventListener('submit', (e) => {
    if(signForm.children[0].className === 'sign-div') {
        let SignIn = new Signin()
        SignIn.submit(e)
    }
    else if(signForm.children[0].className === 'signup-div') {
        let SignUp = new Signup()
        SignUp.submit(e)
    }
    else if(signForm.children[0].className === 'verification-div') {
        let EmailVerify = new EmailVerification()
        EmailVerify.submit(e)
    } else if(signForm.children[0].className === 'c-signup') {
        e.preventDefault()
        
        let radio = e.target.elements.radio[0].checked
        if(radio)
            console.log('doctor')
        else {
            let RenderDOM = new Render()
            RenderDOM.render(PatientSign.main(), signForm)
            signInner.style.height = '500px'
            // ------------ Go back Event Listener -----------
            let goBack = document.querySelector('.go-back')
            goBack.addEventListener('click', () => {
                PatientSign.goBack()
            })
        }
            

    } else if(signForm.children[0].className === 'patient-signup') {
        PatientSign.submit(e)
    }
})

//  --------------- Render Sign in Form
const renderSignin = () => {
    let SignIn = new Signin()
    let RenderDOM = new Render()
    RenderDOM.render(SignIn.main(), signForm)
}

// ---------------- Event body listener
document.body.addEventListener('click', (e) => {
    let classList = e.target.classList

        // ------------- Mobile Show modal
        if(classList.contains('sign-modal')) {
            signModal.style.display = "block"
            signInner.style.height = '460px'
            renderSignin()
        }

        // --------------- Closing Modal
        if(classList.contains('close-icon'))
            signModal.style.display = "none"

        // -------------- Mobile Close Menu bar
        if(classList.contains('menu-close-icon') || classList.contains('nav-mobile-btn'))                  menuBar.style.width = "0"

        //  ----------------- Showing Sign up Form
        if(classList.contains('sign-up-link')) {
            signInner.style.height = '500px'

            let SignUp = new Signup()
            let RenderDOM = new Render()

            RenderDOM.render(SignUp.main(), signForm)
        }

        //  -------------- Showing Sign in Form
        if(classList.contains('sign-in-link')) {
            signInner.style.height = '460px'
            renderSignin()
        }
})

