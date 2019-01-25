import { encrypt } from '../services/cypher'

const login = ({ email, pass }) => {
  if (email && pass) {
    if (email.charAt(0) === 'a') {
      return {
        code: 401,
        message: {
          error: 'Wrong login credentials'
        }
      }
    } else {
      return {
        code: 200,
        message: {
          token: encrypt(`${email};${new Date().toISOString()}`)
        }
      }
    }
  } else {
    return {
      code: 400,
      message: {
        error: 'Required parameters are missing'
      }
    }
  }
}

export default {
  login
}
