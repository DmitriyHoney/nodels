'use strict';
const os = require('node:os');
const { Transform } = require('node:stream');
class LineSplitStream extends Transform {
    constructor(options) {
        super(options);
        this.sep = os.EOL;
    }
    _transform(chunk, encoding, callback) {
        const strChunk = chunk.toString();
        const arr = strChunk.split(this.sep);
        while(arr.length) {
            this.push(arr.shift());
        }
        callback();
    }
}

// Usage
new LineSplitStream({ encoding: 'utf8'})
    .on('data', console.log)
    .write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);
