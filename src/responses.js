const respond = (request, response, statusCode, id, message) => {
    const dataType= request.headers['accept'] === 'text/xml' ? 'text/xml' : 'application/json';

    let content;
    if (dataType === 'text/xml') {
        content = `<response><id>${id}</id><message>${message}</message></response>`;
    } else {
        content = JSON.stringify({id:id, message: message});
    }

    response.writeHead(statusCode, { 'Content-Type': dataType});
    response.write(content);
    response.end();
}


const id200 = 'success';
const message200 = 'This is a successful response.';

const success = (request, response) => respond(request, response, 200, id200, message200);

const badRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const url = new URL(request.url, `${protocol}://${request.headers.host}`);
    
    const valid = url.searchParams.get('valid');
    //console.log(valid);

    const id = 'badRequest';
    const message = 'Missing valid query parameter set to true.';

    if (valid === 'true') {
        respond(request, response, 200, id200, message200);
    } else {
        respond(request, response, 400, id, message);
    }
};

const unauthorized = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const url = new URL(request.url, `${protocol}://${request.headers.host}`);
    
    const loggedIn = url.searchParams.get('loggedIn');

    const id = 'unauthorized';
    const message = 'Missing loggedIn query parameter set to yes';

    if (loggedIn === 'yes') {
        respond(request, response, 200, id200, message200);
    } else {
        respond(request, response, 401, id, message);
    }
};

const forbidden = (request, response) => {
    const id = 'forbidden';
    const message = 'You do not have access to this content';

    respond(request, response, 403, id, message);
};

const internal = (request, response) => {
    const id = 'internalError';
    const message = 'Internal Server Error. Something went wrong';

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