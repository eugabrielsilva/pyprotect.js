# pyprotect.js
This is a simple Javascript tool to obfuscate Python codes and "hide" their sources.

## About
This is an open source distribution of my old project pyprotect. The project has been shut down and will no longer be maintained.

The original project was made in PHP and intended to be used as an online server-side tool, so this is a port of the project for Node.js.

## How to use
You need Node.js installed before everything.

Open your terminal, go to pyprotect.js folder and run:

```
node pyprotect.js <file-to-encrypt.py> <encrypted-file.py>
```

The first argument is the **origin file** (the file to be encrypted) and the second the **destination file** (the target file for the result).

## Disclaimer
Please note that this is not an advanced encryption tool and it's intended only to prevent your code from being read by those who don't know programming very well. 

It is definitely possible to decrypt the code using basic programming skills, so do not use this tool to hide important information neither think that your code won't ever be cracked.

**Please do not use this tool to encrypt malicious or inappropriate code.**

## Dependencies
- [Locutus](https://github.com/locutusjs/locutus)