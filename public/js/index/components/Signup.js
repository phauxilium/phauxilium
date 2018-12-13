class Signup {


    submit(e) {
        e.preventDefault()
        alert('hi')
    }

    main() {
        return `<div class="signup-div">
                        <div class="input-container">
                            <label class="label">Email</label>
                            <input type="text" name="emailSignup" class="inputs" placeholder="example@example.com">
                            <span class="helper email-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <label class="label">Password</label>
                            <input type="password" name="passwordSignup" class="inputs" placeholder="Password">
                            <span class="helper password-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <label class="label">Confirm Password</label>
                            <input type="password" name="cpasswordSignup" class="inputs" placeholder="Confirm Password">
                            <span class="helper cpassword-helper-signup"></span>
                        </div>

                        <div class="input-container">
                            <span class="col-6 remember-me">
                                <a href="#" class="sign-in-link">Sign-in</a>
                            </span>

                            <div class="col-6 sign-btn-div">
                                <button class="sign-btn">Sign-up</button> <br />
                            </div>
                        </div>
                    </div>`
    }
}