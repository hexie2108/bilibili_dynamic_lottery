/**
 * 管理fetch请求
 *
 */

const fetch = require("node-fetch");
const AbortController = require("abort-controller");
const Headers = require('fetch-headers');


//10 seconds for timeout
const timeOutTime = 10 * 1000;


/**
 * create a basic fetch request
 * @param url
 * @param options for request
 * @param {int} timeOutTime
 * @return {Object} response data
 */
async function request(url, options, timeOutTime) {
    try {

        //create a new abortController for this request
        let abortController = new AbortController();
        let signal = abortController.signal;

        let requestOptions = Object.assign(
            {
                //enable the  sending of cookie
                // credentials: 'include',
                "mode": 'cors',
                "signal": signal
            },
            options
        );

        //set timeout clock
        let timer = setTimeout(() => abortController.abort(), timeOutTime);

        let response = await fetch(url, requestOptions);

        //clear timeout clock
        clearTimeout(timer);

        //parse response data
        response.data = await parseResponseData(response);
        return  response;
    }
    catch (error) {

        // console.dir(error.message);
        return error;

    }
}

/**
 * get method
 * @param url
 * @param {Object} queryData query string
 * @return {Object} response data
 */
async function get(url, queryData = null) {

    let query = "";
    //concatenate the parameters in url
    if (queryData) {
        query = "?";
        for (let key in queryData) {
            query += key + "=" + encodeURIComponent(queryData[key]).replace(/\(/g, "%28").replace(/\)/g, "%29") + "&";
        }
        //delete the last &
        query = query.slice(0, query.length - 1);
    }

    //create a header
    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    jsonHeaders.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
 

    let options = {
        "method": 'GET',
        "headers": jsonHeaders,
    };

    return await request(url + query, options, timeOutTime);
}

/**
 * internal function to parse the response of  http request
 * @param response response object
 * @return {Object} data parsed
 */
async function parseResponseData(response) {

    //get response data type
    const contentType = response.headers.get('Content-Type');
    let data = null;

    //parse the data by its type
    if (contentType != null) {
        if (contentType.indexOf('text') > -1) {
            data = await response.text()
        }
        else if (contentType.indexOf('video') > -1) {
            data = await response.blob();
        }
        else if (contentType.indexOf('json') > -1) {
            data = await response.json();
        }
        else {
            data = await response.text();
        }
    }
    else{
        data = await response.text();
    }

    return data;
}

//object to export
const http = {
    get
};


module.exports = http;
