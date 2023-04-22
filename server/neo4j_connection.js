const neo4j = require('neo4j-driver')
const config = require('./config.json')
const { USE_NEO4J } = require('./process_env')


const neo4jDriver = neo4j.driver(
  `neo4j://${config.neo4j_host}`,
  neo4j.auth.basic(config.neo4j_user, config.neo4j_password)
)

async function neo4jQuery(query, params) {
  const session = neo4jDriver.session()
  const result = await session.run(query, params)
  session.close()
  return result
}

async function neo4jQueryIfUsing(query, params) {
  if (USE_NEO4J) {
    return neo4jQuery(query, params)
  } else {
    return { records: [] }
  }
}

module.exports = { neo4jDriver, neo4jQuery, neo4jQueryIfUsing }
