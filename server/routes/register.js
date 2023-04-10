const connection = require("../db_connection")
const { v4: uuidv4 } = require("uuid")
const { sha256hash } = require("../utils/hashing")
const { randomString } = require("../utils/random")

async function register(req, res) {

    const username = req.body.username
    const name = req.body.name
    const password = req.body.password

    const user_id = uuidv4()
    const salt = randomString(10)
    const salted_hashed_password = await sha256hash(password, salt)
    const yelp_since = new Date()

    connection.query(`
        insert into \`user\`
        (
            user_id,
            \`name\`,
            salt,
            salted_hashed_password,
            yelp_since,
            username
        )
        values
        (
            ?, ?, ?, ?, ?, ?
        )
    `,
        [user_id, name, salt, salted_hashed_password, yelp_since, username],
        (err, data) => {
            if (err && err.code === 'ER_DUP_ENTRY') {
                // Duplicated username, account creation failed
                res.json({})
            }
            else if (err) {
                res.json({
                    error: err
                })
            } else {
                res.json({
                    user_id: user_id
                })
            }
        }
    )
}

module.exports = register
