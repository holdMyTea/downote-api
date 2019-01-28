import { createToken } from '../services/cypher'
import { findUser } from '../services/db'
import { success, fail } from '../helpers/controllerFormatter'

const login = async ({ email, pass }) => {
  if (email && pass) {
    let record
    try {
      record = await findUser(email)
      console.log(record)
    } catch (error) {
      console.error(error)
      return fail(500, 'Something went wrong')
    }

    if (record === undefined) // empty set -- no user with such email
      return fail(401, 'Wrong login credentials')
    else if (record.password !== pass) // user exists, but the pass is wrong
      return fail(401, 'Wrong login credentials')
    else return success({
      token: createToken()
    })
  } else return fail(400, 'Required parameters are missing')
}

export default {
  login
}
