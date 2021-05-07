const plugin = require('../');
const { join } = require('path');
const fs = require('fs-extra');
const inventory = require('@architect/inventory');
const sampleDir = join(__dirname, '..', 'sample-app');
const appDir = join(__dirname, 'tmp');
const originalCwd = process.cwd();

const baseCfn = {
    Resources: {
        Role: {
            Properties: {
                Policies: []
            }
        }
    }
};

describe('plugin packaging function', () => {
    let origInv = {};
    let arc = {};
    let origArc = {};
    beforeAll(async () => {
        // Set up integration test directory as a copy of sample app
        const appPluginDir = join(appDir, 'node_modules', '@copper', 'plugin-timestream');
        await fs.mkdirp(appPluginDir);
        await fs.copy(join(sampleDir, 'app.arc'), join(appDir, 'app.arc'));
        await fs.copy(join(__dirname, '..', 'index.js'), join(appPluginDir, 'index.js'));
        process.chdir(appDir);
        origInv = await inventory({});
        origArc = origInv.inv._project.arc;
    });
    afterAll(async () => {
        process.chdir(originalCwd);
        await fs.remove(appDir);
    });
    beforeEach(() => {
        arc = origArc;
    });
    describe('when not present in project', () => {
        it('should not modify the CloudFormation JSON', () => {
            const cfn = {};
            const app = { ...arc };
            delete app.timestream;
            const output = plugin.package({ arc: app, cloudformation: cfn });
            expect(JSON.stringify(output)).toBe('{}');
        });
    });
    describe('when present in project', () => {
        it('should create a TimeStream Database', () => {
            const cloudformation = { ...baseCfn };
            const output = plugin.package({ arc, cloudformation });
            expect(output.Resources.PluginTimestreamDemoTimestreamDB).toBeDefined();
            expect(output.Resources.PluginTimestreamDemoTimestreamDB.Properties.DatabaseName).toEqual(arc.app[0]);
        });
        it('should modify the arc role to allow for timestream actions', () => {
            const cloudformation = { ...baseCfn };
            const output = plugin.package({ arc, cloudformation });
            const policy = output.Resources.Role.Properties.Policies.find((p) => p.PolicyName === 'ArcTimestreamPolicy');
            expect(policy).toBeDefined();
            const statement = policy.PolicyDocument.Statement[0];
            expect(statement.Effect).toEqual('Allow');
            expect(statement.Action[0]).toEqual('timestream:*');
        });
        it('should create a timestream table for each table defined in the arc file (simple string definition)', () => {
            const cloudformation = { ...baseCfn };
            const output = plugin.package({ arc, cloudformation });
            const table = output.Resources.SimpleTable;
            expect(table).toBeDefined();
            expect(table.Properties.DatabaseName).toEqual(arc.app[0]);
            expect(table.Properties.TableName).toEqual('simple-table');
            expect(table.Properties.RetentionProperties.MemoryStoreRetentionPeriodInHours).toEqual('1');
            expect(table.Properties.RetentionProperties.MagneticStoreRetentionPeriodInDays).toEqual('1');
        });
        it('should create a timestream table for each table defined in the arc file (complex object definition)', () => {
            const cloudformation = { ...baseCfn };
            const output = plugin.package({ arc, cloudformation });
            const table = output.Resources.ComplexTable;
            expect(table).toBeDefined();
            expect(table.Properties.DatabaseName).toEqual(arc.app[0]);
            expect(table.Properties.TableName).toEqual('complex-table');
            expect(table.Properties.RetentionProperties.MemoryStoreRetentionPeriodInHours).toEqual('42');
            expect(table.Properties.RetentionProperties.MagneticStoreRetentionPeriodInDays).toEqual('27');
        });
    });
});
