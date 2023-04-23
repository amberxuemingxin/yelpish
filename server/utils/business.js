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

    if (!business_ids || business_ids.length === 0) {
        return []
    }

    const coord_provided = (longitude_ && latitude_) ?? false
    const longitude = longitude_ ?? 0
    const latitude = latitude_ ?? 0

    const info =
        await async_query(
            `
            with selected_businesses as (
                select
                    business_id as id,
                    \`name\`,
                    if(
                        ?, 
                        st_distance_sphere(
                            point(longitude, latitude),
                            point(?, ?)
                        ) / 1609.344, -- meter to miles
                        null
                    ) as distance,
                    state,
                    city,
                    address,
                    monday_start,
                    monday_end,
                    tuesday_start,
                    tuesday_end,
                    wednesday_start,
                    wednesday_end,
                    thursday_start,
                    thursday_end,
                    friday_start,
                    friday_end,
                    saturday_start,
                    saturday_end,
                    sunday_start,
                    sunday_end
                from
                    business
                where
                    business_id in (?)
            ),
            selected_stars as (
                select
                    business_id,
                    avg(stars) as rating
                from
                    review
                where
                    business_id in (?)
                group by
                    business_id
            ),
            selected_categories as (
                select
                    business_id,
                    group_concat(category separator ',') as categories
                from
                    business_categories
                where
                    business_id in (?)
                group by
                    business_id
            ),
            selected_photos as (
                select
                    business_id,
                    group_concat(photo_id separator ',') as photos
                from
                    photo
                where
                    business_id in (?)
                group by
                    business_id
            )
            select
                b.*,
                s.rating,
                c.categories,
                p.photos
            from
                selected_businesses b
                left outer join selected_stars s
                on b.id = s.business_id
                left outer join selected_categories c
                on b.id = c.business_id
                left outer join selected_photos p
                on b.id = p.business_id
            `,
            [
                coord_provided,
                longitude,
                latitude,
                business_ids,
                business_ids,
                business_ids,
                business_ids
            ]
        )


    const result = info.map((obj) => ({
        ...obj,
        categories: obj.categories ? obj.categories.split(",") : null,
        photos: obj.photos ? obj.photos.split(",") : null
    }))

    return result
}

module.exports = { getBusinessObjects }