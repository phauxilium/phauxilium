let menuBtn = document.querySelector('.menu-btn')
let menuBar = document.querySelector('.menu-bar')

menuBtn.addEventListener('click', () => {
    menuBar.style.width = "200px"
})

document.body.addEventListener('click', (e) => {
    let className = e.target.className
    if(className !== 'menu-bar' && className !== 'menu-btn')
        menuBar.style.width = "0"
})