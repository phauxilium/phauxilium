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