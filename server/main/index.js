/* eslint-disable no-console */

const express = require('express');

const saveCypressReport = require('./api/save_cypress_report');

require('dotenv').config();

const app = express();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
const port = 3000;

/**
 * @body {Object} report - Cypress test report
 * @body {String} branch - release branch, e.g. "master"
 * @body {String} build - Jenkins job build number
 */
app.post('/save_report', saveCypressReport);

app.listen(port, () => console.log(`Server app listening at http://localhost:${port}`));
