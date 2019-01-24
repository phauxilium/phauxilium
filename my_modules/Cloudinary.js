module.exports = class Cloudinary {
    constructor() {
        this.cloud = require('cloudinary')
    }

    getCloud() {
        return this.cloud
    }

    getConfig() {
        this.cloud.config({ 
            cloud_name: 'dreyan', 
            api_key: '258787968151783', 
            api_secret: '6yWPDLvyrFatmQJA8RMAakQj4ks' 
        })
    }
}