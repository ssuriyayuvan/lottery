const crypto = require('crypto');
const key = '___containsix___';
const iv = Buffer.from(key);

const helper = () => {
    return {
        encrypt() {
            let data = 'suriya'
            let hash = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
            let cipher = crypto.createCipheriv('aes-256-ctr', hash, iv)
            let secret = cipher.update(data, 'utf8', 'hex')
            secret += cipher.final('hex');
            // return secret;
            return res.send(secret)
        },

        decrypt() {
            let hash = crypto.createHash('sha256').update(key).digest('base64').substr(0, 32);
            let cipher = crypto.createDecipheriv('aes-256-ctr', hash, iv)
            let secret = cipher.update(data, 'hex', 'utf8')
            secret += cipher.final('utf8');
            return req.send(secret);
        }
    }
}

module.exports = helper()