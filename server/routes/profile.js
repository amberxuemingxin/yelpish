const { async_query } = require("../db_connection")
const { getReviewObjects } = require("../utils/review")

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

            return getReviewObjects(review_ids)
        }
    )()


    try {
        const [user_info, review_info] = await Promise.all([
            user_info_promise,
            review_info_promise
        ])

        res.json({
            id: user_id,
            name: user_info[0].name,
            username: user_info[0].username,
            reviews: review_info,
            // TODO: friends_info
        })

    } catch (err) {
        res.json({
            error: err,
            errorString: err.toString()
        })
    }
}

module.exports = profile
