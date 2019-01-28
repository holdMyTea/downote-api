const success = (message) => ({
  code: 200,
  message
})

const fail = (code, errorMessage) => ({
  code,
  message: { error: errorMessage }
})

export {
  success,
  fail
}
