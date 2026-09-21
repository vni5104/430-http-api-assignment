const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.port || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': responseHandler.success,
    '/badRequest': responseHandler.badRequest,
    '/unauthorized': responseHandler.unauthorized,
    '/forbidden': responseHandler.forbidden,
    '/internal': responseHandler.internal,
    '/notImplemented': responseHandler.notImplemented,
    default: responseHandler.notFound
};

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        console.log(bodyString);

        if(type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else if (type === 'text/xml') {
            const parser = new DOMParser();
            request.body = parser.parseFromString(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'invalid data format' }));
            return response.end();
        }

        handler(request, response);
    });
}

const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    //console.log("58 " + parsedURL.searchParams.get('valid'));
    
    const handler = urlStruct[parsedURL.pathname];

    if (handler) {
        handler(request, response);
    } else {
        urlStruct.default(request, response);
    }

    // switch (parsedURL.pathname) {
    //     case '/':
    //     case '/style.css':
    //         handler(request, response);
    //         break;
    //     default: 
    //         parseBody(request, response, handler);
    //         break;
    // }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});