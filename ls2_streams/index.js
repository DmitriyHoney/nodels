// streams
// Readable, Writable, Transform, Duplex

const fs = require('node:fs')
const zlib = require('node:zlib');

const streamReadable = fs.createReadStream(__filename, {
    highWaterMark: 500, // в байтах, сколько в одном чанке будет информации
    encoding: 'utf8', // кодировка
});

// paused | flowing === перевод стрима в состояние flowing:
// 1. streamReadable.pipe(fs.createWriteStream(`${__filename}.copy`))
// 2. streamReadable.on('data', (chunk) => {});
// 3. streamReadable.resume(); - явный перевод (обратный метод stream.paused())

// цепочка стримов с помощью метода pipe
// const gzip = zlib.createGzip();
// const output = fs.createWriteStream(`${__filename}.gzip`);
//
// streamReadable.pipe(gzip).pipe(output);

// Стараться всегда обрабатывать ошибки стримов
// streamReadable.on('error', (err) => {
//     console.log(err);
// });

// events 'end' - Readable | 'finish' - Writable - выполняются в случае успеха
// 'close' - выполняется всегда

// Buffer
