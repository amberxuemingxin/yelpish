const { async_query } = require("../db_connection")
const { neo4jQuery } = require("../neo4j_connection")
const { USE_NEO4J } = require("../process_env")

async function respond_add_friend(req, res) {
    if (!USE_NEO4J) {
        res.json({
            success: false
        })

        return;
    }
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
        merge (a {user_id: $loginUserId})
        merge (b {user_id: $targetUserId})
        merge (a) - [:friend] -> (b)
        `,
        { loginUserId: login_user_id, targetUserId: request_user_id }
    ) : (async () => { })()

    try {
        await Promise.all([mysqlPromise, neo4jPromise])
        res.json({
            success: true
        })
    } catch (err) {
        res.json({
            error: err,
            errorString: err.toString()
        })
    }

}

module.exports = respond_add_friend
