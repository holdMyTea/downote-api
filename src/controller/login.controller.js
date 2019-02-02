import { createToken } from '../services/cypher'
import { findUser, saveToken } from '../services/db'
import { success, fail } from '../helpers/controllerFormatter'

const isEmailValid = (email) => /(\w)+@(\w)+\.{1}\w{1,5}/.test(email)

const login = async ({ email, pass }) => {
  if (isEmailValid(email) && pass) {
    let record
    try {
      record = await findUser(email)
    } catch (error) {
      console.error(error)
      return fail(500, 'Something went wrong')
    }

    if (!record) // empty set -- no user with such email
      return fail(401, 'Wrong login credentials')
    else if (record.password !== pass) // user exists, but the pass is wrong
      return fail(401, 'Wrong login credentials')
    else {
      const token = createToken()
      console.log(record)
      saveToken(token, record.id)
      return success({ token })
    }
  } else return fail(400, 'Required parameters are missing')
}

export default {
  login
}
