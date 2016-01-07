function inverse(e, totient){
  var d = bigInt(0);
  var r = totient;
  var newd = bigInt (1);
  var newr = e;
  var tempd, tempr, quotient;

  while(newr != 0){
    console.log(bigInt(newr).toString())
    quotient = bigInt(r).over(newr);

    tempd = d;
    tempr = r;

    d = newd;
    r = newr;

    newd = bigInt(tempd).minus(bigInt(quotient).times(newd));
    newr = bigInt(tempr).minus(bigInt(quotient).times(newr));
  }
  if(d<0){
    d = bigInt(d).plus(totient);
  }

  return d;
}

var bitlength = 64;
var upper = bigInt(1).shiftLeft(bitlength/2 + 1).minus(1);
var lower = bigInt(1).shiftLeft(bitlength/2);
var p = 32, q = 32, a = 0, b = 0;
var d1 = new Date();
var t1 = d1.getTime();
console.log("starting...");

while (!bigInt(p).isProbablePrime(20)) {p = bigInt.randBetween(upper, lower); a = a + 1}
while (!bigInt(q).isProbablePrime(20)) {q = bigInt.randBetween(upper, lower); b = b + 1}

var n = bigInt(p).times(q);
var totient = bigInt(n).minus(p).minus(q).plus(1);
var d, e = 129;

while(bigInt.gcd(e, totient) != 1){e = bigInt.randBetween(2, bigInt(totient).minus(1));}

d = inverse(e, totient);

var d2 = new Date();
var t2 = d2.getTime();
console.log("done");
var delta = (t2-t1)/60000

console.log("it took " + delta + " seconds to generate the keys"); //: p = " + bigInt(p).toString()+ ", q = " + bigInt(q).toString()+ " and n = " + bigInt(n).toString());
console.log("Public key:\nn = " + bigInt(n).toString() + "\ne = " + bigInt(e).toString());
console.log("private key:\nn = " + bigInt(n).toString() + "\nd = " + bigInt(d).toString());
console.log(a + " numbers were tried for p = " + bigInt(p).toString());
console.log(b + " numbers were tried for q = " + bigInt(q).toString());

var w = inverse(4, 7);

/*var n = bigInt("1585620843751670549407266773046259040583821847415448349649893693075996616260940117630917549534982445603277515342868424536333857738634031404455533716444152521138755407467731333765338846177199358259137747151645428920669252508613374282908250136555092697966915597179445936792697357832656342883062881582913286862883410043210146556002771287690802853371510245270988617911741448580877733756763641325671629853911905570619187565494635768167925499916430604082881487022404239200070280294398661670933675668843427878407722736513228230480656009437445121160701443741961480416652804120736075864242644004795103982132165450526151087909281076311070148819931756643514058619305492376194725737815606077220873355286084943738321803720056852549276564984241770731773891644955311679522719123227664962968669310236867967431985020287450478334877819904698107284198496483187933033717814364605016821985840044150260235872946060427907675841108763233072909637583231985298412891007212325322700205519881516976837727500239566799444307115115336381478406666751858222393670645487608405971692195939410126381607162861234171096604958027538187274229715380207755710149534438482371450202825502172870839939566868986396510615146624665957719771822685968265223790607091800562226715369559");

console.log(bigInt(n).toString(2));*/
