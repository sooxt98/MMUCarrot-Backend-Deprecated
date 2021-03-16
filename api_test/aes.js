const Salsa20 = require('js-salsa20')
const { TextEncoder, TextDecoder } = require('util')

const hexToBytes = hex => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const key = encoder.encode('my32lengthsupersecretnooneknows1')
const iv = encoder.encode('8bytesiv')
const encrypted = hexToBytes('4287bf31150e')

const encrypter = new Salsa20(key, iv)
const messageBytes = encrypter.decrypt(encrypted)
const message = decoder.decode(messageBytes)

console.log(message)