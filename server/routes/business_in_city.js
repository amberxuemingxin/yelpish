const { connection, async_query } = require("../db_connection")


async function business_in_city_lowest_review(req, res) {
    const result = await async_query(
        `
        WITH t1 AS (
            WITH temp AS (
                SELECT u.user_id, u.username, AVG(r.stars) AS stars
                FROM user u JOIN review r on u.user_id = r.user_id
                GROUP BY u.user_id, u.username
            )
            SELECT b.city
            FROM temp JOIN review r ON temp.user_id = r.user_id
                JOIN business b on r.business_id = b.business_id
            WHERE temp.stars <= ALL (
                SELECT stars
                FROM temp
            )
            GROUP BY b.city
        )
        SELECT b.business_id,  b.name,  b.city, AVG(r2.stars) AS avg_stars
        FROM business b JOIN t1 ON b.city = t1.city
            JOIN review r2 on b.business_id = r2.business_id
        GROUP BY b.business_id,  b.name,  b.city
        ORDER BY avg_stars DESC, b.name ASC
        limit 10
        ;
        `
    )

    res.json({
        businesses: Object.values(result)
    })
}

module.exports = business_in_city_lowest_review