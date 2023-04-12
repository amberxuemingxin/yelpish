const { async_query } = require("../db_connection");

async function business(req, res) {
  const businessId = req.params.business_id;

  const query = `
    SELECT
        b.name,
        c.category,
        r.stars AS rating,
        b.state,
        b.city,
        b.address,
        b.monday_start,
        b.monday_end,
        b.tuesday_start,
        b.tuesday_end,
        b.wednesday_start,
        b.wednesday_end,
        b.thursday_start,
        b.thursday_end,
        b.friday_start,
        b.friday_end,
        b.saturday_start,
        b.saturday_end,
        b.sunday_start,
        b.sunday_end
    FROM
        business b
        LEFT JOIN business_categories c ON b.business_id = c.business_id
        LEFT JOIN review r ON b.business_id = r.business_id
    WHERE b.business_id = ?;
  `;

  try {
    const result = await async_query(query, [businessId]);

    if (result.length === 0) {
      res.status(404).json({ error: "Business not found." });
      return;
    }

    const business = {
      name: result[0].name,
      categories: result.map((row) => row.category),
      rating: result[0].rating,
      state: result[0].state,
      city: result[0].city,
      address: result[0].address,
      monday_start: result[0].monday_start,
      monday_end: result[0].monday_end,
      tuesday_start: result[0].tuesday_start,
      tuesday_end: result[0].tuesday_end,
      wednesday_start: result[0].wednesday_start,
      wednesday_end: result[0].wednesday_end,
      thursday_start: result[0].thursday_start,
      thursday_end: result[0].thursday_end,
      friday_start: result[0].friday_start,
      friday_end: result[0].friday_end,
      saturday_start: result[0].saturday_start,
      saturday_end: result[0].saturday_end,
      sunday_start: result[0].sunday_start,
      sunday_end: result[0].sunday_end,
    };

    res.json(business);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve business details.", errorString: err.toString() });
  }
}

module.exports = business;
