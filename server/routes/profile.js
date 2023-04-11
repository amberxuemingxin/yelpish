const { async_query } = require("../db_connection")

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

    const review_info_promise = async_query(
        `
        with user_reviews as (
            select
                *
            from
                review
            where
                user_id = ?
        ),
        attitude_counts as (
            select
                u.review_id,
                sum(if(attitude_type = 'useful', 1, 0)) as useful_count,
                sum(if(attitude_type = 'funny', 1, 0)) as funny_count,
                sum(if(attitude_type = 'cool', 1, 0)) as cool_count
            from
                user_reviews u
                left outer join review_attitude a
                on u.review_id = a.review_id
            group by
                u.review_id
        )
            select
                r.review_id,
                r.user_id as review_user_id,
                u.name as review_user_name,
                r.stars,
                r.date,
                r.text,
                c.useful_count,
                c.funny_count,
                c.cool_count,
                false as user_useful, -- We don't allow users to express attitudes
                false as user_funny,  -- to their own reviews
                false as user_cool
            from
                user_reviews r
                inner join \`user\` u
                on r.user_id = u.user_id
                inner join attitude_counts c
                on r.review_id = c.review_id
        `,
        [user_id]
    )

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
