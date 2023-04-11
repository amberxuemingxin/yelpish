const { connection, async_query } = require("../db_connection")
const _ = require("lodash")

/**
 * Get the complete business object for each business in the business_ids
 * 
 * @param {Array<string>} business_ids
 * @param {float} longitude_ optional
 * @param {float} latitude_ optional
 * @returns {Array<object>}
 */
async function getBusinessObjects(business_ids, longitude_, latitude_) {

    if (!business_ids) {
        return []
    }

    const coord_provided = longitude_ && latitude_
    const longitude = longitude_ ?? 0
    const latitude = latitude_ ?? 0

    const simple_info_promise =
        async_query(
            `
            with selected_businesses as (
                select
                    business_id as id,
                    \`name\`,
                    st_distance_sphere(
                        point(longitude, latitude),
                        point(?, ?)
                    ) as distance
                from
                    business
                where
                    business_id in (?)
            ),
            selected_stars as (
                select
                    b.id,
                    avg(r.stars) as rating
                from
                    selected_businesses b
                        -- push down filtering business to improve performance
                    inner join review r 
                    on b.id = r.business_id
                group by
                    b.id
            )
            select
                b.id,
                b.name,
                s.rating,
                b.distance
            from
                selected_businesses b
                inner join selected_stars s
                on b.id = s.id
            `,
            [longitude, latitude, business_ids]
        )

    const category_info_promise =
        async_query(
            `
                select
                    business_id,
                    category
                from
                    business_categories
                where
                    business_id in (?)
            `,
            [business_ids]
        )

    const [
        simple_info,
        category_info
    ] = await Promise.all(
        [simple_info_promise, category_info_promise]
    )

    grouped_categories = _.groupBy(category_info, "business_id")

    const result = simple_info.map((obj) => ({
        id: obj.id,
        "name": obj.name,
        rating: obj.rating,
        distance: obj.distance / 1609.344, // meter to miles
        categories: grouped_categories[obj.id].map(x => x.category)
    }))

    return result
}

module.exports = { getBusinessObjects }