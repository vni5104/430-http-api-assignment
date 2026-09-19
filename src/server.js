const http = require('http');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.port || process.env.NODE_PORT || 3000;

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});