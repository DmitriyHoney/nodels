'use strict';

const stream = require('node:stream');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

class CustomReadable extends stream.Readable {
    constructor(filename, maxSizeBytes = 1300) {
        super();
        this.filename = filename;
        this.maxSizeBytes = maxSizeBytes;
        this.fd = null;
    }
    _construct(callback) {
        console.log('_construct');
        fs.stat(this.filename, (err, stats) => {
            if (err) callback(err);
            if (stats.size > this.maxSizeBytes) callback(new Error(`File size ${stats.size}, but max size ${this.maxSizeBytes}`));
            fs.open(this.filename, (err, fd) => {
                if (err) callback(err);
                else {
                    this.fd = fd;
                    callback();
                }
            });
        });

    }
    _read(size) {
        console.log('_read');
        const buf = Buffer.alloc(size);

        fs.read(this.fd, buf, 0, size, null, (err, bytesRead) => {
            if (err) {
                this.destroy(err);
            } else {
                this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
            }
        });
    }
    _destroy(err, callback) {
        console.log('_destroy');
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err));
        } else {
            callback(err);
        }
    }
}


class ToUpperCaseStream extends stream.Transform {
    constructor(options) {
        super(options);
    }
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}
const PORT = 3000;

http.createServer((req, res) => {
    if (req.method !== 'POST') {
        res.statusCode = 400;
        res.end('Bad request');
    }
    req.pipe(new ToUpperCaseStream({ encoding: 'utf8' })).pipe(res);
}).listen(PORT, () => console.log(`Server listen on http://localhost:${PORT}`))

