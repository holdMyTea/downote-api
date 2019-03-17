const successWithData = (message) => ({
  code: 200,
  message
})

const successWithMessage = (message) => ({
  code: 200,
  message: { message }
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
  successWithData,
  successWithMessage,
  fail,
  internalFail
}
