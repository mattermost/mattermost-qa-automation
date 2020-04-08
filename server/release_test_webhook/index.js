const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;

const responseTypes = ['in_channel', 'comment'];

function getWebhookResponse(body, {responseType, username, iconUrl}) {
    const payload = Object.entries(body)
        .map(([key, value]) => `- ${key}: "${value}"`)
        .join('\n');

    return `
\`\`\`
#### Outgoing Webhook Payload
${payload}

#### Webhook override to Mattermost instance
- response_type: "${responseType}"
- type: ""
- username: "${username}"
- icon_url: "${iconUrl}"
\`\`\`
`;
}

app.post('/', (req, res) => {
    const {body, query} = req;
    if (!body) {
        res.status(404).send({error: 'Invalid data'});
    }

    const responseType = query.response_type || responseTypes[0];
    const username = query.override_username || '';
    const iconUrl = query.override_icon_url || '';

    const response = {
        text: getWebhookResponse(body, {responseType, username, iconUrl}),
        username,
        icon_url: iconUrl,
        type: '',
        response_type: responseType,
    };
    res.status(200).send(response);
});

app.listen(port, () => console.log(`Server app listening at http://localhost:${port}`));
