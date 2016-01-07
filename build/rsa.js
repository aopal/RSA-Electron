// Generated by CoffeeScript 1.9.3
(function() {
  var concatenate, content, deconcatenate, decrypt, encoding, encrypt, extension, file, fs, inverse, keygen, read, writeToFile;

  fs = require("fs");

  file = "index";

  extension = ".html";

  encoding = 'utf8';

  content = "";

  fs.readFile("./build/" + file + extension, encoding, read = function(err, data) {
    if (err) {
      console.log(err);
    }
    content = data;
    console.log(content);
    return console.log(content);
  });

  writeToFile = function(arr) {
    var i, j, ref, writeStr;
    writeStr = "";
    for (i = j = 0, ref = arr.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      writeStr += arr[i].toString() + "\n";
    }
    return fs.writeFile("./build/" + file + "Enc" + extension, writeStr, encoding);
  };

  inverse = function(e, totient) {
    var d, newd, newr, quotient, r, tempd, tempr;
    d = bigInt(0);
    r = bigInt(totient);
    newd = bigInt(1);
    newr = bigInt(e);
    while (newr.neq(0)) {
      quotient = bigInt(r).over(newr);
      tempd = d;
      tempr = r;
      d = newd;
      r = newr;
      newd = bigInt(tempd).minus(bigInt(quotient).times(newd));
      newr = bigInt(tempr).minus(bigInt(quotient).times(newr));
    }
    if (d.lt(0)) {
      d = bigInt(d).plus(totient);
    }
    return d;
  };

  keygen = function(bitlength) {
    var a, b, d, d1, d2, dec, delta, e, enc, lower, n, p, q, t1, t2, totient, upper;
    upper = bigInt(1).shiftLeft(bitlength / 2 + 1).minus(1);
    lower = bigInt(1).shiftLeft(bitlength / 2);
    p = bigInt(32);
    q = bigInt(32);
    a = 0;
    b = 0;
    d1 = new Date();
    t1 = d1.getTime();
    console.log("starting...");
    while (!p.isProbablePrime(20)) {
      p = bigInt.randBetween(upper, lower);
      a = a + 1;
    }
    while (!q.isProbablePrime(20)) {
      q = bigInt.randBetween(upper, lower);
      b = b + 1;
    }
    n = p.times(q);
    totient = n.minus(p).minus(q).plus(1);
    e = 65537;
    while (bigInt.gcd(e, totient).neq(1)) {
      e = bigInt.randBetween(2, totient.minus(1));
    }
    d = inverse(e, totient);
    d2 = new Date();
    t2 = d2.getTime();
    console.log("done");
    delta = (t2 - t1) / 60000;
    console.log("it took " + delta + " seconds to generate the keys");
    console.log("Public key:\nn = " + n.toString() + "\ne = " + e.toString());
    console.log("private key:\nn = " + n.toString() + "\nd = " + d.toString());
    console.log(a + " numbers were tried for p = " + p.toString());
    console.log(b + " numbers were tried for q = " + q.toString());
    console.log(p);
    console.log("to encrypt: " + content);
    enc = encrypt("lets try this because it worked before", n, e, bitlength);
    console.log("encrypted :" + enc);
    console.log(enc[0]);
    writeToFile(enc);
    dec = decrypt(enc, n, d);
    return fs.writeFile("./build/" + file + "Dec" + extension, dec, encoding);
  };

  concatenate = function(str, lo, hi) {
    var i, j, n, ref, ref1;
    if (hi < lo || hi >= str.length) {
      hi = str.length - 1;
    }
    n = bigInt(0);
    for (i = j = ref = lo, ref1 = hi; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      n = n.shiftLeft(8);
      n = n.plus(bigInt(str.charCodeAt(i)));
    }
    return n;
  };

  
function reverse(str) {
  var newStr = '';
  for (var i = str.length - 1; i >= 0; i--)
    newStr += str[i];
  return newStr;
}
;

  deconcatenate = function(num) {
    var str, temp;
    temp = bigInt(0);
    str = "";
    while (true) {
      temp = num.mod(256);
      num = num.shiftRight(8);
      str += String.fromCharCode(temp);
      if (num <= bigInt(0)) {
        break;
      }
    }
    str = reverse(str);
    return str;
  };

  encrypt = function(text, n, e, bitlength) {
    var cipher, encrypted, f, i, j, len, m, numchars, ref, ref1;
    numchars = bitlength / 16;
    len = text.length;
    encrypted = [];
    cipher = [];
    f = 0;
    m = bigInt(0);
    console.log("cipher: " + cipher);
    console.log("starting encryption");
    for (i = j = 0, ref = len - 1, ref1 = numchars; ref1 > 0 ? j <= ref : j >= ref; i = j += ref1) {
      console.log(cipher);
      m = bigInt(concatenate(text, i, i + numchars - 1));
      console.log(cipher);
      console.log("test");
      console.log(m.toString());
      m = m.modPow(e, n);
      console.log(m.toString());
      encrypted.push(m);
      console.log("encrypted: " + encrypted);
      console.log(cipher);
      m = bigInt(0);
    }
    console.log("encrypted text:");
    console.log(typeof cipher);
    console.log(typeof cipher[0]);
    console.log(cipher[0]);
    console.log(cipher);
    console.log(typeof text);
    return encrypted;
  };

  decrypt = function(cipher, n, d) {
    var dec, i, j, ref;
    dec = "";
    for (i = j = 0, ref = cipher.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      cipher[i] = cipher[i].modPow(d, n);
      cipher[i] = deconcatenate(cipher[i]);
      dec += cipher[i];
    }
    return dec;
  };

  console.log("concatentation:");

  console.log("test = " + concatenate("test", 0, 3));

  console.log("let's hope this things works as it should = " + concatenate("let's hope this things works as it should", 0, 40));

  console.log("a = " + concatenate("a", 0, 0));

  console.log("ab = " + concatenate("ab", 0, 1));

  deconcatenate(concatenate("abcd", 0, 3));

  console.log(reverse("abcdefg"));

  keygen(64);

}).call(this);
