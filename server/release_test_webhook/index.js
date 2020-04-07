const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;

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

app.post('/', (req, res) => {
    const {body, query} = req;
    if (!body) {
        res.status(404).send({error: 'Invalid data'});
    }

    const responseType = (query && query.response_type) || responseTypes[0];
    const username = query && query.override_username === 'true' ? 'user_override' : '';
    const iconUrl =
        query && query.override_icon_url === 'true'
            ? 'http://www.mattermost.org/wp-content/uploads/2016/04/icon.png'
            : '';

    const response = {
        text: getWebhookResponse(body, query, {
            iconUrl,
            username,
            responseType,
        }),
        username,
        icon_url: iconUrl,
        type: '',
        response_type: responseType,
    };
    res.status(200).send(response);
});

app.listen(port, () => console.log(`Server app listening at http://localhost:${port}`));
