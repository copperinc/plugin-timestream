const { toLogicalID } = require('@architect/utils');

module.exports = {
    package: function timestreamPackage ({ arc, cloudformation: cfn }) {
        if (arc.timestream) {
            let appname = arc.app[0];
            let dbLogicalId = `${toLogicalID(appname)}TimestreamDB`;
            cfn.Resources[dbLogicalId] = {
                Type: 'AWS::Timestream::Database',
                Properties: {
                    DatabaseName: appname // assume one timestream db per app
                }
            };
            // Let the app role do what it wants with timestream
            cfn.Resources.Role.Properties.Policies.push({
                PolicyName: 'ArcTimestreamPolicy',
                PolicyDocument: {
                    Statement: [ {
                        Effect: 'Allow',
                        Action: [ 'timestream:*' ],
                        Resource: '*' // TODO: maybe scope this down to just the created tables?
                    } ]
                }
            });
            arc.timestream.forEach(tstrm => {
                let tableName;
                let memoryRetention = '1';
                let magneticRetention = '1';
                if (typeof tstrm === 'string') {
                    // just the table name is provided, nothing more
                    tableName = tstrm;
                }
                else {
                    // options passed to customize
                    tableName = Object.keys(tstrm)[0];
                    memoryRetention = String(tstrm[tableName].MemoryStoreRetentionPeriodInHours || memoryRetention);
                    magneticRetention = String(tstrm[tableName].MagneticStoreRetentionPeriodInDays || magneticRetention);
                }
                let id = toLogicalID(tstrm);
                cfn.Resources[id] = {
                    Type: 'AWS::Timestream::Table',
                    Properties: {
                        DatabaseName: appname,
                        TableName: tableName,
                        RetentionProperties: {
                            MemoryStoreRetentionPeriodInHours: memoryRetention,
                            MagneticStoreRetentionPeriodInDays: magneticRetention
                        }
                    },
                    DependsOn: dbLogicalId
                };
            });
        }
        return cfn;
    },
    sandbox: {
        start: function timestreamSandboxServiceStart (_, callback) {
            callback();
        },
        end: function timestreamSandboxServiceEnd (_,  callback) {
            callback();
        }
    }
};
