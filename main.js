fs = require("fs");
bigInt = require("big-integer");

numTrials = 20;
encoding = "utf8";

main = function() {
  argv = process.argv;
  
  if (argv[2] == "-g") {
    bitLength = parseInt(argv[3]);
    
    if(isNaN(bitLength)) {
      console.log("Error: bitlength must be an integer");
      return;
    }
    
    keygen(bitLength, argv[4], argv[5]);
  }
  else if (argv[2] == "-e") {
    if(!fs.existsSync(argv[3])){
      console.log("Error: no such file " + argv[3]);
      return;
    }
    else if(!fs.existsSync(argv[4])){
      console.log("Error: no such file " + argv[4]);
      return;
    }
    
    key  = readFromFile(argv[3]).split("\n");
    text = readFromFile(argv[4]);
    bitlength = key[0];
    
    cipher = encrypt(text, bigInt(key[1]), bigInt(key[2]), bitlength);
    
    writeText = cipher.map(function(elem) {return elem.toString();}).join("\n");
    
    console.log(writeText);
  }
  else if (argv[2] == "-d") {
    if(!fs.existsSync(argv[3])){
      console.log("Error: no such file " + argv[3]);
      return;
    }
    else if(!fs.existsSync(argv[4])){
      console.log("Error: no such file " + argv[4]);
      return;
    }
    
    key  = readFromFile(argv[3]).split("\n");
    cipher = readFromFile(argv[4]);
    
    text = decrypt(cipher, bigInt(key[0]), bigInt(key[1]));  
    
    console.log(text);
  }
  else {
    console.log("Usage: one of");
    console.log("node main.js -g [BITLENGTH] [PUBLIC_KEY_FILE] [PRIVATE_KEY_FILE]");
    console.log("node main.js -e [PUBLIC_KEY] [SOURCE_FILE]");
    console.log("node main.js -d [PRIVATE_KEY] [SOURCE_FILE]");
  }
};

readFromFile = function (inFile) {
  return fs.readFileSync(inFile, encoding);
};

writeToFile = function(text, outFile) {      
  fs.writeFile(outFile, text, encoding);
};

// modular inverse algorithm
inverse = function(e, totient) {  
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
  
  if (d.lt(0))
    d = bigInt(d).plus(totient);
  
  return d;
};

keygen = function(bitlength, pubName, privName) {
  upper = bigInt(1).shiftLeft(bitlength / 2 + 1).minus(1);
  lower = bigInt(1).shiftLeft(bitlength / 2);
  p = bigInt(bitlength / 2);
  q = bigInt(bitlength / 2);
  a = 0;
  b = 0;
  d1 = new Date();
  t1 = d1.getTime();
    
  while (!p.isProbablePrime(numTrials))
    p = bigInt.randBetween(upper, lower);
    
  while (!q.isProbablePrime(numTrials))
    q = bigInt.randBetween(upper, lower);
  
  n = p.times(q);
  totient = n.minus(p).minus(q).plus(1);
  e = 65537;
  
  while (bigInt.gcd(e, totient).neq(1))
    e = bigInt.randBetween(11, totient.minus(1));
  
  d = inverse(e, totient);
  d2 = new Date();
  t2 = d2.getTime();
    
  delta = (t2 - t1) / 60000;
    
  writeToFile(bitlength + "\n" + n.toString() + "\n" + e.toString(),pubName);
  writeToFile(n.toString() + "\n" + d.toString(),privName);
};

reverse = function(str) {
  newStr = '';
  for (var i = str.length - 1; i >= 0; i--)
    newStr += str[i];
  
  return newStr;
};

// concatenates all characters in a string between the two limits inclusive
concatenate = function(str, lo, hi) {
  if (hi < lo || hi >= str.length)
    hi = str.length - 1;
  
  n = bigInt(0);
  for (var i = lo; i <= hi; i++) {
    n = n.shiftLeft(8);
    n = n.plus(bigInt(str.charCodeAt(i)));
  }
  
  return n;
};

// takes a number and interprets a string out of it
deconcatenate = function(num) {
  temp = bigInt(0);
  str = "";
  
  while (true) {
    temp = num.mod(256);
    num = num.shiftRight(8);
    str += String.fromCharCode(temp);
    if (num <= bigInt(0))
      break;
  }
  
  str = reverse(str);
  
  return str;
};

encrypt = function(text, n, e, bitlength) {  
  numchars = bitlength / 16;
  len = text.length;
  encrypted = [];
  cipher = [];
  m = bigInt(0);
    
  for (i = 0; i < len; i += numchars) {
    m = bigInt(concatenate(text, i, i + numchars - 1));
    res = m.modPow(e, n);
    encrypted.push(res);
    m = bigInt(0);
  }
  
  return encrypted;
};

decrypt = function(cipher, n, d) {
  dec = "";
  arr = [];
  
  cipher.split("\n").forEach(function(elem) {
    arr.push(bigInt(elem));
  });
  
  cipherLen = arr.length;
  
  for (var i = 0; i < cipherLen; i++) {
    arr[i] = arr[i].modPow(d, n);
    arr[i] = deconcatenate(arr[i]);
    dec += arr[i];
  }
  
  return dec;
};

main();