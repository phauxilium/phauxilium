let showSched = document.querySelector('.view-sched')
let hideSched = document.querySelector('.hide-sched')
let schedContent = document.querySelector('.sched-content')

let viewMore = document.querySelector('.view-more') 
let viewLess = document.querySelector('.view-less')
let detailsDiv = document.querySelector('.details-div')
let details = document.querySelector('.details')

const showMore = (elClick, elDiv, height, elDivContent) => {
    elClick.addEventListener('click', () => {
        elDiv.style.height = height
        elDivContent.style.display = "block"
    })
}

const showLess = (elClick, elDiv, height,  elDivContent) => {
    elClick.addEventListener('click', () => {
        elDiv.style.height = height
        elDivContent.style.display = "none"
    })
}


showMore(viewMore, detailsDiv, "100%", details)
showMore(showSched, schedContent, "100%")

showLess(viewLess, detailsDiv, "100%", details)
showLess(hideSched, schedContent, "0")
