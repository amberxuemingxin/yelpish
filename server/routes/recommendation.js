const { async_query } = require("../db_connection");
const { getBusinessObjects } = require("../utils/business")

async function recommendation(req, res) {

  const coord_provided = (req.query.longitude && req.query.latitude) ?? false

  const longitude = parseFloat(req.query.longitude ?? 0);
  const latitude = parseFloat(req.query.latitude ?? 0);

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
          power(r.rating, 2) /
            log(if( 
              ?, 
              st_distance_sphere(
                  point(longitude, latitude),
                  point(?, ?)
              ), 
              1
            ))
          DESC
        limit 10
        ;
      `
      , [coord_provided, longitude, latitude]
    )).map(obj => obj.business_id);

    res.json({
      businesses: await (
        coord_provided ?
          getBusinessObjects(business_ids, longitude, latitude) :
          getBusinessObjects(business_ids))
    })
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve recommendations.",
      errorString: err.toString(),
    });
  }
}

module.exports = recommendation;