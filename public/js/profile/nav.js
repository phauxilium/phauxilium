const Notif = new Notification()
const _Messages = new Messages()
const _Timeline = new Timeline()
_Timeline.today()    

// For Nav Icons
let icons = document.querySelectorAll('.nav-icons')
let dropdownDiv = document.querySelector('.dropdown-div')

// ---------------- For Searching ------------------
let searchInput = document.querySelector('.search-input')
let searchBtn = document.querySelector('.search-btn')
let searchIcon = document.querySelector('.search-icon')

// let searchOutputDiv = document.querySelector('.search-output-div')
// searchInput.addEventListener('keyup', (e) => {
//     let inputValue = e.target.va lue
//     if(inputValue.toLowerCase() === 'iloilo') {
//         searchOutputDiv.style.display = "inline"
//     } else {
//         searchOutputDiv.style.display = "none"
//     }
// })


//  Searching
try {
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
} catch(err) {
    console.log()
}

try {
    // Submit Search Input
    document.querySelector('.search-form').addEventListener('submit', e => {
        e.preventDefault()
        searchInput.blur()
        searchInput.value = searchInput.value.trim()
        if (searchInput.value !== '') {
            icons.forEach(value => {
                value.classList.remove('active-icon')
                try {
                    if (window.innerWidth <= 768) {
                        document.querySelector('.profile-div').style.display = "none"
                    }
                } catch (err) {
                    console.log('')
                }
            })

            let centerDiv = document.querySelector('.center-div')
            centerDiv.innerHTML = `
            <div class="search-res-div">
                <div class="false-result">
                    <img src="/static/images/loader.svg" class="loader">
                </div>
            </div>
        `

            const Ajax = new AjaxAPI()
            Ajax.post('/u/search', `id=${searchInput.value}`)

            Ajax.xhr.onreadystatechange = () => {
                try {
                    let results = ''
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        let str = JSON.stringify(datas)
                        if (str === '{}') {
                            centerDiv.innerHTML = `
                            <div class="search-res-div">
                                <div class="false-result">No result found</div>
                            </div>
                        `
                        } else {
                            for (let data in datas) {
                                let name = `${datas[data].basicInfo.fname} ${datas[data].basicInfo.mname} ${datas[data].basicInfo.lname}`
                                let abb = datas[data].uType === 'doctor' ? 'Dr.' : ''
                                results += `
                            <div class="search-res-div" data-uid="${data}">
                                <div class=" true-results">
                                    <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas[data].uType}/${datas[data].basicInfo.profile}" class="search-img">
                                    <span class="search-name">${abb} ${name}</span>
                                    <span class="search-loc">${datas[data].basicInfo.address}</span>
                                </div>
                            </div>
                        `
                            }

                            centerDiv.innerHTML = results
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    })
} catch(err) {
    console.log('')
}

document.body.addEventListener('click', (e) => {
    let _classList = e.target.classList

    //  Search Results
    if(_classList.contains('search-loc') ||
        _classList.contains('search-img') ||
        _classList.contains('search-name') ||
        _classList.contains('true-results') ||
        _classList.contains('search-res-div')) {
            let uid = ''

            if(_classList.contains('search-loc') ||
                _classList.contains('search-img') ||
                _classList.contains('search-name')) {
                    uid = e.target.parentElement.parentElement.getAttribute('data-uid')
                } else if(_classList.contains('true-results')) {
                    uid = e.target.parentElement.getAttribute('data-uid')
                } else if(_classList.contains('search-res-div')) {
                    uid = e.target.parentElement.getAttribute('data-uid')
                }

                const profileDiv = document.querySelector('.profile-div')
                profileDiv.classList.add('search-profile-div')
                profileDiv.classList.remove('view-my-profile')
                profileDiv.style.display = "block"
                profileDiv.innerHTML = `
                    <div class="inner-profile-div">
                        <img src="/static/images/loader.svg" class="loader">
                    </div>
                `

                const centerDiv = document.querySelector('.center-div')
                
                centerDiv.innerHTML = `
                    <div class="inner-profile-div">
                        <img src="/static/images/loader.svg" class="loader">
                    </div>`
                const Ajax = new AjaxAPI()
                Ajax.post('/u/i/search/', `id=${uid}`)
                Ajax.xhr.onreadystatechange = () => {
                    try {
                        if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {                            
                            let datas = JSON.parse(Ajax.xhr.responseText)
                            const Prof = new Profile(datas, profileDiv, true)
                            Prof.profile()
                            Prof.profDetails()
                            document.querySelector('.key').value = uid
                        }
                    } catch(err) {
                        console.log(err)
                    }
                }
        }

    if(_classList.contains('nav-icons') && !_classList.contains('arrow-icon')) {
        icons.forEach(value => {
            value.classList.remove('active-icon')
        })
        _classList.add('active-icon')

        let centerDiv = document.querySelector('.center-div')

        // Timeline
        if(_classList.contains('sched-icon')) {
            if (window.innerWidth <= 768) {
                try {
                    let profileDiv = document.querySelector('.profile-div')
                    profileDiv.style.display = "none"
                    profileDiv.classList.remove('search-profile-div')
                    profileDiv.classList.remove('view-my-profile')
                } catch (err) {
                    console.log('')
                }
            }

            document.querySelector('.center-div').innerHTML = `
            <div class="inner-profile-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>`

            const _Timeline = new Timeline()
            _Timeline.today()
            
        } else if(_classList.contains('patient-icon')) {
            if (window.innerWidth <= 768) {
                try {
                    let profileDiv = document.querySelector('.profile-div')
                    profileDiv.style.display = "none"
                    profileDiv.classList.remove('search-profile-div')
                    profileDiv.classList.remove('view-my-profile')
                } catch (err) {
                    console.log('')
                }
            }

            document.querySelector('.center-div').innerHTML = `
            <div class="inner-profile-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>
            `

            // Patient Files
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/all/patient-files', '')
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if(Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        const PatientFile = new PatientFiles()
                        PatientFile.main(datas)
                    }
                } catch (err) {
                    console.log(err)
                }
            }

            // Notification
        } else if(_classList.contains('notif-icon')) {
            if(window.innerWidth <= 768) {
                try {
                    let profileDiv = document.querySelector('.profile-div')
                    profileDiv.style.display = "none"
                    profileDiv.classList.remove('search-profile-div')
                    profileDiv.classList.remove('view-my-profile')
                } catch(err) {
                    console.log('')
                }
            }

            const RenderDOM = new Render()
            RenderDOM.render(Notif.main(), centerDiv)

            document.querySelector('.n-content').innerHTML = `
                <div class="inner-profile-div">
                    <img src="/static/images/loader.svg" class="loader">
                </div>
            `   
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notifs', '')
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        document.querySelector('.n-content').innerHTML = ''
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        Notif.appendData(datas)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            // Chat
        } else if(_classList.contains('mail-icon')) {
            if (window.innerWidth <= 768) {
                try {
                    let profileDiv = document.querySelector('.profile-div')
                    profileDiv.style.display = "none"
                    profileDiv.classList.remove('search-profile-div')
                    profileDiv.classList.remove('view-my-profile')
                } catch (err) {
                    console.log('')
                }
            }

            const RenderDOM = new Render()
            RenderDOM.render(_Messages.main(), centerDiv)

            document.querySelector('.n-content').innerHTML = `
                    <div class="inner-profile-div">
                        <img src="/static/images/loader.svg" class="loader">
                    </div>
                `
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/messages', '')
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        _Messages.appendData(datas)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    if(_classList.contains('drop-contents')) {
        icons.forEach(value => {
            value.classList.remove('active-icon')
        })
    }

    if (_classList.contains('arrow-icon')) {
        dropdownDiv.style.display = "block"
    } else {
        dropdownDiv.style.display = "none"
    }

    if(_classList.contains('sign-out')) {
        window.location = '/u/sign/o'
    }
    
    if(_classList.contains('profile-link')) {
        try {
            const profileDiv = document.querySelector('.profile-div')
            profileDiv.classList.remove('search-profile-div')
            profileDiv.classList.add('view-my-profile')
            profileDiv.style.display = "block"
    

            const centerDiv = document.querySelector('.center-div')
            centerDiv.innerHTML = `
            <div class="inner-profile-div">
                <img src="/static/images/loader.svg" class="loader">
            </div>
        `
            const Ajax = new AjaxAPI()
            Ajax.post('/u/my/profile')
            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)
                        const Prof = new Profile(datas, profileDiv)
                        Prof.profile()
                        Prof.profDetails()
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } catch(err) {
            console.log()
        }
    }


    if(_classList.contains('add-patient-icon') || _classList.contains('add-patient-text')) {
        document.querySelector('.outer-modal-bg').style.display = "block"
        const PatientFile = new PatientFiles()
        PatientFile.loadForm()
    }
})

   try {
       let profileDiv = document.querySelector('.profile-div')

       if (window.innerWidth <= 768) {
           if (!profileDiv.classList.contains('search-profile-div') &&
               !profileDiv.classList.contains('view-my-profile')) {
                document.querySelector('.profile-div').style.display = "none"
            } else {
               document.querySelector('.profile-div').style.display = "block"
               document.querySelectorAll('.nav-icons').forEach(value => {
                   value.classList.remove('active-icon')
               })
            }

           window.addEventListener('scroll', () => {
               if (window.pageYOffset > 50) {
                   document.querySelector('.inner-left').style.height = "0px"
                   document.querySelector('.outer-nav').style.height = "50px"
                   document.querySelector('.search-div').style.display = "none"
               } else {
                   document.querySelector('.search-div').style.display = "block"
                   document.querySelector('.inner-left').style.height = "50px"
                   document.querySelector('.outer-nav').style.height = "100px"
               }
           })
       } else {
           document.querySelector('.outer-nav').style.height = "50px"
       }

       window.addEventListener('resize', () => {
           if (window.innerWidth <= 768) {
               document.querySelector('.outer-nav').style.height = "100px"
               document.querySelector('.inner-left').style.height = "100%"

               if (!profileDiv.classList.contains('search-profile-div') &&
                   !profileDiv.classList.contains('view-my-profile')) {
                   document.querySelector('.profile-div').style.display = "none"
               } else {
                   document.querySelector('.profile-div').style.display = "block"
               }

            //    window.addEventListener('scroll', () => {
            //        if (window.pageYOffset > 50) {
            //            document.querySelector('.inner-left').style.height = "0px"
            //            document.querySelector('.outer-nav').style.height = "50px"
            //            document.querySelector('.search-div').style.display = "none"
            //        } else {
            //            document.querySelector('.inner-left').style.height = "50px"
            //            document.querySelector('.outer-nav').style.height = "100px"
            //            document.querySelector('.search-div').style.display = "block"
            //        }
            //    })
           } else {
               document.querySelector('.outer-nav').style.height = "50px"
            //    window.addEventListener('scroll', () => {
            //        if (window.pageYOffset > 50) {
            //            document.querySelector('.inner-left').style.height = "0px"
            //            document.querySelector('.outer-nav').style.height = "50px"
            //            document.querySelector('.search-div').style.display = "none"
            //        } 
            //     //    else {
            //     //        document.querySelector('.inner-left').style.height = "50px"
            //     //        document.querySelector('.outer-nav').style.height = "100px"
            //     //        document.querySelector('.search-div').style.display = "block"
            //     //    }
            //    })
            
           }
       })
   } catch (err) {
       console.log('')
   }


