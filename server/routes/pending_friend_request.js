const { async_query } = require("../db_connection")

async function pending_friend_request(req, res) {
    const user_id = req.params.user_id

    const result = await async_query(
        `
        select
            u.user_id,
            u.name as user_name
        from
            (select
                request_user_id
            from
                friend_request
            where
                target_user_id = ?
            ) t
        inner join
            user u
        on
            t.request_user_id = u.user_id
        `
        , [user_id]
    )
    
    res.json({
        request_users_info: Object.values(result)
    })
}


module.exports = pending_friend_request
