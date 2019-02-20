const success = (message) => ({
  code: 200,
  message
})

const fail = (code, errorMessage) => ({
  code,
  message: { error: errorMessage }
})

const internalFail = (error) => {
  console.error(error)
  return fail(500, 'Internal error occured')
}

const resolveToken = (body, cookies) => {
  if (body.token && cookies.token) {
    if (body.token === cookies.token)
      return body.token
    return {
      bodyToken: body.token,
      cookieToken: cookies.token
    }
  }
  if (body.token)
    return body.token
  if (cookies.token)
    return cookies.token
  return undefined
}

export {
  success,
  fail,
  internalFail,
  resolveToken
}
