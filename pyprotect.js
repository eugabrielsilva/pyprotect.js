const fs = require('fs');
const strings = require('locutus/php/strings');

/**
 * Console arguments
 */
const args = process.argv.slice(2);

/**
 * Used keywords from **getKeyword()** function
 */
const usedKeywords = new Set();

/**
 * Encodes a string to an UTF-8 representation
 */
function encodeUTF8(string) {
    // Encodes string to hex
    string = strings.bin2hex(string);

    // Splits string into chunks with "\x" character appended
    return '\\x' + strings.chunk_split(string, 2, "\\x").slice(0, -2);
}

/**
 * Gets a random keyword from the **keywords.txt** file
 */
function getKeyword() {
    // Reads whole keywords file and pick a random line
    let content = fs.readFileSync('keywords.txt', 'utf-8').split('\n');
    let word = content[Math.floor(Math.random() * content.length)];

    // Checks if the keyword was already used and stores it for further checking
    while(usedKeywords.has(word)) {
        word = content[Math.floor(Math.random() * content.length)];
    }

    // Adds the keyword to the list before returning it
    usedKeywords.add(word);
    return word.trim();
}

/**
 * Encrypts the file
 */
function encrypt(filename, target) {
    try {
        // Checks if the file exists
        if(!fs.existsSync(filename)) {
            console.error(`\nFile ${filename} does not exist\n`);
            process.exit();
        }

        // Reads the file using base64 encoding
        let encode = fs.readFileSync(filename, 'base64');

        // Splits the encoded file into 4 parts
        let parts = encode.match(new RegExp('.{1,' + (encode.length / 4) + '}', 'g'));

        // Reencodes each part using string manipulation methods
        parts[0] = encodeUTF8(strings.strrev(parts[0]));
        parts[1] = encodeUTF8(strings.str_rot13(parts[1]));
        parts[2] = encodeUTF8(parts[2]);
        parts[3] = encodeUTF8(strings.str_rot13(parts[3]));

        // Gets the random keywords
        let keywords = [];
        for(let i = 0; i < 6; i++) {
            keywords[i] = getKeyword();
        }

        // Creates result file
        let result = `# -*- coding: utf-8 -*-\r\n\r\nimport base64, codecs\r\n${keywords[0]} = '${parts[0]}'\r\n${keywords[1]} = '${parts[1]}'\r\n${keywords[2]} = '${parts[2]}'\r\n${keywords[3]} = '${parts[3]}'\r\n${keywords[4]} = '\\x72\\x6f\\x74\\x31\\x33'\r\n${keywords[5]} = eval('${encodeUTF8(keywords[0])}\\x5b\\x3a\\x3a\\x2d\\x31\\x5d') + eval('\\x63\\x6f\\x64\\x65\\x63\\x73\\x2e\\x64\\x65\\x63\\x6f\\x64\\x65\\x28${encodeUTF8(keywords[1])}\\x2c\\x20${encodeUTF8(keywords[4])}\\x29') + eval('${encodeUTF8(keywords[2])}') + eval('\\x63\\x6f\\x64\\x65\\x63\\x73\\x2e\\x64\\x65\\x63\\x6f\\x64\\x65\\x28${encodeUTF8(keywords[3])}\\x2c\\x20${encodeUTF8(keywords[4])}\\x29')\r\neval(compile(base64.b64decode(eval('${encodeUTF8(keywords[5])}')), '<string>', 'exec'))`;

        // Writes the result file
        fs.writeFileSync(target, result);

        // Success
        console.log('\nFile encrypted successfully\n');
    } catch(error) {
        console.error('\nAn unexpected error has ocurred\n\n');
        throw error;
    }
}

// Heres where the magic happens
if(!args[0] || !args[1]) {
    console.error('\nYou must specify the origin and destination files\n\n  use --> node pyprotect.js <file-to-encrypt.py> <encrypted-file.py>\n');
    process.exit();
} else {
    encrypt(args[0].trim(), args[1].trim())
}