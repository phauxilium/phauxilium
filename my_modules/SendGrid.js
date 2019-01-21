module.exports = class SendGrid {
    constructor() {
        this.state = {
            APIkey: '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',
            sgMail: require('@sendgrid/mail'),
            message: {
                to: '',
                from: 'Auxilium PH <connect@auxilium.live>',
                subject: 'Account Verification',
                html: '',
            }            
        }
    }

    getApi() {
        return this.state.sgMail.setApiKey(this.state.APIkey)
    }

    setMail(to, html) {
        this.state.message.to = to
        this.state.message.html = html
    }

    getMail() {
        return this.state.message
    }

    sendMail(message, cb) {
        this.state.sgMail.send(message)
            .then(() => {
                cb(null)
            })
            .catch((err) => {
                cb(err)
            })
    }
}