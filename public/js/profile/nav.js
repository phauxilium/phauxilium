let searchInput = document.querySelector('.search-input')
let searchBtn = document.querySelector('.search-btn')
let searchIcon = document.querySelector('.search-icon')

searchInput.addEventListener('focus', () => {
    searchInput.style.border = "1px solid #1da1f2"
    searchInput.style.borderRight = "none"
    searchIcon.style.color = "#1da1f2"

    searchBtn.style.border = "1px solid #1da1f2"
    searchBtn.style.borderLeft = "none" 
})

searchInput.addEventListener('focusout', () => {
    searchInput.style.border = "1px solid lightgray"
    searchInput.style.borderRight = "none"
    searchIcon.style.color = "black"

    searchBtn.style.border = "1px solid lightgray"
    searchBtn.style.borderLeft = "none" 
})


let icons = document.querySelectorAll('.nav-icons')
let dropdownDiv = document.querySelector('.dropdown-div')


document.body.addEventListener('click', (e) => {
    let classList = e.target.classList
    
    if(classList.contains('arrow-icon'))
        dropdownDiv.style.display = "block"
    else
        dropdownDiv.style.display = "none"
})