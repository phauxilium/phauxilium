module.exports = class FireAdmin {
    constructor() {
        this.firebase = require('firebase-admin')
        this.firebaseSDK = require('../config/firebasesdk.json')
    }

    fireConnect() {
        this.firebase.initializeApp({
            credential: this.firebase.credential.cert(this.firebaseSDK),
            databaseURL: 'https://ax-project-f6c66.firebaseio.com'
        })        
    }
}