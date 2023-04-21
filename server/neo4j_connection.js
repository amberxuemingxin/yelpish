const neo4j = require('neo4j-driver')
const config = require('./config.json')


const driver = neo4j.driver(
  `neo4j://${config.neo4j_host}`,
  neo4j.auth.basic(config.neo4j_user, config.neo4j_password)
)
const neo4jSession = driver.session()

module.exports = { neo4jSession }
