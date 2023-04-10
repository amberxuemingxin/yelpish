const { randomBytes } = require("node:crypto")

function randomString(length) {
    return randomBytes(length).toString('hex')
}

module.exports = { randomString }
