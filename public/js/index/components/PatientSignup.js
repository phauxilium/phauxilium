class PatientSignup{
    constructor() {
        this.state = {
            xhr: new XMLHttpRequest(),
            loading: document.createElement('span'),
            signInner: document.querySelector('.sign-inner'),
            nextBtn: document.getElementsByClassName('sign-btn'),
            signForm: document.querySelector('.sign-form'),
            elementIndex: 0,
        }
    }


    appendLoading() {
        let signBtnParent = this.state.nextBtn[0].parentElement

        signBtnParent.removeChild(this.state.nextBtn[0])

        this.state.loading.textContent = 'Loading...'

        signBtnParent.insertBefore(this.state.loading, signBtnParent.firstChild)
    }

    appendRemoveEl() {
        try {
            let signBtn = document.createElement('button')

            let signBtnParent = this.state.loading.parentElement

            this.state.loading.parentElement.removeChild(this.state.loading)
            signBtn.textContent = 'Submit'
            signBtn.className = 'sign-btn'
            signBtnParent.append(signBtn)
        } catch (err) {
            console.log(err)
        }
    }


    goBack() {
        let nextCont = document.querySelectorAll('.next-cont')
        if(this.state.elementIndex !== 0) {
            nextCont.forEach((value, index) => {
                if (value.classList.contains('active-cont')) {
                    value.classList.remove('active-cont')
                    this.state.elementIndex = index - 1
                }
                nextCont[this.state.elementIndex].classList.add('active-cont')

                if(nextCont.length - 1 === this.state.elementIndex)
                    this.state.nextBtn[0].textContent = 'Submit'
                else {
                    this.state.nextBtn[0].textContent = 'Next'
                    this.state.signInner.style.height = '480px'
                }
            })
        } else {
            let ChooseSign = new ChooseSignup()
            let RenderDOM = new Render()
            RenderDOM.render(ChooseSign.main(), this.state.signForm)

            this.state.signInner.style.height = '460px'
        }
    }

    submit(e) {
        e.preventDefault()
        let nextCont = document.querySelectorAll('.next-cont')

        if (this.state.nextBtn[0].textContent === 'Next') {
            this.state.xhr.open('POST', '/c/s/p', true)
            this.state.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

            let fname = e.target.elements.fname.value
            let mname = e.target.elements.mname.value
            let lname = e.target.elements.lname.value
           
            this.state.xhr.send(`uType=patient&fname=${fname}&mname=${mname}&lname=${lname}`)

            this.state.xhr.onreadystatechange = () => {
                if(this.state.xhr.readyState === 4 && this.state.xhr.status === 200) {
                    try {
                        let datas = JSON.parse(this.state.xhr.responseText)

                        let fnameHelper = document.querySelector('.fname-helper')
                        fnameHelper.textContent = datas.fnameErr ? datas.fnameErr : ''

                        let mnameHelper = document.querySelector('.mname-helper')
                        mnameHelper.textContent = datas.mnameErr ? datas.mnameErr : ''

                        let lnameHelper = document.querySelector('.lname-helper')
                        lnameHelper.textContent = datas.lnameErr ? datas.lnameErr : ''

                        if(!datas.fnameErr && !datas.mnameErr && !datas.lnameErr) {
                            if (this.state.elementIndex !== nextCont.length - 1) {
                                nextCont.forEach((value, index) => {
                                    if (value.classList.contains('active-cont')) {
                                        value.classList.remove('active-cont')
                                        this.state.elementIndex = index + 1
                                    }
                                })
                                nextCont[this.state.elementIndex].classList.add('active-cont')

                                if (nextCont.length - 1 === this.state.elementIndex) {
                                    this.state.nextBtn[0].textContent = 'Submit'
                                    this.state.signInner.style.height = '520px'
                                }
                                else 
                                    this.state.nextBtn[0].textContent = 'Next'
                            
                                } else {
                                this.state.elementIndex = nextCont.length - 1
                            }
                        }
                        
                    } catch(err) {
                        console.log(err)
                    }
                }
            }
        } else if (this.state.nextBtn[0].textContent === 'Submit') {

            this.appendLoading()

            this.state.xhr.open('POST', '/c/s/p', true)
            this.state.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            
            let fname = e.target.elements.fname.value
            let mname = e.target.elements.mname.value
            let lname = e.target.elements.lname.value
            let dob = e.target.elements.dob.value
            let gender = e.target.elements.gender.value
            let contact = e.target.elements.contact.value
            let address = e.target.elements.address.value
                
            this.state.xhr.send(`uType=patient&fname=${fname}&mname=${mname}&lname=${lname}&dob=${dob}&gender=${gender}&contact=${contact}&address=${address}`)

            this.state.xhr.onreadystatechange = () => {
                try {
                    if(this.state.xhr.readyState === 4 && this.state.xhr.status === 200) {
                        let datas = JSON.parse(this.state.xhr.responseText)

                        this.appendRemoveEl()

                        let dobHelper = document.querySelector('.dob-helper')
                        dobHelper.textContent = datas.dobErr ? datas.dobErr : ''

                        let genderHelper = document.querySelector('.gender-helper')
                        genderHelper.textContent = datas.genderErr ? datas.genderErr : ''

                        let contactHelper = document.querySelector('.contact-helper')
                        contactHelper.textContent = datas.contactErr ? datas.contactErr : ''

                        let addressHelper = document.querySelector('.address-helper')
                        addressHelper.textContent = datas.addressErr ? datas.addressErr : ''

                        let signupMessage = document.querySelector('.signup-message')

                        if(!datas.error) {
                            this.state.signInner.style.height = '530px'

                            this.appendLoading()

                            signupMessage.style.display = 'block'
                            signupMessage.style.backgroundColor = '#1976d2'
                            signupMessage.textContent = 'Signup complete'

                            setTimeout(() => {
                                signupMessage.style.display = 'none'

                                let SignIn = new Signin()
                                let RenderDOM = new Render()
                                RenderDOM.render(SignIn.main(), this.state.signForm)

                                this.state.signInner.style.height = '460px'
                            }, 3000)
                        } else if(datas.fireError) {
                            alert(datas.fireError)
                        }
                    
                    }
                } catch(err) {
                    console.log(err)
                }
            }
        }
    }

    main() {
        return ` <div class="patient-signup">
                            <span class="signup-message"></span>
                            <div class="next-cont active-cont">
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Firstname</label>
                                    <input type="text" name="fname" class="inputs" placeholder="Firstname">
                                    <span class="helper fname-helper"></span>
                                </div>
                        
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Middlename</label>
                                    <input type="text" name="mname" class="inputs" placeholder="Middle Name">
                                    <span class="helper mname-helper"></span>
                                </div>
                        
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Lastname</label>
                                    <input type="text" name="lname" class="inputs" placeholder="Lastname">
                                    <span class="helper lname-helper"></span>
                                </div>
                            </div>
                        
                            <div class="next-cont">
                                <div class="input-container col-6">
                                    <label class="label"><label class="asterisk">*</label> Birthdate</label>
                                    <input type="date" name="dob" class="inputs">
                                    <span class="helper dob-helper"></span>
                                </div>
                        
                                <div class="input-container col-6 gender-cont">
                                    <label class="label"><label class="asterisk">*</label> Gender</label>
                                    <select name="gender" class="inputs select">
                                        <option value="Male">Male</option>
                        
                                        <option value="Female">Female</option>
                                    </select>
                                    <span class="helper gender-helper"></span>
                                </div>
                        
                                <div class="input-container col-12">
                                    <label class="label"><label class="asterisk">*</label> Contact Number</label>
                                    <input type="text" name="contact" class="inputs" placeholder="Contact Number">
                                    <span class="helper contact-helper"></span>
                                </div>
                        
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Address</label>
                                    <input type="text" name="address" class="inputs" placeholder="Address">
                                    <span class="helper address-helper"></span>
                                </div>
                            </div>
                        
                        
                        
                            <div class="input-container">
                                <div class="col-6 forgot-div">
                                    <span>
                                        <a href="#" class="go-back">Go back</a>
                                    </span>
                                </div>
                        
                                <div class="col-6 sign-btn-div">
                                    <button class="sign-btn">Next</button>
                                </div>
                            </div>
                        </div>`
    }
}