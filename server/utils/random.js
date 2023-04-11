const { randomBytes } = require("node:crypto")

function randomString(length) {
    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

module.exports = { randomString }
