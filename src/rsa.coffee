# coffee --compile --output ./build ./src
# C:\Users\Anuj\AppData\Roaming\npm\node_modules\electron-prebuilt\dist\electron.exe C:\Users\Anuj\Documents\RSA-Electron\build

fs = require("fs")

file = "index"
extension = ".html"
encoding = 'utf8'

content = ""

fs.readFile("./build/"+file+extension, encoding, read = (err, data) ->
  if err then console.log(err)
  #str = ""
  content = data
  console.log(content)
  #for i in [0..content.length-1]
    #str += String.fromCharCode(content[i])
  console.log(content)
  #keygen(64)
  #console.log(str)
  )

writeToFile = (arr) ->
  writeStr = ""
  for i in [0..arr.length-1]
    writeStr += (arr[i].toString()+"\n")
  fs.writeFile("./build/"+file+"Enc"+extension,writeStr,encoding)

inverse = (e, totient) ->
   d = bigInt(0)
   r = bigInt(totient)
   newd = bigInt(1)
   newr = bigInt(e)

   while newr.neq(0)
     quotient = bigInt(r).over(newr)

     tempd = d
     tempr = r

     d = newd
     r = newr

     newd = bigInt(tempd).minus(bigInt(quotient).times(newd))
     newr = bigInt(tempr).minus(bigInt(quotient).times(newr))

   if d.lt(0) then d = bigInt(d).plus(totient)

   return d

keygen = (bitlength) ->
  upper = bigInt(1).shiftLeft(bitlength/2 + 1).minus(1)
  lower = bigInt(1).shiftLeft(bitlength/2)
  p = bigInt(32)
  q = bigInt(32)
  a = 0
  b = 0
  d1 = new Date()
  t1 = d1.getTime()
  console.log("starting...")

  while not p.isProbablePrime(20)
    p = bigInt.randBetween(upper, lower)
    a = a + 1

  while not q.isProbablePrime(20)
    q = bigInt.randBetween(upper, lower)
    b = b + 1

  n = p.times(q)
  totient = n.minus(p).minus(q).plus(1)
  e = 65537;

  while bigInt.gcd(e, totient).neq(1)
    e = bigInt.randBetween(2, totient.minus(1))

  d = inverse(e, totient)

  d2 = new Date();
  t2 = d2.getTime();
  console.log("done");
  delta = (t2-t1)/60000

  console.log("it took " + delta + " seconds to generate the keys"); #: p = " + bigInt(p).toString()+ ", q = " + bigInt(q).toString()+ " and n = " + bigInt(n).toString());
  console.log("Public key:\nn = " + n.toString() + "\ne = " + e.toString());
  console.log("private key:\nn = " + n.toString() + "\nd = " + d.toString());
  console.log(a + " numbers were tried for p = " + p.toString());
  console.log(b + " numbers were tried for q = " + q.toString());
  console.log(p)
  console.log("to encrypt: " + content)
  enc = encrypt("lets try this because it worked before", n, e, bitlength)
  console.log("encrypted :" + enc)
  console.log(enc[0])
  #fs.writeFile("./build/"+file+"Enc"+extension,enc,encoding)
  writeToFile(enc)
  dec = decrypt(enc, n, d)
  fs.writeFile("./build/"+file+"Dec"+extension,dec,encoding)

# concatenates all characters in a string between the two limits inclusive
concatenate = (str, lo, hi) ->
  if hi < lo or hi >= str.length then hi = str.length-1
  # console.log("len = " + str.length + " lo = " + lo + " hi = " + hi)
  n = bigInt(0)
  for i in [lo..hi]
    n = n.shiftLeft(8)
    n = n.plus(bigInt(str.charCodeAt(i)))
  return n

`
function reverse(str) {
  var newStr = '';
  for (var i = str.length - 1; i >= 0; i--)
    newStr += str[i];
  return newStr;
}
`

# takes a number and interprets a string out of it
deconcatenate = (num) ->
  temp = bigInt(0)
  str = ""
  while true
    #console.log(temp + " " + num + " " + str)
    temp = num.mod(256)
    num = num.shiftRight(8)
    str += String.fromCharCode(temp)
    if num <= bigInt(0) then break
  str = reverse(str)
  return str

encrypt = (text, n, e, bitlength) ->
  numchars = bitlength/16
  len = text.length
  encrypted = []
  cipher = []
  f = 0
  m = bigInt(0)
  console.log("cipher: " + cipher)
  console.log("starting encryption")

  for i in [0..len-1] by numchars
    #console.log(m.toString())
    console.log(cipher)
    m = bigInt(concatenate(text, i, i+numchars-1))
    console.log(cipher)
    console.log("test")
    console.log(m.toString())
    m = m.modPow(e,n)
    console.log(m.toString())
    encrypted.push(m)
    console.log("encrypted: " + encrypted)
    #console.log(cipher[cipher.length-1].toString())
    console.log(cipher)
    m = bigInt(0)
  console.log("encrypted text:")
  console.log(typeof cipher)
  console.log(typeof cipher[0])
  console.log(cipher[0])
  console.log(cipher)
  console.log(typeof text)
  #console.log(text)
  #for i in [0..cipher.length-1]
  #  console.log(cipher[i].toString())

  #fs.writeFile("./build/cardiolabEnc.docx", cipher, "base64")

  return encrypted

decrypt = (cipher, n, d) ->
  dec = ""
  for i in [0..cipher.length-1]
    cipher[i] = cipher[i].modPow(d,n)
    cipher[i] = deconcatenate(cipher[i])
    dec += cipher[i]

  #console.log("decrypted text :\n" + dec)

  return dec


console.log("concatentation:")
console.log("test = " + concatenate("test", 0, 3))
console.log("let's hope this things works as it should = "+ concatenate("let's hope this things works as it should", 0, 40))
console.log("a = " + concatenate("a", 0, 0))
console.log("ab = " + concatenate("ab", 0, 1))
deconcatenate(concatenate("abcd", 0, 3))
console.log(reverse("abcdefg"))
keygen(64)
