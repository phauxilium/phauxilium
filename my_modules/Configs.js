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
                host: 'smtp.gmail.com',
                port: '465',
                secure: true,
                auth: {
                    user: 'phauxilium@gmail.com',
                    pass: 'Bsit4thYr;'
                }
            },

            mailOptions: {
                from: 'phauxilium@gmail.com',
                to: '',
                subject: 'Account Verfication',
                html: ''
            }
        }
    }
    
    getSession() {
        return this.state.session
    }

    getMailer() {
        return this.state.mailer
    }

    getMailOptions(to, html) {
        this.state.mailOptions.to = to
        this.state.mailOptions.html = html
        return this.state.mailOptions
    }
}