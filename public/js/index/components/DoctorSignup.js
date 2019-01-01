class DoctorSignup extends PatientSignup {
    constructor(state) {
        super(state)
    }

    agreementClick() {
        document.querySelector('.agreement').addEventListener('click', () => {
            window.open('/terms-and-condition')
        })
    }

    changeContainer() {
        let nextCont = document.querySelectorAll('.next-cont')
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
            } else if (nextCont.length - 2 === this.state.elementIndex)
                this.state.signInner.style.height = '520px'
            else {
                this.state.nextBtn[0].textContent = 'Next'
                this.state.signInner.style.height = '480px'
            }
        }
    }
    
    submit(e) {
        e.preventDefault()

            let nextCont = document.querySelector('.next-cont')

            let auth = {
                fname: e.target.elements.fname.value,
                mname: e.target.elements.mname.value,
                lname: e.target.elements.lname.value,
                dob: e.target.elements.dob.value,
                gender: e.target.elements.gender.value,
                contact: e.target.elements.contact.value,
                address: e.target.elements.address.value,
                cAddress: e.target.elements.cAddress.value,
                cContact: e.target.elements.cContact.value,
                prc: e.target.elements.prc.value,
                agreement: e.target.elements.agreement.checked
            }
            
        if (this.state.elementIndex === 0) {

            const Ajax = new AjaxAPI()
            Ajax.post('/c/s/p', `uType=doctor&fname=${auth.fname}&mname=${auth.mname}&lname=${auth.lname}`)
            
            Ajax.xhr.onreadystatechange = () => {
                if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                    try {
                        let datas = JSON.parse(Ajax.xhr.responseText)

                        let fnameHelper = document.querySelector('.fname-helper')
                        fnameHelper.textContent = datas.fnameErr ? datas.fnameErr : ''

                        let mnameHelper = document.querySelector('.mname-helper')
                        mnameHelper.textContent = datas.mnameErr ? datas.mnameErr : ''

                        let lnameHelper = document.querySelector('.lname-helper')
                        lnameHelper.textContent = datas.lnameErr ? datas.lnameErr : ''

                        if (!datas.fnameErr && !datas.mnameErr && !datas.lnameErr) 
                            this.changeContainer()
                         
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        } else if (this.state.elementIndex === 1) {

            const Ajax = new AjaxAPI()
            Ajax.post('/c/s/p', `uType=doctor&fname=${auth.fname}&mname=${auth.mname}&lname=${auth.lname}&dob=${auth.dob}&gender=${auth.gender}&contact=${auth.contact}&address=${auth.address}`)

            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {
                        let datas = JSON.parse(Ajax.xhr.responseText)

                        let dobHelper = document.querySelector('.dob-helper')
                        dobHelper.textContent = datas.dobErr ? datas.dobErr : ''

                        let genderHelper = document.querySelector('.gender-helper')
                        genderHelper.textContent = datas.genderErr ? datas.genderErr : ''

                        let contactHelper = document.querySelector('.contact-helper')
                        contactHelper.textContent = datas.contactErr ? datas.contactErr : ''

                        let addressHelper = document.querySelector('.address-helper')
                        addressHelper.textContent = datas.addressErr ? datas.addressErr : ''

                        if (!datas.dobErr && !datas.genderErr && !datas.contactErr && !datas.addressErr)
                            this.changeContainer()
                      
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } else if (this.state.elementIndex === 2) {

            this.appendLoading()

            const Ajax = new AjaxAPI()
            Ajax.post('/c/s/p', `uType=doctor&fname=${auth.fname}&mname=${auth.mname}&lname=${auth.lname}&dob=${auth.dob}&gender=${auth.gender}&contact=${auth.contact}&address=${auth.address}&cAddress=${auth.cAddress}&cContact=${auth.cContact}&prc=${auth.prc}&agreement=${auth.agreement}`)

            Ajax.xhr.onreadystatechange = () => {
                try {
                    if (Ajax.xhr.readyState === 4 && Ajax.xhr.status === 200) {

                        this.appendRemoveEl()

                        let datas = JSON.parse(Ajax.xhr.responseText)

                       document.querySelector('.c-address-helper').textContent = datas.cAddressErr ? datas.cAddressErr : ''

                        document.querySelector('.c-contact-helper').textContent = datas.cContactErr ? datas.cContactErr : ''

                        document.querySelector('.prc-helper').textContent = datas.prcErr ? datas.prcErr : ''

                        document.querySelector('.agreement-helper').textContent = datas.agreementErr ? datas.agreementErr : ''

                        let signupMessage = document.querySelector('.signup-message')
            
                        if(!datas.prcErr) {
                            if (!datas.cAddressErr && !datas.cContactErr && !datas.prcErr && !datas.agreementErr) {
                                this.appendLoading()
                                this.state.elementIndex = 0

                                this.state.signInner.style.height = '550px'

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

                                document.querySelector('.emai').focus()

                            } else if (datas.fireError) {
                                alert(datas.fireError)
                            }
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    main() {
        return ` <div class="doctor-signup">
                            <span class="signup-message"></span>

                            <!-- First Index Container -->
                            <div class="next-cont active-cont">
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Firstname</label>
                                    <input type="text" name="fname" class="inputs fname" placeholder="Firstname">
                                    <span class="helper fname-helper"></span>
                                </div>
                        
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Middle name</label>
                                    <input type="text" name="mname" class="inputs" placeholder="Middle Name">
                                    <span class="helper mname-helper"></span>
                                </div>
                        
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Lastname</label>
                                    <input type="text" name="lname" class="inputs" placeholder="Lastname">
                                    <span class="helper lname-helper"></span>
                                </div>
                            </div>

                            
                            <!-- Second Index Container -->
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


                            <!-- Thir Index Container  -->
                            <div class="next-cont">
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Clinic address</label>
                                    <input type="text" name="cAddress" class="inputs" placeholder="Clinic address">
                                    <span class="helper c-address-helper"></span>
                                </div>

                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> Clinic contact number</label>
                                    <input type="text" name="cContact" class="inputs" placeholder="Clinic contact number">
                                    <span class="helper c-contact-helper"></span>
                                </div>
                            
                                <div class="input-container">
                                    <label class="label"><label class="asterisk">*</label> PRC License number</label>
                                    <input type="text" name="prc" class="inputs" placeholder="PRC License number">
                                    <span class="helper prc-helper"></span>
                                </div>

                                <div class="input-container">
                                    <label class="container-check"><span class="agreement">I accept the Terms and Condition</span>
                                        <input type="checkbox" name="agreement">
                                        <span class="checkmark-check"></span>
                                    </label>
                                        <span class="helper agreement-helper"></span>
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