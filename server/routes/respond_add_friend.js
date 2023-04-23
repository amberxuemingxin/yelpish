const { async_query } = require("../db_connection")
const { neo4jQuery } = require("../neo4j_connection")

async function respond_add_friend(req, res) {
    const login_user_id = req.body.user_id
    const request_user_id = req.body.request_user_id
    const accept = req.body.accept

    const mysqlPromise = async_query(
        `
        delete from
            friend_request
        where
            request_user_id = ?
            and target_user_id = ?
        `
        ,
        [request_user_id, login_user_id]
    )


    const neo4jPromise = accept ? neo4jQuery(
        `
        match (a {user_id: $loginUserId})
        optional match (b {user_id: $targetUserId})
        where b is not null
        with a, b
        merge (a) - [:friend] -> (b)
        `,
        { loginUserId: login_user_id, targetUserId: request_user_id }
    ) : (async () => { })()

    try {
        await Promise.all([mysqlPromise, neo4jPromise])
        res.json({})
    } catch (err) {
        res.json({
            error: err,
            errorString: err.toString()
        })
    }

}

module.exports = respond_add_friend
