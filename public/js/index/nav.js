let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')
let signModal = document.querySelector('.sign-outer')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})


let signInner = document.querySelector('.sign-inner')
let signForm = document.querySelector('.sign-form')

//  ------------------- Signin and Signup Form Submit 
signForm.addEventListener('submit', (e) => {
    let signIn = new Signin()
    let signUp = new Signup()

    e.preventDefault()
    if(signForm.children[0].className === 'sign-div')
        signIn.submit(e)
    else if(signForm.children[0].className === 'signup-div')
        signUp.submit(e)
        
})


//  --------------- Render Sign in Form
const renderSignin = () => {
    let signIn = new Signin()
    let RenderDOM = new Render(signIn.main(), signForm)
    RenderDOM.render()
}

// ---------------- Event body listener
document.body.addEventListener('click', (e) => {
    let classList = e.target.classList

        // ------------- Mobile Show modal
        if(classList.contains('sign-modal')) {
            signModal.style.display = "block"
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

            let signUp = new Signup()
            let RenderDOM = new Render(signUp.main(), signForm)

            RenderDOM.render()
        }

        //  -------------- Showing Sign in Form
        if(classList.contains('sign-in-link')) {
            signInner.style.height = '460px'
            renderSignin()
        }
})

