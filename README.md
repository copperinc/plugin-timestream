# plugin-timestream

> [Architect](arc.codes) serverless framework plugin that defines AWS Timestream databases and tables

[AWS Timestream][timestream] is a time series database. This arc plugin allows
you to define a Timestream database per arc application, and as many Timestream
tables in this database as you want.

## Installation

1. Install this plugin: `npm i @copper/plugin-timestream`
2. Add the following line to the `@plugins` pragma in your Architect project manifest (usually `app.arc`):

        @plugins
        copper/plugin-timestream

## Usage

Define as many tables as you want under a `@timestream` section, optionally
nesting Timestream retention options under each table:

```
@timestream
simple-table
custom-retention-table
  MagneticStoreRetentionPeriodInDays 90
  MemoryStoreRetentionPeriodInHours 72
```

To access your defined tables at runtime from within your project's Lambda
functions, import the [`TimestreamWrite`][write] and [`TimestreamQuery`][query]
AWS SDK service objects. The methods available on these objects will require you
to provide the database and table name for your Timestream tables. The values
you should use for these are:

- Database name: the name of your arc application as defined at the top of your
    `app.arc` file.
- Table name: the name of each table as defined under the `@timestream` section
    of your `app.arc` file.

For an example, see the sample application's `get-index` code under
`./sample-app/src/http/get-index/index.js`.

### Options

The following options can be passed, nested (indented) under each table name definition in
your `app.arc` file:

|Option|Description|Example|
|---|---|---|
|`MagneticStoreRetentionPeriodInDays`|Specifies the [retention properties][retention] for magnetic storage for the table in number of days. Default is 1 day.|`MagneticStoreRetentionPeriodInDays 90`|
|`MemoryStoreRetentionPeriodInHours`|Specifies the [retention properties][retention] for memory storage for the table in number of hours. Default is 1 hour.|`MemoryStoreRetentionPeriodInHours 72`|

## Sample Application

There is a sample application located under `sample-app/`. `cd` into that
directory, `npm install` and you can run locally via `arc sandbox` or deploy to
the internet via `arc deploy`.

### Testing Locally

TODO: This plugin does not provide a local development experience at this time.
Coming soon!

### Testing the Deployed Version

The sample application (under `./sample-app`) is ready deploy to `arc deploy`:

1. `cd sample-app`
2. `npm install`
3. `arc deploy`
4. Load the deployed URL.
5. The main route of the application will both write a time series data point as
   well as query for all data points and list them out in the HTTP response. For
   details, check out the `get-index` route code under
   `./sample-app/src/http/get-index`.

# Contributing

Thanks for considering contributing to this project! Check out the
[contribution guidelines](CONTRIBUTING.md) for details.

[timestream]: https://aws.amazon.com/timestream/
[retention]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-retentionproperties
[write]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html
[query]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamQuery.html
