const { async_query } = require("../db_connection")
const { getReviewObjects } = require("../utils/review")
const { neo4jSession, neo4jDriver, neo4jQuery } = require("../neo4j_connection")
const { USE_NEO4J } = require("../process_env")

async function find_friend(req, res) {
    const login_user_id = req.query.login_user_id
    const target_username = req.query.target_username

    const target_user_result = await async_query(
        `select
            user_id,
            name
        from
            \`user\`
        where
            username = ?
        `,
        [target_username]
    )

    if (target_user_result.length === 0) {
        res.json({})
        return
    }

    const target_user_id = target_user_result[0].user_id

    if (!USE_NEO4J) {
        res.json({
            user_id: target_user_id,
            user_name: target_user_result[0].name,
            current_hop: null,
            // Showing they are friends by default
            // to disallow adding friends, because neo4j isn't available
            is_friend: true
        })
        return
    }

    const friends_response = (await neo4jQuery(
        `match p = shortestPath(({user_id: $loginUserId}) - [*..3] - ({user_id: $targetUserId})) return length(p);`,
        { loginUserId: login_user_id, targetUserId: target_user_id }
    ))

    if (friends_response.records && friends_response.records.length !== 0) {
        const friends_length = friends_response.records[0]._fields[0].low

        res.json({
            user_id: target_user_id,
            user_name: target_user_result[0].name,
            current_hop: friends_length - 1,
            // Showing they are friends by default
            // to disallow adding friends, because neo4j isn't available
            is_friend: friends_length === 1
        })
    } else {
        res.json({
            user_id: target_user_id,
            user_name: target_user_result[0].name,
            current_hop: null,
            // Showing they are friends by default
            // to disallow adding friends, because neo4j isn't available
            is_friend: false
        })
    }
}

module.exports = find_friend
