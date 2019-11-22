export default [
  'API_HOST', 'API_PORT',
  'DB_HOST', 'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD'
]
  .reduce((acc, val) => {
    if (process.env[val]) {
      acc[val] = process.env[val]
      return acc
    } else {
      throw new Error('Enviromental property ' + val + ' is missing')
    }
  }, {})
