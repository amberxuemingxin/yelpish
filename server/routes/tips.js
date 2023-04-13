const { async_query } = require("../db_connection");

async function getTips(req, res) {
  const business_id = req.params.business_id;

  const query = `
    SELECT
      t.tip_id,
      u.name AS tip_user_name,
      t.date,
      t.text
    FROM
      tip t
      INNER JOIN user u ON t.user_id = u.user_id
    WHERE
      t.business_id = ?
    ORDER BY
      t.date DESC
  `;

  try {
    const tips = await async_query(query, [business_id]);
    res.json({ tips });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve tips.", errorString: err.toString() });
  }
}

module.exports = getTips;