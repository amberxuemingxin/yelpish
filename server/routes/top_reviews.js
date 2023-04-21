const { connection, async_query } = require("../db_connection")


async function top_reviews(req, res) {
    const business_id = req.params.business_id
    const lastNDays = parseInt(req.query.lastNday ?? '1000')

    const result = await async_query(
        `
        WITH max_date AS (
            SELECT
                MAX(date) AS latest_date
            FROM
                review
        ),
        recent_reviews AS (
            SELECT
                user_id,
                review_id,
                date
            FROM
                review INNER JOIN business b on review.business_id = b.business_id
            WHERE
                date >= (SELECT DISTINCT date
                FROM review
                ORDER BY date DESC
                LIMIT 1 OFFSET ?)
            AND b.business_id = ?
            GROUP BY user_id
        ),
        top_users AS (
            SELECT
                r.user_id,
                COUNT(CASE WHEN ra.attitude_type = 'useful' THEN 1 END) AS useful_count,
                COUNT(CASE WHEN ra.attitude_type = 'funny' THEN 1 END) AS funny_count,
                COUNT(CASE WHEN ra.attitude_type = 'cool' THEN 1 END) AS cool_count
            FROM
                recent_reviews r INNER JOIN review_attitude ra
                    ON r.review_id = ra.review_id
            GROUP BY
                user_id
            LIMIT 5
        )
        SELECT
            u.user_id,
            u.username,
            u.name AS display_name,
            (t.cool_count + t.funny_count + t.useful_count) AS total_reviews
        FROM  top_users t
            INNER JOIN user u
                ON t.user_id = u.user_id
        GROUP BY u.user_id;	
        `,
        [lastNDays, business_id]
    )

    res.json({
        user_info: Object.values(result)
    })
}


module.exports = top_reviews
