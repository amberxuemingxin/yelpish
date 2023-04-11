const { async_query } = require("../db_connection");

async function recommendation(req, res) {
  const longitude = parseFloat(req.query.longitude) || null;
  const latitude = parseFloat(req.query.latitude) || null;

  let query = `
                SELECT
                    b.business_id AS id,
                    b.name,
                    c.category,
                    AVG(r.stars) AS rating
    `;

  if (longitude && latitude) {
    query += `
        ,
        (ROUND(
            6371 * acos(
            cos(radians(?)) * cos(radians(b.latitude)) *
            cos(radians(b.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(b.latitude))
            ),2)
        ) AS distance
    `;
  }

  query += `
    FROM business b
        INNER JOIN business_categories c ON b.business_id = c.business_id
        INNER JOIN review r ON b.business_id = r.business_id
    WHERE
        b.is_open = 1
    GROUP BY
        b.business_id
    ORDER BY
        rating DESC
    LIMIT 10
  `;

  try {
    const businesses = await async_query(
      query,
      longitude && latitude ? [latitude, longitude, latitude] : []
    );

    const formattedBusinesses = businesses.map((business) => {
      return {
        ...business,
        distance: longitude && latitude ? business.distance : null,
      };
    });

    res.json({ businesses: formattedBusinesses });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve recommendations.", errorString: err.toString() });
  }
}

module.exports = recommendation;