/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 93776:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: function() { return /* binding */ HTTPClient; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31635);
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @class
 * Class representing HTTPClient
 */
class HTTPClient {
    /**
     * @public
     * @constructor
     * Creates an instance of a HTTPClient
     * @param {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
     */
    constructor(...middleware) {
        if (!middleware || !middleware.length) {
            const error = new Error();
            error.name = "InvalidMiddlewareChain";
            error.message = "Please provide a default middleware chain or custom middleware chain";
            throw error;
        }
        this.setMiddleware(...middleware);
    }
    /**
     * @private
     * Processes the middleware parameter passed to set this.middleware property
     * The calling function should validate if middleware is not undefined or not empty.
     * @param {...Middleware} middleware - The middleware passed
     * @returns Nothing
     */
    setMiddleware(...middleware) {
        if (middleware.length > 1) {
            this.parseMiddleWareArray(middleware);
        }
        else {
            this.middleware = middleware[0];
        }
    }
    /**
     * @private
     * Processes the middleware array to construct the chain
     * and sets this.middleware property to the first middleware handler of the array
     * The calling function should validate if middleware is not undefined or not empty
     * @param {Middleware[]} middlewareArray - The array of middleware handlers
     * @returns Nothing
     */
    parseMiddleWareArray(middlewareArray) {
        middlewareArray.forEach((element, index) => {
            if (index < middlewareArray.length - 1) {
                element.setNext(middlewareArray[index + 1]);
            }
        });
        this.middleware = middlewareArray[0];
    }
    /**
     * @public
     * @async
     * To send the request through the middleware chain
     * @param {Context} context - The context of a request
     * @returns A promise that resolves to the Context
     */
    sendRequest(context) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(this, void 0, void 0, function* () {
            if (typeof context.request === "string" && context.options === undefined) {
                const error = new Error();
                error.name = "InvalidRequestOptions";
                error.message = "Unable to execute the middleware, Please provide valid options for a request";
                throw error;
            }
            yield this.middleware.execute(context);
            return context;
        });
    }
}
//# sourceMappingURL=HTTPClient.js.map

/***/ }),

/***/ 68454:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Kj: function() { return /* reexport */ Client; }
});

// UNUSED EXPORTS: AuthenticationHandler, AuthenticationHandlerOptions, BatchRequestContent, BatchResponseContent, ChaosHandler, ChaosHandlerOptions, ChaosStrategy, CustomAuthenticationProvider, FeatureUsageFlag, FileUpload, GraphClientError, GraphError, GraphRequest, HTTPMessageHandler, LargeFileUploadTask, MiddlewareFactory, OneDriveLargeFileUploadTask, PageIterator, Range, RedirectHandler, RedirectHandlerOptions, ResponseType, RetryHandler, RetryHandlerOptions, StreamUpload, TelemetryHandler, TelemetryHandlerOptions, UploadResult, getValidRangeSize

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(31635);
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/RequestMethod.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @enum
 * Enum for RequestMethods
 * @property {string} GET - The get request type
 * @property {string} PATCH - The patch request type
 * @property {string} POST - The post request type
 * @property {string} PUT - The put request type
 * @property {string} DELETE - The delete request type
 */
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["POST"] = "POST";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
//# sourceMappingURL=RequestMethod.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/content/BatchRequestContent.js
/* provided dependency */ var Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module BatchRequestContent
 */

/**
 * @class
 * Class for handling BatchRequestContent
 */
class BatchRequestContent {
    /**
     * @private
     * @static
     * Validates the dependency chain of the requests
     *
     * Note:
     * Individual requests can depend on other individual requests. Currently, requests can only depend on a single other request, and must follow one of these three patterns:
     * 1. Parallel - no individual request states a dependency in the dependsOn property.
     * 2. Serial - all individual requests depend on the previous individual request.
     * 3. Same - all individual requests that state a dependency in the dependsOn property, state the same dependency.
     * As JSON batching matures, these limitations will be removed.
     * @see {@link https://developer.microsoft.com/en-us/graph/docs/concepts/known_issues#json-batching}
     *
     * @param {Map<string, BatchRequestStep>} requests - The map of requests.
     * @returns The boolean indicating the validation status
     */
    static validateDependencies(requests) {
        const isParallel = (reqs) => {
            const iterator = reqs.entries();
            let cur = iterator.next();
            while (!cur.done) {
                const curReq = cur.value[1];
                if (curReq.dependsOn !== undefined && curReq.dependsOn.length > 0) {
                    return false;
                }
                cur = iterator.next();
            }
            return true;
        };
        const isSerial = (reqs) => {
            const iterator = reqs.entries();
            let cur = iterator.next();
            const firstRequest = cur.value[1];
            if (firstRequest.dependsOn !== undefined && firstRequest.dependsOn.length > 0) {
                return false;
            }
            let prev = cur;
            cur = iterator.next();
            while (!cur.done) {
                const curReq = cur.value[1];
                if (curReq.dependsOn === undefined || curReq.dependsOn.length !== 1 || curReq.dependsOn[0] !== prev.value[1].id) {
                    return false;
                }
                prev = cur;
                cur = iterator.next();
            }
            return true;
        };
        const isSame = (reqs) => {
            const iterator = reqs.entries();
            let cur = iterator.next();
            const firstRequest = cur.value[1];
            let dependencyId;
            if (firstRequest.dependsOn === undefined || firstRequest.dependsOn.length === 0) {
                dependencyId = firstRequest.id;
            }
            else {
                if (firstRequest.dependsOn.length === 1) {
                    const fDependencyId = firstRequest.dependsOn[0];
                    if (fDependencyId !== firstRequest.id && reqs.has(fDependencyId)) {
                        dependencyId = fDependencyId;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            cur = iterator.next();
            while (!cur.done) {
                const curReq = cur.value[1];
                if ((curReq.dependsOn === undefined || curReq.dependsOn.length === 0) && dependencyId !== curReq.id) {
                    return false;
                }
                if (curReq.dependsOn !== undefined && curReq.dependsOn.length !== 0) {
                    if (curReq.dependsOn.length === 1 && (curReq.id === dependencyId || curReq.dependsOn[0] !== dependencyId)) {
                        return false;
                    }
                    if (curReq.dependsOn.length > 1) {
                        return false;
                    }
                }
                cur = iterator.next();
            }
            return true;
        };
        if (requests.size === 0) {
            const error = new Error("Empty requests map, Please provide at least one request.");
            error.name = "Empty Requests Error";
            throw error;
        }
        return isParallel(requests) || isSerial(requests) || isSame(requests);
    }
    /**
     * @private
     * @static
     * @async
     * Converts Request Object instance to a JSON
     * @param {IsomorphicRequest} request - The IsomorphicRequest Object instance
     * @returns A promise that resolves to JSON representation of a request
     */
    static getRequestData(request) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const requestData = {
                url: "",
            };
            const hasHttpRegex = new RegExp("^https?://");
            // Stripping off hostname, port and url scheme
            requestData.url = hasHttpRegex.test(request.url) ? "/" + request.url.split(/.*?\/\/.*?\//)[1] : request.url;
            requestData.method = request.method;
            const headers = {};
            request.headers.forEach((value, key) => {
                headers[key] = value;
            });
            if (Object.keys(headers).length) {
                requestData.headers = headers;
            }
            if (request.method === RequestMethod.PATCH || request.method === RequestMethod.POST || request.method === RequestMethod.PUT) {
                requestData.body = yield BatchRequestContent.getRequestBody(request);
            }
            /**
             * TODO: Check any other property needs to be used from the Request object and add them
             */
            return requestData;
        });
    }
    /**
     * @private
     * @static
     * @async
     * Gets the body of a Request object instance
     * @param {IsomorphicRequest} request - The IsomorphicRequest object instance
     * @returns The Promise that resolves to a body value of a Request
     */
    static getRequestBody(request) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            let bodyParsed = false;
            let body;
            try {
                const cloneReq = request.clone();
                body = yield cloneReq.json();
                bodyParsed = true;
            }
            catch (e) {
                //TODO- Handle empty catches
            }
            if (!bodyParsed) {
                try {
                    if (typeof Blob !== "undefined") {
                        const blob = yield request.blob();
                        const reader = new FileReader();
                        body = yield new Promise((resolve) => {
                            reader.addEventListener("load", () => {
                                const dataURL = reader.result;
                                /**
                                 * Some valid dataURL schemes:
                                 *  1. data:text/vnd-example+xyz;foo=bar;base64,R0lGODdh
                                 *  2. data:text/plain;charset=UTF-8;page=21,the%20data:1234,5678
                                 *  3. data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
                                 *  4. data:image/png,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
                                 *  5. data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
                                 * @see Syntax {@link https://en.wikipedia.org/wiki/Data_URI_scheme} for more
                                 */
                                const regex = new RegExp("^s*data:(.+?/.+?(;.+?=.+?)*)?(;base64)?,(.*)s*$");
                                const segments = regex.exec(dataURL);
                                resolve(segments[4]);
                            }, false);
                            reader.readAsDataURL(blob);
                        });
                    }
                    else if (typeof Buffer !== "undefined") {
                        const buffer = yield request.buffer();
                        body = buffer.toString("base64");
                    }
                    bodyParsed = true;
                }
                catch (e) {
                    // TODO-Handle empty catches
                }
            }
            return body;
        });
    }
    /**
     * @public
     * @constructor
     * Constructs a BatchRequestContent instance
     * @param {BatchRequestStep[]} [requests] - Array of requests value
     * @returns An instance of a BatchRequestContent
     */
    constructor(requests) {
        this.requests = new Map();
        if (typeof requests !== "undefined") {
            const limit = BatchRequestContent.requestLimit;
            if (requests.length > limit) {
                const error = new Error(`Maximum requests limit exceeded, Max allowed number of requests are ${limit}`);
                error.name = "Limit Exceeded Error";
                throw error;
            }
            for (const req of requests) {
                this.addRequest(req);
            }
        }
    }
    /**
     * @public
     * Adds a request to the batch request content
     * @param {BatchRequestStep} request - The request value
     * @returns The id of the added request
     */
    addRequest(request) {
        const limit = BatchRequestContent.requestLimit;
        if (request.id === "") {
            const error = new Error(`Id for a request is empty, Please provide an unique id`);
            error.name = "Empty Id For Request";
            throw error;
        }
        if (this.requests.size === limit) {
            const error = new Error(`Maximum requests limit exceeded, Max allowed number of requests are ${limit}`);
            error.name = "Limit Exceeded Error";
            throw error;
        }
        if (this.requests.has(request.id)) {
            const error = new Error(`Adding request with duplicate id ${request.id}, Make the id of the requests unique`);
            error.name = "Duplicate RequestId Error";
            throw error;
        }
        this.requests.set(request.id, request);
        return request.id;
    }
    /**
     * @public
     * Removes request from the batch payload and its dependencies from all dependents
     * @param {string} requestId - The id of a request that needs to be removed
     * @returns The boolean indicating removed status
     */
    removeRequest(requestId) {
        const deleteStatus = this.requests.delete(requestId);
        const iterator = this.requests.entries();
        let cur = iterator.next();
        /**
         * Removing dependencies where this request is present as a dependency
         */
        while (!cur.done) {
            const dependencies = cur.value[1].dependsOn;
            if (typeof dependencies !== "undefined") {
                const index = dependencies.indexOf(requestId);
                if (index !== -1) {
                    dependencies.splice(index, 1);
                }
                if (dependencies.length === 0) {
                    delete cur.value[1].dependsOn;
                }
            }
            cur = iterator.next();
        }
        return deleteStatus;
    }
    /**
     * @public
     * @async
     * Serialize content from BatchRequestContent instance
     * @returns The body content to make batch request
     */
    getContent() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const requests = [];
            const requestBody = {
                requests,
            };
            const iterator = this.requests.entries();
            let cur = iterator.next();
            if (cur.done) {
                const error = new Error("No requests added yet, Please add at least one request.");
                error.name = "Empty Payload";
                throw error;
            }
            if (!BatchRequestContent.validateDependencies(this.requests)) {
                const error = new Error(`Invalid dependency found, Dependency should be:
1. Parallel - no individual request states a dependency in the dependsOn property.
2. Serial - all individual requests depend on the previous individual request.
3. Same - all individual requests that state a dependency in the dependsOn property, state the same dependency.`);
                error.name = "Invalid Dependency";
                throw error;
            }
            while (!cur.done) {
                const requestStep = cur.value[1];
                const batchRequestData = (yield BatchRequestContent.getRequestData(requestStep.request));
                /**
                 * @see{@https://tools.ietf.org/html/rfc7578#section-4.4}
                 * TODO- Setting/Defaulting of content-type header to the correct value
                 * @see {@link https://developer.microsoft.com/en-us/graph/docs/concepts/json_batching#request-format}
                 */
                if (batchRequestData.body !== undefined && (batchRequestData.headers === undefined || batchRequestData.headers["content-type"] === undefined)) {
                    const error = new Error(`Content-type header is not mentioned for request #${requestStep.id}, For request having body, Content-type header should be mentioned`);
                    error.name = "Invalid Content-type header";
                    throw error;
                }
                batchRequestData.id = requestStep.id;
                if (requestStep.dependsOn !== undefined && requestStep.dependsOn.length > 0) {
                    batchRequestData.dependsOn = requestStep.dependsOn;
                }
                requests.push(batchRequestData);
                cur = iterator.next();
            }
            requestBody.requests = requests;
            return requestBody;
        });
    }
    /**
     * @public
     * Adds a dependency for a given dependent request
     * @param {string} dependentId - The id of the dependent request
     * @param {string} [dependencyId] - The id of the dependency request, if not specified the preceding request will be considered as a dependency
     * @returns Nothing
     */
    addDependency(dependentId, dependencyId) {
        if (!this.requests.has(dependentId)) {
            const error = new Error(`Dependent ${dependentId} does not exists, Please check the id`);
            error.name = "Invalid Dependent";
            throw error;
        }
        if (typeof dependencyId !== "undefined" && !this.requests.has(dependencyId)) {
            const error = new Error(`Dependency ${dependencyId} does not exists, Please check the id`);
            error.name = "Invalid Dependency";
            throw error;
        }
        if (typeof dependencyId !== "undefined") {
            const dependent = this.requests.get(dependentId);
            if (dependent.dependsOn === undefined) {
                dependent.dependsOn = [];
            }
            if (dependent.dependsOn.indexOf(dependencyId) !== -1) {
                const error = new Error(`Dependency ${dependencyId} is already added for the request ${dependentId}`);
                error.name = "Duplicate Dependency";
                throw error;
            }
            dependent.dependsOn.push(dependencyId);
        }
        else {
            const iterator = this.requests.entries();
            let prev;
            let cur = iterator.next();
            while (!cur.done && cur.value[1].id !== dependentId) {
                prev = cur;
                cur = iterator.next();
            }
            if (typeof prev !== "undefined") {
                const dId = prev.value[0];
                if (cur.value[1].dependsOn === undefined) {
                    cur.value[1].dependsOn = [];
                }
                if (cur.value[1].dependsOn.indexOf(dId) !== -1) {
                    const error = new Error(`Dependency ${dId} is already added for the request ${dependentId}`);
                    error.name = "Duplicate Dependency";
                    throw error;
                }
                cur.value[1].dependsOn.push(dId);
            }
            else {
                const error = new Error(`Can't add dependency ${dependencyId}, There is only a dependent request in the batch`);
                error.name = "Invalid Dependency Addition";
                throw error;
            }
        }
    }
    /**
     * @public
     * Removes a dependency for a given dependent request id
     * @param {string} dependentId - The id of the dependent request
     * @param {string} [dependencyId] - The id of the dependency request, if not specified will remove all the dependencies of that request
     * @returns The boolean indicating removed status
     */
    removeDependency(dependentId, dependencyId) {
        const request = this.requests.get(dependentId);
        if (typeof request === "undefined" || request.dependsOn === undefined || request.dependsOn.length === 0) {
            return false;
        }
        if (typeof dependencyId !== "undefined") {
            const index = request.dependsOn.indexOf(dependencyId);
            if (index === -1) {
                return false;
            }
            request.dependsOn.splice(index, 1);
            return true;
        }
        else {
            delete request.dependsOn;
            return true;
        }
    }
}
/**
 * @private
 * @static
 * Limit for number of requests {@link - https://developer.microsoft.com/en-us/graph/docs/concepts/known_issues#json-batching}
 */
BatchRequestContent.requestLimit = 20;
//# sourceMappingURL=BatchRequestContent.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/Constants.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module Constants
 */
/**
 * @constant
 * A Default API endpoint version for a request
 */
const GRAPH_API_VERSION = "v1.0";
/**
 * @constant
 * A Default base url for a request
 */
const GRAPH_BASE_URL = "https://graph.microsoft.com/";
/**
 * To hold list of the service root endpoints for Microsoft Graph and Graph Explorer for each national cloud.
 * Set(iterable:Object) is not supported in Internet Explorer. The consumer is recommended to use a suitable polyfill.
 */
const GRAPH_URLS = new Set(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]);
//# sourceMappingURL=Constants.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphClientError.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module GraphClientError
 */
/**
 * @class
 * Create GraphClientError object to handle client-side errors
 * encountered within the JavaScript Client SDK.
 * Whereas GraphError Class should be used to handle errors in the response from the Graph API.
 */
class GraphClientError_GraphClientError extends Error {
    /**
     * @public
     * @static
     * @async
     * To set the GraphClientError object
     * @param {any} error - The error returned encountered by the Graph JavaScript Client SDK while processing request
     * @returns GraphClientError object set to the error passed
     */
    static setGraphClientError(error) {
        let graphClientError;
        if (error instanceof Error) {
            graphClientError = error;
        }
        else {
            graphClientError = new GraphClientError_GraphClientError();
            graphClientError.customError = error;
        }
        return graphClientError;
    }
    /**
     * @public
     * @constructor
     * Creates an instance of GraphClientError
     * @param {string} message? - Error message
     * @returns An instance of GraphClientError
     */
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, GraphClientError_GraphClientError.prototype);
    }
}
//# sourceMappingURL=GraphClientError.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphRequestUtil.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module GraphRequestUtil
 */


/**
 * To hold list of OData query params
 */
const oDataQueryNames = ["$select", "$expand", "$orderby", "$filter", "$top", "$skip", "$skipToken", "$count"];
/**
 * To construct the URL by appending the segments with "/"
 * @param {string[]} urlSegments - The array of strings
 * @returns The constructed URL string
 */
const urlJoin = (urlSegments) => {
    const removePostSlash = (s) => s.replace(/\/+$/, "");
    const removePreSlash = (s) => s.replace(/^\/+/, "");
    const joiner = (pre, cur) => [removePostSlash(pre), removePreSlash(cur)].join("/");
    const parts = Array.prototype.slice.call(urlSegments);
    return parts.reduce(joiner);
};
/**
 * Serializes the content
 * @param {any} content - The content value that needs to be serialized
 * @returns The serialized content
 *
 * Note:
 * This conversion is required due to the following reasons:
 * Body parameter of Request method of isomorphic-fetch only accepts Blob, ArrayBuffer, FormData, TypedArrays string.
 * Node.js platform does not support Blob, FormData. Javascript File object inherits from Blob so it is also not supported in node. Therefore content of type Blob, File, FormData will only come from browsers.
 * Parallel to ArrayBuffer in javascript, node provides Buffer interface. Node's Buffer is able to send the arbitrary binary data to the server successfully for both Browser and Node platform. Whereas sending binary data via ArrayBuffer or TypedArrays was only possible using Browser. To support both Node and Browser, `serializeContent` converts TypedArrays or ArrayBuffer to `Node Buffer`.
 * If the data received is in JSON format, `serializeContent` converts the JSON to string.
 */
const serializeContent = (content) => {
    const className = content && content.constructor && content.constructor.name;
    if (className === "Buffer" || className === "Blob" || className === "File" || className === "FormData" || typeof content === "string") {
        return content;
    }
    if (className === "ArrayBuffer") {
        content = Buffer.from(content);
    }
    else if (className === "Int8Array" || className === "Int16Array" || className === "Int32Array" || className === "Uint8Array" || className === "Uint16Array" || className === "Uint32Array" || className === "Uint8ClampedArray" || className === "Float32Array" || className === "Float64Array" || className === "DataView") {
        content = Buffer.from(content.buffer);
    }
    else {
        try {
            content = JSON.stringify(content);
        }
        catch (error) {
            throw new Error("Unable to stringify the content");
        }
    }
    return content;
};
/**
 * Checks if the url is one of the service root endpoints for Microsoft Graph and Graph Explorer.
 * @param {string} url - The url to be verified
 * @returns {boolean} - Returns true if the url is a Graph URL
 */
const isGraphURL = (url) => {
    return isValidEndpoint(url);
};
/**
 * Checks if the url is for one of the custom hosts provided during client initialization
 * @param {string} url - The url to be verified
 * @param {Set} customHosts - The url to be verified
 * @returns {boolean} - Returns true if the url is a for a custom host
 */
const isCustomHost = (url, customHosts) => {
    customHosts.forEach((host) => isCustomHostValid(host));
    return isValidEndpoint(url, customHosts);
};
/**
 * Checks if the url is for one of the provided hosts.
 * @param {string} url - The url to be verified
 * @param {Set<string>} allowedHosts - A set of hosts.
 * @returns {boolean} - Returns true is for one of the provided endpoints.
 */
const isValidEndpoint = (url, allowedHosts = GRAPH_URLS) => {
    // Valid Graph URL pattern - https://graph.microsoft.com/{version}/{resource}?{query-parameters}
    // Valid Graph URL example - https://graph.microsoft.com/v1.0/
    url = url.toLowerCase();
    if (url.indexOf("https://") !== -1) {
        url = url.replace("https://", "");
        // Find where the host ends
        const startofPortNoPos = url.indexOf(":");
        const endOfHostStrPos = url.indexOf("/");
        let hostName = "";
        if (endOfHostStrPos !== -1) {
            if (startofPortNoPos !== -1 && startofPortNoPos < endOfHostStrPos) {
                hostName = url.substring(0, startofPortNoPos);
                return allowedHosts.has(hostName);
            }
            // Parse out the host
            hostName = url.substring(0, endOfHostStrPos);
            return allowedHosts.has(hostName);
        }
    }
    return false;
};
/**
 * Throws error if the string is not a valid host/hostname and contains other url parts.
 * @param {string} host - The host to be verified
 */
const isCustomHostValid = (host) => {
    if (host.indexOf("/") !== -1) {
        throw new GraphClientError_GraphClientError("Please add only hosts or hostnames to the CustomHosts config. If the url is `http://example.com:3000/`, host is `example:3000`");
    }
};
//# sourceMappingURL=GraphRequestUtil.js.map
// EXTERNAL MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareControl.js
var middleware_MiddlewareControl = __webpack_require__(68421);
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareUtil.js
/* provided dependency */ var MiddlewareUtil_Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @constant
 * To generate the UUID
 * @returns The UUID string
 */
const MiddlewareUtil_generateUUID = () => {
    let uuid = "";
    for (let j = 0; j < 32; j++) {
        if (j === 8 || j === 12 || j === 16 || j === 20) {
            uuid += "-";
        }
        uuid += Math.floor(Math.random() * 16).toString(16);
    }
    return uuid;
};
/**
 * @constant
 * To get the request header from the request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @returns A header value for the given key from the request
 */
const getRequestHeader = (request, options, key) => {
    let value = null;
    if (typeof Request !== "undefined" && request instanceof Request) {
        value = request.headers.get(key);
    }
    else if (typeof options !== "undefined" && options.headers !== undefined) {
        if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
            value = options.headers.get(key);
        }
        else if (options.headers instanceof Array) {
            const headers = options.headers;
            for (let i = 0, l = headers.length; i < l; i++) {
                if (headers[i][0] === key) {
                    value = headers[i][1];
                    break;
                }
            }
        }
        else if (options.headers[key] !== undefined) {
            value = options.headers[key];
        }
    }
    return value;
};
/**
 * @constant
 * To set the header value to the given request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @param {string } value - The header value string
 * @returns Nothing
 */
const setRequestHeader = (request, options, key, value) => {
    if (typeof Request !== "undefined" && request instanceof Request) {
        request.headers.set(key, value);
    }
    else if (typeof options !== "undefined") {
        if (options.headers === undefined) {
            options.headers = new Headers({
                [key]: value,
            });
        }
        else {
            if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                options.headers.set(key, value);
            }
            else if (options.headers instanceof Array) {
                let i = 0;
                const l = options.headers.length;
                for (; i < l; i++) {
                    const header = options.headers[i];
                    if (header[0] === key) {
                        header[1] = value;
                        break;
                    }
                }
                if (i === l) {
                    options.headers.push([key, value]);
                }
            }
            else {
                Object.assign(options.headers, { [key]: value });
            }
        }
    }
};
/**
 * @constant
 * To append the header value to the given request
 * @param {RequestInfo} request - The request object or the url string
 * @param {FetchOptions|undefined} options - The request options object
 * @param {string} key - The header key string
 * @param {string } value - The header value string
 * @returns Nothing
 */
const appendRequestHeader = (request, options, key, value) => {
    if (typeof Request !== "undefined" && request instanceof Request) {
        request.headers.append(key, value);
    }
    else if (typeof options !== "undefined") {
        if (options.headers === undefined) {
            options.headers = new Headers({
                [key]: value,
            });
        }
        else {
            if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
                options.headers.append(key, value);
            }
            else if (options.headers instanceof Array) {
                options.headers.push([key, value]);
            }
            else if (options.headers === undefined) {
                options.headers = { [key]: value };
            }
            else if (options.headers[key] === undefined) {
                options.headers[key] = value;
            }
            else {
                options.headers[key] += `, ${value}`;
            }
        }
    }
};
/**
 * @constant
 * To clone the request with the new url
 * @param {string} url - The new url string
 * @param {Request} request - The request object
 * @returns A promise that resolves to request object
 */
const cloneRequestWithNewUrl = (newUrl, request) => (0,tslib_es6/* __awaiter */.sH)(void 0, void 0, void 0, function* () {
    const body = request.headers.get("Content-Type") ? yield request.blob() : yield MiddlewareUtil_Promise.resolve(undefined);
    const { method, headers, referrer, referrerPolicy, mode, credentials, cache, redirect, integrity, keepalive, signal } = request;
    return new Request(newUrl, { method, headers, body, referrer, referrerPolicy, mode, credentials, cache, redirect, integrity, keepalive, signal });
});
//# sourceMappingURL=MiddlewareUtil.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/AuthenticationHandlerOptions.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @class
 * @implements MiddlewareOptions
 * Class representing AuthenticationHandlerOptions
 */
class AuthenticationHandlerOptions {
    /**
     * @public
     * @constructor
     * To create an instance of AuthenticationHandlerOptions
     * @param {AuthenticationProvider} [authenticationProvider] - The authentication provider instance
     * @param {AuthenticationProviderOptions} [authenticationProviderOptions] - The authentication provider options instance
     * @returns An instance of AuthenticationHandlerOptions
     */
    constructor(authenticationProvider, authenticationProviderOptions) {
        this.authenticationProvider = authenticationProvider;
        this.authenticationProviderOptions = authenticationProviderOptions;
    }
}
//# sourceMappingURL=AuthenticationHandlerOptions.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/TelemetryHandlerOptions.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @enum
 * @property {number} NONE - The hexadecimal flag value for nothing enabled
 * @property {number} REDIRECT_HANDLER_ENABLED - The hexadecimal flag value for redirect handler enabled
 * @property {number} RETRY_HANDLER_ENABLED - The hexadecimal flag value for retry handler enabled
 * @property {number} AUTHENTICATION_HANDLER_ENABLED - The hexadecimal flag value for the authentication handler enabled
 */
var FeatureUsageFlag;
(function (FeatureUsageFlag) {
    /* eslint-disable  @typescript-eslint/naming-convention */
    FeatureUsageFlag[FeatureUsageFlag["NONE"] = 0] = "NONE";
    FeatureUsageFlag[FeatureUsageFlag["REDIRECT_HANDLER_ENABLED"] = 1] = "REDIRECT_HANDLER_ENABLED";
    FeatureUsageFlag[FeatureUsageFlag["RETRY_HANDLER_ENABLED"] = 2] = "RETRY_HANDLER_ENABLED";
    FeatureUsageFlag[FeatureUsageFlag["AUTHENTICATION_HANDLER_ENABLED"] = 4] = "AUTHENTICATION_HANDLER_ENABLED";
    /* eslint-enable  @typescript-eslint/naming-convention */
})(FeatureUsageFlag || (FeatureUsageFlag = {}));
/**
 * @class
 * @implements MiddlewareOptions
 * Class for TelemetryHandlerOptions
 */
class TelemetryHandlerOptions {
    constructor() {
        /**
         * @private
         * A member to hold the OR of feature usage flags
         */
        this.featureUsage = FeatureUsageFlag.NONE;
    }
    /**
     * @public
     * @static
     * To update the feature usage in the context object
     * @param {Context} context - The request context object containing middleware options
     * @param {FeatureUsageFlag} flag - The flag value
     * @returns nothing
     */
    static updateFeatureUsageFlag(context, flag) {
        let options;
        if (context.middlewareControl instanceof middleware_MiddlewareControl/* MiddlewareControl */.M) {
            options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions);
        }
        else {
            context.middlewareControl = new middleware_MiddlewareControl/* MiddlewareControl */.M();
        }
        if (typeof options === "undefined") {
            options = new TelemetryHandlerOptions();
            context.middlewareControl.setMiddlewareOptions(TelemetryHandlerOptions, options);
        }
        options.setFeatureUsage(flag);
    }
    /**
     * @private
     * To set the feature usage flag
     * @param {FeatureUsageFlag} flag - The flag value
     * @returns nothing
     */
    setFeatureUsage(flag) {
        this.featureUsage = this.featureUsage | flag;
    }
    /**
     * @public
     * To get the feature usage
     * @returns A feature usage flag as hexadecimal string
     */
    getFeatureUsage() {
        return this.featureUsage.toString(16);
    }
}
//# sourceMappingURL=TelemetryHandlerOptions.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/AuthenticationHandler.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module AuthenticationHandler
 */





/**
 * @class
 * @implements Middleware
 * Class representing AuthenticationHandler
 */
class AuthenticationHandler_AuthenticationHandler {
    /**
     * @public
     * @constructor
     * Creates an instance of AuthenticationHandler
     * @param {AuthenticationProvider} authenticationProvider - The authentication provider for the authentication handler
     */
    constructor(authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    execute(context) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = typeof context.request === "string" ? context.request : context.request.url;
            if (isGraphURL(url) || (context.customHosts && isCustomHost(url, context.customHosts))) {
                let options;
                if (context.middlewareControl instanceof middleware_MiddlewareControl/* MiddlewareControl */.M) {
                    options = context.middlewareControl.getMiddlewareOptions(AuthenticationHandlerOptions);
                }
                let authenticationProvider;
                let authenticationProviderOptions;
                if (options) {
                    authenticationProvider = options.authenticationProvider;
                    authenticationProviderOptions = options.authenticationProviderOptions;
                }
                if (!authenticationProvider) {
                    authenticationProvider = this.authenticationProvider;
                }
                const token = yield authenticationProvider.getAccessToken(authenticationProviderOptions);
                const bearerKey = `Bearer ${token}`;
                appendRequestHeader(context.request, context.options, AuthenticationHandler_AuthenticationHandler.AUTHORIZATION_HEADER, bearerKey);
                TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
            }
            else {
                if (context.options.headers) {
                    delete context.options.headers[AuthenticationHandler_AuthenticationHandler.AUTHORIZATION_HEADER];
                }
            }
            return yield this.nextMiddleware.execute(context);
        });
    }
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    setNext(next) {
        this.nextMiddleware = next;
    }
}
/**
 * @private
 * A member representing the authorization header name
 */
AuthenticationHandler_AuthenticationHandler.AUTHORIZATION_HEADER = "Authorization";
//# sourceMappingURL=AuthenticationHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/RetryHandlerOptions.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @class
 * @implements MiddlewareOptions
 * Class for RetryHandlerOptions
 */
class RetryHandlerOptions_RetryHandlerOptions {
    /**
     * @public
     * @constructor
     * To create an instance of RetryHandlerOptions
     * @param {number} [delay = RetryHandlerOptions.DEFAULT_DELAY] - The delay value in seconds
     * @param {number} [maxRetries = RetryHandlerOptions.DEFAULT_MAX_RETRIES] - The maxRetries value
     * @param {ShouldRetry} [shouldRetry = RetryHandlerOptions.DEFAULT_SHOULD_RETRY] - The shouldRetry callback function
     * @returns An instance of RetryHandlerOptions
     */
    constructor(delay = RetryHandlerOptions_RetryHandlerOptions.DEFAULT_DELAY, maxRetries = RetryHandlerOptions_RetryHandlerOptions.DEFAULT_MAX_RETRIES, shouldRetry = RetryHandlerOptions_RetryHandlerOptions.defaultShouldRetry) {
        if (delay > RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY && maxRetries > RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES) {
            const error = new Error(`Delay and MaxRetries should not be more than ${RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY} and ${RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES}`);
            error.name = "MaxLimitExceeded";
            throw error;
        }
        else if (delay > RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY) {
            const error = new Error(`Delay should not be more than ${RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY}`);
            error.name = "MaxLimitExceeded";
            throw error;
        }
        else if (maxRetries > RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES) {
            const error = new Error(`MaxRetries should not be more than ${RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES}`);
            error.name = "MaxLimitExceeded";
            throw error;
        }
        else if (delay < 0 && maxRetries < 0) {
            const error = new Error(`Delay and MaxRetries should not be negative`);
            error.name = "MinExpectationNotMet";
            throw error;
        }
        else if (delay < 0) {
            const error = new Error(`Delay should not be negative`);
            error.name = "MinExpectationNotMet";
            throw error;
        }
        else if (maxRetries < 0) {
            const error = new Error(`MaxRetries should not be negative`);
            error.name = "MinExpectationNotMet";
            throw error;
        }
        this.delay = Math.min(delay, RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY);
        this.maxRetries = Math.min(maxRetries, RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES);
        this.shouldRetry = shouldRetry;
    }
    /**
     * @public
     * To get the maximum delay
     * @returns A maximum delay
     */
    getMaxDelay() {
        return RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY;
    }
}
/**
 * @private
 * @static
 * A member holding default delay value in seconds
 */
RetryHandlerOptions_RetryHandlerOptions.DEFAULT_DELAY = 3;
/**
 * @private
 * @static
 * A member holding default maxRetries value
 */
RetryHandlerOptions_RetryHandlerOptions.DEFAULT_MAX_RETRIES = 3;
/**
 * @private
 * @static
 * A member holding maximum delay value in seconds
 */
RetryHandlerOptions_RetryHandlerOptions.MAX_DELAY = 180;
/**
 * @private
 * @static
 * A member holding maximum maxRetries value
 */
RetryHandlerOptions_RetryHandlerOptions.MAX_MAX_RETRIES = 10;
/**
 * @private
 * A member holding default shouldRetry callback
 */
RetryHandlerOptions_RetryHandlerOptions.defaultShouldRetry = () => true;
//# sourceMappingURL=RetryHandlerOptions.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/RetryHandler.js
/* provided dependency */ var RetryHandler_Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */






/**
 * @class
 * @implements Middleware
 * Class for RetryHandler
 */
class RetryHandler_RetryHandler {
    /**
     * @public
     * @constructor
     * To create an instance of RetryHandler
     * @param {RetryHandlerOptions} [options = new RetryHandlerOptions()] - The retry handler options value
     * @returns An instance of RetryHandler
     */
    constructor(options = new RetryHandlerOptions_RetryHandlerOptions()) {
        this.options = options;
    }
    /**
     *
     * @private
     * To check whether the response has the retry status code
     * @param {Response} response - The response object
     * @returns Whether the response has retry status code or not
     */
    isRetry(response) {
        return RetryHandler_RetryHandler.RETRY_STATUS_CODES.indexOf(response.status) !== -1;
    }
    /**
     * @private
     * To check whether the payload is buffered or not
     * @param {RequestInfo} request - The url string or the request object value
     * @param {FetchOptions} options - The options of a request
     * @returns Whether the payload is buffered or not
     */
    isBuffered(request, options) {
        const method = typeof request === "string" ? options.method : request.method;
        const isPutPatchOrPost = method === RequestMethod.PUT || method === RequestMethod.PATCH || method === RequestMethod.POST;
        if (isPutPatchOrPost) {
            const isStream = getRequestHeader(request, options, "Content-Type") === "application/octet-stream";
            if (isStream) {
                return false;
            }
        }
        return true;
    }
    /**
     * @private
     * To get the delay for a retry
     * @param {Response} response - The response object
     * @param {number} retryAttempts - The current attempt count
     * @param {number} delay - The delay value in seconds
     * @returns A delay for a retry
     */
    getDelay(response, retryAttempts, delay) {
        const getRandomness = () => Number(Math.random().toFixed(3));
        const retryAfter = response.headers !== undefined ? response.headers.get(RetryHandler_RetryHandler.RETRY_AFTER_HEADER) : null;
        let newDelay;
        if (retryAfter !== null) {
            if (Number.isNaN(Number(retryAfter))) {
                newDelay = Math.round((new Date(retryAfter).getTime() - Date.now()) / 1000);
            }
            else {
                newDelay = Number(retryAfter);
            }
        }
        else {
            // Adding randomness to avoid retrying at a same
            newDelay = retryAttempts >= 2 ? this.getExponentialBackOffTime(retryAttempts) + delay + getRandomness() : delay + getRandomness();
        }
        return Math.min(newDelay, this.options.getMaxDelay() + getRandomness());
    }
    /**
     * @private
     * To get an exponential back off value
     * @param {number} attempts - The current attempt count
     * @returns An exponential back off value
     */
    getExponentialBackOffTime(attempts) {
        return Math.round((1 / 2) * (Math.pow(2, attempts) - 1));
    }
    /**
     * @private
     * @async
     * To add delay for the execution
     * @param {number} delaySeconds - The delay value in seconds
     * @returns Nothing
     */
    sleep(delaySeconds) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const delayMilliseconds = delaySeconds * 1000;
            return new RetryHandler_Promise((resolve) => setTimeout(resolve, delayMilliseconds));
        });
    }
    getOptions(context) {
        let options;
        if (context.middlewareControl instanceof middleware_MiddlewareControl/* MiddlewareControl */.M) {
            options = context.middlewareControl.getMiddlewareOptions(this.options.constructor);
        }
        if (typeof options === "undefined") {
            options = Object.assign(new RetryHandlerOptions_RetryHandlerOptions(), this.options);
        }
        return options;
    }
    /**
     * @private
     * @async
     * To execute the middleware with retries
     * @param {Context} context - The context object
     * @param {number} retryAttempts - The current attempt count
     * @param {RetryHandlerOptions} options - The retry middleware options instance
     * @returns A Promise that resolves to nothing
     */
    executeWithRetry(context, retryAttempts, options) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            yield this.nextMiddleware.execute(context);
            if (retryAttempts < options.maxRetries && this.isRetry(context.response) && this.isBuffered(context.request, context.options) && options.shouldRetry(options.delay, retryAttempts, context.request, context.options, context.response)) {
                ++retryAttempts;
                setRequestHeader(context.request, context.options, RetryHandler_RetryHandler.RETRY_ATTEMPT_HEADER, retryAttempts.toString());
                const delay = this.getDelay(context.response, retryAttempts, options.delay);
                yield this.sleep(delay);
                return yield this.executeWithRetry(context, retryAttempts, options);
            }
            else {
                return;
            }
        });
    }
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    execute(context) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const retryAttempts = 0;
            const options = this.getOptions(context);
            TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.RETRY_HANDLER_ENABLED);
            return yield this.executeWithRetry(context, retryAttempts, options);
        });
    }
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    setNext(next) {
        this.nextMiddleware = next;
    }
}
/**
 * @private
 * @static
 * A list of status codes that needs to be retried
 */
RetryHandler_RetryHandler.RETRY_STATUS_CODES = [
    429,
    503,
    504, // Gateway timeout
];
/**
 * @private
 * @static
 * A member holding the name of retry attempt header
 */
RetryHandler_RetryHandler.RETRY_ATTEMPT_HEADER = "Retry-Attempt";
/**
 * @private
 * @static
 * A member holding the name of retry after header
 */
RetryHandler_RetryHandler.RETRY_AFTER_HEADER = "Retry-After";
//# sourceMappingURL=RetryHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/RedirectHandlerOptions.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @class
 * @implements MiddlewareOptions
 * A class representing RedirectHandlerOptions
 */
class RedirectHandlerOptions_RedirectHandlerOptions {
    /**
     * @public
     * @constructor
     * To create an instance of RedirectHandlerOptions
     * @param {number} [maxRedirects = RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS] - The max redirects value
     * @param {ShouldRedirect} [shouldRedirect = RedirectHandlerOptions.DEFAULT_SHOULD_RETRY] - The should redirect callback
     * @returns An instance of RedirectHandlerOptions
     */
    constructor(maxRedirects = RedirectHandlerOptions_RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS, shouldRedirect = RedirectHandlerOptions_RedirectHandlerOptions.defaultShouldRedirect) {
        if (maxRedirects > RedirectHandlerOptions_RedirectHandlerOptions.MAX_MAX_REDIRECTS) {
            const error = new Error(`MaxRedirects should not be more than ${RedirectHandlerOptions_RedirectHandlerOptions.MAX_MAX_REDIRECTS}`);
            error.name = "MaxLimitExceeded";
            throw error;
        }
        if (maxRedirects < 0) {
            const error = new Error(`MaxRedirects should not be negative`);
            error.name = "MinExpectationNotMet";
            throw error;
        }
        this.maxRedirects = maxRedirects;
        this.shouldRedirect = shouldRedirect;
    }
}
/**
 * @private
 * @static
 * A member holding default max redirects value
 */
RedirectHandlerOptions_RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS = 5;
/**
 * @private
 * @static
 * A member holding maximum max redirects value
 */
RedirectHandlerOptions_RedirectHandlerOptions.MAX_MAX_REDIRECTS = 20;
/**
 * @private
 * A member holding default shouldRedirect callback
 */
RedirectHandlerOptions_RedirectHandlerOptions.defaultShouldRedirect = () => true;
//# sourceMappingURL=RedirectHandlerOptions.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/RedirectHandler.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */






/**
 * @class
 * Class
 * @implements Middleware
 * Class representing RedirectHandler
 */
class RedirectHandler_RedirectHandler {
    /**
     * @public
     * @constructor
     * To create an instance of RedirectHandler
     * @param {RedirectHandlerOptions} [options = new RedirectHandlerOptions()] - The redirect handler options instance
     * @returns An instance of RedirectHandler
     */
    constructor(options = new RedirectHandlerOptions_RedirectHandlerOptions()) {
        this.options = options;
    }
    /**
     * @private
     * To check whether the response has the redirect status code or not
     * @param {Response} response - The response object
     * @returns A boolean representing whether the response contains the redirect status code or not
     */
    isRedirect(response) {
        return RedirectHandler_RedirectHandler.REDIRECT_STATUS_CODES.indexOf(response.status) !== -1;
    }
    /**
     * @private
     * To check whether the response has location header or not
     * @param {Response} response - The response object
     * @returns A boolean representing the whether the response has location header or not
     */
    hasLocationHeader(response) {
        return response.headers.has(RedirectHandler_RedirectHandler.LOCATION_HEADER);
    }
    /**
     * @private
     * To get the redirect url from location header in response object
     * @param {Response} response - The response object
     * @returns A redirect url from location header
     */
    getLocationHeader(response) {
        return response.headers.get(RedirectHandler_RedirectHandler.LOCATION_HEADER);
    }
    /**
     * @private
     * To check whether the given url is a relative url or not
     * @param {string} url - The url string value
     * @returns A boolean representing whether the given url is a relative url or not
     */
    isRelativeURL(url) {
        return url.indexOf("://") === -1;
    }
    /**
     * @private
     * To check whether the authorization header in the request should be dropped for consequent redirected requests
     * @param {string} requestUrl - The request url value
     * @param {string} redirectUrl - The redirect url value
     * @returns A boolean representing whether the authorization header in the request should be dropped for consequent redirected requests
     */
    shouldDropAuthorizationHeader(requestUrl, redirectUrl) {
        const schemeHostRegex = /^[A-Za-z].+?:\/\/.+?(?=\/|$)/;
        const requestMatches = schemeHostRegex.exec(requestUrl);
        let requestAuthority;
        let redirectAuthority;
        if (requestMatches !== null) {
            requestAuthority = requestMatches[0];
        }
        const redirectMatches = schemeHostRegex.exec(redirectUrl);
        if (redirectMatches !== null) {
            redirectAuthority = redirectMatches[0];
        }
        return typeof requestAuthority !== "undefined" && typeof redirectAuthority !== "undefined" && requestAuthority !== redirectAuthority;
    }
    /**
     * @private
     * @async
     * To update a request url with the redirect url
     * @param {string} redirectUrl - The redirect url value
     * @param {Context} context - The context object value
     * @returns Nothing
     */
    updateRequestUrl(redirectUrl, context) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            context.request = typeof context.request === "string" ? redirectUrl : yield cloneRequestWithNewUrl(redirectUrl, context.request);
        });
    }
    /**
     * @private
     * To get the options for execution of the middleware
     * @param {Context} context - The context object
     * @returns A options for middleware execution
     */
    getOptions(context) {
        let options;
        if (context.middlewareControl instanceof middleware_MiddlewareControl/* MiddlewareControl */.M) {
            options = context.middlewareControl.getMiddlewareOptions(RedirectHandlerOptions_RedirectHandlerOptions);
        }
        if (typeof options === "undefined") {
            options = Object.assign(new RedirectHandlerOptions_RedirectHandlerOptions(), this.options);
        }
        return options;
    }
    /**
     * @private
     * @async
     * To execute the next middleware and to handle in case of redirect response returned by the server
     * @param {Context} context - The context object
     * @param {number} redirectCount - The redirect count value
     * @param {RedirectHandlerOptions} options - The redirect handler options instance
     * @returns A promise that resolves to nothing
     */
    executeWithRedirect(context, redirectCount, options) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            yield this.nextMiddleware.execute(context);
            const response = context.response;
            if (redirectCount < options.maxRedirects && this.isRedirect(response) && this.hasLocationHeader(response) && options.shouldRedirect(response)) {
                ++redirectCount;
                if (response.status === RedirectHandler_RedirectHandler.STATUS_CODE_SEE_OTHER) {
                    context.options.method = RequestMethod.GET;
                    delete context.options.body;
                }
                else {
                    const redirectUrl = this.getLocationHeader(response);
                    if (!this.isRelativeURL(redirectUrl) && this.shouldDropAuthorizationHeader(response.url, redirectUrl)) {
                        delete context.options.headers[RedirectHandler_RedirectHandler.AUTHORIZATION_HEADER];
                    }
                    yield this.updateRequestUrl(redirectUrl, context);
                }
                yield this.executeWithRedirect(context, redirectCount, options);
            }
            else {
                return;
            }
        });
    }
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    execute(context) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const redirectCount = 0;
            const options = this.getOptions(context);
            context.options.redirect = RedirectHandler_RedirectHandler.MANUAL_REDIRECT;
            TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.REDIRECT_HANDLER_ENABLED);
            return yield this.executeWithRedirect(context, redirectCount, options);
        });
    }
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    setNext(next) {
        this.nextMiddleware = next;
    }
}
/**
 * @private
 * @static
 * A member holding the array of redirect status codes
 */
RedirectHandler_RedirectHandler.REDIRECT_STATUS_CODES = [
    301,
    302,
    303,
    307,
    308, // Moved Permanently
];
/**
 * @private
 * @static
 * A member holding SeeOther status code
 */
RedirectHandler_RedirectHandler.STATUS_CODE_SEE_OTHER = 303;
/**
 * @private
 * @static
 * A member holding the name of the location header
 */
RedirectHandler_RedirectHandler.LOCATION_HEADER = "Location";
/**
 * @private
 * @static
 * A member representing the authorization header name
 */
RedirectHandler_RedirectHandler.AUTHORIZATION_HEADER = "Authorization";
/**
 * @private
 * @static
 * A member holding the manual redirect value
 */
RedirectHandler_RedirectHandler.MANUAL_REDIRECT = "manual";
//# sourceMappingURL=RedirectHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/Version.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
// THIS FILE IS AUTO GENERATED
// ANY CHANGES WILL BE LOST DURING BUILD
/**
 * @module Version
 */
const PACKAGE_VERSION = "3.0.7";
//# sourceMappingURL=Version.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/TelemetryHandler.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module TelemetryHandler
 */





/**
 * @class
 * @implements Middleware
 * Class for TelemetryHandler
 */
class TelemetryHandler_TelemetryHandler {
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    execute(context) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = typeof context.request === "string" ? context.request : context.request.url;
            if (isGraphURL(url) || (context.customHosts && isCustomHost(url, context.customHosts))) {
                // Add telemetry only if the request url is a Graph URL.
                // Errors are reported as in issue #265 if headers are present when redirecting to a non Graph URL
                let clientRequestId = getRequestHeader(context.request, context.options, TelemetryHandler_TelemetryHandler.CLIENT_REQUEST_ID_HEADER);
                if (!clientRequestId) {
                    clientRequestId = MiddlewareUtil_generateUUID();
                    setRequestHeader(context.request, context.options, TelemetryHandler_TelemetryHandler.CLIENT_REQUEST_ID_HEADER, clientRequestId);
                }
                let sdkVersionValue = `${TelemetryHandler_TelemetryHandler.PRODUCT_NAME}/${PACKAGE_VERSION}`;
                let options;
                if (context.middlewareControl instanceof middleware_MiddlewareControl/* MiddlewareControl */.M) {
                    options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions);
                }
                if (options) {
                    const featureUsage = options.getFeatureUsage();
                    sdkVersionValue += ` (${TelemetryHandler_TelemetryHandler.FEATURE_USAGE_STRING}=${featureUsage})`;
                }
                appendRequestHeader(context.request, context.options, TelemetryHandler_TelemetryHandler.SDK_VERSION_HEADER, sdkVersionValue);
            }
            else {
                // Remove telemetry headers if present during redirection.
                delete context.options.headers[TelemetryHandler_TelemetryHandler.CLIENT_REQUEST_ID_HEADER];
                delete context.options.headers[TelemetryHandler_TelemetryHandler.SDK_VERSION_HEADER];
            }
            return yield this.nextMiddleware.execute(context);
        });
    }
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    setNext(next) {
        this.nextMiddleware = next;
    }
}
/**
 * @private
 * @static
 * A member holding the name of the client request id header
 */
TelemetryHandler_TelemetryHandler.CLIENT_REQUEST_ID_HEADER = "client-request-id";
/**
 * @private
 * @static
 * A member holding the name of the sdk version header
 */
TelemetryHandler_TelemetryHandler.SDK_VERSION_HEADER = "SdkVersion";
/**
 * @private
 * @static
 * A member holding the language prefix for the sdk version header value
 */
TelemetryHandler_TelemetryHandler.PRODUCT_NAME = "graph-js";
/**
 * @private
 * @static
 * A member holding the key for the feature usage metrics
 */
TelemetryHandler_TelemetryHandler.FEATURE_USAGE_STRING = "featureUsage";
//# sourceMappingURL=TelemetryHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareFactory.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */







/**
 * @private
 * To check whether the environment is node or not
 * @returns A boolean representing the environment is node or not
 */
const isNodeEnvironment = () => {
    return typeof process === "object" && "function" === "function";
};
/**
 * @class
 * Class containing function(s) related to the middleware pipelines.
 */
class MiddlewareFactory {
    /**
     * @public
     * @static
     * Returns the default middleware chain an array with the  middleware handlers
     * @param {AuthenticationProvider} authProvider - The authentication provider instance
     * @returns an array of the middleware handlers of the default middleware chain
     */
    static getDefaultMiddlewareChain(authProvider) {
        const middleware = [];
        const authenticationHandler = new AuthenticationHandler(authProvider);
        const retryHandler = new RetryHandler(new RetryHandlerOptions());
        const telemetryHandler = new TelemetryHandler();
        const httpMessageHandler = new HTTPMessageHandler();
        middleware.push(authenticationHandler);
        middleware.push(retryHandler);
        if (isNodeEnvironment()) {
            const redirectHandler = new RedirectHandler(new RedirectHandlerOptions());
            middleware.push(redirectHandler);
        }
        middleware.push(telemetryHandler);
        middleware.push(httpMessageHandler);
        return middleware;
    }
}
//# sourceMappingURL=MiddlewareFactory.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosStrategy.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module ChaosStrategy
 */
/**
 * Strategy used for Testing Handler
 * @enum
 */
var ChaosStrategy_ChaosStrategy;
(function (ChaosStrategy) {
    ChaosStrategy[ChaosStrategy["MANUAL"] = 0] = "MANUAL";
    ChaosStrategy[ChaosStrategy["RANDOM"] = 1] = "RANDOM";
})(ChaosStrategy_ChaosStrategy || (ChaosStrategy_ChaosStrategy = {}));
//# sourceMappingURL=ChaosStrategy.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosHandlerOptions.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module ChaosHandlerOptions
 */

/**
 * Class representing ChaosHandlerOptions
 * @class
 * Class
 * @implements MiddlewareOptions
 */
class ChaosHandlerOptions_ChaosHandlerOptions {
    /**
     * @public
     * @constructor
     * To create an instance of Testing Handler Options
     * @param {ChaosStrategy} chaosStrategy - Specifies the startegy used for the Testing Handler -> RAMDOM/MANUAL
     * @param {string} statusMessage - The Message to be returned in the response
     * @param {number?} statusCode - The statusCode to be returned in the response
     * @param {number?} chaosPercentage - The percentage of randomness/chaos in the handler
     * @param {any?} responseBody - The response body to be returned in the response
     * @returns An instance of ChaosHandlerOptions
     */
    constructor(chaosStrategy = ChaosStrategy.RANDOM, statusMessage = "Some error Happened", statusCode, chaosPercentage, responseBody, headers) {
        this.chaosStrategy = chaosStrategy;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.chaosPercentage = chaosPercentage !== undefined ? chaosPercentage : 10;
        this.responseBody = responseBody;
        this.headers = headers;
        if (this.chaosPercentage > 100) {
            throw new Error("Error Pecentage can not be more than 100");
        }
    }
}
//# sourceMappingURL=ChaosHandlerOptions.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosHandlerData.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module ChaosHandlerData
 */
/**
 * Contains RequestMethod to corresponding array of possible status codes, used for Random mode
 */
const ChaosHandlerData_methodStatusCode = {
    GET: [429, 500, 502, 503, 504],
    POST: [429, 500, 502, 503, 504, 507],
    PUT: [429, 500, 502, 503, 504, 507],
    PATCH: [429, 500, 502, 503, 504],
    DELETE: [429, 500, 502, 503, 504, 507],
};
/**
 * Contains statusCode to statusMessage map
 */
const ChaosHandlerData_httpStatusCode = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    103: "Early Hints",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
};
//# sourceMappingURL=ChaosHandlerData.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/ChaosHandler.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */






/**
 * Class representing ChaosHandler
 * @class
 * Class
 * @implements Middleware
 */
class ChaosHandler {
    /**
     * @public
     * @constructor
     * To create an instance of Testing Handler
     * @param {ChaosHandlerOptions} [options = new ChaosHandlerOptions()] - The testing handler options instance
     * @param manualMap - The Map passed by user containing url-statusCode info
     * @returns An instance of Testing Handler
     */
    constructor(options = new ChaosHandlerOptions(), manualMap) {
        this.options = options;
        this.manualMap = manualMap;
    }
    /**
     * Generates responseHeader
     * @private
     * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
     * @param {string} requestID - request id
     * @param {string} requestDate - date of the request
     * @returns response Header
     */
    createResponseHeaders(chaosHandlerOptions, requestID, requestDate) {
        const responseHeader = chaosHandlerOptions.headers ? new Headers(chaosHandlerOptions.headers) : new Headers();
        responseHeader.append("Cache-Control", "no-store");
        responseHeader.append("request-id", requestID);
        responseHeader.append("client-request-id", requestID);
        responseHeader.append("x-ms-ags-diagnostic", "");
        responseHeader.append("Date", requestDate);
        responseHeader.append("Strict-Transport-Security", "");
        if (chaosHandlerOptions.statusCode === 429) {
            // throttling case has to have a timeout scenario
            responseHeader.append("retry-after", "3");
        }
        return responseHeader;
    }
    /**
     * Generates responseBody
     * @private
     * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
     * @param {string} requestID - request id
     * @param {string} requestDate - date of the request
     *  * @returns response body
     */
    createResponseBody(chaosHandlerOptions, requestID, requestDate) {
        if (chaosHandlerOptions.responseBody) {
            return chaosHandlerOptions.responseBody;
        }
        let body;
        if (chaosHandlerOptions.statusCode >= 400) {
            const codeMessage = httpStatusCode[chaosHandlerOptions.statusCode];
            const errMessage = chaosHandlerOptions.statusMessage;
            body = {
                error: {
                    code: codeMessage,
                    message: errMessage,
                    innerError: {
                        "request-id": requestID,
                        date: requestDate,
                    },
                },
            };
        }
        else {
            body = {};
        }
        return body;
    }
    /**
     * creates a response
     * @private
     * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
     * @param {Context} context - Contains the context of the request
     */
    createResponse(chaosHandlerOptions, context) {
        const requestURL = context.request;
        const requestID = generateUUID();
        const requestDate = new Date();
        const responseHeader = this.createResponseHeaders(chaosHandlerOptions, requestID, requestDate.toString());
        const responseBody = this.createResponseBody(chaosHandlerOptions, requestID, requestDate.toString());
        const init = { url: requestURL, status: chaosHandlerOptions.statusCode, statusText: chaosHandlerOptions.statusMessage, headers: responseHeader };
        context.response = new Response(typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody), init);
    }
    /**
     * Decides whether to send the request to the graph or not
     * @private
     * @param {ChaosHandlerOptions} chaosHandlerOptions - A ChaosHandlerOptions object
     * @param {Context} context - Contains the context of the request
     * @returns nothing
     */
    sendRequest(chaosHandlerOptions, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatusCode(chaosHandlerOptions, context.request, context.options.method);
            if ((chaosHandlerOptions.chaosStrategy === ChaosStrategy.MANUAL && !this.nextMiddleware) || Math.floor(Math.random() * 100) < chaosHandlerOptions.chaosPercentage) {
                this.createResponse(chaosHandlerOptions, context);
            }
            else if (this.nextMiddleware) {
                yield this.nextMiddleware.execute(context);
            }
        });
    }
    /**
     * Fetches a random status code for the RANDOM mode from the predefined array
     * @private
     * @param {string} requestMethod - the API method for the request
     * @returns a random status code from a given set of status codes
     */
    getRandomStatusCode(requestMethod) {
        const statusCodeArray = methodStatusCode[requestMethod];
        return statusCodeArray[Math.floor(Math.random() * statusCodeArray.length)];
    }
    /**
     * To fetch the relative URL out of the complete URL using a predefined regex pattern
     * @private
     * @param {string} urlMethod - the complete URL
     * @returns the string as relative URL
     */
    getRelativeURL(urlMethod) {
        const pattern = /https?:\/\/graph\.microsoft\.com\/[^/]+(.+?)(\?|$)/;
        let relativeURL;
        if (pattern.exec(urlMethod) !== null) {
            relativeURL = pattern.exec(urlMethod)[1];
        }
        return relativeURL;
    }
    /**
     * To fetch the status code from the map(if needed), then returns response by calling createResponse
     * @private
     * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
     * @param {string} requestURL - the URL for the request
     * @param {string} requestMethod - the API method for the request
     */
    setStatusCode(chaosHandlerOptions, requestURL, requestMethod) {
        if (chaosHandlerOptions.chaosStrategy === ChaosStrategy.MANUAL) {
            if (chaosHandlerOptions.statusCode === undefined) {
                // manual mode with no status code, can be a global level or request level without statusCode
                const relativeURL = this.getRelativeURL(requestURL);
                if (this.manualMap.get(relativeURL) !== undefined) {
                    // checking Manual Map for exact match
                    if (this.manualMap.get(relativeURL).get(requestMethod) !== undefined) {
                        chaosHandlerOptions.statusCode = this.manualMap.get(relativeURL).get(requestMethod);
                    }
                    // else statusCode would be undefined
                }
                else {
                    // checking for regex match if exact match doesn't work
                    this.manualMap.forEach((value, key) => {
                        const regexURL = new RegExp(key + "$");
                        if (regexURL.test(relativeURL)) {
                            if (this.manualMap.get(key).get(requestMethod) !== undefined) {
                                chaosHandlerOptions.statusCode = this.manualMap.get(key).get(requestMethod);
                            }
                            // else statusCode would be undefined
                        }
                    });
                }
                // Case of redirection or request url not in map ---> statusCode would be undefined
            }
        }
        else {
            // Handling the case of Random here
            chaosHandlerOptions.statusCode = this.getRandomStatusCode(requestMethod);
            // else statusCode would be undefined
        }
    }
    /**
     * To get the options for execution of the middleware
     * @private
     * @param {Context} context - The context object
     * @returns options for middleware execution
     */
    getOptions(context) {
        let options;
        if (context.middlewareControl instanceof MiddlewareControl) {
            options = context.middlewareControl.getMiddlewareOptions(ChaosHandlerOptions);
        }
        if (typeof options === "undefined") {
            options = Object.assign(new ChaosHandlerOptions(), this.options);
        }
        return options;
    }
    /**
     * To execute the current middleware
     * @public
     * @async
     * @param {Context} context - The context object of the request
     * @returns A Promise that resolves to nothing
     */
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const chaosHandlerOptions = this.getOptions(context);
            return yield this.sendRequest(chaosHandlerOptions, context);
        });
    }
    /**
     * @public
     * To set the next middleware in the chain
     * @param {Middleware} next - The middleware instance
     * @returns Nothing
     */
    setNext(next) {
        this.nextMiddleware = next;
    }
}
//# sourceMappingURL=ChaosHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/ResponseType.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @enum
 * Enum for ResponseType values
 * @property {string} ARRAYBUFFER - To download response content as an [ArrayBuffer]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer}
 * @property {string} BLOB - To download content as a [binary/blob] {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob}
 * @property {string} DOCUMENT - This downloads content as a document or stream
 * @property {string} JSON - To download response content as a json
 * @property {string} STREAM - To download response as a [stream]{@link https://nodejs.org/api/stream.html}
 * @property {string} TEXT - For downloading response as a text
 */
var ResponseType;
(function (ResponseType) {
    ResponseType["ARRAYBUFFER"] = "arraybuffer";
    ResponseType["BLOB"] = "blob";
    ResponseType["DOCUMENT"] = "document";
    ResponseType["JSON"] = "json";
    ResponseType["RAW"] = "raw";
    ResponseType["STREAM"] = "stream";
    ResponseType["TEXT"] = "text";
})(ResponseType || (ResponseType = {}));
//# sourceMappingURL=ResponseType.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphResponseHandler.js
/* provided dependency */ var GraphResponseHandler_Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */


/**
 * @enum
 * Enum for document types
 * @property {string} TEXT_HTML - The text/html content type
 * @property {string} TEXT_XML - The text/xml content type
 * @property {string} APPLICATION_XML - The application/xml content type
 * @property {string} APPLICATION_XHTML - The application/xhml+xml content type
 */
var DocumentType;
(function (DocumentType) {
    DocumentType["TEXT_HTML"] = "text/html";
    DocumentType["TEXT_XML"] = "text/xml";
    DocumentType["APPLICATION_XML"] = "application/xml";
    DocumentType["APPLICATION_XHTML"] = "application/xhtml+xml";
})(DocumentType || (DocumentType = {}));
/**
 * @enum
 * Enum for Content types
 * @property {string} TEXT_PLAIN - The text/plain content type
 * @property {string} APPLICATION_JSON - The application/json content type
 */
var ContentType;
(function (ContentType) {
    ContentType["TEXT_PLAIN"] = "text/plain";
    ContentType["APPLICATION_JSON"] = "application/json";
})(ContentType || (ContentType = {}));
/**
 * @enum
 * Enum for Content type regex
 * @property {string} DOCUMENT - The regex to match document content types
 * @property {string} IMAGE - The regex to match image content types
 */
var ContentTypeRegexStr;
(function (ContentTypeRegexStr) {
    ContentTypeRegexStr["DOCUMENT"] = "^(text\\/(html|xml))|(application\\/(xml|xhtml\\+xml))$";
    ContentTypeRegexStr["IMAGE"] = "^image\\/.+";
})(ContentTypeRegexStr || (ContentTypeRegexStr = {}));
/**
 * @class
 * Class for GraphResponseHandler
 */
class GraphResponseHandler {
    /**
     * @private
     * @static
     * To parse Document response
     * @param {Response} rawResponse - The response object
     * @param {DocumentType} type - The type to which the document needs to be parsed
     * @returns A promise that resolves to a document content
     */
    static parseDocumentResponse(rawResponse, type) {
        if (typeof DOMParser !== "undefined") {
            return new GraphResponseHandler_Promise((resolve, reject) => {
                rawResponse.text().then((xmlString) => {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlString, type);
                        resolve(xmlDoc);
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            });
        }
        else {
            return GraphResponseHandler_Promise.resolve(rawResponse.body);
        }
    }
    /**
     * @private
     * @static
     * @async
     * To convert the native Response to response content
     * @param {Response} rawResponse - The response object
     * @param {ResponseType} [responseType] - The response type value
     * @returns A promise that resolves to the converted response content
     */
    static convertResponse(rawResponse, responseType) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            if (rawResponse.status === 204) {
                // NO CONTENT
                return GraphResponseHandler_Promise.resolve();
            }
            let responseValue;
            const contentType = rawResponse.headers.get("Content-type");
            switch (responseType) {
                case ResponseType.ARRAYBUFFER:
                    responseValue = yield rawResponse.arrayBuffer();
                    break;
                case ResponseType.BLOB:
                    responseValue = yield rawResponse.blob();
                    break;
                case ResponseType.DOCUMENT:
                    responseValue = yield GraphResponseHandler.parseDocumentResponse(rawResponse, DocumentType.TEXT_XML);
                    break;
                case ResponseType.JSON:
                    responseValue = yield rawResponse.json();
                    break;
                case ResponseType.STREAM:
                    responseValue = yield GraphResponseHandler_Promise.resolve(rawResponse.body);
                    break;
                case ResponseType.TEXT:
                    responseValue = yield rawResponse.text();
                    break;
                default:
                    if (contentType !== null) {
                        const mimeType = contentType.split(";")[0];
                        if (new RegExp(ContentTypeRegexStr.DOCUMENT).test(mimeType)) {
                            responseValue = yield GraphResponseHandler.parseDocumentResponse(rawResponse, mimeType);
                        }
                        else if (new RegExp(ContentTypeRegexStr.IMAGE).test(mimeType)) {
                            responseValue = rawResponse.blob();
                        }
                        else if (mimeType === ContentType.TEXT_PLAIN) {
                            responseValue = yield rawResponse.text();
                        }
                        else if (mimeType === ContentType.APPLICATION_JSON) {
                            responseValue = yield rawResponse.json();
                        }
                        else {
                            responseValue = GraphResponseHandler_Promise.resolve(rawResponse.body);
                        }
                    }
                    else {
                        /**
                         * RFC specification {@link https://tools.ietf.org/html/rfc7231#section-3.1.1.5} says:
                         *  A sender that generates a message containing a payload body SHOULD
                         *  generate a Content-Type header field in that message unless the
                         *  intended media type of the enclosed representation is unknown to the
                         *  sender.  If a Content-Type header field is not present, the recipient
                         *  MAY either assume a media type of "application/octet-stream"
                         *  ([RFC2046], Section 4.5.1) or examine the data to determine its type.
                         *
                         *  So assuming it as a stream type so returning the body.
                         */
                        responseValue = GraphResponseHandler_Promise.resolve(rawResponse.body);
                    }
                    break;
            }
            return responseValue;
        });
    }
    /**
     * @public
     * @static
     * @async
     * To get the parsed response
     * @param {Response} rawResponse - The response object
     * @param {ResponseType} [responseType] - The response type value
     * @param {GraphRequestCallback} [callback] - The graph request callback function
     * @returns The parsed response
     */
    static getResponse(rawResponse, responseType, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            if (responseType === ResponseType.RAW) {
                return GraphResponseHandler_Promise.resolve(rawResponse);
            }
            else {
                const response = yield GraphResponseHandler.convertResponse(rawResponse, responseType);
                if (rawResponse.ok) {
                    // Status Code 2XX
                    if (typeof callback === "function") {
                        callback(null, response);
                    }
                    else {
                        return response;
                    }
                }
                else {
                    // NOT OK Response
                    throw response;
                }
            }
        });
    }
}
//# sourceMappingURL=GraphResponseHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/Range.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module Range
 */
/**
 * @class
 * Class representing Range
 */
class Range {
    /**
     * @public
     * @constructor
     * Creates a range for given min and max values
     * @param {number} [minVal = -1] - The minimum value.
     * @param {number} [maxVal = -1] - The maximum value.
     * @returns An instance of a Range
     */
    constructor(minVal = -1, maxVal = -1) {
        this.minValue = minVal;
        this.maxValue = maxVal;
    }
}
//# sourceMappingURL=Range.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/UploadResult.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * Class representing a successful file upload result
 */
class UploadResult {
    /**
     * @public
     * Get of the location value.
     * Location value is looked up in the response header
     */
    get location() {
        return this._location;
    }
    /**
     * @public
     * Set the location value
     * Location value is looked up in the response header
     */
    set location(location) {
        this._location = location;
    }
    /**
     * @public
     * Get The response body from the completed upload response
     */
    get responseBody() {
        return this._responseBody;
    }
    /**
     * @public
     * Set the response body from the completed upload response
     */
    set responseBody(responseBody) {
        this._responseBody = responseBody;
    }
    /**
     * @public
     * @param {responseBody} responsebody - The response body from the completed upload response
     * @param {location} location - The location value from the headers from the completed upload response
     */
    constructor(responseBody, location) {
        // Response body or the location parameter can be undefined.
        this._location = location;
        this._responseBody = responseBody;
    }
    /**
     * @public
     * @param {responseBody} responseBody - The response body from the completed upload response
     * @param {responseHeaders} responseHeaders - The headers from the completed upload response
     */
    static CreateUploadResult(responseBody, responseHeaders) {
        return new UploadResult(responseBody, responseHeaders.get("location"));
    }
}
//# sourceMappingURL=UploadResult.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/LargeFileUploadTask.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module LargeFileUploadTask
 */





/**
 * @class
 * Class representing LargeFileUploadTask
 */
class LargeFileUploadTask {
    /**
     * @public
     * @static
     * @async
     * Makes request to the server to create an upload session
     * @param {Client} client - The GraphClient instance
     * @param {string} requestUrl - The URL to create the upload session
     * @param {any} payload - The payload that needs to be sent
     * @param {KeyValuePairObjectStringNumber} headers - The headers that needs to be sent
     * @returns The promise that resolves to LargeFileUploadSession
     */
    static createUploadSession(client, requestUrl, payload, headers = {}) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const session = yield client
                .api(requestUrl)
                .headers(headers)
                .post(payload);
            const largeFileUploadSession = {
                url: session.uploadUrl,
                expiry: new Date(session.expirationDateTime),
                isCancelled: false,
            };
            return largeFileUploadSession;
        });
    }
    /**
     * @public
     * @constructor
     * Constructs a LargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {FileObject} file - The FileObject holding details of a file that needs to be uploaded
     * @param {LargeFileUploadSession} uploadSession - The upload session to which the upload has to be done
     * @param {LargeFileUploadTaskOptions} options - The upload task options
     * @returns An instance of LargeFileUploadTask
     */
    constructor(client, file, uploadSession, options = {}) {
        /**
         * @private
         * Default value for the rangeSize
         */
        this.DEFAULT_FILE_SIZE = 5 * 1024 * 1024;
        this.client = client;
        if (!file.sliceFile) {
            throw new GraphClientError_GraphClientError("Please pass the FileUpload object, StreamUpload object or any custom implementation of the FileObject interface");
        }
        else {
            this.file = file;
        }
        this.file = file;
        if (!options.rangeSize) {
            options.rangeSize = this.DEFAULT_FILE_SIZE;
        }
        this.options = options;
        this.uploadSession = uploadSession;
        this.nextRange = new Range(0, this.options.rangeSize - 1);
    }
    /**
     * @private
     * Parses given range string to the Range instance
     * @param {string[]} ranges - The ranges value
     * @returns The range instance
     */
    parseRange(ranges) {
        const rangeStr = ranges[0];
        if (typeof rangeStr === "undefined" || rangeStr === "") {
            return new Range();
        }
        const firstRange = rangeStr.split("-");
        const minVal = parseInt(firstRange[0], 10);
        let maxVal = parseInt(firstRange[1], 10);
        if (Number.isNaN(maxVal)) {
            maxVal = this.file.size - 1;
        }
        return new Range(minVal, maxVal);
    }
    /**
     * @private
     * Updates the expiration date and the next range
     * @param {UploadStatusResponse} response - The response of the upload status
     * @returns Nothing
     */
    updateTaskStatus(response) {
        this.uploadSession.expiry = new Date(response.expirationDateTime);
        this.nextRange = this.parseRange(response.nextExpectedRanges);
    }
    /**
     * @public
     * Gets next range that needs to be uploaded
     * @returns The range instance
     */
    getNextRange() {
        if (this.nextRange.minValue === -1) {
            return this.nextRange;
        }
        const minVal = this.nextRange.minValue;
        let maxValue = minVal + this.options.rangeSize - 1;
        if (maxValue >= this.file.size) {
            maxValue = this.file.size - 1;
        }
        return new Range(minVal, maxValue);
    }
    /**
     * @deprecated This function has been moved into FileObject interface.
     * @public
     * Slices the file content to the given range
     * @param {Range} range - The range value
     * @returns The sliced ArrayBuffer or Blob
     */
    sliceFile(range) {
        console.warn("The LargeFileUploadTask.sliceFile() function has been deprecated and moved into the FileObject interface.");
        if (this.file.content instanceof ArrayBuffer || this.file.content instanceof Blob || this.file.content instanceof Uint8Array) {
            return this.file.content.slice(range.minValue, range.maxValue + 1);
        }
        throw new GraphClientError_GraphClientError("The LargeFileUploadTask.sliceFile() function expects only Blob, ArrayBuffer or Uint8Array file content. Please note that the sliceFile() function is deprecated.");
    }
    /**
     * @public
     * @async
     * Uploads file to the server in a sequential order by slicing the file
     * @returns The promise resolves to uploaded response
     */
    upload() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const uploadEventHandlers = this.options && this.options.uploadEventHandlers;
            while (!this.uploadSession.isCancelled) {
                const nextRange = this.getNextRange();
                if (nextRange.maxValue === -1) {
                    const err = new Error("Task with which you are trying to upload is already completed, Please check for your uploaded file");
                    err.name = "Invalid Session";
                    throw err;
                }
                const fileSlice = yield this.file.sliceFile(nextRange);
                const rawResponse = yield this.uploadSliceGetRawResponse(fileSlice, nextRange, this.file.size);
                if (!rawResponse) {
                    throw new GraphClientError_GraphClientError("Something went wrong! Large file upload slice response is null.");
                }
                const responseBody = yield GraphResponseHandler.getResponse(rawResponse);
                /**
                 * (rawResponse.status === 201) -> This condition is applicable for OneDrive, PrintDocument and Outlook APIs.
                 * (rawResponse.status === 200 && responseBody.id) -> This additional condition is applicable only for OneDrive API.
                 */
                if (rawResponse.status === 201 || (rawResponse.status === 200 && responseBody.id)) {
                    this.reportProgress(uploadEventHandlers, nextRange);
                    return UploadResult.CreateUploadResult(responseBody, rawResponse.headers);
                }
                /* Handling the API issue where the case of Outlook upload response property -'nextExpectedRanges'  is not uniform.
                 * https://github.com/microsoftgraph/msgraph-sdk-serviceissues/issues/39
                 */
                const res = {
                    expirationDateTime: responseBody.expirationDateTime || responseBody.ExpirationDateTime,
                    nextExpectedRanges: responseBody.NextExpectedRanges || responseBody.nextExpectedRanges,
                };
                this.updateTaskStatus(res);
                this.reportProgress(uploadEventHandlers, nextRange);
            }
        });
    }
    reportProgress(uploadEventHandlers, nextRange) {
        if (uploadEventHandlers && uploadEventHandlers.progress) {
            uploadEventHandlers.progress(nextRange, uploadEventHandlers.extraCallbackParam);
        }
    }
    /**
     * @public
     * @async
     * Uploads given slice to the server
     * @param {ArrayBuffer | Blob | File} fileSlice - The file slice
     * @param {Range} range - The range value
     * @param {number} totalSize - The total size of a complete file
     * @returns The response body of the upload slice result
     */
    uploadSlice(fileSlice, range, totalSize) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return yield this.client
                .api(this.uploadSession.url)
                .headers({
                "Content-Length": `${range.maxValue - range.minValue + 1}`,
                "Content-Range": `bytes ${range.minValue}-${range.maxValue}/${totalSize}`,
                "Content-Type": "application/octet-stream",
            })
                .put(fileSlice);
        });
    }
    /**
     * @public
     * @async
     * Uploads given slice to the server
     * @param {unknown} fileSlice - The file slice
     * @param {Range} range - The range value
     * @param {number} totalSize - The total size of a complete file
     * @returns The raw response of the upload slice result
     */
    uploadSliceGetRawResponse(fileSlice, range, totalSize) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return yield this.client
                .api(this.uploadSession.url)
                .headers({
                "Content-Length": `${range.maxValue - range.minValue + 1}`,
                "Content-Range": `bytes ${range.minValue}-${range.maxValue}/${totalSize}`,
                "Content-Type": "application/octet-stream",
            })
                .responseType(ResponseType.RAW)
                .put(fileSlice);
        });
    }
    /**
     * @public
     * @async
     * Deletes upload session in the server
     * @returns The promise resolves to cancelled response
     */
    cancel() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const cancelResponse = yield this.client
                .api(this.uploadSession.url)
                .responseType(ResponseType.RAW)
                .delete();
            if (cancelResponse.status === 204) {
                this.uploadSession.isCancelled = true;
            }
            return cancelResponse;
        });
    }
    /**
     * @public
     * @async
     * Gets status for the upload session
     * @returns The promise resolves to the status enquiry response
     */
    getStatus() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const response = yield this.client.api(this.uploadSession.url).get();
            this.updateTaskStatus(response);
            return response;
        });
    }
    /**
     * @public
     * @async
     * Resumes upload session and continue uploading the file from the last sent range
     * @returns The promise resolves to the uploaded response
     */
    resume() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            yield this.getStatus();
            return yield this.upload();
        });
    }
    /**
     * @public
     * @async
     * Get the upload session information
     * @returns The large file upload session
     */
    getUploadSession() {
        return this.uploadSession;
    }
}
//# sourceMappingURL=LargeFileUploadTask.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/FileObjectClasses/FileUpload.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @class
 * Class used for creating LargeFileUploadTask fileobject.
 * This class accepts files of type ArrayBuffer, Blob, Uint8Array.
 */
class FileUpload {
    /**
     * @public
     * @constructor
     * @param {ArrayBuffer | Blob | Uint8Array} content - The file to be uploaded
     * @param {string} name - The name of the file to be uploaded
     * @param {number} size - The total size of the file to be uploaded
     * @returns An instance of the FileUpload class
     */
    constructor(content, name, size) {
        this.content = content;
        this.name = name;
        this.size = size;
        if (!content || !name || !size) {
            throw new GraphClientError_GraphClientError("Please provide the upload content, name of the file and size of the file");
        }
    }
    /**
     * @public
     * Slices the file content to the given range
     * @param {Range} range - The range value
     * @returns The sliced file part
     */
    sliceFile(range) {
        return this.content.slice(range.minValue, range.maxValue + 1);
    }
}
//# sourceMappingURL=FileUpload.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/OneDriveLargeFileUploadTaskUtil.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module OneDriveLargeFileUploadTaskUtil
 */
/**
 * @constant
 * Default value for the rangeSize
 * Recommended size is between 5 - 10 MB {@link https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/driveitem_createuploadsession#best-practices}
 */
const DEFAULT_FILE_SIZE = 5 * 1024 * 1024;
/**
 * @constant
 * Rounds off the given value to a multiple of 320 KB
 * @param {number} value - The value
 * @returns The rounded off value
 */
const roundTo320KB = (value) => {
    if (value > 320 * 1024) {
        value = Math.floor(value / (320 * 1024)) * 320 * 1024;
    }
    return value;
};
/**
 * @constant
 * Get the valid rangeSize for a file slicing (validity is based on the constrains mentioned in here
 * {@link https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/driveitem_createuploadsession#upload-bytes-to-the-upload-session})
 *
 * @param {number} [rangeSize = DEFAULT_FILE_SIZE] - The rangeSize value.
 * @returns The valid rangeSize
 */
const getValidRangeSize = (rangeSize = DEFAULT_FILE_SIZE) => {
    const sixtyMB = 60 * 1024 * 1024;
    if (rangeSize > sixtyMB) {
        rangeSize = sixtyMB;
    }
    return roundTo320KB(rangeSize);
};
//# sourceMappingURL=OneDriveLargeFileUploadTaskUtil.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/OneDriveLargeFileUploadTask.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module OneDriveLargeFileUploadTask
 */




/**
 * @class
 * Class representing OneDriveLargeFileUploadTask
 */
class OneDriveLargeFileUploadTask extends LargeFileUploadTask {
    /**
     * @private
     * @static
     * Constructs the create session url for Onedrive
     * @param {string} fileName - The name of the file
     * @param {path} [path = OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH] - The path for the upload
     * @returns The constructed create session url
     */
    static constructCreateSessionUrl(fileName, path = OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH) {
        fileName = fileName.trim();
        path = path.trim();
        if (path === "") {
            path = "/";
        }
        if (path[0] !== "/") {
            path = `/${path}`;
        }
        if (path[path.length - 1] !== "/") {
            path = `${path}/`;
        }
        // we choose to encode each component of the file path separately because when encoding full URI
        // with encodeURI, special characters like # or % in the file name doesn't get encoded as desired
        return `/me/drive/root:${path
            .split("/")
            .map((p) => encodeURIComponent(p))
            .join("/")}${encodeURIComponent(fileName)}:/createUploadSession`;
    }
    /**
     * @private
     * @static
     * Get file information
     * @param {Blob | Uint8Array | File} file - The file entity
     * @param {string} fileName - The file name
     * @returns {FileInfo} The file information
     */
    static getFileInfo(file, fileName) {
        let content;
        let size;
        if (typeof Blob !== "undefined" && file instanceof Blob) {
            content = new File([file], fileName);
            size = content.size;
        }
        else if (typeof File !== "undefined" && file instanceof File) {
            content = file;
            size = content.size;
        }
        else if (typeof Uint8Array !== "undefined" && file instanceof Uint8Array) {
            const b = file;
            size = b.byteLength;
            content = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
        }
        return {
            content,
            size,
        };
    }
    /**
     * @public
     * @static
     * @async
     * Creates a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {Blob | Uint8Array | File} file - File represented as Blob, Uint8Array or File
     * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
     * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
     */
    static create(client, file, options) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            if (!client || !file || !options) {
                throw new GraphClientError_GraphClientError("Please provide the Graph client instance, file object and OneDriveLargeFileUploadOptions value");
            }
            const fileName = options.fileName;
            const fileInfo = OneDriveLargeFileUploadTask.getFileInfo(file, fileName);
            const fileObj = new FileUpload(fileInfo.content, fileName, fileInfo.size);
            return this.createTaskWithFileObject(client, fileObj, options);
        });
    }
    /**
     * @public
     * @static
     * @async
     * Creates a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {FileObject} fileObject - FileObject instance
     * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
     * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
     */
    static createTaskWithFileObject(client, fileObject, options) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            if (!client || !fileObject || !options) {
                throw new GraphClientError_GraphClientError("Please provide the Graph client instance, FileObject interface implementation and OneDriveLargeFileUploadOptions value");
            }
            const requestUrl = options.uploadSessionURL ? options.uploadSessionURL : OneDriveLargeFileUploadTask.constructCreateSessionUrl(options.fileName, options.path);
            const uploadSessionPayload = {
                fileName: options.fileName,
                fileDescription: options.fileDescription,
                conflictBehavior: options.conflictBehavior,
            };
            const session = yield OneDriveLargeFileUploadTask.createUploadSession(client, requestUrl, uploadSessionPayload);
            const rangeSize = getValidRangeSize(options.rangeSize);
            return new OneDriveLargeFileUploadTask(client, fileObject, session, {
                rangeSize,
                uploadEventHandlers: options.uploadEventHandlers,
            });
        });
    }
    /**
     * @public
     * @static
     * @async
     * Makes request to the server to create an upload session
     * @param {Client} client - The GraphClient instance
     * @param {string} requestUrl - The URL to create the upload session
     * @param {string} payloadOptions - The payload option. Default conflictBehavior is 'rename'
     * @returns The promise that resolves to LargeFileUploadSession
     */
    static createUploadSession(client, requestUrl, payloadOptions) {
        const _super = Object.create(null, {
            createUploadSession: { get: () => super.createUploadSession }
        });
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const payload = {
                item: {
                    "@microsoft.graph.conflictBehavior": (payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.conflictBehavior) || "rename",
                    name: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileName,
                    description: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileDescription,
                },
            };
            return _super.createUploadSession.call(this, client, requestUrl, payload);
        });
    }
    /**
     * @public
     * @constructor
     * Constructs a OneDriveLargeFileUploadTask
     * @param {Client} client - The GraphClient instance
     * @param {FileObject} file - The FileObject holding details of a file that needs to be uploaded
     * @param {LargeFileUploadSession} uploadSession - The upload session to which the upload has to be done
     * @param {LargeFileUploadTaskOptions} options - The upload task options
     * @returns An instance of OneDriveLargeFileUploadTask
     */
    constructor(client, file, uploadSession, options) {
        super(client, file, uploadSession, options);
    }
    /**
     * @public
     * Commits upload session to end uploading
     * @param {string} requestUrl - The URL to commit the upload session
     * @param {string} conflictBehavior - Conflict behaviour option. Default is 'rename'
     * @returns The promise resolves to committed response
     */
    commit(requestUrl, conflictBehavior = "rename") {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const payload = {
                name: this.file.name,
                "@microsoft.graph.conflictBehavior": conflictBehavior,
                "@microsoft.graph.sourceUrl": this.uploadSession.url,
            };
            return yield this.client.api(requestUrl).put(payload);
        });
    }
}
/**
 * @private
 * @static
 * Default path for the file being uploaded
 */
OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH = "/";
//# sourceMappingURL=OneDriveLargeFileUploadTask.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/FileObjectClasses/StreamUpload.js
/* provided dependency */ var StreamUpload_Promise = __webpack_require__(64583)["Promise"];


/**
 * @class
 * FileObject class for Readable Stream upload
 */
class StreamUpload {
    constructor(content, name, size) {
        this.content = content;
        this.name = name;
        this.size = size;
        if (!content || !name || !size) {
            throw new GraphClientError("Please provide the Readable Stream content, name of the file and size of the file");
        }
    }
    /**
     * @public
     * Slices the file content to the given range
     * @param {Range} range - The range value
     * @returns The sliced file part
     */
    sliceFile(range) {
        return __awaiter(this, void 0, void 0, function* () {
            let rangeSize = range.maxValue - range.minValue + 1;
            /* readable.readable Is true if it is safe to call readable.read(),
             * which means the stream has not been destroyed or emitted 'error' or 'end'
             */
            const bufs = [];
            /**
             * The sliceFile reads the first `rangeSize` number of bytes from the stream.
             * The previousSlice property is used to seek the range of bytes in the previous slice.
             * Suppose, the sliceFile reads bytes from `10 - 20` from the stream but the upload of this slice fails.
             * When the user resumes, the stream will have bytes from position 21.
             * The previousSlice.Range is used to compare if the requested range is cached in the previousSlice property or present in the Readable Stream.
             */
            if (this.previousSlice) {
                if (range.minValue < this.previousSlice.range.minValue) {
                    throw new GraphClientError("An error occurred while uploading the stream. Please restart the stream upload from the first byte of the file.");
                }
                if (range.minValue < this.previousSlice.range.maxValue) {
                    const previousRangeMin = this.previousSlice.range.minValue;
                    const previousRangeMax = this.previousSlice.range.maxValue;
                    // Check if the requested range is same as previously sliced range
                    if (range.minValue === previousRangeMin && range.maxValue === previousRangeMax) {
                        return this.previousSlice.fileSlice;
                    }
                    /**
                     * The following check considers a possibility
                     * of an upload failing after some of the bytes of the previous slice
                     * were successfully uploaded.
                     * Example - Previous slice range - `10 - 20`. Current requested range is `15 - 20`.
                     */
                    if (range.maxValue === previousRangeMax) {
                        return this.previousSlice.fileSlice.slice(range.minValue, range.maxValue + 1);
                    }
                    /**
                     * If an upload fails after some of the bytes of the previous slice
                     * were successfully uploaded and the new Range.Maximum is greater than the previous Range.Maximum
                     * Example - Previous slice range - `10 - 20`. Current requested range is `15 - 25`,
                     * then read the bytes from position 15 to 20 from previousSlice.fileSlice and read bytes from position 21 to 25 from the Readable Stream
                     */
                    bufs.push(this.previousSlice.fileSlice.slice(range.minValue, previousRangeMax + 1));
                    rangeSize = range.maxValue - previousRangeMax;
                }
            }
            if (this.content && this.content.readable) {
                if (this.content.readableLength >= rangeSize) {
                    bufs.push(this.content.read(rangeSize));
                }
                else {
                    bufs.push(yield this.readNBytesFromStream(rangeSize));
                }
            }
            else {
                throw new GraphClientError("Stream is not readable.");
            }
            const slicedChunk = Buffer.concat(bufs);
            this.previousSlice = { fileSlice: slicedChunk, range };
            return slicedChunk;
        });
    }
    /**
     * @private
     * Reads the specified byte size from the stream
     * @param {number} size - The size of bytes to be read
     * @returns Buffer with the given length of data.
     */
    readNBytesFromStream(size) {
        return new StreamUpload_Promise((resolve, reject) => {
            const chunks = [];
            let remainder = size;
            let length = 0;
            this.content.on("end", () => {
                if (remainder > 0) {
                    return reject(new GraphClientError("Stream ended before reading required range size"));
                }
            });
            this.content.on("readable", () => {
                /**
                 * (chunk = this.content.read(size)) can return null if size of stream is less than 'size' parameter.
                 * Read the remainder number of bytes from the stream iteratively as they are available.
                 */
                let chunk;
                while (length < size && (chunk = this.content.read(remainder)) !== null) {
                    length += chunk.length;
                    chunks.push(chunk);
                    if (remainder > 0) {
                        remainder = size - length;
                    }
                }
                if (length === size) {
                    return resolve(Buffer.concat(chunks));
                }
                if (!this.content || !this.content.readable) {
                    return reject(new GraphClientError("Error encountered while reading the stream during the upload"));
                }
            });
        });
    }
}
//# sourceMappingURL=StreamUpload.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/CustomAuthenticationProvider.js
/* provided dependency */ var CustomAuthenticationProvider_Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module CustomAuthenticationProvider
 */

/**
 * @class
 * Class representing CustomAuthenticationProvider
 * @extends AuthenticationProvider
 */
class CustomAuthenticationProvider {
    /**
     * @public
     * @constructor
     * Creates an instance of CustomAuthenticationProvider
     * @param {AuthProviderCallback} provider - An authProvider function
     * @returns An instance of CustomAuthenticationProvider
     */
    constructor(provider) {
        this.provider = provider;
    }
    /**
     * @public
     * @async
     * To get the access token
     * @returns The promise that resolves to an access token
     */
    getAccessToken() {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return new CustomAuthenticationProvider_Promise((resolve, reject) => {
                this.provider((error, accessToken) => (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
                    if (accessToken) {
                        resolve(accessToken);
                    }
                    else {
                        if (!error) {
                            const invalidTokenMessage = "Access token is undefined or empty.\
						Please provide a valid token.\
						For more help - https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CustomAuthenticationProvider.md";
                            error = new GraphClientError_GraphClientError(invalidTokenMessage);
                        }
                        const err = yield GraphClientError_GraphClientError.setGraphClientError(error);
                        reject(err);
                    }
                }));
            });
        });
    }
}
//# sourceMappingURL=CustomAuthenticationProvider.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphError.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module GraphError
 */
/**
 * @class
 * Class for GraphError
 * @NOTE: This is NOT what is returned from the Graph
 * GraphError is created from parsing JSON errors returned from the graph
 * Some fields are renamed ie, "request-id" => requestId so you can use dot notation
 */
class GraphError extends Error {
    /**
     * @public
     * @constructor
     * Creates an instance of GraphError
     * @param {number} [statusCode = -1] - The status code of the error
     * @param {string} [message] - The message of the error
     * @param {Error} [baseError] - The base error
     * @returns An instance of GraphError
     */
    constructor(statusCode = -1, message, baseError) {
        super(message || (baseError && baseError.message));
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, GraphError.prototype);
        this.statusCode = statusCode;
        this.code = null;
        this.requestId = null;
        this.date = new Date();
        this.body = null;
        this.stack = baseError ? baseError.stack : this.stack;
    }
}
//# sourceMappingURL=GraphError.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphErrorHandler.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module GraphErrorHandler
 */

/**
 * @class
 * Class for GraphErrorHandler
 */
class GraphErrorHandler {
    /**
     * @private
     * @static
     * Populates the GraphError instance with Error instance values
     * @param {Error} error - The error returned by graph service or some native error
     * @param {number} [statusCode] - The status code of the response
     * @returns The GraphError instance
     */
    static constructError(error, statusCode, rawResponse) {
        const gError = new GraphError(statusCode, "", error);
        if (error.name !== undefined) {
            gError.code = error.name;
        }
        gError.body = error.toString();
        gError.date = new Date();
        gError.headers = rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.headers;
        return gError;
    }
    /**
     * @private
     * @static
     * @async
     * Populates the GraphError instance from the Error returned by graph service
     * @param {GraphAPIErrorResponse} graphError - The error possibly returned by graph service or some native error
     * @param {number} statusCode - The status code of the response
     * @returns A promise that resolves to GraphError instance
     *
     * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
     * {
     *      "error": {
     *          "code": "SearchEvents",
     *          "message": "The parameter $search is not currently supported on the Events resource.",
     *          "innerError": {
     *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
     *              "date": "2016-11-17T18:37:45"
     *          }
     *      }
     *  }
     */
    static constructErrorFromResponse(graphError, statusCode, rawResponse) {
        const error = graphError.error;
        const gError = new GraphError(statusCode, error.message);
        gError.code = error.code;
        if (error.innerError !== undefined) {
            gError.requestId = error.innerError["request-id"];
            gError.date = new Date(error.innerError.date);
        }
        gError.body = JSON.stringify(error);
        gError.headers = rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.headers;
        return gError;
    }
    /**
     * @public
     * @static
     * @async
     * To get the GraphError object
     * Reference - https://docs.microsoft.com/en-us/graph/errors
     * @param {any} [error = null] - The error returned by graph service or some native error
     * @param {number} [statusCode = -1] - The status code of the response
     * @param {GraphRequestCallback} [callback] - The graph request callback function
     * @returns A promise that resolves to GraphError instance
     */
    static getError(error = null, statusCode = -1, callback, rawResponse) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            let gError;
            if (error && error.error) {
                gError = GraphErrorHandler.constructErrorFromResponse(error, statusCode, rawResponse);
            }
            else if (error instanceof Error) {
                gError = GraphErrorHandler.constructError(error, statusCode, rawResponse);
            }
            else {
                gError = new GraphError(statusCode);
                gError.body = error; // if a custom error is passed which is not instance of Error object or a graph API response
            }
            if (typeof callback === "function") {
                callback(gError, null);
            }
            else {
                return gError;
            }
        });
    }
}
//# sourceMappingURL=GraphErrorHandler.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphRequest.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module GraphRequest
 */







/**
 * @class
 * A Class representing GraphRequest
 */
class GraphRequest {
    /**
     * @public
     * @constructor
     * Creates an instance of GraphRequest
     * @param {HTTPClient} httpClient - The HTTPClient instance
     * @param {ClientOptions} config - The options for making request
     * @param {string} path - A path string
     */
    constructor(httpClient, config, path) {
        /**
         * @private
         * Parses the path string and creates URLComponents out of it
         * @param {string} path - The request path string
         * @returns Nothing
         */
        this.parsePath = (path) => {
            // Strips out the base of the url if they passed in
            if (path.indexOf("https://") !== -1) {
                path = path.replace("https://", "");
                // Find where the host ends
                const endOfHostStrPos = path.indexOf("/");
                if (endOfHostStrPos !== -1) {
                    // Parse out the host
                    this.urlComponents.host = "https://" + path.substring(0, endOfHostStrPos);
                    // Strip the host from path
                    path = path.substring(endOfHostStrPos + 1, path.length);
                }
                // Remove the following version
                const endOfVersionStrPos = path.indexOf("/");
                if (endOfVersionStrPos !== -1) {
                    // Parse out the version
                    this.urlComponents.version = path.substring(0, endOfVersionStrPos);
                    // Strip version from path
                    path = path.substring(endOfVersionStrPos + 1, path.length);
                }
            }
            // Strip out any leading "/"
            if (path.charAt(0) === "/") {
                path = path.substr(1);
            }
            const queryStrPos = path.indexOf("?");
            if (queryStrPos === -1) {
                // No query string
                this.urlComponents.path = path;
            }
            else {
                this.urlComponents.path = path.substr(0, queryStrPos);
                // Capture query string into oDataQueryParams and otherURLQueryParams
                const queryParams = path.substring(queryStrPos + 1, path.length).split("&");
                for (const queryParam of queryParams) {
                    this.parseQueryParameter(queryParam);
                }
            }
        };
        this.httpClient = httpClient;
        this.config = config;
        this.urlComponents = {
            host: this.config.baseUrl,
            version: this.config.defaultVersion,
            oDataQueryParams: {},
            otherURLQueryParams: {},
            otherURLQueryOptions: [],
        };
        this._headers = {};
        this._options = {};
        this._middlewareOptions = [];
        this.parsePath(path);
    }
    /**
     * @private
     * Adds the query parameter as comma separated values
     * @param {string} propertyName - The name of a property
     * @param {string|string[]} propertyValue - The vale of a property
     * @param {IArguments} additionalProperties - The additional properties
     * @returns Nothing
     */
    addCsvQueryParameter(propertyName, propertyValue, additionalProperties) {
        // If there are already $propertyName value there, append a ","
        this.urlComponents.oDataQueryParams[propertyName] = this.urlComponents.oDataQueryParams[propertyName] ? this.urlComponents.oDataQueryParams[propertyName] + "," : "";
        let allValues = [];
        if (additionalProperties.length > 1 && typeof propertyValue === "string") {
            allValues = Array.prototype.slice.call(additionalProperties);
        }
        else if (typeof propertyValue === "string") {
            allValues.push(propertyValue);
        }
        else {
            allValues = allValues.concat(propertyValue);
        }
        this.urlComponents.oDataQueryParams[propertyName] += allValues.join(",");
    }
    /**
     * @private
     * Builds the full url from the URLComponents to make a request
     * @returns The URL string that is qualified to make a request to graph endpoint
     */
    buildFullUrl() {
        const url = urlJoin([this.urlComponents.host, this.urlComponents.version, this.urlComponents.path]) + this.createQueryString();
        if (this.config.debugLogging) {
            console.log(url);
        }
        return url;
    }
    /**
     * @private
     * Builds the query string from the URLComponents
     * @returns The Constructed query string
     */
    createQueryString() {
        // Combining query params from oDataQueryParams and otherURLQueryParams
        const urlComponents = this.urlComponents;
        const query = [];
        if (Object.keys(urlComponents.oDataQueryParams).length !== 0) {
            for (const property in urlComponents.oDataQueryParams) {
                if (Object.prototype.hasOwnProperty.call(urlComponents.oDataQueryParams, property)) {
                    query.push(property + "=" + urlComponents.oDataQueryParams[property]);
                }
            }
        }
        if (Object.keys(urlComponents.otherURLQueryParams).length !== 0) {
            for (const property in urlComponents.otherURLQueryParams) {
                if (Object.prototype.hasOwnProperty.call(urlComponents.otherURLQueryParams, property)) {
                    query.push(property + "=" + urlComponents.otherURLQueryParams[property]);
                }
            }
        }
        if (urlComponents.otherURLQueryOptions.length !== 0) {
            for (const str of urlComponents.otherURLQueryOptions) {
                query.push(str);
            }
        }
        return query.length > 0 ? "?" + query.join("&") : "";
    }
    /**
     * @private
     * Parses the query parameters to set the urlComponents property of the GraphRequest object
     * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query parameter
     * @returns The same GraphRequest instance that is being called with
     */
    parseQueryParameter(queryDictionaryOrString) {
        if (typeof queryDictionaryOrString === "string") {
            if (queryDictionaryOrString.charAt(0) === "?") {
                queryDictionaryOrString = queryDictionaryOrString.substring(1);
            }
            if (queryDictionaryOrString.indexOf("&") !== -1) {
                const queryParams = queryDictionaryOrString.split("&");
                for (const str of queryParams) {
                    this.parseQueryParamenterString(str);
                }
            }
            else {
                this.parseQueryParamenterString(queryDictionaryOrString);
            }
        }
        else if (queryDictionaryOrString.constructor === Object) {
            for (const key in queryDictionaryOrString) {
                if (Object.prototype.hasOwnProperty.call(queryDictionaryOrString, key)) {
                    this.setURLComponentsQueryParamater(key, queryDictionaryOrString[key]);
                }
            }
        }
        return this;
    }
    /**
     * @private
     * Parses the query parameter of string type to set the urlComponents property of the GraphRequest object
     * @param {string} queryParameter - the query parameters
     * returns nothing
     */
    parseQueryParamenterString(queryParameter) {
        /* The query key-value pair must be split on the first equals sign to avoid errors in parsing nested query parameters.
                 Example-> "/me?$expand=home($select=city)" */
        if (this.isValidQueryKeyValuePair(queryParameter)) {
            const indexOfFirstEquals = queryParameter.indexOf("=");
            const paramKey = queryParameter.substring(0, indexOfFirstEquals);
            const paramValue = queryParameter.substring(indexOfFirstEquals + 1);
            this.setURLComponentsQueryParamater(paramKey, paramValue);
        }
        else {
            /* Push values which are not of key-value structure.
            Example-> Handle an invalid input->.query(test), .query($select($select=name)) and let the Graph API respond with the error in the URL*/
            this.urlComponents.otherURLQueryOptions.push(queryParameter);
        }
    }
    /**
     * @private
     * Sets values into the urlComponents property of GraphRequest object.
     * @param {string} paramKey - the query parameter key
     * @param {string} paramValue - the query paramter value
     * @returns nothing
     */
    setURLComponentsQueryParamater(paramKey, paramValue) {
        if (oDataQueryNames.indexOf(paramKey) !== -1) {
            const currentValue = this.urlComponents.oDataQueryParams[paramKey];
            const isValueAppendable = currentValue && (paramKey === "$expand" || paramKey === "$select" || paramKey === "$orderby");
            this.urlComponents.oDataQueryParams[paramKey] = isValueAppendable ? currentValue + "," + paramValue : paramValue;
        }
        else {
            this.urlComponents.otherURLQueryParams[paramKey] = paramValue;
        }
    }
    /**
     * @private
     * Check if the query parameter string has a valid key-value structure
     * @param {string} queryString - the query parameter string. Example -> "name=value"
     * #returns true if the query string has a valid key-value structure else false
     */
    isValidQueryKeyValuePair(queryString) {
        const indexofFirstEquals = queryString.indexOf("=");
        if (indexofFirstEquals === -1) {
            return false;
        }
        const indexofOpeningParanthesis = queryString.indexOf("(");
        if (indexofOpeningParanthesis !== -1 && queryString.indexOf("(") < indexofFirstEquals) {
            // Example -> .query($select($expand=true));
            return false;
        }
        return true;
    }
    /**
     * @private
     * Updates the custom headers and options for a request
     * @param {FetchOptions} options - The request options object
     * @returns Nothing
     */
    updateRequestOptions(options) {
        const optionsHeaders = Object.assign({}, options.headers);
        if (this.config.fetchOptions !== undefined) {
            const fetchOptions = Object.assign({}, this.config.fetchOptions);
            Object.assign(options, fetchOptions);
            if (typeof this.config.fetchOptions.headers !== undefined) {
                options.headers = Object.assign({}, this.config.fetchOptions.headers);
            }
        }
        Object.assign(options, this._options);
        if (options.headers !== undefined) {
            Object.assign(optionsHeaders, options.headers);
        }
        Object.assign(optionsHeaders, this._headers);
        options.headers = optionsHeaders;
    }
    /**
     * @private
     * @async
     * Adds the custom headers and options to the request and makes the HTTPClient send request call
     * @param {RequestInfo} request - The request url string or the Request object value
     * @param {FetchOptions} options - The options to make a request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the response content
     */
    send(request, options, callback) {
        var _a;
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            let rawResponse;
            const middlewareControl = new middleware_MiddlewareControl/* MiddlewareControl */.M(this._middlewareOptions);
            this.updateRequestOptions(options);
            const customHosts = (_a = this.config) === null || _a === void 0 ? void 0 : _a.customHosts;
            try {
                const context = yield this.httpClient.sendRequest({
                    request,
                    options,
                    middlewareControl,
                    customHosts,
                });
                rawResponse = context.response;
                const response = yield GraphResponseHandler.getResponse(rawResponse, this._responseType, callback);
                return response;
            }
            catch (error) {
                if (error instanceof GraphClientError_GraphClientError) {
                    throw error;
                }
                let statusCode;
                if (rawResponse) {
                    statusCode = rawResponse.status;
                }
                const gError = yield GraphErrorHandler.getError(error, statusCode, callback, rawResponse);
                throw gError;
            }
        });
    }
    /**
     * @private
     * Checks if the content-type is present in the _headers property. If not present, defaults the content-type to application/json
     * @param none
     * @returns nothing
     */
    setHeaderContentType() {
        if (!this._headers) {
            this.header("Content-Type", "application/json");
            return;
        }
        const headerKeys = Object.keys(this._headers);
        for (const headerKey of headerKeys) {
            if (headerKey.toLowerCase() === "content-type") {
                return;
            }
        }
        // Default the content-type to application/json in case the content-type is not present in the header
        this.header("Content-Type", "application/json");
    }
    /**
     * @public
     * Sets the custom header for a request
     * @param {string} headerKey - A header key
     * @param {string} headerValue - A header value
     * @returns The same GraphRequest instance that is being called with
     */
    header(headerKey, headerValue) {
        this._headers[headerKey] = headerValue;
        return this;
    }
    /**
     * @public
     * Sets the custom headers for a request
     * @param {KeyValuePairObjectStringNumber | HeadersInit} headers - The request headers
     * @returns The same GraphRequest instance that is being called with
     */
    headers(headers) {
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                this._headers[key] = headers[key];
            }
        }
        return this;
    }
    /**
     * @public
     * Sets the option for making a request
     * @param {string} key - The key value
     * @param {any} value - The value
     * @returns The same GraphRequest instance that is being called with
     */
    option(key, value) {
        this._options[key] = value;
        return this;
    }
    /**
     * @public
     * Sets the options for making a request
     * @param {{ [key: string]: any }} options - The options key value pair
     * @returns The same GraphRequest instance that is being called with
     */
    options(options) {
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                this._options[key] = options[key];
            }
        }
        return this;
    }
    /**
     * @public
     * Sets the middleware options for a request
     * @param {MiddlewareOptions[]} options - The array of middleware options
     * @returns The same GraphRequest instance that is being called with
     */
    middlewareOptions(options) {
        this._middlewareOptions = options;
        return this;
    }
    /**
     * @public
     * Sets the api endpoint version for a request
     * @param {string} version - The version value
     * @returns The same GraphRequest instance that is being called with
     */
    version(version) {
        this.urlComponents.version = version;
        return this;
    }
    /**
     * @public
     * Sets the api endpoint version for a request
     * @param {ResponseType} responseType - The response type value
     * @returns The same GraphRequest instance that is being called with
     */
    responseType(responseType) {
        this._responseType = responseType;
        return this;
    }
    /**
     * @public
     * To add properties for select OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $select query
     */
    /*
     * Accepts .select("displayName,birthday")
     *     and .select(["displayName", "birthday"])
     *     and .select("displayName", "birthday")
     *
     */
    select(properties) {
        this.addCsvQueryParameter("$select", properties, arguments);
        return this;
    }
    /**
     * @public
     * To add properties for expand OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $expand query
     */
    expand(properties) {
        this.addCsvQueryParameter("$expand", properties, arguments);
        return this;
    }
    /**
     * @public
     * To add properties for orderby OData Query param
     * @param {string|string[]} properties - The Properties value
     * @returns The same GraphRequest instance that is being called with, after adding the properties for $orderby query
     */
    orderby(properties) {
        this.addCsvQueryParameter("$orderby", properties, arguments);
        return this;
    }
    /**
     * @public
     * To add query string for filter OData Query param. The request URL accepts only one $filter Odata Query option and its value is set to the most recently passed filter query string.
     * @param {string} filterStr - The filter query string
     * @returns The same GraphRequest instance that is being called with, after adding the $filter query
     */
    filter(filterStr) {
        this.urlComponents.oDataQueryParams.$filter = filterStr;
        return this;
    }
    /**
     * @public
     * To add criterion for search OData Query param. The request URL accepts only one $search Odata Query option and its value is set to the most recently passed search criterion string.
     * @param {string} searchStr - The search criterion string
     * @returns The same GraphRequest instance that is being called with, after adding the $search query criteria
     */
    search(searchStr) {
        this.urlComponents.oDataQueryParams.$search = searchStr;
        return this;
    }
    /**
     * @public
     * To add number for top OData Query param. The request URL accepts only one $top Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for $top query
     */
    top(n) {
        this.urlComponents.oDataQueryParams.$top = n;
        return this;
    }
    /**
     * @public
     * To add number for skip OData Query param. The request URL accepts only one $skip Odata Query option and its value is set to the most recently passed number value.
     * @param {number} n - The number value
     * @returns The same GraphRequest instance that is being called with, after adding the number for the $skip query
     */
    skip(n) {
        this.urlComponents.oDataQueryParams.$skip = n;
        return this;
    }
    /**
     * @public
     * To add token string for skipToken OData Query param. The request URL accepts only one $skipToken Odata Query option and its value is set to the most recently passed token value.
     * @param {string} token - The token value
     * @returns The same GraphRequest instance that is being called with, after adding the token string for $skipToken query option
     */
    skipToken(token) {
        this.urlComponents.oDataQueryParams.$skipToken = token;
        return this;
    }
    /**
     * @public
     * To add boolean for count OData Query param. The URL accepts only one $count Odata Query option and its value is set to the most recently passed boolean value.
     * @param {boolean} isCount - The count boolean
     * @returns The same GraphRequest instance that is being called with, after adding the boolean value for the $count query option
     */
    count(isCount = true) {
        this.urlComponents.oDataQueryParams.$count = isCount.toString();
        return this;
    }
    /**
     * @public
     * Appends query string to the urlComponent
     * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query value
     * @returns The same GraphRequest instance that is being called with, after appending the query string to the url component
     */
    /*
     * Accepts .query("displayName=xyz")
     *     and .select({ name: "value" })
     */
    query(queryDictionaryOrString) {
        return this.parseQueryParameter(queryDictionaryOrString);
    }
    /**
     * @public
     * @async
     * Makes a http request with GET method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the get response
     */
    get(callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            const options = {
                method: RequestMethod.GET,
            };
            const response = yield this.send(url, options, callback);
            return response;
        });
    }
    /**
     * @public
     * @async
     * Makes a http request with POST method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    post(content, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            const options = {
                method: RequestMethod.POST,
                body: serializeContent(content),
            };
            const className = content && content.constructor && content.constructor.name;
            if (className === "FormData") {
                // Content-Type headers should not be specified in case the of FormData type content
                options.headers = {};
            }
            else {
                this.setHeaderContentType();
                options.headers = this._headers;
            }
            return yield this.send(url, options, callback);
        });
    }
    /**
     * @public
     * @async
     * Alias for Post request call
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the post response
     */
    create(content, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return yield this.post(content, callback);
        });
    }
    /**
     * @public
     * @async
     * Makes http request with PUT method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the put response
     */
    put(content, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            this.setHeaderContentType();
            const options = {
                method: RequestMethod.PUT,
                body: serializeContent(content),
            };
            return yield this.send(url, options, callback);
        });
    }
    /**
     * @public
     * @async
     * Makes http request with PATCH method
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    patch(content, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            this.setHeaderContentType();
            const options = {
                method: RequestMethod.PATCH,
                body: serializeContent(content),
            };
            return yield this.send(url, options, callback);
        });
    }
    /**
     * @public
     * @async
     * Alias for PATCH request
     * @param {any} content - The content that needs to be sent with the request
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the patch response
     */
    update(content, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return yield this.patch(content, callback);
        });
    }
    /**
     * @public
     * @async
     * Makes http request with DELETE method
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    delete(callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            const options = {
                method: RequestMethod.DELETE,
            };
            return yield this.send(url, options, callback);
        });
    }
    /**
     * @public
     * @async
     * Alias for delete request call
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the delete response
     */
    del(callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            return yield this.delete(callback);
        });
    }
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the getStream response
     */
    getStream(callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            const options = {
                method: RequestMethod.GET,
            };
            this.responseType(ResponseType.STREAM);
            return yield this.send(url, options, callback);
        });
    }
    /**
     * @public
     * @async
     * Makes a http request with GET method to read response as a stream.
     * @param {any} stream - The stream instance
     * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
     * @returns A promise that resolves to the putStream response
     */
    putStream(stream, callback) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function* () {
            const url = this.buildFullUrl();
            const options = {
                method: RequestMethod.PUT,
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: stream,
            };
            return yield this.send(url, options, callback);
        });
    }
}
//# sourceMappingURL=GraphRequest.js.map
// EXTERNAL MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/HTTPClient.js
var HTTPClient = __webpack_require__(93776);
// EXTERNAL MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/HTTPMessageHandler.js
var middleware_HTTPMessageHandler = __webpack_require__(37923);
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/HTTPClientFactory.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module HTTPClientFactory
 */








/**
 * @private
 * To check whether the environment is node or not
 * @returns A boolean representing the environment is node or not
 */
const HTTPClientFactory_isNodeEnvironment = () => {
    return typeof process === "object" && "function" === "function";
};
/**
 * @class
 * Class representing HTTPClientFactory
 */
class HTTPClientFactory {
    /**
     * @public
     * @static
     * Creates HTTPClient with default middleware chain
     * @param {AuthenticationProvider} authProvider - The authentication provider instance
     * @returns A HTTPClient instance
     *
     * NOTE: These are the things that we need to remember while doing modifications in the below default pipeline.
     * 		* HTTPMessageHandler should be the last one in the middleware pipeline, because this makes the actual network call of the request
     * 		* TelemetryHandler should be the one prior to the last middleware in the chain, because this is the one which actually collects and appends the usage flag and placing this handler 	*		  before making the actual network call ensures that the usage of all features are recorded in the flag.
     * 		* The best place for AuthenticationHandler is in the starting of the pipeline, because every other handler might have to work for multiple times for a request but the auth token for
     * 		  them will remain same. For example, Retry and Redirect handlers might be working multiple times for a request based on the response but their auth token would remain same.
     */
    static createWithAuthenticationProvider(authProvider) {
        const authenticationHandler = new AuthenticationHandler_AuthenticationHandler(authProvider);
        const retryHandler = new RetryHandler_RetryHandler(new RetryHandlerOptions_RetryHandlerOptions());
        const telemetryHandler = new TelemetryHandler_TelemetryHandler();
        const httpMessageHandler = new middleware_HTTPMessageHandler/* HTTPMessageHandler */.e();
        authenticationHandler.setNext(retryHandler);
        if (HTTPClientFactory_isNodeEnvironment()) {
            const redirectHandler = new RedirectHandler_RedirectHandler(new RedirectHandlerOptions_RedirectHandlerOptions());
            retryHandler.setNext(redirectHandler);
            redirectHandler.setNext(telemetryHandler);
        }
        else {
            retryHandler.setNext(telemetryHandler);
        }
        telemetryHandler.setNext(httpMessageHandler);
        return HTTPClientFactory.createWithMiddleware(authenticationHandler);
    }
    /**
     * @public
     * @static
     * Creates a middleware chain with the given one
     * @property {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
     * @returns A HTTPClient instance
     */
    static createWithMiddleware(...middleware) {
        // Middleware should not empty or undefined. This is check is present in the HTTPClient constructor.
        return new HTTPClient/* HTTPClient */.S(...middleware);
    }
}
//# sourceMappingURL=HTTPClientFactory.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/ValidatePolyFilling.js
/* provided dependency */ var ValidatePolyFilling_Promise = __webpack_require__(64583)["Promise"];
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @constant
 * @function
 * Validates availability of Promise and fetch in global context
 * @returns The true in case the Promise and fetch available, otherwise throws error
 */
const validatePolyFilling = () => {
    if (typeof ValidatePolyFilling_Promise === "undefined" && typeof fetch === "undefined") {
        const error = new Error("Library cannot function without Promise and fetch. So, please provide polyfill for them.");
        error.name = "PolyFillNotAvailable";
        throw error;
    }
    else if (typeof ValidatePolyFilling_Promise === "undefined") {
        const error = new Error("Library cannot function without Promise. So, please provide polyfill for it.");
        error.name = "PolyFillNotAvailable";
        throw error;
    }
    else if (typeof fetch === "undefined") {
        const error = new Error("Library cannot function without fetch. So, please provide polyfill for it.");
        error.name = "PolyFillNotAvailable";
        throw error;
    }
    return true;
};
//# sourceMappingURL=ValidatePolyFilling.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/Client.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @module Client
 */






class Client {
    /**
     * @public
     * @static
     * To create a client instance with options and initializes the default middleware chain
     * @param {Options} options - The options for client instance
     * @returns The Client instance
     */
    static init(options) {
        const clientOptions = {};
        for (const i in options) {
            if (Object.prototype.hasOwnProperty.call(options, i)) {
                clientOptions[i] = i === "authProvider" ? new CustomAuthenticationProvider(options[i]) : options[i];
            }
        }
        return Client.initWithMiddleware(clientOptions);
    }
    /**
     * @public
     * @static
     * To create a client instance with the Client Options
     * @param {ClientOptions} clientOptions - The options object for initializing the client
     * @returns The Client instance
     */
    static initWithMiddleware(clientOptions) {
        return new Client(clientOptions);
    }
    /**
     * @private
     * @constructor
     * Creates an instance of Client
     * @param {ClientOptions} clientOptions - The options to instantiate the client object
     */
    constructor(clientOptions) {
        /**
         * @private
         * A member which stores the Client instance options
         */
        this.config = {
            baseUrl: GRAPH_BASE_URL,
            debugLogging: false,
            defaultVersion: GRAPH_API_VERSION,
        };
        validatePolyFilling();
        for (const key in clientOptions) {
            if (Object.prototype.hasOwnProperty.call(clientOptions, key)) {
                this.config[key] = clientOptions[key];
            }
        }
        let httpClient;
        if (clientOptions.authProvider !== undefined && clientOptions.middleware !== undefined) {
            const error = new Error();
            error.name = "AmbiguityInInitialization";
            error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain not both";
            throw error;
        }
        else if (clientOptions.authProvider !== undefined) {
            httpClient = HTTPClientFactory.createWithAuthenticationProvider(clientOptions.authProvider);
        }
        else if (clientOptions.middleware !== undefined) {
            httpClient = new HTTPClient/* HTTPClient */.S(...[].concat(clientOptions.middleware));
        }
        else {
            const error = new Error();
            error.name = "InvalidMiddlewareChain";
            error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain";
            throw error;
        }
        this.httpClient = httpClient;
    }
    /**
     * @public
     * Entry point to make requests
     * @param {string} path - The path string value
     * @returns The graph request instance
     */
    api(path) {
        return new GraphRequest(this.httpClient, this.config, path);
    }
}
//# sourceMappingURL=Client.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/microsoft-graph-client/lib/es/src/browser/index.js
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path= "../../shims.d.ts" />





























//# sourceMappingURL=index.js.map

/***/ }),

/***/ 37923:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: function() { return /* binding */ HTTPMessageHandler; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31635);
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @class
 * @implements Middleware
 * Class for HTTPMessageHandler
 */
class HTTPMessageHandler {
    /**
     * @public
     * @async
     * To execute the current middleware
     * @param {Context} context - The request context object
     * @returns A promise that resolves to nothing
     */
    execute(context) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(this, void 0, void 0, function* () {
            context.response = yield fetch(context.request, context.options);
        });
    }
}
//# sourceMappingURL=HTTPMessageHandler.js.map

/***/ }),

/***/ 68421:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: function() { return /* binding */ MiddlewareControl; }
/* harmony export */ });
/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/**
 * @class
 * Class representing MiddlewareControl
 */
class MiddlewareControl {
    /**
     * @public
     * @constructor
     * Creates an instance of MiddlewareControl
     * @param {MiddlewareOptions[]} [middlewareOptions = []] - The array of middlewareOptions
     * @returns The instance of MiddlewareControl
     */
    constructor(middlewareOptions = []) {
        this.middlewareOptions = new Map();
        for (const option of middlewareOptions) {
            const fn = option.constructor;
            this.middlewareOptions.set(fn, option);
        }
    }
    /**
     * @public
     * To get the middleware option using the class of the option
     * @param {Function} fn - The class of the strongly typed option class
     * @returns The middleware option
     * @example
     * // if you wanted to return the middleware option associated with this class (MiddlewareControl)
     * // call this function like this:
     * getMiddlewareOptions(MiddlewareControl)
     */
    getMiddlewareOptions(fn) {
        return this.middlewareOptions.get(fn);
    }
    /**
     * @public
     * To set the middleware options using the class of the option
     * @param {Function} fn - The class of the strongly typed option class
     * @param {MiddlewareOptions} option - The strongly typed middleware option
     * @returns nothing
     */
    setMiddlewareOptions(fn, option) {
        this.middlewareOptions.set(fn, option);
    }
}
//# sourceMappingURL=MiddlewareControl.js.map

/***/ }),

/***/ 64583:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof __webpack_require__.g !== 'undefined') {
    local = __webpack_require__.g;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map


/***/ }),

/***/ 22551:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Promise = __webpack_require__(64583)["Promise"];
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(96540),ca=__webpack_require__(69982);function p(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var da=new Set,ea={};function fa(a,b){ha(a,b);ha(a+"Capture",b)}
function ha(a,b){ea[a]=b;for(a=0;a<b.length;a++)da.add(b[a])}
var ia=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ja=Object.prototype.hasOwnProperty,ka=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,la=
{},ma={};function oa(a){if(ja.call(ma,a))return!0;if(ja.call(la,a))return!1;if(ka.test(a))return ma[a]=!0;la[a]=!0;return!1}function pa(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function qa(a,b,c,d){if(null===b||"undefined"===typeof b||pa(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function v(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var z={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){z[a]=new v(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];z[b]=new v(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){z[a]=new v(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){z[a]=new v(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){z[a]=new v(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){z[a]=new v(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){z[a]=new v(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){z[a]=new v(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){z[a]=new v(a,5,!1,a.toLowerCase(),null,!1,!1)});var ra=/[\-:]([a-z])/g;function sa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(ra,
sa);z[b]=new v(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(ra,sa);z[b]=new v(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!1,!1)});
z.xlinkHref=new v("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){z[a]=new v(a,1,!1,a.toLowerCase(),null,!0,!0)});
function ta(a,b,c,d){var e=z.hasOwnProperty(b)?z[b]:null;if(null!==e?0!==e.type:d||!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1])qa(b,c,e,d)&&(c=null),d||null===e?oa(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c)))}
var ua=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,va=Symbol.for("react.element"),wa=Symbol.for("react.portal"),ya=Symbol.for("react.fragment"),za=Symbol.for("react.strict_mode"),Aa=Symbol.for("react.profiler"),Ba=Symbol.for("react.provider"),Ca=Symbol.for("react.context"),Da=Symbol.for("react.forward_ref"),Ea=Symbol.for("react.suspense"),Fa=Symbol.for("react.suspense_list"),Ga=Symbol.for("react.memo"),Ha=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");
var Ia=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Ja=Symbol.iterator;function Ka(a){if(null===a||"object"!==typeof a)return null;a=Ja&&a[Ja]||a["@@iterator"];return"function"===typeof a?a:null}var A=Object.assign,La;function Ma(a){if(void 0===La)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);La=b&&b[1]||""}return"\n"+La+a}var Na=!1;
function Oa(a,b){if(!a||Na)return"";Na=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(l){var d=l}Reflect.construct(a,[],b)}else{try{b.call()}catch(l){d=l}a.call(b.prototype)}else{try{throw Error();}catch(l){d=l}a()}}catch(l){if(l&&d&&"string"===typeof l.stack){for(var e=l.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h]){var k="\n"+e[g].replace(" at new "," at ");a.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",a.displayName));return k}while(1<=g&&0<=h)}break}}}finally{Na=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Ma(a):""}
function Pa(a){switch(a.tag){case 5:return Ma(a.type);case 16:return Ma("Lazy");case 13:return Ma("Suspense");case 19:return Ma("SuspenseList");case 0:case 2:case 15:return a=Oa(a.type,!1),a;case 11:return a=Oa(a.type.render,!1),a;case 1:return a=Oa(a.type,!0),a;default:return""}}
function Qa(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ya:return"Fragment";case wa:return"Portal";case Aa:return"Profiler";case za:return"StrictMode";case Ea:return"Suspense";case Fa:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case Ca:return(a.displayName||"Context")+".Consumer";case Ba:return(a._context.displayName||"Context")+".Provider";case Da:var b=a.render;a=a.displayName;a||(a=b.displayName||
b.name||"",a=""!==a?"ForwardRef("+a+")":"ForwardRef");return a;case Ga:return b=a.displayName||null,null!==b?b:Qa(a.type)||"Memo";case Ha:b=a._payload;a=a._init;try{return Qa(a(b))}catch(c){}}return null}
function Ra(a){var b=a.type;switch(a.tag){case 24:return"Cache";case 9:return(b.displayName||"Context")+".Consumer";case 10:return(b._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return a=b.render,a=a.displayName||a.name||"",b.displayName||(""!==a?"ForwardRef("+a+")":"ForwardRef");case 7:return"Fragment";case 5:return b;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Qa(b);case 8:return b===za?"StrictMode":"Mode";case 22:return"Offscreen";
case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if("function"===typeof b)return b.displayName||b.name||null;if("string"===typeof b)return b}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "string":case "undefined":return a;case "object":return a;default:return""}}
function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return A({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function ab(a,b){b=b.checked;null!=b&&ta(a,"checked",b,!1)}
function bb(a,b){ab(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?cb(a,b.type,c):b.hasOwnProperty("defaultValue")&&cb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function db(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function cb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}var eb=Array.isArray;
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(p(91));return A({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(p(92));if(eb(c)){if(1<c.length)throw Error(p(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}function kb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}
function lb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?kb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var mb,nb=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if("http://www.w3.org/2000/svg"!==a.namespaceURI||"innerHTML"in a)a.innerHTML=b;else{mb=mb||document.createElement("div");mb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=mb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function ob(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var pb={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,
zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},qb=["Webkit","ms","Moz","O"];Object.keys(pb).forEach(function(a){qb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);pb[b]=pb[a]})});function rb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||pb.hasOwnProperty(a)&&pb[a]?(""+b).trim():b+"px"}
function sb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=rb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var tb=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function ub(a,b){if(b){if(tb[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(p(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(p(60));if("object"!==typeof b.dangerouslySetInnerHTML||!("__html"in b.dangerouslySetInnerHTML))throw Error(p(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(p(62));}}
function vb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}var wb=null;function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(p(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(){}var Ib=!1;function Jb(a,b,c){if(Ib)return a(b,c);Ib=!0;try{return Gb(a,b,c)}finally{if(Ib=!1,null!==zb||null!==Ab)Hb(),Fb()}}
function Kb(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(p(231,b,typeof c));return c}var Lb=!1;if(ia)try{var Mb={};Object.defineProperty(Mb,"passive",{get:function(){Lb=!0}});window.addEventListener("test",Mb,Mb);window.removeEventListener("test",Mb,Mb)}catch(a){Lb=!1}function Nb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(m){this.onError(m)}}var Ob=!1,Pb=null,Qb=!1,Rb=null,Sb={onError:function(a){Ob=!0;Pb=a}};function Tb(a,b,c,d,e,f,g,h,k){Ob=!1;Pb=null;Nb.apply(Sb,arguments)}
function Ub(a,b,c,d,e,f,g,h,k){Tb.apply(this,arguments);if(Ob){if(Ob){var l=Pb;Ob=!1;Pb=null}else throw Error(p(198));Qb||(Qb=!0,Rb=l)}}function Vb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&4098)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function Wb(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function Xb(a){if(Vb(a)!==a)throw Error(p(188));}
function Yb(a){var b=a.alternate;if(!b){b=Vb(a);if(null===b)throw Error(p(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return Xb(e),a;if(f===d)return Xb(e),b;f=f.sibling}throw Error(p(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(p(189));}}if(c.alternate!==d)throw Error(p(190));}if(3!==c.tag)throw Error(p(188));return c.stateNode.current===c?a:b}function Zb(a){a=Yb(a);return null!==a?$b(a):null}function $b(a){if(5===a.tag||6===a.tag)return a;for(a=a.child;null!==a;){var b=$b(a);if(null!==b)return b;a=a.sibling}return null}
var ac=ca.unstable_scheduleCallback,bc=ca.unstable_cancelCallback,cc=ca.unstable_shouldYield,dc=ca.unstable_requestPaint,B=ca.unstable_now,ec=ca.unstable_getCurrentPriorityLevel,fc=ca.unstable_ImmediatePriority,gc=ca.unstable_UserBlockingPriority,hc=ca.unstable_NormalPriority,ic=ca.unstable_LowPriority,jc=ca.unstable_IdlePriority,kc=null,lc=null;function mc(a){if(lc&&"function"===typeof lc.onCommitFiberRoot)try{lc.onCommitFiberRoot(kc,a,void 0,128===(a.current.flags&128))}catch(b){}}
var oc=Math.clz32?Math.clz32:nc,pc=Math.log,qc=Math.LN2;function nc(a){a>>>=0;return 0===a?32:31-(pc(a)/qc|0)|0}var rc=64,sc=4194304;
function tc(a){switch(a&-a){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return a&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;
default:return a}}function uc(a,b){var c=a.pendingLanes;if(0===c)return 0;var d=0,e=a.suspendedLanes,f=a.pingedLanes,g=c&268435455;if(0!==g){var h=g&~e;0!==h?d=tc(h):(f&=g,0!==f&&(d=tc(f)))}else g=c&~e,0!==g?d=tc(g):0!==f&&(d=tc(f));if(0===d)return 0;if(0!==b&&b!==d&&0===(b&e)&&(e=d&-d,f=b&-b,e>=f||16===e&&0!==(f&4194240)))return b;0!==(d&4)&&(d|=c&16);b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-oc(b),e=1<<c,d|=a[c],b&=~e;return d}
function vc(a,b){switch(a){case 1:case 2:case 4:return b+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return b+5E3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}
function wc(a,b){for(var c=a.suspendedLanes,d=a.pingedLanes,e=a.expirationTimes,f=a.pendingLanes;0<f;){var g=31-oc(f),h=1<<g,k=e[g];if(-1===k){if(0===(h&c)||0!==(h&d))e[g]=vc(h,b)}else k<=b&&(a.expiredLanes|=h);f&=~h}}function xc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function yc(){var a=rc;rc<<=1;0===(rc&4194240)&&(rc=64);return a}function zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function Ac(a,b,c){a.pendingLanes|=b;536870912!==b&&(a.suspendedLanes=0,a.pingedLanes=0);a=a.eventTimes;b=31-oc(b);a[b]=c}function Bc(a,b){var c=a.pendingLanes&~b;a.pendingLanes=b;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=b;a.mutableReadLanes&=b;a.entangledLanes&=b;b=a.entanglements;var d=a.eventTimes;for(a=a.expirationTimes;0<c;){var e=31-oc(c),f=1<<e;b[e]=0;d[e]=-1;a[e]=-1;c&=~f}}
function Cc(a,b){var c=a.entangledLanes|=b;for(a=a.entanglements;c;){var d=31-oc(c),e=1<<d;e&b|a[d]&b&&(a[d]|=b);c&=~e}}var C=0;function Dc(a){a&=-a;return 1<a?4<a?0!==(a&268435455)?16:536870912:4:1}var Ec,Fc,Gc,Hc,Ic,Jc=!1,Kc=[],Lc=null,Mc=null,Nc=null,Oc=new Map,Pc=new Map,Qc=[],Rc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a,b){switch(a){case "focusin":case "focusout":Lc=null;break;case "dragenter":case "dragleave":Mc=null;break;case "mouseover":case "mouseout":Nc=null;break;case "pointerover":case "pointerout":Oc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":Pc.delete(b.pointerId)}}
function Tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a={blockedOn:b,domEventName:c,eventSystemFlags:d,nativeEvent:f,targetContainers:[e]},null!==b&&(b=Cb(b),null!==b&&Fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function Uc(a,b,c,d,e){switch(b){case "focusin":return Lc=Tc(Lc,a,b,c,d,e),!0;case "dragenter":return Mc=Tc(Mc,a,b,c,d,e),!0;case "mouseover":return Nc=Tc(Nc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;Oc.set(f,Tc(Oc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,Pc.set(f,Tc(Pc.get(f)||null,a,b,c,d,e)),!0}return!1}
function Vc(a){var b=Wc(a.target);if(null!==b){var c=Vb(b);if(null!==c)if(b=c.tag,13===b){if(b=Wb(c),null!==b){a.blockedOn=b;Ic(a.priority,function(){Gc(c)});return}}else if(3===b&&c.stateNode.current.memoizedState.isDehydrated){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function Xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=Yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null===c){c=a.nativeEvent;var d=new c.constructor(c.type,c);wb=d;c.target.dispatchEvent(d);wb=null}else return b=Cb(c),null!==b&&Fc(b),a.blockedOn=c,!1;b.shift()}return!0}function Zc(a,b,c){Xc(a)&&c.delete(b)}function $c(){Jc=!1;null!==Lc&&Xc(Lc)&&(Lc=null);null!==Mc&&Xc(Mc)&&(Mc=null);null!==Nc&&Xc(Nc)&&(Nc=null);Oc.forEach(Zc);Pc.forEach(Zc)}
function ad(a,b){a.blockedOn===b&&(a.blockedOn=null,Jc||(Jc=!0,ca.unstable_scheduleCallback(ca.unstable_NormalPriority,$c)))}
function bd(a){function b(b){return ad(b,a)}if(0<Kc.length){ad(Kc[0],a);for(var c=1;c<Kc.length;c++){var d=Kc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==Lc&&ad(Lc,a);null!==Mc&&ad(Mc,a);null!==Nc&&ad(Nc,a);Oc.forEach(b);Pc.forEach(b);for(c=0;c<Qc.length;c++)d=Qc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<Qc.length&&(c=Qc[0],null===c.blockedOn);)Vc(c),null===c.blockedOn&&Qc.shift()}var cd=ua.ReactCurrentBatchConfig,dd=!0;
function ed(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=1,fd(a,b,c,d)}finally{C=e,cd.transition=f}}function gd(a,b,c,d){var e=C,f=cd.transition;cd.transition=null;try{C=4,fd(a,b,c,d)}finally{C=e,cd.transition=f}}
function fd(a,b,c,d){if(dd){var e=Yc(a,b,c,d);if(null===e)hd(a,b,d,id,c),Sc(a,d);else if(Uc(e,a,b,c,d))d.stopPropagation();else if(Sc(a,d),b&4&&-1<Rc.indexOf(a)){for(;null!==e;){var f=Cb(e);null!==f&&Ec(f);f=Yc(a,b,c,d);null===f&&hd(a,b,d,id,c);if(f===e)break;e=f}null!==e&&d.stopPropagation()}else hd(a,b,d,null,c)}}var id=null;
function Yc(a,b,c,d){id=null;a=xb(d);a=Wc(a);if(null!==a)if(b=Vb(a),null===b)a=null;else if(c=b.tag,13===c){a=Wb(b);if(null!==a)return a;a=null}else if(3===c){if(b.stateNode.current.memoizedState.isDehydrated)return 3===b.tag?b.stateNode.containerInfo:null;a=null}else b!==a&&(a=null);id=a;return null}
function jd(a){switch(a){case "cancel":case "click":case "close":case "contextmenu":case "copy":case "cut":case "auxclick":case "dblclick":case "dragend":case "dragstart":case "drop":case "focusin":case "focusout":case "input":case "invalid":case "keydown":case "keypress":case "keyup":case "mousedown":case "mouseup":case "paste":case "pause":case "play":case "pointercancel":case "pointerdown":case "pointerup":case "ratechange":case "reset":case "resize":case "seeked":case "submit":case "touchcancel":case "touchend":case "touchstart":case "volumechange":case "change":case "selectionchange":case "textInput":case "compositionstart":case "compositionend":case "compositionupdate":case "beforeblur":case "afterblur":case "beforeinput":case "blur":case "fullscreenchange":case "focus":case "hashchange":case "popstate":case "select":case "selectstart":return 1;case "drag":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "mousemove":case "mouseout":case "mouseover":case "pointermove":case "pointerout":case "pointerover":case "scroll":case "toggle":case "touchmove":case "wheel":case "mouseenter":case "mouseleave":case "pointerenter":case "pointerleave":return 4;
case "message":switch(ec()){case fc:return 1;case gc:return 4;case hc:case ic:return 16;case jc:return 536870912;default:return 16}default:return 16}}var kd=null,ld=null,md=null;function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}
function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}A(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=A({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=A({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=A({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=A({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=A({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=A({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=A({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=A({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=A({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=A({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=A({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=A({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=ia&&"CompositionEvent"in window,be=null;ia&&"documentMode"in document&&(be=document.documentMode);var ce=ia&&"TextEvent"in window&&!be,de=ia&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(ia){var xe;if(ia){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));Jb(re,b)}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge;
function Ie(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++){var e=c[d];if(!ja.call(b,e)||!He(a[e],b[e]))return!1}return!0}function Je(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ke(a,b){var c=Je(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Je(c)}}function Le(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Le(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Me(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Ne(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Oe(a){var b=Me(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Le(c.ownerDocument.documentElement,c)){if(null!==d&&Ne(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ke(c,f);var g=Ke(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)))}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}}
var Pe=ia&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Ne(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Ie(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
function Ve(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var We={animationend:Ve("Animation","AnimationEnd"),animationiteration:Ve("Animation","AnimationIteration"),animationstart:Ve("Animation","AnimationStart"),transitionend:Ve("Transition","TransitionEnd")},Xe={},Ye={};
ia&&(Ye=document.createElement("div").style,"AnimationEvent"in window||(delete We.animationend.animation,delete We.animationiteration.animation,delete We.animationstart.animation),"TransitionEvent"in window||delete We.transitionend.transition);function Ze(a){if(Xe[a])return Xe[a];if(!We[a])return a;var b=We[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Ye)return Xe[a]=b[c];return a}var $e=Ze("animationend"),af=Ze("animationiteration"),bf=Ze("animationstart"),cf=Ze("transitionend"),df=new Map,ef="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a,b){df.set(a,b);fa(b,[a])}for(var gf=0;gf<ef.length;gf++){var hf=ef[gf],jf=hf.toLowerCase(),kf=hf[0].toUpperCase()+hf.slice(1);ff(jf,"on"+kf)}ff($e,"onAnimationEnd");ff(af,"onAnimationIteration");ff(bf,"onAnimationStart");ff("dblclick","onDoubleClick");ff("focusin","onFocus");ff("focusout","onBlur");ff(cf,"onTransitionEnd");ha("onMouseEnter",["mouseout","mouseover"]);ha("onMouseLeave",["mouseout","mouseover"]);ha("onPointerEnter",["pointerout","pointerover"]);
ha("onPointerLeave",["pointerout","pointerover"]);fa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));fa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));fa("onBeforeInput",["compositionend","keypress","textInput","paste"]);fa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));fa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var lf="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),mf=new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Ub(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;nf(e,h,l);f=k}}}if(Qb)throw a=Rb,Qb=!1,Rb=null,a;}
function D(a,b){var c=b[of];void 0===c&&(c=b[of]=new Set);var d=a+"__bubble";c.has(d)||(pf(b,a,2,!1),c.add(d))}function qf(a,b,c){var d=0;b&&(d|=4);pf(c,a,d,b)}var rf="_reactListening"+Math.random().toString(36).slice(2);function sf(a){if(!a[rf]){a[rf]=!0;da.forEach(function(b){"selectionchange"!==b&&(mf.has(b)||qf(b,!1,a),qf(b,!0,a))});var b=9===a.nodeType?a:a.ownerDocument;null===b||b[rf]||(b[rf]=!0,qf("selectionchange",!1,b))}}
function pf(a,b,c,d){switch(jd(b)){case 1:var e=ed;break;case 4:e=gd;break;default:e=fd}c=e.bind(null,b,c,a);e=void 0;!Lb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function hd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=Wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Jb(function(){var d=f,e=xb(c),g=[];
a:{var h=df.get(a);if(void 0!==h){var k=td,n=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":n="focus";k=Fd;break;case "focusout":n="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case $e:case af:case bf:k=Hd;break;case cf:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var t=0!==(b&4),J=!t&&"scroll"===a,x=t?null!==h?h+"Capture":null:h;t=[];for(var w=d,u;null!==
w;){u=w;var F=u.stateNode;5===u.tag&&null!==F&&(u=F,null!==x&&(F=Kb(w,x),null!=F&&t.push(tf(w,F,u))));if(J)break;w=w.return}0<t.length&&(h=new k(h,n,null,c,e),g.push({event:h,listeners:t}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&c!==wb&&(n=c.relatedTarget||c.fromElement)&&(Wc(n)||n[uf]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(n=c.relatedTarget||c.toElement,k=d,n=n?Wc(n):null,null!==
n&&(J=Vb(n),n!==J||5!==n.tag&&6!==n.tag))n=null}else k=null,n=d;if(k!==n){t=Bd;F="onMouseLeave";x="onMouseEnter";w="mouse";if("pointerout"===a||"pointerover"===a)t=Td,F="onPointerLeave",x="onPointerEnter",w="pointer";J=null==k?h:ue(k);u=null==n?h:ue(n);h=new t(F,w+"leave",k,c,e);h.target=J;h.relatedTarget=u;F=null;Wc(e)===d&&(t=new t(x,w+"enter",n,c,e),t.target=u,t.relatedTarget=J,F=t);J=F;if(k&&n)b:{t=k;x=n;w=0;for(u=t;u;u=vf(u))w++;u=0;for(F=x;F;F=vf(F))u++;for(;0<w-u;)t=vf(t),w--;for(;0<u-w;)x=
vf(x),u--;for(;w--;){if(t===x||null!==x&&t===x.alternate)break b;t=vf(t);x=vf(x)}t=null}else t=null;null!==k&&wf(g,h,k,t,!1);null!==n&&null!==J&&wf(g,J,n,t,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var na=ve;else if(me(h))if(we)na=Fe;else{na=De;var xa=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(na=Ee);if(na&&(na=na(a,d))){ne(g,na,c,e);break a}xa&&xa(a,h,d);"focusout"===a&&(xa=h._wrapperState)&&
xa.controlled&&"number"===h.type&&cb(h,"number",h.value)}xa=d?ue(d):window;switch(a){case "focusin":if(me(xa)||"true"===xa.contentEditable)Qe=xa,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var $a;if(ae)b:{switch(a){case "compositionstart":var ba="onCompositionStart";break b;case "compositionend":ba="onCompositionEnd";
break b;case "compositionupdate":ba="onCompositionUpdate";break b}ba=void 0}else ie?ge(a,c)&&(ba="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(ba="onCompositionStart");ba&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==ba?"onCompositionEnd"===ba&&ie&&($a=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),xa=oe(d,ba),0<xa.length&&(ba=new Ld(ba,a,null,c,e),g.push({event:ba,listeners:xa}),$a?ba.data=$a:($a=he(c),null!==$a&&(ba.data=$a))));if($a=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),
0<d.length&&(e=new Ld("onBeforeInput","beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=$a)}se(g,b)})}function tf(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Kb(a,c),null!=f&&d.unshift(tf(a,f,e)),f=Kb(a,b),null!=f&&d.push(tf(a,f,e)));a=a.return}return d}function vf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function wf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Kb(c,f),null!=k&&g.unshift(tf(c,k,h))):e||(k=Kb(c,f),null!=k&&g.push(tf(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}var xf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function zf(a){return("string"===typeof a?a:""+a).replace(xf,"\n").replace(yf,"")}function Af(a,b,c){b=zf(b);if(zf(a)!==b&&c)throw Error(p(425));}function Bf(){}
var Cf=null,Df=null;function Ef(a,b){return"textarea"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var Ff="function"===typeof setTimeout?setTimeout:void 0,Gf="function"===typeof clearTimeout?clearTimeout:void 0,Hf="function"===typeof Promise?Promise:void 0,Jf="function"===typeof queueMicrotask?queueMicrotask:"undefined"!==typeof Hf?function(a){return Hf.resolve(null).then(a).catch(If)}:Ff;function If(a){setTimeout(function(){throw a;})}
function Kf(a,b){var c=b,d=0;do{var e=c.nextSibling;a.removeChild(c);if(e&&8===e.nodeType)if(c=e.data,"/$"===c){if(0===d){a.removeChild(e);bd(b);return}d--}else"$"!==c&&"$?"!==c&&"$!"!==c||d++;c=e}while(c);bd(b)}function Lf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break;if(8===b){b=a.data;if("$"===b||"$!"===b||"$?"===b)break;if("/$"===b)return null}}return a}
function Mf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var Nf=Math.random().toString(36).slice(2),Of="__reactFiber$"+Nf,Pf="__reactProps$"+Nf,uf="__reactContainer$"+Nf,of="__reactEvents$"+Nf,Qf="__reactListeners$"+Nf,Rf="__reactHandles$"+Nf;
function Wc(a){var b=a[Of];if(b)return b;for(var c=a.parentNode;c;){if(b=c[uf]||c[Of]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=Mf(a);null!==a;){if(c=a[Of])return c;a=Mf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[Of]||a[uf];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(p(33));}function Db(a){return a[Pf]||null}var Sf=[],Tf=-1;function Uf(a){return{current:a}}
function E(a){0>Tf||(a.current=Sf[Tf],Sf[Tf]=null,Tf--)}function G(a,b){Tf++;Sf[Tf]=a.current;a.current=b}var Vf={},H=Uf(Vf),Wf=Uf(!1),Xf=Vf;function Yf(a,b){var c=a.type.contextTypes;if(!c)return Vf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}
function Zf(a){a=a.childContextTypes;return null!==a&&void 0!==a}function $f(){E(Wf);E(H)}function ag(a,b,c){if(H.current!==Vf)throw Error(p(168));G(H,b);G(Wf,c)}function bg(a,b,c){var d=a.stateNode;b=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in b))throw Error(p(108,Ra(a)||"Unknown",e));return A({},c,d)}
function cg(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Vf;Xf=H.current;G(H,a);G(Wf,Wf.current);return!0}function dg(a,b,c){var d=a.stateNode;if(!d)throw Error(p(169));c?(a=bg(a,b,Xf),d.__reactInternalMemoizedMergedChildContext=a,E(Wf),E(H),G(H,a)):E(Wf);G(Wf,c)}var eg=null,fg=!1,gg=!1;function hg(a){null===eg?eg=[a]:eg.push(a)}function ig(a){fg=!0;hg(a)}
function jg(){if(!gg&&null!==eg){gg=!0;var a=0,b=C;try{var c=eg;for(C=1;a<c.length;a++){var d=c[a];do d=d(!0);while(null!==d)}eg=null;fg=!1}catch(e){throw null!==eg&&(eg=eg.slice(a+1)),ac(fc,jg),e;}finally{C=b,gg=!1}}return null}var kg=[],lg=0,mg=null,ng=0,og=[],pg=0,qg=null,rg=1,sg="";function tg(a,b){kg[lg++]=ng;kg[lg++]=mg;mg=a;ng=b}
function ug(a,b,c){og[pg++]=rg;og[pg++]=sg;og[pg++]=qg;qg=a;var d=rg;a=sg;var e=32-oc(d)-1;d&=~(1<<e);c+=1;var f=32-oc(b)+e;if(30<f){var g=e-e%5;f=(d&(1<<g)-1).toString(32);d>>=g;e-=g;rg=1<<32-oc(b)+e|c<<e|d;sg=f+a}else rg=1<<f|c<<e|d,sg=a}function vg(a){null!==a.return&&(tg(a,1),ug(a,1,0))}function wg(a){for(;a===mg;)mg=kg[--lg],kg[lg]=null,ng=kg[--lg],kg[lg]=null;for(;a===qg;)qg=og[--pg],og[pg]=null,sg=og[--pg],og[pg]=null,rg=og[--pg],og[pg]=null}var xg=null,yg=null,I=!1,zg=null;
function Ag(a,b){var c=Bg(5,null,null,0);c.elementType="DELETED";c.stateNode=b;c.return=a;b=a.deletions;null===b?(a.deletions=[c],a.flags|=16):b.push(c)}
function Cg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,xg=a,yg=Lf(b.firstChild),!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,xg=a,yg=null,!0):!1;case 13:return b=8!==b.nodeType?null:b,null!==b?(c=null!==qg?{id:rg,overflow:sg}:null,a.memoizedState={dehydrated:b,treeContext:c,retryLane:1073741824},c=Bg(18,null,null,0),c.stateNode=b,c.return=a,a.child=c,xg=a,yg=
null,!0):!1;default:return!1}}function Dg(a){return 0!==(a.mode&1)&&0===(a.flags&128)}function Eg(a){if(I){var b=yg;if(b){var c=b;if(!Cg(a,b)){if(Dg(a))throw Error(p(418));b=Lf(c.nextSibling);var d=xg;b&&Cg(a,b)?Ag(d,c):(a.flags=a.flags&-4097|2,I=!1,xg=a)}}else{if(Dg(a))throw Error(p(418));a.flags=a.flags&-4097|2;I=!1;xg=a}}}function Fg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;xg=a}
function Gg(a){if(a!==xg)return!1;if(!I)return Fg(a),I=!0,!1;var b;(b=3!==a.tag)&&!(b=5!==a.tag)&&(b=a.type,b="head"!==b&&"body"!==b&&!Ef(a.type,a.memoizedProps));if(b&&(b=yg)){if(Dg(a))throw Hg(),Error(p(418));for(;b;)Ag(a,b),b=Lf(b.nextSibling)}Fg(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(p(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){yg=Lf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}yg=
null}}else yg=xg?Lf(a.stateNode.nextSibling):null;return!0}function Hg(){for(var a=yg;a;)a=Lf(a.nextSibling)}function Ig(){yg=xg=null;I=!1}function Jg(a){null===zg?zg=[a]:zg.push(a)}var Kg=ua.ReactCurrentBatchConfig;function Lg(a,b){if(a&&a.defaultProps){b=A({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var Mg=Uf(null),Ng=null,Og=null,Pg=null;function Qg(){Pg=Og=Ng=null}function Rg(a){var b=Mg.current;E(Mg);a._currentValue=b}
function Sg(a,b,c){for(;null!==a;){var d=a.alternate;(a.childLanes&b)!==b?(a.childLanes|=b,null!==d&&(d.childLanes|=b)):null!==d&&(d.childLanes&b)!==b&&(d.childLanes|=b);if(a===c)break;a=a.return}}function Tg(a,b){Ng=a;Pg=Og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(Ug=!0),a.firstContext=null)}
function Vg(a){var b=a._currentValue;if(Pg!==a)if(a={context:a,memoizedValue:b,next:null},null===Og){if(null===Ng)throw Error(p(308));Og=a;Ng.dependencies={lanes:0,firstContext:a}}else Og=Og.next=a;return b}var Wg=null;function Xg(a){null===Wg?Wg=[a]:Wg.push(a)}function Yg(a,b,c,d){var e=b.interleaved;null===e?(c.next=c,Xg(b)):(c.next=e.next,e.next=c);b.interleaved=c;return Zg(a,d)}
function Zg(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}var $g=!1;function ah(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}
function bh(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function ch(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}
function dh(a,b,c){var d=a.updateQueue;if(null===d)return null;d=d.shared;if(0!==(K&2)){var e=d.pending;null===e?b.next=b:(b.next=e.next,e.next=b);d.pending=b;return Zg(a,c)}e=d.interleaved;null===e?(b.next=b,Xg(d)):(b.next=e.next,e.next=b);d.interleaved=b;return Zg(a,c)}function eh(a,b,c){b=b.updateQueue;if(null!==b&&(b=b.shared,0!==(c&4194240))){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
function fh(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function gh(a,b,c,d){var e=a.updateQueue;$g=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var m=a.alternate;null!==m&&(m=m.updateQueue,h=m.lastBaseUpdate,h!==g&&(null===h?m.firstBaseUpdate=l:h.next=l,m.lastBaseUpdate=k))}if(null!==f){var q=e.baseState;g=0;m=l=k=null;h=f;do{var r=h.lane,y=h.eventTime;if((d&r)===r){null!==m&&(m=m.next={eventTime:y,lane:0,tag:h.tag,payload:h.payload,callback:h.callback,
next:null});a:{var n=a,t=h;r=b;y=c;switch(t.tag){case 1:n=t.payload;if("function"===typeof n){q=n.call(y,q,r);break a}q=n;break a;case 3:n.flags=n.flags&-65537|128;case 0:n=t.payload;r="function"===typeof n?n.call(y,q,r):n;if(null===r||void 0===r)break a;q=A({},q,r);break a;case 2:$g=!0}}null!==h.callback&&0!==h.lane&&(a.flags|=64,r=e.effects,null===r?e.effects=[h]:r.push(h))}else y={eventTime:y,lane:r,tag:h.tag,payload:h.payload,callback:h.callback,next:null},null===m?(l=m=y,k=q):m=m.next=y,g|=r;
h=h.next;if(null===h)if(h=e.shared.pending,null===h)break;else r=h,h=r.next,r.next=null,e.lastBaseUpdate=r,e.shared.pending=null}while(1);null===m&&(k=q);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=m;b=e.shared.interleaved;if(null!==b){e=b;do g|=e.lane,e=e.next;while(e!==b)}else null===f&&(e.shared.lanes=0);hh|=g;a.lanes=g;a.memoizedState=q}}
function ih(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(p(191,e));e.call(d)}}}var jh=(new aa.Component).refs;function kh(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:A({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var nh={isMounted:function(a){return(a=a._reactInternals)?Vb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=L(),e=lh(a),f=ch(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=dh(a,f,e);null!==b&&(mh(b,a,e,d),eh(b,a,e))},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=L(),e=lh(a),f=ch(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);b=dh(a,f,e);null!==b&&(mh(b,a,e,d),eh(b,a,e))},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=L(),d=
lh(a),e=ch(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=b);b=dh(a,e,d);null!==b&&(mh(b,a,d,c),eh(b,a,d))}};function oh(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Ie(c,d)||!Ie(e,f):!0}
function ph(a,b,c){var d=!1,e=Vf;var f=b.contextType;"object"===typeof f&&null!==f?f=Vg(f):(e=Zf(b)?Xf:H.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Yf(a,e):Vf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=nh;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function qh(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&nh.enqueueReplaceState(b,b.state,null)}
function rh(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=jh;ah(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=Vg(f):(f=Zf(b)?Xf:H.current,e.context=Yf(a,f));e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(kh(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||(b=e.state,
"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&nh.enqueueReplaceState(e,e.state,null),gh(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4194308)}
function sh(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(p(309));var d=c.stateNode}if(!d)throw Error(p(147,a));var e=d,f=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===f)return b.ref;b=function(a){var b=e.refs;b===jh&&(b=e.refs={});null===a?delete b[f]:b[f]=a};b._stringRef=f;return b}if("string"!==typeof a)throw Error(p(284));if(!c._owner)throw Error(p(290,a));}return a}
function th(a,b){a=Object.prototype.toString.call(b);throw Error(p(31,"[object Object]"===a?"object with keys {"+Object.keys(b).join(", ")+"}":a));}function uh(a){var b=a._init;return b(a._payload)}
function vh(a){function b(b,c){if(a){var d=b.deletions;null===d?(b.deletions=[c],b.flags|=16):d.push(c)}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=wh(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return b.flags|=1048576,c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags|=2,c):d;b.flags|=2;return c}function g(b){a&&
null===b.alternate&&(b.flags|=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=xh(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){var f=c.type;if(f===ya)return m(a,b,c.props.children,d,c.key);if(null!==b&&(b.elementType===f||"object"===typeof f&&null!==f&&f.$$typeof===Ha&&uh(f)===b.type))return d=e(b,c.props),d.ref=sh(a,b,c),d.return=a,d;d=yh(c.type,c.key,c.props,null,a.mode,d);d.ref=sh(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||
b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=zh(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Ah(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function q(a,b,c){if("string"===typeof b&&""!==b||"number"===typeof b)return b=xh(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case va:return c=yh(b.type,b.key,b.props,null,a.mode,c),
c.ref=sh(a,null,b),c.return=a,c;case wa:return b=zh(b,a.mode,c),b.return=a,b;case Ha:var d=b._init;return q(a,d(b._payload),c)}if(eb(b)||Ka(b))return b=Ah(b,a.mode,c,null),b.return=a,b;th(a,b)}return null}function r(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c&&""!==c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case va:return c.key===e?k(a,b,c,d):null;case wa:return c.key===e?l(a,b,c,d):null;case Ha:return e=c._init,r(a,
b,e(c._payload),d)}if(eb(c)||Ka(c))return null!==e?null:m(a,b,c,d,null);th(a,c)}return null}function y(a,b,c,d,e){if("string"===typeof d&&""!==d||"number"===typeof d)return a=a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case va:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e);case wa:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e);case Ha:var f=d._init;return y(a,b,c,f(d._payload),e)}if(eb(d)||Ka(d))return a=a.get(c)||null,m(b,a,d,e,null);th(b,d)}return null}
function n(e,g,h,k){for(var l=null,m=null,u=g,w=g=0,x=null;null!==u&&w<h.length;w++){u.index>w?(x=u,u=null):x=u.sibling;var n=r(e,u,h[w],k);if(null===n){null===u&&(u=x);break}a&&u&&null===n.alternate&&b(e,u);g=f(n,g,w);null===m?l=n:m.sibling=n;m=n;u=x}if(w===h.length)return c(e,u),I&&tg(e,w),l;if(null===u){for(;w<h.length;w++)u=q(e,h[w],k),null!==u&&(g=f(u,g,w),null===m?l=u:m.sibling=u,m=u);I&&tg(e,w);return l}for(u=d(e,u);w<h.length;w++)x=y(u,e,w,h[w],k),null!==x&&(a&&null!==x.alternate&&u.delete(null===
x.key?w:x.key),g=f(x,g,w),null===m?l=x:m.sibling=x,m=x);a&&u.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function t(e,g,h,k){var l=Ka(h);if("function"!==typeof l)throw Error(p(150));h=l.call(h);if(null==h)throw Error(p(151));for(var u=l=null,m=g,w=g=0,x=null,n=h.next();null!==m&&!n.done;w++,n=h.next()){m.index>w?(x=m,m=null):x=m.sibling;var t=r(e,m,n.value,k);if(null===t){null===m&&(m=x);break}a&&m&&null===t.alternate&&b(e,m);g=f(t,g,w);null===u?l=t:u.sibling=t;u=t;m=x}if(n.done)return c(e,
m),I&&tg(e,w),l;if(null===m){for(;!n.done;w++,n=h.next())n=q(e,n.value,k),null!==n&&(g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);I&&tg(e,w);return l}for(m=d(e,m);!n.done;w++,n=h.next())n=y(m,e,w,n.value,k),null!==n&&(a&&null!==n.alternate&&m.delete(null===n.key?w:n.key),g=f(n,g,w),null===u?l=n:u.sibling=n,u=n);a&&m.forEach(function(a){return b(e,a)});I&&tg(e,w);return l}function J(a,d,f,h){"object"===typeof f&&null!==f&&f.type===ya&&null===f.key&&(f=f.props.children);if("object"===typeof f&&null!==f){switch(f.$$typeof){case va:a:{for(var k=
f.key,l=d;null!==l;){if(l.key===k){k=f.type;if(k===ya){if(7===l.tag){c(a,l.sibling);d=e(l,f.props.children);d.return=a;a=d;break a}}else if(l.elementType===k||"object"===typeof k&&null!==k&&k.$$typeof===Ha&&uh(k)===l.type){c(a,l.sibling);d=e(l,f.props);d.ref=sh(a,l,f);d.return=a;a=d;break a}c(a,l);break}else b(a,l);l=l.sibling}f.type===ya?(d=Ah(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=yh(f.type,f.key,f.props,null,a.mode,h),h.ref=sh(a,d,f),h.return=a,a=h)}return g(a);case wa:a:{for(l=f.key;null!==
d;){if(d.key===l)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=zh(f,a.mode,h);d.return=a;a=d}return g(a);case Ha:return l=f._init,J(a,d,l(f._payload),h)}if(eb(f))return n(a,d,f,h);if(Ka(f))return t(a,d,f,h);th(a,f)}return"string"===typeof f&&""!==f||"number"===typeof f?(f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):
(c(a,d),d=xh(f,a.mode,h),d.return=a,a=d),g(a)):c(a,d)}return J}var Bh=vh(!0),Ch=vh(!1),Dh={},Eh=Uf(Dh),Fh=Uf(Dh),Gh=Uf(Dh);function Hh(a){if(a===Dh)throw Error(p(174));return a}function Ih(a,b){G(Gh,b);G(Fh,a);G(Eh,Dh);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:lb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=lb(b,a)}E(Eh);G(Eh,b)}function Jh(){E(Eh);E(Fh);E(Gh)}
function Kh(a){Hh(Gh.current);var b=Hh(Eh.current);var c=lb(b,a.type);b!==c&&(G(Fh,a),G(Eh,c))}function Lh(a){Fh.current===a&&(E(Eh),E(Fh))}var M=Uf(0);
function Mh(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&128))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var Nh=[];
function Oh(){for(var a=0;a<Nh.length;a++)Nh[a]._workInProgressVersionPrimary=null;Nh.length=0}var Ph=ua.ReactCurrentDispatcher,Qh=ua.ReactCurrentBatchConfig,Rh=0,N=null,O=null,P=null,Sh=!1,Th=!1,Uh=0,Vh=0;function Q(){throw Error(p(321));}function Wh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Xh(a,b,c,d,e,f){Rh=f;N=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;Ph.current=null===a||null===a.memoizedState?Yh:Zh;a=c(d,e);if(Th){f=0;do{Th=!1;Uh=0;if(25<=f)throw Error(p(301));f+=1;P=O=null;b.updateQueue=null;Ph.current=$h;a=c(d,e)}while(Th)}Ph.current=ai;b=null!==O&&null!==O.next;Rh=0;P=O=N=null;Sh=!1;if(b)throw Error(p(300));return a}function bi(){var a=0!==Uh;Uh=0;return a}
function ci(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===P?N.memoizedState=P=a:P=P.next=a;return P}function di(){if(null===O){var a=N.alternate;a=null!==a?a.memoizedState:null}else a=O.next;var b=null===P?N.memoizedState:P.next;if(null!==b)P=b,O=a;else{if(null===a)throw Error(p(310));O=a;a={memoizedState:O.memoizedState,baseState:O.baseState,baseQueue:O.baseQueue,queue:O.queue,next:null};null===P?N.memoizedState=P=a:P=P.next=a}return P}
function ei(a,b){return"function"===typeof b?b(a):b}
function fi(a){var b=di(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=O,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){f=e.next;d=d.baseState;var h=g=null,k=null,l=f;do{var m=l.lane;if((Rh&m)===m)null!==k&&(k=k.next={lane:0,action:l.action,hasEagerState:l.hasEagerState,eagerState:l.eagerState,next:null}),d=l.hasEagerState?l.eagerState:a(d,l.action);else{var q={lane:m,action:l.action,hasEagerState:l.hasEagerState,
eagerState:l.eagerState,next:null};null===k?(h=k=q,g=d):k=k.next=q;N.lanes|=m;hh|=m}l=l.next}while(null!==l&&l!==f);null===k?g=d:k.next=h;He(d,b.memoizedState)||(Ug=!0);b.memoizedState=d;b.baseState=g;b.baseQueue=k;c.lastRenderedState=d}a=c.interleaved;if(null!==a){e=a;do f=e.lane,N.lanes|=f,hh|=f,e=e.next;while(e!==a)}else null===e&&(c.lanes=0);return[b.memoizedState,c.dispatch]}
function gi(a){var b=di(),c=b.queue;if(null===c)throw Error(p(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(Ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}function hi(){}
function ii(a,b){var c=N,d=di(),e=b(),f=!He(d.memoizedState,e);f&&(d.memoizedState=e,Ug=!0);d=d.queue;ji(ki.bind(null,c,d,a),[a]);if(d.getSnapshot!==b||f||null!==P&&P.memoizedState.tag&1){c.flags|=2048;li(9,mi.bind(null,c,d,e,b),void 0,null);if(null===R)throw Error(p(349));0!==(Rh&30)||ni(c,b,e)}return e}function ni(a,b,c){a.flags|=16384;a={getSnapshot:b,value:c};b=N.updateQueue;null===b?(b={lastEffect:null,stores:null},N.updateQueue=b,b.stores=[a]):(c=b.stores,null===c?b.stores=[a]:c.push(a))}
function mi(a,b,c,d){b.value=c;b.getSnapshot=d;oi(b)&&pi(a)}function ki(a,b,c){return c(function(){oi(b)&&pi(a)})}function oi(a){var b=a.getSnapshot;a=a.value;try{var c=b();return!He(a,c)}catch(d){return!0}}function pi(a){var b=Zg(a,1);null!==b&&mh(b,a,1,-1)}
function qi(a){var b=ci();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ei,lastRenderedState:a};b.queue=a;a=a.dispatch=ri.bind(null,N,a);return[b.memoizedState,a]}
function li(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=N.updateQueue;null===b?(b={lastEffect:null,stores:null},N.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function si(){return di().memoizedState}function ti(a,b,c,d){var e=ci();N.flags|=a;e.memoizedState=li(1|b,c,void 0,void 0===d?null:d)}
function ui(a,b,c,d){var e=di();d=void 0===d?null:d;var f=void 0;if(null!==O){var g=O.memoizedState;f=g.destroy;if(null!==d&&Wh(d,g.deps)){e.memoizedState=li(b,c,f,d);return}}N.flags|=a;e.memoizedState=li(1|b,c,f,d)}function vi(a,b){return ti(8390656,8,a,b)}function ji(a,b){return ui(2048,8,a,b)}function wi(a,b){return ui(4,2,a,b)}function xi(a,b){return ui(4,4,a,b)}
function yi(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function zi(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ui(4,4,yi.bind(null,b,a),c)}function Ai(){}function Bi(a,b){var c=di();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Wh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}
function Ci(a,b){var c=di();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Wh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}function Di(a,b,c){if(0===(Rh&21))return a.baseState&&(a.baseState=!1,Ug=!0),a.memoizedState=c;He(c,b)||(c=yc(),N.lanes|=c,hh|=c,a.baseState=!0);return b}function Ei(a,b){var c=C;C=0!==c&&4>c?c:4;a(!0);var d=Qh.transition;Qh.transition={};try{a(!1),b()}finally{C=c,Qh.transition=d}}function Fi(){return di().memoizedState}
function Gi(a,b,c){var d=lh(a);c={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(Hi(a))Ii(b,c);else if(c=Yg(a,b,c,d),null!==c){var e=L();mh(c,a,d,e);Ji(c,b,d)}}
function ri(a,b,c){var d=lh(a),e={lane:d,action:c,hasEagerState:!1,eagerState:null,next:null};if(Hi(a))Ii(b,e);else{var f=a.alternate;if(0===a.lanes&&(null===f||0===f.lanes)&&(f=b.lastRenderedReducer,null!==f))try{var g=b.lastRenderedState,h=f(g,c);e.hasEagerState=!0;e.eagerState=h;if(He(h,g)){var k=b.interleaved;null===k?(e.next=e,Xg(b)):(e.next=k.next,k.next=e);b.interleaved=e;return}}catch(l){}finally{}c=Yg(a,b,e,d);null!==c&&(e=L(),mh(c,a,d,e),Ji(c,b,d))}}
function Hi(a){var b=a.alternate;return a===N||null!==b&&b===N}function Ii(a,b){Th=Sh=!0;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}function Ji(a,b,c){if(0!==(c&4194240)){var d=b.lanes;d&=a.pendingLanes;c|=d;b.lanes=c;Cc(a,c)}}
var ai={readContext:Vg,useCallback:Q,useContext:Q,useEffect:Q,useImperativeHandle:Q,useInsertionEffect:Q,useLayoutEffect:Q,useMemo:Q,useReducer:Q,useRef:Q,useState:Q,useDebugValue:Q,useDeferredValue:Q,useTransition:Q,useMutableSource:Q,useSyncExternalStore:Q,useId:Q,unstable_isNewReconciler:!1},Yh={readContext:Vg,useCallback:function(a,b){ci().memoizedState=[a,void 0===b?null:b];return a},useContext:Vg,useEffect:vi,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return ti(4194308,
4,yi.bind(null,b,a),c)},useLayoutEffect:function(a,b){return ti(4194308,4,a,b)},useInsertionEffect:function(a,b){return ti(4,2,a,b)},useMemo:function(a,b){var c=ci();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=ci();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};d.queue=a;a=a.dispatch=Gi.bind(null,N,a);return[d.memoizedState,a]},useRef:function(a){var b=
ci();a={current:a};return b.memoizedState=a},useState:qi,useDebugValue:Ai,useDeferredValue:function(a){return ci().memoizedState=a},useTransition:function(){var a=qi(!1),b=a[0];a=Ei.bind(null,a[1]);ci().memoizedState=a;return[b,a]},useMutableSource:function(){},useSyncExternalStore:function(a,b,c){var d=N,e=ci();if(I){if(void 0===c)throw Error(p(407));c=c()}else{c=b();if(null===R)throw Error(p(349));0!==(Rh&30)||ni(d,b,c)}e.memoizedState=c;var f={value:c,getSnapshot:b};e.queue=f;vi(ki.bind(null,d,
f,a),[a]);d.flags|=2048;li(9,mi.bind(null,d,f,c,b),void 0,null);return c},useId:function(){var a=ci(),b=R.identifierPrefix;if(I){var c=sg;var d=rg;c=(d&~(1<<32-oc(d)-1)).toString(32)+c;b=":"+b+"R"+c;c=Uh++;0<c&&(b+="H"+c.toString(32));b+=":"}else c=Vh++,b=":"+b+"r"+c.toString(32)+":";return a.memoizedState=b},unstable_isNewReconciler:!1},Zh={readContext:Vg,useCallback:Bi,useContext:Vg,useEffect:ji,useImperativeHandle:zi,useInsertionEffect:wi,useLayoutEffect:xi,useMemo:Ci,useReducer:fi,useRef:si,useState:function(){return fi(ei)},
useDebugValue:Ai,useDeferredValue:function(a){var b=di();return Di(b,O.memoizedState,a)},useTransition:function(){var a=fi(ei)[0],b=di().memoizedState;return[a,b]},useMutableSource:hi,useSyncExternalStore:ii,useId:Fi,unstable_isNewReconciler:!1},$h={readContext:Vg,useCallback:Bi,useContext:Vg,useEffect:ji,useImperativeHandle:zi,useInsertionEffect:wi,useLayoutEffect:xi,useMemo:Ci,useReducer:gi,useRef:si,useState:function(){return gi(ei)},useDebugValue:Ai,useDeferredValue:function(a){var b=di();return null===
O?b.memoizedState=a:Di(b,O.memoizedState,a)},useTransition:function(){var a=gi(ei)[0],b=di().memoizedState;return[a,b]},useMutableSource:hi,useSyncExternalStore:ii,useId:Fi,unstable_isNewReconciler:!1};function Ki(a,b){try{var c="",d=b;do c+=Pa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e,digest:null}}function Li(a,b,c){return{value:a,source:null,stack:null!=c?c:null,digest:null!=b?b:null}}
function Mi(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Ni="function"===typeof WeakMap?WeakMap:Map;function Oi(a,b,c){c=ch(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Pi||(Pi=!0,Qi=d);Mi(a,b)};return c}
function Ri(a,b,c){c=ch(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)};c.callback=function(){Mi(a,b)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){Mi(a,b);"function"!==typeof d&&(null===Si?Si=new Set([this]):Si.add(this));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}
function Ti(a,b,c){var d=a.pingCache;if(null===d){d=a.pingCache=new Ni;var e=new Set;d.set(b,e)}else e=d.get(b),void 0===e&&(e=new Set,d.set(b,e));e.has(c)||(e.add(c),a=Ui.bind(null,a,b,c),b.then(a,a))}function Vi(a){do{var b;if(b=13===a.tag)b=a.memoizedState,b=null!==b?null!==b.dehydrated?!0:!1:!0;if(b)return a;a=a.return}while(null!==a);return null}
function Wi(a,b,c,d,e){if(0===(a.mode&1))return a===b?a.flags|=65536:(a.flags|=128,c.flags|=131072,c.flags&=-52805,1===c.tag&&(null===c.alternate?c.tag=17:(b=ch(-1,1),b.tag=2,dh(c,b,1))),c.lanes|=1),a;a.flags|=65536;a.lanes=e;return a}var Xi=ua.ReactCurrentOwner,Ug=!1;function Yi(a,b,c,d){b.child=null===a?Ch(b,null,c,d):Bh(b,a.child,c,d)}
function Zi(a,b,c,d,e){c=c.render;var f=b.ref;Tg(b,e);d=Xh(a,b,c,d,f,e);c=bi();if(null!==a&&!Ug)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,$i(a,b,e);I&&c&&vg(b);b.flags|=1;Yi(a,b,d,e);return b.child}
function aj(a,b,c,d,e){if(null===a){var f=c.type;if("function"===typeof f&&!bj(f)&&void 0===f.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=f,cj(a,b,f,d,e);a=yh(c.type,null,d,b,b.mode,e);a.ref=b.ref;a.return=b;return b.child=a}f=a.child;if(0===(a.lanes&e)){var g=f.memoizedProps;c=c.compare;c=null!==c?c:Ie;if(c(g,d)&&a.ref===b.ref)return $i(a,b,e)}b.flags|=1;a=wh(f,d);a.ref=b.ref;a.return=b;return b.child=a}
function cj(a,b,c,d,e){if(null!==a){var f=a.memoizedProps;if(Ie(f,d)&&a.ref===b.ref)if(Ug=!1,b.pendingProps=d=f,0!==(a.lanes&e))0!==(a.flags&131072)&&(Ug=!0);else return b.lanes=a.lanes,$i(a,b,e)}return dj(a,b,c,d,e)}
function ej(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode)if(0===(b.mode&1))b.memoizedState={baseLanes:0,cachePool:null,transitions:null},G(fj,gj),gj|=c;else{if(0===(c&1073741824))return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a,cachePool:null,transitions:null},b.updateQueue=null,G(fj,gj),gj|=a,null;b.memoizedState={baseLanes:0,cachePool:null,transitions:null};d=null!==f?f.baseLanes:c;G(fj,gj);gj|=d}else null!==
f?(d=f.baseLanes|c,b.memoizedState=null):d=c,G(fj,gj),gj|=d;Yi(a,b,e,c);return b.child}function hj(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=512,b.flags|=2097152}function dj(a,b,c,d,e){var f=Zf(c)?Xf:H.current;f=Yf(b,f);Tg(b,e);c=Xh(a,b,c,d,f,e);d=bi();if(null!==a&&!Ug)return b.updateQueue=a.updateQueue,b.flags&=-2053,a.lanes&=~e,$i(a,b,e);I&&d&&vg(b);b.flags|=1;Yi(a,b,c,e);return b.child}
function ij(a,b,c,d,e){if(Zf(c)){var f=!0;cg(b)}else f=!1;Tg(b,e);if(null===b.stateNode)jj(a,b),ph(b,c,d),rh(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=Vg(l):(l=Zf(c)?Xf:H.current,l=Yf(b,l));var m=c.getDerivedStateFromProps,q="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;q||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||
(h!==d||k!==l)&&qh(b,g,d,l);$g=!1;var r=b.memoizedState;g.state=r;gh(b,d,g,e);k=b.memoizedState;h!==d||r!==k||Wf.current||$g?("function"===typeof m&&(kh(b,c,m,d),k=b.memoizedState),(h=$g||oh(b,c,h,d,r,k,l))?(q||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.flags|=4194308)):
("function"===typeof g.componentDidMount&&(b.flags|=4194308),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4194308),d=!1)}else{g=b.stateNode;bh(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:Lg(b.type,h);g.props=l;q=b.pendingProps;r=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=Vg(k):(k=Zf(c)?Xf:H.current,k=Yf(b,k));var y=c.getDerivedStateFromProps;(m="function"===typeof y||"function"===typeof g.getSnapshotBeforeUpdate)||
"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==q||r!==k)&&qh(b,g,d,k);$g=!1;r=b.memoizedState;g.state=r;gh(b,d,g,e);var n=b.memoizedState;h!==q||r!==n||Wf.current||$g?("function"===typeof y&&(kh(b,c,y,d),n=b.memoizedState),(l=$g||oh(b,c,l,d,r,n,k)||!1)?(m||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,n,k),"function"===typeof g.UNSAFE_componentWillUpdate&&
g.UNSAFE_componentWillUpdate(d,n,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=1024)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),b.memoizedProps=d,b.memoizedState=n),g.props=d,g.state=n,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&r===
a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&r===a.memoizedState||(b.flags|=1024),d=!1)}return kj(a,b,c,d,f,e)}
function kj(a,b,c,d,e,f){hj(a,b);var g=0!==(b.flags&128);if(!d&&!g)return e&&dg(b,c,!1),$i(a,b,f);d=b.stateNode;Xi.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Bh(b,a.child,null,f),b.child=Bh(b,null,h,f)):Yi(a,b,h,f);b.memoizedState=d.state;e&&dg(b,c,!0);return b.child}function lj(a){var b=a.stateNode;b.pendingContext?ag(a,b.pendingContext,b.pendingContext!==b.context):b.context&&ag(a,b.context,!1);Ih(a,b.containerInfo)}
function mj(a,b,c,d,e){Ig();Jg(e);b.flags|=256;Yi(a,b,c,d);return b.child}var nj={dehydrated:null,treeContext:null,retryLane:0};function oj(a){return{baseLanes:a,cachePool:null,transitions:null}}
function pj(a,b,c){var d=b.pendingProps,e=M.current,f=!1,g=0!==(b.flags&128),h;(h=g)||(h=null!==a&&null===a.memoizedState?!1:0!==(e&2));if(h)f=!0,b.flags&=-129;else if(null===a||null!==a.memoizedState)e|=1;G(M,e&1);if(null===a){Eg(b);a=b.memoizedState;if(null!==a&&(a=a.dehydrated,null!==a))return 0===(b.mode&1)?b.lanes=1:"$!"===a.data?b.lanes=8:b.lanes=1073741824,null;g=d.children;a=d.fallback;return f?(d=b.mode,f=b.child,g={mode:"hidden",children:g},0===(d&1)&&null!==f?(f.childLanes=0,f.pendingProps=
g):f=qj(g,d,0,null),a=Ah(a,d,c,null),f.return=b,a.return=b,f.sibling=a,b.child=f,b.child.memoizedState=oj(c),b.memoizedState=nj,a):rj(b,g)}e=a.memoizedState;if(null!==e&&(h=e.dehydrated,null!==h))return sj(a,b,g,d,h,e,c);if(f){f=d.fallback;g=b.mode;e=a.child;h=e.sibling;var k={mode:"hidden",children:d.children};0===(g&1)&&b.child!==e?(d=b.child,d.childLanes=0,d.pendingProps=k,b.deletions=null):(d=wh(e,k),d.subtreeFlags=e.subtreeFlags&14680064);null!==h?f=wh(h,f):(f=Ah(f,g,c,null),f.flags|=2);f.return=
b;d.return=b;d.sibling=f;b.child=d;d=f;f=b.child;g=a.child.memoizedState;g=null===g?oj(c):{baseLanes:g.baseLanes|c,cachePool:null,transitions:g.transitions};f.memoizedState=g;f.childLanes=a.childLanes&~c;b.memoizedState=nj;return d}f=a.child;a=f.sibling;d=wh(f,{mode:"visible",children:d.children});0===(b.mode&1)&&(d.lanes=c);d.return=b;d.sibling=null;null!==a&&(c=b.deletions,null===c?(b.deletions=[a],b.flags|=16):c.push(a));b.child=d;b.memoizedState=null;return d}
function rj(a,b){b=qj({mode:"visible",children:b},a.mode,0,null);b.return=a;return a.child=b}function tj(a,b,c,d){null!==d&&Jg(d);Bh(b,a.child,null,c);a=rj(b,b.pendingProps.children);a.flags|=2;b.memoizedState=null;return a}
function sj(a,b,c,d,e,f,g){if(c){if(b.flags&256)return b.flags&=-257,d=Li(Error(p(422))),tj(a,b,g,d);if(null!==b.memoizedState)return b.child=a.child,b.flags|=128,null;f=d.fallback;e=b.mode;d=qj({mode:"visible",children:d.children},e,0,null);f=Ah(f,e,g,null);f.flags|=2;d.return=b;f.return=b;d.sibling=f;b.child=d;0!==(b.mode&1)&&Bh(b,a.child,null,g);b.child.memoizedState=oj(g);b.memoizedState=nj;return f}if(0===(b.mode&1))return tj(a,b,g,null);if("$!"===e.data){d=e.nextSibling&&e.nextSibling.dataset;
if(d)var h=d.dgst;d=h;f=Error(p(419));d=Li(f,d,void 0);return tj(a,b,g,d)}h=0!==(g&a.childLanes);if(Ug||h){d=R;if(null!==d){switch(g&-g){case 4:e=2;break;case 16:e=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:e=32;break;case 536870912:e=268435456;break;default:e=0}e=0!==(e&(d.suspendedLanes|g))?0:e;
0!==e&&e!==f.retryLane&&(f.retryLane=e,Zg(a,e),mh(d,a,e,-1))}uj();d=Li(Error(p(421)));return tj(a,b,g,d)}if("$?"===e.data)return b.flags|=128,b.child=a.child,b=vj.bind(null,a),e._reactRetry=b,null;a=f.treeContext;yg=Lf(e.nextSibling);xg=b;I=!0;zg=null;null!==a&&(og[pg++]=rg,og[pg++]=sg,og[pg++]=qg,rg=a.id,sg=a.overflow,qg=b);b=rj(b,d.children);b.flags|=4096;return b}function wj(a,b,c){a.lanes|=b;var d=a.alternate;null!==d&&(d.lanes|=b);Sg(a.return,b,c)}
function xj(a,b,c,d,e){var f=a.memoizedState;null===f?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e}:(f.isBackwards=b,f.rendering=null,f.renderingStartTime=0,f.last=d,f.tail=c,f.tailMode=e)}
function yj(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;Yi(a,b,d.children,c);d=M.current;if(0!==(d&2))d=d&1|2,b.flags|=128;else{if(null!==a&&0!==(a.flags&128))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&wj(a,c,b);else if(19===a.tag)wj(a,c,b);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}G(M,d);if(0===(b.mode&1))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===Mh(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);xj(b,!1,e,c,f);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===Mh(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}xj(b,!0,c,null,f);break;case "together":xj(b,!1,null,null,void 0);break;default:b.memoizedState=null}return b.child}
function jj(a,b){0===(b.mode&1)&&null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2)}function $i(a,b,c){null!==a&&(b.dependencies=a.dependencies);hh|=b.lanes;if(0===(c&b.childLanes))return null;if(null!==a&&b.child!==a.child)throw Error(p(153));if(null!==b.child){a=b.child;c=wh(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=wh(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}
function zj(a,b,c){switch(b.tag){case 3:lj(b);Ig();break;case 5:Kh(b);break;case 1:Zf(b.type)&&cg(b);break;case 4:Ih(b,b.stateNode.containerInfo);break;case 10:var d=b.type._context,e=b.memoizedProps.value;G(Mg,d._currentValue);d._currentValue=e;break;case 13:d=b.memoizedState;if(null!==d){if(null!==d.dehydrated)return G(M,M.current&1),b.flags|=128,null;if(0!==(c&b.child.childLanes))return pj(a,b,c);G(M,M.current&1);a=$i(a,b,c);return null!==a?a.sibling:null}G(M,M.current&1);break;case 19:d=0!==(c&
b.childLanes);if(0!==(a.flags&128)){if(d)return yj(a,b,c);b.flags|=128}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);G(M,M.current);if(d)break;else return null;case 22:case 23:return b.lanes=0,ej(a,b,c)}return $i(a,b,c)}var Aj,Bj,Cj,Dj;
Aj=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Bj=function(){};
Cj=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;Hh(Eh.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "select":e=A({},e,{value:void 0});d=A({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=Bf)}ub(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&
(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ea.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,
c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ea.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&D("scroll",a),f||h===k||(f=[])):(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",c);var l=f;if(b.updateQueue=l)b.flags|=4}};Dj=function(a,b,c,d){c!==d&&(b.flags|=4)};
function Ej(a,b){if(!I)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function S(a){var b=null!==a.alternate&&a.alternate.child===a.child,c=0,d=0;if(b)for(var e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags&14680064,d|=e.flags&14680064,e.return=a,e=e.sibling;else for(e=a.child;null!==e;)c|=e.lanes|e.childLanes,d|=e.subtreeFlags,d|=e.flags,e.return=a,e=e.sibling;a.subtreeFlags|=d;a.childLanes=c;return b}
function Fj(a,b,c){var d=b.pendingProps;wg(b);switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return S(b),null;case 1:return Zf(b.type)&&$f(),S(b),null;case 3:d=b.stateNode;Jh();E(Wf);E(H);Oh();d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)Gg(b)?b.flags|=4:null===a||a.memoizedState.isDehydrated&&0===(b.flags&256)||(b.flags|=1024,null!==zg&&(Gj(zg),zg=null));Bj(a,b);S(b);return null;case 5:Lh(b);var e=Hh(Gh.current);
c=b.type;if(null!==a&&null!=b.stateNode)Cj(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=512,b.flags|=2097152);else{if(!d){if(null===b.stateNode)throw Error(p(166));S(b);return null}a=Hh(Eh.current);if(Gg(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[Of]=b;d[Pf]=f;a=0!==(b.mode&1);switch(c){case "dialog":D("cancel",d);D("close",d);break;case "iframe":case "object":case "embed":D("load",d);break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],d);break;case "source":D("error",d);break;case "img":case "image":case "link":D("error",
d);D("load",d);break;case "details":D("toggle",d);break;case "input":Za(d,f);D("invalid",d);break;case "select":d._wrapperState={wasMultiple:!!f.multiple};D("invalid",d);break;case "textarea":hb(d,f),D("invalid",d)}ub(c,f);e=null;for(var g in f)if(f.hasOwnProperty(g)){var h=f[g];"children"===g?"string"===typeof h?d.textContent!==h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,h,a),e=["children",h]):"number"===typeof h&&d.textContent!==""+h&&(!0!==f.suppressHydrationWarning&&Af(d.textContent,
h,a),e=["children",""+h]):ea.hasOwnProperty(g)&&null!=h&&"onScroll"===g&&D("scroll",d)}switch(c){case "input":Va(d);db(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=Bf)}d=e;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;"http://www.w3.org/1999/xhtml"===a&&(a=kb(c));"http://www.w3.org/1999/xhtml"===a?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):
"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[Of]=b;a[Pf]=d;Aj(a,b,!1,!1);b.stateNode=a;a:{g=vb(c,d);switch(c){case "dialog":D("cancel",a);D("close",a);e=d;break;case "iframe":case "object":case "embed":D("load",a);e=d;break;case "video":case "audio":for(e=0;e<lf.length;e++)D(lf[e],a);e=d;break;case "source":D("error",a);e=d;break;case "img":case "image":case "link":D("error",
a);D("load",a);e=d;break;case "details":D("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);D("invalid",a);break;case "option":e=d;break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=A({},d,{value:void 0});D("invalid",a);break;case "textarea":hb(a,d);e=gb(a,d);D("invalid",a);break;default:e=d}ub(c,e);h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?sb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&nb(a,k)):"children"===f?"string"===typeof k?("textarea"!==
c||""!==k)&&ob(a,k):"number"===typeof k&&ob(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ea.hasOwnProperty(f)?null!=k&&"onScroll"===f&&D("scroll",a):null!=k&&ta(a,f,k,g))}switch(c){case "input":Va(a);db(a,d,!1);break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,
!0);break;default:"function"===typeof e.onClick&&(a.onclick=Bf)}switch(c){case "button":case "input":case "select":case "textarea":d=!!d.autoFocus;break a;case "img":d=!0;break a;default:d=!1}}d&&(b.flags|=4)}null!==b.ref&&(b.flags|=512,b.flags|=2097152)}S(b);return null;case 6:if(a&&null!=b.stateNode)Dj(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(p(166));c=Hh(Gh.current);Hh(Eh.current);if(Gg(b)){d=b.stateNode;c=b.memoizedProps;d[Of]=b;if(f=d.nodeValue!==c)if(a=
xg,null!==a)switch(a.tag){case 3:Af(d.nodeValue,c,0!==(a.mode&1));break;case 5:!0!==a.memoizedProps.suppressHydrationWarning&&Af(d.nodeValue,c,0!==(a.mode&1))}f&&(b.flags|=4)}else d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[Of]=b,b.stateNode=d}S(b);return null;case 13:E(M);d=b.memoizedState;if(null===a||null!==a.memoizedState&&null!==a.memoizedState.dehydrated){if(I&&null!==yg&&0!==(b.mode&1)&&0===(b.flags&128))Hg(),Ig(),b.flags|=98560,f=!1;else if(f=Gg(b),null!==d&&null!==d.dehydrated){if(null===
a){if(!f)throw Error(p(318));f=b.memoizedState;f=null!==f?f.dehydrated:null;if(!f)throw Error(p(317));f[Of]=b}else Ig(),0===(b.flags&128)&&(b.memoizedState=null),b.flags|=4;S(b);f=!1}else null!==zg&&(Gj(zg),zg=null),f=!0;if(!f)return b.flags&65536?b:null}if(0!==(b.flags&128))return b.lanes=c,b;d=null!==d;d!==(null!==a&&null!==a.memoizedState)&&d&&(b.child.flags|=8192,0!==(b.mode&1)&&(null===a||0!==(M.current&1)?0===T&&(T=3):uj()));null!==b.updateQueue&&(b.flags|=4);S(b);return null;case 4:return Jh(),
Bj(a,b),null===a&&sf(b.stateNode.containerInfo),S(b),null;case 10:return Rg(b.type._context),S(b),null;case 17:return Zf(b.type)&&$f(),S(b),null;case 19:E(M);f=b.memoizedState;if(null===f)return S(b),null;d=0!==(b.flags&128);g=f.rendering;if(null===g)if(d)Ej(f,!1);else{if(0!==T||null!==a&&0!==(a.flags&128))for(a=b.child;null!==a;){g=Mh(a);if(null!==g){b.flags|=128;Ej(f,!1);d=g.updateQueue;null!==d&&(b.updateQueue=d,b.flags|=4);b.subtreeFlags=0;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=14680066,
g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.subtreeFlags=0,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.subtreeFlags=0,f.deletions=null,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;G(M,M.current&1|2);return b.child}a=
a.sibling}null!==f.tail&&B()>Hj&&(b.flags|=128,d=!0,Ej(f,!1),b.lanes=4194304)}else{if(!d)if(a=Mh(g),null!==a){if(b.flags|=128,d=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Ej(f,!0),null===f.tail&&"hidden"===f.tailMode&&!g.alternate&&!I)return S(b),null}else 2*B()-f.renderingStartTime>Hj&&1073741824!==c&&(b.flags|=128,d=!0,Ej(f,!1),b.lanes=4194304);f.isBackwards?(g.sibling=b.child,b.child=g):(c=f.last,null!==c?c.sibling=g:b.child=g,f.last=g)}if(null!==f.tail)return b=f.tail,f.rendering=
b,f.tail=b.sibling,f.renderingStartTime=B(),b.sibling=null,c=M.current,G(M,d?c&1|2:c&1),b;S(b);return null;case 22:case 23:return Ij(),d=null!==b.memoizedState,null!==a&&null!==a.memoizedState!==d&&(b.flags|=8192),d&&0!==(b.mode&1)?0!==(gj&1073741824)&&(S(b),b.subtreeFlags&6&&(b.flags|=8192)):S(b),null;case 24:return null;case 25:return null}throw Error(p(156,b.tag));}
function Jj(a,b){wg(b);switch(b.tag){case 1:return Zf(b.type)&&$f(),a=b.flags,a&65536?(b.flags=a&-65537|128,b):null;case 3:return Jh(),E(Wf),E(H),Oh(),a=b.flags,0!==(a&65536)&&0===(a&128)?(b.flags=a&-65537|128,b):null;case 5:return Lh(b),null;case 13:E(M);a=b.memoizedState;if(null!==a&&null!==a.dehydrated){if(null===b.alternate)throw Error(p(340));Ig()}a=b.flags;return a&65536?(b.flags=a&-65537|128,b):null;case 19:return E(M),null;case 4:return Jh(),null;case 10:return Rg(b.type._context),null;case 22:case 23:return Ij(),
null;case 24:return null;default:return null}}var Kj=!1,U=!1,Lj="function"===typeof WeakSet?WeakSet:Set,V=null;function Mj(a,b){var c=a.ref;if(null!==c)if("function"===typeof c)try{c(null)}catch(d){W(a,b,d)}else c.current=null}function Nj(a,b,c){try{c()}catch(d){W(a,b,d)}}var Oj=!1;
function Pj(a,b){Cf=dd;a=Me();if(Ne(a)){if("selectionStart"in a)var c={start:a.selectionStart,end:a.selectionEnd};else a:{c=(c=a.ownerDocument)&&c.defaultView||window;var d=c.getSelection&&c.getSelection();if(d&&0!==d.rangeCount){c=d.anchorNode;var e=d.anchorOffset,f=d.focusNode;d=d.focusOffset;try{c.nodeType,f.nodeType}catch(F){c=null;break a}var g=0,h=-1,k=-1,l=0,m=0,q=a,r=null;b:for(;;){for(var y;;){q!==c||0!==e&&3!==q.nodeType||(h=g+e);q!==f||0!==d&&3!==q.nodeType||(k=g+d);3===q.nodeType&&(g+=
q.nodeValue.length);if(null===(y=q.firstChild))break;r=q;q=y}for(;;){if(q===a)break b;r===c&&++l===e&&(h=g);r===f&&++m===d&&(k=g);if(null!==(y=q.nextSibling))break;q=r;r=q.parentNode}q=y}c=-1===h||-1===k?null:{start:h,end:k}}else c=null}c=c||{start:0,end:0}}else c=null;Df={focusedElem:a,selectionRange:c};dd=!1;for(V=b;null!==V;)if(b=V,a=b.child,0!==(b.subtreeFlags&1028)&&null!==a)a.return=b,V=a;else for(;null!==V;){b=V;try{var n=b.alternate;if(0!==(b.flags&1024))switch(b.tag){case 0:case 11:case 15:break;
case 1:if(null!==n){var t=n.memoizedProps,J=n.memoizedState,x=b.stateNode,w=x.getSnapshotBeforeUpdate(b.elementType===b.type?t:Lg(b.type,t),J);x.__reactInternalSnapshotBeforeUpdate=w}break;case 3:var u=b.stateNode.containerInfo;1===u.nodeType?u.textContent="":9===u.nodeType&&u.documentElement&&u.removeChild(u.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(p(163));}}catch(F){W(b,b.return,F)}a=b.sibling;if(null!==a){a.return=b.return;V=a;break}V=b.return}n=Oj;Oj=!1;return n}
function Qj(a,b,c){var d=b.updateQueue;d=null!==d?d.lastEffect:null;if(null!==d){var e=d=d.next;do{if((e.tag&a)===a){var f=e.destroy;e.destroy=void 0;void 0!==f&&Nj(b,c,f)}e=e.next}while(e!==d)}}function Rj(a,b){b=b.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){var c=b=b.next;do{if((c.tag&a)===a){var d=c.create;c.destroy=d()}c=c.next}while(c!==b)}}function Sj(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case 5:a=c;break;default:a=c}"function"===typeof b?b(a):b.current=a}}
function Tj(a){var b=a.alternate;null!==b&&(a.alternate=null,Tj(b));a.child=null;a.deletions=null;a.sibling=null;5===a.tag&&(b=a.stateNode,null!==b&&(delete b[Of],delete b[Pf],delete b[of],delete b[Qf],delete b[Rf]));a.stateNode=null;a.return=null;a.dependencies=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.stateNode=null;a.updateQueue=null}function Uj(a){return 5===a.tag||3===a.tag||4===a.tag}
function Vj(a){a:for(;;){for(;null===a.sibling;){if(null===a.return||Uj(a.return))return null;a=a.return}a.sibling.return=a.return;for(a=a.sibling;5!==a.tag&&6!==a.tag&&18!==a.tag;){if(a.flags&2)continue a;if(null===a.child||4===a.tag)continue a;else a.child.return=a,a=a.child}if(!(a.flags&2))return a.stateNode}}
function Wj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=Bf));else if(4!==d&&(a=a.child,null!==a))for(Wj(a,b,c),a=a.sibling;null!==a;)Wj(a,b,c),a=a.sibling}
function Xj(a,b,c){var d=a.tag;if(5===d||6===d)a=a.stateNode,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(Xj(a,b,c),a=a.sibling;null!==a;)Xj(a,b,c),a=a.sibling}var X=null,Yj=!1;function Zj(a,b,c){for(c=c.child;null!==c;)ak(a,b,c),c=c.sibling}
function ak(a,b,c){if(lc&&"function"===typeof lc.onCommitFiberUnmount)try{lc.onCommitFiberUnmount(kc,c)}catch(h){}switch(c.tag){case 5:U||Mj(c,b);case 6:var d=X,e=Yj;X=null;Zj(a,b,c);X=d;Yj=e;null!==X&&(Yj?(a=X,c=c.stateNode,8===a.nodeType?a.parentNode.removeChild(c):a.removeChild(c)):X.removeChild(c.stateNode));break;case 18:null!==X&&(Yj?(a=X,c=c.stateNode,8===a.nodeType?Kf(a.parentNode,c):1===a.nodeType&&Kf(a,c),bd(a)):Kf(X,c.stateNode));break;case 4:d=X;e=Yj;X=c.stateNode.containerInfo;Yj=!0;
Zj(a,b,c);X=d;Yj=e;break;case 0:case 11:case 14:case 15:if(!U&&(d=c.updateQueue,null!==d&&(d=d.lastEffect,null!==d))){e=d=d.next;do{var f=e,g=f.destroy;f=f.tag;void 0!==g&&(0!==(f&2)?Nj(c,b,g):0!==(f&4)&&Nj(c,b,g));e=e.next}while(e!==d)}Zj(a,b,c);break;case 1:if(!U&&(Mj(c,b),d=c.stateNode,"function"===typeof d.componentWillUnmount))try{d.props=c.memoizedProps,d.state=c.memoizedState,d.componentWillUnmount()}catch(h){W(c,b,h)}Zj(a,b,c);break;case 21:Zj(a,b,c);break;case 22:c.mode&1?(U=(d=U)||null!==
c.memoizedState,Zj(a,b,c),U=d):Zj(a,b,c);break;default:Zj(a,b,c)}}function bk(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Lj);b.forEach(function(b){var d=ck.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function dk(a,b){var c=b.deletions;if(null!==c)for(var d=0;d<c.length;d++){var e=c[d];try{var f=a,g=b,h=g;a:for(;null!==h;){switch(h.tag){case 5:X=h.stateNode;Yj=!1;break a;case 3:X=h.stateNode.containerInfo;Yj=!0;break a;case 4:X=h.stateNode.containerInfo;Yj=!0;break a}h=h.return}if(null===X)throw Error(p(160));ak(f,g,e);X=null;Yj=!1;var k=e.alternate;null!==k&&(k.return=null);e.return=null}catch(l){W(e,b,l)}}if(b.subtreeFlags&12854)for(b=b.child;null!==b;)ek(b,a),b=b.sibling}
function ek(a,b){var c=a.alternate,d=a.flags;switch(a.tag){case 0:case 11:case 14:case 15:dk(b,a);fk(a);if(d&4){try{Qj(3,a,a.return),Rj(3,a)}catch(t){W(a,a.return,t)}try{Qj(5,a,a.return)}catch(t){W(a,a.return,t)}}break;case 1:dk(b,a);fk(a);d&512&&null!==c&&Mj(c,c.return);break;case 5:dk(b,a);fk(a);d&512&&null!==c&&Mj(c,c.return);if(a.flags&32){var e=a.stateNode;try{ob(e,"")}catch(t){W(a,a.return,t)}}if(d&4&&(e=a.stateNode,null!=e)){var f=a.memoizedProps,g=null!==c?c.memoizedProps:f,h=a.type,k=a.updateQueue;
a.updateQueue=null;if(null!==k)try{"input"===h&&"radio"===f.type&&null!=f.name&&ab(e,f);vb(h,g);var l=vb(h,f);for(g=0;g<k.length;g+=2){var m=k[g],q=k[g+1];"style"===m?sb(e,q):"dangerouslySetInnerHTML"===m?nb(e,q):"children"===m?ob(e,q):ta(e,m,q,l)}switch(h){case "input":bb(e,f);break;case "textarea":ib(e,f);break;case "select":var r=e._wrapperState.wasMultiple;e._wrapperState.wasMultiple=!!f.multiple;var y=f.value;null!=y?fb(e,!!f.multiple,y,!1):r!==!!f.multiple&&(null!=f.defaultValue?fb(e,!!f.multiple,
f.defaultValue,!0):fb(e,!!f.multiple,f.multiple?[]:"",!1))}e[Pf]=f}catch(t){W(a,a.return,t)}}break;case 6:dk(b,a);fk(a);if(d&4){if(null===a.stateNode)throw Error(p(162));e=a.stateNode;f=a.memoizedProps;try{e.nodeValue=f}catch(t){W(a,a.return,t)}}break;case 3:dk(b,a);fk(a);if(d&4&&null!==c&&c.memoizedState.isDehydrated)try{bd(b.containerInfo)}catch(t){W(a,a.return,t)}break;case 4:dk(b,a);fk(a);break;case 13:dk(b,a);fk(a);e=a.child;e.flags&8192&&(f=null!==e.memoizedState,e.stateNode.isHidden=f,!f||
null!==e.alternate&&null!==e.alternate.memoizedState||(gk=B()));d&4&&bk(a);break;case 22:m=null!==c&&null!==c.memoizedState;a.mode&1?(U=(l=U)||m,dk(b,a),U=l):dk(b,a);fk(a);if(d&8192){l=null!==a.memoizedState;if((a.stateNode.isHidden=l)&&!m&&0!==(a.mode&1))for(V=a,m=a.child;null!==m;){for(q=V=m;null!==V;){r=V;y=r.child;switch(r.tag){case 0:case 11:case 14:case 15:Qj(4,r,r.return);break;case 1:Mj(r,r.return);var n=r.stateNode;if("function"===typeof n.componentWillUnmount){d=r;c=r.return;try{b=d,n.props=
b.memoizedProps,n.state=b.memoizedState,n.componentWillUnmount()}catch(t){W(d,c,t)}}break;case 5:Mj(r,r.return);break;case 22:if(null!==r.memoizedState){hk(q);continue}}null!==y?(y.return=r,V=y):hk(q)}m=m.sibling}a:for(m=null,q=a;;){if(5===q.tag){if(null===m){m=q;try{e=q.stateNode,l?(f=e.style,"function"===typeof f.setProperty?f.setProperty("display","none","important"):f.display="none"):(h=q.stateNode,k=q.memoizedProps.style,g=void 0!==k&&null!==k&&k.hasOwnProperty("display")?k.display:null,h.style.display=
rb("display",g))}catch(t){W(a,a.return,t)}}}else if(6===q.tag){if(null===m)try{q.stateNode.nodeValue=l?"":q.memoizedProps}catch(t){W(a,a.return,t)}}else if((22!==q.tag&&23!==q.tag||null===q.memoizedState||q===a)&&null!==q.child){q.child.return=q;q=q.child;continue}if(q===a)break a;for(;null===q.sibling;){if(null===q.return||q.return===a)break a;m===q&&(m=null);q=q.return}m===q&&(m=null);q.sibling.return=q.return;q=q.sibling}}break;case 19:dk(b,a);fk(a);d&4&&bk(a);break;case 21:break;default:dk(b,
a),fk(a)}}function fk(a){var b=a.flags;if(b&2){try{a:{for(var c=a.return;null!==c;){if(Uj(c)){var d=c;break a}c=c.return}throw Error(p(160));}switch(d.tag){case 5:var e=d.stateNode;d.flags&32&&(ob(e,""),d.flags&=-33);var f=Vj(a);Xj(a,f,e);break;case 3:case 4:var g=d.stateNode.containerInfo,h=Vj(a);Wj(a,h,g);break;default:throw Error(p(161));}}catch(k){W(a,a.return,k)}a.flags&=-3}b&4096&&(a.flags&=-4097)}function ik(a,b,c){V=a;jk(a,b,c)}
function jk(a,b,c){for(var d=0!==(a.mode&1);null!==V;){var e=V,f=e.child;if(22===e.tag&&d){var g=null!==e.memoizedState||Kj;if(!g){var h=e.alternate,k=null!==h&&null!==h.memoizedState||U;h=Kj;var l=U;Kj=g;if((U=k)&&!l)for(V=e;null!==V;)g=V,k=g.child,22===g.tag&&null!==g.memoizedState?kk(e):null!==k?(k.return=g,V=k):kk(e);for(;null!==f;)V=f,jk(f,b,c),f=f.sibling;V=e;Kj=h;U=l}lk(a,b,c)}else 0!==(e.subtreeFlags&8772)&&null!==f?(f.return=e,V=f):lk(a,b,c)}}
function lk(a){for(;null!==V;){var b=V;if(0!==(b.flags&8772)){var c=b.alternate;try{if(0!==(b.flags&8772))switch(b.tag){case 0:case 11:case 15:U||Rj(5,b);break;case 1:var d=b.stateNode;if(b.flags&4&&!U)if(null===c)d.componentDidMount();else{var e=b.elementType===b.type?c.memoizedProps:Lg(b.type,c.memoizedProps);d.componentDidUpdate(e,c.memoizedState,d.__reactInternalSnapshotBeforeUpdate)}var f=b.updateQueue;null!==f&&ih(b,f,d);break;case 3:var g=b.updateQueue;if(null!==g){c=null;if(null!==b.child)switch(b.child.tag){case 5:c=
b.child.stateNode;break;case 1:c=b.child.stateNode}ih(b,g,c)}break;case 5:var h=b.stateNode;if(null===c&&b.flags&4){c=h;var k=b.memoizedProps;switch(b.type){case "button":case "input":case "select":case "textarea":k.autoFocus&&c.focus();break;case "img":k.src&&(c.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(null===b.memoizedState){var l=b.alternate;if(null!==l){var m=l.memoizedState;if(null!==m){var q=m.dehydrated;null!==q&&bd(q)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;
default:throw Error(p(163));}U||b.flags&512&&Sj(b)}catch(r){W(b,b.return,r)}}if(b===a){V=null;break}c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}function hk(a){for(;null!==V;){var b=V;if(b===a){V=null;break}var c=b.sibling;if(null!==c){c.return=b.return;V=c;break}V=b.return}}
function kk(a){for(;null!==V;){var b=V;try{switch(b.tag){case 0:case 11:case 15:var c=b.return;try{Rj(4,b)}catch(k){W(b,c,k)}break;case 1:var d=b.stateNode;if("function"===typeof d.componentDidMount){var e=b.return;try{d.componentDidMount()}catch(k){W(b,e,k)}}var f=b.return;try{Sj(b)}catch(k){W(b,f,k)}break;case 5:var g=b.return;try{Sj(b)}catch(k){W(b,g,k)}}}catch(k){W(b,b.return,k)}if(b===a){V=null;break}var h=b.sibling;if(null!==h){h.return=b.return;V=h;break}V=b.return}}
var mk=Math.ceil,nk=ua.ReactCurrentDispatcher,ok=ua.ReactCurrentOwner,pk=ua.ReactCurrentBatchConfig,K=0,R=null,Y=null,Z=0,gj=0,fj=Uf(0),T=0,qk=null,hh=0,rk=0,sk=0,tk=null,uk=null,gk=0,Hj=Infinity,vk=null,Pi=!1,Qi=null,Si=null,wk=!1,xk=null,yk=0,zk=0,Ak=null,Bk=-1,Ck=0;function L(){return 0!==(K&6)?B():-1!==Bk?Bk:Bk=B()}
function lh(a){if(0===(a.mode&1))return 1;if(0!==(K&2)&&0!==Z)return Z&-Z;if(null!==Kg.transition)return 0===Ck&&(Ck=yc()),Ck;a=C;if(0!==a)return a;a=window.event;a=void 0===a?16:jd(a.type);return a}function mh(a,b,c,d){if(50<zk)throw zk=0,Ak=null,Error(p(185));Ac(a,c,d);if(0===(K&2)||a!==R)a===R&&(0===(K&2)&&(rk|=c),4===T&&Dk(a,Z)),Ek(a,d),1===c&&0===K&&0===(b.mode&1)&&(Hj=B()+500,fg&&jg())}
function Ek(a,b){var c=a.callbackNode;wc(a,b);var d=uc(a,a===R?Z:0);if(0===d)null!==c&&bc(c),a.callbackNode=null,a.callbackPriority=0;else if(b=d&-d,a.callbackPriority!==b){null!=c&&bc(c);if(1===b)0===a.tag?ig(Fk.bind(null,a)):hg(Fk.bind(null,a)),Jf(function(){0===(K&6)&&jg()}),c=null;else{switch(Dc(d)){case 1:c=fc;break;case 4:c=gc;break;case 16:c=hc;break;case 536870912:c=jc;break;default:c=hc}c=Gk(c,Hk.bind(null,a))}a.callbackPriority=b;a.callbackNode=c}}
function Hk(a,b){Bk=-1;Ck=0;if(0!==(K&6))throw Error(p(327));var c=a.callbackNode;if(Ik()&&a.callbackNode!==c)return null;var d=uc(a,a===R?Z:0);if(0===d)return null;if(0!==(d&30)||0!==(d&a.expiredLanes)||b)b=Jk(a,d);else{b=d;var e=K;K|=2;var f=Kk();if(R!==a||Z!==b)vk=null,Hj=B()+500,Lk(a,b);do try{Mk();break}catch(h){Nk(a,h)}while(1);Qg();nk.current=f;K=e;null!==Y?b=0:(R=null,Z=0,b=T)}if(0!==b){2===b&&(e=xc(a),0!==e&&(d=e,b=Ok(a,e)));if(1===b)throw c=qk,Lk(a,0),Dk(a,d),Ek(a,B()),c;if(6===b)Dk(a,d);
else{e=a.current.alternate;if(0===(d&30)&&!Pk(e)&&(b=Jk(a,d),2===b&&(f=xc(a),0!==f&&(d=f,b=Ok(a,f))),1===b))throw c=qk,Lk(a,0),Dk(a,d),Ek(a,B()),c;a.finishedWork=e;a.finishedLanes=d;switch(b){case 0:case 1:throw Error(p(345));case 2:Qk(a,uk,vk);break;case 3:Dk(a,d);if((d&130023424)===d&&(b=gk+500-B(),10<b)){if(0!==uc(a,0))break;e=a.suspendedLanes;if((e&d)!==d){L();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=Ff(Qk.bind(null,a,uk,vk),b);break}Qk(a,uk,vk);break;case 4:Dk(a,d);if((d&4194240)===
d)break;b=a.eventTimes;for(e=-1;0<d;){var g=31-oc(d);f=1<<g;g=b[g];g>e&&(e=g);d&=~f}d=e;d=B()-d;d=(120>d?120:480>d?480:1080>d?1080:1920>d?1920:3E3>d?3E3:4320>d?4320:1960*mk(d/1960))-d;if(10<d){a.timeoutHandle=Ff(Qk.bind(null,a,uk,vk),d);break}Qk(a,uk,vk);break;case 5:Qk(a,uk,vk);break;default:throw Error(p(329));}}}Ek(a,B());return a.callbackNode===c?Hk.bind(null,a):null}
function Ok(a,b){var c=tk;a.current.memoizedState.isDehydrated&&(Lk(a,b).flags|=256);a=Jk(a,b);2!==a&&(b=uk,uk=c,null!==b&&Gj(b));return a}function Gj(a){null===uk?uk=a:uk.push.apply(uk,a)}
function Pk(a){for(var b=a;;){if(b.flags&16384){var c=b.updateQueue;if(null!==c&&(c=c.stores,null!==c))for(var d=0;d<c.length;d++){var e=c[d],f=e.getSnapshot;e=e.value;try{if(!He(f(),e))return!1}catch(g){return!1}}}c=b.child;if(b.subtreeFlags&16384&&null!==c)c.return=b,b=c;else{if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return!0;b=b.return}b.sibling.return=b.return;b=b.sibling}}return!0}
function Dk(a,b){b&=~sk;b&=~rk;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-oc(b),d=1<<c;a[c]=-1;b&=~d}}function Fk(a){if(0!==(K&6))throw Error(p(327));Ik();var b=uc(a,0);if(0===(b&1))return Ek(a,B()),null;var c=Jk(a,b);if(0!==a.tag&&2===c){var d=xc(a);0!==d&&(b=d,c=Ok(a,d))}if(1===c)throw c=qk,Lk(a,0),Dk(a,b),Ek(a,B()),c;if(6===c)throw Error(p(345));a.finishedWork=a.current.alternate;a.finishedLanes=b;Qk(a,uk,vk);Ek(a,B());return null}
function Rk(a,b){var c=K;K|=1;try{return a(b)}finally{K=c,0===K&&(Hj=B()+500,fg&&jg())}}function Sk(a){null!==xk&&0===xk.tag&&0===(K&6)&&Ik();var b=K;K|=1;var c=pk.transition,d=C;try{if(pk.transition=null,C=1,a)return a()}finally{C=d,pk.transition=c,K=b,0===(K&6)&&jg()}}function Ij(){gj=fj.current;E(fj)}
function Lk(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,Gf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;wg(d);switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&$f();break;case 3:Jh();E(Wf);E(H);Oh();break;case 5:Lh(d);break;case 4:Jh();break;case 13:E(M);break;case 19:E(M);break;case 10:Rg(d.type._context);break;case 22:case 23:Ij()}c=c.return}R=a;Y=a=wh(a.current,null);Z=gj=b;T=0;qk=null;sk=rk=hh=0;uk=tk=null;if(null!==Wg){for(b=
0;b<Wg.length;b++)if(c=Wg[b],d=c.interleaved,null!==d){c.interleaved=null;var e=d.next,f=c.pending;if(null!==f){var g=f.next;f.next=e;d.next=g}c.pending=d}Wg=null}return a}
function Nk(a,b){do{var c=Y;try{Qg();Ph.current=ai;if(Sh){for(var d=N.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}Sh=!1}Rh=0;P=O=N=null;Th=!1;Uh=0;ok.current=null;if(null===c||null===c.return){T=1;qk=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=Z;h.flags|=32768;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k,m=h,q=m.tag;if(0===(m.mode&1)&&(0===q||11===q||15===q)){var r=m.alternate;r?(m.updateQueue=r.updateQueue,m.memoizedState=r.memoizedState,
m.lanes=r.lanes):(m.updateQueue=null,m.memoizedState=null)}var y=Vi(g);if(null!==y){y.flags&=-257;Wi(y,g,h,f,b);y.mode&1&&Ti(f,l,b);b=y;k=l;var n=b.updateQueue;if(null===n){var t=new Set;t.add(k);b.updateQueue=t}else n.add(k);break a}else{if(0===(b&1)){Ti(f,l,b);uj();break a}k=Error(p(426))}}else if(I&&h.mode&1){var J=Vi(g);if(null!==J){0===(J.flags&65536)&&(J.flags|=256);Wi(J,g,h,f,b);Jg(Ki(k,h));break a}}f=k=Ki(k,h);4!==T&&(T=2);null===tk?tk=[f]:tk.push(f);f=g;do{switch(f.tag){case 3:f.flags|=65536;
b&=-b;f.lanes|=b;var x=Oi(f,k,b);fh(f,x);break a;case 1:h=k;var w=f.type,u=f.stateNode;if(0===(f.flags&128)&&("function"===typeof w.getDerivedStateFromError||null!==u&&"function"===typeof u.componentDidCatch&&(null===Si||!Si.has(u)))){f.flags|=65536;b&=-b;f.lanes|=b;var F=Ri(f,h,b);fh(f,F);break a}}f=f.return}while(null!==f)}Tk(c)}catch(na){b=na;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}function Kk(){var a=nk.current;nk.current=ai;return null===a?ai:a}
function uj(){if(0===T||3===T||2===T)T=4;null===R||0===(hh&268435455)&&0===(rk&268435455)||Dk(R,Z)}function Jk(a,b){var c=K;K|=2;var d=Kk();if(R!==a||Z!==b)vk=null,Lk(a,b);do try{Uk();break}catch(e){Nk(a,e)}while(1);Qg();K=c;nk.current=d;if(null!==Y)throw Error(p(261));R=null;Z=0;return T}function Uk(){for(;null!==Y;)Vk(Y)}function Mk(){for(;null!==Y&&!cc();)Vk(Y)}function Vk(a){var b=Wk(a.alternate,a,gj);a.memoizedProps=a.pendingProps;null===b?Tk(a):Y=b;ok.current=null}
function Tk(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&32768)){if(c=Fj(c,b,gj),null!==c){Y=c;return}}else{c=Jj(c,b);if(null!==c){c.flags&=32767;Y=c;return}if(null!==a)a.flags|=32768,a.subtreeFlags=0,a.deletions=null;else{T=6;Y=null;return}}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===T&&(T=5)}function Qk(a,b,c){var d=C,e=pk.transition;try{pk.transition=null,C=1,Xk(a,b,c,d)}finally{pk.transition=e,C=d}return null}
function Xk(a,b,c,d){do Ik();while(null!==xk);if(0!==(K&6))throw Error(p(327));c=a.finishedWork;var e=a.finishedLanes;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(p(177));a.callbackNode=null;a.callbackPriority=0;var f=c.lanes|c.childLanes;Bc(a,f);a===R&&(Y=R=null,Z=0);0===(c.subtreeFlags&2064)&&0===(c.flags&2064)||wk||(wk=!0,Gk(hc,function(){Ik();return null}));f=0!==(c.flags&15990);if(0!==(c.subtreeFlags&15990)||f){f=pk.transition;pk.transition=null;
var g=C;C=1;var h=K;K|=4;ok.current=null;Pj(a,c);ek(c,a);Oe(Df);dd=!!Cf;Df=Cf=null;a.current=c;ik(c,a,e);dc();K=h;C=g;pk.transition=f}else a.current=c;wk&&(wk=!1,xk=a,yk=e);f=a.pendingLanes;0===f&&(Si=null);mc(c.stateNode,d);Ek(a,B());if(null!==b)for(d=a.onRecoverableError,c=0;c<b.length;c++)e=b[c],d(e.value,{componentStack:e.stack,digest:e.digest});if(Pi)throw Pi=!1,a=Qi,Qi=null,a;0!==(yk&1)&&0!==a.tag&&Ik();f=a.pendingLanes;0!==(f&1)?a===Ak?zk++:(zk=0,Ak=a):zk=0;jg();return null}
function Ik(){if(null!==xk){var a=Dc(yk),b=pk.transition,c=C;try{pk.transition=null;C=16>a?16:a;if(null===xk)var d=!1;else{a=xk;xk=null;yk=0;if(0!==(K&6))throw Error(p(331));var e=K;K|=4;for(V=a.current;null!==V;){var f=V,g=f.child;if(0!==(V.flags&16)){var h=f.deletions;if(null!==h){for(var k=0;k<h.length;k++){var l=h[k];for(V=l;null!==V;){var m=V;switch(m.tag){case 0:case 11:case 15:Qj(8,m,f)}var q=m.child;if(null!==q)q.return=m,V=q;else for(;null!==V;){m=V;var r=m.sibling,y=m.return;Tj(m);if(m===
l){V=null;break}if(null!==r){r.return=y;V=r;break}V=y}}}var n=f.alternate;if(null!==n){var t=n.child;if(null!==t){n.child=null;do{var J=t.sibling;t.sibling=null;t=J}while(null!==t)}}V=f}}if(0!==(f.subtreeFlags&2064)&&null!==g)g.return=f,V=g;else b:for(;null!==V;){f=V;if(0!==(f.flags&2048))switch(f.tag){case 0:case 11:case 15:Qj(9,f,f.return)}var x=f.sibling;if(null!==x){x.return=f.return;V=x;break b}V=f.return}}var w=a.current;for(V=w;null!==V;){g=V;var u=g.child;if(0!==(g.subtreeFlags&2064)&&null!==
u)u.return=g,V=u;else b:for(g=w;null!==V;){h=V;if(0!==(h.flags&2048))try{switch(h.tag){case 0:case 11:case 15:Rj(9,h)}}catch(na){W(h,h.return,na)}if(h===g){V=null;break b}var F=h.sibling;if(null!==F){F.return=h.return;V=F;break b}V=h.return}}K=e;jg();if(lc&&"function"===typeof lc.onPostCommitFiberRoot)try{lc.onPostCommitFiberRoot(kc,a)}catch(na){}d=!0}return d}finally{C=c,pk.transition=b}}return!1}function Yk(a,b,c){b=Ki(c,b);b=Oi(a,b,1);a=dh(a,b,1);b=L();null!==a&&(Ac(a,1,b),Ek(a,b))}
function W(a,b,c){if(3===a.tag)Yk(a,a,c);else for(;null!==b;){if(3===b.tag){Yk(b,a,c);break}else if(1===b.tag){var d=b.stateNode;if("function"===typeof b.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Si||!Si.has(d))){a=Ki(c,a);a=Ri(b,a,1);b=dh(b,a,1);a=L();null!==b&&(Ac(b,1,a),Ek(b,a));break}}b=b.return}}
function Ui(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=L();a.pingedLanes|=a.suspendedLanes&c;R===a&&(Z&c)===c&&(4===T||3===T&&(Z&130023424)===Z&&500>B()-gk?Lk(a,0):sk|=c);Ek(a,b)}function Zk(a,b){0===b&&(0===(a.mode&1)?b=1:(b=sc,sc<<=1,0===(sc&130023424)&&(sc=4194304)));var c=L();a=Zg(a,b);null!==a&&(Ac(a,b,c),Ek(a,c))}function vj(a){var b=a.memoizedState,c=0;null!==b&&(c=b.retryLane);Zk(a,c)}
function ck(a,b){var c=0;switch(a.tag){case 13:var d=a.stateNode;var e=a.memoizedState;null!==e&&(c=e.retryLane);break;case 19:d=a.stateNode;break;default:throw Error(p(314));}null!==d&&d.delete(b);Zk(a,c)}var Wk;
Wk=function(a,b,c){if(null!==a)if(a.memoizedProps!==b.pendingProps||Wf.current)Ug=!0;else{if(0===(a.lanes&c)&&0===(b.flags&128))return Ug=!1,zj(a,b,c);Ug=0!==(a.flags&131072)?!0:!1}else Ug=!1,I&&0!==(b.flags&1048576)&&ug(b,ng,b.index);b.lanes=0;switch(b.tag){case 2:var d=b.type;jj(a,b);a=b.pendingProps;var e=Yf(b,H.current);Tg(b,c);e=Xh(null,b,d,a,e,c);var f=bi();b.flags|=1;"object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof?(b.tag=1,b.memoizedState=null,b.updateQueue=
null,Zf(d)?(f=!0,cg(b)):f=!1,b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null,ah(b),e.updater=nh,b.stateNode=e,e._reactInternals=b,rh(b,d,a,c),b=kj(null,b,d,!0,f,c)):(b.tag=0,I&&f&&vg(b),Yi(null,b,e,c),b=b.child);return b;case 16:d=b.elementType;a:{jj(a,b);a=b.pendingProps;e=d._init;d=e(d._payload);b.type=d;e=b.tag=$k(d);a=Lg(d,a);switch(e){case 0:b=dj(null,b,d,a,c);break a;case 1:b=ij(null,b,d,a,c);break a;case 11:b=Zi(null,b,d,a,c);break a;case 14:b=aj(null,b,d,Lg(d.type,a),c);break a}throw Error(p(306,
d,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),dj(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),ij(a,b,d,e,c);case 3:a:{lj(b);if(null===a)throw Error(p(387));d=b.pendingProps;f=b.memoizedState;e=f.element;bh(a,b);gh(b,d,null,c);var g=b.memoizedState;d=g.element;if(f.isDehydrated)if(f={element:d,isDehydrated:!1,cache:g.cache,pendingSuspenseBoundaries:g.pendingSuspenseBoundaries,transitions:g.transitions},b.updateQueue.baseState=
f,b.memoizedState=f,b.flags&256){e=Ki(Error(p(423)),b);b=mj(a,b,d,c,e);break a}else if(d!==e){e=Ki(Error(p(424)),b);b=mj(a,b,d,c,e);break a}else for(yg=Lf(b.stateNode.containerInfo.firstChild),xg=b,I=!0,zg=null,c=Ch(b,null,d,c),b.child=c;c;)c.flags=c.flags&-3|4096,c=c.sibling;else{Ig();if(d===e){b=$i(a,b,c);break a}Yi(a,b,d,c)}b=b.child}return b;case 5:return Kh(b),null===a&&Eg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,Ef(d,e)?g=null:null!==f&&Ef(d,f)&&(b.flags|=32),
hj(a,b),Yi(a,b,g,c),b.child;case 6:return null===a&&Eg(b),null;case 13:return pj(a,b,c);case 4:return Ih(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Bh(b,null,d,c):Yi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),Zi(a,b,d,e,c);case 7:return Yi(a,b,b.pendingProps,c),b.child;case 8:return Yi(a,b,b.pendingProps.children,c),b.child;case 12:return Yi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;f=b.memoizedProps;
g=e.value;G(Mg,d._currentValue);d._currentValue=g;if(null!==f)if(He(f.value,g)){if(f.children===e.children&&!Wf.current){b=$i(a,b,c);break a}}else for(f=b.child,null!==f&&(f.return=b);null!==f;){var h=f.dependencies;if(null!==h){g=f.child;for(var k=h.firstContext;null!==k;){if(k.context===d){if(1===f.tag){k=ch(-1,c&-c);k.tag=2;var l=f.updateQueue;if(null!==l){l=l.shared;var m=l.pending;null===m?k.next=k:(k.next=m.next,m.next=k);l.pending=k}}f.lanes|=c;k=f.alternate;null!==k&&(k.lanes|=c);Sg(f.return,
c,b);h.lanes|=c;break}k=k.next}}else if(10===f.tag)g=f.type===b.type?null:f.child;else if(18===f.tag){g=f.return;if(null===g)throw Error(p(341));g.lanes|=c;h=g.alternate;null!==h&&(h.lanes|=c);Sg(g,c,b);g=f.sibling}else g=f.child;if(null!==g)g.return=f;else for(g=f;null!==g;){if(g===b){g=null;break}f=g.sibling;if(null!==f){f.return=g.return;g=f;break}g=g.return}f=g}Yi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,d=b.pendingProps.children,Tg(b,c),e=Vg(e),d=d(e),b.flags|=1,Yi(a,b,d,c),
b.child;case 14:return d=b.type,e=Lg(d,b.pendingProps),e=Lg(d.type,e),aj(a,b,d,e,c);case 15:return cj(a,b,b.type,b.pendingProps,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:Lg(d,e),jj(a,b),b.tag=1,Zf(d)?(a=!0,cg(b)):a=!1,Tg(b,c),ph(b,d,e),rh(b,d,e,c),kj(null,b,d,!0,a,c);case 19:return yj(a,b,c);case 22:return ej(a,b,c)}throw Error(p(156,b.tag));};function Gk(a,b){return ac(a,b)}
function al(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.subtreeFlags=this.flags=0;this.deletions=null;this.childLanes=this.lanes=0;this.alternate=null}function Bg(a,b,c,d){return new al(a,b,c,d)}function bj(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function $k(a){if("function"===typeof a)return bj(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Da)return 11;if(a===Ga)return 14}return 2}
function wh(a,b){var c=a.alternate;null===c?(c=Bg(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.subtreeFlags=0,c.deletions=null);c.flags=a.flags&14680064;c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function yh(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)bj(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ya:return Ah(c.children,e,f,b);case za:g=8;e|=8;break;case Aa:return a=Bg(12,c,b,e|2),a.elementType=Aa,a.lanes=f,a;case Ea:return a=Bg(13,c,b,e),a.elementType=Ea,a.lanes=f,a;case Fa:return a=Bg(19,c,b,e),a.elementType=Fa,a.lanes=f,a;case Ia:return qj(c,e,f,b);default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case Ba:g=10;break a;case Ca:g=9;break a;case Da:g=11;
break a;case Ga:g=14;break a;case Ha:g=16;d=null;break a}throw Error(p(130,null==a?a:typeof a,""));}b=Bg(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Ah(a,b,c,d){a=Bg(7,a,d,b);a.lanes=c;return a}function qj(a,b,c,d){a=Bg(22,a,d,b);a.elementType=Ia;a.lanes=c;a.stateNode={isHidden:!1};return a}function xh(a,b,c){a=Bg(6,a,null,b);a.lanes=c;return a}
function zh(a,b,c){b=Bg(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function bl(a,b,c,d,e){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.callbackNode=this.pendingContext=this.context=null;this.callbackPriority=0;this.eventTimes=zc(0);this.expirationTimes=zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=zc(0);this.identifierPrefix=d;this.onRecoverableError=e;this.mutableSourceEagerHydrationData=
null}function cl(a,b,c,d,e,f,g,h,k){a=new bl(a,b,c,h,k);1===b?(b=1,!0===f&&(b|=8)):b=0;f=Bg(3,null,null,b);a.current=f;f.stateNode=a;f.memoizedState={element:d,isDehydrated:c,cache:null,transitions:null,pendingSuspenseBoundaries:null};ah(f);return a}function dl(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:wa,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function el(a){if(!a)return Vf;a=a._reactInternals;a:{if(Vb(a)!==a||1!==a.tag)throw Error(p(170));var b=a;do{switch(b.tag){case 3:b=b.stateNode.context;break a;case 1:if(Zf(b.type)){b=b.stateNode.__reactInternalMemoizedMergedChildContext;break a}}b=b.return}while(null!==b);throw Error(p(171));}if(1===a.tag){var c=a.type;if(Zf(c))return bg(a,c,b)}return b}
function fl(a,b,c,d,e,f,g,h,k){a=cl(c,d,!0,a,e,f,g,h,k);a.context=el(null);c=a.current;d=L();e=lh(c);f=ch(d,e);f.callback=void 0!==b&&null!==b?b:null;dh(c,f,e);a.current.lanes=e;Ac(a,e,d);Ek(a,d);return a}function gl(a,b,c,d){var e=b.current,f=L(),g=lh(e);c=el(c);null===b.context?b.context=c:b.pendingContext=c;b=ch(f,g);b.payload={element:a};d=void 0===d?null:d;null!==d&&(b.callback=d);a=dh(e,b,g);null!==a&&(mh(a,e,g,f),eh(a,e,g));return g}
function hl(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function il(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function jl(a,b){il(a,b);(a=a.alternate)&&il(a,b)}function kl(){return null}var ll="function"===typeof reportError?reportError:function(a){console.error(a)};function ml(a){this._internalRoot=a}
nl.prototype.render=ml.prototype.render=function(a){var b=this._internalRoot;if(null===b)throw Error(p(409));gl(a,b,null,null)};nl.prototype.unmount=ml.prototype.unmount=function(){var a=this._internalRoot;if(null!==a){this._internalRoot=null;var b=a.containerInfo;Sk(function(){gl(null,a,null,null)});b[uf]=null}};function nl(a){this._internalRoot=a}
nl.prototype.unstable_scheduleHydration=function(a){if(a){var b=Hc();a={blockedOn:null,target:a,priority:b};for(var c=0;c<Qc.length&&0!==b&&b<Qc[c].priority;c++);Qc.splice(c,0,a);0===c&&Vc(a)}};function ol(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType)}function pl(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}function ql(){}
function rl(a,b,c,d,e){if(e){if("function"===typeof d){var f=d;d=function(){var a=hl(g);f.call(a)}}var g=fl(b,d,a,0,null,!1,!1,"",ql);a._reactRootContainer=g;a[uf]=g.current;sf(8===a.nodeType?a.parentNode:a);Sk();return g}for(;e=a.lastChild;)a.removeChild(e);if("function"===typeof d){var h=d;d=function(){var a=hl(k);h.call(a)}}var k=cl(a,0,!1,null,null,!1,!1,"",ql);a._reactRootContainer=k;a[uf]=k.current;sf(8===a.nodeType?a.parentNode:a);Sk(function(){gl(b,k,c,d)});return k}
function sl(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f;if("function"===typeof e){var h=e;e=function(){var a=hl(g);h.call(a)}}gl(b,g,a,e)}else g=rl(c,b,a,e,d);return hl(g)}Ec=function(a){switch(a.tag){case 3:var b=a.stateNode;if(b.current.memoizedState.isDehydrated){var c=tc(b.pendingLanes);0!==c&&(Cc(b,c|1),Ek(b,B()),0===(K&6)&&(Hj=B()+500,jg()))}break;case 13:Sk(function(){var b=Zg(a,1);if(null!==b){var c=L();mh(b,a,1,c)}}),jl(a,1)}};
Fc=function(a){if(13===a.tag){var b=Zg(a,134217728);if(null!==b){var c=L();mh(b,a,134217728,c)}jl(a,134217728)}};Gc=function(a){if(13===a.tag){var b=lh(a),c=Zg(a,b);if(null!==c){var d=L();mh(c,a,b,d)}jl(a,b)}};Hc=function(){return C};Ic=function(a,b){var c=C;try{return C=a,b()}finally{C=c}};
yb=function(a,b,c){switch(b){case "input":bb(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(p(90));Wa(d);bb(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Rk;Hb=Sk;
var tl={usingClientEntryPoint:!1,Events:[Cb,ue,Db,Eb,Fb,Rk]},ul={findFiberByHostInstance:Wc,bundleType:0,version:"18.2.0",rendererPackageName:"react-dom"};
var vl={bundleType:ul.bundleType,version:ul.version,rendererPackageName:ul.rendererPackageName,rendererConfig:ul.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ua.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=Zb(a);return null===a?null:a.stateNode},findFiberByHostInstance:ul.findFiberByHostInstance||
kl,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.2.0-next-9e3b772b8-20220608"};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var wl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!wl.isDisabled&&wl.supportsFiber)try{kc=wl.inject(vl),lc=wl}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=tl;
exports.createPortal=function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!ol(b))throw Error(p(200));return dl(a,b,null,c)};exports.createRoot=function(a,b){if(!ol(a))throw Error(p(299));var c=!1,d="",e=ll;null!==b&&void 0!==b&&(!0===b.unstable_strictMode&&(c=!0),void 0!==b.identifierPrefix&&(d=b.identifierPrefix),void 0!==b.onRecoverableError&&(e=b.onRecoverableError));b=cl(a,1,!1,null,null,c,!1,d,e);a[uf]=b.current;sf(8===a.nodeType?a.parentNode:a);return new ml(b)};
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(p(188));a=Object.keys(a).join(",");throw Error(p(268,a));}a=Zb(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a){return Sk(a)};exports.hydrate=function(a,b,c){if(!pl(b))throw Error(p(200));return sl(null,a,b,!0,c)};
exports.hydrateRoot=function(a,b,c){if(!ol(a))throw Error(p(405));var d=null!=c&&c.hydratedSources||null,e=!1,f="",g=ll;null!==c&&void 0!==c&&(!0===c.unstable_strictMode&&(e=!0),void 0!==c.identifierPrefix&&(f=c.identifierPrefix),void 0!==c.onRecoverableError&&(g=c.onRecoverableError));b=fl(b,null,a,1,null!=c?c:null,e,!1,f,g);a[uf]=b.current;sf(a);if(d)for(a=0;a<d.length;a++)c=d[a],e=c._getVersion,e=e(c._source),null==b.mutableSourceEagerHydrationData?b.mutableSourceEagerHydrationData=[c,e]:b.mutableSourceEagerHydrationData.push(c,
e);return new nl(b)};exports.render=function(a,b,c){if(!pl(b))throw Error(p(200));return sl(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!pl(a))throw Error(p(40));return a._reactRootContainer?(Sk(function(){sl(null,null,a,!1,function(){a._reactRootContainer=null;a[uf]=null})}),!0):!1};exports.unstable_batchedUpdates=Rk;
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!pl(c))throw Error(p(200));if(null==a||void 0===a._reactInternals)throw Error(p(38));return sl(a,b,c,!1,d)};exports.version="18.2.0-next-9e3b772b8-20220608";


/***/ }),

/***/ 5338:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var m = __webpack_require__(40961);
if (true) {
  exports.H = m.createRoot;
  __webpack_unused_export__ = m.hydrateRoot;
} else { var i; }


/***/ }),

/***/ 40961:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(22551);
} else {}


/***/ }),

/***/ 15287:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=Symbol.for("react.element"),n=Symbol.for("react.portal"),p=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){if(null===a||"object"!==typeof a)return null;a=z&&a[z]||a["@@iterator"];return"function"===typeof a?a:null}
var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}E.prototype.isReactComponent={};
E.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}F.prototype=E.prototype;function G(a,b,e){this.props=a;this.context=b;this.refs=D;this.updater=e||B}var H=G.prototype=new F;
H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};
function M(a,b,e){var d,c={},k=null,h=null;if(null!=b)for(d in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(1===g)c.children=e;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];c.children=f}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)void 0===c[d]&&(c[d]=g[d]);return{$$typeof:l,type:a,key:k,ref:h,props:c,_owner:K.current}}
function N(a,b){return{$$typeof:l,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function O(a){return"object"===typeof a&&null!==a&&a.$$typeof===l}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var P=/\/+/g;function Q(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function R(a,b,e,d,c){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case l:case n:h=!0}}if(h)return h=a,c=c(h),a=""===d?"."+Q(h,0):d,I(c)?(e="",null!=a&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a){return a})):null!=c&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;h=0;d=""===d?".":d+":";if(I(a))for(var g=0;g<a.length;g++){k=
a[g];var f=d+Q(k,g);h+=R(k,b,e,f,c)}else if(f=A(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=d+Q(k,g++),h+=R(k,b,e,f,c);else if("object"===k)throw b=String(a),Error("Objects are not valid as a React child (found: "+("[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}
function S(a,b,e){if(null==a)return a;var d=[],c=0;R(a,d,"","",function(a){return b.call(e,a,c++)});return d}function T(a){if(-1===a._status){var b=a._result;b=b();b.then(function(b){if(0===a._status||-1===a._status)a._status=1,a._result=b},function(b){if(0===a._status||-1===a._status)a._status=2,a._result=b});-1===a._status&&(a._status=0,a._result=b)}if(1===a._status)return a._result.default;throw a._result;}
var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};exports.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;S(a,function(){b++});return b},toArray:function(a){return S(a,function(a){return a})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};exports.Component=E;exports.Fragment=p;
exports.Profiler=r;exports.PureComponent=G;exports.StrictMode=q;exports.Suspense=w;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;
exports.cloneElement=function(a,b,e){if(null===a||void 0===a)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=K.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)J.call(b,f)&&!L.hasOwnProperty(f)&&(d[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)d.children=e;else if(1<f){g=Array(f);
for(var m=0;m<f;m++)g[m]=arguments[m+2];d.children=g}return{$$typeof:l,type:a.type,key:c,ref:k,props:d,_owner:h}};exports.createContext=function(a){a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null};a.Provider={$$typeof:t,_context:a};return a.Consumer=a};exports.createElement=M;exports.createFactory=function(a){var b=M.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};
exports.forwardRef=function(a){return{$$typeof:v,render:a}};exports.isValidElement=O;exports.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};exports.memo=function(a,b){return{$$typeof:x,type:a,compare:void 0===b?null:b}};exports.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};exports.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.");};
exports.useCallback=function(a,b){return U.current.useCallback(a,b)};exports.useContext=function(a){return U.current.useContext(a)};exports.useDebugValue=function(){};exports.useDeferredValue=function(a){return U.current.useDeferredValue(a)};exports.useEffect=function(a,b){return U.current.useEffect(a,b)};exports.useId=function(){return U.current.useId()};exports.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};
exports.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};exports.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};exports.useMemo=function(a,b){return U.current.useMemo(a,b)};exports.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};exports.useRef=function(a){return U.current.useRef(a)};exports.useState=function(a){return U.current.useState(a)};exports.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};
exports.useTransition=function(){return U.current.useTransition()};exports.version="18.2.0";


/***/ }),

/***/ 96540:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(15287);
} else {}


/***/ }),

/***/ 7463:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else{var b=h(t);null!==b&&K(H,b.startTime-a)}}
function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b)}else k(r);v=h(r)}if(null!==v)var w=!0;else{var m=h(t);null!==m&&K(H,m.startTime-b);w=!1}return w}finally{v=null,y=c,z=!1}}var N=!1,O=null,L=-1,P=5,Q=-1;
function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}var S;if("function"===typeof F)S=function(){F(R)};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null)}}else S=function(){D(R,0)};function I(a){O=a;N||(N=!0,S())}function K(a,b){L=D(function(){a(exports.unstable_now())},b)}
exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))};
exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}};exports.unstable_pauseExecution=function(){};
exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}};


/***/ }),

/***/ 69982:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(7463);
} else {}


/***/ }),

/***/ 31635:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cl: function() { return /* binding */ __assign; },
/* harmony export */   sH: function() { return /* binding */ __awaiter; }
/* harmony export */ });
/* unused harmony exports __extends, __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources */
/* provided dependency */ var Promise = __webpack_require__(64583)["Promise"];
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(5338);
;// CONCATENATED MODULE: ./src/App.jsx
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


/* global Office */
var App = /*#__PURE__*/function (_React$Component) {
  function App(props) {
    _classCallCheck(this, App);
    return _callSuper(this, App, [props]);
  }
  _inherits(App, _React$Component);
  return _createClass(App, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react.createElement("h1", null, "Welcome to the claim addin!");
    }
  }]);
}(react.Component);
/* harmony default export */ var src_App = (App);
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(31635);
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/dom/canUseDOM.js
/**
 * Verifies if an application can use DOM.
 */
function canUseDOM() {
    return (
    // eslint-disable-next-line no-restricted-globals
    typeof window !== 'undefined' &&
        !!(
        // eslint-disable-next-line no-restricted-globals, deprecation/deprecation
        (window.document && window.document.createElement)));
}
//# sourceMappingURL=canUseDOM.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/dom/getWindow.js

var _window = undefined;
// Note: Accessing "window" in IE11 is somewhat expensive, and calling "typeof window"
// hits a memory leak, whereas aliasing it and calling "typeof _window" does not.
// Caching the window value at the file scope lets us minimize the impact.
try {
    // eslint-disable-next-line no-restricted-globals
    _window = window;
}
catch (e) {
    /* no-op */
}
/**
 * Helper to get the window object. The helper will make sure to use a cached variable
 * of "window", to avoid overhead and memory leaks in IE11. Note that in popup scenarios the
 * window object won't match the "global" window object, and for these scenarios, you should
 * pass in an element hosted within the popup.
 *
 * @public
 */
function getWindow_getWindow(rootElement) {
    if (!canUseDOM() || typeof _window === 'undefined') {
        return undefined;
    }
    else {
        var el = rootElement;
        return el && el.ownerDocument && el.ownerDocument.defaultView ? el.ownerDocument.defaultView : _window;
    }
}
//# sourceMappingURL=getWindow.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/GlobalSettings.js

/**
 * Storing global state in local module variables has issues when more than one copy
 * if the module gets loaded on the page (due to a bundling error or simply by consuming
 * a prebundled script.)
 *
 * This file contains helpers to deal with the getting and setting local state, and allows
 * callers to get called back when it mutates.
 */
var GLOBAL_SETTINGS_PROP_NAME = '__globalSettings__';
var CALLBACK_STATE_PROP_NAME = '__callbacks__';
var _counter = 0;
/**
 * Global settings helper, which stores settings in the global (window) namespace.
 * If window is not provided, it will store settings in module scope. Provides a
 * way to observe changes as well when their values change.
 *
 * @public
 * {@docCategory GlobalSettings}
 */
var GlobalSettings = /** @class */ (function () {
    function GlobalSettings() {
    }
    GlobalSettings.getValue = function (key, defaultValue) {
        var globalSettings = _getGlobalSettings();
        if (globalSettings[key] === undefined) {
            globalSettings[key] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
        return globalSettings[key];
    };
    GlobalSettings.setValue = function (key, value) {
        var globalSettings = _getGlobalSettings();
        var callbacks = globalSettings[CALLBACK_STATE_PROP_NAME];
        var oldValue = globalSettings[key];
        if (value !== oldValue) {
            globalSettings[key] = value;
            var changeDescription = {
                oldValue: oldValue,
                value: value,
                key: key,
            };
            for (var id in callbacks) {
                if (callbacks.hasOwnProperty(id)) {
                    callbacks[id](changeDescription);
                }
            }
        }
        return value;
    };
    GlobalSettings.addChangeListener = function (cb) {
        // Note: we use generated ids on the callbacks to create a map of the callbacks, which optimizes removal.
        // (It's faster to delete a key than it is to look up the index of an object and splice an array.)
        var id = cb.__id__;
        var callbacks = _getCallbacks();
        if (!id) {
            id = cb.__id__ = String(_counter++);
        }
        callbacks[id] = cb;
    };
    GlobalSettings.removeChangeListener = function (cb) {
        var callbacks = _getCallbacks();
        delete callbacks[cb.__id__];
    };
    return GlobalSettings;
}());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _getGlobalSettings() {
    var _a;
    var win = getWindow_getWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var globalObj = win || {};
    if (!globalObj[GLOBAL_SETTINGS_PROP_NAME]) {
        globalObj[GLOBAL_SETTINGS_PROP_NAME] = (_a = {},
            _a[CALLBACK_STATE_PROP_NAME] = {},
            _a);
    }
    return globalObj[GLOBAL_SETTINGS_PROP_NAME];
}
function _getCallbacks() {
    var globalSettings = _getGlobalSettings();
    return globalSettings[CALLBACK_STATE_PROP_NAME];
}
//# sourceMappingURL=GlobalSettings.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/warn/warn.js
/* eslint-disable no-console */
var _warningCallback = undefined;
/**
 * Sends a warning to console, if the api is present.
 *
 * @public
 * @param message - Warning message.
 */
function warn_warn(message) {
    if (_warningCallback && "production" !== 'production') {}
    else if (console && console.warn) {
        console.warn(message);
    }
}
/**
 * Configures the warning callback. Passing in undefined will reset it to use the default
 * console.warn function.
 *
 * @public
 * @param warningCallback - Callback to override the generated warnings.
 */
function setWarningCallback(warningCallback) {
    _warningCallback = warningCallback;
}
//# sourceMappingURL=warn.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/Stylesheet.js

var InjectionMode = {
    /**
     * Avoids style injection, use getRules() to read the styles.
     */
    none: 0,
    /**
     * Inserts rules using the insertRule api.
     */
    insertNode: 1,
    /**
     * Appends rules using appendChild.
     */
    appendChild: 2,
};
var STYLESHEET_SETTING = '__stylesheet__';
/**
 * MSIE 11 doesn't cascade styles based on DOM ordering, but rather on the order that each style node
 * is created. As such, to maintain consistent priority, IE11 should reuse a single style node.
 */
var REUSE_STYLE_NODE = typeof navigator !== 'undefined' && /rv:11.0/.test(navigator.userAgent);
var _global = {};
// Grab window.
try {
    // Why the cast?
    // if compiled/type checked in same program with `@fluentui/font-icons-mdl2` which extends `Window` on global
    // ( check packages/font-icons-mdl2/src/index.ts ) the definitions don't match! Thus the need of this extra assertion
    _global = (window || {});
}
catch (_a) {
    /* leave as blank object */
}
var _stylesheet;
/**
 * Represents the state of styles registered in the page. Abstracts
 * the surface for adding styles to the stylesheet, exposes helpers
 * for reading the styles registered in server rendered scenarios.
 *
 * @public
 */
var Stylesheet_Stylesheet = /** @class */ (function () {
    function Stylesheet(config, serializedStylesheet) {
        var _a, _b, _c, _d, _e, _f;
        this._rules = [];
        this._preservedRules = [];
        this._counter = 0;
        this._keyToClassName = {};
        this._onInsertRuleCallbacks = [];
        this._onResetCallbacks = [];
        this._classNameToArgs = {};
        this._config = (0,tslib_es6/* __assign */.Cl)({ 
            // If there is no document we won't have an element to inject into.
            injectionMode: typeof document === 'undefined' ? InjectionMode.none : InjectionMode.insertNode, defaultPrefix: 'css', namespace: undefined, cspSettings: undefined }, config);
        this._classNameToArgs = (_a = serializedStylesheet === null || serializedStylesheet === void 0 ? void 0 : serializedStylesheet.classNameToArgs) !== null && _a !== void 0 ? _a : this._classNameToArgs;
        this._counter = (_b = serializedStylesheet === null || serializedStylesheet === void 0 ? void 0 : serializedStylesheet.counter) !== null && _b !== void 0 ? _b : this._counter;
        this._keyToClassName = (_d = (_c = this._config.classNameCache) !== null && _c !== void 0 ? _c : serializedStylesheet === null || serializedStylesheet === void 0 ? void 0 : serializedStylesheet.keyToClassName) !== null && _d !== void 0 ? _d : this._keyToClassName;
        this._preservedRules = (_e = serializedStylesheet === null || serializedStylesheet === void 0 ? void 0 : serializedStylesheet.preservedRules) !== null && _e !== void 0 ? _e : this._preservedRules;
        this._rules = (_f = serializedStylesheet === null || serializedStylesheet === void 0 ? void 0 : serializedStylesheet.rules) !== null && _f !== void 0 ? _f : this._rules;
    }
    /**
     * Gets the singleton instance.
     */
    Stylesheet.getInstance = function () {
        _stylesheet = _global[STYLESHEET_SETTING];
        if (!_stylesheet || (_stylesheet._lastStyleElement && _stylesheet._lastStyleElement.ownerDocument !== document)) {
            var fabricConfig = (_global === null || _global === void 0 ? void 0 : _global.FabricConfig) || {};
            var stylesheet = new Stylesheet(fabricConfig.mergeStyles, fabricConfig.serializedStylesheet);
            _stylesheet = stylesheet;
            _global[STYLESHEET_SETTING] = stylesheet;
        }
        return _stylesheet;
    };
    /**
     * Serializes the Stylesheet instance into a format which allows rehydration on creation.
     * @returns string representation of `ISerializedStylesheet` interface.
     */
    Stylesheet.prototype.serialize = function () {
        return JSON.stringify({
            classNameToArgs: this._classNameToArgs,
            counter: this._counter,
            keyToClassName: this._keyToClassName,
            preservedRules: this._preservedRules,
            rules: this._rules,
        });
    };
    /**
     * Configures the stylesheet.
     */
    Stylesheet.prototype.setConfig = function (config) {
        this._config = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, this._config), config);
    };
    /**
     * Configures a reset callback.
     *
     * @param callback - A callback which will be called when the Stylesheet is reset.
     * @returns function which when called un-registers provided callback.
     */
    Stylesheet.prototype.onReset = function (callback) {
        var _this = this;
        this._onResetCallbacks.push(callback);
        return function () {
            _this._onResetCallbacks = _this._onResetCallbacks.filter(function (cb) { return cb !== callback; });
        };
    };
    /**
     * Configures an insert rule callback.
     *
     * @param callback - A callback which will be called when a rule is inserted.
     * @returns function which when called un-registers provided callback.
     */
    Stylesheet.prototype.onInsertRule = function (callback) {
        var _this = this;
        this._onInsertRuleCallbacks.push(callback);
        return function () {
            _this._onInsertRuleCallbacks = _this._onInsertRuleCallbacks.filter(function (cb) { return cb !== callback; });
        };
    };
    /**
     * Generates a unique classname.
     *
     * @param displayName - Optional value to use as a prefix.
     */
    Stylesheet.prototype.getClassName = function (displayName) {
        var namespace = this._config.namespace;
        var prefix = displayName || this._config.defaultPrefix;
        return "".concat(namespace ? namespace + '-' : '').concat(prefix, "-").concat(this._counter++);
    };
    /**
     * Used internally to cache information about a class which was
     * registered with the stylesheet.
     */
    Stylesheet.prototype.cacheClassName = function (className, key, args, rules) {
        this._keyToClassName[key] = className;
        this._classNameToArgs[className] = {
            args: args,
            rules: rules,
        };
    };
    /**
     * Gets the appropriate classname given a key which was previously
     * registered using cacheClassName.
     */
    Stylesheet.prototype.classNameFromKey = function (key) {
        return this._keyToClassName[key];
    };
    /**
     * Gets all classnames cache with the stylesheet.
     */
    Stylesheet.prototype.getClassNameCache = function () {
        return this._keyToClassName;
    };
    /**
     * Gets the arguments associated with a given classname which was
     * previously registered using cacheClassName.
     */
    Stylesheet.prototype.argsFromClassName = function (className) {
        var entry = this._classNameToArgs[className];
        return entry && entry.args;
    };
    /**
     * Gets the rules associated with a given classname which was
     * previously registered using cacheClassName.
     */
    Stylesheet.prototype.insertedRulesFromClassName = function (className) {
        var entry = this._classNameToArgs[className];
        return entry && entry.rules;
    };
    /**
     * Inserts a css rule into the stylesheet.
     * @param preserve - Preserves the rule beyond a reset boundary.
     */
    Stylesheet.prototype.insertRule = function (rule, preserve) {
        var injectionMode = this._config.injectionMode;
        var element = injectionMode !== InjectionMode.none ? this._getStyleElement() : undefined;
        if (preserve) {
            this._preservedRules.push(rule);
        }
        if (element) {
            switch (injectionMode) {
                case InjectionMode.insertNode:
                    var sheet = element.sheet;
                    try {
                        sheet.insertRule(rule, sheet.cssRules.length);
                    }
                    catch (e) {
                        // The browser will throw exceptions on unsupported rules (such as a moz prefix in webkit.)
                        // We need to swallow the exceptions for this scenario, otherwise we'd need to filter
                        // which could be slower and bulkier.
                    }
                    break;
                case InjectionMode.appendChild:
                    element.appendChild(document.createTextNode(rule));
                    break;
            }
        }
        else {
            this._rules.push(rule);
        }
        // eslint-disable-next-line deprecation/deprecation
        if (this._config.onInsertRule) {
            // eslint-disable-next-line deprecation/deprecation
            this._config.onInsertRule(rule);
        }
        this._onInsertRuleCallbacks.forEach(function (callback) { return callback(); });
    };
    /**
     * Gets all rules registered with the stylesheet; only valid when
     * using InsertionMode.none.
     */
    Stylesheet.prototype.getRules = function (includePreservedRules) {
        return (includePreservedRules ? this._preservedRules.join('') : '') + this._rules.join('');
    };
    /**
     * Resets the internal state of the stylesheet. Only used in server
     * rendered scenarios where we're using InsertionMode.none.
     */
    Stylesheet.prototype.reset = function () {
        this._rules = [];
        this._counter = 0;
        this._classNameToArgs = {};
        this._keyToClassName = {};
        this._onResetCallbacks.forEach(function (callback) { return callback(); });
    };
    // Forces the regeneration of incoming styles without totally resetting the stylesheet.
    Stylesheet.prototype.resetKeys = function () {
        this._keyToClassName = {};
    };
    Stylesheet.prototype._getStyleElement = function () {
        var _this = this;
        if (!this._styleElement && typeof document !== 'undefined') {
            this._styleElement = this._createStyleElement();
            if (!REUSE_STYLE_NODE) {
                // Reset the style element on the next frame.
                window.requestAnimationFrame(function () {
                    _this._styleElement = undefined;
                });
            }
        }
        return this._styleElement;
    };
    Stylesheet.prototype._createStyleElement = function () {
        var head = document.head;
        var styleElement = document.createElement('style');
        var nodeToInsertBefore = null;
        styleElement.setAttribute('data-merge-styles', 'true');
        var cspSettings = this._config.cspSettings;
        if (cspSettings) {
            if (cspSettings.nonce) {
                styleElement.setAttribute('nonce', cspSettings.nonce);
            }
        }
        if (this._lastStyleElement) {
            // If the `nextElementSibling` is null, then the insertBefore will act as a regular append.
            // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore#Syntax
            nodeToInsertBefore = this._lastStyleElement.nextElementSibling;
        }
        else {
            var placeholderStyleTag = this._findPlaceholderStyleTag();
            if (placeholderStyleTag) {
                nodeToInsertBefore = placeholderStyleTag.nextElementSibling;
            }
            else {
                nodeToInsertBefore = head.childNodes[0];
            }
        }
        head.insertBefore(styleElement, head.contains(nodeToInsertBefore) ? nodeToInsertBefore : null);
        this._lastStyleElement = styleElement;
        return styleElement;
    };
    Stylesheet.prototype._findPlaceholderStyleTag = function () {
        var head = document.head;
        if (head) {
            return head.querySelector('style[data-merge-styles]');
        }
        return null;
    };
    return Stylesheet;
}());

//# sourceMappingURL=Stylesheet.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/utilities/icons.js



var ICON_SETTING_NAME = 'icons';
var _iconSettings = GlobalSettings.getValue(ICON_SETTING_NAME, {
    __options: {
        disableWarnings: false,
        warnOnMissingIcons: true,
    },
    __remapped: {},
});
// Reset icon registration on stylesheet resets.
var stylesheet = Stylesheet_Stylesheet.getInstance();
if (stylesheet && stylesheet.onReset) {
    stylesheet.onReset(function () {
        for (var name_1 in _iconSettings) {
            if (_iconSettings.hasOwnProperty(name_1) && !!_iconSettings[name_1].subset) {
                _iconSettings[name_1].subset.className = undefined;
            }
        }
    });
}
/**
 * Normalizes an icon name for consistent mapping.
 * Current implementation is to convert the icon name to lower case.
 *
 * @param name - Icon name to normalize.
 * @returns {string} Normalized icon name to use for indexing and mapping.
 */
var normalizeIconName = function (name) { return name.toLowerCase(); };
/**
 * Registers a given subset of icons.
 *
 * @param iconSubset - the icon subset definition.
 */
function registerIcons(iconSubset, options) {
    var subset = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, iconSubset), { isRegistered: false, className: undefined });
    var icons = iconSubset.icons;
    // Grab options, optionally mix user provided ones on top.
    options = options ? (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, _iconSettings.__options), options) : _iconSettings.__options;
    for (var iconName in icons) {
        if (icons.hasOwnProperty(iconName)) {
            var code = icons[iconName];
            var normalizedIconName = normalizeIconName(iconName);
            if (_iconSettings[normalizedIconName]) {
                _warnDuplicateIcon(iconName);
            }
            else {
                _iconSettings[normalizedIconName] = {
                    code: code,
                    subset: subset,
                };
            }
        }
    }
}
/**
 * Unregisters icons by name.
 *
 * @param iconNames - List of icons to unregister.
 */
function unregisterIcons(iconNames) {
    var options = _iconSettings.__options;
    var _loop_1 = function (iconName) {
        var normalizedIconName = normalizeIconName(iconName);
        if (_iconSettings[normalizedIconName]) {
            delete _iconSettings[normalizedIconName];
        }
        else {
            // Warn that we are trying to delete an icon that doesn't exist
            if (!options.disableWarnings) {
                warn("The icon \"".concat(iconName, "\" tried to unregister but was not registered."));
            }
        }
        // Delete any aliases for this iconName
        if (_iconSettings.__remapped[normalizedIconName]) {
            delete _iconSettings.__remapped[normalizedIconName];
        }
        // Delete any items that were an alias for this iconName
        Object.keys(_iconSettings.__remapped).forEach(function (key) {
            if (_iconSettings.__remapped[key] === normalizedIconName) {
                delete _iconSettings.__remapped[key];
            }
        });
    };
    for (var _i = 0, iconNames_1 = iconNames; _i < iconNames_1.length; _i++) {
        var iconName = iconNames_1[_i];
        _loop_1(iconName);
    }
}
/**
 * Remaps one icon name to another.
 */
function registerIconAlias(iconName, mappedToName) {
    _iconSettings.__remapped[normalizeIconName(iconName)] = normalizeIconName(mappedToName);
}
/**
 * Gets an icon definition. If an icon is requested but the subset has yet to be registered,
 * it will get registered immediately.
 *
 * @public
 * @param name - Name of icon.
 */
function getIcon(name) {
    var icon = undefined;
    var options = _iconSettings.__options;
    name = name ? normalizeIconName(name) : '';
    name = _iconSettings.__remapped[name] || name;
    if (name) {
        icon = _iconSettings[name];
        if (icon) {
            var subset = icon.subset;
            if (subset && subset.fontFace) {
                if (!subset.isRegistered) {
                    fontFace(subset.fontFace);
                    subset.isRegistered = true;
                }
                if (!subset.className) {
                    subset.className = mergeStyles(subset.style, {
                        fontFamily: subset.fontFace.fontFamily,
                        fontWeight: subset.fontFace.fontWeight || 'normal',
                        fontStyle: subset.fontFace.fontStyle || 'normal',
                    });
                }
            }
        }
        else {
            // eslint-disable-next-line deprecation/deprecation
            if (!options.disableWarnings && options.warnOnMissingIcons) {
                warn("The icon \"".concat(name, "\" was used but not registered. See https://github.com/microsoft/fluentui/wiki/Using-icons for more information."));
            }
        }
    }
    return icon;
}
/**
 * Sets the icon options.
 *
 * @public
 */
function setIconOptions(options) {
    _iconSettings.__options = __assign(__assign({}, _iconSettings.__options), options);
}
var _missingIcons = [];
var _missingIconsTimer = undefined;
function _warnDuplicateIcon(iconName) {
    var options = _iconSettings.__options;
    var warningDelay = 2000;
    var maxIconsInMessage = 10;
    if (!options.disableWarnings) {
        _missingIcons.push(iconName);
        if (_missingIconsTimer === undefined) {
            _missingIconsTimer = setTimeout(function () {
                warn_warn("Some icons were re-registered. Applications should only call registerIcons for any given " +
                    "icon once. Redefining what an icon is may have unintended consequences. Duplicates " +
                    "include: \n" +
                    _missingIcons.slice(0, maxIconsInMessage).join(', ') +
                    (_missingIcons.length > maxIconsInMessage ? " (+ ".concat(_missingIcons.length - maxIconsInMessage, " more)") : ''));
                _missingIconsTimer = undefined;
                _missingIcons = [];
            }, warningDelay);
        }
    }
}
//# sourceMappingURL=icons.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/utilities/index.js



//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/cdn.js
var FLUENT_CDN_BASE_URL = 'https://res.cdn.office.net/files/fabric-cdn-prod_20240129.001';
//# sourceMappingURL=cdn.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/set-version/lib/setVersion.js
// A packages cache that makes sure that we don't inject the same packageName twice in the same bundle -
// this cache is local to the module closure inside this bundle
var packagesCache = {};
// Cache access to window to avoid IE11 memory leak.
var _win = undefined;
try {
    _win = window;
}
catch (e) {
    /* no-op */
}
function setVersion(packageName, packageVersion) {
    if (typeof _win !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var packages = (_win.__packages__ = _win.__packages__ || {});
        // We allow either the global packages or local packages caches to invalidate so testing can
        // just clear the global to set this state
        if (!packages[packageName] || !packagesCache[packageName]) {
            packagesCache[packageName] = packageVersion;
            var versions = (packages[packageName] = packages[packageName] || []);
            versions.push(packageVersion);
        }
    }
}
//# sourceMappingURL=setVersion.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/set-version/lib/index.js


setVersion('@fluentui/set-version', '6.0.0');
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/version.js
// Do not modify this file; it is generated as part of publish.
// The checked in version is a placeholder only and will not be updated.

setVersion('@fluentui/style-utilities', '8.10.7');
//# sourceMappingURL=version.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/customizations/Customizations.js


var CustomizationsGlobalKey = 'customizations';
var NO_CUSTOMIZATIONS = { settings: {}, scopedSettings: {}, inCustomizerContext: false };
var _allSettings = GlobalSettings.getValue(CustomizationsGlobalKey, {
    settings: {},
    scopedSettings: {},
    inCustomizerContext: false,
});
var _events = [];
var Customizations = /** @class */ (function () {
    function Customizations() {
    }
    Customizations.reset = function () {
        _allSettings.settings = {};
        _allSettings.scopedSettings = {};
    };
    /** Apply global Customization settings.
     * @example Customizations.applySettings(\{ theme: \{...\} \});
     */
    Customizations.applySettings = function (settings) {
        _allSettings.settings = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, _allSettings.settings), settings);
        Customizations._raiseChange();
    };
    /** Apply Customizations to a particular named scope, like a component.
     * @example Customizations.applyScopedSettings('Nav', \{ styles: () =\> \{\} \});
     */
    Customizations.applyScopedSettings = function (scopeName, settings) {
        _allSettings.scopedSettings[scopeName] = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, _allSettings.scopedSettings[scopeName]), settings);
        Customizations._raiseChange();
    };
    Customizations.getSettings = function (properties, scopeName, localSettings) {
        if (localSettings === void 0) { localSettings = NO_CUSTOMIZATIONS; }
        var settings = {};
        var localScopedSettings = (scopeName && localSettings.scopedSettings[scopeName]) || {};
        var globalScopedSettings = (scopeName && _allSettings.scopedSettings[scopeName]) || {};
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            settings[property] =
                localScopedSettings[property] ||
                    localSettings.settings[property] ||
                    globalScopedSettings[property] ||
                    _allSettings.settings[property];
        }
        return settings;
    };
    /** Used to run some code that sets Customizations without triggering an update until the end.
     * Useful for applying Customizations that don't affect anything currently rendered, or for
     * applying many customizations at once.
     * @param suppressUpdate - Do not raise the change event at the end, preventing all updates
     */
    Customizations.applyBatchedUpdates = function (code, suppressUpdate) {
        Customizations._suppressUpdates = true;
        try {
            code();
        }
        catch (_a) {
            /* do nothing */
        }
        Customizations._suppressUpdates = false;
        if (!suppressUpdate) {
            Customizations._raiseChange();
        }
    };
    Customizations.observe = function (onChange) {
        _events.push(onChange);
    };
    Customizations.unobserve = function (onChange) {
        _events = _events.filter(function (cb) { return cb !== onChange; });
    };
    Customizations._raiseChange = function () {
        if (!Customizations._suppressUpdates) {
            _events.forEach(function (cb) { return cb(); });
        }
    };
    return Customizations;
}());

//# sourceMappingURL=Customizations.js.map
;// CONCATENATED MODULE: ./node_modules/@microsoft/load-themed-styles/lib-es6/index.js
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var lib_es6_assign = (undefined && undefined.__assign) || function () {
    lib_es6_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return lib_es6_assign.apply(this, arguments);
};
// Store the theming state in __themeState__ global scope for reuse in the case of duplicate
// load-themed-styles hosted on the page.
var _root = typeof window === 'undefined' ? __webpack_require__.g : window; // eslint-disable-line @typescript-eslint/no-explicit-any
// Nonce string to inject into script tag if one provided. This is used in CSP (Content Security Policy).
var _styleNonce = _root && _root.CSPSettings && _root.CSPSettings.nonce;
var _themeState = initializeThemeState();
/**
 * Matches theming tokens. For example, "[theme: themeSlotName, default: #FFF]" (including the quotes).
 */
var _themeTokenRegex = /[\'\"]\[theme:\s*(\w+)\s*(?:\,\s*default:\s*([\\"\']?[\.\,\(\)\#\-\s\w]*[\.\,\(\)\#\-\w][\"\']?))?\s*\][\'\"]/g;
var now = function () {
    return typeof performance !== 'undefined' && !!performance.now ? performance.now() : Date.now();
};
function measure(func) {
    var start = now();
    func();
    var end = now();
    _themeState.perf.duration += end - start;
}
/**
 * initialize global state object
 */
function initializeThemeState() {
    var state = _root.__themeState__ || {
        theme: undefined,
        lastStyleElement: undefined,
        registeredStyles: []
    };
    if (!state.runState) {
        state = lib_es6_assign(lib_es6_assign({}, state), { perf: {
                count: 0,
                duration: 0
            }, runState: {
                flushTimer: 0,
                mode: 0 /* Mode.sync */,
                buffer: []
            } });
    }
    if (!state.registeredThemableStyles) {
        state = lib_es6_assign(lib_es6_assign({}, state), { registeredThemableStyles: [] });
    }
    _root.__themeState__ = state;
    return state;
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load
 * event is fired.
 * @param {string | ThemableArray} styles Themable style text to register.
 * @param {boolean} loadAsync When true, always load styles in async mode, irrespective of current sync mode.
 */
function loadStyles(styles, loadAsync) {
    if (loadAsync === void 0) { loadAsync = false; }
    measure(function () {
        var styleParts = Array.isArray(styles) ? styles : splitStyles(styles);
        var _a = _themeState.runState, mode = _a.mode, buffer = _a.buffer, flushTimer = _a.flushTimer;
        if (loadAsync || mode === 1 /* Mode.async */) {
            buffer.push(styleParts);
            if (!flushTimer) {
                _themeState.runState.flushTimer = asyncLoadStyles();
            }
        }
        else {
            applyThemableStyles(styleParts);
        }
    });
}
/**
 * Allows for customizable loadStyles logic. e.g. for server side rendering application
 * @param {(processedStyles: string, rawStyles?: string | ThemableArray) => void}
 * a loadStyles callback that gets called when styles are loaded or reloaded
 */
function configureLoadStyles(loadStylesFn) {
    _themeState.loadStyles = loadStylesFn;
}
/**
 * Configure run mode of load-themable-styles
 * @param mode load-themable-styles run mode, async or sync
 */
function configureRunMode(mode) {
    _themeState.runState.mode = mode;
}
/**
 * external code can call flush to synchronously force processing of currently buffered styles
 */
function flush() {
    measure(function () {
        var styleArrays = _themeState.runState.buffer.slice();
        _themeState.runState.buffer = [];
        var mergedStyleArray = [].concat.apply([], styleArrays);
        if (mergedStyleArray.length > 0) {
            applyThemableStyles(mergedStyleArray);
        }
    });
}
/**
 * register async loadStyles
 */
function asyncLoadStyles() {
    return setTimeout(function () {
        _themeState.runState.flushTimer = 0;
        flush();
    }, 0);
}
/**
 * Loads a set of style text. If it is registered too early, we will register it when the window.load event
 * is fired.
 * @param {string} styleText Style to register.
 * @param {IStyleRecord} styleRecord Existing style record to re-apply.
 */
function applyThemableStyles(stylesArray, styleRecord) {
    if (_themeState.loadStyles) {
        _themeState.loadStyles(resolveThemableArray(stylesArray).styleString, stylesArray);
    }
    else {
        registerStyles(stylesArray);
    }
}
/**
 * Registers a set theme tokens to find and replace. If styles were already registered, they will be
 * replaced.
 * @param {theme} theme JSON object of theme tokens to values.
 */
function loadTheme(theme) {
    _themeState.theme = theme;
    // reload styles.
    reloadStyles();
}
/**
 * Clear already registered style elements and style records in theme_State object
 * @param option - specify which group of registered styles should be cleared.
 * Default to be both themable and non-themable styles will be cleared
 */
function clearStyles(option) {
    if (option === void 0) { option = 3 /* ClearStyleOptions.all */; }
    if (option === 3 /* ClearStyleOptions.all */ || option === 2 /* ClearStyleOptions.onlyNonThemable */) {
        clearStylesInternal(_themeState.registeredStyles);
        _themeState.registeredStyles = [];
    }
    if (option === 3 /* ClearStyleOptions.all */ || option === 1 /* ClearStyleOptions.onlyThemable */) {
        clearStylesInternal(_themeState.registeredThemableStyles);
        _themeState.registeredThemableStyles = [];
    }
}
function clearStylesInternal(records) {
    records.forEach(function (styleRecord) {
        var styleElement = styleRecord && styleRecord.styleElement;
        if (styleElement && styleElement.parentElement) {
            styleElement.parentElement.removeChild(styleElement);
        }
    });
}
/**
 * Reloads styles.
 */
function reloadStyles() {
    if (_themeState.theme) {
        var themableStyles = [];
        for (var _i = 0, _a = _themeState.registeredThemableStyles; _i < _a.length; _i++) {
            var styleRecord = _a[_i];
            themableStyles.push(styleRecord.themableStyle);
        }
        if (themableStyles.length > 0) {
            clearStyles(1 /* ClearStyleOptions.onlyThemable */);
            applyThemableStyles([].concat.apply([], themableStyles));
        }
    }
}
/**
 * Find theme tokens and replaces them with provided theme values.
 * @param {string} styles Tokenized styles to fix.
 */
function detokenize(styles) {
    if (styles) {
        styles = resolveThemableArray(splitStyles(styles)).styleString;
    }
    return styles;
}
/**
 * Resolves ThemingInstruction objects in an array and joins the result into a string.
 * @param {ThemableArray} splitStyleArray ThemableArray to resolve and join.
 */
function resolveThemableArray(splitStyleArray) {
    var theme = _themeState.theme;
    var themable = false;
    // Resolve the array of theming instructions to an array of strings.
    // Then join the array to produce the final CSS string.
    var resolvedArray = (splitStyleArray || []).map(function (currentValue) {
        var themeSlot = currentValue.theme;
        if (themeSlot) {
            themable = true;
            // A theming annotation. Resolve it.
            var themedValue = theme ? theme[themeSlot] : undefined;
            var defaultValue = currentValue.defaultValue || 'inherit';
            // Warn to console if we hit an unthemed value even when themes are provided, but only if "DEBUG" is true.
            // Allow the themedValue to be undefined to explicitly request the default value.
            if (theme &&
                !themedValue &&
                console &&
                !(themeSlot in theme) &&
                typeof DEBUG !== 'undefined' &&
                DEBUG) {
                console.warn("Theming value not provided for \"".concat(themeSlot, "\". Falling back to \"").concat(defaultValue, "\"."));
            }
            return themedValue || defaultValue;
        }
        else {
            // A non-themable string. Preserve it.
            return currentValue.rawString;
        }
    });
    return {
        styleString: resolvedArray.join(''),
        themable: themable
    };
}
/**
 * Split tokenized CSS into an array of strings and theme specification objects
 * @param {string} styles Tokenized styles to split.
 */
function splitStyles(styles) {
    var result = [];
    if (styles) {
        var pos = 0; // Current position in styles.
        var tokenMatch = void 0;
        while ((tokenMatch = _themeTokenRegex.exec(styles))) {
            var matchIndex = tokenMatch.index;
            if (matchIndex > pos) {
                result.push({
                    rawString: styles.substring(pos, matchIndex)
                });
            }
            result.push({
                theme: tokenMatch[1],
                defaultValue: tokenMatch[2] // May be undefined
            });
            // index of the first character after the current match
            pos = _themeTokenRegex.lastIndex;
        }
        // Push the rest of the string after the last match.
        result.push({
            rawString: styles.substring(pos)
        });
    }
    return result;
}
/**
 * Registers a set of style text. If it is registered too early, we will register it when the
 * window.load event is fired.
 * @param {ThemableArray} styleArray Array of IThemingInstruction objects to register.
 * @param {IStyleRecord} styleRecord May specify a style Element to update.
 */
function registerStyles(styleArray) {
    if (typeof document === 'undefined') {
        return;
    }
    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    var _a = resolveThemableArray(styleArray), styleString = _a.styleString, themable = _a.themable;
    styleElement.setAttribute('data-load-themed-styles', 'true');
    if (_styleNonce) {
        styleElement.setAttribute('nonce', _styleNonce);
    }
    styleElement.appendChild(document.createTextNode(styleString));
    _themeState.perf.count++;
    head.appendChild(styleElement);
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent('styleinsert', true /* bubbleEvent */, false /* cancelable */);
    ev.args = {
        newStyle: styleElement
    };
    document.dispatchEvent(ev);
    var record = {
        styleElement: styleElement,
        themableStyle: styleArray
    };
    if (themable) {
        _themeState.registeredThemableStyles.push(record);
    }
    else {
        _themeState.registeredStyles.push(record);
    }
}
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/colors/DefaultPalette.js
// When adding or removing a color, make sure you keep this consistent with IColorClassNames
// by adding the color variants.
var DefaultPalette = {
    themeDarker: '#004578',
    themeDark: '#005a9e',
    themeDarkAlt: '#106ebe',
    themePrimary: '#0078d4',
    themeSecondary: '#2b88d8',
    themeTertiary: '#71afe5',
    themeLight: '#c7e0f4',
    themeLighter: '#deecf9',
    themeLighterAlt: '#eff6fc',
    black: '#000000',
    blackTranslucent40: 'rgba(0,0,0,.4)',
    neutralDark: '#201f1e',
    neutralPrimary: '#323130',
    neutralPrimaryAlt: '#3b3a39',
    neutralSecondary: '#605e5c',
    neutralSecondaryAlt: '#8a8886',
    neutralTertiary: '#a19f9d',
    neutralTertiaryAlt: '#c8c6c4',
    neutralQuaternary: '#d2d0ce',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralLight: '#edebe9',
    neutralLighter: '#f3f2f1',
    neutralLighterAlt: '#faf9f8',
    accent: '#0078d4',
    white: '#ffffff',
    whiteTranslucent40: 'rgba(255,255,255,.4)',
    yellowDark: '#d29200',
    yellow: '#ffb900',
    yellowLight: '#fff100',
    orange: '#d83b01',
    orangeLight: '#ea4300',
    orangeLighter: '#ff8c00',
    redDark: '#a4262c',
    red: '#e81123',
    magentaDark: '#5c005c',
    magenta: '#b4009e',
    magentaLight: '#e3008c',
    purpleDark: '#32145a',
    purple: '#5c2d91',
    purpleLight: '#b4a0ff',
    blueDark: '#002050',
    blueMid: '#00188f',
    blue: '#0078d4',
    blueLight: '#00bcf2',
    tealDark: '#004b50',
    teal: '#008272',
    tealLight: '#00b294',
    greenDark: '#004b1c',
    green: '#107c10',
    greenLight: '#bad80a',
};
//# sourceMappingURL=DefaultPalette.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/effects/FluentDepths.js
var Depths;
(function (Depths) {
    Depths.depth0 = '0 0 0 0 transparent';
    Depths.depth4 = '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108)';
    Depths.depth8 = '0 3.2px 7.2px 0 rgba(0, 0, 0, 0.132), 0 0.6px 1.8px 0 rgba(0, 0, 0, 0.108)';
    Depths.depth16 = '0 6.4px 14.4px 0 rgba(0, 0, 0, 0.132), 0 1.2px 3.6px 0 rgba(0, 0, 0, 0.108)';
    Depths.depth64 = '0 25.6px 57.6px 0 rgba(0, 0, 0, 0.22), 0 4.8px 14.4px 0 rgba(0, 0, 0, 0.18)';
})(Depths || (Depths = {}));
//# sourceMappingURL=FluentDepths.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/effects/DefaultEffects.js

var DefaultEffects = {
    elevation4: Depths.depth4,
    elevation8: Depths.depth8,
    elevation16: Depths.depth16,
    elevation64: Depths.depth64,
    roundedCorner2: '2px',
    roundedCorner4: '4px',
    roundedCorner6: '6px',
};
//# sourceMappingURL=DefaultEffects.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/StyleOptionsState.js
/**
 * Sets the current RTL value.
 */
function setRTL(isRTL) {
    if (_rtl !== isRTL) {
        _rtl = isRTL;
    }
}
/**
 * Gets the current RTL value.
 */
function getRTL() {
    if (_rtl === undefined) {
        _rtl =
            // eslint-disable-next-line no-restricted-globals
            typeof document !== 'undefined' &&
                // eslint-disable-next-line no-restricted-globals
                !!document.documentElement &&
                // eslint-disable-next-line no-restricted-globals
                document.documentElement.getAttribute('dir') === 'rtl';
    }
    return _rtl;
}
// This has been split into 2 lines because it was working in Fabric due to the code being transpiled to es5, so this
// was converted to var while not working in Fluent that uses babel to transpile the code to be es6-like. Splitting the
// logic into two lines, however, allows it to work in both scenarios.
var _rtl;
_rtl = getRTL();
function getStyleOptions() {
    return {
        rtl: getRTL(),
    };
}
//# sourceMappingURL=StyleOptionsState.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/transforms/kebabRules.js
var rules = {};
function kebabRules(rulePairs, index) {
    var rule = rulePairs[index];
    if (rule.charAt(0) !== '-') {
        rulePairs[index] = rules[rule] = rules[rule] || rule.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
}
//# sourceMappingURL=kebabRules.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/getVendorSettings.js
var _vendorSettings;
function getVendorSettings() {
    var _a;
    if (!_vendorSettings) {
        // eslint-disable-next-line no-restricted-globals
        var doc = typeof document !== 'undefined' ? document : undefined;
        var nav = typeof navigator !== 'undefined' ? navigator : undefined;
        var userAgent = (_a = nav === null || nav === void 0 ? void 0 : nav.userAgent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!doc) {
            _vendorSettings = {
                isWebkit: true,
                isMoz: true,
                isOpera: true,
                isMs: true,
            };
        }
        else {
            _vendorSettings = {
                isWebkit: !!(doc && 'WebkitAppearance' in doc.documentElement.style),
                isMoz: !!(userAgent && userAgent.indexOf('firefox') > -1),
                isOpera: !!(userAgent && userAgent.indexOf('opera') > -1),
                isMs: !!(nav && (/rv:11.0/i.test(nav.userAgent) || /Edge\/\d./i.test(navigator.userAgent))),
            };
        }
    }
    return _vendorSettings;
}
/**
 * Sets the vendor settings for prefixing and vendor specific operations.
 */
function setVendorSettings(vendorSettings) {
    _vendorSettings = vendorSettings;
}
//# sourceMappingURL=getVendorSettings.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/transforms/prefixRules.js

var autoPrefixNames = {
    'user-select': 1,
};
function prefixRules(rulePairs, index) {
    var vendorSettings = getVendorSettings();
    var name = rulePairs[index];
    if (autoPrefixNames[name]) {
        var value = rulePairs[index + 1];
        if (autoPrefixNames[name]) {
            if (vendorSettings.isWebkit) {
                rulePairs.push('-webkit-' + name, value);
            }
            if (vendorSettings.isMoz) {
                rulePairs.push('-moz-' + name, value);
            }
            if (vendorSettings.isMs) {
                rulePairs.push('-ms-' + name, value);
            }
            if (vendorSettings.isOpera) {
                rulePairs.push('-o-' + name, value);
            }
        }
    }
}
//# sourceMappingURL=prefixRules.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/transforms/provideUnits.js
var NON_PIXEL_NUMBER_PROPS = [
    'column-count',
    'font-weight',
    'flex',
    'flex-grow',
    'flex-shrink',
    'fill-opacity',
    'opacity',
    'order',
    'z-index',
    'zoom',
];
function provideUnits(rulePairs, index) {
    var name = rulePairs[index];
    var value = rulePairs[index + 1];
    if (typeof value === 'number') {
        var isNonPixelProp = NON_PIXEL_NUMBER_PROPS.indexOf(name) > -1;
        var isVariableOrPrefixed = name.indexOf('--') > -1;
        var unit = isNonPixelProp || isVariableOrPrefixed ? '' : 'px';
        rulePairs[index + 1] = "".concat(value).concat(unit);
    }
}
//# sourceMappingURL=provideUnits.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/transforms/rtlifyRules.js
var _a;
var LEFT = 'left';
var RIGHT = 'right';
var NO_FLIP = '@noflip';
var NAME_REPLACEMENTS = (_a = {},
    _a[LEFT] = RIGHT,
    _a[RIGHT] = LEFT,
    _a);
var VALUE_REPLACEMENTS = {
    'w-resize': 'e-resize',
    'sw-resize': 'se-resize',
    'nw-resize': 'ne-resize',
};
/**
 * RTLifies the rulePair in the array at the current index. This mutates the array for performance
 * reasons.
 */
function rtlifyRules(options, rulePairs, index) {
    if (options.rtl) {
        var name_1 = rulePairs[index];
        if (!name_1) {
            return;
        }
        var value = rulePairs[index + 1];
        if (typeof value === 'string' && value.indexOf(NO_FLIP) >= 0) {
            rulePairs[index + 1] = value.replace(/\s*(?:\/\*\s*)?\@noflip\b(?:\s*\*\/)?\s*?/g, '');
        }
        else if (name_1.indexOf(LEFT) >= 0) {
            rulePairs[index] = name_1.replace(LEFT, RIGHT);
        }
        else if (name_1.indexOf(RIGHT) >= 0) {
            rulePairs[index] = name_1.replace(RIGHT, LEFT);
        }
        else if (String(value).indexOf(LEFT) >= 0) {
            rulePairs[index + 1] = value.replace(LEFT, RIGHT);
        }
        else if (String(value).indexOf(RIGHT) >= 0) {
            rulePairs[index + 1] = value.replace(RIGHT, LEFT);
        }
        else if (NAME_REPLACEMENTS[name_1]) {
            rulePairs[index] = NAME_REPLACEMENTS[name_1];
        }
        else if (VALUE_REPLACEMENTS[value]) {
            rulePairs[index + 1] = VALUE_REPLACEMENTS[value];
        }
        else {
            switch (name_1) {
                case 'margin':
                case 'padding':
                    rulePairs[index + 1] = flipQuad(value);
                    break;
                case 'box-shadow':
                    rulePairs[index + 1] = negateNum(value, 0);
                    break;
            }
        }
    }
}
/**
 * Given a string value in a space delimited format (e.g. "1 2 3 4"), negates a particular value.
 */
function negateNum(value, partIndex) {
    var parts = value.split(' ');
    var numberVal = parseInt(parts[partIndex], 10);
    parts[0] = parts[0].replace(String(numberVal), String(numberVal * -1));
    return parts.join(' ');
}
/**
 * Given a string quad, flips the left and right values.
 */
function flipQuad(value) {
    if (typeof value === 'string') {
        var parts = value.split(' ');
        if (parts.length === 4) {
            return "".concat(parts[0], " ").concat(parts[3], " ").concat(parts[2], " ").concat(parts[1]);
        }
    }
    return value;
}
//# sourceMappingURL=rtlifyRules.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/styleToClassName.js







var DISPLAY_NAME = 'displayName';
function getDisplayName(rules) {
    var rootStyle = rules && rules['&'];
    return rootStyle ? rootStyle.displayName : undefined;
}
var globalSelectorRegExp = /\:global\((.+?)\)/g;
/**
 * Finds comma separated selectors in a :global() e.g. ":global(.class1, .class2, .class3)"
 * and wraps them each in their own global ":global(.class1), :global(.class2), :global(.class3)"
 *
 * @param selectorWithGlobals The selector to process
 * @returns The updated selector
 */
function expandCommaSeparatedGlobals(selectorWithGlobals) {
    // We the selector does not have a :global() we can shortcut
    if (!globalSelectorRegExp.test(selectorWithGlobals)) {
        return selectorWithGlobals;
    }
    var replacementInfo = [];
    var findGlobal = /\:global\((.+?)\)/g;
    var match = null;
    // Create a result list for global selectors so we can replace them.
    while ((match = findGlobal.exec(selectorWithGlobals))) {
        // Only if the found selector is a comma separated list we'll process it.
        if (match[1].indexOf(',') > -1) {
            replacementInfo.push([
                match.index,
                match.index + match[0].length,
                // Wrap each of the found selectors in :global()
                match[1]
                    .split(',')
                    .map(function (v) { return ":global(".concat(v.trim(), ")"); })
                    .join(', '),
            ]);
        }
    }
    // Replace the found selectors with their wrapped variants in reverse order
    return replacementInfo
        .reverse()
        .reduce(function (selector, _a) {
        var matchIndex = _a[0], matchEndIndex = _a[1], replacement = _a[2];
        var prefix = selector.slice(0, matchIndex);
        var suffix = selector.slice(matchEndIndex);
        return prefix + replacement + suffix;
    }, selectorWithGlobals);
}
function expandSelector(newSelector, currentSelector) {
    if (newSelector.indexOf(':global(') >= 0) {
        return newSelector.replace(globalSelectorRegExp, '$1');
    }
    else if (newSelector.indexOf(':') === 0) {
        return currentSelector + newSelector;
    }
    else if (newSelector.indexOf('&') < 0) {
        return currentSelector + ' ' + newSelector;
    }
    return newSelector;
}
function extractSelector(currentSelector, rules, selector, value) {
    if (rules === void 0) { rules = { __order: [] }; }
    if (selector.indexOf('@') === 0) {
        selector = selector + '{' + currentSelector;
        extractRules([value], rules, selector);
    }
    else if (selector.indexOf(',') > -1) {
        expandCommaSeparatedGlobals(selector)
            .split(',')
            .map(function (s) { return s.trim(); })
            .forEach(function (separatedSelector) {
            return extractRules([value], rules, expandSelector(separatedSelector, currentSelector));
        });
    }
    else {
        extractRules([value], rules, expandSelector(selector, currentSelector));
    }
}
function extractRules(args, rules, currentSelector) {
    if (rules === void 0) { rules = { __order: [] }; }
    if (currentSelector === void 0) { currentSelector = '&'; }
    var stylesheet = Stylesheet.getInstance();
    var currentRules = rules[currentSelector];
    if (!currentRules) {
        currentRules = {};
        rules[currentSelector] = currentRules;
        rules.__order.push(currentSelector);
    }
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        // If the arg is a string, we need to look up the class map and merge.
        if (typeof arg === 'string') {
            var expandedRules = stylesheet.argsFromClassName(arg);
            if (expandedRules) {
                extractRules(expandedRules, rules, currentSelector);
            }
            // Else if the arg is an array, we need to recurse in.
        }
        else if (Array.isArray(arg)) {
            extractRules(arg, rules, currentSelector);
        }
        else {
            for (var prop in arg) {
                if (arg.hasOwnProperty(prop)) {
                    var propValue = arg[prop];
                    if (prop === 'selectors') {
                        // every child is a selector.
                        var selectors = arg.selectors;
                        for (var newSelector in selectors) {
                            if (selectors.hasOwnProperty(newSelector)) {
                                extractSelector(currentSelector, rules, newSelector, selectors[newSelector]);
                            }
                        }
                    }
                    else if (typeof propValue === 'object') {
                        // prop is a selector.
                        if (propValue !== null) {
                            extractSelector(currentSelector, rules, prop, propValue);
                        }
                    }
                    else {
                        if (propValue !== undefined) {
                            // Else, add the rule to the currentSelector.
                            if (prop === 'margin' || prop === 'padding') {
                                expandQuads(currentRules, prop, propValue);
                            }
                            else {
                                currentRules[prop] = propValue;
                            }
                        }
                    }
                }
            }
        }
    }
    return rules;
}
function expandQuads(currentRules, name, value) {
    var parts = typeof value === 'string' ? tokenizeWithParentheses(value) : [value];
    if (parts.length === 0) {
        parts.push(value);
    }
    if (parts[parts.length - 1] === '!important') {
        // Remove !important from parts, and append it to each part individually
        parts = parts.slice(0, -1).map(function (p) { return p + ' !important'; });
    }
    currentRules[name + 'Top'] = parts[0];
    currentRules[name + 'Right'] = parts[1] || parts[0];
    currentRules[name + 'Bottom'] = parts[2] || parts[0];
    currentRules[name + 'Left'] = parts[3] || parts[1] || parts[0];
}
function getKeyForRules(options, rules) {
    var serialized = [options.rtl ? 'rtl' : 'ltr'];
    var hasProps = false;
    for (var _i = 0, _a = rules.__order; _i < _a.length; _i++) {
        var selector = _a[_i];
        serialized.push(selector);
        var rulesForSelector = rules[selector];
        for (var propName in rulesForSelector) {
            if (rulesForSelector.hasOwnProperty(propName) && rulesForSelector[propName] !== undefined) {
                hasProps = true;
                serialized.push(propName, rulesForSelector[propName]);
            }
        }
    }
    return hasProps ? serialized.join('') : undefined;
}
function repeatString(target, count) {
    if (count <= 0) {
        return '';
    }
    if (count === 1) {
        return target;
    }
    return target + repeatString(target, count - 1);
}
function serializeRuleEntries(options, ruleEntries) {
    if (!ruleEntries) {
        return '';
    }
    var allEntries = [];
    for (var entry in ruleEntries) {
        if (ruleEntries.hasOwnProperty(entry) && entry !== DISPLAY_NAME && ruleEntries[entry] !== undefined) {
            allEntries.push(entry, ruleEntries[entry]);
        }
    }
    // Apply transforms.
    for (var i = 0; i < allEntries.length; i += 2) {
        kebabRules(allEntries, i);
        provideUnits(allEntries, i);
        rtlifyRules(options, allEntries, i);
        prefixRules(allEntries, i);
    }
    // Apply punctuation.
    for (var i = 1; i < allEntries.length; i += 4) {
        allEntries.splice(i, 1, ':', allEntries[i], ';');
    }
    return allEntries.join('');
}
function styleToRegistration(options) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var rules = extractRules(args);
    var key = getKeyForRules(options, rules);
    if (key) {
        var stylesheet = Stylesheet.getInstance();
        var registration = {
            className: stylesheet.classNameFromKey(key),
            key: key,
            args: args,
        };
        if (!registration.className) {
            registration.className = stylesheet.getClassName(getDisplayName(rules));
            var rulesToInsert = [];
            for (var _a = 0, _b = rules.__order; _a < _b.length; _a++) {
                var selector = _b[_a];
                rulesToInsert.push(selector, serializeRuleEntries(options, rules[selector]));
            }
            registration.rulesToInsert = rulesToInsert;
        }
        return registration;
    }
    return undefined;
}
/**
 * Insert style to stylesheet.
 * @param registration Style registration.
 * @param specificityMultiplier Number of times classname selector is repeated in the css rule.
 * This is to increase css specificity in case it's needed. Default to 1.
 */
function applyRegistration(registration, specificityMultiplier) {
    if (specificityMultiplier === void 0) { specificityMultiplier = 1; }
    var stylesheet = Stylesheet.getInstance();
    var className = registration.className, key = registration.key, args = registration.args, rulesToInsert = registration.rulesToInsert;
    if (rulesToInsert) {
        // rulesToInsert is an ordered array of selector/rule pairs.
        for (var i = 0; i < rulesToInsert.length; i += 2) {
            var rules = rulesToInsert[i + 1];
            if (rules) {
                var selector = rulesToInsert[i];
                selector = selector.replace(/&/g, repeatString(".".concat(registration.className), specificityMultiplier));
                // Insert. Note if a media query, we must close the query with a final bracket.
                var processedRule = "".concat(selector, "{").concat(rules, "}").concat(selector.indexOf('@') === 0 ? '}' : '');
                stylesheet.insertRule(processedRule);
            }
        }
        stylesheet.cacheClassName(className, key, args, rulesToInsert);
    }
}
function styleToClassName(options) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var registration = styleToRegistration.apply(void 0, __spreadArray([options], args, false));
    if (registration) {
        applyRegistration(registration, options.specificityMultiplier);
        return registration.className;
    }
    return '';
}
//# sourceMappingURL=styleToClassName.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/merge-styles/lib/fontFace.js



/**
 * Registers a font face.
 * @public
 */
function fontFace_fontFace(font) {
    var stylesheet = Stylesheet_Stylesheet.getInstance();
    var rule = serializeRuleEntries(getStyleOptions(), font);
    var className = stylesheet.classNameFromKey(rule);
    if (className) {
        return;
    }
    var name = stylesheet.getClassName();
    stylesheet.insertRule("@font-face{".concat(rule, "}"), true);
    stylesheet.cacheClassName(name, rule, [], ['font-face', rule]);
}
//# sourceMappingURL=fontFace.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/fonts/FluentFonts.js
// Font face names to be registered.
var LocalizedFontNames;
(function (LocalizedFontNames) {
    LocalizedFontNames.Arabic = 'Segoe UI Web (Arabic)';
    LocalizedFontNames.Cyrillic = 'Segoe UI Web (Cyrillic)';
    LocalizedFontNames.EastEuropean = 'Segoe UI Web (East European)';
    LocalizedFontNames.Greek = 'Segoe UI Web (Greek)';
    LocalizedFontNames.Hebrew = 'Segoe UI Web (Hebrew)';
    LocalizedFontNames.Thai = 'Leelawadee UI Web';
    LocalizedFontNames.Vietnamese = 'Segoe UI Web (Vietnamese)';
    LocalizedFontNames.WestEuropean = 'Segoe UI Web (West European)';
    LocalizedFontNames.Selawik = 'Selawik Web';
    LocalizedFontNames.Armenian = 'Segoe UI Web (Armenian)';
    LocalizedFontNames.Georgian = 'Segoe UI Web (Georgian)';
})(LocalizedFontNames || (LocalizedFontNames = {}));
// Font families with fallbacks, for the general regions.
var LocalizedFontFamilies;
(function (LocalizedFontFamilies) {
    LocalizedFontFamilies.Arabic = "'".concat(LocalizedFontNames.Arabic, "'");
    LocalizedFontFamilies.ChineseSimplified = "'Microsoft Yahei UI', Verdana, Simsun";
    LocalizedFontFamilies.ChineseTraditional = "'Microsoft Jhenghei UI', Pmingliu";
    LocalizedFontFamilies.Cyrillic = "'".concat(LocalizedFontNames.Cyrillic, "'");
    LocalizedFontFamilies.EastEuropean = "'".concat(LocalizedFontNames.EastEuropean, "'");
    LocalizedFontFamilies.Greek = "'".concat(LocalizedFontNames.Greek, "'");
    LocalizedFontFamilies.Hebrew = "'".concat(LocalizedFontNames.Hebrew, "'");
    LocalizedFontFamilies.Hindi = "'Nirmala UI'";
    LocalizedFontFamilies.Japanese = "'Yu Gothic UI', 'Meiryo UI', Meiryo, 'MS Pgothic', Osaka";
    LocalizedFontFamilies.Korean = "'Malgun Gothic', Gulim";
    LocalizedFontFamilies.Selawik = "'".concat(LocalizedFontNames.Selawik, "'");
    LocalizedFontFamilies.Thai = "'Leelawadee UI Web', 'Kmer UI'";
    LocalizedFontFamilies.Vietnamese = "'".concat(LocalizedFontNames.Vietnamese, "'");
    LocalizedFontFamilies.WestEuropean = "'".concat(LocalizedFontNames.WestEuropean, "'");
    LocalizedFontFamilies.Armenian = "'".concat(LocalizedFontNames.Armenian, "'");
    LocalizedFontFamilies.Georgian = "'".concat(LocalizedFontNames.Georgian, "'");
})(LocalizedFontFamilies || (LocalizedFontFamilies = {}));
// Standard font sizes.
var FontSizes;
(function (FontSizes) {
    FontSizes.size10 = '10px';
    FontSizes.size12 = '12px';
    FontSizes.size14 = '14px';
    FontSizes.size16 = '16px';
    FontSizes.size18 = '18px';
    FontSizes.size20 = '20px';
    FontSizes.size24 = '24px';
    FontSizes.size28 = '28px';
    FontSizes.size32 = '32px';
    FontSizes.size42 = '42px';
    FontSizes.size68 = '68px';
    FontSizes.mini = '10px';
    FontSizes.xSmall = '10px';
    FontSizes.small = '12px';
    FontSizes.smallPlus = '12px';
    FontSizes.medium = '14px';
    FontSizes.mediumPlus = '16px';
    FontSizes.icon = '16px';
    FontSizes.large = '18px';
    FontSizes.xLarge = '20px';
    FontSizes.xLargePlus = '24px';
    FontSizes.xxLarge = '28px';
    FontSizes.xxLargePlus = '32px';
    FontSizes.superLarge = '42px';
    FontSizes.mega = '68px';
})(FontSizes || (FontSizes = {}));
// Standard font weights.
var FontWeights;
(function (FontWeights) {
    FontWeights.light = 100;
    FontWeights.semilight = 300;
    FontWeights.regular = 400;
    FontWeights.semibold = 600;
    FontWeights.bold = 700;
})(FontWeights || (FontWeights = {}));
// Standard Icon Sizes.
var IconFontSizes;
(function (IconFontSizes) {
    IconFontSizes.xSmall = '10px';
    IconFontSizes.small = '12px';
    IconFontSizes.medium = '16px';
    IconFontSizes.large = '20px';
})(IconFontSizes || (IconFontSizes = {}));
//# sourceMappingURL=FluentFonts.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/fonts/createFontStyles.js

// Fallback fonts, if specified system or web fonts are unavailable.
var FontFamilyFallbacks = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif";
// By default, we favor system fonts for the default.
// All localized fonts use a web font and never use the system font.
var defaultFontFamily = "'Segoe UI', '".concat(LocalizedFontNames.WestEuropean, "'");
// Mapping of language prefix to to font family.
var LanguageToFontMap = {
    ar: LocalizedFontFamilies.Arabic,
    bg: LocalizedFontFamilies.Cyrillic,
    cs: LocalizedFontFamilies.EastEuropean,
    el: LocalizedFontFamilies.Greek,
    et: LocalizedFontFamilies.EastEuropean,
    he: LocalizedFontFamilies.Hebrew,
    hi: LocalizedFontFamilies.Hindi,
    hr: LocalizedFontFamilies.EastEuropean,
    hu: LocalizedFontFamilies.EastEuropean,
    ja: LocalizedFontFamilies.Japanese,
    kk: LocalizedFontFamilies.EastEuropean,
    ko: LocalizedFontFamilies.Korean,
    lt: LocalizedFontFamilies.EastEuropean,
    lv: LocalizedFontFamilies.EastEuropean,
    pl: LocalizedFontFamilies.EastEuropean,
    ru: LocalizedFontFamilies.Cyrillic,
    sk: LocalizedFontFamilies.EastEuropean,
    'sr-latn': LocalizedFontFamilies.EastEuropean,
    th: LocalizedFontFamilies.Thai,
    tr: LocalizedFontFamilies.EastEuropean,
    uk: LocalizedFontFamilies.Cyrillic,
    vi: LocalizedFontFamilies.Vietnamese,
    'zh-hans': LocalizedFontFamilies.ChineseSimplified,
    'zh-hant': LocalizedFontFamilies.ChineseTraditional,
    hy: LocalizedFontFamilies.Armenian,
    ka: LocalizedFontFamilies.Georgian,
};
function _fontFamilyWithFallbacks(fontFamily) {
    return "".concat(fontFamily, ", ").concat(FontFamilyFallbacks);
}
/**
 * If there is a localized font for this language, return that.
 * Returns undefined if there is no localized font for that language.
 */
function _getLocalizedFontFamily(language) {
    for (var lang in LanguageToFontMap) {
        if (LanguageToFontMap.hasOwnProperty(lang) && language && lang.indexOf(language) === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return LanguageToFontMap[lang];
        }
    }
    return defaultFontFamily;
}
function _createFont(size, weight, fontFamily) {
    return {
        fontFamily: fontFamily,
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        fontSize: size,
        fontWeight: weight,
    };
}
function createFontStyles(localeCode) {
    var localizedFont = _getLocalizedFontFamily(localeCode);
    var fontFamilyWithFallback = _fontFamilyWithFallbacks(localizedFont);
    var fontStyles = {
        tiny: _createFont(FontSizes.mini, FontWeights.regular, fontFamilyWithFallback),
        xSmall: _createFont(FontSizes.xSmall, FontWeights.regular, fontFamilyWithFallback),
        small: _createFont(FontSizes.small, FontWeights.regular, fontFamilyWithFallback),
        smallPlus: _createFont(FontSizes.smallPlus, FontWeights.regular, fontFamilyWithFallback),
        medium: _createFont(FontSizes.medium, FontWeights.regular, fontFamilyWithFallback),
        mediumPlus: _createFont(FontSizes.mediumPlus, FontWeights.regular, fontFamilyWithFallback),
        large: _createFont(FontSizes.large, FontWeights.regular, fontFamilyWithFallback),
        xLarge: _createFont(FontSizes.xLarge, FontWeights.semibold, fontFamilyWithFallback),
        xLargePlus: _createFont(FontSizes.xLargePlus, FontWeights.semibold, fontFamilyWithFallback),
        xxLarge: _createFont(FontSizes.xxLarge, FontWeights.semibold, fontFamilyWithFallback),
        xxLargePlus: _createFont(FontSizes.xxLargePlus, FontWeights.semibold, fontFamilyWithFallback),
        superLarge: _createFont(FontSizes.superLarge, FontWeights.semibold, fontFamilyWithFallback),
        mega: _createFont(FontSizes.mega, FontWeights.semibold, fontFamilyWithFallback),
    };
    return fontStyles;
}
//# sourceMappingURL=createFontStyles.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/dom/getDocument.js

/**
 * Helper to get the document object. Note that in popup window cases, document
 * might be the wrong document, which is why we look at ownerDocument for the
 * truth.
 *
 * @public
 */
function getDocument_getDocument(rootElement) {
    // eslint-disable-next-line no-restricted-globals
    if (!canUseDOM() || typeof document === 'undefined') {
        return undefined;
    }
    else {
        var el = rootElement;
        // eslint-disable-next-line no-restricted-globals
        return el && el.ownerDocument ? el.ownerDocument : document;
    }
}
//# sourceMappingURL=getDocument.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/localStorage.js

/**
 * Fetches an item from local storage without throwing an exception
 * @param key The key of the item to fetch from local storage
 */
function getItem(key) {
    var result = null;
    try {
        var win = getWindow_getWindow();
        result = win ? win.localStorage.getItem(key) : null;
    }
    catch (e) {
        /* Eat the exception */
    }
    return result;
}
/**
 * Inserts an item into local storage without throwing an exception
 * @param key The key of the item to add to local storage
 * @param data The data to put into local storage
 */
function setItem(key, data) {
    try {
        var win = getWindow();
        win && win.localStorage.setItem(key, data);
    }
    catch (e) {
        /* Eat the exception */
    }
}
//# sourceMappingURL=localStorage.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/sessionStorage.js

/**
 * Fetches an item from session storage without throwing an exception
 * @param key The key of the item to fetch from session storage
 */
function sessionStorage_getItem(key) {
    var result = null;
    try {
        var win = getWindow_getWindow();
        result = win ? win.sessionStorage.getItem(key) : null;
    }
    catch (e) {
        /* Eat the exception */
    }
    return result;
}
/**
 * Inserts an item into session storage without throwing an exception
 * @param key The key of the item to add to session storage
 * @param data The data to put into session storage
 */
function sessionStorage_setItem(key, data) {
    var _a;
    try {
        (_a = getWindow()) === null || _a === void 0 ? void 0 : _a.sessionStorage.setItem(key, data);
    }
    catch (e) {
        /* Eat the exception */
    }
}
//# sourceMappingURL=sessionStorage.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/language.js



// Default to undefined so that we initialize on first read.
var _language;
var STORAGE_KEY = 'language';
/**
 * Gets the language set for the page.
 * @param persistenceType - Where to persist the value. Default is `sessionStorage` if available.
 */
function getLanguage(persistenceType) {
    if (persistenceType === void 0) { persistenceType = 'sessionStorage'; }
    if (_language === undefined) {
        var doc = getDocument_getDocument();
        var savedLanguage = persistenceType === 'localStorage'
            ? getItem(STORAGE_KEY)
            : persistenceType === 'sessionStorage'
                ? sessionStorage_getItem(STORAGE_KEY)
                : undefined;
        if (savedLanguage) {
            _language = savedLanguage;
        }
        if (_language === undefined && doc) {
            _language = doc.documentElement.getAttribute('lang');
        }
        if (_language === undefined) {
            _language = 'en';
        }
    }
    return _language;
}
function setLanguage(language, persistenceParam) {
    var doc = getDocument();
    if (doc) {
        doc.documentElement.setAttribute('lang', language);
    }
    var persistenceType = persistenceParam === true ? 'none' : !persistenceParam ? 'sessionStorage' : persistenceParam;
    if (persistenceType === 'localStorage') {
        localStorage.setItem(STORAGE_KEY, language);
    }
    else if (persistenceType === 'sessionStorage') {
        sessionStorage.setItem(STORAGE_KEY, language);
    }
    _language = language;
}
//# sourceMappingURL=language.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/fonts/DefaultFontStyles.js




// Default urls.
var DefaultBaseUrl = 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets';
// Standard font styling.
var DefaultFontStyles = createFontStyles(getLanguage());
function _registerFontFace(fontFamily, url, fontWeight, localFontName) {
    fontFamily = "'".concat(fontFamily, "'");
    var localFontSrc = localFontName !== undefined ? "local('".concat(localFontName, "'),") : '';
    fontFace_fontFace({
        fontFamily: fontFamily,
        src: localFontSrc + "url('".concat(url, ".woff2') format('woff2'),") + "url('".concat(url, ".woff') format('woff')"),
        fontWeight: fontWeight,
        fontStyle: 'normal',
        fontDisplay: 'swap',
    });
}
function _registerFontFaceSet(baseUrl, fontFamily, cdnFolder, cdnFontName, localFontName) {
    if (cdnFontName === void 0) { cdnFontName = 'segoeui'; }
    var urlBase = "".concat(baseUrl, "/").concat(cdnFolder, "/").concat(cdnFontName);
    _registerFontFace(fontFamily, urlBase + '-light', FontWeights.light, localFontName && localFontName + ' Light');
    _registerFontFace(fontFamily, urlBase + '-semilight', FontWeights.semilight, localFontName && localFontName + ' SemiLight');
    _registerFontFace(fontFamily, urlBase + '-regular', FontWeights.regular, localFontName);
    _registerFontFace(fontFamily, urlBase + '-semibold', FontWeights.semibold, localFontName && localFontName + ' SemiBold');
    _registerFontFace(fontFamily, urlBase + '-bold', FontWeights.bold, localFontName && localFontName + ' Bold');
}
function registerDefaultFontFaces(baseUrl) {
    if (baseUrl) {
        var fontUrl = "".concat(baseUrl, "/fonts");
        // Produce @font-face definitions for all supported web fonts.
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Thai, 'leelawadeeui-thai', 'leelawadeeui');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Arabic, 'segoeui-arabic');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Cyrillic, 'segoeui-cyrillic');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.EastEuropean, 'segoeui-easteuropean');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Greek, 'segoeui-greek');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Hebrew, 'segoeui-hebrew');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Vietnamese, 'segoeui-vietnamese');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.WestEuropean, 'segoeui-westeuropean', 'segoeui', 'Segoe UI');
        _registerFontFaceSet(fontUrl, LocalizedFontFamilies.Selawik, 'selawik', 'selawik');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Armenian, 'segoeui-armenian');
        _registerFontFaceSet(fontUrl, LocalizedFontNames.Georgian, 'segoeui-georgian');
        // Leelawadee UI (Thai) does not have a 'light' weight, so we override
        // the font-face generated above to use the 'semilight' weight instead.
        _registerFontFace('Leelawadee UI Web', "".concat(fontUrl, "/leelawadeeui-thai/leelawadeeui-semilight"), FontWeights.light);
        // Leelawadee UI (Thai) does not have a 'semibold' weight, so we override
        // the font-face generated above to use the 'bold' weight instead.
        _registerFontFace('Leelawadee UI Web', "".concat(fontUrl, "/leelawadeeui-thai/leelawadeeui-bold"), FontWeights.semibold);
    }
}
/**
 * Reads the fontBaseUrl from window.FabricConfig.fontBaseUrl or falls back to a default.
 */
function _getFontBaseUrl() {
    var _a, _b;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var fabricConfig = (_a = getWindow_getWindow()) === null || _a === void 0 ? void 0 : _a.FabricConfig;
    return (_b = fabricConfig === null || fabricConfig === void 0 ? void 0 : fabricConfig.fontBaseUrl) !== null && _b !== void 0 ? _b : DefaultBaseUrl;
}
/**
 * Register the font faces.
 */
registerDefaultFontFaces(_getFontBaseUrl());
//# sourceMappingURL=DefaultFontStyles.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/utilities/lib/merge.js
/**
 * Simple deep merge function. Takes all arguments and returns a deep copy of the objects merged
 * together in the order provided. If an object creates a circular reference, it will assign the
 * original reference.
 */
function merge(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var arg = args_1[_a];
        _merge(target || {}, arg);
    }
    return target;
}
/**
 * The _merge helper iterates through all props on source and assigns them to target.
 * When the value is an object, we will create a deep clone of the object. However if
 * there is a circular reference, the value will not be deep cloned and will persist
 * the reference.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _merge(target, source, circularReferences) {
    if (circularReferences === void 0) { circularReferences = []; }
    circularReferences.push(source);
    for (var name_1 in source) {
        if (source.hasOwnProperty(name_1)) {
            if (name_1 !== '__proto__' && name_1 !== 'constructor' && name_1 !== 'prototype') {
                var value = source[name_1];
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    var isCircularReference = circularReferences.indexOf(value) > -1;
                    target[name_1] = (isCircularReference ? value : _merge(target[name_1] || {}, value, circularReferences));
                }
                else {
                    target[name_1] = value;
                }
            }
        }
    }
    circularReferences.pop();
    return target;
}
//# sourceMappingURL=merge.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/utilities/makeSemanticColors.js

/** Generates all the semantic slot colors based on the theme so far
 * We'll use these as fallbacks for semantic slots that the passed in theme did not define.
 * The caller must still mix in the customized semantic slots at the end.
 */
function makeSemanticColors(p, e, s, isInverted, depComments) {
    if (depComments === void 0) { depComments = false; }
    var semanticColors = (0,tslib_es6/* __assign */.Cl)({ primaryButtonBorder: 'transparent', errorText: !isInverted ? '#a4262c' : '#F1707B', messageText: !isInverted ? '#323130' : '#F3F2F1', messageLink: !isInverted ? '#005A9E' : '#6CB8F6', messageLinkHovered: !isInverted ? '#004578' : '#82C7FF', infoIcon: !isInverted ? '#605e5c' : '#C8C6C4', errorIcon: !isInverted ? '#A80000' : '#F1707B', blockingIcon: !isInverted ? '#FDE7E9' : '#442726', warningIcon: !isInverted ? '#797775' : '#C8C6C4', severeWarningIcon: !isInverted ? '#D83B01' : '#FCE100', successIcon: !isInverted ? '#107C10' : '#92C353', infoBackground: !isInverted ? '#f3f2f1' : '#323130', errorBackground: !isInverted ? '#FDE7E9' : '#442726', blockingBackground: !isInverted ? '#FDE7E9' : '#442726', warningBackground: !isInverted ? '#FFF4CE' : '#433519', severeWarningBackground: !isInverted ? '#FED9CC' : '#4F2A0F', successBackground: !isInverted ? '#DFF6DD' : '#393D1B', 
        // deprecated
        warningHighlight: !isInverted ? '#ffb900' : '#fff100', successText: !isInverted ? '#107C10' : '#92c353' }, s);
    var fullSemanticColors = getSemanticColors(p, e, semanticColors, isInverted);
    return _fixDeprecatedSlots(fullSemanticColors, depComments);
}
/**
 * Map partial platte and effects to partial semantic colors.
 */
function getSemanticColors(p, e, s, isInverted, depComments) {
    if (depComments === void 0) { depComments = false; }
    var result = {};
    // map palette
    var _a = p || {}, white = _a.white, black = _a.black, themePrimary = _a.themePrimary, themeDark = _a.themeDark, themeDarker = _a.themeDarker, themeDarkAlt = _a.themeDarkAlt, themeLighter = _a.themeLighter, neutralLight = _a.neutralLight, neutralLighter = _a.neutralLighter, neutralDark = _a.neutralDark, neutralQuaternary = _a.neutralQuaternary, neutralQuaternaryAlt = _a.neutralQuaternaryAlt, neutralPrimary = _a.neutralPrimary, neutralSecondary = _a.neutralSecondary, neutralSecondaryAlt = _a.neutralSecondaryAlt, neutralTertiary = _a.neutralTertiary, neutralTertiaryAlt = _a.neutralTertiaryAlt, neutralLighterAlt = _a.neutralLighterAlt, accent = _a.accent;
    if (white) {
        result.bodyBackground = white;
        result.bodyFrameBackground = white;
        result.accentButtonText = white;
        result.buttonBackground = white;
        result.primaryButtonText = white;
        result.primaryButtonTextHovered = white;
        result.primaryButtonTextPressed = white;
        result.inputBackground = white;
        result.inputForegroundChecked = white;
        result.listBackground = white;
        result.menuBackground = white;
        result.cardStandoutBackground = white;
    }
    if (black) {
        result.bodyTextChecked = black;
        result.buttonTextCheckedHovered = black;
    }
    if (themePrimary) {
        result.link = themePrimary;
        result.primaryButtonBackground = themePrimary;
        result.inputBackgroundChecked = themePrimary;
        result.inputIcon = themePrimary;
        result.inputFocusBorderAlt = themePrimary;
        result.menuIcon = themePrimary;
        result.menuHeader = themePrimary;
        result.accentButtonBackground = themePrimary;
    }
    if (themeDark) {
        result.primaryButtonBackgroundPressed = themeDark;
        result.inputBackgroundCheckedHovered = themeDark;
        result.inputIconHovered = themeDark;
    }
    if (themeDarker) {
        result.linkHovered = themeDarker;
    }
    if (themeDarkAlt) {
        result.primaryButtonBackgroundHovered = themeDarkAlt;
    }
    if (themeLighter) {
        result.inputPlaceholderBackgroundChecked = themeLighter;
    }
    if (neutralLight) {
        result.bodyBackgroundChecked = neutralLight;
        result.bodyFrameDivider = neutralLight;
        result.bodyDivider = neutralLight;
        result.variantBorder = neutralLight;
        result.buttonBackgroundCheckedHovered = neutralLight;
        result.buttonBackgroundPressed = neutralLight;
        result.listItemBackgroundChecked = neutralLight;
        result.listHeaderBackgroundPressed = neutralLight;
        result.menuItemBackgroundPressed = neutralLight;
        // eslint-disable-next-line deprecation/deprecation
        result.menuItemBackgroundChecked = neutralLight;
    }
    if (neutralLighter) {
        result.bodyBackgroundHovered = neutralLighter;
        result.buttonBackgroundHovered = neutralLighter;
        result.buttonBackgroundDisabled = neutralLighter;
        result.buttonBorderDisabled = neutralLighter;
        result.primaryButtonBackgroundDisabled = neutralLighter;
        result.disabledBackground = neutralLighter;
        result.listItemBackgroundHovered = neutralLighter;
        result.listHeaderBackgroundHovered = neutralLighter;
        result.menuItemBackgroundHovered = neutralLighter;
    }
    if (neutralQuaternary) {
        result.primaryButtonTextDisabled = neutralQuaternary;
        result.disabledSubtext = neutralQuaternary;
    }
    if (neutralQuaternaryAlt) {
        result.listItemBackgroundCheckedHovered = neutralQuaternaryAlt;
    }
    if (neutralTertiary) {
        result.disabledBodyText = neutralTertiary;
        result.variantBorderHovered = (s === null || s === void 0 ? void 0 : s.variantBorderHovered) || neutralTertiary;
        result.buttonTextDisabled = neutralTertiary;
        result.inputIconDisabled = neutralTertiary;
        result.disabledText = neutralTertiary;
    }
    if (neutralPrimary) {
        result.bodyText = neutralPrimary;
        result.actionLink = neutralPrimary;
        result.buttonText = neutralPrimary;
        result.inputBorderHovered = neutralPrimary;
        result.inputText = neutralPrimary;
        result.listText = neutralPrimary;
        result.menuItemText = neutralPrimary;
    }
    if (neutralLighterAlt) {
        result.bodyStandoutBackground = neutralLighterAlt;
        result.defaultStateBackground = neutralLighterAlt;
    }
    if (neutralDark) {
        result.actionLinkHovered = neutralDark;
        result.buttonTextHovered = neutralDark;
        result.buttonTextChecked = neutralDark;
        result.buttonTextPressed = neutralDark;
        result.inputTextHovered = neutralDark;
        result.menuItemTextHovered = neutralDark;
    }
    if (neutralSecondary) {
        result.bodySubtext = neutralSecondary;
        result.focusBorder = neutralSecondary;
        result.inputBorder = neutralSecondary;
        result.smallInputBorder = neutralSecondary;
        result.inputPlaceholderText = neutralSecondary;
    }
    if (neutralSecondaryAlt) {
        result.buttonBorder = neutralSecondaryAlt;
    }
    if (neutralTertiaryAlt) {
        result.disabledBodySubtext = neutralTertiaryAlt;
        result.disabledBorder = neutralTertiaryAlt;
        result.buttonBackgroundChecked = neutralTertiaryAlt;
        result.menuDivider = neutralTertiaryAlt;
    }
    if (accent) {
        result.accentButtonBackground = accent;
    }
    // map effects
    if (e === null || e === void 0 ? void 0 : e.elevation4) {
        result.cardShadow = e.elevation4;
    }
    if (!isInverted && (e === null || e === void 0 ? void 0 : e.elevation8)) {
        result.cardShadowHovered = e.elevation8;
    }
    else if (result.variantBorderHovered) {
        result.cardShadowHovered = '0 0 1px ' + result.variantBorderHovered;
    }
    result = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, result), s);
    return result;
}
function _fixDeprecatedSlots(s, depComments) {
    // Add @deprecated tag as comment if enabled
    var dep = '';
    if (depComments === true) {
        dep = ' /* @deprecated */';
    }
    /* eslint-disable deprecation/deprecation */
    s.listTextColor = s.listText + dep;
    s.menuItemBackgroundChecked += dep;
    s.warningHighlight += dep;
    s.warningText = s.messageText + dep;
    s.successText += dep;
    /* eslint-enable deprecation/deprecation */
    return s;
}
//# sourceMappingURL=makeSemanticColors.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/mergeThemes.js


/**
 * Merge a partial/full theme into a full theme and returns a merged full theme.
 */
function mergeThemes(theme, partialTheme) {
    var _a, _b, _c;
    if (partialTheme === void 0) { partialTheme = {}; }
    var mergedTheme = merge({}, theme, partialTheme, {
        semanticColors: getSemanticColors(partialTheme.palette, partialTheme.effects, partialTheme.semanticColors, partialTheme.isInverted === undefined ? theme.isInverted : partialTheme.isInverted),
    });
    if (((_a = partialTheme.palette) === null || _a === void 0 ? void 0 : _a.themePrimary) && !((_b = partialTheme.palette) === null || _b === void 0 ? void 0 : _b.accent)) {
        mergedTheme.palette.accent = partialTheme.palette.themePrimary;
    }
    if (partialTheme.defaultFontStyle) {
        for (var _i = 0, _d = Object.keys(mergedTheme.fonts); _i < _d.length; _i++) {
            var fontStyle = _d[_i];
            mergedTheme.fonts[fontStyle] = merge(mergedTheme.fonts[fontStyle], partialTheme.defaultFontStyle, (_c = partialTheme === null || partialTheme === void 0 ? void 0 : partialTheme.fonts) === null || _c === void 0 ? void 0 : _c[fontStyle]);
        }
    }
    return mergedTheme;
}
//# sourceMappingURL=mergeThemes.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/spacing/DefaultSpacing.js
var DefaultSpacing = {
    s2: '4px',
    s1: '8px',
    m: '16px',
    l1: '20px',
    l2: '32px',
};
//# sourceMappingURL=DefaultSpacing.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/theme/lib/createTheme.js






/**
 * Creates a custom theme definition.
 * @param theme - Partial theme object.
 * @param depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function createTheme_createTheme(theme, depComments) {
    if (theme === void 0) { theme = {}; }
    if (depComments === void 0) { depComments = false; }
    var isInverted = !!theme.isInverted;
    var baseTheme = {
        palette: DefaultPalette,
        effects: DefaultEffects,
        fonts: DefaultFontStyles,
        spacing: DefaultSpacing,
        isInverted: isInverted,
        disableGlobalClassNames: false,
        semanticColors: makeSemanticColors(DefaultPalette, DefaultEffects, undefined, isInverted, depComments),
        rtl: undefined,
    };
    return mergeThemes(baseTheme, theme);
}
//# sourceMappingURL=createTheme.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/styles/theme.js





var _theme = createTheme_createTheme({});
var _onThemeChangeCallbacks = [];
var ThemeSettingName = 'theme';
function initializeThemeInCustomizations() {
    var _a;
    var _b, _c;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var win = getWindow_getWindow();
    if ((_b = win === null || win === void 0 ? void 0 : win.FabricConfig) === null || _b === void 0 ? void 0 : _b.legacyTheme) {
        // does everything the `else` clause does and more, such as invoke legacy theming
        theme_loadTheme(win.FabricConfig.legacyTheme);
    }
    else if (!Customizations.getSettings([ThemeSettingName]).theme) {
        if ((_c = win === null || win === void 0 ? void 0 : win.FabricConfig) === null || _c === void 0 ? void 0 : _c.theme) {
            _theme = createTheme_createTheme(win.FabricConfig.theme);
        }
        // Set the default theme.
        Customizations.applySettings((_a = {}, _a[ThemeSettingName] = _theme, _a));
    }
}
initializeThemeInCustomizations();
/**
 * Gets the theme object
 * @param depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function getTheme(depComments) {
    if (depComments === void 0) { depComments = false; }
    if (depComments === true) {
        _theme = createTheme({}, depComments);
    }
    return _theme;
}
/**
 * Registers a callback that gets called whenever the theme changes.
 * This should only be used when the component cannot automatically get theme changes through its state.
 * This will not register duplicate callbacks.
 */
function registerOnThemeChangeCallback(callback) {
    if (_onThemeChangeCallbacks.indexOf(callback) === -1) {
        _onThemeChangeCallbacks.push(callback);
    }
}
/**
 * See registerOnThemeChangeCallback().
 * Removes previously registered callbacks.
 */
function removeOnThemeChangeCallback(callback) {
    var i = _onThemeChangeCallbacks.indexOf(callback);
    if (i === -1) {
        return;
    }
    _onThemeChangeCallbacks.splice(i, 1);
}
/**
 * Applies the theme, while filling in missing slots.
 * @param theme - Partial theme object.
 * @param depComments - Whether to include deprecated tags as comments for deprecated slots.
 */
function theme_loadTheme(theme, depComments) {
    var _a;
    if (depComments === void 0) { depComments = false; }
    _theme = createTheme_createTheme(theme, depComments);
    // Invoke the legacy method of theming the page as well.
    loadTheme((0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, _theme.palette), _theme.semanticColors), _theme.effects), _loadFonts(_theme)));
    Customizations.applySettings((_a = {}, _a[ThemeSettingName] = _theme, _a));
    _onThemeChangeCallbacks.forEach(function (callback) {
        try {
            callback(_theme);
        }
        catch (e) {
            // don't let a bad callback break everything else
        }
    });
    return _theme;
}
/**
 * Loads font variables into a JSON object.
 * @param theme - The theme object
 */
function _loadFonts(theme) {
    var lines = {};
    for (var _i = 0, _a = Object.keys(theme.fonts); _i < _a.length; _i++) {
        var fontName = _a[_i];
        var font = theme.fonts[fontName];
        for (var _b = 0, _c = Object.keys(font); _b < _c.length; _b++) {
            var propName = _c[_b];
            var name_1 = fontName + propName.charAt(0).toUpperCase() + propName.slice(1);
            var value = font[propName];
            if (propName === 'fontSize' && typeof value === 'number') {
                // if it's a number, convert it to px by default like our theming system does
                value = value + 'px';
            }
            lines[name_1] = value;
        }
    }
    return lines;
}
//# sourceMappingURL=theme.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/style-utilities/lib/index.js







// Ensure theme is initialized when this package is referenced.

initializeThemeInCustomizations();
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none',
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons\"",
            src: "url('".concat(baseUrl, "fabric-icons-a13498cf.woff') format('woff')"),
        },
        icons: {
            GlobalNavButton: '\uE700',
            ChevronDown: '\uE70D',
            ChevronUp: '\uE70E',
            Edit: '\uE70F',
            Add: '\uE710',
            Cancel: '\uE711',
            More: '\uE712',
            Settings: '\uE713',
            Mail: '\uE715',
            Filter: '\uE71C',
            Search: '\uE721',
            Share: '\uE72D',
            BlockedSite: '\uE72F',
            FavoriteStar: '\uE734',
            FavoriteStarFill: '\uE735',
            CheckMark: '\uE73E',
            Delete: '\uE74D',
            ChevronLeft: '\uE76B',
            ChevronRight: '\uE76C',
            Calendar: '\uE787',
            Megaphone: '\uE789',
            Undo: '\uE7A7',
            Flag: '\uE7C1',
            Page: '\uE7C3',
            Pinned: '\uE840',
            View: '\uE890',
            Clear: '\uE894',
            Download: '\uE896',
            Upload: '\uE898',
            Folder: '\uE8B7',
            Sort: '\uE8CB',
            AlignRight: '\uE8E2',
            AlignLeft: '\uE8E4',
            Tag: '\uE8EC',
            AddFriend: '\uE8FA',
            Info: '\uE946',
            SortLines: '\uE9D0',
            List: '\uEA37',
            CircleRing: '\uEA3A',
            Heart: '\uEB51',
            HeartFill: '\uEB52',
            Tiles: '\uECA5',
            Embed: '\uECCE',
            Glimmer: '\uECF4',
            Ascending: '\uEDC0',
            Descending: '\uEDC1',
            SortUp: '\uEE68',
            SortDown: '\uEE69',
            SyncToPC: '\uEE6E',
            LargeGrid: '\uEECB',
            SkypeCheck: '\uEF80',
            SkypeClock: '\uEF81',
            SkypeMinus: '\uEF82',
            ClearFilter: '\uEF8F',
            Flow: '\uEF90',
            StatusCircleCheckmark: '\uF13E',
            MoreVertical: '\uF2BC',
        },
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-0.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_0_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-0\"",
            src: "url('".concat(baseUrl, "fabric-icons-0-467ee27f.woff') format('woff')")
        },
        icons: {
            'PageLink': '\uE302',
            'CommentSolid': '\uE30E',
            'ChangeEntitlements': '\uE310',
            'Installation': '\uE311',
            'WebAppBuilderModule': '\uE313',
            'WebAppBuilderFragment': '\uE314',
            'WebAppBuilderSlot': '\uE315',
            'BullseyeTargetEdit': '\uE319',
            'WebAppBuilderFragmentCreate': '\uE31B',
            'PageData': '\uE31C',
            'PageHeaderEdit': '\uE31D',
            'ProductList': '\uE31E',
            'UnpublishContent': '\uE31F',
            'DependencyAdd': '\uE344',
            'DependencyRemove': '\uE345',
            'EntitlementPolicy': '\uE346',
            'EntitlementRedemption': '\uE347',
            'SchoolDataSyncLogo': '\uE34C',
            'PinSolid12': '\uE352',
            'PinSolidOff12': '\uE353',
            'AddLink': '\uE35E',
            'SharepointAppIcon16': '\uE365',
            'DataflowsLink': '\uE366',
            'TimePicker': '\uE367',
            'UserWarning': '\uE368',
            'ComplianceAudit': '\uE369',
            'InternetSharing': '\uE704',
            'Brightness': '\uE706',
            'MapPin': '\uE707',
            'Airplane': '\uE709',
            'Tablet': '\uE70A',
            'QuickNote': '\uE70B',
            'Video': '\uE714',
            'People': '\uE716',
            'Phone': '\uE717',
            'Pin': '\uE718',
            'Shop': '\uE719',
            'Stop': '\uE71A',
            'Link': '\uE71B',
            'AllApps': '\uE71D',
            'Zoom': '\uE71E',
            'ZoomOut': '\uE71F',
            'Microphone': '\uE720',
            'Camera': '\uE722',
            'Attach': '\uE723',
            'Send': '\uE724',
            'FavoriteList': '\uE728',
            'PageSolid': '\uE729',
            'Forward': '\uE72A',
            'Back': '\uE72B',
            'Refresh': '\uE72C',
            'Lock': '\uE72E',
            'ReportHacked': '\uE730',
            'EMI': '\uE731',
            'MiniLink': '\uE732',
            'Blocked': '\uE733',
            'ReadingMode': '\uE736',
            'Favicon': '\uE737',
            'Remove': '\uE738',
            'Checkbox': '\uE739',
            'CheckboxComposite': '\uE73A',
            'CheckboxFill': '\uE73B',
            'CheckboxIndeterminate': '\uE73C',
            'CheckboxCompositeReversed': '\uE73D',
            'BackToWindow': '\uE73F',
            'FullScreen': '\uE740',
            'Print': '\uE749',
            'Up': '\uE74A',
            'Down': '\uE74B',
            'OEM': '\uE74C',
            'Save': '\uE74E',
            'ReturnKey': '\uE751',
            'Cloud': '\uE753',
            'Flashlight': '\uE754',
            'CommandPrompt': '\uE756',
            'Sad': '\uE757',
            'RealEstate': '\uE758',
            'SIPMove': '\uE759',
            'EraseTool': '\uE75C',
            'GripperTool': '\uE75E',
            'Dialpad': '\uE75F',
            'PageLeft': '\uE760',
            'PageRight': '\uE761',
            'MultiSelect': '\uE762',
            'KeyboardClassic': '\uE765',
            'Play': '\uE768',
            'Pause': '\uE769',
            'InkingTool': '\uE76D',
            'Emoji2': '\uE76E',
            'GripperBarHorizontal': '\uE76F',
            'System': '\uE770',
            'Personalize': '\uE771',
            'SearchAndApps': '\uE773',
            'Globe': '\uE774',
            'EaseOfAccess': '\uE776',
            'ContactInfo': '\uE779',
            'Unpin': '\uE77A',
            'Contact': '\uE77B',
            'Memo': '\uE77C',
            'IncomingCall': '\uE77E'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-0.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-1.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_1_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-1\"",
            src: "url('".concat(baseUrl, "fabric-icons-1-4d521695.woff') format('woff')")
        },
        icons: {
            'Paste': '\uE77F',
            'WindowsLogo': '\uE782',
            'Error': '\uE783',
            'GripperBarVertical': '\uE784',
            'Unlock': '\uE785',
            'Slideshow': '\uE786',
            'Trim': '\uE78A',
            'AutoEnhanceOn': '\uE78D',
            'AutoEnhanceOff': '\uE78E',
            'Color': '\uE790',
            'SaveAs': '\uE792',
            'Light': '\uE793',
            'Filters': '\uE795',
            'AspectRatio': '\uE799',
            'Contrast': '\uE7A1',
            'Redo': '\uE7A6',
            'Crop': '\uE7A8',
            'PhotoCollection': '\uE7AA',
            'Album': '\uE7AB',
            'Rotate': '\uE7AD',
            'PanoIndicator': '\uE7B0',
            'Translate': '\uE7B2',
            'RedEye': '\uE7B3',
            'ViewOriginal': '\uE7B4',
            'ThumbnailView': '\uE7B6',
            'Package': '\uE7B8',
            'Telemarketer': '\uE7B9',
            'Warning': '\uE7BA',
            'Financial': '\uE7BB',
            'Education': '\uE7BE',
            'ShoppingCart': '\uE7BF',
            'Train': '\uE7C0',
            'Move': '\uE7C2',
            'TouchPointer': '\uE7C9',
            'Merge': '\uE7D5',
            'TurnRight': '\uE7DB',
            'Ferry': '\uE7E3',
            'Highlight': '\uE7E6',
            'PowerButton': '\uE7E8',
            'Tab': '\uE7E9',
            'Admin': '\uE7EF',
            'TVMonitor': '\uE7F4',
            'Speakers': '\uE7F5',
            'Game': '\uE7FC',
            'HorizontalTabKey': '\uE7FD',
            'UnstackSelected': '\uE7FE',
            'StackIndicator': '\uE7FF',
            'Nav2DMapView': '\uE800',
            'StreetsideSplitMinimize': '\uE802',
            'Car': '\uE804',
            'Bus': '\uE806',
            'EatDrink': '\uE807',
            'SeeDo': '\uE808',
            'LocationCircle': '\uE80E',
            'Home': '\uE80F',
            'SwitcherStartEnd': '\uE810',
            'ParkingLocation': '\uE811',
            'IncidentTriangle': '\uE814',
            'Touch': '\uE815',
            'MapDirections': '\uE816',
            'CaretHollow': '\uE817',
            'CaretSolid': '\uE818',
            'History': '\uE81C',
            'Location': '\uE81D',
            'MapLayers': '\uE81E',
            'SearchNearby': '\uE820',
            'Work': '\uE821',
            'Recent': '\uE823',
            'Hotel': '\uE824',
            'Bank': '\uE825',
            'LocationDot': '\uE827',
            'Dictionary': '\uE82D',
            'ChromeBack': '\uE830',
            'FolderOpen': '\uE838',
            'PinnedFill': '\uE842',
            'RevToggleKey': '\uE845',
            'USB': '\uE88E',
            'Previous': '\uE892',
            'Next': '\uE893',
            'Sync': '\uE895',
            'Help': '\uE897',
            'Emoji': '\uE899',
            'MailForward': '\uE89C',
            'ClosePane': '\uE89F',
            'OpenPane': '\uE8A0',
            'PreviewLink': '\uE8A1',
            'ZoomIn': '\uE8A3',
            'Bookmarks': '\uE8A4',
            'Document': '\uE8A5',
            'ProtectedDocument': '\uE8A6',
            'OpenInNewWindow': '\uE8A7',
            'MailFill': '\uE8A8',
            'ViewAll': '\uE8A9',
            'Switch': '\uE8AB',
            'Rename': '\uE8AC',
            'Go': '\uE8AD',
            'Remote': '\uE8AF',
            'SelectAll': '\uE8B3',
            'Orientation': '\uE8B4',
            'Import': '\uE8B5'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-1.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-2.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_2_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-2\"",
            src: "url('".concat(baseUrl, "fabric-icons-2-63c99abf.woff') format('woff')")
        },
        icons: {
            'Picture': '\uE8B9',
            'ChromeClose': '\uE8BB',
            'ShowResults': '\uE8BC',
            'Message': '\uE8BD',
            'CalendarDay': '\uE8BF',
            'CalendarWeek': '\uE8C0',
            'MailReplyAll': '\uE8C2',
            'Read': '\uE8C3',
            'Cut': '\uE8C6',
            'PaymentCard': '\uE8C7',
            'Copy': '\uE8C8',
            'Important': '\uE8C9',
            'MailReply': '\uE8CA',
            'GotoToday': '\uE8D1',
            'Font': '\uE8D2',
            'FontColor': '\uE8D3',
            'FolderFill': '\uE8D5',
            'Permissions': '\uE8D7',
            'DisableUpdates': '\uE8D8',
            'Unfavorite': '\uE8D9',
            'Italic': '\uE8DB',
            'Underline': '\uE8DC',
            'Bold': '\uE8DD',
            'MoveToFolder': '\uE8DE',
            'Dislike': '\uE8E0',
            'Like': '\uE8E1',
            'AlignCenter': '\uE8E3',
            'OpenFile': '\uE8E5',
            'ClearSelection': '\uE8E6',
            'FontDecrease': '\uE8E7',
            'FontIncrease': '\uE8E8',
            'FontSize': '\uE8E9',
            'CellPhone': '\uE8EA',
            'RepeatOne': '\uE8ED',
            'RepeatAll': '\uE8EE',
            'Calculator': '\uE8EF',
            'Library': '\uE8F1',
            'PostUpdate': '\uE8F3',
            'NewFolder': '\uE8F4',
            'CalendarReply': '\uE8F5',
            'UnsyncFolder': '\uE8F6',
            'SyncFolder': '\uE8F7',
            'BlockContact': '\uE8F8',
            'Accept': '\uE8FB',
            'BulletedList': '\uE8FD',
            'Preview': '\uE8FF',
            'News': '\uE900',
            'Chat': '\uE901',
            'Group': '\uE902',
            'World': '\uE909',
            'Comment': '\uE90A',
            'DockLeft': '\uE90C',
            'DockRight': '\uE90D',
            'Repair': '\uE90F',
            'Accounts': '\uE910',
            'Street': '\uE913',
            'RadioBullet': '\uE915',
            'Stopwatch': '\uE916',
            'Clock': '\uE917',
            'WorldClock': '\uE918',
            'AlarmClock': '\uE919',
            'Photo': '\uE91B',
            'ActionCenter': '\uE91C',
            'Hospital': '\uE91D',
            'Timer': '\uE91E',
            'FullCircleMask': '\uE91F',
            'LocationFill': '\uE920',
            'ChromeMinimize': '\uE921',
            'ChromeRestore': '\uE923',
            'Annotation': '\uE924',
            'Fingerprint': '\uE928',
            'Handwriting': '\uE929',
            'ChromeFullScreen': '\uE92D',
            'Completed': '\uE930',
            'Label': '\uE932',
            'FlickDown': '\uE935',
            'FlickUp': '\uE936',
            'FlickLeft': '\uE937',
            'FlickRight': '\uE938',
            'MiniExpand': '\uE93A',
            'MiniContract': '\uE93B',
            'Streaming': '\uE93E',
            'MusicInCollection': '\uE940',
            'OneDriveLogo': '\uE941',
            'CompassNW': '\uE942',
            'Code': '\uE943',
            'LightningBolt': '\uE945',
            'CalculatorMultiply': '\uE947',
            'CalculatorAddition': '\uE948',
            'CalculatorSubtract': '\uE949',
            'CalculatorPercentage': '\uE94C',
            'CalculatorEqualTo': '\uE94E',
            'PrintfaxPrinterFile': '\uE956',
            'StorageOptical': '\uE958',
            'Communications': '\uE95A',
            'Headset': '\uE95B',
            'Health': '\uE95E',
            'Webcam2': '\uE960',
            'FrontCamera': '\uE96B',
            'ChevronUpSmall': '\uE96D'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-2.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-3.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_3_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-3\"",
            src: "url('".concat(baseUrl, "fabric-icons-3-089e217a.woff') format('woff')")
        },
        icons: {
            'ChevronDownSmall': '\uE96E',
            'ChevronLeftSmall': '\uE96F',
            'ChevronRightSmall': '\uE970',
            'ChevronUpMed': '\uE971',
            'ChevronDownMed': '\uE972',
            'ChevronLeftMed': '\uE973',
            'ChevronRightMed': '\uE974',
            'Devices2': '\uE975',
            'PC1': '\uE977',
            'PresenceChickletVideo': '\uE979',
            'Reply': '\uE97A',
            'HalfAlpha': '\uE97E',
            'ConstructionCone': '\uE98F',
            'DoubleChevronLeftMed': '\uE991',
            'Volume0': '\uE992',
            'Volume1': '\uE993',
            'Volume2': '\uE994',
            'Volume3': '\uE995',
            'Chart': '\uE999',
            'Robot': '\uE99A',
            'Manufacturing': '\uE99C',
            'LockSolid': '\uE9A2',
            'FitPage': '\uE9A6',
            'FitWidth': '\uE9A7',
            'BidiLtr': '\uE9AA',
            'BidiRtl': '\uE9AB',
            'RightDoubleQuote': '\uE9B1',
            'Sunny': '\uE9BD',
            'CloudWeather': '\uE9BE',
            'Cloudy': '\uE9BF',
            'PartlyCloudyDay': '\uE9C0',
            'PartlyCloudyNight': '\uE9C1',
            'ClearNight': '\uE9C2',
            'RainShowersDay': '\uE9C3',
            'Rain': '\uE9C4',
            'Thunderstorms': '\uE9C6',
            'RainSnow': '\uE9C7',
            'Snow': '\uE9C8',
            'BlowingSnow': '\uE9C9',
            'Frigid': '\uE9CA',
            'Fog': '\uE9CB',
            'Squalls': '\uE9CC',
            'Duststorm': '\uE9CD',
            'Unknown': '\uE9CE',
            'Precipitation': '\uE9CF',
            'Ribbon': '\uE9D1',
            'AreaChart': '\uE9D2',
            'Assign': '\uE9D3',
            'FlowChart': '\uE9D4',
            'CheckList': '\uE9D5',
            'Diagnostic': '\uE9D9',
            'Generate': '\uE9DA',
            'LineChart': '\uE9E6',
            'Equalizer': '\uE9E9',
            'BarChartHorizontal': '\uE9EB',
            'BarChartVertical': '\uE9EC',
            'Freezing': '\uE9EF',
            'FunnelChart': '\uE9F1',
            'Processing': '\uE9F5',
            'Quantity': '\uE9F8',
            'ReportDocument': '\uE9F9',
            'StackColumnChart': '\uE9FC',
            'SnowShowerDay': '\uE9FD',
            'HailDay': '\uEA00',
            'WorkFlow': '\uEA01',
            'HourGlass': '\uEA03',
            'StoreLogoMed20': '\uEA04',
            'TimeSheet': '\uEA05',
            'TriangleSolid': '\uEA08',
            'UpgradeAnalysis': '\uEA0B',
            'VideoSolid': '\uEA0C',
            'RainShowersNight': '\uEA0F',
            'SnowShowerNight': '\uEA11',
            'Teamwork': '\uEA12',
            'HailNight': '\uEA13',
            'PeopleAdd': '\uEA15',
            'Glasses': '\uEA16',
            'DateTime2': '\uEA17',
            'Shield': '\uEA18',
            'Header1': '\uEA19',
            'PageAdd': '\uEA1A',
            'NumberedList': '\uEA1C',
            'PowerBILogo': '\uEA1E',
            'Info2': '\uEA1F',
            'MusicInCollectionFill': '\uEA36',
            'Asterisk': '\uEA38',
            'ErrorBadge': '\uEA39',
            'CircleFill': '\uEA3B',
            'Record2': '\uEA3F',
            'AllAppsMirrored': '\uEA40',
            'BookmarksMirrored': '\uEA41',
            'BulletedListMirrored': '\uEA42',
            'CaretHollowMirrored': '\uEA45',
            'CaretSolidMirrored': '\uEA46',
            'ChromeBackMirrored': '\uEA47',
            'ClearSelectionMirrored': '\uEA48',
            'ClosePaneMirrored': '\uEA49',
            'DockLeftMirrored': '\uEA4C',
            'DoubleChevronLeftMedMirrored': '\uEA4D',
            'GoMirrored': '\uEA4F'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-3.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-4.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_4_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-4\"",
            src: "url('".concat(baseUrl, "fabric-icons-4-a656cc0a.woff') format('woff')")
        },
        icons: {
            'HelpMirrored': '\uEA51',
            'ImportMirrored': '\uEA52',
            'ImportAllMirrored': '\uEA53',
            'ListMirrored': '\uEA55',
            'MailForwardMirrored': '\uEA56',
            'MailReplyMirrored': '\uEA57',
            'MailReplyAllMirrored': '\uEA58',
            'MiniContractMirrored': '\uEA59',
            'MiniExpandMirrored': '\uEA5A',
            'OpenPaneMirrored': '\uEA5B',
            'ParkingLocationMirrored': '\uEA5E',
            'SendMirrored': '\uEA63',
            'ShowResultsMirrored': '\uEA65',
            'ThumbnailViewMirrored': '\uEA67',
            'Media': '\uEA69',
            'Devices3': '\uEA6C',
            'Focus': '\uEA6F',
            'VideoLightOff': '\uEA74',
            'Lightbulb': '\uEA80',
            'StatusTriangle': '\uEA82',
            'VolumeDisabled': '\uEA85',
            'Puzzle': '\uEA86',
            'EmojiNeutral': '\uEA87',
            'EmojiDisappointed': '\uEA88',
            'HomeSolid': '\uEA8A',
            'Ringer': '\uEA8F',
            'PDF': '\uEA90',
            'HeartBroken': '\uEA92',
            'StoreLogo16': '\uEA96',
            'MultiSelectMirrored': '\uEA98',
            'Broom': '\uEA99',
            'AddToShoppingList': '\uEA9A',
            'Cocktails': '\uEA9D',
            'Wines': '\uEABF',
            'Articles': '\uEAC1',
            'Cycling': '\uEAC7',
            'DietPlanNotebook': '\uEAC8',
            'Pill': '\uEACB',
            'ExerciseTracker': '\uEACC',
            'HandsFree': '\uEAD0',
            'Medical': '\uEAD4',
            'Running': '\uEADA',
            'Weights': '\uEADB',
            'Trackers': '\uEADF',
            'AddNotes': '\uEAE3',
            'AllCurrency': '\uEAE4',
            'BarChart4': '\uEAE7',
            'CirclePlus': '\uEAEE',
            'Coffee': '\uEAEF',
            'Cotton': '\uEAF3',
            'Market': '\uEAFC',
            'Money': '\uEAFD',
            'PieDouble': '\uEB04',
            'PieSingle': '\uEB05',
            'RemoveFilter': '\uEB08',
            'Savings': '\uEB0B',
            'Sell': '\uEB0C',
            'StockDown': '\uEB0F',
            'StockUp': '\uEB11',
            'Lamp': '\uEB19',
            'Source': '\uEB1B',
            'MSNVideos': '\uEB1C',
            'Cricket': '\uEB1E',
            'Golf': '\uEB1F',
            'Baseball': '\uEB20',
            'Soccer': '\uEB21',
            'MoreSports': '\uEB22',
            'AutoRacing': '\uEB24',
            'CollegeHoops': '\uEB25',
            'CollegeFootball': '\uEB26',
            'ProFootball': '\uEB27',
            'ProHockey': '\uEB28',
            'Rugby': '\uEB2D',
            'SubstitutionsIn': '\uEB31',
            'Tennis': '\uEB33',
            'Arrivals': '\uEB34',
            'Design': '\uEB3C',
            'Website': '\uEB41',
            'Drop': '\uEB42',
            'HistoricalWeather': '\uEB43',
            'SkiResorts': '\uEB45',
            'Snowflake': '\uEB46',
            'BusSolid': '\uEB47',
            'FerrySolid': '\uEB48',
            'AirplaneSolid': '\uEB4C',
            'TrainSolid': '\uEB4D',
            'Ticket': '\uEB54',
            'WifiWarning4': '\uEB63',
            'Devices4': '\uEB66',
            'AzureLogo': '\uEB6A',
            'BingLogo': '\uEB6B',
            'MSNLogo': '\uEB6C',
            'OutlookLogoInverse': '\uEB6D',
            'OfficeLogo': '\uEB6E',
            'SkypeLogo': '\uEB6F',
            'Door': '\uEB75',
            'EditMirrored': '\uEB7E',
            'GiftCard': '\uEB8E',
            'DoubleBookmark': '\uEB8F',
            'StatusErrorFull': '\uEB90'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-4.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-5.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_5_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-5\"",
            src: "url('".concat(baseUrl, "fabric-icons-5-f95ba260.woff') format('woff')")
        },
        icons: {
            'Certificate': '\uEB95',
            'FastForward': '\uEB9D',
            'Rewind': '\uEB9E',
            'Photo2': '\uEB9F',
            'OpenSource': '\uEBC2',
            'Movers': '\uEBCD',
            'CloudDownload': '\uEBD3',
            'Family': '\uEBDA',
            'WindDirection': '\uEBE6',
            'Bug': '\uEBE8',
            'SiteScan': '\uEBEC',
            'BrowserScreenShot': '\uEBED',
            'F12DevTools': '\uEBEE',
            'CSS': '\uEBEF',
            'JS': '\uEBF0',
            'DeliveryTruck': '\uEBF4',
            'ReminderPerson': '\uEBF7',
            'ReminderGroup': '\uEBF8',
            'ReminderTime': '\uEBF9',
            'TabletMode': '\uEBFC',
            'Umbrella': '\uEC04',
            'NetworkTower': '\uEC05',
            'CityNext': '\uEC06',
            'CityNext2': '\uEC07',
            'Section': '\uEC0C',
            'OneNoteLogoInverse': '\uEC0D',
            'ToggleFilled': '\uEC11',
            'ToggleBorder': '\uEC12',
            'SliderThumb': '\uEC13',
            'ToggleThumb': '\uEC14',
            'Documentation': '\uEC17',
            'Badge': '\uEC1B',
            'Giftbox': '\uEC1F',
            'VisualStudioLogo': '\uEC22',
            'HomeGroup': '\uEC26',
            'ExcelLogoInverse': '\uEC28',
            'WordLogoInverse': '\uEC29',
            'PowerPointLogoInverse': '\uEC2A',
            'Cafe': '\uEC32',
            'SpeedHigh': '\uEC4A',
            'Commitments': '\uEC4D',
            'ThisPC': '\uEC4E',
            'MusicNote': '\uEC4F',
            'MicOff': '\uEC54',
            'PlaybackRate1x': '\uEC57',
            'EdgeLogo': '\uEC60',
            'CompletedSolid': '\uEC61',
            'AlbumRemove': '\uEC62',
            'MessageFill': '\uEC70',
            'TabletSelected': '\uEC74',
            'MobileSelected': '\uEC75',
            'LaptopSelected': '\uEC76',
            'TVMonitorSelected': '\uEC77',
            'DeveloperTools': '\uEC7A',
            'Shapes': '\uEC7C',
            'InsertTextBox': '\uEC7D',
            'LowerBrightness': '\uEC8A',
            'WebComponents': '\uEC8B',
            'OfflineStorage': '\uEC8C',
            'DOM': '\uEC8D',
            'CloudUpload': '\uEC8E',
            'ScrollUpDown': '\uEC8F',
            'DateTime': '\uEC92',
            'Event': '\uECA3',
            'Cake': '\uECA4',
            'Org': '\uECA6',
            'PartyLeader': '\uECA7',
            'DRM': '\uECA8',
            'CloudAdd': '\uECA9',
            'AppIconDefault': '\uECAA',
            'Photo2Add': '\uECAB',
            'Photo2Remove': '\uECAC',
            'Calories': '\uECAD',
            'POI': '\uECAF',
            'AddTo': '\uECC8',
            'RadioBtnOff': '\uECCA',
            'RadioBtnOn': '\uECCB',
            'ExploreContent': '\uECCD',
            'Product': '\uECDC',
            'ProgressLoopInner': '\uECDE',
            'ProgressLoopOuter': '\uECDF',
            'Blocked2': '\uECE4',
            'FangBody': '\uECEB',
            'Toolbox': '\uECED',
            'PageHeader': '\uECEE',
            'ChatInviteFriend': '\uECFE',
            'Brush': '\uECFF',
            'Shirt': '\uED00',
            'Crown': '\uED01',
            'Diamond': '\uED02',
            'ScaleUp': '\uED09',
            'QRCode': '\uED14',
            'Feedback': '\uED15',
            'SharepointLogoInverse': '\uED18',
            'YammerLogo': '\uED19',
            'Hide': '\uED1A',
            'Uneditable': '\uED1D',
            'ReturnToSession': '\uED24',
            'OpenFolderHorizontal': '\uED25',
            'CalendarMirrored': '\uED28'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-5.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-6.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_6_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-6\"",
            src: "url('".concat(baseUrl, "fabric-icons-6-ef6fd590.woff') format('woff')")
        },
        icons: {
            'SwayLogoInverse': '\uED29',
            'OutOfOffice': '\uED34',
            'Trophy': '\uED3F',
            'ReopenPages': '\uED50',
            'EmojiTabSymbols': '\uED58',
            'AADLogo': '\uED68',
            'AccessLogo': '\uED69',
            'AdminALogoInverse32': '\uED6A',
            'AdminCLogoInverse32': '\uED6B',
            'AdminDLogoInverse32': '\uED6C',
            'AdminELogoInverse32': '\uED6D',
            'AdminLLogoInverse32': '\uED6E',
            'AdminMLogoInverse32': '\uED6F',
            'AdminOLogoInverse32': '\uED70',
            'AdminPLogoInverse32': '\uED71',
            'AdminSLogoInverse32': '\uED72',
            'AdminYLogoInverse32': '\uED73',
            'DelveLogoInverse': '\uED76',
            'ExchangeLogoInverse': '\uED78',
            'LyncLogo': '\uED79',
            'OfficeVideoLogoInverse': '\uED7A',
            'SocialListeningLogo': '\uED7C',
            'VisioLogoInverse': '\uED7D',
            'Balloons': '\uED7E',
            'Cat': '\uED7F',
            'MailAlert': '\uED80',
            'MailCheck': '\uED81',
            'MailLowImportance': '\uED82',
            'MailPause': '\uED83',
            'MailRepeat': '\uED84',
            'SecurityGroup': '\uED85',
            'Table': '\uED86',
            'VoicemailForward': '\uED87',
            'VoicemailReply': '\uED88',
            'Waffle': '\uED89',
            'RemoveEvent': '\uED8A',
            'EventInfo': '\uED8B',
            'ForwardEvent': '\uED8C',
            'WipePhone': '\uED8D',
            'AddOnlineMeeting': '\uED8E',
            'JoinOnlineMeeting': '\uED8F',
            'RemoveLink': '\uED90',
            'PeopleBlock': '\uED91',
            'PeopleRepeat': '\uED92',
            'PeopleAlert': '\uED93',
            'PeoplePause': '\uED94',
            'TransferCall': '\uED95',
            'AddPhone': '\uED96',
            'UnknownCall': '\uED97',
            'NoteReply': '\uED98',
            'NoteForward': '\uED99',
            'NotePinned': '\uED9A',
            'RemoveOccurrence': '\uED9B',
            'Timeline': '\uED9C',
            'EditNote': '\uED9D',
            'CircleHalfFull': '\uED9E',
            'Room': '\uED9F',
            'Unsubscribe': '\uEDA0',
            'Subscribe': '\uEDA1',
            'HardDrive': '\uEDA2',
            'RecurringTask': '\uEDB2',
            'TaskManager': '\uEDB7',
            'TaskManagerMirrored': '\uEDB8',
            'Combine': '\uEDBB',
            'Split': '\uEDBC',
            'DoubleChevronUp': '\uEDBD',
            'DoubleChevronLeft': '\uEDBE',
            'DoubleChevronRight': '\uEDBF',
            'TextBox': '\uEDC2',
            'TextField': '\uEDC3',
            'NumberField': '\uEDC4',
            'Dropdown': '\uEDC5',
            'PenWorkspace': '\uEDC6',
            'BookingsLogo': '\uEDC7',
            'ClassNotebookLogoInverse': '\uEDC8',
            'DelveAnalyticsLogo': '\uEDCA',
            'DocsLogoInverse': '\uEDCB',
            'Dynamics365Logo': '\uEDCC',
            'DynamicSMBLogo': '\uEDCD',
            'OfficeAssistantLogo': '\uEDCE',
            'OfficeStoreLogo': '\uEDCF',
            'OneNoteEduLogoInverse': '\uEDD0',
            'PlannerLogo': '\uEDD1',
            'PowerApps': '\uEDD2',
            'Suitcase': '\uEDD3',
            'ProjectLogoInverse': '\uEDD4',
            'CaretLeft8': '\uEDD5',
            'CaretRight8': '\uEDD6',
            'CaretUp8': '\uEDD7',
            'CaretDown8': '\uEDD8',
            'CaretLeftSolid8': '\uEDD9',
            'CaretRightSolid8': '\uEDDA',
            'CaretUpSolid8': '\uEDDB',
            'CaretDownSolid8': '\uEDDC',
            'ClearFormatting': '\uEDDD',
            'Superscript': '\uEDDE',
            'Subscript': '\uEDDF',
            'Strikethrough': '\uEDE0',
            'Export': '\uEDE1',
            'ExportMirrored': '\uEDE2'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-6.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-7.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_7_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-7\"",
            src: "url('".concat(baseUrl, "fabric-icons-7-2b97bb99.woff') format('woff')")
        },
        icons: {
            'SingleBookmark': '\uEDFF',
            'SingleBookmarkSolid': '\uEE00',
            'DoubleChevronDown': '\uEE04',
            'FollowUser': '\uEE05',
            'ReplyAll': '\uEE0A',
            'WorkforceManagement': '\uEE0F',
            'RecruitmentManagement': '\uEE12',
            'Questionnaire': '\uEE19',
            'ManagerSelfService': '\uEE23',
            'ProductionFloorManagement': '\uEE29',
            'ProductRelease': '\uEE2E',
            'ProductVariant': '\uEE30',
            'ReplyMirrored': '\uEE35',
            'ReplyAllMirrored': '\uEE36',
            'Medal': '\uEE38',
            'AddGroup': '\uEE3D',
            'QuestionnaireMirrored': '\uEE4B',
            'CloudImportExport': '\uEE55',
            'TemporaryUser': '\uEE58',
            'CaretSolid16': '\uEE62',
            'GroupedDescending': '\uEE66',
            'GroupedAscending': '\uEE67',
            'AwayStatus': '\uEE6A',
            'MyMoviesTV': '\uEE6C',
            'GenericScan': '\uEE6F',
            'AustralianRules': '\uEE70',
            'WifiEthernet': '\uEE77',
            'TrackersMirrored': '\uEE92',
            'DateTimeMirrored': '\uEE93',
            'StopSolid': '\uEE95',
            'DoubleChevronUp12': '\uEE96',
            'DoubleChevronDown12': '\uEE97',
            'DoubleChevronLeft12': '\uEE98',
            'DoubleChevronRight12': '\uEE99',
            'CalendarAgenda': '\uEE9A',
            'ConnectVirtualMachine': '\uEE9D',
            'AddEvent': '\uEEB5',
            'AssetLibrary': '\uEEB6',
            'DataConnectionLibrary': '\uEEB7',
            'DocLibrary': '\uEEB8',
            'FormLibrary': '\uEEB9',
            'FormLibraryMirrored': '\uEEBA',
            'ReportLibrary': '\uEEBB',
            'ReportLibraryMirrored': '\uEEBC',
            'ContactCard': '\uEEBD',
            'CustomList': '\uEEBE',
            'CustomListMirrored': '\uEEBF',
            'IssueTracking': '\uEEC0',
            'IssueTrackingMirrored': '\uEEC1',
            'PictureLibrary': '\uEEC2',
            'OfficeAddinsLogo': '\uEEC7',
            'OfflineOneDriveParachute': '\uEEC8',
            'OfflineOneDriveParachuteDisabled': '\uEEC9',
            'TriangleSolidUp12': '\uEECC',
            'TriangleSolidDown12': '\uEECD',
            'TriangleSolidLeft12': '\uEECE',
            'TriangleSolidRight12': '\uEECF',
            'TriangleUp12': '\uEED0',
            'TriangleDown12': '\uEED1',
            'TriangleLeft12': '\uEED2',
            'TriangleRight12': '\uEED3',
            'ArrowUpRight8': '\uEED4',
            'ArrowDownRight8': '\uEED5',
            'DocumentSet': '\uEED6',
            'GoToDashboard': '\uEEED',
            'DelveAnalytics': '\uEEEE',
            'ArrowUpRightMirrored8': '\uEEEF',
            'ArrowDownRightMirrored8': '\uEEF0',
            'CompanyDirectory': '\uEF0D',
            'OpenEnrollment': '\uEF1C',
            'CompanyDirectoryMirrored': '\uEF2B',
            'OneDriveAdd': '\uEF32',
            'ProfileSearch': '\uEF35',
            'Header2': '\uEF36',
            'Header3': '\uEF37',
            'Header4': '\uEF38',
            'RingerSolid': '\uEF3A',
            'Eyedropper': '\uEF3C',
            'MarketDown': '\uEF42',
            'CalendarWorkWeek': '\uEF51',
            'SidePanel': '\uEF52',
            'GlobeFavorite': '\uEF53',
            'CaretTopLeftSolid8': '\uEF54',
            'CaretTopRightSolid8': '\uEF55',
            'ViewAll2': '\uEF56',
            'DocumentReply': '\uEF57',
            'PlayerSettings': '\uEF58',
            'ReceiptForward': '\uEF59',
            'ReceiptReply': '\uEF5A',
            'ReceiptCheck': '\uEF5B',
            'Fax': '\uEF5C',
            'RecurringEvent': '\uEF5D',
            'ReplyAlt': '\uEF5E',
            'ReplyAllAlt': '\uEF5F',
            'EditStyle': '\uEF60',
            'EditMail': '\uEF61',
            'Lifesaver': '\uEF62',
            'LifesaverLock': '\uEF63',
            'InboxCheck': '\uEF64',
            'FolderSearch': '\uEF65'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-7.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-8.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_8_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-8\"",
            src: "url('".concat(baseUrl, "fabric-icons-8-6fdf1528.woff') format('woff')")
        },
        icons: {
            'CollapseMenu': '\uEF66',
            'ExpandMenu': '\uEF67',
            'Boards': '\uEF68',
            'SunAdd': '\uEF69',
            'SunQuestionMark': '\uEF6A',
            'LandscapeOrientation': '\uEF6B',
            'DocumentSearch': '\uEF6C',
            'PublicCalendar': '\uEF6D',
            'PublicContactCard': '\uEF6E',
            'PublicEmail': '\uEF6F',
            'PublicFolder': '\uEF70',
            'WordDocument': '\uEF71',
            'PowerPointDocument': '\uEF72',
            'ExcelDocument': '\uEF73',
            'GroupedList': '\uEF74',
            'ClassroomLogo': '\uEF75',
            'Sections': '\uEF76',
            'EditPhoto': '\uEF77',
            'Starburst': '\uEF78',
            'ShareiOS': '\uEF79',
            'AirTickets': '\uEF7A',
            'PencilReply': '\uEF7B',
            'Tiles2': '\uEF7C',
            'SkypeCircleCheck': '\uEF7D',
            'SkypeCircleClock': '\uEF7E',
            'SkypeCircleMinus': '\uEF7F',
            'SkypeMessage': '\uEF83',
            'ClosedCaption': '\uEF84',
            'ATPLogo': '\uEF85',
            'OfficeFormsLogoInverse': '\uEF86',
            'RecycleBin': '\uEF87',
            'EmptyRecycleBin': '\uEF88',
            'Hide2': '\uEF89',
            'Breadcrumb': '\uEF8C',
            'BirthdayCake': '\uEF8D',
            'TimeEntry': '\uEF95',
            'CRMProcesses': '\uEFB1',
            'PageEdit': '\uEFB6',
            'PageArrowRight': '\uEFB8',
            'PageRemove': '\uEFBA',
            'Database': '\uEFC7',
            'DataManagementSettings': '\uEFC8',
            'CRMServices': '\uEFD2',
            'EditContact': '\uEFD3',
            'ConnectContacts': '\uEFD4',
            'AppIconDefaultAdd': '\uEFDA',
            'AppIconDefaultList': '\uEFDE',
            'ActivateOrders': '\uEFE0',
            'DeactivateOrders': '\uEFE1',
            'ProductCatalog': '\uEFE8',
            'ScatterChart': '\uEFEB',
            'AccountActivity': '\uEFF4',
            'DocumentManagement': '\uEFFC',
            'CRMReport': '\uEFFE',
            'KnowledgeArticle': '\uF000',
            'Relationship': '\uF003',
            'HomeVerify': '\uF00E',
            'ZipFolder': '\uF012',
            'SurveyQuestions': '\uF01B',
            'TextDocument': '\uF029',
            'TextDocumentShared': '\uF02B',
            'PageCheckedOut': '\uF02C',
            'PageShared': '\uF02D',
            'SaveAndClose': '\uF038',
            'Script': '\uF03A',
            'Archive': '\uF03F',
            'ActivityFeed': '\uF056',
            'Compare': '\uF057',
            'EventDate': '\uF059',
            'ArrowUpRight': '\uF069',
            'CaretRight': '\uF06B',
            'SetAction': '\uF071',
            'ChatBot': '\uF08B',
            'CaretSolidLeft': '\uF08D',
            'CaretSolidDown': '\uF08E',
            'CaretSolidRight': '\uF08F',
            'CaretSolidUp': '\uF090',
            'PowerAppsLogo': '\uF091',
            'PowerApps2Logo': '\uF092',
            'SearchIssue': '\uF09A',
            'SearchIssueMirrored': '\uF09B',
            'FabricAssetLibrary': '\uF09C',
            'FabricDataConnectionLibrary': '\uF09D',
            'FabricDocLibrary': '\uF09E',
            'FabricFormLibrary': '\uF09F',
            'FabricFormLibraryMirrored': '\uF0A0',
            'FabricReportLibrary': '\uF0A1',
            'FabricReportLibraryMirrored': '\uF0A2',
            'FabricPublicFolder': '\uF0A3',
            'FabricFolderSearch': '\uF0A4',
            'FabricMovetoFolder': '\uF0A5',
            'FabricUnsyncFolder': '\uF0A6',
            'FabricSyncFolder': '\uF0A7',
            'FabricOpenFolderHorizontal': '\uF0A8',
            'FabricFolder': '\uF0A9',
            'FabricFolderFill': '\uF0AA',
            'FabricNewFolder': '\uF0AB',
            'FabricPictureLibrary': '\uF0AC',
            'PhotoVideoMedia': '\uF0B1',
            'AddFavorite': '\uF0C8'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-8.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-9.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_9_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-9\"",
            src: "url('".concat(baseUrl, "fabric-icons-9-c6162b42.woff') format('woff')")
        },
        icons: {
            'AddFavoriteFill': '\uF0C9',
            'BufferTimeBefore': '\uF0CF',
            'BufferTimeAfter': '\uF0D0',
            'BufferTimeBoth': '\uF0D1',
            'PublishContent': '\uF0D4',
            'ClipboardList': '\uF0E3',
            'ClipboardListMirrored': '\uF0E4',
            'CannedChat': '\uF0F2',
            'SkypeForBusinessLogo': '\uF0FC',
            'TabCenter': '\uF100',
            'PageCheckedin': '\uF104',
            'PageList': '\uF106',
            'ReadOutLoud': '\uF112',
            'CaretBottomLeftSolid8': '\uF121',
            'CaretBottomRightSolid8': '\uF122',
            'FolderHorizontal': '\uF12B',
            'MicrosoftStaffhubLogo': '\uF130',
            'GiftboxOpen': '\uF133',
            'StatusCircleOuter': '\uF136',
            'StatusCircleInner': '\uF137',
            'StatusCircleRing': '\uF138',
            'StatusTriangleOuter': '\uF139',
            'StatusTriangleInner': '\uF13A',
            'StatusTriangleExclamation': '\uF13B',
            'StatusCircleExclamation': '\uF13C',
            'StatusCircleErrorX': '\uF13D',
            'StatusCircleInfo': '\uF13F',
            'StatusCircleBlock': '\uF140',
            'StatusCircleBlock2': '\uF141',
            'StatusCircleQuestionMark': '\uF142',
            'StatusCircleSync': '\uF143',
            'Toll': '\uF160',
            'ExploreContentSingle': '\uF164',
            'CollapseContent': '\uF165',
            'CollapseContentSingle': '\uF166',
            'InfoSolid': '\uF167',
            'GroupList': '\uF168',
            'ProgressRingDots': '\uF16A',
            'CaloriesAdd': '\uF172',
            'BranchFork': '\uF173',
            'MuteChat': '\uF17A',
            'AddHome': '\uF17B',
            'AddWork': '\uF17C',
            'MobileReport': '\uF18A',
            'ScaleVolume': '\uF18C',
            'HardDriveGroup': '\uF18F',
            'FastMode': '\uF19A',
            'ToggleLeft': '\uF19E',
            'ToggleRight': '\uF19F',
            'TriangleShape': '\uF1A7',
            'RectangleShape': '\uF1A9',
            'CubeShape': '\uF1AA',
            'Trophy2': '\uF1AE',
            'BucketColor': '\uF1B6',
            'BucketColorFill': '\uF1B7',
            'Taskboard': '\uF1C2',
            'SingleColumn': '\uF1D3',
            'DoubleColumn': '\uF1D4',
            'TripleColumn': '\uF1D5',
            'ColumnLeftTwoThirds': '\uF1D6',
            'ColumnRightTwoThirds': '\uF1D7',
            'AccessLogoFill': '\uF1DB',
            'AnalyticsLogo': '\uF1DE',
            'AnalyticsQuery': '\uF1DF',
            'NewAnalyticsQuery': '\uF1E0',
            'AnalyticsReport': '\uF1E1',
            'WordLogo': '\uF1E3',
            'WordLogoFill': '\uF1E4',
            'ExcelLogo': '\uF1E5',
            'ExcelLogoFill': '\uF1E6',
            'OneNoteLogo': '\uF1E7',
            'OneNoteLogoFill': '\uF1E8',
            'OutlookLogo': '\uF1E9',
            'OutlookLogoFill': '\uF1EA',
            'PowerPointLogo': '\uF1EB',
            'PowerPointLogoFill': '\uF1EC',
            'PublisherLogo': '\uF1ED',
            'PublisherLogoFill': '\uF1EE',
            'ScheduleEventAction': '\uF1EF',
            'FlameSolid': '\uF1F3',
            'ServerProcesses': '\uF1FE',
            'Server': '\uF201',
            'SaveAll': '\uF203',
            'LinkedInLogo': '\uF20A',
            'Decimals': '\uF218',
            'SidePanelMirrored': '\uF221',
            'ProtectRestrict': '\uF22A',
            'Blog': '\uF22B',
            'UnknownMirrored': '\uF22E',
            'PublicContactCardMirrored': '\uF230',
            'GridViewSmall': '\uF232',
            'GridViewMedium': '\uF233',
            'GridViewLarge': '\uF234',
            'Step': '\uF241',
            'StepInsert': '\uF242',
            'StepShared': '\uF243',
            'StepSharedAdd': '\uF244',
            'StepSharedInsert': '\uF245',
            'ViewDashboard': '\uF246',
            'ViewList': '\uF247'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-9.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-10.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_10_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-10\"",
            src: "url('".concat(baseUrl, "fabric-icons-10-c4ded8e4.woff') format('woff')")
        },
        icons: {
            'ViewListGroup': '\uF248',
            'ViewListTree': '\uF249',
            'TriggerAuto': '\uF24A',
            'TriggerUser': '\uF24B',
            'PivotChart': '\uF24C',
            'StackedBarChart': '\uF24D',
            'StackedLineChart': '\uF24E',
            'BuildQueue': '\uF24F',
            'BuildQueueNew': '\uF250',
            'UserFollowed': '\uF25C',
            'ContactLink': '\uF25F',
            'Stack': '\uF26F',
            'Bullseye': '\uF272',
            'VennDiagram': '\uF273',
            'FiveTileGrid': '\uF274',
            'FocalPoint': '\uF277',
            'Insert': '\uF278',
            'RingerRemove': '\uF279',
            'TeamsLogoInverse': '\uF27A',
            'TeamsLogo': '\uF27B',
            'TeamsLogoFill': '\uF27C',
            'SkypeForBusinessLogoFill': '\uF27D',
            'SharepointLogo': '\uF27E',
            'SharepointLogoFill': '\uF27F',
            'DelveLogo': '\uF280',
            'DelveLogoFill': '\uF281',
            'OfficeVideoLogo': '\uF282',
            'OfficeVideoLogoFill': '\uF283',
            'ExchangeLogo': '\uF284',
            'ExchangeLogoFill': '\uF285',
            'Signin': '\uF286',
            'DocumentApproval': '\uF28B',
            'CloneToDesktop': '\uF28C',
            'InstallToDrive': '\uF28D',
            'Blur': '\uF28E',
            'Build': '\uF28F',
            'ProcessMetaTask': '\uF290',
            'BranchFork2': '\uF291',
            'BranchLocked': '\uF292',
            'BranchCommit': '\uF293',
            'BranchCompare': '\uF294',
            'BranchMerge': '\uF295',
            'BranchPullRequest': '\uF296',
            'BranchSearch': '\uF297',
            'BranchShelveset': '\uF298',
            'RawSource': '\uF299',
            'MergeDuplicate': '\uF29A',
            'RowsGroup': '\uF29B',
            'RowsChild': '\uF29C',
            'Deploy': '\uF29D',
            'Redeploy': '\uF29E',
            'ServerEnviroment': '\uF29F',
            'VisioDiagram': '\uF2A0',
            'HighlightMappedShapes': '\uF2A1',
            'TextCallout': '\uF2A2',
            'IconSetsFlag': '\uF2A4',
            'VisioLogo': '\uF2A7',
            'VisioLogoFill': '\uF2A8',
            'VisioDocument': '\uF2A9',
            'TimelineProgress': '\uF2AA',
            'TimelineDelivery': '\uF2AB',
            'Backlog': '\uF2AC',
            'TeamFavorite': '\uF2AD',
            'TaskGroup': '\uF2AE',
            'TaskGroupMirrored': '\uF2AF',
            'ScopeTemplate': '\uF2B0',
            'AssessmentGroupTemplate': '\uF2B1',
            'NewTeamProject': '\uF2B2',
            'CommentAdd': '\uF2B3',
            'CommentNext': '\uF2B4',
            'CommentPrevious': '\uF2B5',
            'ShopServer': '\uF2B6',
            'LocaleLanguage': '\uF2B7',
            'QueryList': '\uF2B8',
            'UserSync': '\uF2B9',
            'UserPause': '\uF2BA',
            'StreamingOff': '\uF2BB',
            'ArrowTallUpLeft': '\uF2BD',
            'ArrowTallUpRight': '\uF2BE',
            'ArrowTallDownLeft': '\uF2BF',
            'ArrowTallDownRight': '\uF2C0',
            'FieldEmpty': '\uF2C1',
            'FieldFilled': '\uF2C2',
            'FieldChanged': '\uF2C3',
            'FieldNotChanged': '\uF2C4',
            'RingerOff': '\uF2C5',
            'PlayResume': '\uF2C6',
            'BulletedList2': '\uF2C7',
            'BulletedList2Mirrored': '\uF2C8',
            'ImageCrosshair': '\uF2C9',
            'GitGraph': '\uF2CA',
            'Repo': '\uF2CB',
            'RepoSolid': '\uF2CC',
            'FolderQuery': '\uF2CD',
            'FolderList': '\uF2CE',
            'FolderListMirrored': '\uF2CF',
            'LocationOutline': '\uF2D0',
            'POISolid': '\uF2D1',
            'CalculatorNotEqualTo': '\uF2D2',
            'BoxSubtractSolid': '\uF2D3'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-10.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-11.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_11_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-11\"",
            src: "url('".concat(baseUrl, "fabric-icons-11-2a8393d6.woff') format('woff')")
        },
        icons: {
            'BoxAdditionSolid': '\uF2D4',
            'BoxMultiplySolid': '\uF2D5',
            'BoxPlaySolid': '\uF2D6',
            'BoxCheckmarkSolid': '\uF2D7',
            'CirclePauseSolid': '\uF2D8',
            'CirclePause': '\uF2D9',
            'MSNVideosSolid': '\uF2DA',
            'CircleStopSolid': '\uF2DB',
            'CircleStop': '\uF2DC',
            'NavigateBack': '\uF2DD',
            'NavigateBackMirrored': '\uF2DE',
            'NavigateForward': '\uF2DF',
            'NavigateForwardMirrored': '\uF2E0',
            'UnknownSolid': '\uF2E1',
            'UnknownMirroredSolid': '\uF2E2',
            'CircleAddition': '\uF2E3',
            'CircleAdditionSolid': '\uF2E4',
            'FilePDB': '\uF2E5',
            'FileTemplate': '\uF2E6',
            'FileSQL': '\uF2E7',
            'FileJAVA': '\uF2E8',
            'FileASPX': '\uF2E9',
            'FileCSS': '\uF2EA',
            'FileSass': '\uF2EB',
            'FileLess': '\uF2EC',
            'FileHTML': '\uF2ED',
            'JavaScriptLanguage': '\uF2EE',
            'CSharpLanguage': '\uF2EF',
            'CSharp': '\uF2F0',
            'VisualBasicLanguage': '\uF2F1',
            'VB': '\uF2F2',
            'CPlusPlusLanguage': '\uF2F3',
            'CPlusPlus': '\uF2F4',
            'FSharpLanguage': '\uF2F5',
            'FSharp': '\uF2F6',
            'TypeScriptLanguage': '\uF2F7',
            'PythonLanguage': '\uF2F8',
            'PY': '\uF2F9',
            'CoffeeScript': '\uF2FA',
            'MarkDownLanguage': '\uF2FB',
            'FullWidth': '\uF2FE',
            'FullWidthEdit': '\uF2FF',
            'Plug': '\uF300',
            'PlugSolid': '\uF301',
            'PlugConnected': '\uF302',
            'PlugDisconnected': '\uF303',
            'UnlockSolid': '\uF304',
            'Variable': '\uF305',
            'Parameter': '\uF306',
            'CommentUrgent': '\uF307',
            'Storyboard': '\uF308',
            'DiffInline': '\uF309',
            'DiffSideBySide': '\uF30A',
            'ImageDiff': '\uF30B',
            'ImagePixel': '\uF30C',
            'FileBug': '\uF30D',
            'FileCode': '\uF30E',
            'FileComment': '\uF30F',
            'BusinessHoursSign': '\uF310',
            'FileImage': '\uF311',
            'FileSymlink': '\uF312',
            'AutoFillTemplate': '\uF313',
            'WorkItem': '\uF314',
            'WorkItemBug': '\uF315',
            'LogRemove': '\uF316',
            'ColumnOptions': '\uF317',
            'Packages': '\uF318',
            'BuildIssue': '\uF319',
            'AssessmentGroup': '\uF31A',
            'VariableGroup': '\uF31B',
            'FullHistory': '\uF31C',
            'Wheelchair': '\uF31F',
            'SingleColumnEdit': '\uF321',
            'DoubleColumnEdit': '\uF322',
            'TripleColumnEdit': '\uF323',
            'ColumnLeftTwoThirdsEdit': '\uF324',
            'ColumnRightTwoThirdsEdit': '\uF325',
            'StreamLogo': '\uF329',
            'PassiveAuthentication': '\uF32A',
            'AlertSolid': '\uF331',
            'MegaphoneSolid': '\uF332',
            'TaskSolid': '\uF333',
            'ConfigurationSolid': '\uF334',
            'BugSolid': '\uF335',
            'CrownSolid': '\uF336',
            'Trophy2Solid': '\uF337',
            'QuickNoteSolid': '\uF338',
            'ConstructionConeSolid': '\uF339',
            'PageListSolid': '\uF33A',
            'PageListMirroredSolid': '\uF33B',
            'StarburstSolid': '\uF33C',
            'ReadingModeSolid': '\uF33D',
            'SadSolid': '\uF33E',
            'HealthSolid': '\uF33F',
            'ShieldSolid': '\uF340',
            'GiftBoxSolid': '\uF341',
            'ShoppingCartSolid': '\uF342',
            'MailSolid': '\uF343',
            'ChatSolid': '\uF344',
            'RibbonSolid': '\uF345'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-11.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-12.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_12_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-12\"",
            src: "url('".concat(baseUrl, "fabric-icons-12-7e945a1e.woff') format('woff')")
        },
        icons: {
            'FinancialSolid': '\uF346',
            'FinancialMirroredSolid': '\uF347',
            'HeadsetSolid': '\uF348',
            'PermissionsSolid': '\uF349',
            'ParkingSolid': '\uF34A',
            'ParkingMirroredSolid': '\uF34B',
            'DiamondSolid': '\uF34C',
            'AsteriskSolid': '\uF34D',
            'OfflineStorageSolid': '\uF34E',
            'BankSolid': '\uF34F',
            'DecisionSolid': '\uF350',
            'Parachute': '\uF351',
            'ParachuteSolid': '\uF352',
            'FiltersSolid': '\uF353',
            'ColorSolid': '\uF354',
            'ReviewSolid': '\uF355',
            'ReviewRequestSolid': '\uF356',
            'ReviewRequestMirroredSolid': '\uF357',
            'ReviewResponseSolid': '\uF358',
            'FeedbackRequestSolid': '\uF359',
            'FeedbackRequestMirroredSolid': '\uF35A',
            'FeedbackResponseSolid': '\uF35B',
            'WorkItemBar': '\uF35C',
            'WorkItemBarSolid': '\uF35D',
            'Separator': '\uF35E',
            'NavigateExternalInline': '\uF35F',
            'PlanView': '\uF360',
            'TimelineMatrixView': '\uF361',
            'EngineeringGroup': '\uF362',
            'ProjectCollection': '\uF363',
            'CaretBottomRightCenter8': '\uF364',
            'CaretBottomLeftCenter8': '\uF365',
            'CaretTopRightCenter8': '\uF366',
            'CaretTopLeftCenter8': '\uF367',
            'DonutChart': '\uF368',
            'ChevronUnfold10': '\uF369',
            'ChevronFold10': '\uF36A',
            'DoubleChevronDown8': '\uF36B',
            'DoubleChevronUp8': '\uF36C',
            'DoubleChevronLeft8': '\uF36D',
            'DoubleChevronRight8': '\uF36E',
            'ChevronDownEnd6': '\uF36F',
            'ChevronUpEnd6': '\uF370',
            'ChevronLeftEnd6': '\uF371',
            'ChevronRightEnd6': '\uF372',
            'ContextMenu': '\uF37C',
            'AzureAPIManagement': '\uF37F',
            'AzureServiceEndpoint': '\uF380',
            'VSTSLogo': '\uF381',
            'VSTSAltLogo1': '\uF382',
            'VSTSAltLogo2': '\uF383',
            'FileTypeSolution': '\uF387',
            'WordLogoInverse16': '\uF390',
            'WordLogo16': '\uF391',
            'WordLogoFill16': '\uF392',
            'PowerPointLogoInverse16': '\uF393',
            'PowerPointLogo16': '\uF394',
            'PowerPointLogoFill16': '\uF395',
            'ExcelLogoInverse16': '\uF396',
            'ExcelLogo16': '\uF397',
            'ExcelLogoFill16': '\uF398',
            'OneNoteLogoInverse16': '\uF399',
            'OneNoteLogo16': '\uF39A',
            'OneNoteLogoFill16': '\uF39B',
            'OutlookLogoInverse16': '\uF39C',
            'OutlookLogo16': '\uF39D',
            'OutlookLogoFill16': '\uF39E',
            'PublisherLogoInverse16': '\uF39F',
            'PublisherLogo16': '\uF3A0',
            'PublisherLogoFill16': '\uF3A1',
            'VisioLogoInverse16': '\uF3A2',
            'VisioLogo16': '\uF3A3',
            'VisioLogoFill16': '\uF3A4',
            'TestBeaker': '\uF3A5',
            'TestBeakerSolid': '\uF3A6',
            'TestExploreSolid': '\uF3A7',
            'TestAutoSolid': '\uF3A8',
            'TestUserSolid': '\uF3A9',
            'TestImpactSolid': '\uF3AA',
            'TestPlan': '\uF3AB',
            'TestStep': '\uF3AC',
            'TestParameter': '\uF3AD',
            'TestSuite': '\uF3AE',
            'TestCase': '\uF3AF',
            'Sprint': '\uF3B0',
            'SignOut': '\uF3B1',
            'TriggerApproval': '\uF3B2',
            'Rocket': '\uF3B3',
            'AzureKeyVault': '\uF3B4',
            'Onboarding': '\uF3BA',
            'Transition': '\uF3BC',
            'LikeSolid': '\uF3BF',
            'DislikeSolid': '\uF3C0',
            'CRMCustomerInsightsApp': '\uF3C8',
            'EditCreate': '\uF3C9',
            'PlayReverseResume': '\uF3E4',
            'PlayReverse': '\uF3E5',
            'SearchData': '\uF3F1',
            'UnSetColor': '\uF3F9',
            'DeclineCall': '\uF405'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-12.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-13.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_13_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-13\"",
            src: "url('".concat(baseUrl, "fabric-icons-13-c3989a02.woff') format('woff')")
        },
        icons: {
            'RectangularClipping': '\uF407',
            'TeamsLogo16': '\uF40A',
            'TeamsLogoFill16': '\uF40B',
            'Spacer': '\uF40D',
            'SkypeLogo16': '\uF40E',
            'SkypeForBusinessLogo16': '\uF40F',
            'SkypeForBusinessLogoFill16': '\uF410',
            'FilterSolid': '\uF412',
            'MailUndelivered': '\uF415',
            'MailTentative': '\uF416',
            'MailTentativeMirrored': '\uF417',
            'MailReminder': '\uF418',
            'ReceiptUndelivered': '\uF419',
            'ReceiptTentative': '\uF41A',
            'ReceiptTentativeMirrored': '\uF41B',
            'Inbox': '\uF41C',
            'IRMReply': '\uF41D',
            'IRMReplyMirrored': '\uF41E',
            'IRMForward': '\uF41F',
            'IRMForwardMirrored': '\uF420',
            'VoicemailIRM': '\uF421',
            'EventAccepted': '\uF422',
            'EventTentative': '\uF423',
            'EventTentativeMirrored': '\uF424',
            'EventDeclined': '\uF425',
            'IDBadge': '\uF427',
            'BackgroundColor': '\uF42B',
            'OfficeFormsLogoInverse16': '\uF433',
            'OfficeFormsLogo': '\uF434',
            'OfficeFormsLogoFill': '\uF435',
            'OfficeFormsLogo16': '\uF436',
            'OfficeFormsLogoFill16': '\uF437',
            'OfficeFormsLogoInverse24': '\uF43A',
            'OfficeFormsLogo24': '\uF43B',
            'OfficeFormsLogoFill24': '\uF43C',
            'PageLock': '\uF43F',
            'NotExecuted': '\uF440',
            'NotImpactedSolid': '\uF441',
            'FieldReadOnly': '\uF442',
            'FieldRequired': '\uF443',
            'BacklogBoard': '\uF444',
            'ExternalBuild': '\uF445',
            'ExternalTFVC': '\uF446',
            'ExternalXAML': '\uF447',
            'IssueSolid': '\uF448',
            'DefectSolid': '\uF449',
            'LadybugSolid': '\uF44A',
            'NugetLogo': '\uF44C',
            'TFVCLogo': '\uF44D',
            'ProjectLogo32': '\uF47E',
            'ProjectLogoFill32': '\uF47F',
            'ProjectLogo16': '\uF480',
            'ProjectLogoFill16': '\uF481',
            'SwayLogo32': '\uF482',
            'SwayLogoFill32': '\uF483',
            'SwayLogo16': '\uF484',
            'SwayLogoFill16': '\uF485',
            'ClassNotebookLogo32': '\uF486',
            'ClassNotebookLogoFill32': '\uF487',
            'ClassNotebookLogo16': '\uF488',
            'ClassNotebookLogoFill16': '\uF489',
            'ClassNotebookLogoInverse32': '\uF48A',
            'ClassNotebookLogoInverse16': '\uF48B',
            'StaffNotebookLogo32': '\uF48C',
            'StaffNotebookLogoFill32': '\uF48D',
            'StaffNotebookLogo16': '\uF48E',
            'StaffNotebookLogoFill16': '\uF48F',
            'StaffNotebookLogoInverted32': '\uF490',
            'StaffNotebookLogoInverted16': '\uF491',
            'KaizalaLogo': '\uF492',
            'TaskLogo': '\uF493',
            'ProtectionCenterLogo32': '\uF494',
            'GallatinLogo': '\uF496',
            'Globe2': '\uF49A',
            'Guitar': '\uF49B',
            'Breakfast': '\uF49C',
            'Brunch': '\uF49D',
            'BeerMug': '\uF49E',
            'Vacation': '\uF49F',
            'Teeth': '\uF4A0',
            'Taxi': '\uF4A1',
            'Chopsticks': '\uF4A2',
            'SyncOccurence': '\uF4A3',
            'UnsyncOccurence': '\uF4A4',
            'GIF': '\uF4A9',
            'PrimaryCalendar': '\uF4AE',
            'SearchCalendar': '\uF4AF',
            'VideoOff': '\uF4B0',
            'MicrosoftFlowLogo': '\uF4B1',
            'BusinessCenterLogo': '\uF4B2',
            'ToDoLogoBottom': '\uF4B3',
            'ToDoLogoTop': '\uF4B4',
            'EditSolid12': '\uF4B5',
            'EditSolidMirrored12': '\uF4B6',
            'UneditableSolid12': '\uF4B7',
            'UneditableSolidMirrored12': '\uF4B8',
            'UneditableMirrored': '\uF4B9',
            'AdminALogo32': '\uF4BA',
            'AdminALogoFill32': '\uF4BB',
            'ToDoLogoInverse': '\uF4BC'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-13.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-14.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_14_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-14\"",
            src: "url('".concat(baseUrl, "fabric-icons-14-5cf58db8.woff') format('woff')")
        },
        icons: {
            'Snooze': '\uF4BD',
            'WaffleOffice365': '\uF4E0',
            'ImageSearch': '\uF4E8',
            'NewsSearch': '\uF4E9',
            'VideoSearch': '\uF4EA',
            'R': '\uF4EB',
            'FontColorA': '\uF4EC',
            'FontColorSwatch': '\uF4ED',
            'LightWeight': '\uF4EE',
            'NormalWeight': '\uF4EF',
            'SemiboldWeight': '\uF4F0',
            'GroupObject': '\uF4F1',
            'UngroupObject': '\uF4F2',
            'AlignHorizontalLeft': '\uF4F3',
            'AlignHorizontalCenter': '\uF4F4',
            'AlignHorizontalRight': '\uF4F5',
            'AlignVerticalTop': '\uF4F6',
            'AlignVerticalCenter': '\uF4F7',
            'AlignVerticalBottom': '\uF4F8',
            'HorizontalDistributeCenter': '\uF4F9',
            'VerticalDistributeCenter': '\uF4FA',
            'Ellipse': '\uF4FB',
            'Line': '\uF4FC',
            'Octagon': '\uF4FD',
            'Hexagon': '\uF4FE',
            'Pentagon': '\uF4FF',
            'RightTriangle': '\uF500',
            'HalfCircle': '\uF501',
            'QuarterCircle': '\uF502',
            'ThreeQuarterCircle': '\uF503',
            '6PointStar': '\uF504',
            '12PointStar': '\uF505',
            'ArrangeBringToFront': '\uF506',
            'ArrangeSendToBack': '\uF507',
            'ArrangeSendBackward': '\uF508',
            'ArrangeBringForward': '\uF509',
            'BorderDash': '\uF50A',
            'BorderDot': '\uF50B',
            'LineStyle': '\uF50C',
            'LineThickness': '\uF50D',
            'WindowEdit': '\uF50E',
            'HintText': '\uF50F',
            'MediaAdd': '\uF510',
            'AnchorLock': '\uF511',
            'AutoHeight': '\uF512',
            'ChartSeries': '\uF513',
            'ChartXAngle': '\uF514',
            'ChartYAngle': '\uF515',
            'Combobox': '\uF516',
            'LineSpacing': '\uF517',
            'Padding': '\uF518',
            'PaddingTop': '\uF519',
            'PaddingBottom': '\uF51A',
            'PaddingLeft': '\uF51B',
            'PaddingRight': '\uF51C',
            'NavigationFlipper': '\uF51D',
            'AlignJustify': '\uF51E',
            'TextOverflow': '\uF51F',
            'VisualsFolder': '\uF520',
            'VisualsStore': '\uF521',
            'PictureCenter': '\uF522',
            'PictureFill': '\uF523',
            'PicturePosition': '\uF524',
            'PictureStretch': '\uF525',
            'PictureTile': '\uF526',
            'Slider': '\uF527',
            'SliderHandleSize': '\uF528',
            'DefaultRatio': '\uF529',
            'NumberSequence': '\uF52A',
            'GUID': '\uF52B',
            'ReportAdd': '\uF52C',
            'DashboardAdd': '\uF52D',
            'MapPinSolid': '\uF52E',
            'WebPublish': '\uF52F',
            'PieSingleSolid': '\uF530',
            'BlockedSolid': '\uF531',
            'DrillDown': '\uF532',
            'DrillDownSolid': '\uF533',
            'DrillExpand': '\uF534',
            'DrillShow': '\uF535',
            'SpecialEvent': '\uF536',
            'OneDriveFolder16': '\uF53B',
            'FunctionalManagerDashboard': '\uF542',
            'BIDashboard': '\uF543',
            'CodeEdit': '\uF544',
            'RenewalCurrent': '\uF545',
            'RenewalFuture': '\uF546',
            'SplitObject': '\uF547',
            'BulkUpload': '\uF548',
            'DownloadDocument': '\uF549',
            'GreetingCard': '\uF54B',
            'Flower': '\uF54E',
            'WaitlistConfirm': '\uF550',
            'WaitlistConfirmMirrored': '\uF551',
            'LaptopSecure': '\uF552',
            'DragObject': '\uF553',
            'EntryView': '\uF554',
            'EntryDecline': '\uF555',
            'ContactCardSettings': '\uF556',
            'ContactCardSettingsMirrored': '\uF557'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-14.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-15.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_15_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-15\"",
            src: "url('".concat(baseUrl, "fabric-icons-15-3807251b.woff') format('woff')")
        },
        icons: {
            'CalendarSettings': '\uF558',
            'CalendarSettingsMirrored': '\uF559',
            'HardDriveLock': '\uF55A',
            'HardDriveUnlock': '\uF55B',
            'AccountManagement': '\uF55C',
            'ReportWarning': '\uF569',
            'TransitionPop': '\uF5B2',
            'TransitionPush': '\uF5B3',
            'TransitionEffect': '\uF5B4',
            'LookupEntities': '\uF5B5',
            'ExploreData': '\uF5B6',
            'AddBookmark': '\uF5B7',
            'SearchBookmark': '\uF5B8',
            'DrillThrough': '\uF5B9',
            'MasterDatabase': '\uF5BA',
            'CertifiedDatabase': '\uF5BB',
            'MaximumValue': '\uF5BC',
            'MinimumValue': '\uF5BD',
            'VisualStudioIDELogo32': '\uF5D0',
            'PasteAsText': '\uF5D5',
            'PasteAsCode': '\uF5D6',
            'BrowserTab': '\uF5D7',
            'BrowserTabScreenshot': '\uF5D8',
            'DesktopScreenshot': '\uF5D9',
            'FileYML': '\uF5DA',
            'ClipboardSolid': '\uF5DC',
            'FabricUserFolder': '\uF5E5',
            'FabricNetworkFolder': '\uF5E6',
            'BullseyeTarget': '\uF5F0',
            'AnalyticsView': '\uF5F1',
            'Video360Generic': '\uF609',
            'Untag': '\uF60B',
            'Leave': '\uF627',
            'Trending12': '\uF62D',
            'Blocked12': '\uF62E',
            'Warning12': '\uF62F',
            'CheckedOutByOther12': '\uF630',
            'CheckedOutByYou12': '\uF631',
            'CircleShapeSolid': '\uF63C',
            'SquareShapeSolid': '\uF63D',
            'TriangleShapeSolid': '\uF63E',
            'DropShapeSolid': '\uF63F',
            'RectangleShapeSolid': '\uF640',
            'ZoomToFit': '\uF649',
            'InsertColumnsLeft': '\uF64A',
            'InsertColumnsRight': '\uF64B',
            'InsertRowsAbove': '\uF64C',
            'InsertRowsBelow': '\uF64D',
            'DeleteColumns': '\uF64E',
            'DeleteRows': '\uF64F',
            'DeleteRowsMirrored': '\uF650',
            'DeleteTable': '\uF651',
            'AccountBrowser': '\uF652',
            'VersionControlPush': '\uF664',
            'StackedColumnChart2': '\uF666',
            'TripleColumnWide': '\uF66E',
            'QuadColumn': '\uF66F',
            'WhiteBoardApp16': '\uF673',
            'WhiteBoardApp32': '\uF674',
            'PinnedSolid': '\uF676',
            'InsertSignatureLine': '\uF677',
            'ArrangeByFrom': '\uF678',
            'Phishing': '\uF679',
            'CreateMailRule': '\uF67A',
            'PublishCourse': '\uF699',
            'DictionaryRemove': '\uF69A',
            'UserRemove': '\uF69B',
            'UserEvent': '\uF69C',
            'Encryption': '\uF69D',
            'PasswordField': '\uF6AA',
            'OpenInNewTab': '\uF6AB',
            'Hide3': '\uF6AC',
            'VerifiedBrandSolid': '\uF6AD',
            'MarkAsProtected': '\uF6AE',
            'AuthenticatorApp': '\uF6B1',
            'WebTemplate': '\uF6B2',
            'DefenderTVM': '\uF6B3',
            'MedalSolid': '\uF6B9',
            'D365TalentLearn': '\uF6BB',
            'D365TalentInsight': '\uF6BC',
            'D365TalentHRCore': '\uF6BD',
            'BacklogList': '\uF6BF',
            'ButtonControl': '\uF6C0',
            'TableGroup': '\uF6D9',
            'MountainClimbing': '\uF6DB',
            'TagUnknown': '\uF6DF',
            'TagUnknownMirror': '\uF6E0',
            'TagUnknown12': '\uF6E1',
            'TagUnknown12Mirror': '\uF6E2',
            'Link12': '\uF6E3',
            'Presentation': '\uF6E4',
            'Presentation12': '\uF6E5',
            'Lock12': '\uF6E6',
            'BuildDefinition': '\uF6E9',
            'ReleaseDefinition': '\uF6EA',
            'SaveTemplate': '\uF6EC',
            'UserGauge': '\uF6ED',
            'BlockedSiteSolid12': '\uF70A',
            'TagSolid': '\uF70E',
            'OfficeChat': '\uF70F'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-15.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-16.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_16_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-16\"",
            src: "url('".concat(baseUrl, "fabric-icons-16-9cf93f3b.woff') format('woff')")
        },
        icons: {
            'OfficeChatSolid': '\uF710',
            'MailSchedule': '\uF72E',
            'WarningSolid': '\uF736',
            'Blocked2Solid': '\uF737',
            'SkypeCircleArrow': '\uF747',
            'SkypeArrow': '\uF748',
            'SyncStatus': '\uF751',
            'SyncStatusSolid': '\uF752',
            'ProjectDocument': '\uF759',
            'ToDoLogoOutline': '\uF75B',
            'VisioOnlineLogoFill32': '\uF75F',
            'VisioOnlineLogo32': '\uF760',
            'VisioOnlineLogoCloud32': '\uF761',
            'VisioDiagramSync': '\uF762',
            'Event12': '\uF763',
            'EventDateMissed12': '\uF764',
            'UserOptional': '\uF767',
            'ResponsesMenu': '\uF768',
            'DoubleDownArrow': '\uF769',
            'DistributeDown': '\uF76A',
            'BookmarkReport': '\uF76B',
            'FilterSettings': '\uF76C',
            'GripperDotsVertical': '\uF772',
            'MailAttached': '\uF774',
            'AddIn': '\uF775',
            'LinkedDatabase': '\uF779',
            'TableLink': '\uF77A',
            'PromotedDatabase': '\uF77D',
            'BarChartVerticalFilter': '\uF77E',
            'BarChartVerticalFilterSolid': '\uF77F',
            'MicOff2': '\uF781',
            'MicrosoftTranslatorLogo': '\uF782',
            'ShowTimeAs': '\uF787',
            'FileRequest': '\uF789',
            'WorkItemAlert': '\uF78F',
            'PowerBILogo16': '\uF790',
            'PowerBILogoBackplate16': '\uF791',
            'BulletedListText': '\uF792',
            'BulletedListBullet': '\uF793',
            'BulletedListTextMirrored': '\uF794',
            'BulletedListBulletMirrored': '\uF795',
            'NumberedListText': '\uF796',
            'NumberedListNumber': '\uF797',
            'NumberedListTextMirrored': '\uF798',
            'NumberedListNumberMirrored': '\uF799',
            'RemoveLinkChain': '\uF79A',
            'RemoveLinkX': '\uF79B',
            'FabricTextHighlight': '\uF79C',
            'ClearFormattingA': '\uF79D',
            'ClearFormattingEraser': '\uF79E',
            'Photo2Fill': '\uF79F',
            'IncreaseIndentText': '\uF7A0',
            'IncreaseIndentArrow': '\uF7A1',
            'DecreaseIndentText': '\uF7A2',
            'DecreaseIndentArrow': '\uF7A3',
            'IncreaseIndentTextMirrored': '\uF7A4',
            'IncreaseIndentArrowMirrored': '\uF7A5',
            'DecreaseIndentTextMirrored': '\uF7A6',
            'DecreaseIndentArrowMirrored': '\uF7A7',
            'CheckListText': '\uF7A8',
            'CheckListCheck': '\uF7A9',
            'CheckListTextMirrored': '\uF7AA',
            'CheckListCheckMirrored': '\uF7AB',
            'NumberSymbol': '\uF7AC',
            'Coupon': '\uF7BC',
            'VerifiedBrand': '\uF7BD',
            'ReleaseGate': '\uF7BE',
            'ReleaseGateCheck': '\uF7BF',
            'ReleaseGateError': '\uF7C0',
            'M365InvoicingLogo': '\uF7C1',
            'RemoveFromShoppingList': '\uF7D5',
            'ShieldAlert': '\uF7D7',
            'FabricTextHighlightComposite': '\uF7DA',
            'Dataflows': '\uF7DD',
            'GenericScanFilled': '\uF7DE',
            'DiagnosticDataBarTooltip': '\uF7DF',
            'SaveToMobile': '\uF7E0',
            'Orientation2': '\uF7E1',
            'ScreenCast': '\uF7E2',
            'ShowGrid': '\uF7E3',
            'SnapToGrid': '\uF7E4',
            'ContactList': '\uF7E5',
            'NewMail': '\uF7EA',
            'EyeShadow': '\uF7EB',
            'FabricFolderConfirm': '\uF7FF',
            'InformationBarriers': '\uF803',
            'CommentActive': '\uF804',
            'ColumnVerticalSectionEdit': '\uF806',
            'WavingHand': '\uF807',
            'ShakeDevice': '\uF80A',
            'SmartGlassRemote': '\uF80B',
            'Rotate90Clockwise': '\uF80D',
            'Rotate90CounterClockwise': '\uF80E',
            'CampaignTemplate': '\uF811',
            'ChartTemplate': '\uF812',
            'PageListFilter': '\uF813',
            'SecondaryNav': '\uF814',
            'ColumnVerticalSection': '\uF81E',
            'SkypeCircleSlash': '\uF825',
            'SkypeSlash': '\uF826'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-16.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/fabric-icons-17.js
// Your use of the content in the files referenced here is subject to the terms of the license at https://aka.ms/fluentui-assets-license

function fabric_icons_17_initializeIcons(baseUrl, options) {
    if (baseUrl === void 0) { baseUrl = ''; }
    var subset = {
        style: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            fontStyle: 'normal',
            fontWeight: 'normal',
            speak: 'none'
        },
        fontFace: {
            fontFamily: "\"FabricMDL2Icons-17\"",
            src: "url('".concat(baseUrl, "fabric-icons-17-0c4ed701.woff') format('woff')")
        },
        icons: {
            'CustomizeToolbar': '\uF828',
            'DuplicateRow': '\uF82A',
            'RemoveFromTrash': '\uF82B',
            'MailOptions': '\uF82C',
            'Childof': '\uF82D',
            'Footer': '\uF82E',
            'Header': '\uF82F',
            'BarChartVerticalFill': '\uF830',
            'StackedColumnChart2Fill': '\uF831',
            'PlainText': '\uF834',
            'AccessibiltyChecker': '\uF835',
            'DatabaseSync': '\uF842',
            'ReservationOrders': '\uF845',
            'TabOneColumn': '\uF849',
            'TabTwoColumn': '\uF84A',
            'TabThreeColumn': '\uF84B',
            'BulletedTreeList': '\uF84C',
            'MicrosoftTranslatorLogoGreen': '\uF852',
            'MicrosoftTranslatorLogoBlue': '\uF853',
            'InternalInvestigation': '\uF854',
            'AddReaction': '\uF85D',
            'ContactHeart': '\uF862',
            'VisuallyImpaired': '\uF866',
            'EventToDoLogo': '\uF869',
            'Variable2': '\uF86D',
            'ModelingView': '\uF871',
            'DisconnectVirtualMachine': '\uF873',
            'ReportLock': '\uF875',
            'Uneditable2': '\uF876',
            'Uneditable2Mirrored': '\uF877',
            'BarChartVerticalEdit': '\uF89D',
            'GlobalNavButtonActive': '\uF89F',
            'PollResults': '\uF8A0',
            'Rerun': '\uF8A1',
            'QandA': '\uF8A2',
            'QandAMirror': '\uF8A3',
            'BookAnswers': '\uF8A4',
            'AlertSettings': '\uF8B6',
            'TrimStart': '\uF8BB',
            'TrimEnd': '\uF8BC',
            'TableComputed': '\uF8F5',
            'DecreaseIndentLegacy': '\uE290',
            'IncreaseIndentLegacy': '\uE291',
            'SizeLegacy': '\uE2B2'
        }
    };
    registerIcons(subset, options);
}
//# sourceMappingURL=fabric-icons-17.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/iconAliases.js

var registerIconAliases = function () {
    registerIconAlias('trash', 'delete');
    registerIconAlias('onedrive', 'onedrivelogo');
    registerIconAlias('alertsolid12', 'eventdatemissed12');
    registerIconAlias('sixpointstar', '6pointstar');
    registerIconAlias('twelvepointstar', '12pointstar');
    registerIconAlias('toggleon', 'toggleleft');
    registerIconAlias('toggleoff', 'toggleright');
};
/* harmony default export */ var iconAliases = ((/* unused pure expression or super */ null && (registerIconAliases)));
//# sourceMappingURL=iconAliases.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/version.js
// Do not modify this file; it is generated as part of publish.
// The checked in version is a placeholder only and will not be updated.

setVersion('@fluentui/font-icons-mdl2', '8.5.36');
//# sourceMappingURL=version.js.map
;// CONCATENATED MODULE: ./node_modules/@fluentui/font-icons-mdl2/lib/index.js






















var DEFAULT_BASE_URL = "".concat(FLUENT_CDN_BASE_URL, "/assets/icons/");
var win = getWindow_getWindow();
function lib_initializeIcons(baseUrl, options) {
    var _a, _b;
    if (baseUrl === void 0) { baseUrl = ((_a = win === null || win === void 0 ? void 0 : win.FabricConfig) === null || _a === void 0 ? void 0 : _a.iconBaseUrl) || ((_b = win === null || win === void 0 ? void 0 : win.FabricConfig) === null || _b === void 0 ? void 0 : _b.fontBaseUrl) || DEFAULT_BASE_URL; }
    [initializeIcons, fabric_icons_0_initializeIcons, fabric_icons_1_initializeIcons, fabric_icons_2_initializeIcons, fabric_icons_3_initializeIcons, fabric_icons_4_initializeIcons, fabric_icons_5_initializeIcons, fabric_icons_6_initializeIcons, fabric_icons_7_initializeIcons, fabric_icons_8_initializeIcons, fabric_icons_9_initializeIcons, fabric_icons_10_initializeIcons, fabric_icons_11_initializeIcons, fabric_icons_12_initializeIcons, fabric_icons_13_initializeIcons, fabric_icons_14_initializeIcons, fabric_icons_15_initializeIcons, fabric_icons_16_initializeIcons, fabric_icons_17_initializeIcons].forEach(function (initialize) { return initialize(baseUrl, options); });
    registerIconAliases();
}
/* eslint-enable deprecation/deprecation */

//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./src/index.jsx




lib_initializeIcons();

/* global document, Office, module, require */

var title = "Contoso Task Pane Add-in";
var rootElement = document.getElementById("container");
var root = (0,client/* createRoot */.H)(rootElement);
Office.onReady(function () {
  root.render( /*#__PURE__*/react.createElement(src_App, null));
});
if (false) {}
}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/* harmony import */ var _microsoft_microsoft_graph_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68454);
/* provided dependency */ var Promise = __webpack_require__(64583)["Promise"];
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Office */

var console = window.console;
var OfficeAuthProvider = /*#__PURE__*/function () {
  function OfficeAuthProvider() {
    _classCallCheck(this, OfficeAuthProvider);
  }
  return _createClass(OfficeAuthProvider, [{
    key: "getAccessToken",
    value: function () {
      var _getAccessToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(AuthenticationProviderOptions) {
        var tokenPromise;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              tokenPromise = Office.auth.getAccessToken({
                allowConsentPrompt: true,
                allowSignInPrompt: true,
                forMSGraphAccess: false
              });
              console.log(tokenPromise);
              return _context.abrupt("return", tokenPromise);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getAccessToken(_x) {
        return _getAccessToken.apply(this, arguments);
      }
      return getAccessToken;
    }()
  }]);
}();
var authProvider = new OfficeAuthProvider();
var client = _microsoft_microsoft_graph_client__WEBPACK_IMPORTED_MODULE_0__/* .Client */ .Kj.initWithMiddleware({
  authProvider: authProvider
});
function claimEmail(_x2) {
  return _claimEmail.apply(this, arguments);
}
function _claimEmail() {
  _claimEmail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
    var consoleMsg, message, comment, messageRestID, forward;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Claiming email...");
          consoleMsg = ""; //Get currently selected message reference
          message = Office.context.mailbox.item;
          if (!(message == undefined || message.internetMessageId.length == 0 || message.itemId.length == 0)) {
            _context2.next = 6;
            break;
          }
          event.completed();
          return _context2.abrupt("return");
        case 6:
          comment = "Claiming email:" + message.internetMessageId; //TODO: Determine if the message is claimed already
          //Convert the message EWS ID to REST ID
          messageRestID = Office.context.mailbox.convertToRestId(message.itemId, Office.MailboxEnums.RestVersion.v2_0); //Check to see if we are in a shared inbox
          if (!message.getSharedPropertiesAsync) {
            _context2.next = 21;
            break;
          }
          _context2.prev = 9;
          _context2.next = 12;
          return client.api("/users/techsupport@sjcd.edu/" + messageRestID).update({
            flag: {
              flagStatus: "flagged"
            }
          });
        case 12:
          _context2.next = 14;
          return client.api("/users/techsupport@sjcd.edu/" + messageRestID + "/forward").post({
            comment: comment,
            toRecipients: [{
              emailAddress: {
                name: "San Jacinto College Tech Support",
                address: "techsupport@sjcd.edu"
              }
            }]
          });
        case 14:
          _context2.next = 19;
          break;
        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](9);
          console.log(_context2.t0);
        case 19:
          _context2.next = 32;
          break;
        case 21:
          forward = {
            comment: comment,
            toRecipients: [{
              emailAddress: {
                name: "Jose Mendez",
                address: "jose.mendez@sjcd.edu"
              }
            }]
          };
          _context2.prev = 22;
          _context2.next = 25;
          return client.api("/me/messages/" + messageRestID).update({
            flag: {
              flagStatus: "flagged"
            }
          });
        case 25:
          _context2.next = 27;
          return client.api("/me/messages/" + messageRestID + "/forward").post(forward);
        case 27:
          _context2.next = 32;
          break;
        case 29:
          _context2.prev = 29;
          _context2.t1 = _context2["catch"](22);
          console.log(_context2.t1);
        case 32:
          message.notificationMessages.addAsync("errors", {
            key: "error",
            message: consoleMsg,
            persistent: false,
            type: Office.MailboxEnums.ItemNotificationMessageType
          });
          event.completed();
        case 34:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[9, 16], [22, 29]]);
  }));
  return _claimEmail.apply(this, arguments);
}
function getAgentName() {
  var fullName = Office.context.mailbox.userProfile.displayName;
  return fullName.split(",")[1] + " " + fullName.split(",")[0];
}
Office.actions.associate("claimEmail", claimEmail);
}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// Module
var code = (/* unused pure expression or super */ null && (" <!doctype html> <html lang=\"en\" data-framework=\"javascript\"> <head> <meta charset=\"UTF-8\"/> <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\"/> <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"> <title>Contoso Task Pane Add-in</title> <" + "script src=\"https://appsforoffice.microsoft.com/lib/1/hosted/office.js\"><" + "/script> </head> <body style=\"width:100%;height:100%;margin:0;padding:0\"> <div id=\"container\"></div> <div id=\"tridentmessage\" style=\"display:none;padding:10\"> This add-in will not run in your version of Office. Please upgrade either to perpetual Office 2021 (or later) or to a Microsoft 365 account. </div> <" + "script>if(-1!==navigator.userAgent.indexOf(\"Trident\")||-1!==navigator.userAgent.indexOf(\"Edge\")){var tridentMessage=document.getElementById(\"tridentmessage\"),normalContainer=document.getElementById(\"container\");tridentMessage.style.display=\"block\",normalContainer.style.display=\"none\"}<" + "/script> </body> </html> "));
// Exports
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (code)));
}();
/******/ })()
;
//# sourceMappingURL=index.js.map