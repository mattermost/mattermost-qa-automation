const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = 3000;

app.post('/', (req, res) => {
    const channelId = req.query.channel_id;

    const response = {
        response_type: 'in_channel',
        type: 'system_message',
        text: 'Extra response 2',
        channel_id: channelId,
        extra_responses: [
            {
                response_type: 'in_channel',
                text: 'Hello World',
                channel_id: channelId,
            },
        ],
    };
    res.status(200).send(response);
});

app.listen(port, () => console.log(`Server app listening at http://localhost:${port}`));
