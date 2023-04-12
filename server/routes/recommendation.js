const { async_query } = require("../db_connection");
const { getBusinessObjects } = require("../utils/business")

async function recommendation(req, res) {

  const distance_valid = req.query.longitude && req.query.latitude

  const longitude = parseFloat(req.query.longitude) ?? 0;
  const latitude = parseFloat(req.query.latitude) ?? 0;

  try {
    const business_ids = (await async_query(
      `
        with business_rating as (
          select
            business_id,
            avg(stars) as rating
          from
            review
          group by
            business_id
        )
        select
          b.business_id
        from
          business b
          inner join business_rating r
          on b.business_id = r.business_id
        order by
          r.rating *
          if( 
            ?, 
            st_distance_sphere(
                point(longitude, latitude),
                point(?, ?)
            ), 
            1
          )
          DESC
        limit 10
        ;
      `
      , [distance_valid, longitude, latitude]
    )).map(obj => obj.business_id);

    res.json({
      businesses: await getBusinessObjects(business_ids)
    })
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve recommendations.",
      errorString: err.toString(),
    });
  }
}

module.exports = recommendation;