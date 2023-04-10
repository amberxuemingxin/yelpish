const { connection } = require("../db_connection")
const { v4: uuidv4 } = require("uuid")

async function addReview(req, res) {

    const user_id = req.body.user_id
    const business_id = req.body.business_id
    const star = parseInt(req.body.star)
    const text = req.body.text

    const review_id = uuidv4()
    const date = new Date()

    connection.query(`
        insert into review
        (
            review_id,
            user_id,
            business_id,
            stars,
            \`date\`,
            \`text\`
        )
        values
        (
            ?, ?, ?, ?, ?, ?
        )
    `,
        [review_id, user_id, business_id, star, date, text],
        (err, data) => {
            if (err) {
                res.json({
                    error: err
                })
            } else {
                res.json({
                    review_id: review_id,
                    date: date.toDateString(),
                })
            }
        })
}

module.exports = addReview
