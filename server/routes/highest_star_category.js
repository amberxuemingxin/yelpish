const { connection, async_query } = require("../db_connection")


async function highest_star_category_review_count(req, res) {
    const result = await async_query(
        `
        WITH temp AS (
            -- calculate each business' average stars
            SELECT b.business_id, b.name, AVG(r.stars) AS stars
            FROM business b JOIN business_categories bc on b.business_id = bc.business_id
            JOIN review r on b.business_id = r.business_id
            GROUP BY b.business_id, b.name
          )
          -- find the category with the highest stars and its total review count
          SELECT bc.category, COUNT(review_id) AS reveiw_count
          FROM temp JOIN business_categories bc ON temp.business_id = bc.business_id
              JOIN review r ON temp.business_id = r.business_id
          WHERE temp.stars >= ALL (
            SELECT stars
            FROM temp
          )
          GROUP BY bc.category
          ORDER BY reveiw_count DESC, bc.category ASC
          limit 10
          ;
        `
    )

    res.json({
        categories: Object.values(result)
    })
}

module.exports = highest_star_category_review_count

