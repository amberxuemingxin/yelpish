const { connection } = require("../db_connection")
const { sha256hash } = require("../utils/hashing")

async function login(req, res) {
    const username = req.body.username
    const password = req.body.password

    connection.query(`
        select user_id, salt, salted_hashed_password
        from \`user\`
        where username = ?
    `,
        [username],
        async (err, data) => {
            if (err) {
                res.json({ error: err })
            } else if (data.length === 0) {
                // No account with the given username
                res.json({ user_id: null })
            } else {
                const user_id = data[0].user_id
                const salt = data[0].salt
                const salted_hashed_password = data[0].salted_hashed_password
                const input_salted_hashed_password = await sha256hash(password, salt)

                if (salted_hashed_password === input_salted_hashed_password) {
                    // Password match, login successful
                    res.json({ user_id: user_id })
                } else {
                    // Password mismatch, login failed
                    res.json({ user_id: null })
                }
            }
        }
    )
}

module.exports = login

 