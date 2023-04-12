const { async_query } = require("../db_connection");
const { getBusinessObjects } = require("../utils/business");

async function business(req, res) {
  try {
    const businessId = req.params.business_id;
    res.json(
      (await getBusinessObjects([businessId]))[0]
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve business details.", errorString: err.toString() });
  }
}

module.exports = business;
