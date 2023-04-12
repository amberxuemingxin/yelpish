const { async_query } = require("../db_connection")
const { getReviewObjects } = require("../utils/review")

async function reviews(req, res) {
    const business_id = req.params.business_id
    const user_id = req.body.user_id

    const review_ids = (await async_query(
        `
            select
                review_id
            from 
                review
            where
                business_id = ?
        `,
        [business_id]
    )).map(obj => obj.review_id)

    res.json({
        reviews: await getReviewObjects(review_ids, user_id)
    })
}

module.exports = reviews