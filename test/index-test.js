const plugin = require('../');

/*
 *Const { join } = require('path');
 *const inventory = require('@architect/inventory');
 *const sampleDir = join(__dirname, '..', 'sample-app');
 *const appDir = join(__dirname, 'tmp');
 *const originalCwd = process.cwd();
 */

describe('plugin packaging function', () => {
    // Const inv = {};
    const arc = {};
    beforeAll(async () => {
        // Set up integration test directory as a copy of sample app
        /*
         *Const appPluginDir = join(appDir, 'node_modules', '@copper', 'plugin-timestream');
         *await fs.mkdirp(appPluginDir);
         *await fs.copy(join(sampleDir, 'app.arc'), join(appDir, 'app.arc'));
         *await fs.copy(join(__dirname, '..', 'index.js'), join(appPluginDir, 'index.js'));
         *process.chdir(appDir);
         *inv = await inventory({});
         *arc = inv.inv._project.arc;
         */
    });
    afterAll(async () => {

        /*
         *Process.chdir(originalCwd);
         *await fs.remove(appDir);
         */
    });
    describe('when not present in project', () => {
        it('should not modify the CloudFormation JSON', () => {
            const cfn = {};
            const app = { ...arc };
            delete app.rules;
            const output = plugin.package({ arc: app, cloudformation: cfn });
            expect(JSON.stringify(output)).toBe('{}');
        });
    });
    describe('when present in project', () => {
    });
});
