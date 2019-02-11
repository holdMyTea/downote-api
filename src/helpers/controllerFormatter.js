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

export {
  success,
  fail,
  internalFail
}
