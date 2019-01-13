import aes from 'aes-js'

const key = Buffer.from('urivnernfverklvwnf;qejfp')

// eslint-disable-next-line new-cap
const getEncrypter = () => new aes.ModeOfOperation.ctr(key) // eslint didn't like lowercase here

export const encrypt = (string) => {
  return aes.utils.hex.fromBytes(getEncrypter().encrypt(Buffer.from(string)))
}

export const decrypt = (string) => {
  return aes.utils.utf8.fromBytes(
    getEncrypter().decrypt(
      aes.utils.hex.toBytes(string)))
}
