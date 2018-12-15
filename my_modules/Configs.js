module.exports = class Config {
    constructor() {
        this.state = {
            session: {
                secret: 'f25fae2cbf2458d6f62c80f162cb14e43b202f0b9d9d9fa2dc62e829ed3190d9',
                resave: false,
                saveUninitialized: true,
                cookie: {}
            },

            mailer: {
                service: 'gmail',
                auth: {
                    user: 'phauxilium@gmail.com',
                    pass: 'Bsit4thYr;'
                }
            }
        }
    }
    
    getSession() {
        return this.state.session
    }

    getMailer() {
        return this.state.mailer
    }
}