# node-RSA

A node.js CLI tool for encrypting and decrypting text files.

Usage:
```
node main.js -g [BITLENGTH] [PUBLIC_KEY_FILE] [PRIVATE_KEY_FILE]
node main.js -e [PUBLIC_KEY_FILE] [SOURCE_FILE]
node main.js -d [PRIVATE_KEY_FILE] [SOURCE_FILE]
```
The `-e` and `-d` variants output to STDOUT by default.
