import { fail } from './controllerFormatter'

const isTokenValid = (token) => /\w{40}/.test(token)

const resolveToken = (body, cookies) => {
  if (body.token && cookies.token) {
    if (body.token === cookies.token)
      return body.token
    return { error: fail(400, 'Cookie and body tokens mismatch') }
  }
  if (body.token)
    return body.token
  if (cookies.token)
    return cookies.token
  return { error: fail(400, 'Token is missing') }
}

const validateToken = (body, cookies) => {
  const check = resolveToken(body, cookies)

  if (check.error)
    return check

  if (isTokenValid(check))
    return { token: check }

  return { error: fail(400, 'Invalid token format') }
}

export {
  validateToken
}
