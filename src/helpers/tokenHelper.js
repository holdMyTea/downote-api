const charDictionary = // An array of charcodes [a-zA-Z0-9]
  Array(10).fill(0).map((value, index) => 48 + index) // [0-9]
    .concat(
      Array(26).fill(0).map((value, index) => 65 + index), // [A-Z]
      Array(26).fill(0).map((value, index) => 97 + index) // [a-z]
    )

/**
 * Generates a random string [a-zA-Z0-9] of given length
 * @param {number} [tokenLenght=40] - length of token
 * @returns {string} token
 */
const createToken = (tokenLenght = 40) => // Generates a random string
  String.fromCharCode.apply(null,
    Array(tokenLenght).fill(0).map(value =>
      charDictionary[Math.floor(Math.random() * charDictionary.length)]
    )
  )

const isTokenValid = (token) => /\w{40}/.test(token)

/**
 * Checks provided body and cookies objects for a token, ensures there's no conlicts.
 * @param {Object} cookies - cookies object
 * @param {string} cookies.token - prop to be checked
 * @param {Object} body - body object
 * @param {string} body.token - prop to be checked
 * @returns {string|undefined} token string or undefined
 */
const resolveToken = (cookies, body) => {
  if ((body && body.token) && (cookies && cookies.token)) {
    if (body.token === cookies.token) {
      return body.token
    }
  } else if (body && body.token) {
    return body.token
  } else if (cookies && cookies.token) {
    return cookies.token
  }
  return undefined
}

/**
   * Checks tokens from body and cookies of the request.
   * @param {Object} body body object of the request
   * @param {Object} cookies cookies object from the request
   * @returns {string|undefined} a valid token or undefined
   */
const validateToken = (body, cookies) => {
  const token = resolveToken(body, cookies)

  if (token && isTokenValid(token)) {
    return token
  }

  return undefined
}

export {
  createToken,
  validateToken
}
