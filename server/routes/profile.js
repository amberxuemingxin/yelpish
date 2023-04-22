const { async_query } = require("../db_connection")
const { getReviewObjects } = require("../utils/review")
const { neo4jSession, neo4jDriver, neo4jQuery } = require("../neo4j_connection")
const { USE_NEO4J } = require("../process_env")

async function profile(req, res) {

    const user_id = req.params.user_id

    const user_info_promise = async_query(
        `
            select
                \`name\`,
                username
            from 
                \`user\`
            where
                user_id = ?
            `,
        [user_id]
    )

    const review_info_promise = (
        async () => {
            const review_ids = (await async_query(
                `
                select
                    review_id
                from
                    review
                where
                    user_id = ?
                `,
                [user_id]
            )).map(obj => obj.review_id)

            return getReviewObjects(review_ids, user_id)
        }
    )()

    const friends_info_promise = USE_NEO4J ?
        (async () => {
            const friends_user_ids = (await neo4jQuery(
                `match (n {user_id: $userId}) - [] - (m)  return m.user_id;`,
                { userId: user_id }
            )).records.map(x => x._fields[0])

            if (friends_user_ids.length === 0) {
                return []
            }

            const friends_info = (await async_query(
                `
                    select
                        user_id,
                        name
                    from
                        \`user\`
                    where
                        user_id in (?)
                `,
                [friends_user_ids]
            ))

            return Object.values(friends_info)
        })()
        : (async () => { })() // Not using neo4j

    try {
        const [user_info, review_info, friends_info] = await Promise.all([
            user_info_promise,
            review_info_promise,
            friends_info_promise
        ])

        res.json({
            id: user_id,
            name: user_info[0].name,
            username: user_info[0].username,
            reviews: review_info,
            friends_info: friends_info
        })

    } catch (err) {
        res.json({
            error: err,
            errorString: err.toString()
        })
    }
}

module.exports = profile
