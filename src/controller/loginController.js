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
          token: pass + email
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
