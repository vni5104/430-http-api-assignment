const respond = (request, response, content, statusCode, type) => {
    // const dataType = request.headers['accept'];
    // console.log("respond type: " + dataType);
    response.writeHead(statusCode, { 'Content-Type': type});
    response.write(content);
    response.end();
}

const respondXML = (req, res, code, id, message) => {
    const content = `<response><id>${id}</id><message>${message}</message></response>`;
    respond(req, res, content, code, 'text/xml');
}
const respondJSON = (req, res, code, id, message) => {
    const content = JSON.stringify({id:id, message: message});
    respond(req, res, content, code, 'application/json');
};

const success = (request, response) => {
    const id = "success";
    const message = "This is a successful response.";

    const type = request.headers['accept'];

    if (type === "text/xml") {
        respondXML(request, response, 200, id, message);
    } else { //return JSON by default
        respondJSON(request, response, 200, id, message);
    }
};

const badRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const url = new URL(request.url, `${protocol}://${request.headers.host}`);
    const valid = url.searchParams.get("valid"); //params.get("valid");
    console.log(valid);
    
    const type = request.headers['accept'];

    const successId = "success";
    const successMessage = "This is a successful response.";

    const badId = "badRequest";
    const badMessage = "Missing valid query parameter set to true."

    if (valid === 'true') {
        if (type === "text/xml") {
            respondXML(request, response, 200, successId, successMessage);
        } else {
            respondJSON(request, response, 200, successId, successMessage);
        }
    } else {
        if (type === "text/xml") {
            respondXML(request, response, 400, badId, badMessage);
        } else {
            respondJSON(request, response, 400, badId, badMessage);
        }
    }
};

const unauthorized = (request, response) => {
    const loggedIn = request.body;

    const successId = "success";
    const successMessage = "This is a successful response.";

    const unauthId = "unauthorized";
    const unauthMessage = "Missing loggedIn query parameter set to yes";

    if (loggedIn) {
        if (type === "text/xml") {
            respondXML(request, response, 400, successId, successMessage);
        } else {
            respondJSON(request, response, 400, successId, successMessage);
        }
    } else {
        if (type === "text/xml") {
            respondXML(request, response, 401, unauthId, unauthMessage);
        } else {
            respondJSON(request, response, 401, unauthId, unauthMessage);
        }
    }

    //id: "unauthorized"
    //message: "Missing loggedIn query parameter set to yes"
};

const forbidden = () => {
    //id: "forbidden"
    //message: "You do not have access to this content"
};

const internal = () => {
    //id: "unauthorized"
    //message: "Internal Server Error. Something went wrong"
};

const notImplemented = () => {
    //id: "notImplemented"
    //message: "A request for this page has not been implemented yet. Check again later for updated content."
};

const notFound = (request, response) => {
    //id: "notFound"
    //message: "The page you are looking for was not found."
    respondJSON(request, response, 404, 'notFound', 'The page you are looking for was not found.');
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