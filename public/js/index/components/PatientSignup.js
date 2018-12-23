class PatientSignup extends Signin {
    constructor(state) {
        super(state)
        this.elementIndex = 0
    }
    goBack() {
        let nextBtn = document.querySelector('.sign-btn')
        let nextCont = document.querySelectorAll('.next-cont')
        if(this.elementIndex !== 0) {
            nextCont.forEach((value, index) => {
                if (value.classList.contains('active-cont')) {
                    value.classList.remove('active-cont')
                    this.elementIndex = index - 1
                }
                nextCont[this.elementIndex].classList.add('active-cont')

                if(nextCont.length - 1 === this.elementIndex)
                    nextBtn.textContent = 'Submit'
                else
                    nextBtn.textContent = 'Next'
            })
        } else {
            let signForm = document.querySelector('.sign-form')

            let ChooseSign = new ChooseSignup()
            let RenderDOM = new Render()
            RenderDOM.render(ChooseSign.main(), signForm)
    
            let signInner = document.querySelector('.sign-inner')
            signInner.style.height = '460px'
        }
    }

    submit(e) {
        e.preventDefault()
        let nextBtn = document.querySelector('.sign-btn')
        let nextCont = document.querySelectorAll('.next-cont')

        if (nextBtn.textContent === 'Next') {
            this.state.xhr.open('POST', '/c/v', true)
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

                        // --------- TODO Submit Everything -------------
                        if(!datas.fnameErr && !datas.mnameErr && !datas.lnameErr) {
                            if (this.elementIndex !== nextCont.length - 1) {
                                nextCont.forEach((value, index) => {
                                    if (value.classList.contains('active-cont')) {
                                        value.classList.remove('active-cont')
                                        this.elementIndex = index + 1
                                    }
                                })
                                nextCont[this.elementIndex].classList.add('active-cont')

                                if (nextCont.length - 1 === this.elementIndex)
                                    nextBtn.textContent = 'Submit'
                                else
                                    nextBtn.textContent = 'Next'
                            } else {
                                this.elementIndex = nextCont.length - 1
                            }
                        }
                        
                    } catch(err) {
                        console.log(err)
                    }
                }
            }
        } else if (nextBtn.textContent === 'Submit') {
            alert('hi')
        }
    }

    main() {
        return `<div class="patient-signup">
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
                                    <input type="date" name="dob" class="inputs" placeholder="Firstname">
                                    <span class="helper dob-helper"></span>
                                </div>
                        
                                <div class="input-container col-6">
                                    <label class="label"><label class="asterisk">*</label> Gender</label>
                                    <select name="gender" class="inputs select">
                                        <option value="Male">Male</option>
                        
                                        <option value="Female">Female</option>
                                    </select>
                                    <span class="helper gender-helper"></span>
                                </div>
                        
                                <div class="input-container">
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
                                        <a href="#" class="go-back" type="submit">Go back</a>
                                    </span>
                                </div>
                        
                                <div class="col-6 sign-btn-div">
                                    <button class="sign-btn">Next</button>
                                </div>
                            </div>
                        </div>`
    }
}