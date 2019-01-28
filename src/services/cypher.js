import aes from 'aes-js'

const key = Buffer.from('urivnernfverklvwnf;qejfp')

// eslint-disable-next-line new-cap
const getEncrypter = () => new aes.ModeOfOperation.ctr(key) // eslint didn't like lowercase here

export const encrypt = (string) =>
  aes.utils.hex.fromBytes(getEncrypter().encrypt(Buffer.from(string)))

export const decrypt = (string) =>
  aes.utils.utf8.fromBytes(
    getEncrypter().decrypt(
      aes.utils.hex.toBytes(string)))

const charDictionary = // An array of charcodes [a-zA-Z0-9] and some spice [;:<>=]
  Array(43).fill(0).map((value, index) => 48 + index)
    .concat(
      Array(26).fill(0).map((value, index) => 97 + index)
    )
export const createToken = (tokenLenght = 40) => // Generates a random string
  String.fromCharCode.apply(null,
    Array(tokenLenght).fill(0).map(value =>
      charDictionary[Math.floor(Math.random() * charDictionary.length)]
    )
  )
