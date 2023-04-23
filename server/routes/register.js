const { async_query } = require("../db_connection")
const { v4: uuidv4 } = require("uuid")
const { sha256hash } = require("../utils/hashing")
const { randomString } = require("../utils/random")
const { neo4jQueryIfUsing } = require("../neo4j_connection")

async function register(req, res) {

    const username = req.body.username
    const name = req.body.name
    const password = req.body.password

    const user_id = uuidv4()
    const salt = randomString(10)
    const salted_hashed_password = await sha256hash(password, salt)
    const yelp_since = new Date()

    const mysqlPromise = async_query(`
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
        [user_id, name, salt, salted_hashed_password, yelp_since, username]
    )

    const neo4jPromise = neo4jQueryIfUsing(
        `
                merge (n {user_id: $userId});
            `,
        {
            userId: user_id
        }
    )

    try {
        const [mysqlRes, neo4jRes] = await Promise.all([mysqlPromise, neo4jPromise])
        res.json({
            user_id: user_id
        })
    }
    catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') {
            // Duplicated username, account creation failed
            res.json({})
        }
        else if (err) {
            res.json({
                error: err
            })
        }
    }
}

module.exports = register
