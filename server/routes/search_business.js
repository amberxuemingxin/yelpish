const { connection, async_query } = require("../db_connection")
const { getBusinessObjects } = require("../utils/business")

async function search_business(req, res) {
    const name_keyword = req.body.name_keyword ?? ""
    const categories = req.body.categories ?? ["SKIP_FILTER_CATEGORIES"]

    const do_distance_filter =
        req.body.longitude && req.body.latitude && req.body.max_miles;
    const skip_distance_filter = !do_distance_filter

    const longitude = parseFloat(req.body.longitude ?? 0)
    const latitude = parseFloat(req.body.latitude ?? 0)
    const max_miles = parseFloat(req.body.max_miles ?? 0)

    const min_rating = parseFloat(req.body.min_rating ?? -1)

    const business_info = await async_query(
        `
        with 
        name_qualified as (
            select
                business_id
            from
                business
            where
                \`name\` like ?
        ),
        category_qualified as (
            select
                business_id
            from
                business_categories
            group by
                business_id
            having
                sum(
                    case 
                        when 'SKIP_FILTER_CATEGORIES' in (?) then 1
                        when category in (?) then 1
                        else 0
                    end
                ) >= ?
        ),
        distance_qualified as (
            select
                business_id
            from
                business
            where
                ? or 
                (st_distance_sphere(
                    point(longitude, latitude),
                    point(?, ?)
                ) < ?)
        ),
        rating_qualified as (
            select
                business_id
            from
                review
            group by
                business_id
            having
                avg(stars) > ?
        )
        select
            n.business_id
        from
            name_qualified n
            inner join category_qualified c
                on n.business_id = c.business_id
            inner join distance_qualified d
                on n.business_id = d.business_id
            inner join rating_qualified r
                on n.business_id = r.business_id
        limit 10
        ;
        `,
        [
            `%${name_keyword}%`,
            categories, categories, categories.length,
            skip_distance_filter, longitude, latitude, max_miles * 1609.344, // mile to meters
            min_rating
        ]
    )

    const business_ids = business_info.map(entry => entry.business_id)

    res.json({
        businesses: 
            (req.body.longitude && req.body.latitude) ? 
            await getBusinessObjects(business_ids, longitude, latitude) : 
            await getBusinessObjects(business_ids)
    })
}


module.exports = search_business
