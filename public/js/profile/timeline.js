let showSched = document.querySelector('.view-sched')
let hideSched = document.querySelector('.hide-sched')
let schedContent = document.querySelector('.sched-content')

showSched.addEventListener('click', () => {
    schedContent.style.height = "100%";
})

hideSched.addEventListener('click', () => {
    schedContent.style.height = "0"
})