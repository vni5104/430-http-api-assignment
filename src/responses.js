const respond = (request, response, statusCode, id, message) => {
    //default dataType to 'application/json' if it's not 'text/xml'
    const dataType = request.headers['accept'] === 'text/xml' ? 'text/xml' : 'application/json';

    let content;
    if (dataType === 'text/xml') {
        content = `<response><message>${message}</message><id>${id}</id></response>`;
    } else {
        content = JSON.stringify({message: message, id: id});
    }

    response.writeHead(statusCode, { 'Content-Type': dataType});
    response.write(content);
    response.end();
}

//Handle success response (which only has message field)
const respondSuccess = (request, response, statusCode, message) => {
    const dataType = request.headers['accept'] === 'text/xml' ? 'text/xml' : 'application/json';

    let content;
    if (dataType === 'text/xml') {
        content = `<response><message>${message}</message></response>`;
    } else {
        content = JSON.stringify({message: message});
    }

    response.writeHead(statusCode, { 'Content-Type': dataType});
    response.write(content);
    response.end();
}

const message200 = 'This is a successful response.';

const success = (request, response) => respondSuccess(request, response, 200, message200);

const badRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const url = new URL(request.url, `${protocol}://${request.headers.host}`);
    
    const valid = url.searchParams.get('valid');
    //console.log(valid);

    const id = 'badRequest';
    const message = 'Missing valid query parameter set to true.';

    if (valid === 'true') {
        respondSuccess(request, response, 200, message200);
    } else {
        respond(request, response, 400, id, message);
    }
};

const unauthorized = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const url = new URL(request.url, `${protocol}://${request.headers.host}`);
    
    const loggedIn = url.searchParams.get('loggedIn');

    const id = 'unauthorized';
    const message = 'Missing loggedIn query parameter set to yes.';

    if (loggedIn === 'yes') {
        respondSuccess(request, response, 200, message200);
    } else {
        respond(request, response, 401, id, message);
    }
};

const forbidden = (request, response) => {
    const id = 'forbidden';
    const message = 'You do not have access to this content.';

    respond(request, response, 403, id, message);
};

const internal = (request, response) => {
    const id = 'internalError';
    const message = 'Internal Server Error. Something went wrong.';

    respond(request, response, 500, id, message);
};

const notImplemented = (request, response) => {
    const id = 'notImplemented';
    const message = 'A request for this page has not been implemented yet. Check again later for updated content.';

    respond(request, response, 501, id, message);
};

const notFound = (request, response) => {
    const id = 'notFound';
    const message = 'The page you are looking for was not found.';

    respond(request, response, 404, id, message);
};

module.exports = {
    success,
    badRequest,
    unauthorized, 
    forbidden,
    internal,
    notImplemented,
    notFound,
};