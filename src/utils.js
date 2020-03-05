// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

function lambdaResponse({json, statusCode, allowCORS = false}) {
    let response = {
        statusCode,
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (allowCORS) {
        response.headers['Access-Control-Allow-Origin'] = '*';
    }

    return response;
}

export function errorResponse(json) {
    return lambdaResponse({
        json,
        statusCode: 500,
    });
}

export function corsErrorResponse(json) {
    return lambdaResponse({
        json,
        statusCode: 500,
        allowCORS: true,
    });
}

export function successResponse(json) {
    return lambdaResponse({
        json,
        statusCode: 200,
    });
}

export function corsSuccessResponse(json) {
    return lambdaResponse({
        json,
        statusCode: 200,
        allowCORS: true,
    });
}

export const runWarm = (lambdaFunc) => (event, context, callback) => {
    if (event.source === 'aws.events') {
        return callback(null, 'pinged');
    }

    return lambdaFunc(event, context, callback);
};

const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 100;

export function getQueryParams(queryString) {
    let isChrome, page, perPage;
    let chromeParam, pageParam, perPageParam;
    if (queryString) {
        chromeParam = queryString.chrome;
        pageParam = queryString.page;
        perPageParam = queryString.per_page;
    }

    isChrome = chromeParam === 'true';
    page = !isNaN(parseInt(pageParam, 10))
        ? parseInt(pageParam, 10)
        : DEFAULT_PAGE;
    perPage = !isNaN(parseInt(perPageParam, 10))
        ? parseInt(perPageParam, 10)
        : DEFAULT_PER_PAGE;

    return {
        isChrome,
        page,
        perPage,
    };
}
