module.exports = class Config {
    constructor() {
        this.state = {
            session: {
                secret: 'f25fae2cbf2458d6f62c80f162cb14e43b202f0b9d9d9fa2dc62e829ed3190d9',
                resave: false,
                saveUninitialized: true,
                cookie: {}
            }
        }
    }

    setSession(env, param) {
        if (env === 'production') {
            param.set('trust proxy', 1)
            this.state.session.cookie.secure = true
        }
    }
    
    getSession() {
        return this.state.session
    }
}