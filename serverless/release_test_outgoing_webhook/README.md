## Release Test for Integrations: Outgoing Webhook

This is the outgoing webhook that is used for Release testing - Integrations. 

#### Offline/local development

```
npm run serve
```

On local development, base URL is by default accessible at ``http://localhost:4000``

#### Deploy

Requirements:
1. AWS profile should be set properly with corresponding ``aws_access_key_id`` and ``aws_secret_access_key``. See https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html on how to set named profile.  Once set, uncomment ``# profile: dev-aws`` at ``serverless.yaml`` file and enter profile name.

```
npm run deploy:production
```

#### Lambda functions
1. ``POST /outgoing_webhook``

a. To override username, add ``override_username=true`` as query parameter to apply the predefined ``user_override`` username.
```bash
/outgoing_webhook?override_username=true
```
b. To override profile picture, add ``override_icon_url=true`` as query parameter to apply the predefined ``http://www.mattermost.org/wp-content/uploads/2016/04/icon.png`` icon URL.
```bash
/outgoing_webhook?override_icon_url=true
```

c. Response type is by default ``in_channel`` which send a response as root post. To override, add ``response_type=comment`` as query parameter to send response as comment to a post.
```bash
/outgoing_webhook?response_type=comment
```

Note: Overrides could be used in combination.