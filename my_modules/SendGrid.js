module.exports = class SendGrid {
    constructor() {
        this.state = {
            APIkey: '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',
            message: {
                to: '',
                from: '<no-reply@auxiliumph>',
                subject: 'Account Verification',
                html: '',
            }            
        }
    }

    getAPI() {
        return this.state.APIkey
    }

    setMail(to, html) {
        this.state.message.to = to
        this.state.message.html = html
    }

    getMail() {
        return this.state.message
    }
}