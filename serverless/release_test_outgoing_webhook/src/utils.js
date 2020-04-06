// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

function lambdaResponse({json, statusCode, allowCORS = false}) {
    const response = {
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
