const Notif = new Notification()    


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
    let _classList = e.target.classList

    if(
        !_classList.contains('search-outputs') &&
        !_classList.contains('search-output-name') &&
        !_classList.contains('search-output-img')
        )
            searchOutputDiv.style.display = "none"

    if(_classList.contains('nav-icons') && !_classList.contains('arrow-icon')) {
        icons.forEach(value => {
            value.classList.remove('active-icon')
        })
        _classList.add('active-icon')

        if(_classList.contains('sched-icon')) {
            alert('sched')
        } else if(_classList.contains('notif-icon')) {
            alert('notif')
        } else if(_classList.contains('mail-icon')) {
            alert('mail')
        }
    }

    if (_classList.contains('arrow-icon')) {
        dropdownDiv.style.display = "block"
    } else {
        dropdownDiv.style.display = "none"
    }

    if(_classList.contains('sign-out')) {
        window.location = '/u/s/o'
    }
})


