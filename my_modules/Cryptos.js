module.exports = class Cryptos {
    constructor() {
        this.crypto = require('crypto')
        this.algorithm = 'aes256'
        this.secret = 'fc527c3fdf5905f1cc03b80529238c9d20bfba6d68110649bfe4f167e207b51c'
    }

    encrypt(param) {
        const cipher = this.crypto.createCipher(this.algorithm, this.secret)

        let encrypted = cipher.update(param, 'utf8', 'hex')

        encrypted += cipher.final('hex')

        return encrypted
    }

    decrypt(param, cb) {
        try {
            const decipher = this.crypto.createDecipher(this.algorithm, this.secret)

            let decrypted = decipher.update(param, 'hex', 'utf8')

            decrypted += decipher.final('utf8')

            cb(null, decrypted)
        } catch(err) {
            cb(`Err`)
        }
    }
}