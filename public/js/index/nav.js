

let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')
let signModal = document.querySelector('.sign-outer')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})

document.body.addEventListener('click', (e) => {
    let classList = e.target.classList
        
    if(classList.contains('sign-modal'))
        signModal.style.display = "block"

    if(classList.contains('close-icon'))
        signModal.style.display = "none"

    if(classList.contains('menu-close-icon') || classList.contains('nav-mobile-btn'))
        menuBar.style.width = "0"

})

let form = document.querySelector('.sign-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
        
})
