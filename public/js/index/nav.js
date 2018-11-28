let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')
let signModal = document.querySelector('.sign-outer')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})

document.body.addEventListener('click', (e) => {
    let classList = e.target.classList

    if(classList.contains('col-3') || classList.contains('col-12') || classList.value === '' || classList.contains('sign-modal'))
        menuBar.style.width = "0"
        
    if(classList.contains('sign-modal'))
        signModal.style.display = "block"

    if(classList.contains('close-icon'))
        signModal.style.display = "none"

    console.log(classList)

})
