let arc = require('@architect/functions');

exports.handler = async function (event) {
    console.log('Test IoT Topic Event:', event);
    let tables = await arc.tables();
    await tables.data.put({ dateval: new Date().valueOf(), ... event });
};
