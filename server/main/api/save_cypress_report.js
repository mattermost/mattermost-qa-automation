const RPClient = require('reportportal-client');

module.exports = (req, res) => {
    const {
        REPORTPORTAL_ENDPOINT,
        REPORTPORTAL_LAUNCH,
        REPORTPORTAL_PROJECT,
        REPORTPORTAL_PROJECT_DESCRIPTION,
        REPORTPORTAL_TOKEN,
    } = process.env;

    const reporterOptions = {
        endpoint: REPORTPORTAL_ENDPOINT,
        token: REPORTPORTAL_TOKEN,
        project: REPORTPORTAL_PROJECT,
        description: REPORTPORTAL_PROJECT_DESCRIPTION,
    };

    // See reference: https://github.com/reportportal/client-javascript#starttestitem
    const testItemTypes = {
        SUITE: 'SUITE',
        TEST: 'TEST',
    };

    // See reference: https://github.com/reportportal/client-javascript#finishtestitem
    const testItemStatus = {
        PASSED: 'PASSED',
        FAILED: 'FAILED',
        SKIPPED: 'SKIPPED',
    };

    function getAllTests(results) {
        const tests = [];
        results.forEach((result) => {
            result.tests.forEach((test) => tests.push(test));

            if (result.suites.length > 0) {
                getAllTests(result.suites).forEach((test) => tests.push(test));
            }
        });

        return tests;
    }

    const {report, branch, build} = req.body;
    if (!report || !branch || !build) {
        res.status(404).send({error: {message: 'No request body found.'}});
        return;
    }

    const startDate = new Date(report.stats.start);
    const rpClient = new RPClient(reporterOptions);

    // Start Launch
    const launchObj = rpClient.startLaunch({
        name: `${REPORTPORTAL_LAUNCH} ${branch} branch`,
        startTime: report.stats.start,
        description: `Cypress test report with ${branch} branch, Jenkins build ${build}`,
    });

    let startTime = 0;

    // Save each Suite and Test
    report.results.forEach((suite, index) => {
        if (index === 0) {
            startTime = startDate.getTime();
        }

        const suiteData = {
            description: suite.fullFile,
            name: suite.suites[0].title,
            startTime,
            type: testItemTypes.SUITE,
        };

        const suiteObj = rpClient.startTestItem(suiteData, launchObj.tempId);

        const tests = getAllTests(suite.suites);
        tests.forEach((test) => {
            let status;
            if (test.pass) {
                status = testItemStatus.PASSED;
            } else if (test.fail) {
                status = testItemStatus.FAILED;
            } else {
                status = testItemStatus.SKIPPED;
            }

            const testData = {
                description: test.title + (test.fail ? test.err.estack : ''),
                name: test.fullTitle,
                startTime,
                type: testItemTypes.TEST,
            };

            const itemObj = rpClient.startTestItem(testData, launchObj.tempId, suiteObj.tempId);

            startTime += test.duration;
            rpClient.finishTestItem(itemObj.tempId, {
                status,
                endTime: startTime,
            });

            if (test.fail) {
                rpClient.sendLog(itemObj.tempId, {
                    level: 'INFO',
                    message: test.err.message,
                    time: startTime,
                });
            }
        });

        rpClient.finishTestItem(suiteObj.tempId, {endTime: startTime});
    });

    rpClient.finishLaunch(launchObj.tempId, {endTime: startTime});

    const response = {body: {message: 'Successfully completed saving test report.'}};

    res.status(200).send(response);
};
