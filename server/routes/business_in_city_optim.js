const { connection, async_query } = require("../db_connection")


async function business_in_city_lowest_review_optim(req, res) {
    const result = await async_query(
        `
        with user_avg as (
            select
                user_id,
                avg(stars) as avg_stars
            from
                review
            group by
                user_id
        ),
        most_critical_users as (
            select
                user_id
            from
                user_avg
            where
                avg_stars <= all (select avg_stars from user_avg)
        ),
        selected_cities as (
            select
                distinct b.city       
            from    
                most_critical_users m
                inner join review r
                    on m.user_id = r.user_id
                inner join business_optim b
                    on r.business_id = b.business_id
        )
        select
            b.business_id,
            b.name,
            b.city,
            avg(r.stars) as avg_stars
        from
            selected_cities s
            inner join business_optim b
                on s.city = b.city
            inner join review r
                on r.business_id = b.business_id
        group by
            b.business_id,
            b.name,
            b.city
        order by
            avg_stars DESC,
            b.name ASC
        limit 10
        ;
        `
    )

    res.json({
        businesses: Object.values(result)
    })
}

module.exports = business_in_city_lowest_review_optim