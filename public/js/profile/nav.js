let searchInput = document.querySelector('.search-input')
let searchBtn = document.querySelector('.search-btn')
let searchIcon = document.querySelector('.search-icon')


let searchOutputDiv = document.querySelector('.search-output-div')
searchInput.addEventListener('keyup', (e) => {
    let inputValue = e.target.value
    if(inputValue.toLowerCase() === 'iloilo') {
        searchOutputDiv.style.display = "inline"
    } else {
        searchOutputDiv.style.display = "none"
    }
})

searchInput.addEventListener('focus', () => {
    searchInput.style.border = "1px solid #1da1f2"
    searchInput.style.borderRight = "none"
    searchIcon.style.color = "#1da1f2"

    searchBtn.style.border = "1px solid #1da1f2"
    searchBtn.style.borderLeft = "none" 
})

searchInput.addEventListener('focusout', (e) => {
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

    if(
        !classList.contains('search-outputs') &&
        !classList.contains('search-output-name') &&
        !classList.contains('search-output-img')
        ){
            searchOutputDiv.style.display = "none"
        }

})