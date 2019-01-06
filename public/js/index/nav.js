let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')
let signOuter = document.querySelector('.sign-outer')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})


let signInner = document.querySelector('.sign-inner')
let signForm = document.querySelector('.sign-form')

//  ------------------- Initializing PatientSignup ----------------
let PatientSign = new PatientSignup()
let DoctorSign = new DoctorSignup()

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
        let ChooseSign = new ChooseSignup()
    
        let radio = e.target.elements.radio[0].checked
                
        radio ? ChooseSign.completeSignup(DoctorSign) : ChooseSign.completeSignup(PatientSign)
        DoctorSign.agreementClick()

    } else if(signForm.children[0].className === 'patient-signup') {
        PatientSign.submit(e)
    
    } else if(signForm.children[0].className === 'doctor-signup') {
        DoctorSign.submit(e)
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
            signOuter.style.display = "block"
            renderSignin()

            document.querySelector('.email').focus()
        }

        // --------------- Closing Modal
        if(classList.contains('close-icon')) {
            signOuter.style.display = "none"
            PatientSign.state.elementIndex = 0
            DoctorSign.state.elementIndex = 0
        }

        // -------------- Mobile Close Menu bar
        if(classList.contains('menu-close-icon') || classList.contains('nav-mobile-btn'))
            menuBar.style.width = "0"

        //  ----------------- Showing Sign up Form
        if(classList.contains('sign-up-link')) {

            let SignUp = new Signup()
            let RenderDOM = new Render()

            RenderDOM.render(SignUp.main(), signForm)

            document.querySelector('.email').focus()
        }

        //  -------------- Showing Sign in Form
        if(classList.contains('sign-in-link')) {
            renderSignin()

            document.querySelector('.email').focus()
        }
})

