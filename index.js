module.exports = {
    package: function timestreamPackage ({ cloudformation: cfn }) {
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
