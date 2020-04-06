// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {errorResponse, runWarm} from './utils';

const responseTypes = ['in_channel', 'comment'];

function getWebhookResponse(body, query, override) {
    const username = override.username ? ` --> ${override.username}` : '';
    const iconUrl = override.iconUrl ? ` --> ${override.iconUrl}` : '';

    return `
    #### Outgoing Webhook Payload
    - token: "${body.token}"
    - team_id: "${body.team_id}"
    - team_domain: "${body.team_domain}"
    - channel_id: "${body.channel_id}"
    - channel_name: "${body.channel_name}"
    - timestamp: "${body.timestamp}"
    - user_id: "${body.user_id}"
    - user_name: "${body.user_name}"
    - post_id: "${body.post_id}"
    - text: "${body.text}"
    - trigger_word: "${body.trigger_word}"
    - file_ids: "${body.file_ids}"

    #### Override
    - responseType: "${(query && query.response_type) || ''}"
    - username: "${(query && query.override_username) || ''}${username}"
    - iconUrl: "${(query && query.override_icon_url) || ''}${iconUrl}"
    `;
}

const postWebhook = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const query = event.queryStringParameters;

    const responseType = (query && query.response_type) || responseTypes[0];
    const username = query && query.override_username === 'true' ? 'user_override' : '';
    const iconUrl =
        query && query.override_icon_url === 'true'
            ? 'http://www.mattermost.org/wp-content/uploads/2016/04/icon.png'
            : '';

    if (body) {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                text: getWebhookResponse(body, query, {
                    iconUrl,
                    username,
                    responseType,
                }),
                username,
                icon_url: iconUrl,
                type: '',
                response_type: responseType,
            }),
        };

        callback(null, response);
    } else {
        const response = errorResponse({
            err: {message: 'Invalid data'},
        });
        callback(null, response);
    }
};

export default runWarm(postWebhook);
