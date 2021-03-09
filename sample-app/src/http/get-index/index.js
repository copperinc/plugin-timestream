let arc = require('@architect/functions');
let aws = require('aws-sdk');

async function getIndex () {
    let tsWrite = new aws.TimestreamWrite();
    let writeResult = await tsWrite.writeRecords({
        DatabaseName: 'plugin-timestream-demo',
        TableName: 'test-table',
        Records: [ {
            MeasureName: 'temperature',
            MeasureValue: '9',
            MeasureValueType: 'DOUBLE',
            Dimensions: [ {
                Name: 'city',
                Value: 'Toronto'
            } ]
        } ],
        CommonAttributes: { Time: String(new Date().valueOf()), TimeUnit: 'MILLISECONDS' }
    }).promise();
    return {
        headers: {
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
            'content-type': 'text/html; charset=utf8'
        },
        body: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Architect w/ IoT Rules Macro Example</title>
      <link rel="stylesheet" href="${arc.static('app.css')}">
    </head>
    <body>
    <h1>Hi there</h1>
    <p>Timestream demo. Each time we hit this page, we add another record to timestream.</p>
    <h3>The list:</h3>
    <pre><code>
    ${JSON.stringify(writeResult, null, 2)}
    </code></pre>
    </body>
    </html>`
    };
}

exports.handler = arc.http.async(getIndex);
