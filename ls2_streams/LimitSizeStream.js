'use strict';
const { Transform } = require('node:stream');
const fs = require('node:fs');


class LimitExceededError extends Error {
    constructor({ maxSize = 0, curSize = 0}) {
        super(`LimitExceededError: max file size must be ${maxSize}, current size ${curSize}`);
    }
}
class LimitSizeStream extends Transform {
    constructor(options = {}) {
        super(options);
        this.limit = options.limit || 1024;
        this.currentSize = 0;
    }
    _transform(chunk, encoding, callback) {
        this.currentSize +=  chunk.length;
        if (this.currentSize > this.limit) {
            return callback(new LimitExceededError({ maxSize: this.limit, curSize: this.currentSize }))
        }
        this.push(chunk);
        callback();
    }
}

// Usage

const limitedStream = new LimitSizeStream({ limit: 8 });
const outStream = fs.createWriteStream('text.txt');

limitedStream.pipe(outStream);
limitedStream.write('hello');

limitedStream.on('error', (err) => {
    console.log(111, err);
})

setTimeout(() => {
    limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
    console.log(222)
}, 10);
