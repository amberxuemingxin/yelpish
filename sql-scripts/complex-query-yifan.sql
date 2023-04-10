with
-- Compute the minimum rating and the maximum rating for each user,
-- because some users might just be very high-demanding (low stars for all), or
-- very tolerant (high stars for all). We need to normalize everyone's rating to 0 to 1.
user_min_max_stars as (
    select
        user_id,
        min(stars) as min_stars,
        max(stars) as max_stars
    from
        review
    group by
        user_id
),
-- Each user's normalized stars to each business
normalized_stars as (
    select
        a.user_id,
        a.business_id,
        case
            when u.min_stars = u.max_stars then 0.5
            else (a.avg_stars - u.min_stars) / (u.max_stars - u.min_stars)
        end as normalized_stars
    from
        (select
            business_id,
            user_id,
            -- We allow each user to have multiple reviews for one business,
            -- so use the average stars as their comprehensive rating of a business
            avg(stars) as avg_stars 
        from
            review
        group by
            business_id,
            user_id
        ) a
        inner join user_min_max_stars u
        on a.user_id = u.user_id
),
-- Normalized stars of the user who made the request
request_user_normalized_stars as (
    select
        business_id,
        normalized_stars
    from
        normalized_stars
    where
        user_id = '__QLyY_W06q10ZfBQg7Dcg' -- parameter: user_id
),
-- Normalized rating of the other users
other_users_normalized_stars as (
    select
        user_id,
        business_id,
        normalized_stars
    from
        normalized_stars
    where
        user_id != '__QLyY_W06q10ZfBQg7Dcg' -- parameter: user_id
),
similar_taste_users as (
    select
        o.user_id
    from
        request_user_normalized_stars r
        inner join other_users_normalized_stars o
        on r.business_id = o.business_id
    group by
        o.user_id
    order by
        avg(abs(o.normalized_stars - r.normalized_stars)) -- avg of absolute diff
        ASC
    limit
        10
)
-- Finally, gives a list of favourite businesses of the similar taste users
select
    business_id
from
    similar_taste_users s
    inner join other_users_normalized_stars o
    on s.user_id = o.user_id
group by
    business_id
order by
    avg(normalized_stars) DESC
limit 10
;
