const { connection } = require("../db_connection")
const { v4: uuidv4 } = require("uuid")

async function addTip(req, res) {

    const user_id = req.body.user_id
    const business_id = req.body.business_id
    const text = req.body.text

    const tip_id = uuidv4()
    const date = new Date()

    connection.query(`
        insert into tips
        (
            tip_id,
            user_id,
            business_id,
            \`date\`,
            \`text\`
            
        )
        values
        (
            ?, ?, ?, ?, ?
        )
    `,
        [tip_id, user_id, business_id, text],
        (err, data) => {
            if (err) {
                res.json({
                    error: err
                })
            } else {
                res.json({
                    tip_id: tip_id,
                    date: date.toDateString(),
                })
            }
        })
}

module.exports = addTip