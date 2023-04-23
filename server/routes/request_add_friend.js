const { async_query } = require("../db_connection")

async function request_add_friend(req, res) {

    const login_user_id = req.body.login_user_id
    const target_user_id = req.body.target_user_id

    await async_query(
        `
        insert into friend_request
        (
            request_user_id,
            target_user_id
        ) values 
        (?, ?)
        `,
        [login_user_id, target_user_id]
    )

    res.json({})
}

module.exports = request_add_friend
