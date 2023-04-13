const { pbkdf2 } = require("crypto")

async function sha256hash(secret, salt) {
    return new Promise((resolve, reject) => {
        pbkdf2(secret, salt, 1000, 64, "sha256", (err, key) => {
            if (err) { reject(err) }
            else { resolve(key.toString('hex')) }
        })

    })
}

module.exports = { sha256hash }

