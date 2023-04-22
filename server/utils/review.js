const { connection, async_query } = require("../db_connection")


/**
 * Get the complete review object for each review_id in the review_ids
 * 
 * @param {Array<string>} review_ids 
 * @param {string} user_id_ Optional, used to determine the user_useful/user_funny/
 *                          user_cool fields. If not provided, they will be false by default
 * @returns {Array<object}
 */
async function getReviewObjects(review_ids, user_id_) {
    if (!review_ids || review_ids.length === 0) {
        return []
    }

    const user_id = user_id_ ?? "<IMPOSSIBLE-USER>"

    const review_info = await async_query(
        `
        with selected_reviews as (
            select
                *
            from
                review
            where
                review_id in (?)
        ),
        attitude_info as (
            select
                s.review_id,
                sum(if(r.attitude_type = 'useful', 1, 0)) as useful_count,
                sum(if(r.attitude_type = 'funny', 1, 0)) as funny_count,
                sum(if(r.attitude_type = 'cool', 1, 0)) as cool_count,
                sum(if(r.attitude_type = 'useful' and r.attitude_user_id = ?, 1, 0)) as user_useful,
                sum(if(r.attitude_type = 'funny' and r.attitude_user_id = ?, 1, 0)) as user_funny,
                sum(if(r.attitude_type = 'cool' and r.attitude_user_id = ?, 1, 0)) as user_cool
            from
                selected_reviews s
                left outer join review_attitude r
                on s.review_id = r.review_id
            group by
                s.review_id
        )
            select
                s.review_id,
                s.user_id as review_user_id,
                u.name as review_user_name,
                s.stars,
                s.date,
                s.text,
                a.useful_count,
                a.funny_count,
                a.cool_count,
                a.user_useful,
                a.user_funny,
                a.user_cool
            from
                selected_reviews s
                inner join \`user\` u
                on s.user_id = u.user_id
                inner join attitude_info a
                on s.review_id = a.review_id
        `,
        [review_ids, user_id, user_id, user_id]
    )

    return review_info
}

module.exports = { getReviewObjects }