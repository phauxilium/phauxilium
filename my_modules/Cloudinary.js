module.exports = class Cloudinary {
    constructor() {
        this.cloud = require('cloudinary')
    }

    getConfig() {
        this.cloud.config({ 
            cloud_name: 'dreyan', 
            api_key: '258787968151783', 
            api_secret: 'a676b67565c6767a676yWPDLvyrFatmQJA8RMAakQj4ks67d6767f676fe1' 
        })
    }
}